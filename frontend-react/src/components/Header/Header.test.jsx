import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import * as auth from '../../services/auth';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
});

test('renders username from localStorage', () => {
    auth.saveSession('token', 'testuser', 'admin');
    render(<MemoryRouter><Header /></MemoryRouter>);
    expect(screen.getByText('testuser')).toBeInTheDocument();
});

test('renders logo', () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    expect(screen.getByText('student/rating')).toBeInTheDocument();
});

test('renders logout button', () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    expect(screen.getByText('Вийти')).toBeInTheDocument();
});

test('logout clears session and navigates to /', () => {
    auth.saveSession('token', 'admin', 'admin');
    render(<MemoryRouter><Header /></MemoryRouter>);
    fireEvent.click(screen.getByText('Вийти'));
    expect(localStorage.getItem('token')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/');
});