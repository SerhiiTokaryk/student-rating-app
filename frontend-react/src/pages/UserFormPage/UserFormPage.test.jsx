import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserFormPage from './UserFormPage';
import * as api from '../../api/api';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../../api/api');

beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
});

test('renders create form when no id', () => {
    render(<MemoryRouter><UserFormPage /></MemoryRouter>);
    expect(screen.getByText('Новий користувач')).toBeInTheDocument();
});

test('shows validation error when username too short', async () => {
    render(<MemoryRouter><UserFormPage /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/Логін/), {
        target: { value: 'ab' },
    });
    fireEvent.click(screen.getByText('Зберегти'));
    await waitFor(() => {
        expect(screen.getByText('Логін має бути не менше 3 символів')).toBeInTheDocument();
    });
});

test('shows validation error when password too short', async () => {
    render(<MemoryRouter><UserFormPage /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/Логін/), {
        target: { value: 'newuser' },
    });
    fireEvent.change(screen.getByLabelText(/^Пароль/), {
        target: { value: '123' },
    });
    fireEvent.click(screen.getByText('Зберегти'));
    await waitFor(() => {
        expect(screen.getByText('Пароль має бути не менше 6 символів')).toBeInTheDocument();
    });
});

test('shows validation error when passwords do not match', async () => {
    render(<MemoryRouter><UserFormPage /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/Логін/), {
        target: { value: 'newuser' },
    });
    fireEvent.change(screen.getByLabelText(/^Пароль/), {
        target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Підтвердити/), {
        target: { value: 'different' },
    });
    fireEvent.click(screen.getByText('Зберегти'));
    await waitFor(() => {
        expect(screen.getByText('Паролі не збігаються')).toBeInTheDocument();
    });
});

test('calls register and navigates on successful create', async () => {
    api.register.mockResolvedValue({ id: 1, username: 'newuser', role: 'regular' });
    render(<MemoryRouter><UserFormPage /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText(/Логін/), {
        target: { value: 'newuser' },
    });
    fireEvent.change(screen.getByLabelText(/^Пароль/), {
        target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Підтвердити/), {
        target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText('Зберегти'));

    await waitFor(() => {
        expect(api.register).toHaveBeenCalledWith('newuser', 'password123', 'regular');
        expect(mockNavigate).toHaveBeenCalledWith('/users');
    });
});

test('loads user data in edit mode', async () => {
    api.getUser.mockResolvedValue({ id: 1, username: 'admin', role: 'admin' });
    render(
        <MemoryRouter initialEntries={['/users/1/edit']}>
            <Routes>
                <Route path="/users/:id/edit" element={<UserFormPage />} />
            </Routes>
        </MemoryRouter>,
    );

    await waitFor(() => {
        expect(screen.getByDisplayValue('admin')).toBeInTheDocument();
    });
});