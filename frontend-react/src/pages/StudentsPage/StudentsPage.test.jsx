import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StudentsPage from './StudentsPage';
import * as api from '../../api/api';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

jest.mock('../../api/api');

const mockStudents = [
    { id: 1, full_name: 'Іван Петренко', group_name: 'ШІ-22', rating_score: 95 },
    { id: 2, full_name: 'Марія Коваль', group_name: 'ШІ-23', rating_score: 80 },
];

beforeEach(() => {
    localStorage.clear();
    api.getStudents.mockResolvedValue(mockStudents);
    api.getTopStudents.mockResolvedValue([mockStudents[0]]);
});

test('renders students table', async () => {
    render(<MemoryRouter><StudentsPage /></MemoryRouter>);
    await waitFor(() => {
        expect(screen.getByText('Іван Петренко')).toBeInTheDocument();
        expect(screen.getByText('Марія Коваль')).toBeInTheDocument();
    });
});

test('renders add student button', () => {
    render(<MemoryRouter><StudentsPage /></MemoryRouter>);
    expect(screen.getByText('+ Додати студента')).toBeInTheDocument();
});

test('renders group filter', async () => {
    render(<MemoryRouter><StudentsPage /></MemoryRouter>);
    await waitFor(() => screen.getByText('Іван Петренко'));
    expect(screen.getByText('Всі групи')).toBeInTheDocument();
});

test('filters students by group', async () => {
    render(<MemoryRouter><StudentsPage /></MemoryRouter>);
    await waitFor(() => screen.getByText('Іван Петренко'));

    fireEvent.change(screen.getByDisplayValue('Всі групи'), {
        target: { value: 'ШІ-22' },
    });

    await waitFor(() => {
        expect(screen.getByText('Іван Петренко')).toBeInTheDocument();
        expect(screen.queryByText('Марія Коваль')).not.toBeInTheDocument();
    });
});

test('opens delete modal on delete click', async () => {
    render(<MemoryRouter><StudentsPage /></MemoryRouter>);
    await waitFor(() => screen.getByText('Іван Петренко'));

    fireEvent.click(screen.getAllByText('Видалити')[0]);
    expect(screen.getByText('Видалити студента?')).toBeInTheDocument();
});

test('closes modal on cancel', async () => {
    render(<MemoryRouter><StudentsPage /></MemoryRouter>);
    await waitFor(() => screen.getByText('Іван Петренко'));

    fireEvent.click(screen.getAllByText('Видалити')[0]);
    fireEvent.click(screen.getByText('Скасувати'));

    await waitFor(() => {
        expect(screen.queryByText('Видалити студента?')).not.toBeInTheDocument();
    });
});

test('shows empty state when no students', async () => {
    api.getStudents.mockResolvedValue([]);
    render(<MemoryRouter><StudentsPage /></MemoryRouter>);
    await waitFor(() => {
        expect(screen.getByText('Студентів не знайдено')).toBeInTheDocument();
    });
});