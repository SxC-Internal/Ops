"use client";

import { useMemo } from 'react';
import type { PMRole } from '@/types/pm-types';

interface PMPermissions {
    canEditAll: boolean;
    canApproveAll: boolean;
    canEditSubdivision: boolean;
    canApproveSubordinate: boolean;
    canAttachFiles: boolean;
    canUpdateProgress: boolean;
    canViewAll: boolean;
    canAddTask: boolean;
    canDeleteTask: boolean;
    role: PMRole;
}

export function usePMRole(role: string = 'asso'): PMPermissions {
    return useMemo(() => {
        const normalized = role?.toLowerCase();
        switch (normalized) {
            case 'chief':
            case 'head':
                return {
                    canEditAll: true,
                    canApproveAll: true,
                    canEditSubdivision: true,
                    canApproveSubordinate: true,
                    canAttachFiles: true,
                    canUpdateProgress: true,
                    canViewAll: true,
                    canAddTask: true,
                    canDeleteTask: true,
                    role: 'Chief',
                };
            case 'manager':
                return {
                    canEditAll: true,
                    canApproveAll: true,
                    canEditSubdivision: true,
                    canApproveSubordinate: true,
                    canAttachFiles: true,
                    canUpdateProgress: true,
                    canViewAll: true,
                    canAddTask: true,
                    canDeleteTask: true,
                    role: 'Manager',
                };
            case 'asso':
            default:
                return {
                    canEditAll: false,
                    canApproveAll: false,
                    canEditSubdivision: false,
                    canApproveSubordinate: false,
                    canAttachFiles: true,
                    canUpdateProgress: true,
                    canViewAll: false,
                    canAddTask: false,
                    canDeleteTask: false,
                    role: 'Associate',
                };
        }
    }, [role]);
}
