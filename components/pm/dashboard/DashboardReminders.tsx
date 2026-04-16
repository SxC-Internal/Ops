"use client";

import React, { useState } from 'react';
import { Bell, AlertTriangle, Info, Video, Plus, Trash2, X, Send, Link, ExternalLink } from 'lucide-react';

export interface DashboardReminder {
    id: string;
    type: 'warning' | 'info' | 'meeting';
    title: string;
    message: string;
    link?: string;           // optional URL / resource
    createdBy: string;
    createdById: string;
    createdAt: string;
}

interface Props {
    reminders: DashboardReminder[];
    canManage: boolean;
    currentUserId: string;
    currentUserName: string;
    onAddReminder: (reminder: DashboardReminder) => void;
    onDeleteReminder: (id: string) => void;
}

const typeConfig = {
    warning: { icon: AlertTriangle, label: "Warning", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-100 dark:border-amber-500/20", iconColor: "text-amber-600 dark:text-amber-500", titleColor: "text-amber-900 dark:text-amber-400", textColor: "text-amber-700 dark:text-amber-500/80", badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400", linkColor: "text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200" },
    info: { icon: Info, label: "Info", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-100 dark:border-blue-500/20", iconColor: "text-blue-600 dark:text-blue-500", titleColor: "text-blue-900 dark:text-blue-400", textColor: "text-blue-700 dark:text-blue-500/80", badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-400", linkColor: "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200" },
    meeting: { icon: Video, label: "Meeting", bg: "bg-violet-50 dark:bg-violet-500/10", border: "border-violet-100 dark:border-violet-500/20", iconColor: "text-violet-600 dark:text-violet-500", titleColor: "text-violet-900 dark:text-violet-400", textColor: "text-violet-700 dark:text-violet-500/80", badgeColor: "bg-violet-500/15 text-violet-600 dark:text-violet-400", linkColor: "text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-200" },
};

const DashboardReminders: React.FC<Props> = ({ reminders, canManage, currentUserId, currentUserName, onAddReminder, onDeleteReminder }) => {
    const [showForm, setShowForm] = useState(false);
    const [newType, setNewType] = useState<'warning' | 'info' | 'meeting'>('info');
    const [newTitle, setNewTitle] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [newLink, setNewLink] = useState('');

    const handleSubmit = () => {
        if (!newTitle.trim()) return;
        onAddReminder({
            id: `rem_${Date.now()}`,
            type: newType,
            title: newTitle.trim(),
            message: newMessage.trim(),
            link: newLink.trim() || undefined,
            createdBy: currentUserName,
            createdById: currentUserId,
            createdAt: new Date().toISOString(),
        });
        setNewTitle('');
        setNewMessage('');
        setNewLink('');
        setShowForm(false);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Bell size={18} className="text-amber-500" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Reminder</h3>
                    <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-full">
                        {reminders.length}
                    </span>
                </div>
                {canManage && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors"
                    >
                        {showForm ? <X size={14} /> : <Plus size={14} />}
                        {showForm ? "Cancel" : "Add"}
                    </button>
                )}
            </div>

            {/* Add form */}
            {showForm && canManage && (
                <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600 space-y-3">
                    {/* Type selector */}
                    <div className="flex gap-2">
                        {(['warning', 'info', 'meeting'] as const).map((t) => {
                            const cfg = typeConfig[t];
                            return (
                                <button
                                    key={t}
                                    onClick={() => setNewType(t)}
                                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${newType === t
                                        ? `${cfg.badgeColor} border-current`
                                        : 'bg-white dark:bg-slate-700 text-slate-500 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    {cfg.label}
                                </button>
                            );
                        })}
                    </div>
                    <input
                        type="text"
                        placeholder="Reminder title..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full text-sm px-3 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                    <input
                        type="text"
                        placeholder="Details (optional)..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="w-full text-sm px-3 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                    {/* Link input */}
                    <div className="flex items-center gap-2">
                        <Link size={14} className="text-slate-400 shrink-0" />
                        <input
                            type="url"
                            placeholder="Attach a link or resource URL (optional)..."
                            value={newLink}
                            onChange={(e) => setNewLink(e.target.value)}
                            className="w-full text-sm px-3 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={!newTitle.trim()}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                        <Send size={12} />
                        Post Reminder
                    </button>
                </div>
            )}

            {/* Reminders list */}
            <div className="space-y-3">
                {reminders.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-3">No reminders yet</p>
                ) : reminders.map((rem) => {
                    const cfg = typeConfig[rem.type] ?? typeConfig.info;
                    const IconComp = cfg.icon;
                    const isOwnReminder = rem.createdById === currentUserId;
                    const authorLabel = isOwnReminder ? "You" : rem.createdBy;

                    return (
                        <div key={rem.id} className={`group flex items-start gap-3 p-3 ${cfg.bg} rounded-lg border ${cfg.border} relative`}>
                            <IconComp size={16} className={`${cfg.iconColor} mt-0.5 shrink-0`} />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className={`text-sm font-medium ${cfg.titleColor}`}>{rem.title}</p>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${cfg.badgeColor}`}>
                                        {cfg.label}
                                    </span>
                                </div>
                                {rem.message && (
                                    <p className={`text-xs ${cfg.textColor} mt-1`}>{rem.message}</p>
                                )}
                                {/* Attached link */}
                                {rem.link && (
                                    <a
                                        href={rem.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className={`mt-1.5 inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-2 transition-colors ${cfg.linkColor}`}
                                    >
                                        <ExternalLink size={11} />
                                        Open Resource
                                    </a>
                                )}
                                <p className="text-[10px] text-slate-400 mt-1.5">
                                    {isOwnReminder ? "You posted this" : `Posted by ${authorLabel}`}
                                    {" · "}
                                    {new Date(rem.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </p>
                            </div>
                            {canManage && (
                                <button
                                    onClick={() => onDeleteReminder(rem.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-rose-500 p-1 rounded"
                                    title="Delete reminder"
                                >
                                    <Trash2 size={13} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DashboardReminders;
