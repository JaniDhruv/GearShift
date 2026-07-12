import api from '../api/axios';

/**
 * Auth Service
 * Centralizes all HTTP calls to the backend authentication API.
 * Responses from the server: { token, user } on login; { user } on register; { user } on /me
 */

/**
 * Logs in a user with email and password.
 * @returns {{ token: string, user: object }}
 */
export async function login({ email, password }) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

/**
 * Registers a new user account.
 * @returns {{ user: object }}
 */
export async function register({ name, email, password, role }) {
  const payload = { name, email, password };
  if (role) payload.role = role;
  const response = await api.post('/auth/register', payload);
  return response.data;
}

/**
 * Fetches the authenticated user's profile using the stored JWT.
 * @returns {{ user: object }}
 */
export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data;
}

/**
 * Parses a human-readable error message from an Axios error response.
 */
export function parseAuthError(error) {
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message === 'Network Error') {
    return 'Unable to connect to the server. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}
