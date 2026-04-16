"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import type { BrainstormNode, BrainstormNodeType, BrainstormConnection } from "@/types/pm-types";
import DiagramToolbar from "./DiagramToolbar";
import StickyNote from "./StickyNote";
import FlowchartNode from "./FlowchartNode";
import ConnectionLine from "./ConnectionLine";
import { Lightbulb, ZoomIn, ZoomOut, Maximize2, ArrowLeft, Loader2, Save } from "lucide-react";
import jsPDF from "jspdf";
import type { DiagramMeta } from "./BrainstormDashboard";

// ─── Node colors ──────────────────────────────────────────────────────────────
const nodeColors: Record<BrainstormNodeType, string> = {
    sticky: "#fbbf24",
    rectangle: "#60a5fa",
    diamond: "#f472b6",
    oval: "#a78bfa",
    text: "#94a3b8",
};

// ─── Template definitions ─────────────────────────────────────────────────────
const TEMPLATES: Record<string, { nodes: Omit<BrainstormNode, "id">[]; connections: { from: number; to: number; label?: string }[] }> = {
    blank: { nodes: [], connections: [] },

    "asis-tobe": {
        nodes: [
            { type: "rectangle", x: 60,  y: 60,  width: 180, height: 60,  text: "As-Is Process",  color: "#60a5fa" },
            { type: "rectangle", x: 60,  y: 180, width: 180, height: 60,  text: "Pain Point",      color: "#f87171" },
            { type: "diamond",   x: 340, y: 120, width: 130, height: 90,  text: "Decision?",       color: "#f472b6" },
            { type: "rectangle", x: 570, y: 60,  width: 180, height: 60,  text: "To-Be Process",   color: "#34d399" },
            { type: "rectangle", x: 570, y: 180, width: 180, height: 60,  text: "Improvement",     color: "#34d399" },
            { type: "sticky",    x: 370, y: 280, width: 200, height: 120, text: "Key insight or assumption here", color: "#fbbf24" },
        ],
        connections: [
            { from: 0, to: 2 }, { from: 1, to: 2 },
            { from: 2, to: 3, label: "Yes" }, { from: 2, to: 4, label: "No" },
        ],
    },

    flowchart: {
        nodes: [
            { type: "oval",      x: 260, y: 40,  width: 140, height: 60,  text: "Start",       color: "#34d399" },
            { type: "rectangle", x: 250, y: 150, width: 160, height: 60,  text: "Step 1",      color: "#60a5fa" },
            { type: "rectangle", x: 250, y: 260, width: 160, height: 60,  text: "Step 2",      color: "#60a5fa" },
            { type: "diamond",   x: 240, y: 370, width: 180, height: 100, text: "Condition?",  color: "#f472b6" },
            { type: "rectangle", x: 90,  y: 520, width: 140, height: 60,  text: "Branch A",    color: "#fbbf24" },
            { type: "rectangle", x: 430, y: 520, width: 140, height: 60,  text: "Branch B",    color: "#a78bfa" },
            { type: "oval",      x: 260, y: 630, width: 140, height: 60,  text: "End",         color: "#f87171" },
        ],
        connections: [
            { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 },
            { from: 3, to: 4, label: "Yes" }, { from: 3, to: 5, label: "No" },
            { from: 4, to: 6 }, { from: 5, to: 6 },
        ],
    },

    swot: {
        nodes: [
            { type: "sticky", x: 40,  y: 40,  width: 260, height: 180, text: "💪 STRENGTHS\n\n- Internal advantages\n- What we do well",              color: "#86efac" },
            { type: "sticky", x: 320, y: 40,  width: 260, height: 180, text: "⚠️ WEAKNESSES\n\n- Internal gaps\n- What needs improvement",          color: "#fca5a5" },
            { type: "sticky", x: 40,  y: 240, width: 260, height: 180, text: "🎯 OPPORTUNITIES\n\n- External factors to leverage\n- Trends to capitalize on", color: "#93c5fd" },
            { type: "sticky", x: 320, y: 240, width: 260, height: 180, text: "🚨 THREATS\n\n- External risks\n- Competitive pressures",              color: "#fcd34d" },
            { type: "text",   x: 230, y: 210, width: 160, height: 40,  text: "SWOT ANALYSIS",                                                       color: "#94a3b8" },
        ],
        connections: [],
    },

    "5w1h": {
        nodes: [
            { type: "oval",   x: 270, y: 220, width: 120, height: 70,  text: "Topic",                                     color: "#60a5fa" },
            { type: "sticky", x: 60,  y: 40,  width: 160, height: 120, text: "❓ WHAT\n\nWhat is the problem/goal?",       color: "#fbbf24" },
            { type: "sticky", x: 420, y: 40,  width: 160, height: 120, text: "🧑 WHO\n\nWho is involved?",                 color: "#f472b6" },
            { type: "sticky", x: 60,  y: 360, width: 160, height: 120, text: "📍 WHERE\n\nWhere does it happen?",          color: "#34d399" },
            { type: "sticky", x: 420, y: 360, width: 160, height: 120, text: "⏰ WHEN\n\nWhen does it occur?",             color: "#a78bfa" },
            { type: "sticky", x: 60,  y: 200, width: 160, height: 120, text: "❔ WHY\n\nWhy does it happen?",              color: "#f87171" },
            { type: "sticky", x: 420, y: 200, width: 160, height: 120, text: "🔧 HOW\n\nHow can we address it?",           color: "#93c5fd" },
        ],
        connections: [
            { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
            { from: 0, to: 4 }, { from: 0, to: 5 }, { from: 0, to: 6 },
        ],
    },
};

const buildTemplate = (templateId: string): { nodes: BrainstormNode[]; connections: BrainstormConnection[] } => {
    const tmpl = TEMPLATES[templateId] ?? TEMPLATES["blank"];
    const ids  = tmpl.nodes.map((_, i) => `bn_tmpl_${templateId}_${i}`);
    const nodes: BrainstormNode[] = tmpl.nodes.map((n, i) => ({ ...n, id: ids[i] }));
    const connections: BrainstormConnection[] = tmpl.connections.map((c, i) => ({
        id: `conn_${templateId}_${i}`,
        fromNodeId: ids[c.from],
        toNodeId:   ids[c.to],
        label:      c.label,
    }));
    return { nodes, connections };
};

// ─── Canvas-based export (no html2canvas — handles transforms correctly) ──────

function renderBoardToOffscreenCanvas(
    nodes: BrainstormNode[],
    connections: BrainstormConnection[]
): HTMLCanvasElement {
    const PADDING = 48;
    const SCALE   = 2; // retina
    const canvas  = document.createElement("canvas");

    if (!nodes.length) {
        canvas.width  = 800 * SCALE;
        canvas.height = 400 * SCALE;
        const ctx = canvas.getContext("2d")!;
        ctx.scale(SCALE, SCALE);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 800, 400);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "18px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Empty canvas", 400, 200);
        return canvas;
    }

    const minX = nodes.reduce((m, n) => Math.min(m, n.x), Infinity)  - PADDING;
    const minY = nodes.reduce((m, n) => Math.min(m, n.y), Infinity)  - PADDING;
    const maxX = nodes.reduce((m, n) => Math.max(m, n.x + n.width),  -Infinity) + PADDING;
    const maxY = nodes.reduce((m, n) => Math.max(m, n.y + n.height), -Infinity) + PADDING;
    const W = maxX - minX;
    const H = maxY - minY;

    canvas.width  = W * SCALE;
    canvas.height = H * SCALE;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(SCALE, SCALE);

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // Draw connections
    connections.forEach((conn) => {
        const from = nodes.find((n) => n.id === conn.fromNodeId);
        const to   = nodes.find((n) => n.id === conn.toNodeId);
        if (!from || !to) return;

        const x1 = from.x + from.width  / 2 - minX;
        const y1 = from.y + from.height / 2 - minY;
        const x2 = to.x   + to.width    / 2 - minX;
        const y2 = to.y   + to.height   / 2 - minY;
        const cpx = (x1 + x2) / 2;

        ctx.strokeStyle = "#64748b";
        ctx.lineWidth   = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(cpx, y1, cpx, y2, x2, y2);
        ctx.stroke();

        // Arrow head
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const al    = 12;
        ctx.fillStyle = "#64748b";
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - al * Math.cos(angle - Math.PI / 6), y2 - al * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x2 - al * Math.cos(angle + Math.PI / 6), y2 - al * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();

        if (conn.label) {
            ctx.fillStyle = "#64748b";
            ctx.font = "11px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(conn.label, (x1 + x2) / 2, (y1 + y2) / 2 - 6);
        }
    });

    // Draw nodes
    nodes.forEach((node) => {
        const x  = node.x - minX;
        const y  = node.y - minY;
        const w  = node.width;
        const h  = node.height;
        const cx = x + w / 2;
        const cy = y + h / 2;

        ctx.fillStyle   = node.color || "#60a5fa";
        ctx.strokeStyle = "rgba(0,0,0,0.12)";
        ctx.lineWidth   = 1.5;

        ctx.shadowColor   = "transparent";
        ctx.shadowBlur    = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        if (node.type === "rectangle") {
            ctx.beginPath();
            (ctx as any).roundRect?.(x, y, w, h, 6) || ctx.rect(x, y, w, h);
            ctx.fill(); ctx.stroke();
        } else if (node.type === "oval") {
            ctx.beginPath();
            ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
        } else if (node.type === "diamond") {
            ctx.beginPath();
            ctx.moveTo(cx, y);
            ctx.lineTo(x + w, cy);
            ctx.lineTo(cx, y + h);
            ctx.lineTo(x, cy);
            ctx.closePath();
            ctx.fill(); ctx.stroke();
        } else if (node.type === "sticky") {
            ctx.shadowColor = "rgba(0,0,0,0.15)";
            ctx.shadowBlur  = 8;
            ctx.shadowOffsetY = 3;
            ctx.beginPath();
            (ctx as any).roundRect?.(x, y, w, h, 4) || ctx.rect(x, y, w, h);
            ctx.fill();
            ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
            ctx.stroke();
        } else if (node.type === "text") {
            // no background fill — transparent labels
        }

        // Text
        const isSticky = node.type === "sticky";
        ctx.fillStyle     = isSticky ? "#1e293b" : node.type === "text" ? "#64748b" : "#ffffff";
        ctx.font          = `${node.type === "text" ? "bold 14" : "13"}px Inter, sans-serif`;
        ctx.textAlign     = "center";
        ctx.textBaseline  = "middle";

        const lines  = node.text.split("\n");
        const lineH  = 16;
        const startY = cy - ((lines.length - 1) * lineH) / 2;
        lines.forEach((line, i) => {
            ctx.fillText(line.trim(), cx, startY + i * lineH, w - 16);
        });
    });

    return canvas;
}

