import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

test('renders title and message', () => {
    render(
        <Modal
            title="Видалити?"
            message="Це незворотня дія"
            onConfirm={jest.fn()}
            onCancel={jest.fn()}
        />,
    );
    expect(screen.getByText('Видалити?')).toBeInTheDocument();
    expect(screen.getByText('Це незворотня дія')).toBeInTheDocument();
});

test('calls onConfirm when confirm button clicked', () => {
    const onConfirm = jest.fn();
    render(
        <Modal
            title="Видалити?"
            message="Це незворотня дія"
            onConfirm={onConfirm}
            onCancel={jest.fn()}
        />,
    );
    fireEvent.click(screen.getByText('Видалити'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
});

test('calls onCancel when cancel button clicked', () => {
    const onCancel = jest.fn();
    render(
        <Modal
            title="Видалити?"
            message="Це незворотня дія"
            onConfirm={jest.fn()}
            onCancel={onCancel}
        />,
    );
    fireEvent.click(screen.getByText('Скасувати'));
    expect(onCancel).toHaveBeenCalledTimes(1);
});

test('calls onCancel when close button clicked', () => {
    const onCancel = jest.fn();
    render(
        <Modal
            title="Видалити?"
            message="Це незворотня дія"
            onConfirm={jest.fn()}
            onCancel={onCancel}
        />,
    );
    fireEvent.click(screen.getByLabelText('Закрити'));
    expect(onCancel).toHaveBeenCalledTimes(1);
});