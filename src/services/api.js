// API Service Client with Live Backend Integration & Neon PostgreSQL

const API_BASE = 'https://multivendor-q15b.onrender.com/';
const USER_SESSION_KEY = 'aura_active_user_session';

// Helper to make fetch requests with transparent error handling
async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  let res;
  try {
    res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    });
  } catch (netErr) {
    throw new Error(`Unable to connect to backend server at ${API_BASE}. Please make sure the Spring Boot server is running.`);
  }

  if (!res.ok) {
    let errorMsg = `Server error (HTTP ${res.status})`;
    try {
      const errorJson = await res.json();
      errorMsg = errorJson.message || errorJson.error || JSON.stringify(errorJson);
    } catch {
      try {
        const errorText = await res.text();
        if (errorText && errorText.length < 200) errorMsg = errorText;
      } catch {
        // use default
      }
    }
    throw new Error(errorMsg);
  }

  if (res.status === 204) return null;
  return await res.json();
}

// Maps Spring Boot ProductDTO fields to frontend product format
function mapBackendProduct(p) {
  return {
    id: p.id,
    name: p.name,
    sku: p.sku || `SKU-PROD-${p.id}`,
    description: p.description || '',
    price: parseFloat(p.price) || 0,
    stockQuantity: p.stock != null ? p.stock : 0,
    isDeleted: false,
    categoryId: p.categoryId,
    categoryName: p.categoryName || 'Uncategorized',
    vendorId: p.vendorId,
    storeName: p.vendorName || 'Vendor Store',
  };
}

// Maps Spring Boot CustomerDTO -> Frontend User
function mapBackendCustomer(c) {
  if (!c) return null;
  const names = (c.name || '').split(' ');
  return {
    id: c.id,
    username: c.email ? c.email.split('@')[0] : `user_${c.id}`,
    name: c.name || '',
    email: c.email || '',
    role: 'CUSTOMER',
    profile: {
      profileId: c.id,
      firstName: names[0] || c.name || 'Customer',
      lastName: names.slice(1).join(' ') || '',
      phone: c.phone || '',
      shippingAddress: c.address || '',
      address: c.address || '',
      city: 'Bengaluru',
      state: 'KA',
      zipCode: '560001',
      country: 'India'
    }
  };
}

// Maps Spring Boot VendorDTO -> Frontend Vendor
function mapBackendVendor(v) {
  if (!v) return null;
  return {
    id: v.id,
    storeName: v.companyName || v.name || `Vendor Store ${v.id}`,
    sellerCode: `VEND-IND-00${v.id}`,
    contactEmail: v.email || 'seller@example.in',
    phoneNumber: v.phone || '',
    rating: 4.8,
    totalProducts: 10
  };
}