interface Props {
    user?: any;
    diagram: DiagramMeta;
    onBack: () => void;
}

const BrainstormCanvas: React.FC<Props> = ({ user, diagram, onBack }) => {
    const [template, setTemplate] = useState("blank");
    const [{ nodes, connections }, setBoard] = useState(() => ({
        nodes:       diagram.nodes?.length       ? diagram.nodes       : [],
        connections: diagram.connections?.length ? diagram.connections : [],
    }));
    const [zoom, setZoom] = useState(1);
    const [pan,  setPan]  = useState({ x: 0, y: 0 });

    const [isSaving, setIsSaving]   = useState(false);
    const [isExporting, setIsExporting] = useState<"" | "png" | "pdf">("");
    const [title, setTitle]         = useState(diagram.title);

    // Connection mode
    const [connectMode, setConnectMode] = useState(false);
    const [pendingFrom, setPendingFrom] = useState<string | null>(null);
    const [mousePos, setMousePos]       = useState<{ x: number; y: number } | null>(null);

    // ── Per-template board state persistence ────────────────────────────────
    // boardStatesRef stores each template's nodes/connections when you switch away
    const boardStatesRef = useRef<Record<string, { nodes: BrainstormNode[]; connections: BrainstormConnection[] }>>({});
    // boardRef always holds the latest state (avoids stale closures in callbacks)
    const boardRef = useRef({ nodes, connections });
    useEffect(() => { boardRef.current = { nodes, connections }; }, [nodes, connections]);

    const canvasRef = useRef<HTMLDivElement>(null);

    // ── Save ─────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        try {
            setIsSaving(true);
            await fetch(`/api/diagrams/${diagram.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, nodes, connections }),
            });
        } catch (error) {
            console.error("Failed to save diagram", error);
        } finally {
            setIsSaving(false);
        }
    };

    // ── Export PNG ────────────────────────────────────────────────────────────
    const handleExportPNG = async () => {
        setIsExporting("png");
        try {
            const offscreen = renderBoardToOffscreenCanvas(nodes, connections);
            const link      = document.createElement("a");
            link.download   = `${title}.png`;
            link.href       = offscreen.toDataURL("image/png");
            link.click();
        } finally {
            setIsExporting("");
        }
    };

    // ── Export PDF ────────────────────────────────────────────────────────────
    const handleExportPDF = async () => {
        setIsExporting("pdf");
        try {
            const offscreen = renderBoardToOffscreenCanvas(nodes, connections);
            const imgData   = offscreen.toDataURL("image/png");
            const pdf       = new jsPDF("landscape", "mm", "a4");
            const pdfW      = pdf.internal.pageSize.getWidth();
            const pdfH      = (offscreen.height * pdfW) / offscreen.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
            pdf.save(`${title}.pdf`);
        } finally {
            setIsExporting("");
        }
    };

    // ── Template change — saves old state, restores new ──────────────────────
    const handleTemplateChange = useCallback((id: string) => {
        const currentTemplate = template; // captured in closure
        // Save current board state under current template key
        boardStatesRef.current[currentTemplate] = { ...boardRef.current };

        // Load saved state for the target template (or build from template if first visit)
        const saved = boardStatesRef.current[id];
        setBoard(saved ?? buildTemplate(id));

        setTemplate(id);
        setPan({ x: 0, y: 0 });
        setZoom(1);
        setConnectMode(false);
        setPendingFrom(null);
    }, [template]);

    // ── Add node ─────────────────────────────────────────────────────────────
    const handleAddNode = useCallback((type: BrainstormNodeType) => {
        const newNode: BrainstormNode = {
            id:     `bn_${Date.now()}`,
            type,
            x:      120 + Math.random() * 300 - pan.x,
            y:      120 + Math.random() * 200 - pan.y,
            width:  type === "sticky" ? 200 : type === "diamond" ? 140 : type === "oval"  ? 160 : type === "text" ? 120 : 180,
            height: type === "sticky" ? 140 : type === "diamond" ? 100 : type === "oval"  ? 70  : type === "text" ?  36 :  70,
            text:   type === "sticky" ? "New note…" : type === "text" ? "Label" : "Step",
            color:  nodeColors[type],
        };
        setBoard((prev) => ({ ...prev, nodes: [...prev.nodes, newNode] }));
    }, [pan]);

    const handleMoveNode  = useCallback((id: string, x: number, y: number) =>
        setBoard((prev) => ({ ...prev, nodes: prev.nodes.map((n) => n.id === id ? { ...n, x, y } : n) })), []);

    const handleTextChange = useCallback((id: string, text: string) =>
        setBoard((prev) => ({ ...prev, nodes: prev.nodes.map((n) => n.id === id ? { ...n, text } : n) })), []);

    const handleDeleteNode = useCallback((id: string) =>
        setBoard((prev) => ({
            nodes:       prev.nodes.filter((n) => n.id !== id),
            connections: prev.connections.filter((c) => c.fromNodeId !== id && c.toNodeId !== id),
        })), []);

    // ── Connection mode ───────────────────────────────────────────────────────
    const handleNodeClick = useCallback((id: string) => {
        if (!connectMode) return;
        if (!pendingFrom) {
            setPendingFrom(id);
        } else if (pendingFrom !== id) {
            setBoard((prev) => ({
                ...prev,
                connections: [...prev.connections, { id: `conn_${Date.now()}`, fromNodeId: pendingFrom, toNodeId: id }],
            }));
            setPendingFrom(null); setMousePos(null);
        } else {
            setPendingFrom(null); setMousePos(null);
        }
    }, [connectMode, pendingFrom]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const onMove = (e: MouseEvent) => {
            if (!connectMode) return;
            const rect = canvas.getBoundingClientRect();
            setMousePos({ x: (e.clientX - rect.left - pan.x) / zoom, y: (e.clientY - rect.top - pan.y) / zoom });
        };
        canvas.addEventListener("mousemove", onMove);
        return () => canvas.removeEventListener("mousemove", onMove);
    }, [connectMode, zoom, pan]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") { setConnectMode(false); setPendingFrom(null); } };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    // ── Canvas pan ────────────────────────────────────────────────────────────
    const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.target !== e.currentTarget) return;
        const startX = e.clientX - pan.x;
        const startY = e.clientY - pan.y;
        const onMove = (ev: MouseEvent) => setPan({ x: ev.clientX - startX, y: ev.clientY - startY });
        const onUp   = () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    }, [pan]);

    const handleClearCanvas = useCallback(() => setBoard({ nodes: [], connections: [] }), []);

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-1">
                        <button onClick={onBack} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                            <ArrowLeft size={16} />
                        </button>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleSave}
                            className="text-2xl font-bold bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500/50 rounded text-slate-900 dark:text-white"
                        />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Drag nodes to move · Double-click to edit · Use <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">Connect</kbd> to draw arrows · <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">Esc</kbd> to cancel
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 font-medium text-white text-sm rounded-lg shadow shadow-blue-500/20 transition-all"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save
                    </button>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
                    <div className="flex items-center gap-1">
                        <button onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.1).toFixed(1)))} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <ZoomOut size={16} className="text-slate-500" />
                        </button>
                        <span className="text-xs font-mono text-slate-500 px-2 w-12 text-center">{Math.round(zoom * 100)}%</span>
                        <button onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(1)))} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <ZoomIn size={16} className="text-slate-500" />
                        </button>
                        <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <Maximize2 size={16} className="text-slate-500" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <DiagramToolbar
                onAddNode={handleAddNode}
                activeTemplate={template}
                onTemplateChange={handleTemplateChange}
                connectMode={connectMode}
                onToggleConnectMode={() => { setConnectMode((v) => !v); setPendingFrom(null); }}
                onClearCanvas={handleClearCanvas}
                onExportPNG={handleExportPNG}
                onExportPDF={handleExportPDF}
                isExporting={isExporting}
            />

            {/* Canvas */}
            <div
                ref={canvasRef}
                className={`relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden ${connectMode ? "cursor-crosshair" : "cursor-default"}`}
                style={{ height: "640px" }}
                onMouseDown={handleCanvasMouseDown}
            >
                {/* Grid */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgb(148 163 184 / 0.15) 1px, transparent 1px)`,
                        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                        backgroundPosition: `${pan.x}px ${pan.y}px`,
                    }}
                />

                {/* Zoomable / pannable content */}
                <div className="absolute inset-0 origin-top-left" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                    <ConnectionLine connections={connections} nodes={nodes} pendingFrom={pendingFrom} mousePos={mousePos ?? undefined} />
                    {nodes.map((node) =>
                        node.type === "sticky" ? (
                            <StickyNote
                                key={node.id} node={node} zoom={zoom}
                                isConnecting={connectMode} isPendingFrom={pendingFrom === node.id}
                                onMove={handleMoveNode} onTextChange={handleTextChange}
                                onDelete={handleDeleteNode} onNodeClick={handleNodeClick}
                            />
                        ) : (
                            <FlowchartNode
                                key={node.id} node={node} zoom={zoom}
                                isConnecting={connectMode} isPendingFrom={pendingFrom === node.id}
                                onMove={handleMoveNode} onTextChange={handleTextChange}
                                onDelete={handleDeleteNode} onNodeClick={handleNodeClick}
                            />
                        )
                    )}
                </div>

                {/* Export overlay */}
                {isExporting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm z-10 rounded-xl">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                            <Loader2 size={20} className="animate-spin" />
                            Generating {isExporting.toUpperCase()}…
                        </div>
                    </div>
                )}

                {/* Status bar */}
                <div className="absolute bottom-0 left-0 right-0 px-4 py-2 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-t border-slate-100 dark:border-slate-800">
                    <span>{nodes.length} nodes · {connections.length} connections</span>
                    {connectMode && (
                        <span className="text-blue-500 font-medium animate-pulse">
                            {pendingFrom ? "Now click the destination node…" : "Click a node to start connecting"}
                        </span>
                    )}
                    <span>Brainstorm Board · Drag empty space to pan</span>
                </div>
            </div>
        </div>
    );
};

export default BrainstormCanvas;
