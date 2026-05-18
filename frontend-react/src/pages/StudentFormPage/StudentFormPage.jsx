import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStudent, createStudent, updateStudent } from '../../api/api';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';

function StudentFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [fullName, setFullName] = useState('');
    const [groupName, setGroupName] = useState('');
    const [ratingScore, setRatingScore] = useState('');
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (!isEdit) return;

        getStudent(Number(id))
            .then((student) => {
                setFullName(student.full_name);
                setGroupName(student.group_name);
                setRatingScore(String(student.rating_score));
            })
            .catch((err) => setSubmitError(err.message));
    }, [id, isEdit]);

    function validate() {
        const newErrors = {};
        const score = parseFloat(ratingScore);

        if (fullName.trim().length < 3) {
            newErrors.fullName = 'ПІБ має бути не менше 3 символів';
        }

        if (!groupName.trim()) {
            newErrors.groupName = 'Введіть групу';
        }

        if (Number.isNaN(score) || score < 0 || score > 100) {
            newErrors.ratingScore = 'Бал має бути від 0 до 100';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function buildPayload() {
        return {
            full_name: fullName.trim(),
            group_name: groupName.trim(),
            rating_score: parseFloat(ratingScore),
        };
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitError('');

        if (!validate()) return;

        try {
            if (isEdit) {
                await updateStudent(Number(id), buildPayload());
            } else {
                await createStudent(buildPayload());
            }
            navigate('/students');
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
                        <h1 className="page-header__title">
                            {isEdit ? 'Редагувати студента' : 'Новий студент'}
                        </h1>
                        <p className="page-header__subtitle">Заповніть поля нижче</p>
                    </div>
                    <button
                        className="btn btn--ghost"
                        type="button"
                        onClick={() => navigate('/students')}
                    >
                        ← Назад
                    </button>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <label className="form-group__label" htmlFor="full-name">
                                Прізвище та ім'я
                            </label>
                            <input
                                className={`form-group__input${errors.fullName ? ' form-group__input--error' : ''}`}
                                id="full-name"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                            {errors.fullName && (
                                <span className="form-group__error form-group__error--visible">
                                    {errors.fullName}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-group__label" htmlFor="group-name">
                                Група
                            </label>
                            <input
                                className={`form-group__input${errors.groupName ? ' form-group__input--error' : ''}`}
                                id="group-name"
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                            {errors.groupName && (
                                <span className="form-group__error form-group__error--visible">
                                    {errors.groupName}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-group__label" htmlFor="rating-score">
                                Рейтинговий бал (0-100)
                            </label>
                            <input
                                className={`form-group__input${errors.ratingScore ? ' form-group__input--error' : ''}`}
                                id="rating-score"
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={ratingScore}
                                onChange={(e) => setRatingScore(e.target.value)}
                            />
                            {errors.ratingScore && (
                                <span className="form-group__error form-group__error--visible">
                                    {errors.ratingScore}
                                </span>
                            )}
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
                                onClick={() => navigate('/students')}
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

export default StudentFormPage;