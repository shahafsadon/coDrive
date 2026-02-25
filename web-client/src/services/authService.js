import { apiPost } from "./api";

export function register(data) {
    return apiPost("/users", data, {
        "x-user-id": undefined
    });
}

export async function login(username, password) {
    const res = await apiPost(
        "/tokens",
        { username, password },
        {
            "x-user-id": undefined
        }
    );
    localStorage.setItem("token", res.token);
    return res;
}
