import {
  UserEmailCampaignQueryParams,
  UserEmailCampaignResponse,
  UserEmailCampaignUploadData,
  UserEmailCampaignUploadResponse,
  DeleteEmailCampaignResponse,
  BrevoListResponse,
  BrevoCampaignResponse,
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
    const response = await fetch("/api/emai-campaigns/upload-emails", {
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
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

  getBrevoCampaigns: async (): Promise<BrevoCampaignResponse> => {
    const response = await fetch("/api/emai-campaigns/brevo-campaigns", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) handleApiError(response);
    return response.json();
  },
};