export const api = {
  // Check backend health
  async checkBackendHealth() {
    try {
      const res = await fetch(`${API_BASE}/product`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  },

  getIsLiveBackend() {
    return true;
  },

  // ================= SESSION & AUTHENTICATION =================

  getCurrentUser() {
    try {
      const saved = localStorage.getItem(USER_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user) {
    if (!user) {
      localStorage.removeItem(USER_SESSION_KEY);
    } else {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    }
  },

  logout() {
    localStorage.removeItem(USER_SESSION_KEY);
  },

  async login(email, password) {
    const payload = {
      email: (email || '').trim(),
      password: (password || '').trim()
    };
    const res = await request('/customer/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const user = mapBackendCustomer(res);
    this.setCurrentUser(user);
    return user;
  },

  async register(userData) {
    const cleanPhone = (userData.phone || '9876543210').replace(/\D/g, '').slice(-10);
    const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.name || userData.username;
    
    const payload = {
      name: fullName,
      email: (userData.email || '').trim().toLowerCase(),
      password: userData.password || 'password123',
      phone: cleanPhone.length === 10 ? cleanPhone : '9876543210',
      address: userData.address || userData.shippingAddress || '123 MG Road, Bengaluru, KA 560001'
    };

    const res = await request('/customer', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const user = mapBackendCustomer(res);
    this.setCurrentUser(user);
    return user;
  },

  // ================= USERS / CUSTOMERS =================

  async createUser(userData) {
    return this.register(userData);
  },

  async updateUser(id, userData) {
    const cleanPhone = (userData.phone || '').replace(/\D/g, '').slice(-10);
    const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.name || userData.username;

    const payload = {
      name: fullName,
      email: userData.email,
      password: userData.password || 'password123',
      phone: cleanPhone || '9876543210',
      address: userData.address || userData.shippingAddress || 'Bengaluru, India'
    };
    const res = await request(`/customer/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    const user = mapBackendCustomer(res);
    if (this.getCurrentUser()?.id === Number(id)) {
      this.setCurrentUser(user);
    }
    return user;
  },

  async getUserById(id) {
    const res = await request(`/customer/${id}`);
    return mapBackendCustomer(res);
  },

  async getAllCustomers() {
    try {
      const list = await request('/customer');
      if (Array.isArray(list)) {
        return list.map(mapBackendCustomer);
      }
      return [];
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      return [];
    }
  },

  // ================= VENDORS =================

  async createVendor(vendorData) {
    const cleanPhone = (vendorData.phoneNumber || vendorData.phone || '9876543211').replace(/\D/g, '').slice(-10);
    const payload = {
      name: vendorData.contactName || vendorData.name || vendorData.storeName || 'Vendor Contact',
      companyName: vendorData.storeName || vendorData.companyName || 'Vendor Company',
      email: (vendorData.contactEmail || vendorData.email || `vendor_${Date.now()}@example.com`).trim().toLowerCase(),
      phone: cleanPhone.length === 10 ? cleanPhone : '9876543211',
      address: vendorData.address || 'Bengaluru, Karnataka, India'
    };
    const res = await request('/vendor', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return mapBackendVendor(res);
  },

  async updateVendor(id, vendorData) {
    const cleanPhone = (vendorData.phoneNumber || vendorData.phone || '').replace(/\D/g, '').slice(-10);
    const payload = {
      name: vendorData.contactName || vendorData.name || vendorData.storeName || 'Vendor Contact',
      companyName: vendorData.storeName || vendorData.companyName || 'Vendor Company',
      email: vendorData.contactEmail || vendorData.email,
      phone: cleanPhone || '9876543211',
      address: vendorData.address || 'Bengaluru, India'
    };
    const res = await request(`/vendor/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    return mapBackendVendor(res);
  },

  async getAllVendors() {
    try {
      const list = await request('/vendor');
      if (Array.isArray(list)) {
        return list.map(mapBackendVendor);
      }
      return [];
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
      return [];
    }
  },

  // ================= CATEGORIES =================

  async createCategory(catData) {
    const payload = {
      name: (catData.name || '').trim(),
      description: catData.description || 'Product category'
    };
    return await request('/category', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async updateCategory(id, catData) {
    return await request(`/category/${id}`, {
      method: 'PUT',
      body: JSON.stringify(catData)
    });
  },

  async getAllCategories() {
    try {
      const list = await request('/category');
      if (Array.isArray(list)) {
        return list;
      }
      return [];
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      return [];
    }
  },

  // ================= PRODUCTS =================

  async createProduct(productData) {
    const backendPayload = {
      name: productData.name,
      description: productData.description || 'Quality product listing',
      price: parseFloat(productData.price) || 99.99,
      stock: parseInt(productData.stockQuantity || productData.stock, 10) || 50,
      categoryId: Number(productData.categoryId),
      vendorId: Number(productData.vendorId),
    };
    const result = await request('/product', {
      method: 'POST',
      body: JSON.stringify(backendPayload)
    });
    return mapBackendProduct(result);
  },

  async updateProduct(id, productData) {
    const backendPayload = {
      name: productData.name,
      description: productData.description || 'Quality product listing',
      price: parseFloat(productData.price) || 99.99,
      stock: parseInt(productData.stockQuantity || productData.stock, 10) || 50,
      categoryId: Number(productData.categoryId),
      vendorId: Number(productData.vendorId),
    };
    const result = await request(`/product/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendPayload)
    });
    return mapBackendProduct(result);
  },

  async createBatchProducts(productsArray) {
    const created = [];
    for (const prod of productsArray) {
      try {
        const res = await this.createProduct(prod);
        created.push(res);
      } catch (err) {
        console.error('Failed to create product in batch:', prod.name, err);
      }
    }
    return created;
  },

  async searchProducts(params = {}) {
    try {
      const backendProducts = await request('/product');
      let list = Array.isArray(backendProducts) ? backendProducts.map(mapBackendProduct) : [];

      if (params.categoryId) {
        list = list.filter(p => p.categoryId === Number(params.categoryId));
      }
      if (params.vendorId) {
        list = list.filter(p => p.vendorId === Number(params.vendorId));
      }
      if (params.minPrice) {
        list = list.filter(p => p.price >= parseFloat(params.minPrice));
      }
      if (params.maxPrice) {
        list = list.filter(p => p.price <= parseFloat(params.maxPrice));
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(p => 
          (p.name && p.name.toLowerCase().includes(q)) || 
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q))
        );
      }

      // Sort
      const sortBy = params.sortBy || 'id';
      const sortDir = (params.sortDir || 'asc').toLowerCase();
      list.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (typeof valA === 'string') {
          return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortDir === 'asc' ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
      });

      // Pagination
      const page = Number(params.page) || 0;
      const size = Number(params.size) || 10;
      const totalElements = list.length;
      const totalPages = Math.ceil(totalElements / size) || 1;
      const start = page * size;
      const content = list.slice(start, start + size);

      return {
        content,
        totalPages,
        totalElements,
        size,
        number: page,
        first: page === 0,
        last: page >= totalPages - 1,
        empty: content.length === 0
      };
    } catch (err) {
      console.error('Failed to search products:', err);
      return {
        content: [],
        totalPages: 1,
        totalElements: 0,
        size: params.size || 10,
        number: 0,
        first: true,
        last: true,
        empty: true
      };
    }
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/product/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    });
    if (res.ok) return null;
    throw new Error(`Delete failed: HTTP ${res.status}`);
  },

  // ================= CART =================

  async addProductToCart(customerProfileId, productId) {
    const key = `aura_cart_${customerProfileId}`;
    let cart = JSON.parse(localStorage.getItem(key) || '{"products":[]}');
    
    // Fetch product details
    const backendProducts = await request('/product');
    const prod = backendProducts.map(mapBackendProduct).find(p => p.id === Number(productId));
    if (prod && !cart.products.some(p => p.id === prod.id)) {
      cart.products.push(prod);
      cart.totalItems = cart.products.length;
      localStorage.setItem(key, JSON.stringify(cart));
    }
    return cart;
  },

  async getCartByCustomerProfileId(customerProfileId) {
    if (!customerProfileId) return { products: [], totalItems: 0 };
    const key = `aura_cart_${customerProfileId}`;
    const cart = JSON.parse(localStorage.getItem(key) || '{"products":[], "totalItems": 0}');
    return cart;
  },

  async removeProductFromCart(customerProfileId, productId) {
    const key = `aura_cart_${customerProfileId}`;
    let cart = JSON.parse(localStorage.getItem(key) || '{"products":[]}');
    cart.products = cart.products.filter(p => p.id !== Number(productId));
    cart.totalItems = cart.products.length;
    localStorage.setItem(key, JSON.stringify(cart));
    return cart;
  },

  // ================= ORDERS =================

  async createOrder(orderRequest) {
    const payload = {
      orderDate: new Date().toISOString().split('T')[0],
      totalAmount: parseFloat(orderRequest.totalAmount) || 0,
      customerId: Number(orderRequest.customerProfileId)
    };
    
    try {
      const order = await request('/orders', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      // Clear cart
      const key = `aura_cart_${orderRequest.customerProfileId}`;
      localStorage.removeItem(key);
      return order;
    } catch (err) {
      throw new Error('Order placement failed: ' + err.message);
    }
  },

  async getOrdersByCustomerId(customerId) {
    try {
      const allOrders = await request('/orders');
      if (Array.isArray(allOrders)) {
        return allOrders.filter(o => o.customerId === Number(customerId) || o.customer?.id === Number(customerId));
      }
      return [];
    } catch (err) {
      console.error('Failed to get orders:', err);
      return [];
    }
  },

  async removeOrderItem(orderId) {
    return await request(`/orders/${orderId}`, {
      method: 'DELETE'
    });
  }
};
