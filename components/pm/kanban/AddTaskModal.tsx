"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { usePMTasks } from "@/context/PMTasksContext";
import type { PMTask } from "@/types/pm-types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user?: any;
}

const AddTaskModal: React.FC<Props> = ({ isOpen, onClose, user }) => {
    const { addTask, users } = usePMTasks();
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [division, setDivision] = useState(user?.currentDivision || "Operations");
    const [assigneeId, setAssigneeId] = useState("");
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !dueDate) return;
        setIsSubmitting(true);
        
        const newTask = {
            title,
            description,
            status: "To do",
            progressPercentage: 0,
            dueDate: new Date(dueDate).toISOString(),
            division,
            assigneeId: assigneeId || null,
            dependencies: [],
        } as unknown as PMTask;
        
        await addTask(newTask);
        
        setIsSubmitting(false);
        setTitle("");
        setDescription("");
        setDueDate("");
        setAssigneeId("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Create New Task
                        </h3>
                    </div>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Task Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                            placeholder="What needs to be done?"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 min-h-[80px]"
                            placeholder="Add details..."
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Due Date</label>
                            <input
                                type="date"
                                required
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Division</label>
                            <input
                                type="text"
                                required
                                value={division}
                                onChange={(e) => setDivision(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Assignee</label>
                        <select
                            value={assigneeId}
                            onChange={(e) => setAssigneeId(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Unassigned</option>
                            {users.map((u: any) => (
                                <option key={u.id} value={u.id}>{u.name} ({u.memberships?.[0]?.role || 'Member'})</option>
                            ))}
                        </select>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700">
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow disabled:opacity-50"
                        >
                            {isSubmitting ? "Creating..." : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;
