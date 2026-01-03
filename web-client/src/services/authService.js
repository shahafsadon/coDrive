import { apiPost } from './api';

// auth logic is kept here, not inside the component
export async function login(username, password) {
    return apiPost('/tokens', {
        username,
        password,
    });
}
