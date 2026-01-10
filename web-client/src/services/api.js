const API_BASE_URL = "/api";

// Generic API request function
async function request(method, path, body = null, headers = {}) {
    const token = localStorage.getItem("token");

    const options = {
        method,
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
    };

    // Handle body
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

    // Handle errors
    if (!response.ok) {
        const text = await response.text();
        try {
            // Try to parse JSON error from backend
            const json = JSON.parse(text);
            const message = json.error || json.message;
            
            // If backend returns "Invalid credentials", make it user-friendly
            if (message === "Invalid credentials") {
                throw new Error("Incorrect username or password");
            }
            
            throw new Error(message || text);
        } catch (e) {
            // If parsing failed or we just threw a new Error above, re-throw
            throw new Error(e.message === "Unexpected token" ? text : e.message);
        }
    }
    
    // Parse JSON response
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    }

    return null;
}

// API helper functions

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