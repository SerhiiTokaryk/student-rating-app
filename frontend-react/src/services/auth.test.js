import {
    getToken,
    getUsername,
    getUserRole,
    saveSession,
    clearSession,
    isAuthenticated,
} from './auth';

beforeEach(() => {
    localStorage.clear();
});

describe('saveSession', () => {
    test('saves token, username and role to localStorage', () => {
        saveSession('mytoken', 'admin', 'admin');
        expect(localStorage.getItem('token')).toBe('mytoken');
        expect(localStorage.getItem('username')).toBe('admin');
        expect(localStorage.getItem('role')).toBe('admin');
    });
});

describe('getToken', () => {
    test('returns null when not set', () => {
        expect(getToken()).toBeNull();
    });

    test('returns token after saveSession', () => {
        saveSession('abc123', 'user', 'regular');
        expect(getToken()).toBe('abc123');
    });
});

describe('getUsername', () => {
    test('returns null when not set', () => {
        expect(getUsername()).toBeNull();
    });

    test('returns username after saveSession', () => {
        saveSession('token', 'testuser', 'regular');
        expect(getUsername()).toBe('testuser');
    });
});

describe('getUserRole', () => {
    test('returns null when not set', () => {
        expect(getUserRole()).toBeNull();
    });

    test('returns role after saveSession', () => {
        saveSession('token', 'user', 'admin');
        expect(getUserRole()).toBe('admin');
    });
});

describe('clearSession', () => {
    test('removes token, username and role from localStorage', () => {
        saveSession('token', 'user', 'regular');
        clearSession();
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('username')).toBeNull();
        expect(localStorage.getItem('role')).toBeNull();
    });
});

describe('isAuthenticated', () => {
    test('returns false when no token', () => {
        expect(isAuthenticated()).toBe(false);
    });

    test('returns true when token exists', () => {
        saveSession('token123', 'user', 'regular');
        expect(isAuthenticated()).toBe(true);
    });
});