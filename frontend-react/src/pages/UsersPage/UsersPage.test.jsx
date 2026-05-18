import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UsersPage from './UsersPage';
import * as api from '../../api/api';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../../api/api');

const mockUsers = [
    { id: 1, username: 'admin', role: 'admin' },
    { id: 2, username: 'student_user', role: 'regular' },
];

beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    api.getUsers.mockResolvedValue(mockUsers);
});

test('renders users table', async () => {
    render(<MemoryRouter><UsersPage /></MemoryRouter>);
    await waitFor(() => {
        expect(screen.getByText('admin')).toBeInTheDocument();
        expect(screen.getByText('student_user')).toBeInTheDocument();
    });
});

test('renders add user button', async () => {
    render(<MemoryRouter><UsersPage /></MemoryRouter>);
    expect(screen.getByText('+ Додати користувача')).toBeInTheDocument();
});

test('opens delete modal on delete button click', async () => {
    render(<MemoryRouter><UsersPage /></MemoryRouter>);
    await waitFor(() => screen.getByText('admin'));

    const deleteButtons = screen.getAllByText('Видалити');
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByText('Видалити користувача?')).toBeInTheDocument();
});

test('closes modal on cancel', async () => {
    render(<MemoryRouter><UsersPage /></MemoryRouter>);
    await waitFor(() => screen.getByText('admin'));

    fireEvent.click(screen.getAllByText('Видалити')[0]);
    fireEvent.click(screen.getByText('Скасувати'));

    await waitFor(() => {
        expect(screen.queryByText('Видалити користувача?')).not.toBeInTheDocument();
    });
});

test('deletes user on confirm', async () => {
    api.deleteUser.mockResolvedValue(null);
    render(<MemoryRouter><UsersPage /></MemoryRouter>);
    await waitFor(() => screen.getByText('admin'));

    fireEvent.click(screen.getAllByText('Видалити')[0]);
    const confirmButtons = screen.getAllByText('Видалити');
    fireEvent.click(confirmButtons[confirmButtons.length - 1]);

    await waitFor(() => {
        expect(api.deleteUser).toHaveBeenCalledWith(1);
    });
});