"use client";

import React, { useState } from 'react';
import { Link2, Video, FolderDown, ExternalLink, Plus, Trash2, X, Send, Calendar, AlignLeft, Globe } from 'lucide-react';

export interface QuickLinkItem {
    id: string;
    title: string;
    subtitle: string;
    url?: string;
    meetingId?: string;
    type: 'zoom' | 'drive' | 'link';
    createdBy: string;
    createdById: string;
    createdAt?: string;
}

interface Props {
    links: QuickLinkItem[];
    canManage: boolean;
    currentUserId: string;
    currentUserName: string;
    onAddLink: (link: QuickLinkItem) => void;
    onDeleteLink: (id: string) => void;
}

const iconMap = { zoom: Video, drive: FolderDown, link: ExternalLink };
const colorMap = { zoom: { color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" }, drive: { color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" }, link: { color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" } };

// Auto-detect type from URL
function detectType(url: string): 'zoom' | 'drive' | 'link' {
    if (!url) return 'link';
    const lower = url.toLowerCase();
    if (lower.includes('zoom.us') || lower.includes('zoom.com')) return 'zoom';
    if (lower.includes('drive.google') || lower.includes('docs.google') || lower.includes('sheets.google')) return 'drive';
    return 'link';
}

const QuickLinks: React.FC<Props> = ({ links, canManage, currentUserId, currentUserName, onAddLink, onDeleteLink }) => {
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [newSubtitle, setNewSubtitle] = useState('');
    const [selectedLink, setSelectedLink] = useState<QuickLinkItem | null>(null);

    const handleSubmit = () => {
        if (!newTitle.trim()) return;
        const type = detectType(newUrl);
        onAddLink({
            id: `ql_${Date.now()}`,
            title: newTitle.trim(),
            subtitle: newSubtitle.trim() || newUrl.trim() || `Added by ${currentUserName}`,
            url: newUrl.trim() || undefined,
            type,
            createdBy: currentUserName,
            createdById: currentUserId,
            createdAt: new Date().toISOString(),
        });
        setNewTitle('');
        setNewUrl('');
        setNewSubtitle('');
        setShowForm(false);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Link2 size={18} className="text-indigo-500" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Quick Links</h3>
                </div>
                {canManage && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors"
                    >
                        {showForm ? <X size={14} /> : <Plus size={14} />}
                        {showForm ? "Cancel" : "Add"}
                    </button>
                )}
            </div>

            {/* Add form — flexible, no strict template */}
            {showForm && canManage && (
                <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600 space-y-2.5">
                    <input
                        type="text"
                        placeholder="Title (e.g. Weekly Sync, Design Review)..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full text-sm px-3 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                    <input
                        type="url"
                        placeholder="Link URL (optional — paste Zoom, Drive, or any link)..."
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="w-full text-sm px-3 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                    <input
                        type="text"
                        placeholder="Description (optional — e.g. Meeting ID, notes)..."
                        value={newSubtitle}
                        onChange={(e) => setNewSubtitle(e.target.value)}
                        className="w-full text-sm px-3 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                    {newUrl && (
                        <p className="text-[10px] text-slate-400">
                            Auto-detected: <span className="font-semibold capitalize">{detectType(newUrl)}</span>
                        </p>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={!newTitle.trim()}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                        <Send size={12} />
                        Post Link
                    </button>
                </div>
            )}

            <div className="space-y-2">
                {links.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-3">No links yet</p>
                ) : links.map((link) => {
                    const IconComp = iconMap[link.type];
                    const colors = colorMap[link.type];
                    return (
                        <div
                            key={link.id}
                            className="group w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600 text-left cursor-pointer"
                            onClick={() => {
                                if (link.url) {
                                    window.open(link.url, '_blank', 'noreferrer');
                                } else {
                                    setSelectedLink(link);
                                }
                            }}
                        >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colors.bg} ${colors.color}`}>
                                    <IconComp size={16} />
                                </div>
                                <div className="min-w-0">
                                    {link.url ? (
                                        <span className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors truncate block">{link.title}</span>
                                    ) : (
                                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{link.title}</p>
                                    )}
                                    <p className="text-xs text-slate-500 truncate">{link.subtitle}</p>
                                </div>
                            </div>
                            {canManage && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteLink(link.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-rose-500 p-1 rounded shrink-0"
                                    title="Delete link"
                                >
                                    <Trash2 size={13} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {selectedLink && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700/50">
                            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <Link2 size={18} className="text-indigo-500" />
                                Link Details
                            </h3>
                            <button
                                onClick={() => setSelectedLink(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                                    {selectedLink.title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Calendar size={14} />
                                    <span>
                                        {selectedLink.createdAt
                                            ? new Date(selectedLink.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })
                                            : 'No date provided'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-3 space-y-2 border border-slate-100 dark:border-slate-700/50">
                                <div className="flex mt-1">
                                    <AlignLeft size={16} className="text-slate-400 mt-1 shrink-0 mr-2" />
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 mb-0.5">Description</p>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{selectedLink.subtitle || 'No description provided'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                                    <span className="text-xs font-medium text-slate-500 w-24">Added by:</span>
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{selectedLink.createdBy}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/80 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedLink(null)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                            {selectedLink.url ? (
                                <a
                                    href={selectedLink.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Globe size={16} />
                                    Open Link
                                </a>
                            ) : (
                                <button
                                    disabled
                                    className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed rounded-lg flex items-center gap-2"
                                >
                                    <Globe size={16} />
                                    No Link
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuickLinks;
