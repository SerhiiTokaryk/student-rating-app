import { getStudent, createStudent, updateStudent } from './api.js';
import { notifySuccess, notifyError } from './notification.js';

const params = new URLSearchParams(window.location.search);
const editId = params.get('id');

function getFormValues() {
    return {
        fullName: document.getElementById('full-name').value.trim(),
        groupName: document.getElementById('group-name').value.trim(),
        ratingScore: parseFloat(document.getElementById('rating-score').value),
    };
}

function showError(inputId, errorId) {
    document.getElementById(inputId).classList.add('form-group__input--error');
    document.getElementById(errorId).classList.add('form-group__error--visible');
}

function clearErrors() {
    ['full-name', 'group-name', 'rating-score'].forEach((id) => {
        document.getElementById(id).classList.remove('form-group__input--error');
    });

    ['full-name-error', 'group-name-error', 'rating-error'].forEach((id) => {
        document.getElementById(id).classList.remove('form-group__error--visible');
    });
}

function validateForm(values) {
    clearErrors();
    let valid = true;

    if (values.fullName.length < 3) {
        showError('full-name', 'full-name-error');
        valid = false;
    }

    if (!values.groupName) {
        showError('group-name', 'group-name-error');
        valid = false;
    }

    if (Number.isNaN(values.ratingScore) || values.ratingScore < 0 || values.ratingScore > 100) {
        showError('rating-score', 'rating-error');
        valid = false;
    }

    return valid;
}

function buildPayload(values) {
    return {
        full_name: values.fullName,
        group_name: values.groupName,
        rating_score: values.ratingScore,
    };
}

async function handleSubmit(event) {
    event.preventDefault();

    const values = getFormValues();

    if (!validateForm(values)) {
        return;
    }

    try {
        if (editId) {
            await updateStudent(Number(editId), buildPayload(values));
            notifySuccess('Студента оновлено');
        } else {
            await createStudent(buildPayload(values));
            notifySuccess('Студента додано');
        }

        setTimeout(() => {
            window.location.href = 'students.html';
        }, 1000);
    } catch (error) {
        notifyError(error.message);
    }
}

async function loadStudentForEdit() {
    if (!editId) {
        return;
    }

    document.getElementById('form-title').textContent = 'Редагувати студента';

    try {
        const student = await getStudent(Number(editId));
        document.getElementById('full-name').value = student.full_name;
        document.getElementById('group-name').value = student.group_name;
        document.getElementById('rating-score').value = student.rating_score;
    } catch (error) {
        notifyError(error.message);
    }
}

document.getElementById('student-form').addEventListener('submit', handleSubmit);

loadStudentForEdit();
