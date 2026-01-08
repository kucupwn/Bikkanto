// URLs goes here
export const API_BASE_URL = "http://127.0.0.1:8000";

export const EXERCISES_API_URL = `${API_BASE_URL}/exercises`;
export const EXERCISES_CATEGORY_API_URL = `${EXERCISES_API_URL}/categories`;

export const HISTORY_API_URL = `${API_BASE_URL}/history`;
export const HISTORY_RANGE_URL = `${HISTORY_API_URL}/range`;

export const TOKEN_API_URL = `${API_BASE_URL}/auth/token`;

export const USERS_API_URL = `${API_BASE_URL}/users`;
export const CHANGE_PASSWORD_API_URL = `${USERS_API_URL}/change_password`;
export const REGISTER_API_URL = `${USERS_API_URL}/register`;
