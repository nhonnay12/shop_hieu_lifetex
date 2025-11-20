// src/config/api.js
import axios from 'axios';

// Lấy từ environment nếu có (CRA: biến phải bắt đầu bằng REACT_APP_)
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Axios instance chung (không tự attach token)
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 99999999999999999999,
});

// Axios instance dùng cho request có token (bạn vẫn có thể pass token thủ công)
export const axiosJWT = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 99999999999999999999,
});
