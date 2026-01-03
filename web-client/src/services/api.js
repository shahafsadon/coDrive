const API_BASE_URL = 'http://localhost:3000/api';

// generic GET helper
export async function apiGet(path, headers = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    });
    // check for HTTP errors
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    // backend always returns JSON
    return response.json();
}

// generic POST helper, used mainly for auth
export async function apiPost(path, body, headers = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: JSON.stringify(body),
    });

    // backend always returns JSON
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        // backend sends message on auth failure
        throw new Error(data.message || 'Request failed');
    }

    return data;
}
