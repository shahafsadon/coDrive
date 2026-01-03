import { apiGet } from './api';

export async function fetchRootFiles(userId) {
    return apiGet('/files', {
        'x-user-id': userId,
    });
}
