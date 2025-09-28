"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { formatDate } from "@/lib/utils";
import {
  Mail,
  Users,
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit3,
  Trash2,
  Eye,
  Search,
  RefreshCw,
  Star,
  MarsIcon,
} from "lucide-react";
import { Button } from "@/component/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/component/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/component/ui/table";
import UploadContactsDialog from "./UploadContactsDialog";
import {
  useEmailCampaignList,
  useEmailCampaignDelete,
} from "@/component/hook/useEmailCampaign";
import { emailCampaignApi } from "@/lib/services/emailCampaignApi";
import { UserEmailCampaignQueryParams } from "@/@types/email-campaign";
import ViewDetailEmailDialog from "./ViewDetailEmailDialog";

export function EmailCampaigns() {
  const [isNewUploadModalOpen, setIsNewUploadModalOpen] = useState(false);
  const [viewing, setViewing] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [syncingAll, setSyncingAll] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 2000);

    return () => clearTimeout(timer);
  }, [search]);

  const queryParams: UserEmailCampaignQueryParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: debouncedSearch.trim() || undefined,
      sortBy: "created_at",
      sortOrder: "desc",
    }),
    [currentPage, pageSize, debouncedSearch]
  );

  const {
    data: emailCampaignsData,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useEmailCampaignList(queryParams);

  const deleteMutation = useEmailCampaignDelete();

  const contacts = emailCampaignsData?.data || [];
  const pagination = emailCampaignsData?.pagination;

  const error = queryError?.message || "";

  const handleUploadComplete = useCallback(
    (result: { success: boolean; data?: any; uploadData?: any }) => {
      if (result.success) {
        refetch();
      }
    },
    [refetch]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const ok = window.confirm(
          "Delete this contact? This action cannot be undone."
        );
        if (!ok) return;

        await deleteMutation.mutateAsync(id);
        // No need to refetch - React Query will automatically refetch due to invalidation
      } catch (e) {
        console.error(e);
        alert("Failed to delete contact");
      }
    },
    [deleteMutation]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handlePageSizeChange = useCallback((value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  }, []);

  const handleSyncAllStatus = useCallback(async () => {
    try {
      setSyncingAll(true);

      const uniquePairs = new Set();
      contacts.forEach((contact) => {
        if (contact.brevo_campaign_id && contact.brevo_list_id) {
          uniquePairs.add(
            `${contact.brevo_campaign_id}-${contact.brevo_list_id}`
          );
        }
      });

      const syncPromises = Array.from(uniquePairs).map(async (pair) => {
        const [campaignId, listId] = (pair as string).split("-");
        return emailCampaignApi.syncStatus(campaignId, listId);
      });

      await Promise.all(syncPromises);
      refetch(); // Refresh the list after sync
      alert(`Synced ${uniquePairs.size} campaigns successfully!`);
    } catch (error: any) {
      console.error("Sync all status error:", error);
      alert(`Failed to sync status: ${error.message}`);
    } finally {
      setSyncingAll(false);
    }
  }, [contacts, refetch]);

  function getStatusIcon(status: string) {
    switch (status) {
      case "sent":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "scheduled":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "failed":
        return <MarsIcon className="w-4 h-4 text-red-400" />;
      case "freetrial":
        return <Star className="w-4 h-4 text-blue-300/60" />;
      default:
        return <Edit3 className="w-4 h-4 text-primary-300/60" />;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "sent":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "scheduled":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "failed":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "freetrial":
        return "bg-blue-300/20 text-blue-300 border-blue-300/30";
      default:
        return "bg-primary-300/20 text-primary-300 border-primary-300/30";
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-300 flex items-center gap-3">
            <Mail className="w-8 h-8" />
            Email Campaigns
          </h1>
          <p className="text-primary-300/60 mt-1">
            Manage your email marketing campaigns
          </p>
        </div>
        <div className="flex gap-3">
          <div className="hidden md:flex items-center gap-2">
            <Search className="w-6 h-6 text-primary-300/70" />
            <input
              className="w-64 px-4 py-2 rounded-full bg-white/5 border border-primary-300/20 text-primary-300 focus:border-primary-300/40 focus:outline-none transition-colors"
              placeholder="Search by email, first name, or last name"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <Button
            variant="ghost"
            className="gap-2 hover:bg-white/15 transition-colors"
            onClick={handleSyncAllStatus}
            disabled={syncingAll || contacts.length === 0}
          >
            {syncingAll ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Sync All Status
          </Button>
          <Button
            variant="secondary"
            className="gap-2 hover:bg-white/15 transition-colors"
            onClick={() => setIsNewUploadModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            New Upload
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/5 border border-primary-300/20 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-primary-300/20 bg-black/20">
          <h2 className="text-lg font-semibold text-primary-300">
            Uploaded Contacts
          </h2>
        </div>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1200px]">
            {loading && (
              <div className="p-4">
                <div className="h-6 w-48 bg-white/10 rounded mb-4 animate-pulse" />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 z-20 bg-black">
                        <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
                      </TableHead>
                      <TableHead>
                        <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                      </TableHead>
                      <TableHead>
                        <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                      </TableHead>
                      <TableHead>
                        <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                      </TableHead>
                      <TableHead>
                        <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                      </TableHead>
                      <TableHead>
                        <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
                      </TableHead>
                      <TableHead>
                        <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                      </TableHead>
                      <TableHead>
                        <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                      </TableHead>
                      <TableHead className="text-right">
                        <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 6 }).map((_, r) => (
                      <TableRow key={r}>
                        <TableCell className="sticky left-0 z-10 bg-black">
                          <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-28 bg-white/10 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {error && !loading && (
              <div className="p-6 text-red-400 text-sm">{error}</div>
            )}
            {!loading && !error && contacts.length === 0 && (
              <div className="p-10 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-white/5 border border-primary-300/20 flex items-center justify-center">
                  <Users className="w-7 h-7 text-primary-300/70" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-primary-300">
                  {search ? "No contacts found" : "No contacts uploaded yet"}
                </h3>
                <p className="mt-1 text-sm text-primary-300/70">
                  {search
                    ? "Try adjusting your search criteria."
                    : "Start by uploading your first contact CSV file."}
                </p>
                <div className="mt-4">
                  <Button
                    variant="secondary"
                    onClick={() => setIsNewUploadModalOpen(true)}
                  >
                    New Upload
                  </Button>
                </div>
              </div>
            )}
            {contacts.length > 0 && (
              <Table className="w-full min-w-[1200px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 z-20 bg-black w-[200px]">
                      Email
                    </TableHead>
                    <TableHead className="hidden sm:table-cell w-[120px]">
                      First Name
                    </TableHead>
                    <TableHead className="hidden sm:table-cell w-[120px]">
                      Last Name
                    </TableHead>
                    <TableHead className="hidden md:table-cell w-[100px]">
                      Kajabi ID
                    </TableHead>
                    <TableHead className="w-[150px]">Campaign</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="hidden xl:table-cell w-[120px]">
                      Sent At
                    </TableHead>
                    <TableHead className="hidden xl:table-cell w-[140px]">
                      Trial Started
                    </TableHead>
                    <TableHead className="hidden xl:table-cell w-[120px]">
                      Upgraded At
                    </TableHead>
                    <TableHead className="text-right sticky right-0 z-20 bg-black w-[120px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="sticky left-0 z-10 bg-black">
                        <div className="text-sm text-primary-300/80 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span className="truncate max-w-[150px]">
                            {contact.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm text-primary-300/80">
                          {contact.first_name || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm text-primary-300/80">
                          {contact.last_name || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm text-primary-300/80">
                          {contact.kajabi_id || contact.member_kajabi_id || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-primary-300/80 truncate max-w-[120px]">
                          {contact.campaign_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            contact.status
                          )}`}
                        >
                          {getStatusIcon(contact.status)}
                          <span className="hidden sm:inline">
                            {contact.status}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-sm text-primary-300/80">
                          <Calendar className="w-4 h-4" />
                          <span className="hidden xl:inline">
                            {contact.sent_at
                              ? formatDate(contact.sent_at)
                              : "Never"}
                          </span>
                          <span className="xl:hidden">
                            {contact.sent_at
                              ? formatDate(contact.sent_at).split(" ")[0]
                              : "Never"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="text-sm text-primary-300/80">
                          {contact.trial_started_at
                            ? formatDate(contact.trial_started_at)
                            : "Never"}
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="text-sm text-primary-300/80">
                          {contact.upgraded_at
                            ? formatDate(contact.upgraded_at)
                            : "Never"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right sticky right-0 z-10 bg-black">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewing(contact)}
                            title="View Details"
                            className="h-8 w-8"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(contact.id)}
                            title="Delete"
                            className="h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* Pagination - Always show */}
        <div className="p-4 border-t border-primary-300/20">
          <div className="flex items-center justify-between">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-primary-300/70">Show</span>
              <Select
                value={pageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-primary-300/70">per page</span>
            </div>

            {/* Pagination Info */}
            {pagination && (
              <div className="text-sm text-primary-300/70">
                Showing{" "}
                {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
                {Math.min(
                  pagination.currentPage * pagination.itemsPerPage,
                  pagination.totalItems
                )}{" "}
                of {pagination.totalItems} results
              </div>
            )}

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPreviousPage}
                >
                  Previous
                </Button>
                <span className="text-sm text-primary-300/70">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Contacts Dialog */}
      <UploadContactsDialog
        isOpen={isNewUploadModalOpen}
        onClose={() => setIsNewUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />

      {/* View Details Dialog */}
      <ViewDetailEmailDialog viewing={viewing} setViewing={setViewing} />
    </div>
  );
}

export default EmailCampaigns;
