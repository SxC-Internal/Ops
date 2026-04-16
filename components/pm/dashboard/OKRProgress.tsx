"use client";

import React, { useState } from "react";
import {
    Target, CheckCircle2, AlertTriangle, XCircle,
    Pencil, Check, X, Plus, Trash2, Link2, SlidersHorizontal, Save, Loader2
} from "lucide-react";
import type { PMOKR, PMTask } from "@/types/pm-types";

interface Props {
    programName: string;
    occasion: string;
    okrs: PMOKR[];
    tasks: PMTask[];
    canEdit?: boolean;
    onOKRsChange?: (updated: PMOKR[]) => void;
    onProgramNameChange?: (name: string) => void;
    onOccasionChange?: (name: string) => void;
    onSave?: () => Promise<void>;
}

function calcKRProgress(okr: PMOKR, tasks: PMTask[]): number {
    if (!okr.taskIds || okr.taskIds.length === 0) return okr.progressPercentage;
    const linked = tasks.filter((t) => okr.taskIds!.includes(t.id));
    if (linked.length === 0) return okr.progressPercentage;
    return Math.round(linked.reduce((s, t) => s + t.progressPercentage, 0) / linked.length);
}

function getStatus(pct: number) {
    if (pct === 100) return { label: "Achieved", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", icon: <CheckCircle2 size={12} /> };
    if (pct >= 60)   return { label: "On Track",  color: "text-blue-600 dark:text-blue-400",     bg: "bg-blue-50 dark:bg-blue-500/10",     icon: <Target size={12} /> };
    if (pct >= 30)   return { label: "At Risk",   color: "text-amber-600 dark:text-amber-400",   bg: "bg-amber-50 dark:bg-amber-500/10",   icon: <AlertTriangle size={12} /> };
    return           { label: "Behind",   color: "text-rose-600 dark:text-rose-400",     bg: "bg-rose-50 dark:bg-rose-500/10",     icon: <XCircle size={12} /> };
}

function barColor(pct: number) {
    if (pct === 100) return "from-emerald-400 to-emerald-500";
    if (pct >= 60)   return "from-blue-400 to-blue-500";
    if (pct >= 30)   return "from-amber-400 to-amber-500";
    return                  "from-rose-400 to-rose-500";
}

const CIRCUMFERENCE = 2 * Math.PI * 52;

// ── Inline text edit field ────────────────────────────────────────────────────
const InlineEdit: React.FC<{
    value: string;
    onSave: (v: string) => void;
    className?: string;
    placeholder?: string;
}> = ({ value, onSave, className = "", placeholder }) => {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft]     = useState(value);

    const commit = () => { if (draft.trim()) onSave(draft.trim()); setEditing(false); };
    const cancel = () => { setDraft(value); setEditing(false); };

    if (editing) {
        return (
            <span className="inline-flex items-center gap-1">
                <input
                    autoFocus
                    value={draft}
                    placeholder={placeholder}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel(); }}
                    className={`bg-white dark:bg-slate-800 border border-blue-400 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${className}`}
                />
                <button onClick={commit}  className="p-0.5 rounded bg-emerald-500 text-white hover:bg-emerald-600"><Check size={11} /></button>
                <button onClick={cancel}  className="p-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 hover:bg-slate-300"><X size={11} /></button>
            </span>
        );
    }
    return (
        <button
            onClick={() => { setDraft(value); setEditing(true); }}
            className="group/ie inline-flex items-center gap-1 text-left hover:text-blue-500 transition-colors rounded px-0.5"
        >
            <span className={className}>{value}</span>
            <Pencil size={11} className="opacity-0 group-hover/ie:opacity-60 transition-opacity shrink-0" />
        </button>
    );
};

