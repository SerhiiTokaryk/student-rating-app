import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/api';
import { saveSession } from '../../services/auth';

function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [authError, setAuthError] = useState('');

    function validate() {
        const usernameInvalid = !username.trim();
        const passwordInvalid = !password;
        setUsernameError(usernameInvalid);
        setPasswordError(passwordInvalid);
        return !usernameInvalid && !passwordInvalid;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setAuthError('');

        if (!validate()) {
            return;
        }

        try {
            const data = await login(username, password);
            saveSession(data.access_token, username, data.role);
            navigate('/users');
        } catch (error) {
            setAuthError(error.message);
        }
    }

    return (
        <main className="login-page">
            <section className="login-card" aria-label="Форма входу">
                <h1 className="login-card__title">Student Rating</h1>
                <p className="login-card__subtitle">Увійдіть, щоб продовжити</p>

                <form id="login-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label className="form-group__label" htmlFor="username">Логін</label>
                        <input
                            className={`form-group__input${usernameError ? ' form-group__input--error' : ''}`}
                            id="username"
                            type="text"
                            placeholder="Введіть логін"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {usernameError && (
                            <span className="form-group__error form-group__error--visible">
                                Введіть логін
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-group__label" htmlFor="password">Пароль</label>
                        <input
                            className={`form-group__input${passwordError ? ' form-group__input--error' : ''}`}
                            id="password"
                            type="password"
                            placeholder="Введіть пароль"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && (
                            <span className="form-group__error form-group__error--visible">
                                Введіть пароль
                            </span>
                        )}
                    </div>

                    <button className="btn btn--primary btn--full" type="submit">
                        Увійти
                    </button>

                    {authError && (
                        <span className="form-group__error form-group__error--visible">
                            {authError}
                        </span>
                    )}
                </form>
            </section>
        </main>
    );
}

export default LoginPage;