import { getUser, updateUser, register } from './api.js';
import { notifySuccess, notifyError } from './notification.js';

const params = new URLSearchParams(window.location.search);
const editId = params.get('id');

function getFormValues() {
    return {
        username: document.getElementById('username').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirm-password').value,
        role: document.getElementById('role').value,
    };
}

function showError(inputId, errorId) {
    document.getElementById(inputId).classList.add('form-group__input--error');
    document.getElementById(errorId).classList.add('form-group__error--visible');
}

function clearErrors() {
    ['username', 'password', 'confirm-password'].forEach((id) => {
        document.getElementById(id).classList.remove('form-group__input--error');
    });

    ['username-error', 'password-error', 'confirm-error'].forEach((id) => {
        document.getElementById(id).classList.remove('form-group__error--visible');
    });
}

function validateForm(values) {
    clearErrors();
    let valid = true;

    if (values.username.length < 3) {
        showError('username', 'username-error');
        valid = false;
    }

    if (!editId && values.password.length < 6) {
        showError('password', 'password-error');
        valid = false;
    }

    if (values.password && values.password !== values.confirmPassword) {
        showError('confirm-password', 'confirm-error');
        valid = false;
    }

    return valid;
}

function buildUpdatePayload(values) {
    const payload = {
        username: values.username,
        role: values.role,
    };

    if (values.password) {
        payload.password = values.password;
    }

    return payload;
}

async function handleSubmit(event) {
    event.preventDefault();

    const values = getFormValues();

    if (!validateForm(values)) {
        return;
    }

    try {
        if (editId) {
            await updateUser(Number(editId), buildUpdatePayload(values));
            notifySuccess('Користувача оновлено');
        } else {
            await register(values.username, values.password, values.role);
            notifySuccess('Користувача створено');
        }

        setTimeout(() => {
            window.location.href = 'users.html';
        }, 1000);
    } catch (error) {
        notifyError(error.message);
    }
}

async function loadUserForEdit() {
    if (!editId) {
        return;
    }

    document.getElementById('form-title').textContent = 'Редагувати користувача';

    try {
        const user = await getUser(Number(editId));
        document.getElementById('username').value = user.username;
        document.getElementById('role').value = user.role;
    } catch (error) {
        notifyError(error.message);
    }
}

document.getElementById('user-form').addEventListener('submit', handleSubmit);

loadUserForEdit();
