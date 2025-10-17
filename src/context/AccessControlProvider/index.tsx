'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
    createMongoAbility,
    AbilityBuilder,
    type MongoAbility,
    type AnyAbility
} from '@casl/ability';
import { createContextualCan } from '@casl/react';
import { useAuthenticationProvider } from '@/context/AuthenticationProvider';
import type { Actions, Subjects, Shape } from './type';

type AppAbility = MongoAbility<[Actions, Subjects]>;

type Props = {
    from: { static?: any[] };
    shape: Shape;
    children: ReactNode;
};

function parsePermission(p?: string): { subject: Subjects; action: Actions } | null {
    if (!p) return null;
    const [subjectRaw, actionRaw] = p.split('.');
    if (!subjectRaw || !actionRaw) return null;

    const subject = (subjectRaw.toLowerCase() === 'job'
        ? 'Job'
        : subjectRaw.toLowerCase() === 'application'
            ? 'Application'
            : subjectRaw.toLowerCase() === 'user'
                ? 'User'
                : subjectRaw.toLowerCase() === 'dashboard'
                    ? 'dashboard'
                    : 'all') as Subjects;

    const action = actionRaw as Actions;
    return { subject, action };
}

function defineAbilityFor(role: 'admin' | 'recruiter' | 'applicant', _userId?: string) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    if (role === 'admin') {
        can('manage', 'all');
        return build();
    }

    can('read', 'dashboard');
    can('read', 'Job');

    if (role === 'recruiter') {
        can('create', 'Job');
        can('read', 'Application');
        can('approve', 'Application');
        can('update', 'Job');
        can('delete', 'Job');
    }

    if (role === 'applicant') {
        can('create', 'Application');
        can('read', 'Application');
        can('update', 'Application');
    }

    return build();
}

function filterMenusByPermission(
    menus: any[],
    shape: Shape,
    checker: (perm?: string) => boolean
) {
    const out: any[] = [];
    for (const m of menus ?? []) {
        const children = Array.isArray(m?.[shape.children])
            ? filterMenusByPermission(m[shape.children], shape, checker)
            : [];

        const allowed = checker(m?.[shape.permission] as string);
        if (allowed || children.length) {
            out.push({ ...m, [shape.children]: children });
        }
    }
    return out;
}

const AbilityCtx = createContext<AnyAbility>(createMongoAbility());
export const Can = createContextualCan(AbilityCtx.Consumer);

type AccessCtxValue = {
    ability: AppAbility;
    can: AppAbility['can'];
    isAllowed: (p?: string) => boolean;
    filteredMenus: any[];
};
const AccessCtx = createContext<AccessCtxValue | null>(null);

export function AccessControlProvider({ from, shape, children }: Props) {
    const { user } = useAuthenticationProvider();

    const ability = useMemo(
        () => defineAbilityFor(user?.role ?? 'applicant', user?.id),
        [user?.role, user?.id]
    );

    const isAllowed = (perm?: string) => {
        const p = parsePermission(perm);
        if (!p) return true;
        return ability.can(p.action, p.subject);
    };

    const filteredMenus = useMemo(
        () => filterMenusByPermission(from.static ?? [], shape, isAllowed),
        [from.static, shape, ability]
    );

    const ctx: AccessCtxValue = {
        ability,
        can: ability.can.bind(ability),
        isAllowed,
        filteredMenus
    };

    return (
        <AbilityCtx.Provider value={ability as unknown as AnyAbility}>
            <AccessCtx.Provider value={ctx}>{children}</AccessCtx.Provider>
        </AbilityCtx.Provider>
    );
}

export function useAbility() {
    const a = useContext(AbilityCtx);
    return a as unknown as AppAbility;
}

export function useAccessControl() {
    const v = useContext(AccessCtx);
    if (!v) throw new Error('useAccessControl must be used within AccessControlProvider');
    return v;
}
