// API Service Client with Live Backend Integration & Smart Mock Fallback Engine

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// Initial Mock Seed Data for Offline / Pre-backend testing
const INITIAL_MOCK_DATA = {
  users: [],
  vendors: [],
  categories: [
    { id: 1, name: 'Electronics & Mobile Accessories', description: 'Smartphones, TWS earbuds, fast chargers & gadgets' },
    { id: 2, name: 'Indian Ethnic Wear & Fashion', description: 'Handloom Sarees, Chikankari Kurtas, Silk Shawls & Dupattas' },
    { id: 3, name: 'Home, Kitchen & Puja Essentials', description: 'Brass Diyas, Stainless Steel Cookers, Copper Bottles & Decor' },
    { id: 4, name: 'Organic Spices & Foods', description: 'Kashmiri Saffron, Organic Turmeric, Darjeeling Tea & Dry Fruits' }
  ],
  products: [],
  carts: {},
  orders: []
};
// LocalStorage Persistence Key
const STORAGE_KEY = 'ecommerce_data_store_v3';

function getStore() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_DATA));
    return INITIAL_MOCK_DATA;
  }
  return JSON.parse(saved);
}

function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

let isLiveBackend = true;

// Helper to make fetch request with timeout and failover
async function request(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `HTTP ${res.status}`);
    }
    if (res.status === 204) return null;
    return await res.json();
  } catch (err) {
    if (url.startsWith('/api') && !url.startsWith('http')) {
      try {
        const directUrl = `http://localhost:8080${url}`;
        const directRes = await fetch(directUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
          },
          ...options
        });
        if (directRes.ok) {
          if (directRes.status === 204) return null;
          return await directRes.json();
        }
      } catch {
        // Fall through to mock handling
      }
    }
    console.warn(`[API] Live backend call to ${url} failed (${err.message}). Falling back to local mock engine.`);
    throw err;
  }
}

// Maps Spring Boot ProductDTO fields to frontend product format
// Backend: { id, name, description, price, stock, categoryId, categoryName, vendorId, vendorName }
// Frontend: { id, name, sku, description, price, stockQuantity, isDeleted, categoryId, categoryName, vendorId, storeName }
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
  const names = (c.name || '').split(' ');
  return {
    id: c.id,
    username: c.email ? c.email.split('@')[0] : `user_${c.id}`,
    email: c.email || '',
    role: 'CUSTOMER',
    profile: {
      profileId: c.id,
      firstName: names[0] || 'Customer',
      lastName: names.slice(1).join(' ') || '',
      phone: c.phone || '',
      shippingAddress: c.address || '',
      city: 'India',
      state: '',
      zipCode: '',
      country: 'India'
    }
  };
}

