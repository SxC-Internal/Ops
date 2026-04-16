"use client";

import React from "react";
import type { PMNotification } from "@/types/pm-types";
import { Bell, CheckCircle, Clock, AlertTriangle, AtSign, Info } from "lucide-react";

interface Props {
    notification: PMNotification;
    currentUserId?: string;
}

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
    task_update: { icon: CheckCircle, color: "text-blue-500" },
    deadline: { icon: Clock, color: "text-amber-500" },
    approval: { icon: AlertTriangle, color: "text-rose-500" },
    mention: { icon: AtSign, color: "text-violet-500" },
    system: { icon: Info, color: "text-slate-400" },
    reminder: { icon: Bell, color: "text-amber-500" },
};

const NotificationItem: React.FC<Props> = ({ notification, currentUserId }) => {
    const config = typeConfig[notification.type] || typeConfig.system;
    const IconComp = config.icon;

    const now = Date.now();
    const ts = new Date(notification.timestamp).getTime();
    const diffHrs = Math.floor((now - ts) / (1000 * 60 * 60));
    const timeAgo = diffHrs < 1 ? "Just now" : diffHrs < 24 ? `${diffHrs}h ago` : `${Math.floor(diffHrs / 24)}d ago`;

    // For reminder-type notifications, show creator context
    const isReminder = notification.type === "reminder";
    const isOwnReminder = isReminder && currentUserId && notification.relatedUserId === currentUserId;

    return (
        <div
            className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer ${notification.isRead
                    ? "hover:bg-slate-50 dark:hover:bg-slate-800"
                    : "bg-blue-50/50 dark:bg-blue-500/5 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                }`}
        >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${notification.isRead ? "bg-slate-100 dark:bg-slate-800" : "bg-blue-500/10"
                }`}>
                <IconComp size={16} className={config.color} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium truncate ${notification.isRead ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-white"
                        }`}>
                        {notification.title}
                    </p>
                    {!notification.isRead && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{notification.message}</p>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] text-slate-400">{timeAgo}</p>
                    {isReminder && (
                        <span className="text-[9px] font-semibold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                            {isOwnReminder ? "You posted this" : `Posted by ${notification.title.split(" posted ")[0] || "Manager"}`}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationItem;
