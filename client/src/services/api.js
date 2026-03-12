import axios from 'axios';

/**
 * Centralized Axios API Utility
 * 
 * All HTTP requests should go through this instance instead of raw fetch().
 * Benefits:
 *  - Single place to configure base URL, headers, and timeout
 *  - Request interceptor auto-attaches JWT token — no manual token handling in components
 *  - Response interceptor catches 401 errors and auto-logs out the user
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,   // e.g. http://localhost:5000/api
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// ─── REQUEST INTERCEPTOR ──────────────────────────────────────────────────────
// Runs before every outgoing request.
// Reads the JWT from localStorage and attaches it to the Authorization header.
api.interceptors.request.use(
  (config) => {
    // Read token stored during login
    const token = localStorage.getItem('token');

    if (token) {
      // Attach as "Bearer <token>" — standard JWT format
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // If something goes wrong while setting up the request
    return Promise.reject(error);
  }
);

// ─── RESPONSE INTERCEPTOR ─────────────────────────────────────────────────────
// Runs after every response comes back.
// If the server returns 401 (Unauthorized), clear auth data and redirect to login.
api.interceptors.response.use(
  (response) => {
    // Success — pass the response through unchanged
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is missing, invalid, or expired
      // Clear all authentication data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect the user to the login page
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
