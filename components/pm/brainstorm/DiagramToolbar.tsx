"use client";

import React from "react";
import { StickyNote as StickyNoteIcon, Square, Diamond, Circle, Type, Minus, Trash2, RotateCcw } from "lucide-react";
import type { BrainstormNodeType } from "@/types/pm-types";

interface Props {
    onAddNode: (type: BrainstormNodeType) => void;
    activeTemplate: string;
    onTemplateChange: (template: string) => void;
    connectMode: boolean;
    onToggleConnectMode: () => void;
    onClearCanvas: () => void;
    onExportPNG?: () => void;
    onExportPDF?: () => void;
    isExporting?: string;
}

const tools = [
    { type: "sticky" as const, icon: StickyNoteIcon, label: "Sticky Note", color: "text-amber-400" },
    { type: "rectangle" as const, icon: Square, label: "Rectangle", color: "text-blue-400" },
    { type: "diamond" as const, icon: Diamond, label: "Diamond", color: "text-pink-400" },
    { type: "oval" as const, icon: Circle, label: "Oval / Start-End", color: "text-violet-400" },
    { type: "text" as const, icon: Type, label: "Text Label", color: "text-slate-400" },
];

const templates = [
    { id: "blank", label: "Blank" },
    { id: "asis-tobe", label: "As-Is / To-Be" },
    { id: "flowchart", label: "Flowchart" },
    { id: "swot", label: "SWOT" },
    { id: "5w1h", label: "5W1H" },
];

const DiagramToolbar: React.FC<Props> = ({
    onAddNode, activeTemplate, onTemplateChange,
    connectMode, onToggleConnectMode, onClearCanvas,
    onExportPNG, onExportPDF, isExporting,
}) => {
    return (
        <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 p-3 flex items-center gap-2 flex-wrap backdrop-blur-sm">
            {/* Node tools */}
            <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-3">
                {tools.map((tool) => (
                    <button
                        key={tool.type}
                        onClick={() => onAddNode(tool.type)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                        title={tool.label}
                    >
                        <tool.icon size={18} className={`${tool.color} group-hover:scale-110 transition-transform`} />
                    </button>
                ))}
            </div>

            {/* Connect mode toggle */}
            <button
                onClick={onToggleConnectMode}
                title="Connection mode — click a node, then click another to link"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    connectMode
                        ? "bg-blue-500 text-white border-blue-500 shadow"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:bg-slate-200"
                }`}
            >
                <Minus size={14} className="rotate-45" />
                {connectMode ? "Click two nodes…" : "Connect"}
            </button>

            <div className="border-r border-slate-200 dark:border-slate-700 h-6 mx-1" />

            {/* Templates */}
            <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider mr-1">Template</span>
                {templates.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => onTemplateChange(t.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg transition-all font-medium ${
                            activeTemplate === t.id
                                ? "bg-blue-500 text-white shadow-sm"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="ml-auto flex items-center gap-1">
                {onExportPNG && (
                    <button onClick={onExportPNG} disabled={!!isExporting} title="Export as PNG" className="p-2 text-xs font-semibold text-slate-500 hover:text-blue-500 rounded-lg transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-40 disabled:cursor-not-allowed">
                        {isExporting === "png" ? "…" : "PNG"}
                    </button>
                )}
                {onExportPDF && (
                    <button onClick={onExportPDF} disabled={!!isExporting} title="Export as PDF" className="p-2 text-xs font-semibold text-slate-500 hover:text-blue-500 rounded-lg transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-40 disabled:cursor-not-allowed">
                        {isExporting === "pdf" ? "…" : "PDF"}
                    </button>
                )}
                <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
                <button
                    onClick={onClearCanvas}
                    title="Clear canvas"
                    className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default DiagramToolbar;
