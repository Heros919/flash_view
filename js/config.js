// URL do backend: local quando a página roda em localhost, Render em produção.
const API_URL = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:3000'
    : 'https://flash-view-1.onrender.com';