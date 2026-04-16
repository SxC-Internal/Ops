"use client";

import React, { useState } from "react";
import { Bell, Menu } from "lucide-react";
import type { User } from "@/types";
import NotificationPanel from "@/components/pm/notifications/NotificationPanel";
import { PM_NOTIFICATIONS } from "@/data/pm-mock-data";

interface HeaderProps {
  currentUser: User;
  openMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, openMobileMenu }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = PM_NOTIFICATIONS.filter((n) => !n.isRead).length;

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-30 sticky top-0 transition-colors duration-300">
      <div className="flex items-center md:hidden">
        <button
          onClick={openMobileMenu}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex items-center space-x-6">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">{unreadCount}</span>
              </span>
            )}
          </button>
          <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        <div className="px-3 py-1 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center transition-colors duration-300">
          {currentUser.name}
        </div>
      </div>
    </header>
  );
};

export default Header;