function initHeader() {
    const username = localStorage.getItem('username') || 'Користувач';
    const usernameEl = document.getElementById('header-username');

    if (usernameEl) {
        usernameEl.textContent = username;
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

function redirectIfNotAuth() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
    }
}

redirectIfNotAuth();
initHeader();

document.getElementById('logout-btn').addEventListener('click', (event) => {
    event.preventDefault();
    handleLogout();
});
