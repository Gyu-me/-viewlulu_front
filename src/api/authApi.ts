import axios from 'axios';
import { AUTH_BASE_URL } from '@env';

export const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
