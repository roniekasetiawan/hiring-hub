'use client';

import type { ReactNode } from 'react';
import { AccessControlProvider } from '@/context/AccessControlProvider';
import { useAuthenticationProvider } from '@/context/AuthenticationProvider';

const COREAuthenticationProvider = ({ children }: { children: ReactNode }) => {
    const { menus } = useAuthenticationProvider();

    return (
        <AccessControlProvider
            from={{ static: menus }}
            shape={{ path: 'href', permission: 'permission', children: 'children' }}
        >
            {children}
        </AccessControlProvider>
    );
};

export default COREAuthenticationProvider;
