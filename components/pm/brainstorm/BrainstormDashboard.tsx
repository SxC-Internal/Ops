"use client";

import React, { useEffect, useState } from "react";
import { Plus, Map, Clock, Trash2 } from "lucide-react";

export interface DiagramMeta {
    id: string;
    title: string;
    updatedAt: string;
    nodes: any[];
    connections: any[];
}

interface Props {
    user?: any;
    onOpenDiagram: (id: string, diagram: DiagramMeta) => void;
}

const BrainstormDashboard: React.FC<Props> = ({ user, onOpenDiagram }) => {
    const [diagrams, setDiagrams] = useState<DiagramMeta[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        loadDiagrams();
    }, []);

    const loadDiagrams = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/diagrams", {
                headers: { "x-dev-email": user?.email || "" }
            });
            if (res.ok) {
                const data = await res.json();
                setDiagrams(data.data || []);
            }
        } catch (error) {
            console.error("Failed to load diagrams:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            setIsCreating(true);
            const res = await fetch("/api/diagrams", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-dev-email": user?.email || ""
                },
                body: JSON.stringify({
                    title: "Untitled Diagram",
                    nodes: [],
                    connections: []
                })
            });
            if (res.ok) {
                const { data } = await res.json();
                onOpenDiagram(data.id, data);
            }
        } catch (error) {
            console.error("Failed to create diagram", error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this diagram?")) return;
        
        try {
            setDiagrams(diagrams.filter(d => d.id !== id));
            await fetch(`/api/diagrams/${id}`, {
                method: "DELETE",
                headers: { "x-dev-email": user?.email || "" }
            });
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Map size={24} className="text-amber-500" />
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Brainstorm Boards</h1>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Map out your ideas, design workflows, and solve problems creatively.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Create New Card */}
                <button
                    onClick={handleCreate}
                    disabled={isCreating}
                    className="h-48 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-blue-500 hover:border-blue-400 dark:hover:border-blue-500 group"
                >
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus size={24} />
                    </div>
                    <span className="font-medium">{isCreating ? "Creating..." : "New Blank Board"}</span>
                </button>

                {/* Existing Diagrams */}
                {isLoading ? (
                    <div className="h-48 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                ) : (
                    diagrams.map((d) => (
                        <div
                            key={d.id}
                            onClick={() => onOpenDiagram(d.id, d)}
                            className="h-48 group relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col"
                        >
                            {/* Thumbnail Preview Area */}
                            <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-4 flex items-center justify-center relative">
                                <Map size={48} className="text-slate-200 dark:text-slate-700" />
                                
                                {/* Hover Delete */}
                                <button
                                    onClick={(e) => handleDelete(e, d.id)}
                                    className="absolute top-3 right-3 p-2 bg-white dark:bg-slate-700 text-slate-400 hover:text-red-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Meta Info */}
                            <div className="p-4 border-t border-slate-100 dark:border-slate-700/50">
                                <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                                    {d.title}
                                </h3>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    <Clock size={12} />
                                    {new Date(d.updatedAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BrainstormDashboard;
