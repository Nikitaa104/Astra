import { User, EmergencyContact, Device, SOSAlert, Location, CrowdAnalysis } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Storage key for token
const TOKEN_KEY = 'astra_token';
const USER_KEY = 'astra_user';

const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

const setAuthToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);

const removeAuthToken = () => localStorage.removeItem(TOKEN_KEY);

const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }
  return response.json();
};

export const api = {
  // Auth
  register: async (email: string, password: string, name: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password, name }),
    });
    const data = await handleResponse(response);
    if (data.token) setAuthToken(data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  },

  login: async (email: string, password: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    if (data.token) setAuthToken(data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  },

  logout: () => {
    removeAuthToken();
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Users
  getProfile: async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Contacts
  getContacts: async (): Promise<EmergencyContact[]> => {
    const response = await fetch(`${API_BASE_URL}/users/me/contacts`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  addContact: async (contact: Omit<EmergencyContact, 'id' | 'isVerified'>): Promise<EmergencyContact> => {
    const response = await fetch(`${API_BASE_URL}/users/me/contacts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(contact),
    });
    return handleResponse(response);
  },

  updateContact: async (contactId: string, contact: Partial<EmergencyContact>): Promise<EmergencyContact> => {
    const response = await fetch(`${API_BASE_URL}/users/me/contacts/${contactId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(contact),
    });
    return handleResponse(response);
  },

  removeContact: async (contactId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users/me/contacts/${contactId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    await handleResponse(response);
  },

  // Devices
  getDevices: async (): Promise<Device[]> => {
    const response = await fetch(`${API_BASE_URL}/devices`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  pairDevice: async (name: string, sn: string): Promise<Device> => {
    const response = await fetch(`${API_BASE_URL}/devices`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, serialNumber: sn }),
    });
    return handleResponse(response);
  },

  updateDevice: async (deviceId: string, data: Partial<Device>): Promise<Device> => {
    const response = await fetch(`${API_BASE_URL}/devices/${deviceId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  removeDevice: async (deviceId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/devices/${deviceId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    await handleResponse(response);
  },

  // SOS & Alerts
  triggerSOS: async (location: Location): Promise<SOSAlert> => {
    const response = await fetch(`${API_BASE_URL}/sos/trigger`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ location }),
    });
    return handleResponse(response);
  },

  getActiveAlert: async (): Promise<SOSAlert | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/sos/active`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(response);
    } catch {
      return null;
    }
  },

  updateCrowdAnalysis: async (alertId: string, analysis: CrowdAnalysis): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/sos/${alertId}/crowd-analysis`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ crowdAnalysis: analysis }),
    });
    await handleResponse(response);
  },

  resolveAlert: async (alertId: string, note: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/sos/${alertId}/resolve`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ resolutionNote: note }),
    });
    await handleResponse(response);
  },

  cancelAlert: async (alertId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/sos/${alertId}/cancel`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ resolutionNote: 'Accidental trigger' }),
    });
    await handleResponse(response);
  },

  getAlertHistory: async (): Promise<SOSAlert[]> => {
    const response = await fetch(`${API_BASE_URL}/alerts`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateLocation: async (alertId: string, location: Location): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/sos/${alertId}/location`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ location }),
    });
    await handleResponse(response);
  },

  // Crowd monitoring (if available)
  getCrowdDensity: async (location: Location): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/crowd-monitor`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ location }),
    });
    return handleResponse(response);
  },
};
