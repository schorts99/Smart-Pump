const BASE_API_URL = `${import.meta.env.VITE_API_URL}/api/v${import.meta.env.VITE_API_VERSION}`;

export const SESSIONS_URL = new URL(`${BASE_API_URL}/sessions`);
export const CURRENT_USER_URL = new URL(`${BASE_API_URL}/users/current`);
