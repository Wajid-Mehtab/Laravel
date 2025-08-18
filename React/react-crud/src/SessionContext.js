import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { saveUserToSession, readUserFromSession, clearUserFromSession } from './sessionStorage';

const SessionCtx = createContext(null);

export function SessionProvider({ children }) {
    const [user, setUserState] = useState(() => readUserFromSession()); // { userId, username, roleName } | null

    const setUser = useCallback((u) => {
        // Normalize into one shape
        const normalized = {
            userId: Number.isNaN(Number(u?.userId)) ? String(u?.userId ?? '') : Number(u.userId),
            username: String(u?.username ?? ''),
            roleName: String(u?.roleName ?? ''),
        };
        saveUserToSession(normalized);
        setUserState(normalized);
    }, []);

    const clearUser = useCallback(() => {
        clearUserFromSession();
        setUserState(null);
    }, []);

    const value = useMemo(() => ({ user, setUser, clearUser }), [user, setUser, clearUser]);
    return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>;
}

export function useSessionUser() {
    const ctx = useContext(SessionCtx);
    if (!ctx) throw new Error('useSessionUser must be used within <SessionProvider>');
    return ctx; // { user, setUser, clearUser }
}
