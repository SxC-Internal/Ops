"use client";

import React, { useState } from "react";
import { X, UserPlus, Search } from "lucide-react";
import { PM_USERS } from "@/data/pm-mock-data";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    taskTitle: string;
}

const AssignMemberModal: React.FC<Props> = ({ isOpen, onClose, taskTitle }) => {
    const [search, setSearch] = useState("");

    if (!isOpen) return null;

    const filtered = PM_USERS.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <UserPlus size={18} className="text-blue-500" />
                            Assign Member
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">for: {taskTitle}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>

                {/* Member list */}
                <div className="px-4 pb-4 max-h-60 overflow-y-auto space-y-1">
                    {filtered.map((user) => (
                        <button
                            key={user.id}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                        >
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full shrink-0" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                    <span className="text-xs font-bold text-blue-500">{user.name[0]}</span>
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                            </div>
                            <span className="ml-auto text-[10px] font-semibold text-slate-400 uppercase">{user.role}</span>
                        </button>
                    ))}
                    {filtered.length === 0 && (
                        <p className="text-sm text-slate-400 text-center py-4">No members found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssignMemberModal;
