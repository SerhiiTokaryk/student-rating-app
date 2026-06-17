import { login } from './api.js';
import { notifyError } from './notification.js';

function getFormValues() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    return { username, password };
}

function showFieldError(fieldId, errorId) {
    document.getElementById(fieldId).classList.add('form-group__input--error');
    document.getElementById(errorId).classList.add('form-group__error--visible');
}

function clearFieldError(fieldId, errorId) {
    document.getElementById(fieldId).classList.remove('form-group__input--error');
    document.getElementById(errorId).classList.remove('form-group__error--visible');
}

function validateForm(username, password) {
    let valid = true;

    clearFieldError('username', 'username-error');
    clearFieldError('password', 'password-error');

    if (!username) {
        showFieldError('username', 'username-error');
        valid = false;
    }

    if (!password) {
        showFieldError('password', 'password-error');
        valid = false;
    }

    return valid;
}

async function handleSubmit(event) {
    event.preventDefault();

    const { username, password } = getFormValues();

    if (!validateForm(username, password)) {
        return;
    }

    try {
        const data = await login(username, password);
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('username', username);
        window.location.href = 'users.html';
    } catch (error) {
        notifyError(error.message);
    }
}

document.getElementById('login-form').addEventListener('submit', handleSubmit);
