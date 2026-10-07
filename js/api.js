const API_URL = 'http://localhost:3000';

async function api(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
        return;
    }

    const texto = await response.text();

    let data = null;

    try {
        data = texto ? JSON.parse(texto) : null;
    } catch {
        data = texto;
    }

    if (!response.ok) {
        throw new Error(
            data?.message || `Erro ${response.status}`
        );
    }

    return data;
}