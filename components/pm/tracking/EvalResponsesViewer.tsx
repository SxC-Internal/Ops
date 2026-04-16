"use client";

import React, { useState, useEffect } from "react";
import {
    ChevronRight, ArrowLeft, CheckCircle2, Clock, Loader2, Users, FileText,
    Pencil, Trash2, Download, X, Save, AlertTriangle, MessageSquare,
    Plus, GripVertical, CircleDot, AlignLeft,
} from "lucide-react";
import * as XLSX from "xlsx";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface EvalSummary {
    id: string;
    title: string;
    deadline: string;
    createdAt: string;
    targetRoles: string;
    createdBy: { name: string };
    _count: { responses: number };
}

interface Choice { id: string; text: string; }
interface Question { id: string; text: string; type: "choice" | "text"; choices: Choice[]; }

interface Respondent { id: string; name: string; email: string; }
interface Answer     { questionId: string; value: string | number; }
interface Response   { id: string; respondent: Respondent; submittedAt: string; answers: Answer[]; }
interface ResponseDetail { questions: Question[]; responses: Response[]; pending: Respondent[]; }

const ROLE_OPTIONS = [
    { value: "member",  label: "Associates" },
    { value: "manager", label: "Managers" },
    { value: "head",    label: "Chiefs" },
];

const labelRole = (r: string) =>
    r === "member" ? "Associates" : r === "manager" ? "Managers" : r === "head" ? "Chiefs" : "All";

const resolveAnswer = (q: Question, value: string | number) =>
    q.type === "choice" ? (q.choices?.find((c) => c.id === String(value))?.text ?? String(value)) : String(value ?? "—");

const uid = () => Math.random().toString(36).slice(2, 9);
const makeQuestion = (): Question => ({ id: uid(), text: "", type: "choice", choices: [{ id: uid(), text: "" }] });

// ─── Edit modal question editor ─────────────────────────────────────────────────

