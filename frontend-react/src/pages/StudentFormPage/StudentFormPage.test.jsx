import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import StudentFormPage from './StudentFormPage';
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
    render(<MemoryRouter><StudentFormPage /></MemoryRouter>);
    expect(screen.getByText('Новий студент')).toBeInTheDocument();
});

test('shows validation error when name too short', async () => {
    render(<MemoryRouter><StudentFormPage /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/Прізвище/), {
        target: { value: 'АБ' },
    });
    fireEvent.click(screen.getByText('Зберегти'));
    await waitFor(() => {
        expect(screen.getByText('ПІБ має бути не менше 3 символів')).toBeInTheDocument();
    });
});

test('shows validation error when group empty', async () => {
    render(<MemoryRouter><StudentFormPage /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/Прізвище/), {
        target: { value: 'Іван Петренко' },
    });
    fireEvent.click(screen.getByText('Зберегти'));
    await waitFor(() => {
        expect(screen.getByText('Введіть групу')).toBeInTheDocument();
    });
});

test('shows validation error when rating invalid', async () => {
    render(<MemoryRouter><StudentFormPage /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/Прізвище/), {
        target: { value: 'Іван Петренко' },
    });
    fireEvent.change(screen.getByLabelText(/Група/), {
        target: { value: 'ШІ-22' },
    });
    fireEvent.change(screen.getByLabelText(/Рейтинговий/), {
        target: { value: '150' },
    });
    fireEvent.click(screen.getByText('Зберегти'));
    await waitFor(() => {
        expect(screen.getByText('Бал має бути від 0 до 100')).toBeInTheDocument();
    });
});

test('calls createStudent and navigates on success', async () => {
    api.createStudent.mockResolvedValue({ id: 1, full_name: 'Іван Петренко' });
    render(<MemoryRouter><StudentFormPage /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText(/Прізвище/), {
        target: { value: 'Іван Петренко' },
    });
    fireEvent.change(screen.getByLabelText(/Група/), {
        target: { value: 'ШІ-22' },
    });
    fireEvent.change(screen.getByLabelText(/Рейтинговий/), {
        target: { value: '95' },
    });
    fireEvent.click(screen.getByText('Зберегти'));

    await waitFor(() => {
        expect(api.createStudent).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/students');
    });
});

test('loads student data in edit mode', async () => {
    api.getStudent.mockResolvedValue({
        id: 1, full_name: 'Іван Петренко', group_name: 'ШІ-22', rating_score: 95,
    });
    render(
        <MemoryRouter initialEntries={['/students/1/edit']}>
            <Routes>
                <Route path="/students/:id/edit" element={<StudentFormPage />} />
            </Routes>
        </MemoryRouter>,
    );

    await waitFor(() => {
        expect(screen.getByDisplayValue('Іван Петренко')).toBeInTheDocument();
    });
});