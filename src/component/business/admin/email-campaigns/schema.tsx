import { z } from "zod";

export const emailCampaignItemSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .refine((email) => email.trim() !== "", {
      message: "Email is required",
    }),
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  kajabi_id: z.string().optional().nullable(),
  kajabi_member_id: z.string().optional().nullable(),
});

export const emailCampaignSchema = z.object({
  campaign_name: z.string().min(1, "Campaign name is required"),
  brevo_list_id: z.string().min(1, "Brevo list ID is required"),
  items: z.array(emailCampaignItemSchema),
});

export type EmailCampaignFormValues = z.infer<typeof emailCampaignSchema>;
