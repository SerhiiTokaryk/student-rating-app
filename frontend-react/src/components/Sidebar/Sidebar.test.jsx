import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';

test('renders navigation links', () => {
    render(<MemoryRouter><Sidebar /></MemoryRouter>);
    expect(screen.getByText('Користувачі')).toBeInTheDocument();
    expect(screen.getByText('Рейтинг студентів')).toBeInTheDocument();
});

test('users link points to /users', () => {
    render(<MemoryRouter><Sidebar /></MemoryRouter>);
    expect(screen.getByText('Користувачі').closest('a')).toHaveAttribute('href', '/users');
});

test('students link points to /students', () => {
    render(<MemoryRouter><Sidebar /></MemoryRouter>);
    expect(screen.getByText('Рейтинг студентів').closest('a')).toHaveAttribute('href', '/students');
});