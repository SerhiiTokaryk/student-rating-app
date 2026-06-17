import { getStudents, getTopStudents, deleteStudent } from './api.js';
import { notifySuccess, notifyError } from './notification.js';

let allStudents = [];
let pendingDeleteId = null;

function getRankClass(index) {
    if (index === 0) return 'rank--first';
    if (index === 1) return 'rank--second';
    if (index === 2) return 'rank--third';
    return '';
}

function buildRatingBar(score) {
    const percent = Math.min(score, 100);
    return `
        <div class="rating-bar">
            <div class="rating-bar__track">
                <div class="rating-bar__fill" style="width: ${percent}%;"></div>
            </div>
            <span class="rating-bar__value">${Number(score).toFixed(2)}</span>
        </div>
    `;
}

function buildStudentRow(student, index) {
    const rankClass = getRankClass(index);
    return `
        <tr>
            <td><span class="rank ${rankClass}">${index + 1}</span></td>
            <td>${student.full_name}</td>
            <td>${student.group_name}</td>
            <td>${buildRatingBar(student.rating_score)}</td>
            <td>
                <div class="data-table__actions">
                    <a class="btn btn--ghost btn--sm" href="student-form.html?id=${student.id}">Редагувати</a>
                    <button class="btn btn--danger btn--sm" type="button" data-delete-id="${student.id}">Видалити</button>
                </div>
            </td>
        </tr>
    `;
}

function renderStudents(students) {
    const tbody = document.getElementById('students-tbody');

    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5"><div class="empty-state"><span class="empty-state__icon">📭</span><span class="empty-state__text">Студентів не знайдено</span></div></td></tr>';
        return;
    }

    tbody.innerHTML = students.map((s, i) => buildStudentRow(s, i)).join('');
}

function filterByGroup(students, group) {
    if (!group) {
        return students;
    }

    return students.filter((s) => s.group_name === group);
}

function populateGroupFilter(students) {
    const groups = [...new Set(students.map((s) => s.group_name))].sort();
    const select = document.getElementById('group-filter');
    select.innerHTML = '<option value="">Всі групи</option>';
    groups.forEach((group) => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        select.appendChild(option);
    });
}

async function applyFilters() {
    const group = document.getElementById('group-filter').value;
    const topLimit = document.getElementById('top-filter').value;

    let students;

    if (topLimit) {
        students = await getTopStudents(Number(topLimit));
    } else {
        students = allStudents;
    }

    renderStudents(filterByGroup(students, group));
}

async function loadStudents() {
    try {
        allStudents = await getStudents();
        populateGroupFilter(allStudents);
        renderStudents(allStudents);
    } catch (error) {
        notifyError(error.message);
    }
}

function openDeleteModal(id) {
    pendingDeleteId = id;
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
        await deleteStudent(pendingDeleteId);
        closeDeleteModal();
        notifySuccess('Студента видалено');
        await loadStudents();
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

document.getElementById('students-tbody').addEventListener('click', handleTableClick);
document.getElementById('delete-modal-close').addEventListener('click', closeDeleteModal);
document.getElementById('delete-cancel').addEventListener('click', closeDeleteModal);
document.getElementById('delete-confirm').addEventListener('click', confirmDelete);
document.getElementById('group-filter').addEventListener('change', applyFilters);
document.getElementById('top-filter').addEventListener('change', applyFilters);

loadStudents();
