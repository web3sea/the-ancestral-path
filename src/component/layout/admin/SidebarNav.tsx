"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clapperboard, Mail } from "lucide-react";

export default function SidebarNav() {
  const pathname = usePathname();

  const items = [
    {
      href: "/admin/abj-recordings",
      label: "ABJ Recordings",
      icon: <Clapperboard size={18} />,
    },
    {
      href: "/admin/email-campaigns",
      label: "Email Campaigns",
      icon: <Mail size={18} />,
    },
  ];

  return (
    <nav className="p-3 space-y-1">
      {items.map((item) => {
        const isActive = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors " +
              (isActive
                ? "bg-white/10 text-primary-300"
                : "hover:bg-white/5 text-primary-300/90")
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
