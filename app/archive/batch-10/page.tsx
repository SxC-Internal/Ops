import React from 'react';
import { Badge } from "@/components/ui/badge";
import { MoveLeft, Calendar, Users, FolderKanban } from "lucide-react";
import Link from 'next/link';
import ProjectsGrid from './components/ProjectsGrid';
import MasterTimeline from './components/MasterTimeline';

export default function Batch10Archive() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Navigation Breadcrumb */}
                <Link
                    href="/"
                    className="inline-flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors"
                >
                    <MoveLeft size={16} />
                    <span>Back to Home</span>
                </Link>

                {/* Hero Header */}
                <header className="space-y-4">
                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                        Operations Division Archive
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Batch 10
                    </h1>
                    <p className="text-neutral-400 max-w-2xl text-lg leading-relaxed">
                        The operational hub and project showcase for StudentsxCEOs Jakarta Batch 10.
                        From corporate synchronizations to internal research series.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <div className="flex items-center space-x-2 text-neutral-300 bg-neutral-900/50 px-4 py-2 rounded-lg border border-neutral-800">
                            <Calendar size={18} className="text-blue-400" />
                            <span>Oct 2021 - Feb 2022</span>
                        </div>
                        <div className="flex items-center space-x-2 text-neutral-300 bg-neutral-900/50 px-4 py-2 rounded-lg border border-neutral-800">
                            <FolderKanban size={18} className="text-blue-400" />
                            <span>5 Major Projects</span>
                        </div>
                        <div className="flex items-center space-x-2 text-neutral-300 bg-neutral-900/50 px-4 py-2 rounded-lg border border-neutral-800">
                            <Users size={18} className="text-blue-400" />
                            <span>Team Database</span>
                        </div>
                    </div>
                </header>

                {/* Content Pillars - to be built out */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Column: Projects & Events */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                                <FolderKanban className="text-blue-500" />
                                Curated Projects
                            </h2>
                            {/* Project Cards will go here */}
                            <ProjectsGrid />
                        </section>
                    </div>

                    {/* Sidebar: Timeline & Team */}
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Calendar className="text-blue-500" />
                                Master Timeline
                            </h2>
                            {/* Timeline will go here */}
                            <MasterTimeline />
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Users className="text-blue-500" />
                                Project Managers
                            </h2>
                            {/* Team list will go here */}
                            <div className="p-8 border border-neutral-800 rounded-xl bg-neutral-900/20 flex items-center justify-center text-neutral-500">
                                Team Grid Component
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
}
