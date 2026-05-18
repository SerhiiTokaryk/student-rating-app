import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsername, clearSession } from '../../services/auth';

function Header() {
    const navigate = useNavigate();
    const username = getUsername();

    function handleLogout(event) {
        event.preventDefault();
        clearSession();
        navigate('/');
    }

    return (
        <header className="header" role="banner">
            <span className="header__logo">student/rating</span>
            <div className="header__actions">
                <span className="header__user">{username}</span>
                <button
                    className="btn btn--ghost btn--sm"
                    type="button"
                    onClick={handleLogout}
                >
                    Вийти
                </button>
            </div>
        </header>
    );
}

export default Header;