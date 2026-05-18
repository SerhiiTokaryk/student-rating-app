import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStudents, getTopStudents, deleteStudent } from '../../api/api';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import Modal from '../../components/Modal/Modal';

function getRankClass(index) {
    if (index === 0) return 'rank--first';
    if (index === 1) return 'rank--second';
    if (index === 2) return 'rank--third';
    return '';
}

function buildRatingBar(score) {
    const percent = Math.min(score, 100);
    return (
        <div className="rating-bar">
            <div className="rating-bar__track">
                <div className="rating-bar__fill" style={{ width: `${percent}%` }} />
            </div>
            <span className="rating-bar__value">{Number(score).toFixed(2)}</span>
        </div>
    );
}

function StudentsPage() {
    const [allStudents, setAllStudents] = useState([]);
    const [displayed, setDisplayed] = useState([]);
    const [groups, setGroups] = useState([]);
    const [groupFilter, setGroupFilter] = useState('');
    const [topFilter, setTopFilter] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [error, setError] = useState('');

    function populateGroups(students) {
        const unique = [...new Set(students.map((s) => s.group_name))].sort();
        setGroups(unique);
    }

    function filterByGroup(students, group) {
        if (!group) return students;
        return students.filter((s) => s.group_name === group);
    }

    async function loadStudents() {
        try {
            const data = await getStudents();
            setAllStudents(data);
            populateGroups(data);
            setDisplayed(data);
        } catch (err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        loadStudents();
    }, []);

    async function handleGroupChange(e) {
        const group = e.target.value;
        setGroupFilter(group);

        if (topFilter) {
            const top = await getTopStudents(Number(topFilter));
            setDisplayed(filterByGroup(top, group));
        } else {
            setDisplayed(filterByGroup(allStudents, group));
        }
    }

    async function handleTopChange(e) {
        const limit = e.target.value;
        setTopFilter(limit);

        if (limit) {
            const top = await getTopStudents(Number(limit));
            setDisplayed(filterByGroup(top, groupFilter));
        } else {
            setDisplayed(filterByGroup(allStudents, groupFilter));
        }
    }

    async function handleDeleteConfirm() {
        try {
            await deleteStudent(deleteId);
            setDeleteId(null);
            await loadStudents();
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
                        <h1 className="page-header__title">Рейтинг студентів</h1>
                        <p className="page-header__subtitle">Список та фільтрація</p>
                    </div>
                    <Link className="btn btn--primary" to="/students/new">
                        + Додати студента
                    </Link>
                </div>

                <div className="card" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                    <select
                        className="form-group__input"
                        value={groupFilter}
                        onChange={handleGroupChange}
                    >
                        <option value="">Всі групи</option>
                        {groups.map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>

                    <select
                        className="form-group__input"
                        value={topFilter}
                        onChange={handleTopChange}
                    >
                        <option value="">Всі студенти</option>
                        <option value="3">Топ 3</option>
                        <option value="5">Топ 5</option>
                        <option value="10">Топ 10</option>
                    </select>
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table className="data-table" aria-label="Таблиця студентів">
                        <thead className="data-table__head">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">ПІБ</th>
                                <th scope="col">Група</th>
                                <th scope="col">Рейтинг</th>
                                <th scope="col">Дії</th>
                            </tr>
                        </thead>
                        <tbody className="data-table__body">
                            {displayed.length === 0 ? (
                                <tr>
                                    <td colSpan="5">
                                        <div className="empty-state">
                                            <span className="empty-state__icon">📭</span>
                                            <span className="empty-state__text">Студентів не знайдено</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : displayed.map((student, index) => (
                                <tr key={student.id}>
                                    <td>
                                        <span className={`rank ${getRankClass(index)}`}>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td>{student.full_name}</td>
                                    <td>{student.group_name}</td>
                                    <td>{buildRatingBar(student.rating_score)}</td>
                                    <td>
                                        <div className="data-table__actions">
                                            <Link
                                                className="btn btn--ghost btn--sm"
                                                to={`/students/${student.id}/edit`}
                                            >
                                                Редагувати
                                            </Link>
                                            <button
                                                className="btn btn--danger btn--sm"
                                                type="button"
                                                onClick={() => setDeleteId(student.id)}
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
                    title="Видалити студента?"
                    message="Цю дію неможливо скасувати. Студента буде видалено назавжди."
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    );
}

export default StudentsPage;