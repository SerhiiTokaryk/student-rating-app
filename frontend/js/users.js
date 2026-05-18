import { getUsers, deleteUser } from './api.js';
import { notifySuccess, notifyError } from './notification.js';

let pendingDeleteId = null;

function buildRoleBadge(role) {
    return `<span class="badge badge--${role}">${role}</span>`;
}

function buildActionButtons(userId) {
    return `
        <div class="data-table__actions">
            <a class="btn btn--ghost btn--sm" href="user-form.html?id=${userId}">Редагувати</a>
            <button class="btn btn--danger btn--sm" type="button" data-delete-id="${userId}">Видалити</button>
        </div>
    `;
}

function buildUserRow(user) {
    return `
        <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${buildRoleBadge(user.role)}</td>
            <td>${buildActionButtons(user.id)}</td>
        </tr>
    `;
}

function renderUsers(users) {
    const tbody = document.getElementById('users-tbody');
    tbody.innerHTML = users.map(buildUserRow).join('');
}

async function loadUsers() {
    try {
        const users = await getUsers();
        renderUsers(users);
    } catch (error) {
        notifyError(error.message);
    }
}

function openDeleteModal(userId) {
    pendingDeleteId = userId;
    document.getElementById('delete-modal').classList.remove('modal-overlay--hidden');
}

function closeDeleteModal() {
    pendingDeleteId = null;
    document.getElementById('delete-modal').classList.add('modal-overlay--hidden');
}

async function confirmDelete() {
    if (!pendingDeleteId) {
        return;
    }

    try {
        await deleteUser(pendingDeleteId);
        closeDeleteModal();
        notifySuccess('Користувача видалено');
        await loadUsers();
    } catch (error) {
        notifyError(error.message);
    }
}

function handleTableClick(event) {
    const btn = event.target.closest('[data-delete-id]');

    if (btn) {
        openDeleteModal(Number(btn.dataset.deleteId));
    }
}

document.getElementById('users-tbody').addEventListener('click', handleTableClick);
document.getElementById('delete-modal-close').addEventListener('click', closeDeleteModal);
document.getElementById('delete-cancel').addEventListener('click', closeDeleteModal);
document.getElementById('delete-confirm').addEventListener('click', confirmDelete);

loadUsers();
