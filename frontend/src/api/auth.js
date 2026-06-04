// src/api/auth.js
import API from './axios';

export const registerUser = async (username, email, password, role = "candidate") => {
  try {
    const response = await API.post('/auth/register', {
      username,
      email,
      password,
      role,
    });
    return response.data; // Returns: { id, username, email, role }
  } catch (error) {
    // Extracts the clean error message from your FastAPI custom handling layer
    const errorMessage = error.response?.data?.detail || "Registration failed";
    throw new Error(errorMessage);
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await API.post('/auth/login', { email, password });
    const data = response.data;

    // Securely cache state keys on successful login
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user_role', data.role);
      localStorage.setItem('user_email', data.email);
    }
    return data; // Returns: { access_token, token_type, email, role }
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Login failed";
    throw new Error(errorMessage);
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_email');
};