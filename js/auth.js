const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8081' : 'http://localhost:8081';

function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function requireAuth() {
    if (!getToken()) {
        window.location.href = 'login.html';
    }
}

function redirectIfLoggedIn() {
    if (getToken()) {
        window.location.href = 'index.html';
    }
}

// Handle OAuth2 redirect token
(function () {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const name = params.get('name');
    const email = params.get('email');
    if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ email, name }));
        window.history.replaceState({}, document.title, window.location.pathname);
    }
})();

function toggleTheme() {
    const html = document.documentElement;
    const btn = document.getElementById('themeBtn');
    if (html.getAttribute('data-theme') === 'dark') {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if (btn) btn.textContent = '🌙';
    } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (btn) btn.textContent = '☀️';
    }
}

// Apply saved theme on page load or default to dark
(function () {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        const btn = document.getElementById('themeBtn');
        if (btn) btn.textContent = '🌙';
    } else {
        // Default to dark theme
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        const btn = document.getElementById('themeBtn');
        if (btn) btn.textContent = '☀️';
    }
})();
