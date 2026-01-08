import Constants from 'expo-constants';

// Runtime API base URL. For Expo Go on a physical device, set this to your
// machine's LAN IP (e.g. 'http://192.168.1.42:5000'). You can also provide
// an `extra.apiUrl` entry in app.json/app.config to override at build time.
const expoExtra = (Constants as any).expoConfig?.extra || (Constants as any).manifest?.extra || {};

export const API_BASE_URL = expoExtra.apiUrl || 'http://10.170.231.180:5000';

export default {
  API_BASE_URL,
};
