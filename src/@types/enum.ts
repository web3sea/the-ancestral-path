export enum Role {
  USER = "user",
  ADMIN = "admin",
  PREMIUM_USER = "premium_user",
}

export enum SubscriptionTier {
  FREE_TRIAL = "free_trial",
  TIER1 = "tier1",
  TIER2 = "tier2",
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELLED = "cancelled",
  PAUSED = "paused",
  EXPIRED = "expired",
}

export enum EmailCampaignStatus {
  FREE_TRIAL = "freetrial",
  PENDING = "pending",
  SENT = "sent",
  DONE = "done",
}

export interface PaginationOutputDto {
  /**
   * Total number of items
   * @example 100
   */
  totalItems: number;
  /**
   * Current page number
   * @example 1
   */
  currentPage: number;
  /**
   * Total number of pages
   * @example 10
   */
  totalPages: number;
  /**
   * Number of items per page
   * @example 10
   */
  itemsPerPage: number;
  /**
   * Indicates if there is a next page
   * @example true
   */
  hasNextPage: boolean;
  /**
   * Indicates if there is a previous page
   * @example false
   */
  hasPreviousPage: boolean;
}
