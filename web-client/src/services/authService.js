import { apiPost } from "./api";

export function register(data) {
    return apiPost("/users", data, {
        // override: no auth header
        "x-user-id": undefined
    });
}


export function login(username, password) {
    return apiPost(
        "/tokens",
        { username, password },
        {
            // override: no auth header
            "x-user-id": undefined
        }
    );
}
