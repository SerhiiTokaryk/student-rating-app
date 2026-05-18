import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser, updateUser, register } from '../../api/api';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';

function UserFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('regular');
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (!isEdit) return;

        getUser(Number(id))
            .then((user) => {
                setUsername(user.username);
                setRole(user.role);
            })
            .catch((err) => setSubmitError(err.message));
    }, [id, isEdit]);

    function validate() {
        const newErrors = {};

        if (username.trim().length < 3) {
            newErrors.username = 'Логін має бути не менше 3 символів';
        }

        if (!isEdit && password.length < 6) {
            newErrors.password = 'Пароль має бути не менше 6 символів';
        }

        if (password && password !== confirmPassword) {
            newErrors.confirmPassword = 'Паролі не збігаються';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function buildPayload() {
        const payload = { username, role };
        if (password) payload.password = password;
        return payload;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitError('');

        if (!validate()) return;

        try {
            if (isEdit) {
                await updateUser(Number(id), buildPayload());
            } else {
                await register(username, password, role);
            }
            navigate('/users');
        } catch (err) {
            setSubmitError(err.message);
        }
    }

    return (
        <div className="app-shell">
            <Header />
            <Sidebar />
            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h1 className="page-header__title" id="form-title">
                            {isEdit ? 'Редагувати користувача' : 'Новий користувач'}
                        </h1>
                        <p className="page-header__subtitle">Заповніть поля нижче</p>
                    </div>
                    <button
                        className="btn btn--ghost"
                        type="button"
                        onClick={() => navigate('/users')}
                    >
                        ← Назад
                    </button>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <label className="form-group__label" htmlFor="username">Логін</label>
                            <input
                                className={`form-group__input${errors.username ? ' form-group__input--error' : ''}`}
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {errors.username && (
                                <span className="form-group__error form-group__error--visible">
                                    {errors.username}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-group__label" htmlFor="password">
                                Пароль {isEdit && '(залиште порожнім щоб не змінювати)'}
                            </label>
                            <input
                                className={`form-group__input${errors.password ? ' form-group__input--error' : ''}`}
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && (
                                <span className="form-group__error form-group__error--visible">
                                    {errors.password}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-group__label" htmlFor="confirm-password">
                                Підтвердити пароль
                            </label>
                            <input
                                className={`form-group__input${errors.confirmPassword ? ' form-group__input--error' : ''}`}
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {errors.confirmPassword && (
                                <span className="form-group__error form-group__error--visible">
                                    {errors.confirmPassword}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-group__label" htmlFor="role">Роль</label>
                            <select
                                className="form-group__input"
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="regular">regular</option>
                                <option value="admin">admin</option>
                            </select>
                        </div>

                        {submitError && (
                            <span className="form-group__error form-group__error--visible">
                                {submitError}
                            </span>
                        )}

                        <div className="data-table__actions">
                            <button className="btn btn--primary" type="submit">
                                Зберегти
                            </button>
                            <button
                                className="btn btn--ghost"
                                type="button"
                                onClick={() => navigate('/users')}
                            >
                                Скасувати
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default UserFormPage;