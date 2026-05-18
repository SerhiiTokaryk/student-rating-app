import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
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

test('renders login form', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    expect(screen.getByPlaceholderText('Введіть логін')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Введіть пароль')).toBeInTheDocument();
    expect(screen.getByText('Увійти')).toBeInTheDocument();
});

test('shows validation error when fields empty', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    fireEvent.click(screen.getByText('Увійти'));
    expect(screen.getByText('Введіть логін')).toBeInTheDocument();
    expect(screen.getByText('Введіть пароль')).toBeInTheDocument();
});

test('navigates to /users on successful login', async () => {
    api.login.mockResolvedValue({ access_token: 'token123' });
    render(<MemoryRouter><LoginPage /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText('Введіть логін'), {
        target: { value: 'admin' },
    });
    fireEvent.change(screen.getByPlaceholderText('Введіть пароль'), {
        target: { value: 'admin123' },
    });
    fireEvent.click(screen.getByText('Увійти'));

    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/users');
    });
});

test('shows error message on failed login', async () => {
    api.login.mockRejectedValue(new Error('Invalid credentials'));
    render(<MemoryRouter><LoginPage /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText('Введіть логін'), {
        target: { value: 'wrong' },
    });
    fireEvent.change(screen.getByPlaceholderText('Введіть пароль'), {
        target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByText('Увійти'));

    await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
});