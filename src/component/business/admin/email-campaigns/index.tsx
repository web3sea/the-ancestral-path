"use client";

import { useState, useMemo, useCallback } from "react";
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
} from "lucide-react";
import { Button } from "@/component/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/component/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/component/ui/dialog";
import { Label } from "@/component/ui/label";
import UploadContactsDialog from "./UploadContactsDialog";
import { PaginationWrapper } from "@/component/common/PaginationWrapper";
import {
  useEmailCampaignList,
  useEmailCampaignDelete,
  useBrevoLists,
  useBrevoCampaigns,
} from "@/component/hook/useEmailCampaign";
import { UserEmailCampaignQueryParams } from "@/@types/email-campaign";

export function EmailCampaigns() {
  // State management
  const [isNewUploadModalOpen, setIsNewUploadModalOpen] = useState(false);
  const [viewing, setViewing] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Query parameters
  const queryParams: UserEmailCampaignQueryParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: search.trim() || undefined,
      sortBy: "created_at",
      sortOrder: "desc",
    }),
    [currentPage, pageSize, search]
  );

  // React Query hooks
  const {
    data: emailCampaignsData,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useEmailCampaignList(queryParams);

  const { data: brevoListsData, isLoading: loadingBrevoLists } =
    useBrevoLists();

  const { data: brevoCampaignsData, isLoading: loadingBrevoCampaigns } =
    useBrevoCampaigns();

  const deleteMutation = useEmailCampaignDelete();

  // Computed values
  const contacts = emailCampaignsData?.data || [];
  const pagination = emailCampaignsData?.pagination;
  const brevoLists = brevoListsData?.lists || [];
  const brevoCampaigns = brevoCampaignsData?.campaigns || [];
  const loadingBrevoData = loadingBrevoLists || loadingBrevoCampaigns;
  const error = queryError?.message || "";

  // Event handlers
  const handleUploadComplete = useCallback(
    (result: { success: boolean; data?: any; uploadData?: any }) => {
      if (result.success) {
        // Refresh the table to show new contacts
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
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  function getStatusIcon(status: string) {
    switch (status) {
      case "sent":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "scheduled":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
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
        <div className="overflow-x-auto pb-2">
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 z-20 bg-black">
                    Email
                  </TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Kajabi ID</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="sticky left-0 z-10 bg-black">
                      <div className="text-sm text-primary-300/80 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {contact.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-primary-300/80">
                        {contact.first_name || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-primary-300/80">
                        {contact.last_name || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-primary-300/80">
                        {contact.kajabi_id || contact.member_kajabi_id || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-primary-300/80">
                        {contact.campaign_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          contact.status
                        )}`}
                      >
                        {getStatusIcon(contact.status)}
                        {contact.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-primary-300/80">
                        <Calendar className="w-4 h-4" />
                        {contact.sent_at
                          ? formatDate(contact.sent_at)
                          : "Never"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-primary-300/80">
                        {formatDate(contact.updated_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewing(contact)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(contact.id)}
                          title="Delete"
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

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-primary-300/20">
            <PaginationWrapper
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Upload Contacts Dialog */}
      <UploadContactsDialog
        isOpen={isNewUploadModalOpen}
        onClose={() => setIsNewUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
        brevoLists={brevoLists}
        brevoCampaigns={brevoCampaigns}
        loadingBrevoData={loadingBrevoData}
      />

      {/* View Details Dialog */}
      <Dialog
        open={!!viewing}
        onOpenChange={(open) => {
          if (!open) setViewing(null);
        }}
      >
        <DialogContent className="w-full max-w-7xl">
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
            <DialogDescription>
              View detailed information about this contact
            </DialogDescription>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <div className="text-sm text-primary-300/80 mt-1">
                    {viewing.email}
                  </div>
                </div>
                <div>
                  <Label>First Name</Label>
                  <div className="text-sm text-primary-300/80 mt-1">
                    {viewing.first_name || "N/A"}
                  </div>
                </div>
                <div>
                  <Label>Last Name</Label>
                  <div className="text-sm text-primary-300/80 mt-1">
                    {viewing.last_name || "N/A"}
                  </div>
                </div>
                <div>
                  <Label>Kajabi ID</Label>
                  <div className="text-sm text-primary-300/80 mt-1">
                    {viewing.kajabi_id || "N/A"}
                  </div>
                </div>
                <div>
                  <Label>Brevo List ID</Label>
                  <div className="text-sm text-primary-300/80 mt-1">
                    {viewing.brevo_list_id || "N/A"}
                  </div>
                </div>
                <div>
                  <Label>Brevo Campaign ID</Label>
                  <div className="text-sm text-primary-300/80 mt-1">
                    {viewing.brevo_campaign_id || "N/A"}
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        viewing.status
                      )}`}
                    >
                      {getStatusIcon(viewing.status)}
                      {viewing.status}
                    </span>
                  </div>
                </div>
                <div>
                  <Label>Sent At</Label>
                  <div className="text-sm text-primary-300/80 mt-1">
                    {viewing.sent_at ? formatDate(viewing.sent_at) : "Never"}
                  </div>
                </div>
                <div>
                  <Label>Created At</Label>
                  <div className="text-sm text-primary-300/80 mt-1">
                    {formatDate(viewing.created_at)}
                  </div>
                </div>
                <div>
                  <Label>Updated At</Label>
                  <div className="text-sm text-primary-300/80 mt-1">
                    {formatDate(viewing.updated_at)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EmailCampaigns;
