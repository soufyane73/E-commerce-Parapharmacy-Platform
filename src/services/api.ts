const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  [key: string]: any;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    // Récupérer le token depuis localStorage au démarrage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage = data.error || data.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error: any) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erreur de connexion au serveur');
    }
  }

  // ==================== AUTH ====================
  async register(data: {
    email: string;
    password: string;
    password_confirmation: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    city?: string;
    type: 'b2c' | 'b2b';
    companyName?: string;
    taxId?: string;
    licenseNumber?: string;
  }): Promise<{ user: any; token: string; message: string }> {
    const response = await this.request<{ user: any; token: string; message: string }>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async login(email: string, password: string): Promise<{ user: any; token: string; message: string }> {
    const response = await this.request<{ user: any; token: string; message: string }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/logout', { method: 'POST' });
    } catch (error) {
      // Ignore errors on logout
    } finally {
      this.setToken(null);
    }
  }

  async getProfile(): Promise<{ user: any }> {
    return this.request('/me');
  }

  async updateProfile(data: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    companyName?: string;
    taxId?: string;
    licenseNumber?: string;
  }): Promise<{ user: any; message: string }> {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ==================== PRODUCTS ====================
  async getProducts(params?: {
    category?: string;
    search?: string;
    in_stock?: boolean;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
  }): Promise<any> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString();
    return this.request(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id: string): Promise<{ product: any }> {
    return this.request(`/products/${id}`);
  }

  // ==================== CATEGORIES ====================
  async getCategories(): Promise<{ categories: any[] }> {
    return this.request('/categories');
  }

  async getCategory(id: string): Promise<{ category: any }> {
    return this.request(`/categories/${id}`);
  }

  // ==================== CART ====================
  async getCart(): Promise<{ cartItems: any[]; total: number; totalItems: number }> {
    return this.request('/cart');
  }

  async addToCart(productId: string, quantity: number = 1): Promise<{ cartItem: any; message: string }> {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  async updateCartItem(id: string, quantity: number): Promise<{ cartItem: any; message: string }> {
    return this.request(`/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(id: string): Promise<{ message: string }> {
    return this.request(`/cart/${id}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<{ message: string }> {
    return this.request('/cart', {
      method: 'DELETE',
    });
  }

  // ==================== FAVORITES ====================
  async getFavorites(): Promise<{ favorites: any[] }> {
    return this.request('/favorites');
  }

  async addFavorite(productId: string): Promise<{ favorite: any; message: string }> {
    return this.request('/favorites', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  }

  async removeFavorite(id: string): Promise<{ message: string }> {
    return this.request(`/favorites/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleFavorite(productId: string): Promise<{ isFavorite: boolean; favorite?: any; message: string }> {
    return this.request(`/favorites/toggle/${productId}`, {
      method: 'POST',
    });
  }

  // ==================== ORDERS ====================
  async getOrders(): Promise<any> {
    return this.request('/orders');
  }

  async getOrder(id: string): Promise<{ order: any }> {
    return this.request(`/orders/${id}`);
  }

  async createOrder(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
    notes?: string;
    shippingMethod: string;
    paymentMethod: string;
  }): Promise<{ order: any; message: string }> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== NOTIFICATIONS ====================
  async getNotifications(): Promise<any> {
    return this.request('/notifications');
  }

  async getUnreadCount(): Promise<{ count: number }> {
    return this.request('/notifications/unread-count');
  }

  async markAsRead(id: string): Promise<{ message: string }> {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllAsRead(): Promise<{ message: string }> {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async deleteNotification(id: string): Promise<{ message: string }> {
    return this.request(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== B2B ====================
  async getB2BDashboard(): Promise<any> {
    return this.request('/b2b/dashboard');
  }

  async getB2BOrders(params?: { status?: string; search?: string }): Promise<any> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, String(value));
      });
    }
    const queryString = query.toString();
    return this.request(`/b2b/orders${queryString ? `?${queryString}` : ''}`);
  }

  async createB2BOrder(data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    items: Array<{ productId: string; quantity: number }>;
    notes?: string;
    paymentMethod: string;
    deliveryMethod: string;
    discount?: number;
  }): Promise<{ order: any; message: string }> {
    return this.request('/b2b/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getB2BClients(): Promise<any> {
    return this.request('/b2b/clients');
  }

  async saveB2BClient(data: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    status: 'active' | 'inactive' | 'vip';
  }): Promise<{ client: any; message: string }> {
    const method = data.id ? 'PUT' : 'POST';
    const url = data.id ? `/b2b/clients/${data.id}` : '/b2b/clients';
    return this.request(url, {
      method,
      body: JSON.stringify(data),
    });
  }

  async deleteB2BClient(id: string): Promise<{ message: string }> {
    return this.request(`/b2b/clients/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();