// ── Task picker modal ─────────────────────────────────────────────────────────
const TaskPicker: React.FC<{
    allTasks: PMTask[];
    selectedIds: string[];
    onSave: (ids: string[]) => void;
    onClose: () => void;
}> = ({ allTasks, selectedIds, onSave, onClose }) => {
    const [picked, setPicked] = useState<string[]>(selectedIds);
    const toggle = (id: string) =>
        setPicked((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md mx-4 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Link2 size={16} className="text-blue-500" /> Link Tasks to Key Result
                    </h4>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                    Checked tasks auto-calculate KR progress. Uncheck all to use manual %.
                </p>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {allTasks.map((t) => (
                        <label key={t.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                            <input type="checkbox" checked={picked.includes(t.id)} onChange={() => toggle(t.id)} className="w-4 h-4 rounded accent-blue-500" />
                            <div className="min-w-0">
                                <p className="text-sm text-slate-800 dark:text-slate-200 font-medium truncate">{t.title}</p>
                                <p className="text-[10px] text-slate-400">{t.status} · {t.progressPercentage}%</p>
                            </div>
                        </label>
                    ))}
                </div>
                <div className="flex gap-2 mt-4">
                    <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                    <button onClick={() => { onSave(picked); onClose(); }} className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">Save Links</button>
                </div>
            </div>
        </div>
    );
};

// ── Main component ────────────────────────────────────────────────────────────
const OKRProgress: React.FC<Props> = ({
    programName, occasion, okrs, tasks,
    canEdit = false, onOKRsChange, onProgramNameChange, onOccasionChange, onSave,
}) => {
    const [editingId,  setEditingId]  = useState<string | null>(null);
    const [editText,   setEditText]   = useState("");
    const [pickerFor,  setPickerFor]  = useState<string | null>(null);
    const [isSaving,   setIsSaving]   = useState(false);
    const [saved,      setSaved]      = useState(false);

    const handleSave = async () => {
        if (!onSave) return;
        setIsSaving(true);
        setSaved(false);
        try {
            await onSave();
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } finally {
            setIsSaving(false);
        }
    };

    const resolved = okrs.map((okr) => ({ ...okr, computed: calcKRProgress(okr, tasks) }));
    const avgProgress = Math.round(resolved.reduce((s, o) => s + o.computed, 0) / (resolved.length || 1));
    const achieved = resolved.filter((o) => o.computed === 100).length;
    const onTrack  = resolved.filter((o) => o.computed >= 60 && o.computed < 100).length;
    const atRisk   = resolved.filter((o) => o.computed < 60).length;

    const ringColor =
        avgProgress === 100 ? "#10b981" :
        avgProgress >= 60   ? "#3b82f6" :
        avgProgress >= 30   ? "#f59e0b" : "#f43f5e";

    const startEdit  = (okr: PMOKR) => { setEditingId(okr.id); setEditText(okr.objective); };
    const cancelEdit = () => { setEditingId(null); setEditText(""); };
    const saveEdit   = (id: string) => {
        if (!editText.trim()) return;
        onOKRsChange?.(okrs.map((o) => o.id === id ? { ...o, objective: editText.trim() } : o));
        cancelEdit();
    };
    const deleteKR = (id: string) => onOKRsChange?.(okrs.filter((o) => o.id !== id));
    const updatePct = (id: string, pct: number) =>
        onOKRsChange?.(okrs.map((o) => o.id === id ? { ...o, progressPercentage: Math.max(0, Math.min(100, pct)) } : o));
    const addKR = () => {
        const newKR: PMOKR = { id: `okr_${Date.now()}`, objective: "New Key Result", progressPercentage: 0, taskIds: [] };
        onOKRsChange?.([...okrs, newKR]);
        setEditingId(newKR.id);
        setEditText(newKR.objective);
    };
    const saveTaskLinks = (krId: string, ids: string[]) =>
        onOKRsChange?.(okrs.map((o) => o.id === krId ? { ...o, taskIds: ids } : o));

    const pickerKR = pickerFor ? okrs.find((o) => o.id === pickerFor) : null;

    return (
        <>
            {pickerKR && (
                <TaskPicker
                    allTasks={tasks}
                    selectedIds={pickerKR.taskIds ?? []}
                    onSave={(ids) => saveTaskLinks(pickerKR.id, ids)}
                    onClose={() => setPickerFor(null)}
                />
            )}

            <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 backdrop-blur-sm">

                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <Target size={18} className="text-emerald-500" />
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white">OKR Progress</h3>
                    </div>
                    {canEdit && (
                        <div className="flex items-center gap-2">
                            <button onClick={addKR} className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 px-2.5 py-1 rounded-full transition-colors">
                                <Plus size={12} /> Add KR
                            </button>
                            {onSave && (
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
                                        saved
                                            ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600"
                                    } disabled:opacity-50`}
                                >
                                    {isSaving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
                                    {isSaving ? "Saving…" : saved ? "Saved ✓" : "Save"}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Objective + Occasion — both editable */}
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-slate-400">Objective: </span>
                    {canEdit
                        ? <InlineEdit value={programName} onSave={(v) => onProgramNameChange?.(v)} className="font-medium text-slate-700 dark:text-slate-300 text-xs" />
                        : <span className="font-medium text-slate-700 dark:text-slate-300">{programName}</span>
                    }
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                    <span className="text-slate-400">Occasion: </span>
                    {canEdit
                        ? <InlineEdit value={occasion} onSave={(v) => onOccasionChange?.(v)} className="font-medium text-slate-700 dark:text-slate-300 text-xs" placeholder="e.g. Annual Tech Summit" />
                        : <span className="font-medium text-slate-700 dark:text-slate-300">{occasion}</span>
                    }
                </div>

                {/* ── Ring ── */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative w-36 h-36">
                        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="52" fill="none" strokeWidth="10" className="stroke-slate-100 dark:stroke-slate-700" />
                            <circle cx="60" cy="60" r="52" fill="none" strokeWidth="10"
                                stroke={ringColor} strokeLinecap="round"
                                strokeDasharray={`${(avgProgress / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                                style={{ transition: "stroke-dasharray 0.8s ease-out" }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{avgProgress}%</span>
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">overall</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full"><CheckCircle2 size={11} /> {achieved} Achieved</span>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-full"><Target size={11} /> {onTrack} On Track</span>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full"><AlertTriangle size={11} /> {atRisk} At Risk</span>
                    </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700/50 mb-5" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Key Results</p>

                {/* ── Key Results ── */}
                <div className="space-y-5">
                    {resolved.map((okr, i) => {
                        const status = getStatus(okr.computed);
                        const linkedTasks = tasks.filter((t) => okr.taskIds?.includes(t.id));
                        const isEditing   = editingId === okr.id;
                        const hasLinks    = linkedTasks.length > 0;

                        return (
                            <div key={okr.id} className={`group rounded-xl transition-colors ${canEdit ? "hover:bg-slate-50 dark:hover:bg-slate-700/20 -mx-2 px-2 py-1" : ""}`}>
                                {/* Title row */}
                                <div className="flex items-start justify-between mb-1.5 gap-2">
                                    <div className="flex items-start gap-2 min-w-0 flex-1">
                                        <span className="text-[11px] font-bold text-slate-400 w-5 shrink-0 pt-0.5">KR{i + 1}</span>
                                        {isEditing ? (
                                            <div className="flex items-center gap-1.5 flex-1">
                                                <input
                                                    autoFocus value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === "Enter") saveEdit(okr.id); if (e.key === "Escape") cancelEdit(); }}
                                                    className="flex-1 text-sm font-medium bg-white dark:bg-slate-800 border border-blue-400 rounded-lg px-2.5 py-1 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                                />
                                                <button onClick={() => saveEdit(okr.id)} className="p-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"><Check size={13} /></button>
                                                <button onClick={cancelEdit} className="p-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300"><X size={13} /></button>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-tight">{okr.objective}</span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                        {!isEditing && (
                                            <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.color} ${status.bg}`}>
                                                {status.icon} {status.label}
                                            </span>
                                        )}
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 w-9 text-right">{okr.computed}%</span>
                                        {canEdit && !isEditing && (
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                                                <button onClick={() => setPickerFor(okr.id)} title="Link tasks" className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-500/20 text-slate-400 hover:text-blue-500"><Link2 size={13} /></button>
                                                <button onClick={() => startEdit(okr)} title="Edit name" className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white"><Pencil size={13} /></button>
                                                <button onClick={() => deleteKR(okr.id)} title="Delete KR" className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500"><Trash2 size={13} /></button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2 ml-7">
                                    <div className={`h-full rounded-full bg-gradient-to-r ${barColor(okr.computed)} transition-all duration-700 ease-out`} style={{ width: `${okr.computed}%` }} />
                                </div>

                                {/* Manual % slider — shown in edit mode when no task links (task-linked KRs auto-calculate) */}
                                {canEdit && !hasLinks && (
                                    <div className="ml-7 mt-2 flex items-center gap-2">
                                        <SlidersHorizontal size={11} className="text-slate-400 shrink-0" />
                                        <input
                                            type="range" min={0} max={100} step={5}
                                            value={okr.progressPercentage}
                                            onChange={(e) => updatePct(okr.id, Number(e.target.value))}
                                            className="flex-1 h-1.5 accent-blue-500"
                                        />
                                        <input
                                            type="number" min={0} max={100}
                                            value={okr.progressPercentage}
                                            onChange={(e) => updatePct(okr.id, Number(e.target.value))}
                                            className="w-12 text-xs text-center bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md py-0.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                        />
                                        <span className="text-[10px] text-slate-400">%</span>
                                    </div>
                                )}
                                {canEdit && hasLinks && (
                                    <p className="ml-7 mt-1 text-[10px] text-slate-400 italic">
                                        % auto-calculated from {linkedTasks.length} linked task{linkedTasks.length !== 1 ? "s" : ""} · <button onClick={() => setPickerFor(okr.id)} className="underline hover:text-blue-500">manage links</button>
                                    </p>
                                )}

                                {/* Task pills */}
                                {linkedTasks.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1 ml-7">
                                        {linkedTasks.map((t) => (
                                            <span key={t.id}
                                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium border
                                                    ${t.status === 'Done' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20'
                                                    : t.status === 'On going' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20'
                                                    : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-700/30 dark:border-slate-600/30'}`}
                                            >
                                                {t.status === 'Done' ? '✓ ' : ''}{t.title} · {t.progressPercentage}%
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {canEdit && !hasLinks && !isEditing && (
                                    <button onClick={() => setPickerFor(okr.id)} className="ml-7 mt-1 text-[10px] text-slate-400 hover:text-blue-500 flex items-center gap-1 transition-colors">
                                        <Link2 size={10} /> Link tasks to auto-calculate instead
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default OKRProgress;
