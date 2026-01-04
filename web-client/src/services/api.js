const API_BASE_URL = "/api";

async function request(method, path, body = null, headers = {}) {
    const userId = localStorage.getItem("userId");
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(userId ? { "x-user-id": userId } : {}),
            ...headers,
        },
    };

    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, options);

    // 204 No Content DELETE / PATCH
    if (response.status === 204) {
        return null;
    }

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `API error: ${response.status}`);
    }
    // backend always returns JSON
    return response.json();
}

export function apiGet(path, headers = {}) {
    return request("GET", path, null, headers);
}

export function apiPost(path, body, headers = {}) {
    return request("POST", path, body, headers);
}

export function apiPatch(path, body, headers = {}) {
    return request("PATCH", path, body, headers);
}

export function apiDelete(path, headers = {}) {
    return request("DELETE", path, null, headers);
}
