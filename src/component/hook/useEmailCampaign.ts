import {
  UserEmailCampaignQueryParams,
  UserEmailCampaignResponse,
  UserEmailCampaignUploadData,
  BrevoListResponse,
  BrevoCampaignResponse,
} from "@/@types/email-campaign";
import { emailCampaignApi } from "@/lib/services/emailCampaignApi";
import {
  useMutation,
  useQuery,
  UseQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";

const EMAIL_CAMPAIGN_BASE = ["email-campaign"] as const;

export const EMAIL_CAMPAIGN_KEY_FACTORY = {
  all: EMAIL_CAMPAIGN_BASE,
  lists: () => [...EMAIL_CAMPAIGN_BASE, "lists"] as const,
  list: (params: UserEmailCampaignQueryParams) =>
    [...EMAIL_CAMPAIGN_BASE, "list", params] as const,
  brevoLists: () => [...EMAIL_CAMPAIGN_BASE, "brevo-lists"] as const,
  brevoCampaigns: () => [...EMAIL_CAMPAIGN_BASE, "brevo-campaigns"] as const,
} as const;

export const useEmailCampaignList = (
  params: UserEmailCampaignQueryParams,
  options?: UseQueryOptions<UserEmailCampaignResponse>
) => {
  return useQuery({
    queryKey: EMAIL_CAMPAIGN_KEY_FACTORY.list(params),
    queryFn: () => emailCampaignApi.list(params),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 1, // 1 minute
    ...options,
  });
};

export const useBrevoLists = (options?: UseQueryOptions<BrevoListResponse>) => {
  return useQuery({
    queryKey: EMAIL_CAMPAIGN_KEY_FACTORY.brevoLists(),
    queryFn: () => emailCampaignApi.getBrevoLists(),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 1, // 1 minute
    ...options,
  });
};

export const useBrevoCampaigns = (
  options?: UseQueryOptions<BrevoCampaignResponse>
) => {
  return useQuery({
    queryKey: EMAIL_CAMPAIGN_KEY_FACTORY.brevoCampaigns(),
    queryFn: () => emailCampaignApi.getBrevoCampaigns(),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 1, // 1 minute
    ...options,
  });
};

export const useEmailCampaignUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserEmailCampaignUploadData) =>
      emailCampaignApi.upload(data),
    onSuccess: () => {
      // Invalidate all email campaign queries
      queryClient.invalidateQueries({
        queryKey: EMAIL_CAMPAIGN_KEY_FACTORY.all,
      });
    },
  });
};

export const useEmailCampaignDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => emailCampaignApi.delete(id),
    onSuccess: () => {
      // Invalidate all email campaign queries
      queryClient.invalidateQueries({
        queryKey: EMAIL_CAMPAIGN_KEY_FACTORY.all,
      });
    },
  });
};
