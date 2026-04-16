"use client";

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect, type ReactNode } from "react";
import type { PMTask } from "@/types/pm-types";


// ─── Context shape ────────────────────────────────────────────────────────────
interface PMTasksContextValue {
    /** All tasks — shared across every PM view */
    tasks: PMTask[];
    /** All users in the department */
    users: any[];
    /** Loading status */
    isLoading: boolean;
    /** Error status */
    error: string | null;
    /** Resolve the PM user ID (e.g. "usr_007") from a logged-in user email */
    resolvePMUserId: (email: string) => string | null;
    /** Update a single task in-place (triggers re-render everywhere) */
    updateTask: (taskId: string, patch: Partial<PMTask>) => Promise<void>;
    /** Add a brand-new task */
    addTask: (task: PMTask) => Promise<void>;
    /** Delete a task */
    deleteTask: (taskId: string) => Promise<void>;
    /** Refresh tasks manually */
    refreshTasks: () => Promise<void>;
}

const PMTasksContext = createContext<PMTasksContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const PMTasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<PMTask[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /** Match logged-in user email → real user id */
    const resolvePMUserId = useCallback((email: string): string | null => {
        if (!email) return null;
        const pmUser = users.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        return pmUser?.id ?? null;
    }, [users]);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [tasksRes, usersRes] = await Promise.all([
                fetch("/api/tasks"),
                fetch("/api/users?dept=ops")
            ]);
            
            if (!tasksRes.ok) throw new Error("Failed to fetch tasks");
            const data = await tasksRes.json();
            setTasks(data.data || []);

            if (usersRes.ok) {
                const uData = await usersRes.json();
                setUsers(uData.data || []);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const updateTask = useCallback(async (taskId: string, patch: Partial<PMTask>) => {
        setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t)));
        
        try {
            // Remove properties that should not be sent in PATCH
            const { id, createdAt, updatedAt, assignee, department, attachments, links, ...updateData } = patch as any;
            
            // Clean up undefined vs null vs not passed fields if necessary,
            // but Next.js router typically handles it if matching the zod/json shape
            const res = await fetch(`/api/tasks/${taskId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData),
            });
            
            if (!res.ok) {
                // Revert on failure by re-fetching
                fetchTasks();
                const errData = await res.json();
                console.error("Task update failed:", errData);
            }
        } catch (err) {
            console.error(err);
        }
    }, [fetchTasks]);

    const addTask = useCallback(async (task: PMTask) => {
        const tempId = `temp_${Date.now()}`;
        setTasks((prev) => [...prev, { ...task, id: tempId }]);
        
        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    progressPercentage: task.progressPercentage,
                    dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : new Date().toISOString(),
                    startDate: task.startDate ? new Date(task.startDate).toISOString() : null,
                    division: task.division,
                    assigneeId: task.assigneeId,
                    dependencies: task.dependencies || [],
                }),
            });
            if (!res.ok) {
                setTasks((prev) => prev.filter(t => t.id !== tempId));
                const textData = await res.text();
                console.error(`Task creation failed (${res.status}):`, textData);
                alert(`Error creating task: ${textData}`);
            } else {
                const data = await res.json();
                // Replace temp id with real id
                // Update specific task matching tempId to point to the real DB item
                setTasks((prev) => prev.map(t => t.id === tempId ? { ...t, id: data.data.id } : t));
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    const deleteTask = useCallback(async (taskId: string) => {
        const previous = [...tasks];
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        
        try {
            const res = await fetch(`/api/tasks/${taskId}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                setTasks(previous);
                const errData = await res.json();
                console.error("Task deletion failed:", errData);
            }
        } catch (err) {
            console.error(err);
        }
    }, [tasks]);

    const value = useMemo<PMTasksContextValue>(
        () => ({ tasks, users, isLoading, error, resolvePMUserId, updateTask, addTask, deleteTask, refreshTasks: fetchTasks }),
        [tasks, users, isLoading, error, resolvePMUserId, updateTask, addTask, deleteTask, fetchTasks]
    );

    return (
        <PMTasksContext.Provider value={value}>
            {children}
        </PMTasksContext.Provider>
    );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function usePMTasks(): PMTasksContextValue {
    const ctx = useContext(PMTasksContext);
    if (!ctx) {
        throw new Error("usePMTasks must be used inside <PMTasksProvider>");
    }
    return ctx;
}
