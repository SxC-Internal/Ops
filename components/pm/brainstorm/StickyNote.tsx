"use client";

import React, { useRef, useState } from "react";
import type { BrainstormNode } from "@/types/pm-types";
import { X } from "lucide-react";

interface Props {
    node: BrainstormNode;
    zoom: number;
    isConnecting: boolean;
    isPendingFrom: boolean;         // true = this node is the selected source
    onMove: (id: string, x: number, y: number) => void;
    onTextChange: (id: string, text: string) => void;
    onDelete: (id: string) => void;
    onNodeClick: (id: string) => void; // unified click handler for connect mode
}

const StickyNote: React.FC<Props> = ({
    node, zoom, isConnecting, isPendingFrom,
    onMove, onTextChange, onDelete, onNodeClick,
}) => {
    const [editing, setEditing] = useState(false);
    const [hovered, setHovered] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // ── Drag (disabled in connect mode) ────────────────────────────────────
    const handleMouseDown = (e: React.MouseEvent) => {
        if (editing) return;
        if (isConnecting) {
            // In connect mode: clicking the node body selects it as source/target
            e.stopPropagation();
            onNodeClick(node.id);
            return;
        }
        e.preventDefault();
        const startX = e.clientX / zoom - node.x;
        const startY = e.clientY / zoom - node.y;
        const onMoveDoc = (ev: MouseEvent) =>
            onMove(node.id, ev.clientX / zoom - startX, ev.clientY / zoom - startY);
        const onUp = () => {
            document.removeEventListener("mousemove", onMoveDoc);
            document.removeEventListener("mouseup", onUp);
        };
        document.addEventListener("mousemove", onMoveDoc);
        document.addEventListener("mouseup", onUp);
    };

    const handleDoubleClick = () => {
        if (isConnecting) return;
        setEditing(true);
        setTimeout(() => textareaRef.current?.focus(), 0);
    };

    // Ring color: blue pulse when this node is the pending-from source
    const ringStyle = isPendingFrom
        ? "ring-4 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
        : isConnecting
        ? "ring-2 ring-blue-300/60 hover:ring-blue-500 cursor-crosshair"
        : "";

    return (
        <div
            className={`absolute shadow-md rounded-lg select-none group transition-shadow ${ringStyle}`}
            style={{
                left: node.x,
                top: node.y,
                width: node.width,
                height: node.height,
                backgroundColor: node.color,
                cursor: isConnecting ? "crosshair" : "grab",
            }}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Top bar */}
            <div
                className="w-full h-5 rounded-t-lg flex items-center justify-between px-2"
                style={{ backgroundColor: `${node.color}cc` }}
            >
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-black/20" />
                    <div className="w-2 h-2 rounded-full bg-black/20" />
                </div>
                {hovered && !editing && !isConnecting && (
                    <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => onDelete(node.id)}
                        className="text-black/40 hover:text-black/70 transition-colors"
                    >
                        <X size={12} />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="p-2 h-[calc(100%-20px)]">
                {editing ? (
                    <textarea
                        ref={textareaRef}
                        value={node.text}
                        onChange={(e) => onTextChange(node.id, e.target.value)}
                        onBlur={() => setEditing(false)}
                        className="w-full h-full text-xs text-slate-800 font-medium bg-transparent resize-none outline-none leading-relaxed"
                        style={{ cursor: "text" }}
                        onMouseDown={(e) => e.stopPropagation()}
                    />
                ) : (
                    <p className="text-xs text-slate-800 font-medium whitespace-pre-line leading-relaxed overflow-hidden h-full">
                        {node.text || (
                            <span className="opacity-40 italic">Double-click to edit…</span>
                        )}
                    </p>
                )}
            </div>

            {/* Connect hint shown when hovering in connect mode */}
            {isConnecting && hovered && (
                <div className="absolute inset-0 rounded-lg flex items-center justify-center bg-blue-500/10 pointer-events-none">
                    <span className="text-[10px] font-bold text-blue-600 bg-white/80 px-2 py-0.5 rounded-full shadow">
                        {isPendingFrom ? "Source ✓ — click target" : "Click to select"}
                    </span>
                </div>
            )}
        </div>
    );
};

export default StickyNote;
