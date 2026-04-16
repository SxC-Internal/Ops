"use client";

import React, { useState } from "react";
import { X, CheckCircle, Clock, Calendar, Building2, AlignLeft, Paperclip, AlertCircle, Save, Link2, ExternalLink, Trash2, Plus, Check } from "lucide-react";
import type { PMTask, TaskLink, TaskAttachment } from "@/types/pm-types";
import { usePMRole } from "@/hooks/usePMRole";
import { PM_NOTIFICATIONS } from "@/data/pm-mock-data";
import { usePMTasks } from "@/context/PMTasksContext";

interface Props {
    task: PMTask;
    isOpen: boolean;
    onClose: () => void;
    currentUserRole: string; // e.g. "Manager"
    currentUserDivision: string; // e.g. "Operations"
    currentUserId?: string; // e.g. "usr_003"
}

const TaskDetailsModal: React.FC<Props> = ({ task: initialTask, isOpen, onClose, currentUserRole, currentUserDivision, currentUserId = '' }) => {
    const { canEditAll, canEditSubdivision, canApproveSubordinate, canApproveAll, canDeleteTask } = usePMRole(currentUserRole as any);
    const { updateTask, deleteTask, users } = usePMTasks();

    const [task, setTask] = useState(initialTask);
    const [progress, setProgress] = useState(initialTask.progressPercentage);
    const [showAddLink, setShowAddLink] = useState(false);
    const [newLinkLabel, setNewLinkLabel] = useState("");
    const [newLinkUrl, setNewLinkUrl] = useState("");

    const assignee = users.find((u: any) => u.id === task.assigneeId);

    // Case-insensitive comparisons for division matching
    const isSameDivision = task.division.toLowerCase() === currentUserDivision.toLowerCase();

    // Determines if the user can fully edit this task (title, desc, status)
    const canEdit = canEditAll || (canEditSubdivision && isSameDivision);

    // Determines if the user can approve this task
    const canApprove = canApproveAll || (canApproveSubordinate && isSameDivision);

    // Link editing: assignee can add links to their own task, managers/chiefs can add to any
    const isAssignee = currentUserId !== '' && currentUserId === task.assigneeId;
    const canEditLinks = canEdit || isAssignee;

    const handleAddLink = () => {
        if (!newLinkLabel.trim() || !newLinkUrl.trim()) return;
        const newLink: TaskLink = { label: newLinkLabel.trim(), url: newLinkUrl.trim() };
        setTask({ ...task, links: [...(task.links || []), newLink] });
        setNewLinkLabel("");
        setNewLinkUrl("");
        setShowAddLink(false);
    };

    const handleDeleteLink = (index: number) => {
        const updatedLinks = [...(task.links || [])];
        updatedLinks.splice(index, 1);
        setTask({ ...task, links: updatedLinks });
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
        
        // Reset the input so the same file could be selected again if needed
        e.target.value = '';
    };

    const handleDeleteAttachment = (index: number) => {
        const updatedAttachments = [...(task.attachments || [])];
        updatedAttachments.splice(index, 1);
        setTask({ ...task, attachments: updatedAttachments });
    };

    // Sync state when task prop changes
    React.useEffect(() => {
        setTask(initialTask);
        setProgress(initialTask.progressPercentage);
        setShowAddLink(false);
        setNewLinkLabel("");
        setNewLinkUrl("");
    }, [initialTask]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                                {task.division}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded border ${task.status === 'Done' ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                {task.status}
                            </span>
                        </div>
                        {canEdit ? (
                            <input
                                type="text"
                                value={task.title}
                                onChange={(e) => setTask(prev => ({ ...prev, title: e.target.value }))}
                                className="text-xl font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none w-full"
                            />
                        ) : (
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{task.title}</h2>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full transition-colors ml-4 shrink-0">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-8">

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2"><UserIcon size={14} /> Assignee</p>
                            <div className="flex items-center gap-2">
                                {assignee?.avatar ? (
                                    <img src={assignee.avatar} alt={assignee.name} className="w-8 h-8 rounded-full" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 text-xs font-bold">?</div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{assignee?.name || "Unassigned"}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2"><Calendar size={14} /> Due Date</p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {new Date(task.dueDate).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* Progress Slider */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5"><Clock size={14} /> Progress</p>
                            <span className="text-sm font-bold text-blue-600">{progress}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={progress}
                            onChange={(e) => {
                                const newProgress = parseInt(e.target.value);
                                setProgress(newProgress);
                                setTask(prev => {
                                    let newStatus = prev.status;
                                    if (newProgress === 100) newStatus = "Done";
                                    else if (newProgress > 0 && prev.status !== "On going") newStatus = "On going";
                                    else if (newProgress === 0 && prev.status === "On going") newStatus = "To do";
                                    
                                    return { ...prev, progressPercentage: newProgress, status: newStatus };
                                });
                            }}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-blue-600"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2"><AlignLeft size={14} /> Description</p>
                        {canEdit ? (
                            <textarea
                                className="w-full min-h-[100px] p-3 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                placeholder="Add a more detailed description..."
                                value={task.description || ""}
                                onChange={(e) => setTask(prev => ({ ...prev, description: e.target.value }))}
                            />
                        ) : (
                            <div className="w-full min-h-[100px] p-3 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300">
                                {task.description || "No description provided."}
                            </div>
                        )}
                    </div>

                    {/* Links — editable by assignee or managers/chiefs */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5"><Link2 size={14} /> Links</p>
                            {canEditLinks && (
                                <button
                                    onClick={() => setShowAddLink(!showAddLink)}
                                    className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-xs font-medium transition-colors"
                                >
                                    <Plus size={14} /> Add Link
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

                    {/* File Attachments (Only Assignee can upload PNG/PDF) */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5"><Paperclip size={14} /> Attachments</p>
                            {isAssignee && (
                                <label className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-xs font-medium transition-colors cursor-pointer">
                                    <Plus size={14} /> Upload PNG/PDF
                                    <input 
                                        type="file" 
                                        accept=".png,.pdf" 
                                        className="hidden" 
                                        onChange={handleFileUpload}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Attachments List */}
                        {(task.attachments && task.attachments.length > 0) ? (
                            <div className="space-y-1.5">
                                {task.attachments.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 group">
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 truncate min-w-0"
                                        >
                                            <Paperclip size={12} className="shrink-0" />
                                            <span className="truncate">{file.name}</span>
                                        </a>
                                        {isAssignee && (
                                            <button
                                                onClick={() => handleDeleteAttachment(idx)}
                                                className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic">No attachments added.</p>
                        )}
                        
                        {!isAssignee && (
                            <p className="text-[10px] text-slate-400 mt-2">Only the assigned member can upload attachments.</p>
                        )}
                    </div>

                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between rounded-b-2xl">
                    {!canEdit ? (
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-500/20">
                            <AlertCircle size={14} /> Only {task.division} Managers or Chiefs can fully edit this task.
                        </div>
                    ) : <div />}

                    <div className="flex items-center gap-3">
                        {canDeleteTask && (
                            <button 
                                onClick={async () => {
                                    await deleteTask(task.id);
                                    onClose();
                                }}
                                className="px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={16} /> Delete Task
                            </button>
                        )}
                        <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                            Cancel
                        </button>

                        {canApprove && task.status !== "Done" && (
                            <button 
                                onClick={async () => {
                                    await updateTask(task.id, { ...task, status: "Done", progressPercentage: 100 });
                                    onClose();
                                }}
                                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-sm font-semibold rounded-lg transition-colors"
                            >
                                <CheckCircle size={16} /> Approve & Complete
                            </button>
                        )}

                        <button onClick={async () => {
                            await updateTask(task.id, task);

                            // If a manager/chief edits an associate's task, generate a notification
                            if (canEdit && !isAssignee && currentUserId) {
                                const editor = users.find((u: any) => u.id === currentUserId);
                                PM_NOTIFICATIONS.unshift({
                                    id: `ntf_${Date.now()}`,
                                    type: 'task_update',
                                    title: 'Task Edited by Manager/Chief',
                                    message: `${editor?.name || 'Someone'} edited your task "${task.title}".`,
                                    timestamp: new Date().toISOString(),
                                    isRead: false,
                                    relatedTaskId: task.id,
                                    relatedUserId: task.assigneeId
                                });
                            }
                            onClose();
                        }} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-colors">
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Extracted UserIcon for the UI
const UserIcon = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const PlusIcon = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);

export default TaskDetailsModal;
