import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser } from '../../api/api';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import Modal from '../../components/Modal/Modal';

function buildRoleBadge(role) {
    return <span className={`badge badge--${role}`}>{role}</span>;
}

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [error, setError] = useState('');

    async function loadUsers() {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    async function handleDeleteConfirm() {
        try {
            await deleteUser(deleteId);
            setDeleteId(null);
            await loadUsers();
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="app-shell">
            <Header />
            <Sidebar />
            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h1 className="page-header__title">Користувачі</h1>
                        <p className="page-header__subtitle">Управління акаунтами системи</p>
                    </div>
                    <Link className="btn btn--primary" to="/users/new">
                        + Додати користувача
                    </Link>
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table className="data-table" aria-label="Таблиця користувачів">
                        <thead className="data-table__head">
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Логін</th>
                                <th scope="col">Роль</th>
                                <th scope="col">Дії</th>
                            </tr>
                        </thead>
                        <tbody className="data-table__body">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{buildRoleBadge(user.role)}</td>
                                    <td>
                                        <div className="data-table__actions">
                                            <Link
                                                className="btn btn--ghost btn--sm"
                                                to={`/users/${user.id}/edit`}
                                            >
                                                Редагувати
                                            </Link>
                                            <button
                                                className="btn btn--danger btn--sm"
                                                type="button"
                                                onClick={() => setDeleteId(user.id)}
                                            >
                                                Видалити
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {deleteId && (
                <Modal
                    title="Видалити користувача?"
                    message="Цю дію неможливо скасувати. Користувача буде видалено назавжди."
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    );
}

export default UsersPage;