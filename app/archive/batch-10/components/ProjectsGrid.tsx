"use client";

import React from 'react';
import { FileText, Image as ImageIcon, Presentation, ExternalLink, Users } from 'lucide-react';
import { BATCH_10_PROJECTS } from '../data';
import { Badge } from '@/components/ui/badge';

const getAssetIcon = (type: string) => {
    switch (type) {
        case 'image': return <ImageIcon size={16} />;
        case 'presentation': return <Presentation size={16} />;
        case 'doc':
        case 'pdf':
        default: return <FileText size={16} />;
    }
};

export default function ProjectsGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BATCH_10_PROJECTS.map((project) => (
                <div
                    key={project.id}
                    className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors flex flex-col h-full"
                >
                    <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline" className="bg-neutral-800 text-neutral-300 border-neutral-700">
                            {project.category}
                        </Badge>
                        <span className="text-sm text-neutral-500 font-medium">{project.date}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-neutral-400 text-sm mb-6 flex-grow">{project.description}</p>

                    <div className="space-y-4 mt-auto">
                        {/* Curated Assets */}
                        {project.assets.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Curated Assets</p>
                                <div className="flex flex-col gap-2">
                                    {project.assets.map((asset, idx) => (
                                        <a
                                            key={idx}
                                            href={asset.url}
                                            className="flex items-center justify-between p-2 rounded bg-neutral-800/50 hover:bg-neutral-800 text-sm text-neutral-300 transition-colors group"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-blue-400">{getAssetIcon(asset.type)}</span>
                                                <span>{asset.name}</span>
                                            </div>
                                            <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Project Managers */}
                        {project.managers.length > 0 && (
                            <div className="pt-4 border-t border-neutral-800/50 flex items-center gap-2 text-sm text-neutral-400">
                                <Users size={16} className="text-neutral-500" />
                                <span className="font-medium">Led by:</span>
                                <span>{project.managers.join(', ')}</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
