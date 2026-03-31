async function apiCall(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE}${endpoint}`, options);

    if (response.status === 401 || response.status === 403) {
        logout();
        return;
    }

    return response;
}

async function compare(q1, q2) {
    return await apiCall('/api/quantity/compare', 'POST', { q1, q2 });
}

async function convert(q1, q2) {
    return await apiCall('/api/quantity/convert', 'POST', { q1, q2 });
}

async function add(q1, q2) {
    return await apiCall('/api/quantity/add', 'POST', { q1, q2 });
}

async function subtract(q1, q2) {
    return await apiCall('/api/quantity/subtract', 'POST', { q1, q2 });
}

async function divide(q1, q2) {
    return await apiCall('/api/quantity/divide', 'POST', { q1, q2 });
}

async function getHistory() {
    return await apiCall('/api/quantity/getHistory', 'GET');
}
