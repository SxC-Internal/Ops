"use client";

import React from "react";
import type { User } from "@/types";
import OperationsWorkspace from "./ops/OperationsWorkspace";

interface WorkspaceRouterProps {
  user: User;
}

const WorkspaceRouter: React.FC<WorkspaceRouterProps> = ({ user }) => {
  // Check the user's department to route them to their specific workspace
  // We fall back to user.role if departmentId isn't explicitly set on the user object
  const department = user.departmentId || user.role;

  switch (department) {
    case "ops":
      return <OperationsWorkspace user={user} />;
    case "finance":
      return <div className="p-8 text-center text-slate-500 mt-20">Finance Workspace Under Construction</div>;
    case "marketing":
      return <div className="p-8 text-center text-slate-500 mt-20">Marketing Workspace Under Construction</div>;
    case "hr":
      return <div className="p-8 text-center text-slate-500 mt-20">HR Workspace Under Construction</div>;
    case "tech":
      return <div className="p-8 text-center text-slate-500 mt-20">Tech Workspace Under Construction</div>;
    default:
      // Fallback for Admins or unassigned users
      return (
        <div className="p-8 text-center text-slate-500 mt-20">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Admin Workspace Access</h2>
          <p>As an administrator, you will soon be able to select and view any division's workspace.</p>
        </div>
      );
  }
};

export default WorkspaceRouter;