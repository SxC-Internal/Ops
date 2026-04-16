"use client";

import React from "react";
import { PM_NOTIFICATIONS } from "@/data/pm-mock-data";
import type { PMNotification } from "@/types/pm-types";
import NotificationItem from "./NotificationItem";
import { Bell, Settings } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    extraNotifications?: PMNotification[];
    currentUserId?: string;
}

const NotificationPanel: React.FC<Props> = ({ isOpen, onClose, extraNotifications = [], currentUserId }) => {
    if (!isOpen) return null;

    // Merge extra notifications (from reminders) with static ones, sorted newest first
    const allNotifications = [...extraNotifications, ...PM_NOTIFICATIONS].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const unreadCount = allNotifications.filter((n) => !n.isRead).length;

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div className="fixed top-16 right-8 w-96 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <Bell size={18} className="text-blue-500" />
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="text-[10px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                        <Settings size={16} />
                    </button>
                </div>

                {/* List */}
                <div className="max-h-96 overflow-y-auto p-2 space-y-0.5">
                    {allNotifications.map((n) => (
                        <NotificationItem
                            key={n.id}
                            notification={n}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-center">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        {allNotifications.length} notification{allNotifications.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>
        </>
    );
};

export default NotificationPanel;
