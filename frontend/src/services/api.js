// frontend/src/services/api.js

import axios from 'axios';
const API_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
});

/**
 * Sets the Authorization header for all future requests (used after login).
 * @param {string} token The JWT token
 */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('jwtToken', token); 
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('jwtToken');
  }
};

// Check for existing token on module load to resume session
const token = localStorage.getItem('jwtToken');
if (token) setAuthToken(token);

// ===================================
// USER/AUTH ENDPOINTS
// ===================================

export const loginUser = (data) => api.post('/users/login', data);
export const registerUser = (data) => api.post('/users/register', data);
export const getUsers = () => api.get('/users'); // Admin only

// ===================================
// CERTIFICATE ISSUANCE & VERIFICATION ENDPOINTS
// ===================================

export const uploadCertificateData = (formData) => api.post('/certificates/upload', formData, {
    headers: {
        // Crucial for file uploads via Axios
        'Content-Type': 'multipart/form-data', 
    },
});

export const getContractArtifacts = () => api.get('/contract');
export const lookupCertificate = (rollNumber) => api.get(`/certificates/lookup/${rollNumber}`);
export const verifyOnChain = (certificateId) => api.get(`/certificates/verify/${certificateId}`);

export default api;