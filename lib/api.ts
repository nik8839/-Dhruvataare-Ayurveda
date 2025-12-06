const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to make API calls
const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();
  const headers: any = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: async (name: string, phone: string, collegeName: string, password: string) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, phone, collegeName, password }),
    });
  },
  login: async (phone: string, password: string) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
  },
  sendOTP: async (phone: string) => {
    return apiCall('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },
  verifyOTP: async (phone: string, otp: string) => {
    return apiCall('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
  },
  getMe: async () => {
    return apiCall('/auth/me');
  },
};

// PDF API
export const pdfAPI = {
  getPDFs: async (filters?: {
    category?: string;
    year?: string;
    subject?: string;
    yearValue?: string;
    paper?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }
    const query = queryParams.toString();
    const url = `/pdfs${query ? `?${query}` : ''}`;
    console.log('Fetching PDFs from:', url); // Debug log
    const response = await apiCall(url);
    console.log('PDFs API response:', response); // Debug log
    return response;
  },
  getTaxonomy: async (category: string) => {
    return apiCall(`/pdfs/taxonomy?category=${category}`);
  },
  getPDF: async (id: string) => {
    return apiCall(`/pdfs/${id}`);
  },
  viewPDF: (id: string) => {
    const token = getAuthToken();

    return `${API_URL}/pdfs/${id}/view${token ? `?token=${token}` : ''}`;
  },
  downloadPDF: async (id: string) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Please login to download');
    }
    const response = await fetch(`${API_URL}/pdfs/${id}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pdf-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
  createPDF: async (formData: FormData) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Please login');
    }
    const response = await fetch(`${API_URL}/pdfs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  },
};

// Payment API
export const paymentAPI = {
  createOrder: async (pdfId: string) => {
    return apiCall('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ pdfId }),
    });
  },
  verifyPayment: async (
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
    purchaseId: string
  ) => {
    return apiCall('/payments/verify', {
      method: 'POST',
      body: JSON.stringify({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        purchaseId,
      }),
    });
  },
  getPurchases: async () => {
    return apiCall('/payments/purchases');
  },
};

// Analytics API
export const analyticsAPI = {
  getDashboard: async (startDate?: string, endDate?: string) => {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    const query = queryParams.toString();
    return apiCall(`/analytics/dashboard${query ? `?${query}` : ''}`);
  },
  getRealtime: async () => {
    return apiCall('/analytics/realtime');
  },
};

