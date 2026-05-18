const API_URL = 'http://localhost:8001';

function getToken() {
    return localStorage.getItem('token');
}

function buildHeaders() {
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
    };
}

async function request(method, path, body) {
    const options = {
        method,
        headers: buildHeaders(),
    };

    if (body !== undefined) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${path}`, options);

    if (response.status === 204) {
        return null;
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || 'Request failed');
    }

    return data;
}

export function login(username, password) {
    return request('POST', '/auth/login', { username, password });
}

export function register(username, password, role) {
    return request('POST', '/auth/register', { username, password, role });
}

export function getUsers() {
    return request('GET', '/users/');
}

export function getUser(id) {
    return request('GET', `/users/${id}`);
}

export function updateUser(id, data) {
    return request('PUT', `/users/${id}`, data);
}

export function deleteUser(id) {
    return request('DELETE', `/users/${id}`);
}

export function getStudents() {
    return request('GET', '/students/');
}

export function getTopStudents(limit) {
    return request('GET', `/students/top?limit=${limit}`);
}

export function getStudent(id) {
    return request('GET', `/students/${id}`);
}

export function createStudent(data) {
    return request('POST', '/students/', data);
}

export function updateStudent(id, data) {
    return request('PUT', `/students/${id}`, data);
}

export function deleteStudent(id) {
    return request('DELETE', `/students/${id}`);
}
