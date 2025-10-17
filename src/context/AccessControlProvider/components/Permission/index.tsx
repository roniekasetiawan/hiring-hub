'use client';

import React from 'react';
import { useAccessControl } from '../../index';

type Props = {
    permission?: string;
    hide?: boolean;
    fallback?: React.ReactNode;
    children: React.ReactNode;
};

const Permission: React.FC<Props> = ({ permission, hide = true, fallback = null, children }) => {
    const { isAllowed } = useAccessControl();
    const ok = isAllowed(permission);
    if (ok) return <>{children}</>;
    return hide ? null : <>{fallback}</>;
};

export default Permission;
