import { getAppConfig } from "@/lib/config/env";

const BREVO_API_KEY = getAppConfig().brevo.apiKey;

function getHeaders() {
  return {
    "Content-Type": "application/json",
    "api-key": BREVO_API_KEY as string,
  } as Record<string, string>;
}

export async function brevoAddEmailsToList(listId: string, emails: string[]) {
  if (!BREVO_API_KEY || !listId || !emails?.length) return;
  const res = await fetch(
    `https://api.brevo.com/v3/contacts/lists/${listId}/contacts/add`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ emails }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo add emails failed: ${text}`);
  }
}

export async function brevoAddEmailToList(listId: string, email: string) {
  return brevoAddEmailsToList(listId, [email]);
}

export async function brevoRemoveEmailsFromList(
  listId: string,
  emails: string[]
) {
  if (!BREVO_API_KEY || !listId || !emails?.length) return;
  await fetch(
    `https://api.brevo.com/v3/contacts/lists/${listId}/contacts/remove`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ emails }),
    }
  );
}

export async function brevoRemoveEmailFromList(listId: string, email: string) {
  return brevoRemoveEmailsFromList(listId, [email]);
}

export async function brevoGetContactsFromList(listId: string, limit = 500) {
  const capped = Math.min(500, Math.max(1, limit));
  const res = await fetch(
    `https://api.brevo.com/v3/contacts/lists/${listId}/contacts?limit=${capped}`,
    { headers: getHeaders() }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo get contacts failed: ${text}`);
  }
  const data = await res.json();
  return (data?.contacts as any[]) || [];
}

export async function brevoImportContactsToList(
  listId: string,
  contacts: Array<{
    email: string;
    first_name?: string | null;
    last_name?: string | null;
    kajabi_id?: string | null;
    kajabi_member_id?: string | null;
  }>
) {
  if (!BREVO_API_KEY || !listId || !contacts?.length)
    return { processed: 0, errors: ["No contacts"] };
  const jsonBody = contacts.map((c) => ({
    email: c.email,
    attributes: {
      FIRSTNAME: c.first_name || "",
      LASTNAME: c.last_name || "",
      KAJABI_ID: c.kajabi_id || "",
      KAJABI_MEMBER_ID: c.kajabi_member_id || "",
    },
  }));
  const res = await fetch("https://api.brevo.com/v3/contacts/import", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": BREVO_API_KEY as string,
    },
    body: JSON.stringify({
      listIds: [parseInt(listId)],
      updateExistingContacts: true,
      emptyContactsAttributes: false,
      jsonBody,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    return { processed: 0, errors: [text || "Brevo import failed"] };
  }
  return { processed: contacts.length, errors: [] as string[] };
}

export async function brevoMoveEmailBetweenLists(
  email: string,
  fromListId?: string,
  toListId?: string
) {
  if (fromListId) {
    try {
      await brevoRemoveEmailFromList(fromListId, email);
    } catch {}
  }
  if (toListId) {
    await brevoAddEmailToList(toListId, email);
  }
}

export async function brevoRemoveEmailFromListIfExists(
  listId?: string,
  email?: string
) {
  if (!listId || !email) return;
  try {
    await brevoRemoveEmailFromList(listId, email);
  } catch {}
}
