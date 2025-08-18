// src/utils.js

export function getUsername() {
    try {
        const raw = localStorage.getItem('user');
        if (!raw) return '';
        const u = JSON.parse(raw);
        return (
            u?.UserName ||
            u?.FullName ||
            u?.username ||
            u?.name ||
            u?.User ||
            u?.user ||
            ''
        );
    } catch {
        return '';
    }
}

/** Inspect all possible username fields + the raw localStorage value. */
export function inspectUsernameSources() {
    const out = {
        raw: null,          // string from localStorage
        parsed: null,       // parsed object (or null)
        candidates: {},     // each field we try
        resolved: '',       // final value getUsername() would return
        error: null,
    };

    try {
        out.raw = localStorage.getItem('user');
        if (out.raw) out.parsed = JSON.parse(out.raw);
        const u = out.parsed || {};

        out.candidates = {
            UserName: u?.UserName ?? null,
            FullName: u?.FullName ?? null,
            username: u?.username ?? null,
            name:     u?.name ?? null,
            User:     u?.User ?? null,
            user:     u?.user ?? null,
        };

        out.resolved =
            out.candidates.UserName ||
            out.candidates.FullName ||
            out.candidates.username ||
            out.candidates.name ||
            out.candidates.User ||
            out.candidates.user ||
            '';
    } catch (e) {
        out.error = String(e?.message || e);
    }

    return out;
}
