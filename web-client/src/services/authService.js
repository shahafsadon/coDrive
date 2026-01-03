import { apiPost } from './api';

// auth logic is kept here, not inside the component
export async function login(username, password) {
    return apiPost('/tokens', {
        username,
        password,
    });
}

// registration logic
export async function register({ username, password, name, image }) {
    return apiPost('/users', {
        username,
        password,
        name,
        image,
    });
}