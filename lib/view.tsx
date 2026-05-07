import type { ReactNode } from "react";
import React from "react";
import type { Theme, User } from "@/types";
import { View } from "@/types";

import ProgramsView from "@/components/programs/ProgramViews";
import SettingsView from "@/components/settings/SettingsView";
import ActiveMembersView from "@/components/members/ActiveMembersView";
import DataReviewView from "@/components/data-review/DataReviewView";

import WorkspaceRouter from "@/components/workspaces/WorkspaceRouter";

// PM Views
import PMDashboardView from "@/components/pm/dashboard/PMDashboardView";
import KanbanView from "@/components/pm/kanban/KanbanView";
import RoadmapView from "@/components/pm/roadmap/RoadmapView";
import BrainstormView from "@/components/pm/brainstorm/BrainstormView";
import DDRView from "@/components/pm/ddr/DDRView";
import TrackingView from "@/components/pm/tracking/TrackingView";
import { PMTasksProvider } from "@/context/PMTasksContext";
import EmailBlastView from "@/components/email-blast/EmailBlastView";

export function renderActiveView(params: {
  activeView: View;
  currentUser: User | null;
  theme: Theme;
  onToggleTheme: () => void;
  navigate: (view: View) => void;
}): ReactNode {
  const { activeView, currentUser, theme, onToggleTheme, navigate } = params;

  if (!currentUser) return null;

  switch (activeView) {


    case View.EMAIL_BLAST:
      return <EmailBlastView user={currentUser} theme={theme} />;

    case View.DATA_REVIEW:
      return <DataReviewView />;

    case View.PROGRAMS:
      return <ProgramsView user={currentUser} />;

    case View.MEMBERS:
      return <ActiveMembersView user={currentUser} />;

    case View.WORKSPACE:
      return <WorkspaceRouter user={currentUser} />;

    case View.SETTINGS:
      return (
        <SettingsView
          theme={theme}
          onToggleTheme={onToggleTheme}
          user={currentUser}
        />
      );

    // ── PM Views — all share one task store via PMTasksProvider ───────
    case View.PM_DASHBOARD:
      return (
        <PMTasksProvider>
          <PMDashboardView user={currentUser} navigate={navigate} />
        </PMTasksProvider>
      );

    case View.KANBAN:
      return (
        <PMTasksProvider>
          <KanbanView user={currentUser} />
        </PMTasksProvider>
      );

    case View.ROADMAP:
      return (
        <PMTasksProvider>
          <RoadmapView user={currentUser} />
        </PMTasksProvider>
      );

    case View.BRAINSTORM:
      return <BrainstormView user={currentUser} />;

    case View.DDR:
      return (
        <PMTasksProvider>
          <DDRView user={currentUser} />
        </PMTasksProvider>
      );

    case View.TRACKING:
      return (
        <PMTasksProvider>
          <TrackingView user={currentUser} />
        </PMTasksProvider>
      );

    default:
      return (
        <div className="text-slate-500 text-center py-20">
          Work in progress...
        </div>
      );
  }
}