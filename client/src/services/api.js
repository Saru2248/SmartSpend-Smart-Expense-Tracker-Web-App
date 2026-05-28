// API Service helper utilizing the browser Fetch API with token injection

const BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const api = {
  // Authentication
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const data = await handleResponse(res);
      // Save token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ username: data.username, email: data.email, _id: data._id }));
      }
      return data;
    },
    
    register: async (username, email, password) => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, email, password }),
      });
      const data = await handleResponse(res);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ username: data.username, email: data.email, _id: data._id }));
      }
      return data;
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    getCurrentUser: () => {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
      return !!localStorage.getItem('token');
    }
  },

  // Transactions (CRUD)
  transactions: {
    getAll: async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const queryStr = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`${BASE_URL}/transactions${queryStr}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    create: async (transactionData) => {
      const res = await fetch(`${BASE_URL}/transactions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(transactionData),
      });
      return handleResponse(res);
    },

    update: async (id, transactionData) => {
      const res = await fetch(`${BASE_URL}/transactions/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(transactionData),
      });
      return handleResponse(res);
    },

    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    }
  },

  // Budgets
  budgets: {
    getByMonth: async (month) => {
      const res = await fetch(`${BASE_URL}/budgets?month=${month}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    setLimit: async (category, limit, month) => {
      const res = await fetch(`${BASE_URL}/budgets`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ category, limit, month }),
      });
      return handleResponse(res);
    },

    getStatus: async (month) => {
      const res = await fetch(`${BASE_URL}/budgets/status?month=${month}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    }
  },

  // Dashboard Aggregates
  dashboard: {
    getSummary: async () => {
      const res = await fetch(`${BASE_URL}/dashboard/summary`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    }
  }
};
