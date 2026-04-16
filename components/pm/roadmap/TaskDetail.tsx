"use client";

import React from "react";
import type { PMTask, TaskLink, TaskAttachment } from "@/types/pm-types";
import { PM_NOTIFICATIONS } from "@/data/pm-mock-data";
import { usePMTasks } from "@/context/PMTasksContext";
import { X, Calendar, User as UserIcon, Link2, FileText, Video, Edit2, Check, Trash2, AlertTriangle, Plus, ExternalLink } from "lucide-react";
import { usePMRole } from "@/hooks/usePMRole";

interface Props {
    task: PMTask | null;
    onClose: () => void;
    pmRole?: import('@/types/pm-types').PMRole;
    currentUserId?: string;
    onDeleteTask?: (taskId: string) => void;
}

const TaskDetail: React.FC<Props> = ({ task: initialTask, onClose, pmRole = 'Associate', currentUserId = '', onDeleteTask }) => {
    const [task, setTask] = React.useState(initialTask);
    const [isEditingMeetingLink, setIsEditingMeetingLink] = React.useState(false);
    const [tempMeetingLink, setTempMeetingLink] = React.useState(task?.meetingLink || "");
    const [isEditingDesc, setIsEditingDesc] = React.useState(false);
    const [tempDesc, setTempDesc] = React.useState(task?.description || "");
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
    const [showAddLink, setShowAddLink] = React.useState(false);
    const [newLinkLabel, setNewLinkLabel] = React.useState("");
    const [newLinkUrl, setNewLinkUrl] = React.useState("");
    const { users, updateTask } = usePMTasks();
    const permissions = usePMRole(pmRole);

    React.useEffect(() => {
        setTask(initialTask);
        setTempMeetingLink(initialTask?.meetingLink || "");
        setTempDesc(initialTask?.description || "");
        setShowDeleteConfirm(false);
        setShowAddLink(false);
        setNewLinkLabel("");
        setNewLinkUrl("");
    }, [initialTask]);

    if (!task) return null;

    const authToEdit = permissions.canEditAll || permissions.canEditSubdivision;
    const isAssignee = currentUserId !== '' && currentUserId === task.assigneeId;
    const canEditLinks = authToEdit || isAssignee;

    const notifyEdit = (field: string) => {
        if (authToEdit && !isAssignee && currentUserId) {
            const editor = users.find((u: any) => u.id === currentUserId);
            PM_NOTIFICATIONS.unshift({
                id: `ntf_${Date.now()}`,
                type: 'task_update',
                title: 'Task Edited by Manager/Chief',
                message: `${editor?.name || 'Someone'} updated the ${field} of your task "${task?.title}".`,
                timestamp: new Date().toISOString(),
                isRead: false,
                relatedTaskId: task?.id,
                relatedUserId: task?.assigneeId
            });
        }
    };

    const handleSaveMeetingLink = async () => {
        const updated = { ...task, meetingLink: tempMeetingLink };
        setTask(updated);
        await updateTask(task.id, updated);
        setIsEditingMeetingLink(false);
    };

    const handleSaveDesc = async () => {
        const updated = { ...task, description: tempDesc };
        setTask(updated);
        await updateTask(task.id, updated);
        setIsEditingDesc(false);
    };

    const handleAddLink = async () => {
        if (!newLinkLabel.trim() || !newLinkUrl.trim()) return;
        const newLink: TaskLink = { label: newLinkLabel.trim(), url: newLinkUrl.trim() };
        const updated = { ...task, links: [...(task.links || []), newLink] };
        setTask(updated);
        await updateTask(task.id, updated);
        setNewLinkLabel("");
        setNewLinkUrl("");
        setShowAddLink(false);
    };

    const handleDeleteLink = async (index: number) => {
        const updatedLinks = [...(task.links || [])];
        updatedLinks.splice(index, 1);
        const updated = { ...task, links: updatedLinks };
        setTask(updated);
        await updateTask(task.id, updated);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // In a real app, we'd upload this file to a server. Here we mock it.
        const newAttachment: TaskAttachment = {
            name: file.name,
            url: URL.createObjectURL(file), // create a local preview URL
            type: file.type
        };

        setTask({ ...task, attachments: [...(task.attachments || []), newAttachment] });
        e.target.value = '';
    };

    const handleDeleteAttachment = (index: number) => {
        const updatedAttachments = [...(task.attachments || [])];
        updatedAttachments.splice(index, 1);
        setTask({ ...task, attachments: updatedAttachments });
    };

    const handleConfirmDelete = async () => {
        if (onDeleteTask) await onDeleteTask(task.id);
        onClose();
    };

    const assignee = users.find((u: any) => u.id === task.assigneeId);
    const depTasks = task.dependencies || [];

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-2xl z-40 animate-in slide-in-from-right duration-300 overflow-y-auto flex flex-col">
            <div className="p-6 flex-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-500 mb-1 block">
                            {task.division}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{task.title}</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Status badge */}
                <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${task.status === "Done" ? "bg-emerald-500/10 text-emerald-500" :
                            task.status === "On going" ? "bg-blue-500/10 text-blue-500" :
                                task.status === "Pending" ? "bg-amber-500/10 text-amber-500" :
                                    "bg-slate-500/10 text-slate-500"
                        }`}>
                        {task.status}
                    </span>
                    <span className="text-xs text-slate-500">{task.progressPercentage}% complete</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-6">
                    <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{ width: `${task.progressPercentage}%` }}
                    />
                </div>

                {/* Description */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <FileText size={14} className="text-slate-400" />
                            <span className="text-xs font-semibold uppercase text-slate-400">Description</span>
                        </div>
                        {authToEdit && (
                            <button
                                onClick={() => {
                                    if (isEditingDesc) {
                                        handleSaveDesc();
                                    } else {
                                        setIsEditingDesc(true);
                                    }
                                }}
                                className="text-blue-500 hover:text-blue-600 p-1"
                            >
                                {isEditingDesc ? <Check size={14} /> : <Edit2 size={14} />}
                            </button>
                        )}
                    </div>
                    {isEditingDesc ? (
                        <textarea
                            className="text-sm text-slate-600 dark:text-slate-300 w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={tempDesc}
                            onChange={(e) => setTempDesc(e.target.value)}
                            rows={3}
                        />
                    ) : (
                        <p className="text-sm text-slate-600 dark:text-slate-300">{task.description || "No description provided."}</p>
                    )}
                </div>

                {/* Meeting Link (Zoom) */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Video size={14} className="text-slate-400" />
                            <span className="text-xs font-semibold uppercase text-slate-400">Meeting Link</span>
                        </div>
                        {authToEdit && (
                            <button
                                onClick={() => {
                                    if (isEditingMeetingLink) {
                                        handleSaveMeetingLink();
                                    } else {
                                        setIsEditingMeetingLink(true);
                                    }
                                }}
                                className="text-blue-500 hover:text-blue-600 p-1"
                            >
                                {isEditingMeetingLink ? <Check size={14} /> : <Edit2 size={14} />}
                            </button>
                        )}
                    </div>
                    {isEditingMeetingLink ? (
                        <input
                            type="text"
                            placeholder="https://zoom.us/j/..."
                            className="text-sm text-slate-600 dark:text-slate-300 w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={tempMeetingLink}
                            onChange={(e) => setTempMeetingLink(e.target.value)}
                        />
                    ) : (
                        task.meetingLink ? (
                            <a
                                href={task.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-blue-500 hover:text-blue-600 underline truncate block"
                            >
                                {task.meetingLink}
                            </a>
                        ) : (
                            <p className="text-sm text-slate-400 italic">No link provided.</p>
                        )
                    )}
                </div>

                {/* Links — editable by assignee or managers/chiefs */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Link2 size={14} className="text-slate-400" />
                            <span className="text-xs font-semibold uppercase text-slate-400">Links</span>
                        </div>
                        {canEditLinks && (
                            <button
                                onClick={() => setShowAddLink(!showAddLink)}
                                className="text-blue-500 hover:text-blue-600 p-1"
                            >
                                <Plus size={14} />
                            </button>
                        )}
                    </div>

                    {/* Add Link Form */}
                    {showAddLink && canEditLinks && (
                        <div className="mb-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                            <input
                                type="text"
                                placeholder="Link label"
                                value={newLinkLabel}
                                onChange={(e) => setNewLinkLabel(e.target.value)}
                                className="text-sm w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300"
                            />
                            <input
                                type="text"
                                placeholder="https://..."
                                value={newLinkUrl}
                                onChange={(e) => setNewLinkUrl(e.target.value)}
                                className="text-sm w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300"
                            />
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleAddLink}
                                    disabled={!newLinkLabel.trim() || !newLinkUrl.trim()}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-md transition-colors"
                                >
                                    <Check size={12} /> Add
                                </button>
                                <button
                                    onClick={() => { setShowAddLink(false); setNewLinkLabel(""); setNewLinkUrl(""); }}
                                    className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Link list */}
                    {(task.links && task.links.length > 0) ? (
                        <div className="space-y-1.5">
                            {task.links.map((link, idx) => (
                                <div key={idx} className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 group">
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 truncate min-w-0"
                                    >
                                        <ExternalLink size={12} className="shrink-0" />
                                        <span className="truncate">{link.label}</span>
                                    </a>
                                    {canEditLinks && (
                                        <button
                                            onClick={() => handleDeleteLink(idx)}
                                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 italic">No links added.</p>
                    )}

                    {!canEditLinks && (
                        <p className="text-[10px] text-slate-400 mt-2">Only the assigned member or Managers/Chiefs can add links.</p>
                    )}
                </div>

                {/* Assignee */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <UserIcon size={14} className="text-slate-400" />
                        <span className="text-xs font-semibold uppercase text-slate-400">Assignee</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        {assignee?.avatar ? (
                            <img src={assignee.avatar} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <span className="text-xs font-bold text-blue-500">{assignee?.name?.[0] || "?"}</span>
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{assignee?.name || "Unassigned"}</p>
                            <p className="text-xs text-slate-500">{assignee?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Dates */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar size={14} className="text-slate-400" />
                        <span className="text-xs font-semibold uppercase text-slate-400">Dates</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                            <p className="text-[10px] text-slate-400 mb-1">Start</p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {task.startDate ? new Date(task.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                            <p className="text-[10px] text-slate-400 mb-1">Due</p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dependencies */}
                {depTasks.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Link2 size={14} className="text-slate-400" />
                            <span className="text-xs font-semibold uppercase text-slate-400">Dependencies (Waterfall)</span>
                        </div>
                        <div className="space-y-2">
                            {depTasks.map((depId) => (
                                <div key={depId} className="text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                    Depends on: <span className="font-mono font-bold text-blue-500">{depId}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete section — only for Manager/Chief */}
            {permissions.canDeleteTask && onDeleteTask && (
                <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
                    {showDeleteConfirm ? (
                        <div className="space-y-3">
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                                <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                                        Delete &ldquo;{task.title}&rdquo;?
                                    </p>
                                    <p className="text-xs text-red-500/70 mt-0.5">
                                        This action cannot be undone. Tasks depending on this will lose their dependency link.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                                >
                                    <Trash2 size={14} />
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-500 hover:text-white hover:bg-red-500 border border-red-200 dark:border-red-500/30 rounded-lg transition-all"
                        >
                            <Trash2 size={14} />
                            Delete Task
                        </button>
                    )}
                    <p className="text-[10px] text-slate-400 text-center mt-2">
                        Only Managers & Chiefs can delete tasks
                    </p>
                </div>
            )}
        </div>
    );
};

export default TaskDetail;
