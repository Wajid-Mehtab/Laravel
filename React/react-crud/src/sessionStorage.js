const KEY = 'user';

export function saveUserToSession({ userId, username, roleName }) {
    const payload = { userId, username, roleName };
    sessionStorage.setItem(KEY, JSON.stringify(payload));
    return payload;
}

export function readUserFromSession() {
    try {
        const raw = sessionStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function clearUserFromSession() {
    sessionStorage.removeItem(KEY);
}
