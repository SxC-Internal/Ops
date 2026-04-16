"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { PM_WORKFLOWS, PM_USERS, PM_DASHBOARD_STATS } from "@/data/pm-mock-data";
import { usePMTasks } from "@/context/PMTasksContext";
import type { PMNotification, PMOKR } from "@/types/pm-types";
import ProgramStatusCards from "./ProgramStatusCards";
import DivisionProgress from "./DivisionProgress";
import DeadlinesReminders from "./DeadlinesReminders";
import ActiveCounters from "./ActiveCounters";
import WorkflowPIC from "./WorkflowPIC";
import OKRProgress from "./OKRProgress";
import DashboardReminders from "./DashboardReminders";
import type { DashboardReminder } from "./DashboardReminders";
import QuickLinks from "./QuickLinks";
import type { QuickLinkItem } from "./QuickLinks";
import MyAssignedTasks from "./MyAssignedTasks";
import { usePMRole } from "@/hooks/usePMRole";
import { Sparkles, TrendingUp, CheckCircle2, ClipboardList, ArrowRight } from "lucide-react";

import { View } from "@/types";

interface Props {
    user?: any;
    navigate?: (view: View) => void;
}

// Seed data (these replace the old hardcoded items)
const INITIAL_REMINDERS: DashboardReminder[] = [
    {
        id: "rem_seed_1",
        type: "warning",
        title: "Update Your Progress!",
        message: "All Ops and Event members must update their Kanban task progress sliders by Friday EOD.",
        createdBy: "Darrell Damareka",
        createdById: "usr_007",
        createdAt: "2026-03-10T09:00:00Z",
    },
    {
        id: "rem_seed_2",
        type: "info",
        title: "Weekly Sync Preparation",
        message: "Please attach any relevant drafts to your active tasks before the cross-division sync on Monday.",
        createdBy: "Rendy Putra Bastanta Sitepu",
        createdById: "usr_002",
        createdAt: "2026-03-09T14:00:00Z",
    },
];

const INITIAL_LINKS: QuickLinkItem[] = [
    { id: "ql_seed_1", title: "Weekly Div Sync Zoom", subtitle: "Meeting ID: 812 345 6789", type: "zoom", createdBy: "Darrell Damareka", createdById: "usr_007", createdAt: "2026-03-01T09:00:00Z" },
    { id: "ql_seed_2", title: "Batch 10 Shared Drive", subtitle: "All Master Documents", type: "drive", createdBy: "Rendy Putra Bastanta Sitepu", createdById: "usr_002", createdAt: "2026-03-05T10:30:00Z" },
    { id: "ql_seed_3", title: "Reimbursement Form", subtitle: "Finance Division", type: "link", createdBy: "Darrell Damareka", createdById: "usr_007", createdAt: "2026-03-08T15:20:00Z" },
];

