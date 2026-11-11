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

    const texto = await response.text();

    let data = null;

    try {
        data = texto ? JSON.parse(texto) : null;
    } catch {
        data = texto;
    }

    if (!response.ok) {
        if (response.status === 401 && endpoint !== '/auth/login') {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            localStorage.removeItem('usuarioId');
            window.location.href = 'login.html';
        }

        const mensagem = Array.isArray(data?.message)
            ? data.message.join(', ')
            : data?.message;

        throw new Error(mensagem || `Erro ${response.status}`);
    }

    return data;
}