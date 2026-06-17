import React from 'react';

function Modal({
    title, message, onConfirm, onCancel,
}) {
    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal">
                <div className="modal__header">
                    <h2 className="modal__title" id="modal-title">{title}</h2>
                    <button
                        className="modal__close"
                        type="button"
                        onClick={onCancel}
                        aria-label="Закрити"
                    >
                        ✕
                    </button>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    {message}
                </p>
                <div className="modal__footer">
                    <button className="btn btn--ghost" type="button" onClick={onCancel}>
                        Скасувати
                    </button>
                    <button className="btn btn--danger" type="button" onClick={onConfirm}>
                        Видалити
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Modal;