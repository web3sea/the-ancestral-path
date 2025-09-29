import { formatDate } from "@/lib/utils";
import { Label } from "@/component/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/component/ui/dialog";
import { CheckCircle, Clock, Stars } from "lucide-react";

interface ViewDetailEmailDialogProps {
  viewing: any;
  setViewing: (viewing: any) => void;
}

export default function ViewDetailEmailDialog({
  viewing,
  setViewing,
}: ViewDetailEmailDialogProps) {
  return (
    <Dialog
      open={!!viewing}
      onOpenChange={(open) => {
        if (!open) setViewing(null);
      }}
    >
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contact Details</DialogTitle>
          <DialogDescription>
            View detailed information about this campaign contact
          </DialogDescription>
        </DialogHeader>

        {viewing && (
          <div className="space-y-6">
            <Section title="Contact Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Email" value={viewing.email} />
                <Field label="First Name" value={viewing.first_name} />
                <Field label="Last Name" value={viewing.last_name} />
                <Field label="Kajabi ID" value={viewing.kajabi_id} />
                <Field
                  label="Kajabi Member ID"
                  value={viewing.kajabi_member_id}
                />
              </div>
            </Section>

            <Section title="Brevo Platform">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Brevo List ID" value={viewing.brevo_list_id} />
                <Field
                  label="Brevo Campaign ID"
                  value={viewing.brevo_campaign_id}
                />
              </div>
            </Section>

            <Section title="User Journey Timeline">
              <UserJourneyTimeline data={viewing} />
            </Section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* 🧩 Small helper components to make layout clean */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-white/5 rounded-xl p-4 bg-white/2">
      <h3 className="text-sm font-semibold text-primary-200 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="text-sm text-primary-300/80 mt-1">
        {value && value !== "" ? value : "N/A"}
      </div>
    </div>
  );
}

function UserJourneyTimeline({ data }: { data: any }) {
  const isPending =
    !data.trial_started_at && !data.upgraded_at && data.status !== "freetrial";
  const isFreeTrial = data.status === "freetrial" && !data.upgraded_at;
  const isUpgraded = !!data.upgraded_at;

  const timelineSteps = [
    {
      id: "pending",
      label: "Pending",
      icon: <Clock className="w-3 h-3" />,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      borderColor: "border-yellow-500/30",
      date: data.created_at,
      isCompleted: true,
      isActive: isPending,
    },
    {
      id: "freetrial",
      label: "Free Trial",
      icon: <Stars className="w-3 h-3" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30",
      date: data.trial_started_at,
      isCompleted: isFreeTrial || isUpgraded,
      isActive: isFreeTrial,
    },
    {
      id: "done",
      label: "Upgraded",
      icon: <CheckCircle className="w-3 h-3" />,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/30",
      date: data.upgraded_at,
      isCompleted: isUpgraded,
      isActive: isUpgraded,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-0.5"></div>

        {timelineSteps.map((step) => (
          <div key={step.id} className="relative flex items-center space-x-3">
            <div
              className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 flex-shrink-0 ${
                step.isActive
                  ? `${step.bgColor} ${step.borderColor} ${step.color}`
                  : step.isCompleted
                  ? `${step.bgColor} ${step.borderColor} ${step.color}`
                  : "bg-white/5 border-white/20 text-white/40"
              }`}
            >
              {step.isActive || step.isCompleted ? (
                step.icon
              ) : (
                <Clock className="w-3 h-3" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h4
                    className={`text-sm font-medium ${
                      step.isActive
                        ? "text-white font-semibold"
                        : step.isCompleted
                        ? "text-white"
                        : "text-white/60"
                    }`}
                  >
                    {step.label}
                  </h4>
                  {step.isActive && (
                    <span className="text-xs text-blue-300">(Current)</span>
                  )}
                </div>
                {step.date && (
                  <span className="text-xs text-white/60">
                    {formatDate(step.date)}
                  </span>
                )}
              </div>

              {/* Additional info for each step */}
              {step.id === "freetrial" && data.meta?.refer_code && (
                <div className="mt-1 text-xs text-blue-300/80">
                  <code className="bg-blue-500/20 px-1 rounded text-xs">
                    {data.meta.refer_code}
                  </code>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
