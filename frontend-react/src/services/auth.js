export function getToken() {
    return localStorage.getItem('token');
}

export function getUsername() {
    return localStorage.getItem('username');
}

export function getUserRole() {
    return localStorage.getItem('role');
}

export function saveSession(token, username, role) {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
}

export function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
}

export function isAuthenticated() {
    return Boolean(getToken());
}