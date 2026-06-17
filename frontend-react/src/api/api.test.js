import {
    login,
    register,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getStudents,
    getTopStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
} from './api';

beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn();
});

afterEach(() => {
    jest.resetAllMocks();
});

function mockFetch(data, status = 200) {
    global.fetch.mockResolvedValue({
        ok: status >= 200 && status < 300,
        status,
        json: jest.fn().mockResolvedValue(data),
    });
}

describe('login', () => {
    test('sends POST to /auth/login and returns data', async () => {
        mockFetch({ access_token: 'token123', token_type: 'bearer' });
        const result = await login('admin', 'admin123');
        expect(result.access_token).toBe('token123');
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8001/auth/login',
            expect.objectContaining({ method: 'POST' }),
        );
    });

    test('throws error on invalid credentials', async () => {
        mockFetch({ detail: 'Invalid credentials' }, 401);
        await expect(login('bad', 'bad')).rejects.toThrow('Invalid credentials');
    });
});

describe('register', () => {
    test('sends POST to /auth/register', async () => {
        mockFetch({ id: 1, username: 'newuser', role: 'regular' });
        const result = await register('newuser', 'pass123', 'regular');
        expect(result.username).toBe('newuser');
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8001/auth/register',
            expect.objectContaining({ method: 'POST' }),
        );
    });
});

describe('getUsers', () => {
    test('sends GET to /users/', async () => {
        mockFetch([{ id: 1, username: 'admin', role: 'admin' }]);
        const result = await getUsers();
        expect(result).toHaveLength(1);
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8001/users/',
            expect.objectContaining({ method: 'GET' }),
        );
    });
});

describe('getUser', () => {
    test('sends GET to /users/:id', async () => {
        mockFetch({ id: 1, username: 'admin', role: 'admin' });
        const result = await getUser(1);
        expect(result.id).toBe(1);
    });
});

describe('updateUser', () => {
    test('sends PUT to /users/:id', async () => {
        mockFetch({ id: 1, username: 'updated', role: 'admin' });
        const result = await updateUser(1, { username: 'updated' });
        expect(result.username).toBe('updated');
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8001/users/1',
            expect.objectContaining({ method: 'PUT' }),
        );
    });
});

describe('deleteUser', () => {
    test('sends DELETE to /users/:id and returns null on 204', async () => {
        global.fetch.mockResolvedValue({ ok: true, status: 204 });
        const result = await deleteUser(1);
        expect(result).toBeNull();
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8001/users/1',
            expect.objectContaining({ method: 'DELETE' }),
        );
    });
});

describe('getStudents', () => {
    test('sends GET to /students/', async () => {
        mockFetch([{ id: 1, full_name: 'Іван Петренко', group_name: 'ШІ-22', rating_score: 95 }]);
        const result = await getStudents();
        expect(result).toHaveLength(1);
    });
});

describe('getTopStudents', () => {
    test('sends GET to /students/top with limit', async () => {
        mockFetch([{ id: 1, full_name: 'Іван Петренко', group_name: 'ШІ-22', rating_score: 95 }]);
        await getTopStudents(5);
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8001/students/top?limit=5',
            expect.anything(),
        );
    });
});

describe('getStudent', () => {
    test('sends GET to /students/:id', async () => {
        mockFetch({ id: 1, full_name: 'Іван Петренко', group_name: 'ШІ-22', rating_score: 95 });
        const result = await getStudent(1);
        expect(result.id).toBe(1);
    });
});

describe('createStudent', () => {
    test('sends POST to /students/', async () => {
        mockFetch({ id: 2, full_name: 'Марія Коваль', group_name: 'ШІ-22', rating_score: 80 });
        const result = await createStudent({ full_name: 'Марія Коваль', group_name: 'ШІ-22', rating_score: 80 });
        expect(result.full_name).toBe('Марія Коваль');
    });
});

describe('updateStudent', () => {
    test('sends PUT to /students/:id', async () => {
        mockFetch({ id: 1, full_name: 'Іван Петренко', group_name: 'ШІ-22', rating_score: 99 });
        const result = await updateStudent(1, { rating_score: 99 });
        expect(result.rating_score).toBe(99);
    });
});

describe('deleteStudent', () => {
    test('sends DELETE to /students/:id and returns null on 204', async () => {
        global.fetch.mockResolvedValue({ ok: true, status: 204 });
        const result = await deleteStudent(1);
        expect(result).toBeNull();
    });
});