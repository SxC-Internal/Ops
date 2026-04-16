"use client";

import React, { useState } from "react";
import {
    Folder, ChevronLeft, ExternalLink, RefreshCw,
    AlertTriangle
} from "lucide-react";

// Font is loaded globally — referenced here for clarity
const fontStyle = { fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" };

interface BatchEntry {
    id: number;
    name: string;
    description: string;
    driveFolderId: string | null;
    comingSoon?: boolean;
}

const BATCHES: BatchEntry[] = [
    {
        id: 14,
        name: "Batch 14 Database",
        description: "Current active database for Batch 14",
        driveFolderId: null,
        comingSoon: true,
    },
    {
        id: 13,
        name: "Batch 13 Archive",
        description: "Archived records from Batch 13",
        driveFolderId: "1dcCs6dZgMnPx68toikCTFsRv67R5QOc3",
    },
    {
        id: 12,
        name: "Batch 12 Archive",
        description: "Archived records from Batch 12",
        driveFolderId: "1EkWIEagjZd5HKBOUKVL4NtpGsKINJMI0",
    },
];

function driveEmbedUrl(folderId: string) {
    return `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
}

function driveOpenUrl(folderId: string) {
    return `https://drive.google.com/drive/folders/${folderId}`;
}

const DatabaseTab: React.FC = () => {
    const [activeBatch, setActiveBatch] = useState<BatchEntry | null>(null);
    const [iframeKey,   setIframeKey]   = useState(0); // force reload

    if (activeBatch) {
        // Coming soon screen
        if (activeBatch.comingSoon) {
            return (
                <div className="space-y-4 animate-in fade-in" style={fontStyle}>
                    <button onClick={() => setActiveBatch(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                        <ChevronLeft size={16} /> Back to Batches
                    </button>
                    <div className="flex flex-col items-center justify-center py-24 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-5">
                            <Folder size={32} className="text-blue-400" fill="currentColor" fillOpacity={0.15} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{activeBatch.name}</h3>
                        <span className="text-xs font-semibold bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full mb-3">Coming Soon</span>
                        <p className="text-sm text-slate-400 dark:text-slate-500">This database is not available yet.</p>
                    </div>
                </div>
            );
        }

        const embedUrl = activeBatch.driveFolderId
            ? driveEmbedUrl(activeBatch.driveFolderId)
            : null;

        return (
            <div className="space-y-4 animate-in fade-in" style={fontStyle}>
                {/* Top bar */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setActiveBatch(null)}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                    >
                        <ChevronLeft size={16} />
                        Back to Batches
                    </button>

                    {activeBatch.driveFolderId && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIframeKey((k) => k + 1)}
                                title="Reload"
                                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-white transition-all"
                            >
                                <RefreshCw size={14} />
                            </button>
                            <a
                                href={driveOpenUrl(activeBatch.driveFolderId)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
                            >
                                <ExternalLink size={12} />
                                Open in Drive
                            </a>
                        </div>
                    )}
                </div>

                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Folder size={18} className="text-blue-500" fill="currentColor" fillOpacity={0.2} />
                    {activeBatch.name}
                </h2>

                {/* Drive embed or placeholder */}
                {embedUrl ? (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-blue-200 dark:border-blue-500/40 bg-white dark:bg-slate-900 shadow-xl ring-4 ring-blue-500/10">
                        {/* Embed */}
                        <iframe
                            key={iframeKey}
                            src={embedUrl}
                            className="w-full"
                            style={{ height: "65vh", border: "none" }}
                            title={`${activeBatch.name} — Google Drive`}
                            allow="autoplay"
                        />

                        {/* Notice bar at bottom */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-500/10 border-t border-amber-200 dark:border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
                            <AlertTriangle size={12} className="shrink-0" />
                            Folder must be shared as <strong className="mx-1">"Anyone with the link can view"</strong> for this embed to display. If it's blank, use "Open in Drive" above.
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-center bg-white dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                        <Folder size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium">No Drive folder linked yet</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            Add the Google Drive folder ID to <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">BATCHES</code> in <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">DatabaseTab.tsx</code>
                        </p>
                    </div>
                )}
            </div>
        );
    }

    // ── Main folder grid ───────────────────────────────────────────────────────
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in" style={fontStyle}>
            {BATCHES.map((batch) => (
                <button
                    key={batch.id}
                    onClick={() => setActiveBatch(batch)}
                    className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:border-blue-500/50 hover:shadow-lg transition-all group"
                >
                    <div className="relative w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Folder className="w-8 h-8 text-blue-500" fill="currentColor" fillOpacity={0.2} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                        {batch.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                        {batch.description}
                    </p>

                </button>
            ))}
        </div>
    );
};

export default DatabaseTab;
