"use client";

import React, { useState } from "react";
import type { PMTask, PMTaskStatus } from "@/types/pm-types";
import { usePMTasks } from "@/context/PMTasksContext";
import { X, Plus, CalendarDays, User as UserIcon, AlignLeft, Tag, Link2, Layers } from "lucide-react";

interface Props {
    existingTasks: PMTask[];
    onSave: (task: PMTask) => void;
    onClose: () => void;
}

const DIVISIONS = ["ops", "Marketing", "Events", "Executive"];
const STATUSES: PMTaskStatus[] = ["To do", "On going", "Done", "Pending", "Not yet"];

const AddTaskModal: React.FC<Props> = ({ existingTasks, onSave, onClose }) => {
    const { users } = usePMTasks();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [division, setDivision] = useState(DIVISIONS[0]);
    const [assigneeId, setAssigneeId] = useState("");
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
    const [dueDate, setDueDate] = useState(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    );
    const [status, setStatus] = useState<PMTaskStatus>("To do");
    const [dependencies, setDependencies] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!title.trim()) newErrors.title = "Task title is required";
        if (!startDate) newErrors.startDate = "Start date is required";
        if (!dueDate) newErrors.dueDate = "Due date is required";
        if (startDate && dueDate && new Date(startDate) > new Date(dueDate)) {
            newErrors.dueDate = "Due date must be after start date";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const newTask: PMTask = {
            id: `tsk_${Date.now()}`,
            title: title.trim(),
            description: description.trim() || undefined,
            status,
            assigneeId,
            division,
            progressPercentage: 0,
            startDate,
            dueDate,
            dependencies,
        };
        onSave(newTask);
    };

    const toggleDependency = (taskId: string) => {
        setDependencies((prev) =>
            prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Plus size={18} className="text-blue-500" />
                            Create New Task
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Only Managers & Chiefs can create new tasks
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                            <Tag size={12} />
                            Task Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Draft Partnership MoU"
                            className={`w-full px-3 py-2 text-sm rounded-lg border ${errors.title ? "border-red-400" : "border-slate-200 dark:border-slate-700"} bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                        />
                        {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                            <AlignLeft size={12} />
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the task objectives and deliverables..."
                            rows={3}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                        />
                    </div>

                    {/* Division + Status row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                <Layers size={12} />
                                Division
                            </label>
                            <select
                                value={division}
                                onChange={(e) => setDivision(e.target.value)}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            >
                                {DIVISIONS.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                <Tag size={12} />
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as PMTaskStatus)}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            >
                                {STATUSES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Assignee */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                            <UserIcon size={12} />
                            Assignee
                        </label>
                        <select
                            value={assigneeId}
                            onChange={(e) => setAssigneeId(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                            <option value="">-- Select Member --</option>
                            {users.map((u: any) => (
                                <option key={u.id} value={u.id}>
                                    {u.name} — {u.role} ({u.currentDivision})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dates row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                <CalendarDays size={12} />
                                Start Date <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className={`w-full px-3 py-2 text-sm rounded-lg border ${errors.startDate ? "border-red-400" : "border-slate-200 dark:border-slate-700"} bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                            />
                            {errors.startDate && <p className="text-xs text-red-400 mt-1">{errors.startDate}</p>}
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                <CalendarDays size={12} />
                                Due Date <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className={`w-full px-3 py-2 text-sm rounded-lg border ${errors.dueDate ? "border-red-400" : "border-slate-200 dark:border-slate-700"} bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                            />
                            {errors.dueDate && <p className="text-xs text-red-400 mt-1">{errors.dueDate}</p>}
                        </div>
                    </div>

                    {/* Dependencies */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                            <Link2 size={12} />
                            Dependencies
                        </label>
                        <p className="text-[11px] text-slate-400 mb-2">
                            Select tasks that must be completed before this one can start.
                        </p>
                        <div className="max-h-32 overflow-y-auto space-y-1 border border-slate-200 dark:border-slate-700 rounded-lg p-2 bg-slate-50 dark:bg-slate-800/50">
                            {existingTasks.length === 0 ? (
                                <p className="text-xs text-slate-400 italic text-center py-2">
                                    No existing tasks to depend on
                                </p>
                            ) : (
                                existingTasks.map((t) => (
                                    <label
                                        key={t.id}
                                        className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={dependencies.includes(t.id)}
                                            onChange={() => toggleDependency(t.id)}
                                            className="rounded border-slate-300 dark:border-slate-600 text-blue-500 focus:ring-blue-500"
                                        />
                                        <span className="text-xs text-slate-700 dark:text-slate-300 truncate">
                                            {t.title}
                                        </span>
                                        <span className="text-[10px] text-slate-400 ml-auto shrink-0">
                                            {t.status}
                                        </span>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="px-5 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors shadow-sm shadow-blue-500/25 flex items-center gap-1.5"
                    >
                        <Plus size={14} />
                        Create Task
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTaskModal;
