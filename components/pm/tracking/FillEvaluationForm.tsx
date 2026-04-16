"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Check, Send, Clock, ArrowLeft, Loader2, AlertCircle, FileText } from "lucide-react";
import type { EvaluationQuestion } from "./EvaluationBuilder";

interface ActiveEval {
    id: string;
    title: string;
    deadline: string;
    createdBy: { name: string };
    questions: EvaluationQuestion[];
}

export default function FillEvaluationForm() {
    const [forms, setForms]           = useState<ActiveEval[]>([]);
    const [loading, setLoading]       = useState(true);
    const [selected, setSelected]     = useState<ActiveEval | null>(null);
    const [answers, setAnswers]       = useState<Record<string, string | number>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted]   = useState(false);
    const [error, setError]           = useState<string | null>(null);

    const loadForms = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/evaluations/active");
            if (!res.ok) throw new Error("Failed to load forms");
            const data = await res.json();
            setForms(data.data ?? []);
        } catch {
            setForms([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadForms(); }, [loadForms]);

    const handleChoiceSelect = (qId: string, choiceId: string) =>
        setAnswers((prev) => ({ ...prev, [qId]: choiceId }));

    const handleTextChange = (qId: string, text: string) =>
        setAnswers((prev) => ({ ...prev, [qId]: text }));

    const handleSubmit = async () => {
        if (!selected) return;
        setSubmitting(true);
        setError(null);
        try {
            const answersArr = (selected.questions as EvaluationQuestion[]).map((q) => ({
                questionId: q.id,
                value: answers[q.id] ?? "",
            }));
            const res = await fetch(`/api/evaluations/${selected.id}/responses`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers: answersArr }),
            });
            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.error ?? "Failed to submit");
            }
            setSubmitted(true);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSubmitting(false);
        }
    };

    // ── Submitted success screen ───────────────────────────────────────────────
    if (submitted) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-14 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-5">
                    <Check size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Form Submitted!</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs text-sm">
                    Thank you for completing <strong>"{selected?.title}"</strong>. Your response has been recorded.
                </p>
                <button
                    onClick={() => {
                        setSubmitted(false);
                        setSelected(null);
                        setAnswers({});
                        loadForms();
                    }}
                    className="mt-6 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                    ← Back to my forms
                </button>
            </div>
        );
    }

    // ── Active form view ───────────────────────────────────────────────────────
    if (selected) {
        const questions = selected.questions as EvaluationQuestion[];
        const isReady = questions.every((q) =>
            q.type === "text" || (q.type === "choice" && answers[q.id] !== undefined)
        );

        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 animate-in slide-in-from-right-4 duration-300">
                <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition-colors">
                    <ArrowLeft size={15} /> Back to forms
                </button>

                <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        Active Form
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{selected.title}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock size={11} />
                        Due {new Date(selected.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        &nbsp;· Posted by {selected.createdBy?.name}
                    </p>
                </div>

                <div className="space-y-8 mb-8">
                    {questions.map((q, i) => (
                        <div key={q.id} className="space-y-3">
                            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                                {i + 1}. {q.text}
                                {q.type === "choice" && <span className="text-red-500 ml-1">*</span>}
                            </label>

                            {q.type === "text" && (
                                <textarea
                                    rows={3}
                                    placeholder="Type your answer here..."
                                    value={String(answers[q.id] ?? "")}
                                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                                    className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 p-3"
                                />
                            )}

                            {q.type === "choice" && q.choices && (
                                <div className="space-y-2">
                                    {q.choices.map((choice) => (
                                        <button
                                            key={choice.id}
                                            onClick={() => handleChoiceSelect(q.id, choice.id)}
                                            className={`w-full text-left p-3 rounded-lg border text-sm transition-all flex items-center gap-3 ${
                                                answers[q.id] === choice.id
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-medium"
                                                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border flex shrink-0 items-center justify-center ${answers[q.id] === choice.id ? "border-blue-500" : "border-slate-300 dark:border-slate-600"}`}>
                                                {answers[q.id] === choice.id && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                                            </div>
                                            {choice.text}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-sm text-red-500 mb-4 p-3 bg-red-50 dark:bg-red-500/10 rounded-lg">
                        <AlertCircle size={14} /> {error}
                    </div>
                )}

                <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !isReady}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? <><Loader2 size={15} className="animate-spin" /> Submitting...</> : <>Submit Form <Send size={15} /></>}
                    </button>
                </div>
            </div>
        );
    }

    // ── Form list ──────────────────────────────────────────────────────────────
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 animate-in fade-in duration-300">
            <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">My Forms</h3>
                <p className="text-sm text-slate-500">Evaluations assigned to you that need to be completed.</p>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-12 gap-2 text-slate-400">
                    <Loader2 size={18} className="animate-spin" /> Loading your forms...
                </div>
            )}

            {!loading && forms.length === 0 && (
                <div className="flex flex-col items-center py-12 text-center">
                    <FileText size={36} className="text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-slate-500 font-medium">No pending forms</p>
                    <p className="text-sm text-slate-400 mt-1">You're all caught up! Check back later.</p>
                </div>
            )}

            {!loading && forms.length > 0 && (
                <div className="space-y-3">
                    {forms.map((form) => {
                        const daysLeft = Math.ceil((new Date(form.deadline).getTime() - Date.now()) / 86400000);
                        return (
                            <button
                                key={form.id}
                                onClick={() => {
                                    setSelected(form);
                                    setAnswers({});
                                    setError(null);
                                }}
                                className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-4"
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                    <FileText size={16} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{form.title}</h4>
                                        <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">Active</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-1">Posted by {form.createdBy?.name}</p>
                                    <p className={`text-xs flex items-center gap-1 ${daysLeft <= 1 ? "text-red-500" : "text-slate-400"}`}>
                                        <Clock size={11} />
                                        {daysLeft <= 0 ? "Due today" : `Due in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
