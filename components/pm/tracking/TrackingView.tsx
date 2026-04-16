"use client";

import React, { useState } from "react";
import { usePMTasks } from "@/context/PMTasksContext";
import { usePMRole } from "@/hooks/usePMRole";
import EvaluationBuilder from "./EvaluationBuilder";
import FillEvaluationForm from "./FillEvaluationForm";
import EvalResponsesViewer from "./EvalResponsesViewer";
import { BarChart3, CheckCircle2, Clock, AlertCircle, Circle, Filter, ClipboardList, PenTool, BarChart2 } from "lucide-react";
import type { PMTaskStatus } from "@/types/pm-types";

interface Props { user?: any; }

const STATUS_CONFIG: Record<PMTaskStatus, { label: string; color: string; bg: string; dot: string; icon: React.ReactNode }> = {
    "Done":     { label: "Done",     color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", dot: "bg-emerald-500", icon: <CheckCircle2 size={13} /> },
    "On going": { label: "On Going", color: "text-blue-600 dark:text-blue-400",       bg: "bg-blue-50 dark:bg-blue-500/10",       dot: "bg-blue-500",    icon: <Clock size={13} /> },
    "Pending":  { label: "Pending",  color: "text-amber-600 dark:text-amber-400",     bg: "bg-amber-50 dark:bg-amber-500/10",     dot: "bg-amber-500",   icon: <AlertCircle size={13} /> },
    "To do":    { label: "To Do",    color: "text-slate-600 dark:text-slate-400",     bg: "bg-slate-100 dark:bg-slate-700/40",    dot: "bg-slate-400",   icon: <Circle size={13} /> },
    "Not yet":  { label: "Not Yet",  color: "text-slate-500 dark:text-slate-500",     bg: "bg-slate-100 dark:bg-slate-700/30",    dot: "bg-slate-300",   icon: <Circle size={13} /> },
};

const FILTERS: { label: string; value: PMTaskStatus | "all" }[] = [
    { label: "All",      value: "all" },
    { label: "On Going", value: "On going" },
    { label: "To Do",    value: "To do" },
    { label: "Pending",  value: "Pending" },
    { label: "Done",     value: "Done" },
    { label: "Not Yet",  value: "Not yet" },
];

const TrackingView: React.FC<Props> = ({ user }) => {
    const { tasks, users } = usePMTasks();
    const pmRole    = user?.membershipRole === "head" ? "Chief" : user?.membershipRole === "manager" ? "Manager" : "Associate";
    const authToEdit = usePMRole(pmRole).canEditAll || usePMRole(pmRole).canEditSubdivision;

    const [filter,    setFilter]    = useState<PMTaskStatus | "all">("all");
    const [activeTab, setActiveTab] = useState<"overview" | "forms" | "responses" | "my_forms">(authToEdit ? "overview" : "my_forms");

    const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
    const total    = tasks.length;
    const done     = tasks.filter((t) => t.status === "Done").length;
    const ongoing  = tasks.filter((t) => t.status === "On going").length;
    const pending  = tasks.filter((t) => t.status === "Pending").length;
    const todo     = tasks.filter((t) => t.status === "To do" || t.status === "Not yet").length;
    const rate     = total > 0 ? Math.round((done / total) * 100) : 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* ── Header + Tabs ── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <BarChart3 size={20} className="text-blue-500" />
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tracking System</h1>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {authToEdit ? "Monitor task progress and manage evaluation forms" : "View tasks and submit your forms"}
                    </p>
                </div>

                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto hide-scrollbar">
                    {authToEdit && (
                        <>
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === "overview" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab("forms")}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === "forms" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                            >
                                <ClipboardList size={15} /> Build Forms
                            </button>
                            <button
                                onClick={() => setActiveTab("responses")}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === "responses" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                            >
                                <BarChart2 size={15} /> Responses
                            </button>
                        </>
                    )}
                    {!authToEdit && (
                        <button
                            onClick={() => setActiveTab("my_forms")}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === "my_forms" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                        >
                            <PenTool size={15} /> My Forms
                        </button>
                    )}
                </div>
            </div>

            {/* ── Overview tab ── */}
            {(authToEdit ? activeTab === "overview" : true) && (
                <>
                    {/* Summary cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: "Completion Rate", value: `${rate}%`, sub: `${done} of ${total} tasks`, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                            { label: "On Going",  value: ongoing, sub: "in progress",     color: "text-blue-600",  bg: "bg-blue-50 dark:bg-blue-500/10"   },
                            { label: "Pending",   value: pending, sub: "awaiting action", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-500/10" },
                            { label: "To Do",     value: todo,    sub: "not started",     color: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-700/30" },
                        ].map((s) => (
                            <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/40`}>
                                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{s.label}</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Overall progress bar */}
                    <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/50 p-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Overall Progress</span>
                            <span className="text-sm font-bold text-emerald-600">{rate}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
                            {(["Done", "On going", "Pending", "To do"] as PMTaskStatus[]).map((s) => {
                                const count = tasks.filter((t) => t.status === s).length;
                                const pct   = total > 0 ? (count / total) * 100 : 0;
                                return pct > 0 ? (
                                    <div key={s} className={`${STATUS_CONFIG[s].dot} h-full transition-all duration-700`} style={{ width: `${pct}%` }} title={`${s}: ${count}`} />
                                ) : null;
                            })}
                        </div>
                        <div className="flex flex-wrap gap-3 mt-3">
                            {(["Done", "On going", "Pending", "To do", "Not yet"] as PMTaskStatus[]).map((s) => {
                                const count = tasks.filter((t) => t.status === s).length;
                                const cfg   = STATUS_CONFIG[s];
                                return (
                                    <div key={s} className="flex items-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                        <span className="text-[11px] text-slate-500">{cfg.label} ({count})</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Task list */}
                    <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                        {/* Filter bar */}
                        <div className="flex items-center gap-2 p-4 border-b border-slate-100 dark:border-slate-700/50 overflow-x-auto hide-scrollbar">
                            <Filter size={14} className="text-slate-400 shrink-0" />
                            {FILTERS.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => setFilter(f.value)}
                                    className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
                                        filter === f.value
                                            ? "bg-blue-600 text-white"
                                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                                    }`}
                                >
                                    {f.label}
                                    {f.value !== "all" && (
                                        <span className="ml-1.5 opacity-70">
                                            {tasks.filter((t) => t.status === f.value).length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Rows */}
                        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {filtered.length === 0 && (
                                <p className="text-center text-slate-400 py-10 text-sm">No tasks found.</p>
                            )}
                            {filtered.map((task) => {
                                const cfg       = STATUS_CONFIG[task.status];
                                const assignee  = users.find((u: any) => u.id === task.assigneeId);
                                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "Done";
                                return (
                                    <div key={task.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                                        <span className={`shrink-0 ${cfg.color}`}>{cfg.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{task.title}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {assignee && <span className="text-[11px] text-slate-400">{assignee.name}</span>}
                                                <span className="text-[11px] text-slate-300 dark:text-slate-600">·</span>
                                                <span className={`text-[11px] ${isOverdue ? "text-red-500" : "text-slate-400"}`}>
                                                    Due {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                    {isOverdue && " · Overdue"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-28 shrink-0 hidden sm:flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${cfg.dot} transition-all duration-500`} style={{ width: `${task.progressPercentage}%` }} />
                                            </div>
                                            <span className="text-[11px] font-semibold text-slate-500 w-7 text-right">{task.progressPercentage}%</span>
                                        </div>
                                        <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.color} ${cfg.bg}`}>
                                            {cfg.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}

            {/* ── Build Forms tab (managers/chiefs only) ── */}
            {authToEdit && activeTab === "forms" && (
                <EvaluationBuilder />
            )}

            {/* ── Responses tab (managers/chiefs only) ── */}
            {authToEdit && activeTab === "responses" && (
                <EvalResponsesViewer />
            )}

            {/* ── My Forms tab (associates only) ── */}
            {!authToEdit && activeTab === "my_forms" && (
                <div className="max-w-2xl mx-auto">
                    <FillEvaluationForm />
                </div>
            )}
        </div>
    );
};

export default TrackingView;
