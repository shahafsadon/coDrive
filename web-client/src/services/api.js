const API_BASE_URL = "/api";

async function request(method, path, body = null, headers = {}) {
    const token = localStorage.getItem("token");

    const options = {
        method,
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
    };

    if (body instanceof FormData) {
        options.body = body;
    } else if (body !== null) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, options);

    // 204 No Content
    if (response.status === 204) {
        return null;
    }

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `API error: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    }

    return null;
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
