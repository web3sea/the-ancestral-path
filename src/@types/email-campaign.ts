import { PaginationOutputDto } from "@/@types/enum";
import { Database } from "@/@types/supabase";

export type UserEmailCampaign =
  Database["public"]["Tables"]["user_email_campaign"]["Row"];

export type UserEmailCampaignInsert =
  Database["public"]["Tables"]["user_email_campaign"]["Insert"];

export type UserEmailCampaignUpdate =
  Database["public"]["Tables"]["user_email_campaign"]["Update"];

export interface UserEmailCampaignQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "created_at" | "updated_at" | "email" | "first_name" | "last_name";
  sortOrder?: "asc" | "desc";
}

export interface UserEmailCampaignResponse {
  data: UserEmailCampaign[];
  pagination: PaginationOutputDto;
}

export interface UserEmailCampaignUploadData {
  campaign_name: string;
  brevo_list_id: string;
  brevo_campaign_id: string;
  items: UserEmailCampaignUploadItem[];
}

export interface UserEmailCampaignUploadItem {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  kajabi_id?: string | null;
  kajabi_member_id?: string | null;
}

export interface UserEmailCampaignUploadResponse {
  success: boolean;
  data: {
    uploaded_count: number;
    skipped_count: number;
    total_processed: number;
    errors: string[];
  };
}

export interface BrevoList {
  id: string;
  name: string;
}

export interface BrevoCampaign {
  id: string;
  name: string;
}

export interface BrevoListResponse {
  lists: BrevoList[];
}

export interface BrevoCampaignResponse {
  campaigns: BrevoCampaign[];
}

export interface DeleteEmailCampaignParams {
  id: string;
}

export interface DeleteEmailCampaignResponse {
  success: boolean;
  message: string;
}
