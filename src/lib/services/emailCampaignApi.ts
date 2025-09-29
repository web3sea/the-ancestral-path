import {
  UserEmailCampaignQueryParams,
  UserEmailCampaignResponse,
  UserEmailCampaignUploadData,
  UserEmailCampaignUploadResponse,
  DeleteEmailCampaignResponse,
  BrevoListResponse,
} from "@/@types/email-campaign";
import { handleApiError } from "@/lib/utils/errors";

export const emailCampaignApi = {
  list: async (
    params: UserEmailCampaignQueryParams
  ): Promise<UserEmailCampaignResponse> => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.search) searchParams.set("search", params.search);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const response = await fetch(
      `/api/emai-campaigns/list?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) handleApiError(response);
    return response.json();
  },

  upload: async (
    data: UserEmailCampaignUploadData
  ): Promise<UserEmailCampaignUploadResponse> => {
    // Use bulk upload for better performance
    const response = await fetch("/api/emai-campaigns/bulk-upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) handleApiError(response);
    return response.json();
  },

  delete: async (id: string): Promise<DeleteEmailCampaignResponse> => {
    const response = await fetch("/api/emai-campaigns/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });

    if (!response.ok) handleApiError(response);
    return response.json();
  },

  getBrevoLists: async (): Promise<BrevoListResponse> => {
    const response = await fetch("/api/emai-campaigns/brevo-list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) handleApiError(response);
    return response.json();
  },
  syncList: async (listId: string) => {
    const response = await fetch("/api/emai-campaigns/sync-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ list_id: listId }),
    });
    if (!response.ok) handleApiError(response);
    return response.json();
  },
};
