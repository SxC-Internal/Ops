"use client";

import React, { useState } from "react";
import { Plus, Trash2, GripVertical, Send, CheckSquare, Square, Calendar, FileText, Check } from "lucide-react";
import type { QuestionChoice } from "@/types/pm-types";

export type QuestionType = "text" | "rating" | "boolean" | "choice";

export interface EvaluationQuestion {
    id: string;
    text: string;
    type: QuestionType;
    choices?: QuestionChoice[];
}

type Role = "member" | "manager" | "head";

const ROLE_OPTIONS: { id: Role; label: string; desc: string }[] = [
    { id: "member",  label: "Associates", desc: "Regular members"       },
    { id: "manager", label: "Managers",   desc: "Division managers"     },
    { id: "head",    label: "Chiefs",     desc: "Department head/chief" },
];

export default function EvaluationBuilder() {
    const [title, setTitle]             = useState("");
    const [deadline, setDeadline]       = useState("");
    const [targetRoles, setTargetRoles] = useState<Role[]>(["member"]);
    const [questions, setQuestions]     = useState<EvaluationQuestion[]>([
        {
            id: "1",
            text: "How motivated did you feel this week?",
            type: "choice",
            choices: [
                { id: "c1", text: "Highly Motivated",    value: 100 },
                { id: "c2", text: "Moderately Motivated", value: 75  },
                { id: "c3", text: "Struggling but Going", value: 50  },
                { id: "c4", text: "Burnt Out",            value: 0   },
            ],
        },
        { id: "2", text: "What blockers did you face?", type: "text" },
    ]);
    const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

    const toggleRole = (role: Role) => {
        setTargetRoles((prev) =>
            prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
        );
    };

    const handleAddQuestion = (type: QuestionType) => {
        setQuestions([
            ...questions,
            {
                id: Date.now().toString(),
                text: "New Question",
                type,
                choices: type === "choice" ? [{ id: Date.now().toString() + "_c", text: "Option 1", value: 100 }] : undefined,
            },
        ]);
    };

    const handleRemoveQuestion = (id: string) => setQuestions(questions.filter((q) => q.id !== id));

    const handleTextChange = (id: string, newText: string) =>
        setQuestions(questions.map((q) => (q.id === id ? { ...q, text: newText } : q)));

    const handleAddChoice = (qId: string) => {
        setQuestions(questions.map((q) => {
            if (q.id === qId && q.choices) {
                return { ...q, choices: [...q.choices, { id: Date.now().toString(), text: `Option ${q.choices.length + 1}`, value: 0 }] };
            }
            return q;
        }));
    };

    const handleUpdateChoice = (qId: string, choiceId: string, field: "text" | "value", value: string | number) => {
        setQuestions(questions.map((q) => {
            if (q.id === qId && q.choices) {
                return { ...q, choices: q.choices.map((c) => c.id === choiceId ? { ...c, [field]: value } : c) };
            }
            return q;
        }));
    };

    const handleRemoveChoice = (qId: string, choiceId: string) => {
        setQuestions(questions.map((q) => {
            if (q.id === qId && q.choices) {
                return { ...q, choices: q.choices.filter((c) => c.id !== choiceId) };
            }
            return q;
        }));
    };

    const handlePublish = async () => {
        if (!title.trim() || !deadline || !questions.length || !targetRoles.length) return;
        setStatus("saving");
        try {
            const res = await fetch("/api/evaluations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, questions, deadline, targetRoles }),
            });
            if (!res.ok) throw new Error("Failed");
            setStatus("success");
            // Reset after 3s
            setTimeout(() => {
                setStatus("idle");
                setTitle("");
                setDeadline("");
                setTargetRoles(["member"]);
                setQuestions([
                    { id: "1", text: "New Question", type: "choice", choices: [{ id: "c1", text: "Option 1", value: 100 }] }
                ]);
            }, 3000);
        } catch {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    const canPublish = title.trim().length > 0 && deadline.length > 0 && questions.length > 0 && targetRoles.length > 0;

    if (status === "success") {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-16 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <Check size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Form Published!</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm">
                    "{title}" has been published and is now visible to the targeted roles.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center">
                    <FileText size={18} className="text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Form Builder</h3>
                    <p className="text-xs text-slate-500">Build and publish evaluation forms to your team</p>
                </div>
            </div>

            {/* Form meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                {/* Title */}
                <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Form Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Weekly Associate Sync — Week 14"
                        className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>

                {/* Deadline */}
                <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                        <Calendar size={11} /> Deadline *
                    </label>
                    <input
                        type="datetime-local"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>

                {/* Target roles */}
                <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Send To *</label>
                    <div className="flex flex-col gap-2">
                        {ROLE_OPTIONS.map((opt) => {
                            const checked = targetRoles.includes(opt.id);
                            return (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => toggleRole(opt.id)}
                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm transition-all text-left ${
                                        checked
                                            ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300"
                                            : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                                    }`}
                                >
                                    {checked ? <CheckSquare size={14} className="text-violet-500 shrink-0" /> : <Square size={14} className="text-slate-400 shrink-0" />}
                                    <span className="font-medium">{opt.label}</span>
                                    <span className="text-xs opacity-60">{opt.desc}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Add question buttons */}
            <div className="flex gap-2 flex-wrap mb-4">
                <button onClick={() => handleAddQuestion("choice")} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-lg hover:bg-violet-500/20 transition-colors">
                    <Plus size={13} /> Add Choice (Scored)
                </button>
                <button onClick={() => handleAddQuestion("text")} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors">
                    <Plus size={13} /> Add Text
                </button>
            </div>

            {/* Questions */}
            <div className="space-y-5 mb-6">
                {questions.map((q, index) => (
                    <div key={q.id} className="flex gap-3 items-start group">
                        <div className="mt-2 text-slate-400 cursor-grab"><GripVertical size={15} /></div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Q{index + 1} · {q.type}</span>
                            </div>
                            <div className="relative mb-2">
                                <input
                                    type="text"
                                    value={q.text}
                                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                                    className="w-full text-sm font-medium text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-violet-500 rounded-lg py-2.5 px-3 pr-10 hover:border-slate-300 transition-colors"
                                />
                                <button onClick={() => handleRemoveQuestion(q.id)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={15} />
                                </button>
                            </div>

                            {q.type === "choice" && q.choices && (
                                <div className="ml-4 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 pl-4 mt-3">
                                    {q.choices.map((choice, cIndex) => (
                                        <div key={choice.id} className="flex items-center gap-2">
                                            <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                                            <input
                                                type="text"
                                                value={choice.text}
                                                onChange={(e) => handleUpdateChoice(q.id, choice.id, "text", e.target.value)}
                                                placeholder={`Option ${cIndex + 1}`}
                                                className="text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-violet-500 focus:outline-none flex-1 py-1 text-slate-700 dark:text-slate-300 transition-colors"
                                            />
                                            <button onClick={() => handleRemoveChoice(q.id, choice.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={13} /></button>
                                        </div>
                                    ))}
                                    <button onClick={() => handleAddChoice(q.id)} className="text-xs text-violet-500 hover:text-violet-600 font-medium flex items-center gap-1 mt-1">
                                        <Plus size={11} /> Add Option
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {questions.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                        No questions yet — add one above.
                    </div>
                )}
            </div>

            {/* Publish */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                {status === "error" && (
                    <p className="text-sm text-red-500">Failed to publish. Please try again.</p>
                )}
                <div className="ml-auto">
                    <button
                        onClick={handlePublish}
                        disabled={!canPublish || status === "saving"}
                        className="flex items-center gap-2 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={15} />
                        {status === "saving" ? "Publishing..." : "Publish Form"}
                    </button>
                </div>
            </div>
        </div>
    );
}
