"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Briefcase,
  Image as ImageIcon,
  Wrench,
  Milestone,
  Layers,
  Info,
  Settings,
  Mail,
  LogOut,
  Menu,
  X,
  Sliders,
  Award,
  Home,
} from "lucide-react";

interface AdminSidebarProps {
  userEmail?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
}

interface NavGroup {
  groupLabel: string;
  items: NavItem[];
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const navGroups: NavGroup[] = [
    {
      groupLabel: "Overview",
      items: [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      groupLabel: "Pages",
      items: [
        { label: "Home", href: "/admin/home", icon: Home },
        { label: "About Studio", href: "/admin/about", icon: Info },
        { label: "Services", href: "/admin/services", icon: Wrench },
        { label: "Projects", href: "/admin/projects", icon: Briefcase },
        { label: "Process", href: "/admin/process", icon: Milestone },
        { label: "Studio", href: "/admin/studio", icon: ImageIcon },
        { label: "Hero Banner", href: "/admin/hero", icon: Sliders },
        { label: "Inquiries", href: "/admin/inquiries", icon: Mail },
      ],
    },
    {
      groupLabel: "Content",
      items: [
        { label: "Brand Pillars", href: "/admin/pillars", icon: Award },
        { label: "Materials", href: "/admin/materials", icon: Layers },
      ],
    },
    {
      groupLabel: "Global",
      items: [
        { label: "Site Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Use window.location to force full reload and trigger middleware redirect
    window.location.href = "/admin/login";
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="md:hidden w-full bg-milan-primary border-b border-milan-border px-6 py-3 flex items-center justify-between z-40 sticky top-0">
        <Link href="/admin/dashboard" className="flex items-center">
          <Image
            src="/Logo/Logo-no-bg.png"
            alt="MILAN INTERIO"
            width={120}
            height={68}
            className="h-8 w-auto object-contain"
          />
        </Link>
        <button
          onClick={toggleSidebar}
          className="text-milan-ivory hover:text-milan-gold focus:outline-none cursor-pointer"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="md:hidden fixed inset-0 bg-black/60 z-30 transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-[61px] md:top-0 left-0 h-[calc(100vh-61px)] md:h-screen w-64 bg-milan-primary border-r border-milan-border flex flex-col justify-between py-3 z-30 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col w-full flex-1 min-h-0 overflow-hidden">
          {/* Logo - Desktop only */}
          <div className="hidden md:flex justify-center pb-3 border-b border-milan-border mb-3 w-full">
            <Link href="/" className="inline-block group focus:outline-none">
              <Image
                src="/Logo/Logo.png"
                alt="MILAN INTERIO"
                width={140}
                height={78}
                className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Navigation Links — Grouped */}
          <nav className="space-y-0.5 flex-1 overflow-y-auto w-full px-2.5">
            {navGroups.map((group, groupIdx) => (
              <div key={group.groupLabel} className={groupIdx > 0 ? "pt-2.5" : ""}>
                <span className="text-[9px] tracking-[0.15em] text-milan-gold/60 uppercase font-mono block px-3 pb-1">
                  {group.groupLabel}
                </span>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/admin/home" && pathname.startsWith(item.href + "/")) || pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-2.5 px-3 py-2 text-[11px] tracking-wider uppercase transition-colors duration-200 ${
                        isActive
                          ? "bg-milan-emerald border border-milan-gold/30 text-milan-gold font-semibold"
                          : "text-milan-muted hover:text-milan-ivory hover:bg-milan-charcoal/50"
                      }`}
                    >
                      <Icon size={15} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="pt-3 border-t border-milan-border mt-auto space-y-2 px-2.5">
          {userEmail && (
            <div className="px-3 py-1">
              <span className="text-[8px] tracking-wider text-milan-muted uppercase font-mono block">
                Logged in as:
              </span>
              <span className="text-[11px] text-milan-ivory font-mono truncate block mt-0.5" title={userEmail}>
                {userEmail}
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2.5 px-3 py-2 text-[11px] tracking-wider uppercase text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors duration-200 cursor-pointer"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