// Maps Spring Boot VendorDTO -> Frontend Vendor
function mapBackendVendor(v) {
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
      let res = await fetch(`${API_BASE}/product`, { method: 'GET' });
      if (res.ok) {
        isLiveBackend = true;
        return true;
      }
    } catch {
      // Fall through to direct try
    }

    try {
      const directRes = await fetch(`http://localhost:8080/product`, { method: 'GET' });
      isLiveBackend = directRes.ok;
      return directRes.ok;
    } catch {
      isLiveBackend = false;
      return false;
    }
  },

  getIsLiveBackend() {
    return isLiveBackend;
  },

  // USERS / CUSTOMER
  async createUser(userData) {
    const cleanPhone = userData.phone ? userData.phone.replace(/\D/g, '').slice(-10) : '';
    try {
      const payload = {
        name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username,
        email: userData.email || `${userData.username}@example.com`,
        password: userData.password || 'Password123!',
        phone: cleanPhone || '9876543210',
        address: userData.shippingAddress || userData.city || 'Bengaluru, India'
      };
      const res = await request(`${API_BASE}/customer`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      return mapBackendCustomer(res);
    } catch {
      const store = getStore();
      const newId = store.users.length + 1;
      const newUser = {
        id: newId,
        username: userData.username,
        email: userData.email,
        role: userData.role || 'CUSTOMER',
        profile: {
          profileId: newId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          shippingAddress: userData.shippingAddress,
          city: userData.city,
          state: userData.state,
          zipCode: userData.zipCode,
          country: userData.country
        }
      };
      store.users.push(newUser);
      saveStore(store);
      return newUser;
    }
  },

  async updateUser(id, userData) {
    const cleanPhone = userData.phone ? userData.phone.replace(/\D/g, '').slice(-10) : '';
    try {
      const payload = {
        name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username,
        email: userData.email,
        password: userData.password || 'Password123!',
        phone: cleanPhone || '9876543210',
        address: userData.address || userData.shippingAddress || userData.city || 'Bengaluru, India'
      };
      const res = await request(`${API_BASE}/customer/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      return mapBackendCustomer(res);
    } catch {
      const store = getStore();
      const idx = store.users.findIndex(u => u.id === Number(id));
      if (idx !== -1) {
        store.users[idx] = {
          ...store.users[idx],
          username: userData.username || store.users[idx].username,
          email: userData.email || store.users[idx].email,
          profile: {
            ...store.users[idx].profile,
            firstName: userData.firstName || store.users[idx].profile.firstName,
            lastName: userData.lastName || store.users[idx].profile.lastName,
            phone: userData.phone || store.users[idx].profile.phone,
            shippingAddress: userData.address || userData.shippingAddress || store.users[idx].profile.shippingAddress,
          }
        };
        saveStore(store);
        return store.users[idx];
      }
      throw new Error('User not found');
    }
  },

  async getUserById(id) {
    try {
      const res = await request(`${API_BASE}/customer/${id}`);
      return mapBackendCustomer(res);
    } catch {
      const store = getStore();
      const user = store.users.find(u => u.id === Number(id));
      if (!user) throw new Error('User not found');
      return user;
    }
  },

  async getAllCustomers() {
    try {
      const list = await request(`${API_BASE}/customer`);
      if (Array.isArray(list)) {
        return list.map(mapBackendCustomer);
      }
      return getStore().users;
    } catch {
      const store = getStore();
      return store.users;
    }
  },

  // VENDORS
  async createVendor(vendorData) {
    const cleanPhone = (vendorData.phoneNumber || vendorData.phone || '').replace(/\D/g, '').slice(-10);
    try {
      const payload = {
        name: vendorData.contactName || vendorData.name || vendorData.storeName || 'Vendor Contact',
        companyName: vendorData.storeName || vendorData.companyName || 'Vendor Company',
        email: vendorData.contactEmail || vendorData.email || 'vendor@example.com',
        phone: cleanPhone || '9876543211',
        address: vendorData.address || 'Bengaluru, India'
      };
      const res = await request(`${API_BASE}/vendor`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      return mapBackendVendor(res);
    } catch {
      const store = getStore();
      const newVendor = {
        id: store.vendors.length + 1,
        ...vendorData,
        rating: 5.0,
        totalProducts: 0
      };
      store.vendors.push(newVendor);
      saveStore(store);
      return newVendor;
    }
  },

  async updateVendor(id, vendorData) {
    const cleanPhone = (vendorData.phoneNumber || vendorData.phone || '').replace(/\D/g, '').slice(-10);
    try {
      const payload = {
        name: vendorData.contactName || vendorData.name || vendorData.storeName || 'Vendor Contact',
        companyName: vendorData.storeName || vendorData.companyName || 'Vendor Company',
        email: vendorData.contactEmail || vendorData.email || 'vendor@example.com',
        phone: cleanPhone || '9876543211',
        address: vendorData.address || 'Bengaluru, India'
      };
      const res = await request(`${API_BASE}/vendor/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      return mapBackendVendor(res);
    } catch {
      const store = getStore();
      const idx = store.vendors.findIndex(v => v.id === Number(id));
      if (idx !== -1) {
        store.vendors[idx] = {
          ...store.vendors[idx],
          ...vendorData,
        };
        saveStore(store);
        return store.vendors[idx];
      }
      throw new Error('Vendor not found');
    }
  },

  async getAllVendors() {
    try {
      const list = await request(`${API_BASE}/vendor`);
      if (Array.isArray(list) && list.length > 0) {
        return list.map(mapBackendVendor);
      }
      return getStore().vendors;
    } catch {
      const store = getStore();
      return store.vendors;
    }
  },

  // CATEGORIES
  async createCategory(catData) {
    try {
      return await request(`${API_BASE}/category`, {
        method: 'POST',
        body: JSON.stringify(catData)
      });
    } catch {
      const store = getStore();
      const newCat = {
        id: store.categories.length + 1,
        name: catData.name,
        description: catData.description
      };
      store.categories.push(newCat);
      saveStore(store);
      return newCat;
    }
  },

  async getAllCategories() {
    try {
      const list = await request(`${API_BASE}/category`);
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
      return getStore().categories;
    } catch {
      const store = getStore();
      return store.categories;
    }
  },

  // PRODUCTS
  async createProduct(productData) {
    try {
      const backendPayload = {
        name: productData.name,
        description: productData.description || 'Product listing',
        price: parseFloat(productData.price),
        stock: parseInt(productData.stockQuantity, 10) || 100,
        categoryId: Number(productData.categoryId),
        vendorId: Number(productData.vendorId),
      };
      const result = await request(`${API_BASE}/product`, {
        method: 'POST',
        body: JSON.stringify(backendPayload)
      });
      return mapBackendProduct(result);
    } catch {
      const store = getStore();
      const cat = store.categories.find(c => c.id === Number(productData.categoryId));
      const vendor = store.vendors.find(v => v.id === Number(productData.vendorId));
      const newProd = {
        id: store.products.length + 1,
        name: productData.name,
        sku: productData.sku,
        description: productData.description,
        price: parseFloat(productData.price),
        stockQuantity: parseInt(productData.stockQuantity, 10),
        isDeleted: false,
        categoryId: Number(productData.categoryId),
        categoryName: cat ? cat.name : 'General',
        vendorId: Number(productData.vendorId),
        storeName: vendor ? vendor.storeName : 'Vendor Store'
      };
      store.products.push(newProd);
      saveStore(store);
      return newProd;
    }
  },

  async updateProduct(id, productData) {
    try {
      const backendPayload = {
        name: productData.name,
        description: productData.description || 'Product listing',
        price: parseFloat(productData.price),
        stock: parseInt(productData.stockQuantity || productData.stock, 10) || 100,
        categoryId: Number(productData.categoryId),
        vendorId: Number(productData.vendorId),
      };
      const result = await request(`${API_BASE}/product/${id}`, {
        method: 'PUT',
        body: JSON.stringify(backendPayload)
      });
      return mapBackendProduct(result);
    } catch {
      const store = getStore();
      const idx = store.products.findIndex(p => p.id === Number(id));
      if (idx !== -1) {
        const cat = store.categories.find(c => c.id === Number(productData.categoryId));
        const vendor = store.vendors.find(v => v.id === Number(productData.vendorId));
        store.products[idx] = {
          ...store.products[idx],
          name: productData.name,
          sku: productData.sku || store.products[idx].sku,
          description: productData.description,
          price: parseFloat(productData.price),
          stockQuantity: parseInt(productData.stockQuantity || productData.stock, 10),
          categoryId: Number(productData.categoryId),
          categoryName: cat ? cat.name : store.products[idx].categoryName,
          vendorId: Number(productData.vendorId),
          storeName: vendor ? vendor.storeName : store.products[idx].storeName
        };
        saveStore(store);
        return store.products[idx];
      }
      throw new Error('Product not found');
    }
  },

  async updateCategory(id, catData) {
    try {
      return await request(`${API_BASE}/category/${id}`, {
        method: 'PUT',
        body: JSON.stringify(catData)
      });
    } catch {
      const store = getStore();
      const idx = store.categories.findIndex(c => c.id === Number(id));
      if (idx !== -1) {
        store.categories[idx] = {
          ...store.categories[idx],
          name: catData.name,
          description: catData.description
        };
        saveStore(store);
        return store.categories[idx];
      }
      throw new Error('Category not found');
    }
  },

  async createBatchProducts(productsArray) {
    try {
      return await request(`${API_BASE}/products/batch`, {
        method: 'POST',
        body: JSON.stringify({ products: productsArray })
      });
    } catch {
      const store = getStore();
      const createdList = productsArray.map((p, idx) => {
        const cat = store.categories.find(c => c.id === Number(p.categoryId));
        const vendor = store.vendors.find(v => v.id === Number(p.vendorId));
        return {
          id: store.products.length + idx + 1,
          name: p.name,
          sku: p.sku,
          description: p.description,
          price: parseFloat(p.price),
          stockQuantity: parseInt(p.stockQuantity, 10),
          isDeleted: false,
          categoryId: Number(p.categoryId),
          categoryName: cat ? cat.name : 'General',
          vendorId: Number(p.vendorId),
          storeName: vendor ? vendor.storeName : 'Vendor Store'
        };
      });
      store.products.push(...createdList);
      saveStore(store);
      return createdList;
    }
  },

  async searchProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.categoryId) query.append('categoryId', params.categoryId);
    if (params.vendorId) query.append('vendorId', params.vendorId);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.search) query.append('search', params.search);
    if (params.page !== undefined) query.append('page', params.page);
    if (params.size !== undefined) query.append('size', params.size);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortDir) query.append('sortDir', params.sortDir);

    try {
      // Fetch all products from Spring Boot backend (GET /product)
      const backendProducts = await request(`${API_BASE}/product`);
      let list = backendProducts.map(mapBackendProduct);

      // Client-side filtering (backend has no combined filter endpoint)
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
        list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
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
        return sortDir === 'asc' ? valA - valB : valB - valA;
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
    } catch {
      const store = getStore();
      let list = store.products.filter(p => !p.isDeleted);

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
        list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
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
        return sortDir === 'asc' ? valA - valB : valB - valA;
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
    }
  },

  async deleteProduct(id) {
    try {
      // Use fetch directly since backend returns plain text, not JSON
      const res = await fetch(`${API_BASE}/product/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      if (res.ok) return null;
      throw new Error(`Delete failed: HTTP ${res.status}`);
    } catch {
      const store = getStore();
      const target = store.products.find(p => p.id === Number(id));
      if (target) {
        target.isDeleted = true;
        saveStore(store);
      }
      return null;
    }
  },

  // CART
  async addProductToCart(customerProfileId, productId) {
    try {
      return await request(`${API_BASE}/cart/items`, {
        method: 'POST',
        body: JSON.stringify({ customerProfileId, productId })
      });
    } catch {
      const store = getStore();
      let cart = store.carts[customerProfileId];
      if (!cart) {
        cart = { cartId: customerProfileId, customerProfileId, products: [], totalItems: 0 };
        store.carts[customerProfileId] = cart;
      }
      const prod = store.products.find(p => p.id === Number(productId));
      if (prod && !cart.products.some(p => p.id === prod.id)) {
        cart.products.push(prod);
        cart.totalItems = cart.products.length;
        saveStore(store);
      }
      return cart;
    }
  },

  async getCartByCustomerProfileId(customerProfileId) {
    try {
      return await request(`${API_BASE}/cart/${customerProfileId}`);
    } catch {
      const store = getStore();
      const cart = store.carts[customerProfileId] || {
        cartId: customerProfileId,
        customerProfileId: Number(customerProfileId),
        products: [],
        totalItems: 0
      };
      return cart;
    }
  },

  async removeProductFromCart(customerProfileId, productId) {
    try {
      return await request(`${API_BASE}/cart/items?customerProfileId=${customerProfileId}&productId=${productId}`, {
        method: 'DELETE'
      });
    } catch {
      const store = getStore();
      let cart = store.carts[customerProfileId];
      if (cart) {
        cart.products = cart.products.filter(p => p.id !== Number(productId));
        cart.totalItems = cart.products.length;
        saveStore(store);
      }
      return cart || { cartId: customerProfileId, customerProfileId, products: [], totalItems: 0 };
    }
  },

  // ORDERS
  async createOrder(orderRequest) {
    try {
      return await request(`${API_BASE}/orders`, {
        method: 'POST',
        body: JSON.stringify(orderRequest)
      });
    } catch {
      const store = getStore();
      const user = store.users.find(u => u.profile?.profileId === Number(orderRequest.customerProfileId));
      const customerName = user ? `${user.profile.firstName} ${user.profile.lastName}` : 'Aarav Sharma';
      
      let totalAmount = 0;
      const items = orderRequest.items.map((item, idx) => {
        const prod = store.products.find(p => p.id === Number(item.productId)) || { name: 'Product ' + item.productId, sku: 'SKU-' + item.productId, price: 99.99 };
        const unitPrice = prod.price;
        const subtotal = Number((unitPrice * item.quantity).toFixed(2));
        totalAmount += subtotal;
        return {
          itemId: idx + 101,
          productId: Number(item.productId),
          productName: prod.name,
          productSku: prod.sku,
          quantity: Number(item.quantity),
          unitPrice,
          subtotal
        };
      });

      const newOrder = {
        id: store.orders.length + 1,
        orderNumber: 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        customerProfileId: Number(orderRequest.customerProfileId),
        customerName,
        totalAmount: Number(totalAmount.toFixed(2)),
        status: 'PENDING',
        orderDate: new Date().toISOString(),
        items
      };

      store.orders.unshift(newOrder);

      // Clear cart items that were ordered
      if (store.carts[orderRequest.customerProfileId]) {
        const orderedProdIds = orderRequest.items.map(i => Number(i.productId));
        store.carts[orderRequest.customerProfileId].products = store.carts[orderRequest.customerProfileId].products.filter(
          p => !orderedProdIds.includes(p.id)
        );
        store.carts[orderRequest.customerProfileId].totalItems = store.carts[orderRequest.customerProfileId].products.length;
      }

      saveStore(store);
      return newOrder;
    }
  },

  async getOrdersByCustomerId(customerId) {
    try {
      return await request(`${API_BASE}/orders/customer/${customerId}`);
    } catch {
      const store = getStore();
      return store.orders.filter(o => o.customerProfileId === Number(customerId));
    }
  },

  async removeOrderItem(orderId, orderItemId) {
    try {
      return await request(`${API_BASE}/orders/${orderId}/items/${orderItemId}`, {
        method: 'DELETE'
      });
    } catch {
      const store = getStore();
      const order = store.orders.find(o => o.id === Number(orderId));
      if (order) {
        order.items = order.items.filter(item => item.itemId !== Number(orderItemId));
        order.totalAmount = Number(order.items.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2));
        saveStore(store);
        return order;
      }
      throw new Error('Order not found');
    }
  },

  // Reset Mock Store to initial state
  resetMockStore() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_DATA));
    return INITIAL_MOCK_DATA;
  }
};
