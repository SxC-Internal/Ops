"use client";

import React, { useRef, useState } from "react";
import type { BrainstormNode } from "@/types/pm-types";
import { X } from "lucide-react";

interface Props {
    node: BrainstormNode;
    zoom: number;
    isConnecting: boolean;
    isPendingFrom: boolean;
    onMove: (id: string, x: number, y: number) => void;
    onTextChange: (id: string, text: string) => void;
    onDelete: (id: string) => void;
    onNodeClick: (id: string) => void;
}

const FlowchartNode: React.FC<Props> = ({
    node, zoom, isConnecting, isPendingFrom,
    onMove, onTextChange, onDelete, onNodeClick,
}) => {
    const [editing, setEditing] = useState(false);
    const [hovered, setHovered] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (editing) return;
        if (isConnecting) {
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
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const getShapeStyle = (): React.CSSProperties => {
        switch (node.type) {
            case "oval":    return { borderRadius: "50%" };
            case "diamond": return { transform: "rotate(45deg)", borderRadius: "8px" };
            case "text":    return { backgroundColor: "transparent", border: "none", boxShadow: "none" };
            default:        return { borderRadius: "8px" };
        }
    };

    const isText = node.type === "text";
    const isDiamond = node.type === "diamond";

    const ringStyle = isPendingFrom
        ? "ring-4 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
        : isConnecting
        ? "ring-2 ring-blue-300/60 hover:ring-blue-500"
        : "";

    return (
        <div
            className={`absolute select-none group transition-shadow ${ringStyle} rounded-lg`}
            style={{
                left: node.x,
                top: node.y,
                width: node.width,
                height: node.height,
                cursor: isConnecting ? "crosshair" : "grab",
            }}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Shape background */}
            {!isText && (
                <div
                    className="absolute inset-0 shadow-md"
                    style={{
                        backgroundColor: node.color,
                        border: `2px solid ${node.color}99`,
                        ...getShapeStyle(),
                    }}
                />
            )}

            {/* Text */}
            <div className="absolute inset-0 flex items-center justify-center z-10 px-2">
                {editing ? (
                    <input
                        ref={inputRef}
                        value={node.text}
                        onChange={(e) => onTextChange(node.id, e.target.value)}
                        onBlur={() => setEditing(false)}
                        onKeyDown={(e) => { if (e.key === "Enter") setEditing(false); }}
                        className="bg-transparent text-xs font-semibold text-white text-center outline-none w-full"
                        onMouseDown={(e) => e.stopPropagation()}
                    />
                ) : (
                    <p className={`text-xs font-semibold text-center drop-shadow-sm
                        ${isText ? "text-slate-700 dark:text-slate-300" : "text-white"}`}
                    >
                        {node.text || <span className="opacity-40 italic">…</span>}
                    </p>
                )}
            </div>

            {/* Delete button (only when not connecting) */}
            {hovered && !editing && !isConnecting && (
                <button
                    className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center shadow z-20"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => onDelete(node.id)}
                >
                    <X size={10} className="text-white" />
                </button>
            )}

            {/* Connect hover hint */}
            {isConnecting && hovered && (
                <div className="absolute inset-0 rounded-lg flex items-center justify-center bg-blue-500/10 pointer-events-none z-20">
                    <span className="text-[10px] font-bold text-blue-600 bg-white/80 px-2 py-0.5 rounded-full shadow">
                        {isPendingFrom ? "Source ✓" : "Click to select"}
                    </span>
                </div>
            )}
        </div>
    );
};

export default FlowchartNode;
