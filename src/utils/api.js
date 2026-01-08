import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Determine API base URL depending on platform/runtime.
// - web: use the browser host so requests come from same machine (avoids CORS/mixed-content issues)
// - android emulator: use 10.0.2.2
// - other (iOS simulator / physical devices): use your machine LAN IP. Replace `LAN_IP` below with your IP.

const LAN_IP = '172.20.10.7'; // e.g. 192.168.1.42
let BASE = 'http://localhost:5000';

if (Platform.OS === 'web') {
  const host = typeof window !== 'undefined' && window.location && window.location.hostname
    ? window.location.hostname
    : 'localhost';
  BASE = `http://${host}:5000`;
} else if (Platform.OS === 'android') {
  BASE = 'http://10.0.2.2:5000';
} else {
  // iOS simulator usually works with localhost; physical devices need LAN IP
  BASE = LAN_IP && LAN_IP !== '172.20.10.7' ? `http://${LAN_IP}:5000` : 'http://localhost:5000';
}

export const API_BASE = BASE;

const api = axios.create({ baseURL: API_BASE });

// Proper SecureStore setup for expo-secure-store
const secureStore = SecureStore.default || SecureStore;

// Async request interceptor to attach JWT from SecureStore
api.interceptors.request.use(async (cfg) => {
  try {
    const token = await secureStore.getItemAsync('token');
    if (token) cfg.headers = { ...(cfg.headers || {}), Authorization: `Bearer ${token}` };
  } catch (e) {
    // ignore
  }
  return cfg;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  res => res,
  async (err) => {
    if (err.response?.status === 401) {
      try {
        await secureStore.deleteItemAsync('token');
        await secureStore.deleteItemAsync('user');
      } catch (e) {}
      // No browser redirect in RN; callers should handle 401 accordingly
    }
    return Promise.reject(err);
  }
);

export default api;