function QuestionEditor({ questions, onChange }: { questions: Question[]; onChange: (qs: Question[]) => void }) {
    const set = (fn: (prev: Question[]) => Question[]) => onChange(fn(questions));

    const addQ = () => set((prev) => [...prev, makeQuestion()]);
    const removeQ = (qid: string) => set((prev) => prev.filter((q) => q.id !== qid));
    const updateQ = (qid: string, patch: Partial<Question>) =>
        set((prev) => prev.map((q) => (q.id === qid ? { ...q, ...patch } : q)));

    const addChoice  = (qid: string) =>
        set((prev) => prev.map((q) => q.id === qid ? { ...q, choices: [...(q.choices ?? []), { id: uid(), text: "" }] } : q));
    const removeChoice = (qid: string, cid: string) =>
        set((prev) => prev.map((q) => q.id === qid ? { ...q, choices: q.choices?.filter((c) => c.id !== cid) } : q));
    const updateChoice = (qid: string, cid: string, text: string) =>
        set((prev) => prev.map((q) => q.id === qid ? { ...q, choices: q.choices?.map((c) => c.id === cid ? { ...c, text } : c) } : q));

    return (
        <div className="space-y-3">
            {questions.map((q, qi) => (
                <div key={q.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <GripVertical size={14} className="text-slate-300 shrink-0" />
                        <span className="text-xs font-bold text-slate-400 w-5 shrink-0">Q{qi + 1}</span>
                        <input
                            type="text"
                            value={q.text}
                            onChange={(e) => updateQ(q.id, { text: e.target.value })}
                            placeholder="Question text..."
                            className="flex-1 text-sm bg-transparent border-b border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:outline-none py-0.5 text-slate-800 dark:text-slate-200 placeholder-slate-400"
                        />
                        {/* Type toggle */}
                        <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5 shrink-0">
                            <button
                                onClick={() => updateQ(q.id, { type: "choice", choices: q.choices?.length ? q.choices : [{ id: uid(), text: "" }] })}
                                className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md transition-all ${q.type === "choice" ? "bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-blue-400" : "text-slate-500"}`}
                            >
                                <CircleDot size={11} /> Choice
                            </button>
                            <button
                                onClick={() => updateQ(q.id, { type: "text" })}
                                className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md transition-all ${q.type === "text" ? "bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-blue-400" : "text-slate-500"}`}
                            >
                                <AlignLeft size={11} /> Text
                            </button>
                        </div>
                        <button onClick={() => removeQ(q.id)} className="text-slate-400 hover:text-red-500 transition-colors shrink-0"><Trash2 size={14} /></button>
                    </div>

                    {q.type === "choice" && (
                        <div className="pl-7 space-y-1.5">
                            {(q.choices ?? []).map((c, ci) => (
                                <div key={c.id} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                                    <input
                                        type="text"
                                        value={c.text}
                                        onChange={(e) => updateChoice(q.id, c.id, e.target.value)}
                                        placeholder={`Option ${ci + 1}`}
                                        className="flex-1 text-xs bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none py-1 text-slate-700 dark:text-slate-300"
                                    />
                                    <button onClick={() => removeChoice(q.id, c.id)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={12} /></button>
                                </div>
                            ))}
                            <button onClick={() => addChoice(q.id)} className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 mt-1 transition-colors">
                                <Plus size={12} /> Add option
                            </button>
                        </div>
                    )}
                    {q.type === "text" && (
                        <div className="pl-7">
                            <div className="text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-700/50 rounded px-2 py-1">
                                Respondents will type a free text answer here
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <button
                onClick={addQ}
                className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl py-3 text-sm font-medium text-slate-400 hover:text-blue-500 hover:border-blue-300 dark:hover:border-blue-500/50 transition-all"
            >
                <Plus size={14} className="inline mr-1" />Add Question
            </button>
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function EvalResponsesViewer() {
    const [evals, setEvals]               = useState<EvalSummary[]>([]);
    const [loading, setLoading]           = useState(true);
    const [selected, setSelected]         = useState<EvalSummary | null>(null);
    const [detail, setDetail]             = useState<ResponseDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [viewingResponse, setViewingResponse] = useState<Response | null>(null);

    // Edit state
    const [editMode, setEditMode]         = useState(false);
    const [editTitle, setEditTitle]       = useState("");
    const [editDeadline, setEditDeadline] = useState("");
    const [editRoles, setEditRoles]       = useState<string[]>([]);
    const [editQuestions, setEditQuestions] = useState<Question[]>([]);
    const [editSaving, setEditSaving]     = useState(false);
    const [saveMsg, setSaveMsg]           = useState("");

    // Delete state
    const [deleteTarget, setDeleteTarget] = useState<EvalSummary | null>(null);
    const [deleting, setDeleting]         = useState(false);

    const [exporting, setExporting]       = useState(false);

    // ── Load list ─────────────────────────────────────────────────────────────
    const loadEvals = async () => {
        setLoading(true);
        try {
            const res  = await fetch("/api/evaluations");
            const data = await res.json();
            setEvals(data.data ?? []);
        } catch { setEvals([]); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadEvals(); }, []);

    // ── Load detail ───────────────────────────────────────────────────────────
    const loadDetail = async (ev: EvalSummary) => {
        setSelected(ev);
        setDetail(null);
        setViewingResponse(null);
        setEditMode(false);
        setSaveMsg("");
        setDetailLoading(true);
        try {
            const res  = await fetch(`/api/evaluations/${ev.id}/responses`);
            const data = await res.json();
            setDetail(data.data);
        } catch { setDetail({ questions: [], responses: [], pending: [] }); }
        finally { setDetailLoading(false); }
    };

    // ── Open edit panel ───────────────────────────────────────────────────────
    const openEdit = (ev: EvalSummary, currentQuestions: Question[]) => {
        setEditTitle(ev.title);
        setEditDeadline(new Date(ev.deadline).toISOString().slice(0, 16));
        setEditRoles((ev.targetRoles ?? "all") === "all" ? ["member", "manager", "head"] : (ev.targetRoles ?? "").split(","));
        // Deep-clone questions so edits are isolated
        setEditQuestions(JSON.parse(JSON.stringify(currentQuestions)));
        setSaveMsg("");
        setEditMode(true);
    };

    // ── Save edit ─────────────────────────────────────────────────────────────
    const handleSaveEdit = async () => {
        if (!selected) return;
        setEditSaving(true);
        setSaveMsg("");
        try {
            const res = await fetch(`/api/evaluations/${selected.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: editTitle,
                    deadline: editDeadline,
                    targetRoles: editRoles.join(","),
                    questions: editQuestions,
                }),
            });
            if (res.ok) {
                const { data } = await res.json();
                const cleared: number = data.responsesCleared ?? 0;
                const updated = { ...selected, title: editTitle, deadline: editDeadline, targetRoles: editRoles.join(",") };
                setSelected(updated);
                setEvals((prev) => prev.map((e) => e.id === updated.id ? { ...e, ...updated } : e));
                // Refresh detail (responses may have been cleared)
                await loadDetail(updated);
                setEditMode(false);
                if (cleared > 0) {
                    setSaveMsg(`✅ Form updated. ${cleared} existing response${cleared !== 1 ? "s" : ""} were cleared — respondents have been notified via dashboard reminder.`);
                } else {
                    setSaveMsg("✅ Form updated successfully.");
                }
            }
        } finally { setEditSaving(false); }
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/evaluations/${deleteTarget.id}`, { method: "DELETE" });
            if (res.ok) {
                setEvals((prev) => prev.filter((e) => e.id !== deleteTarget.id));
                if (selected?.id === deleteTarget.id) setSelected(null);
                setDeleteTarget(null);
            }
        } finally { setDeleting(false); }
    };

    // ── Excel export ──────────────────────────────────────────────────────────
    const handleExport = async () => {
        if (!selected || !detail) return;
        setExporting(true);
        try {
            const { questions, responses } = detail;
            const headers = ["Respondent Name", "Email", "Submitted At", ...questions.map((q, i) => `Q${i + 1}: ${q.text}`)];
            const rows = responses.map((r) => [
                r.respondent.name,
                r.respondent.email,
                new Date(r.submittedAt).toLocaleString(),
                ...questions.map((q) => { const a = r.answers.find((x) => x.questionId === q.id); return a ? resolveAnswer(q, a.value) : ""; }),
            ]);
            const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
            ws["!cols"] = headers.map((h) => ({ wch: Math.max(16, h.length + 4) }));
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Responses");
            XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([["Name", "Email"], ...detail.pending.map((u) => [u.name, u.email])]), "Pending");
            XLSX.writeFile(wb, `${selected.title.replace(/\s+/g, "_")}_responses.xlsx`);
        } finally { setExporting(false); }
    };

    // ─── Individual answer view ───────────────────────────────────────────────
    if (viewingResponse && detail) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 animate-in slide-in-from-right-4 duration-300">
                <button onClick={() => setViewingResponse(null)} className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-5 transition-colors">
                    <ArrowLeft size={15} /> Back to responses
                </button>
                <div className="mb-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                        {viewingResponse.respondent.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{viewingResponse.respondent.name}</h3>
                        <p className="text-xs text-slate-400">Submitted {new Date(viewingResponse.submittedAt).toLocaleString()}</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {detail.questions.map((q, i) => {
                        const ans    = viewingResponse.answers.find((a) => a.questionId === q.id);
                        const label  = ans ? resolveAnswer(q, ans.value) : null;
                        return (
                            <div key={q.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Q{i + 1} · {q.type}</p>
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">{q.text}</p>
                                <div className="flex items-start gap-2">
                                    <MessageSquare size={13} className="text-blue-400 mt-0.5 shrink-0" />
                                    {label ? <p className="text-sm text-slate-700 dark:text-slate-300">{label}</p> : <p className="text-sm italic text-slate-400">No answer</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ─── Detail view ─────────────────────────────────────────────────────────
    if (selected) {
        const isExpired = new Date(selected.deadline) < new Date();
        const total     = (detail?.responses.length ?? 0) + (detail?.pending.length ?? 0);
        const doneCount = detail?.responses.length ?? 0;
        const pct       = total > 0 ? Math.round((doneCount / total) * 100) : 0;
        const roles     = (selected.targetRoles ?? "all").split(",").map(labelRole).join(", ");

        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 animate-in slide-in-from-right-4 duration-300">
                <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-5 transition-colors">
                    <ArrowLeft size={15} /> Back to forms
                </button>

                {/* Header */}
                <div className="mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selected.title}</h3>
                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                <Clock size={11} />
                                Deadline: {new Date(selected.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                &nbsp;· For: {roles}
                            </p>
                        </div>
                        {!isExpired && (
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => openEdit(selected, detail?.questions ?? [])}
                                    disabled={detailLoading}
                                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    <Pencil size={13} /> Edit
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(selected)}
                                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={13} /> Delete
                                </button>
                            </div>
                        )}
                    </div>

                    {!detailLoading && detail && detail.responses.length > 0 && (
                        <button
                            onClick={handleExport}
                            disabled={exporting}
                            className="mt-3 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                        >
                            {exporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                            Export to Excel (.xlsx)
                        </button>
                    )}

                    {saveMsg && (
                        <p className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-lg px-3 py-2">
                            {saveMsg}
                        </p>
                    )}
                </div>

                {/* ── Edit panel ────────────────────────────────────────────── */}
                {editMode && (
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-xl space-y-4">
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Editing Form</p>

                        {/* Title */}
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Form title"
                            className="w-full text-sm px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        />

                        {/* Deadline */}
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Deadline</label>
                            <input
                                type="datetime-local"
                                value={editDeadline}
                                onChange={(e) => setEditDeadline(e.target.value)}
                                className="w-full text-sm px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                            />
                        </div>

                        {/* Roles */}
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1.5 block">Send to</label>
                            <div className="flex gap-2 flex-wrap">
                                {ROLE_OPTIONS.map((r) => (
                                    <button
                                        key={r.value}
                                        onClick={() => setEditRoles((prev) =>
                                            prev.includes(r.value) ? prev.filter((x) => x !== r.value) : [...prev, r.value]
                                        )}
                                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                                            editRoles.includes(r.value)
                                                ? "bg-blue-500 border-blue-500 text-white"
                                                : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400"
                                        }`}
                                    >
                                        {r.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Questions */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <label className="text-xs font-medium text-slate-500">Questions</label>
                                {/* Warning if responses exist */}
                                {(detail?.responses.length ?? 0) > 0 && (
                                    <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-full px-2 py-0.5">
                                        <AlertTriangle size={9} /> {detail!.responses.length} existing response{detail!.responses.length !== 1 ? "s" : ""} will be cleared if you change questions
                                    </span>
                                )}
                            </div>
                            <QuestionEditor questions={editQuestions} onChange={setEditQuestions} />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-1">
                            <button
                                onClick={handleSaveEdit}
                                disabled={editSaving || !editTitle.trim() || editRoles.length === 0 || editQuestions.length === 0}
                                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 transition-colors"
                            >
                                {editSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save & Resend
                            </button>
                            <button onClick={() => setEditMode(false)} className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-3 py-2 transition-colors">
                                <X size={13} className="inline mr-1" />Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Completion bar */}
                {!detailLoading && detail && !editMode && (
                    <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Users size={14} /> Completion Rate</span>
                            <span className="text-sm font-bold text-emerald-600">{doneCount}/{total} responded</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-xs text-slate-400 mt-1.5">{pct}% completion</p>
                    </div>
                )}

                {detailLoading && (
                    <div className="flex items-center justify-center py-10 gap-2 text-slate-400">
                        <Loader2 size={18} className="animate-spin" /> Loading responses...
                    </div>
                )}

                {!detailLoading && detail && !editMode && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <CheckCircle2 size={12} /> Submitted ({detail.responses.length})
                            </h4>
                            {detail.responses.length === 0 ? (
                                <p className="text-sm text-slate-400 italic">No responses yet</p>
                            ) : (
                                <div className="space-y-2">
                                    {detail.responses.map((r) => (
                                        <button
                                            key={r.id}
                                            onClick={() => setViewingResponse(r)}
                                            className="w-full flex items-center gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:shadow-sm transition-all text-left group"
                                        >
                                            <div className="w-7 h-7 rounded-full bg-emerald-200 dark:bg-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                                                {r.respondent.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{r.respondent.name}</p>
                                                <p className="text-[10px] text-slate-400">{new Date(r.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                                            </div>
                                            <ChevronRight size={13} className="text-emerald-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <Clock size={12} /> Pending ({detail.pending.length})
                            </h4>
                            {detail.pending.length === 0 ? (
                                <p className="text-sm text-slate-400 italic">Everyone has responded 🎉</p>
                            ) : (
                                <div className="space-y-2">
                                    {detail.pending.map((u) => (
                                        <div key={u.id} className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                                            <div className="w-7 h-7 rounded-full bg-amber-200 dark:bg-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-400 shrink-0">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{u.name}</p>
                                                <p className="text-[10px] text-amber-500">Not yet submitted</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ─── Forms list ──────────────────────────────────────────────────────────
    return (
        <>
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-sm p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                                <AlertTriangle size={20} className="text-red-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Delete Form?</h3>
                                <p className="text-xs text-slate-500">This cannot be undone.</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                            "{deleteTarget.title}" and all its responses will be permanently deleted.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
                            <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50">
                                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 animate-in fade-in duration-300">
                <div className="mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Form Responses</h3>
                    <p className="text-sm text-slate-500">View, manage, and export your evaluation forms.</p>
                </div>

                {loading && <div className="flex items-center justify-center py-12 gap-2 text-slate-400"><Loader2 size={18} className="animate-spin" /> Loading forms...</div>}

                {!loading && evals.length === 0 && (
                    <div className="flex flex-col items-center py-12 text-center">
                        <FileText size={36} className="text-slate-300 dark:text-slate-600 mb-3" />
                        <p className="text-slate-500 font-medium">No forms published yet</p>
                        <p className="text-sm text-slate-400 mt-1">Use "Build Forms" to create and publish a form.</p>
                    </div>
                )}

                {!loading && evals.length > 0 && (
                    <div className="space-y-3">
                        {evals.map((ev) => {
                            const isExpired = new Date(ev.deadline) < new Date();
                            const roles     = (ev.targetRoles ?? "all").split(",").map(labelRole).join(", ");
                            return (
                                <div key={ev.id} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 hover:shadow-sm transition-all group">
                                    <button onClick={() => loadDetail(ev)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                                        <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                                            <FileText size={16} className="text-violet-600 dark:text-violet-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h4 className="font-bold text-slate-900 dark:text-white truncate">{ev.title}</h4>
                                                <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isExpired ? "bg-slate-100 text-slate-500 dark:bg-slate-700" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"}`}>
                                                    {isExpired ? "Closed" : "Active"}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400">For: {roles} · {ev._count.responses} response{ev._count.responses !== 1 ? "s" : ""}</p>
                                        </div>
                                    </button>
                                    {!isExpired && (
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={(e) => { e.stopPropagation(); loadDetail(ev); }} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors" title="Edit form"><Pencil size={14} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(ev); }} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Delete form"><Trash2 size={14} /></button>
                                        </div>
                                    )}
                                    <ChevronRight size={16} className="text-slate-400 shrink-0" />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