const PMDashboardView: React.FC<Props> = ({ user, navigate }) => {
    const { tasks, resolvePMUserId } = usePMTasks();
    const stats = PM_DASHBOARD_STATS;

    // Role mapping
    const pmRole = user?.membershipRole === 'head' ? 'Chief' : user?.membershipRole === 'manager' ? 'Manager' : 'Associate';
    const permissions = usePMRole(pmRole);
    const isAdmin = user?.role === 'admin';
    const canManage = isAdmin || permissions.canAddTask; // admin, manager, chief can manage
    const isAssociate = !canManage;

    // User info — resolve PM assignee ID by matching the logged-in user's email
    const currentUserName = user?.name || "Unknown";
    const currentUserId = user?.id || "unknown";
    // Bridge: DB user email → PM_USERS id (e.g. "u_ops_coo" email → "usr_007")
    const currentPMUserId = useMemo(
        () => resolvePMUserId(user?.email ?? "") ?? "",
        [resolvePMUserId, user?.email]
    );

    // ── Reminders & Links state ──────────────────────────────────────────
    const [reminders, setReminders] = useState<DashboardReminder[]>([]);
    const [quickLinks, setQuickLinks] = useState<QuickLinkItem[]>([]);
    const [reminderNotifications, setReminderNotifications] = useState<PMNotification[]>([]);

    // ── OKR state — stored at department level via /api/dashboard/okrs ─────────
    const [okrs,         setOkrs]         = useState<PMOKR[]>([]);
    const [okrObjective, setOkrObjective] = useState("Achieve Quarterly Operations Goals");
    const [okrOccasion,  setOkrOccasion]  = useState("");

    const saveOKRsToDb = useCallback(async () => {
        try {
            const res = await fetch("/api/dashboard/okrs", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ okrs }),
            });
            if (!res.ok) {
                const err = await res.text();
                console.error("[OKR] Save failed:", res.status, err);
                throw new Error(`Save failed: ${res.status}`);
            }
        } catch (e) {
            console.error("[OKR] Save error:", e);
            throw e;
        }
    }, [okrs]);

    // ── Pending forms (for dashboard notification) ─────────────────────────────
    const [pendingForms, setPendingForms] = useState<number>(0);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [remRes, linkRes, okrRes] = await Promise.all([
                    fetch("/api/dashboard/reminders"),
                    fetch("/api/dashboard/links"),
                    fetch("/api/dashboard/okrs"),
                ]);
                if (remRes.ok) {
                    const rData = await remRes.json();
                    setReminders(rData.data.map((r: any) => ({ ...r, createdBy: r.createdBy.name })));
                }
                if (linkRes.ok) {
                    const lData = await linkRes.json();
                    setQuickLinks(lData.data.map((l: any) => ({ ...l, createdBy: l.createdBy.name })));
                }
                if (okrRes.ok) {
                    const oData = await okrRes.json();
                    if (Array.isArray(oData.data?.okrs) && oData.data.okrs.length > 0) {
                        setOkrs(oData.data.okrs);
                    }
                    if (oData.data?.departmentName) {
                        setOkrOccasion(oData.data.departmentName);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchDashboardData();
    }, []);

    // Fetch pending forms count (shown in banner for all users)
    useEffect(() => {
        fetch("/api/evaluations/active")
            .then((r) => r.ok ? r.json() : { data: [] })
            .then((d) => setPendingForms((d.data ?? []).length))
            .catch(() => {});
    }, []);

    const handleAddReminder = async (reminder: DashboardReminder) => {
        try {
            const res = await fetch("/api/dashboard/reminders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: reminder.type, title: reminder.title, message: reminder.message, link: reminder.link })
            });
            if (res.ok) {
                const { data } = await res.json();
                const newReminder = { ...data, createdBy: data.createdBy.name };
                setReminders((prev) => [newReminder, ...prev]);
                
                const notification: PMNotification = {
                    id: `ntf_rem_${Date.now()}`,
                    type: "reminder",
                    title: `${newReminder.createdBy} posted a reminder`,
                    message: newReminder.title,
                    timestamp: newReminder.createdAt,
                    isRead: false,
                    relatedUserId: newReminder.createdById,
                };
                setReminderNotifications((prev) => [notification, ...prev]);
            }
        } catch (e) { console.error(e); }
    };

    const handleDeleteReminder = async (id: string) => {
        try {
            const res = await fetch(`/api/dashboard/reminders/${id}`, { method: "DELETE" });
            if (res.ok) setReminders((prev) => prev.filter((r) => r.id !== id));
        } catch (e) {}
    };

    const handleAddLink = async (link: QuickLinkItem) => {
        try {
            const res = await fetch("/api/dashboard/links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: link.title, subtitle: link.subtitle, type: link.type, url: link.url, meetingId: link.meetingId })
            });
            if (res.ok) {
                const { data } = await res.json();
                setQuickLinks((prev) => [{ ...data, createdBy: data.createdBy.name }, ...prev]);
            }
        } catch (e) { console.error(e); }
    };

    const handleDeleteLink = async (id: string) => {
        try {
            const res = await fetch(`/api/dashboard/links/${id}`, { method: "DELETE" });
            if (res.ok) setQuickLinks((prev) => prev.filter((l) => l.id !== id));
        } catch (e) {}
    };

    // ── Computed metrics from tasks ──────────────────────────────────────
    const computed = useMemo(() => {
        const now = new Date();

        const statusCounts = {
            "To do": tasks.filter((t) => t.status === "To do").length,
            "On going": tasks.filter((t) => t.status === "On going").length,
            Done: tasks.filter((t) => t.status === "Done").length,
            Pending: tasks.filter((t) => t.status === "Pending").length,
            "Not yet": tasks.filter((t) => t.status === "Not yet").length,
        };

        const totalTasks = tasks.length;
        const completedTasks = statusCounts.Done;
        const overdueTasks = tasks.filter(
            (t) => t.status !== "Done" && new Date(t.dueDate) < now
        ).length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        const divisionMap = new Map<string, { totalProgress: number; count: number; completed: number }>();
        tasks.forEach((t) => {
            const existing = divisionMap.get(t.division) || { totalProgress: 0, count: 0, completed: 0 };
            existing.totalProgress += t.progressPercentage;
            existing.count += 1;
            if (t.status === "Done") existing.completed += 1;
            divisionMap.set(t.division, existing);
        });
        const divisions = Array.from(divisionMap.entries()).map(([division, data]) => ({
            division,
            avgProgress: Math.round(data.totalProgress / data.count),
            taskCount: data.count,
            completedCount: data.completed,
        }));

        const taskDeadlines = tasks.map((t) => {
            const assignee = PM_USERS.find((u) => u.id === t.assigneeId);
            return {
                id: t.id,
                title: t.title,
                dueDate: t.dueDate,
                progressPercentage: t.progressPercentage,
                division: t.division,
                assigneeName: assignee?.name || "Unassigned",
                status: t.status,
            };
        });

        return { statusCounts, totalTasks, completedTasks, overdueTasks, completionRate, divisions, taskDeadlines };
    }, [tasks]);

    const statusCards = [
        { label: "To Do", count: computed.statusCounts["To do"], color: "text-slate-500", bgColor: "bg-white dark:bg-slate-800/60" },
        { label: "On Going", count: computed.statusCounts["On going"], color: "text-blue-500", bgColor: "bg-blue-50 dark:bg-blue-500/5" },
        { label: "Pending", count: computed.statusCounts.Pending, color: "text-amber-500", bgColor: "bg-amber-50 dark:bg-amber-500/5" },
        { label: "Done", count: computed.statusCounts.Done, color: "text-emerald-500", bgColor: "bg-emerald-50 dark:bg-emerald-500/5" },
    ];



    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={20} className="text-blue-500" />
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Project Management
                    </h1>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Live metrics computed from {computed.totalTasks} tasks across {computed.divisions.length} divisions
                </p>
            </div>

            {/* Pending Forms Banner — shows for anyone with active forms to fill */}
            {pendingForms > 0 && (
                <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30 animate-in fade-in duration-500">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center shrink-0">
                            <ClipboardList size={18} className="text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-violet-900 dark:text-violet-200">
                                You have {pendingForms} pending form{pendingForms !== 1 ? "s" : ""} to fill
                            </p>
                            <p className="text-xs text-violet-600 dark:text-violet-400">
                                Go to Tracking → My Forms to complete them
                            </p>
                        </div>
                    </div>
                    {navigate && (
                        <button
                            onClick={() => navigate(View.TRACKING)}
                            className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-violet-700 dark:text-violet-300 hover:text-violet-900 dark:hover:text-violet-100 transition-colors"
                        >
                            Fill now <ArrowRight size={13} />
                        </button>
                    )}
                </div>
            )}

            {/* Task Status Cards - Show for everyone */}
            <ProgramStatusCards statuses={statusCards} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Only show active counters for managers/chiefs */}
                    {!isAssociate && (
                        <ActiveCounters
                            totalTasks={computed.totalTasks}
                            completedTasks={computed.completedTasks}
                            overdueTasks={computed.overdueTasks}
                        />
                    )}
                    
                    {isAssociate && (
                        <>
                            {/* Evaluation Notification Card */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 border border-blue-500/20">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm">
                                        <ClipboardList size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">Active Evaluation</h3>
                                        <p className="text-blue-100 text-sm">
                                            You have 1 pending motivation form to fill out for this week.
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => navigate?.(View.TRACKING)}
                                    className="px-6 py-2.5 bg-white text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-semibold transition-colors shrink-0 flex items-center gap-2 w-full sm:w-auto justify-center"
                                >
                                    Go to Tracking System <ArrowRight size={16} />
                                </button>
                            </div>
                            
                            <div className="h-80">
                                <MyAssignedTasks tasks={tasks} currentUserId={currentPMUserId} navigate={navigate} />
                            </div>
                        </>
                    )}
                    
                    <DashboardReminders
                        reminders={reminders}
                        canManage={canManage}
                        currentUserId={currentUserId}
                        currentUserName={currentUserName}
                        onAddReminder={handleAddReminder}
                        onDeleteReminder={handleDeleteReminder}
                    />
                </div>
                <div className="space-y-6">
                    <QuickLinks
                        links={quickLinks}
                        canManage={canManage}
                        currentUserId={currentUserId}
                        currentUserName={currentUserName}
                        onAddLink={handleAddLink}
                        onDeleteLink={handleDeleteLink}
                    />
                </div>
            </div>

            {/* Two-column: Division Progress + Deadlines */}
            {!isAssociate && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <DivisionProgress divisions={computed.divisions} />
                        <DeadlinesReminders deadlines={computed.taskDeadlines} />
                    </div>

                    {/* Workflow PIC */}
                    <WorkflowPIC workflows={PM_WORKFLOWS} />

                    {/* OKR Progress — editable by admins/chiefs/managers, always visible */}
                    <div className="max-w-2xl mx-auto w-full">
                            <OKRProgress
                                programName={okrObjective}
                                occasion={okrOccasion}
                                okrs={okrs}
                                tasks={tasks}
                                canEdit={canManage}
                                onOKRsChange={setOkrs}
                                onProgramNameChange={setOkrObjective}
                                onOccasionChange={setOkrOccasion}
                                onSave={saveOKRsToDb}
                            />
                        </div>

                    {/* Task Completion Rate */}
                    <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <TrendingUp size={16} className="opacity-80" />
                                    <p className="text-sm font-medium opacity-80">Task Completion Rate</p>
                                </div>
                                <p className="text-4xl font-bold mt-1">{computed.completionRate}%</p>
                                <p className="text-xs mt-1 opacity-70">
                                    {computed.completedTasks} of {computed.totalTasks} tasks completed
                                </p>
                                {computed.overdueTasks > 0 && (
                                    <p className="text-xs mt-1 text-amber-300 flex items-center gap-1">
                                        ⚠ {computed.overdueTasks} task{computed.overdueTasks !== 1 ? "s" : ""} overdue
                                    </p>
                                )}
                            </div>
                            <div className="w-20 h-20 relative">
                                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                                    <circle cx="40" cy="40" r="34" fill="none" strokeWidth="8" className="stroke-white/20" />
                                    <circle
                                        cx="40" cy="40" r="34" fill="none" strokeWidth="8" className="stroke-white"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(computed.completionRate / 100) * 213.6} 213.6`}
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center">
                                    <CheckCircle2 size={20} className="text-white/60" />
                                </span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PMDashboardView;
