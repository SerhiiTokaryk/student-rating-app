function showNotification(message, type) {
    const el = document.getElementById('notification');
    el.textContent = message;
    el.className = `notification notification--${type}`;

    setTimeout(() => {
        el.className = 'notification notification--hidden';
    }, 3000);
}

export function notifySuccess(message) {
    showNotification(message, 'success');
}

export function notifyError(message) {
    showNotification(message, 'error');
}
