import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
    return (
        <nav className="sidebar" aria-label="Головна навігація">
            <p className="sidebar__label">Меню</p>
            <ul className="sidebar__nav">
                <li>
                    <NavLink
                        className={({ isActive }) => (isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link')}
                        to="/users"
                    >
                        Користувачі
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        className={({ isActive }) => (isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link')}
                        to="/students"
                    >
                        Рейтинг студентів
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Sidebar;