import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import CatalogView from './components/CatalogView';
import CartView from './components/CartView';
import OrdersView from './components/OrdersView';
import BatchSellerHub from './components/BatchSellerHub';
import HibernateShowcase from './components/HibernateShowcase';
import CreateEntityModal from './components/CreateEntityModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import { api } from './services/api';

function AppContent() {
  const navigate = useNavigate();
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  // Active Customer Session (Restored from explicit login or starts as null)
  const [activeCustomer, setActiveCustomer] = useState(() => api.getCurrentUser());
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  
  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Toast Trigger Helper
  const showToast = useCallback((type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Open Auth Modal helper
  const openAuth = useCallback((mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  // Handle Logout
  const handleLogout = useCallback(() => {
    api.logout();
    setActiveCustomer(null);
    setCartCount(0);
    showToast('info', 'Signed Out', 'You have been logged out successfully.');
  }, [showToast]);

  // Handle Login / Register Success
  const handleAuthSuccess = useCallback((user) => {
    setActiveCustomer(user);
    showToast('success', 'Authenticated', `Signed in as ${user.name || user.username}`);
  }, [showToast]);

  // Load Initial Backend Data (Categories & Vendors)
  const initData = useCallback(async () => {
    const isLive = await api.checkBackendHealth();
    setIsLiveBackend(isLive);

    try {
      const cats = await api.getAllCategories();
      setCategories(cats);

      const vends = await api.getAllVendors();
      setVendors(vends);
    } catch (err) {
      console.error('Data Init Error:', err);
    }
  }, []);

  useEffect(() => {
    initData();
  }, [initData]);

  // Update Cart Count for Active Customer
  const updateCartCount = useCallback(async () => {
    if (!activeCustomer) {
      setCartCount(0);
      return;
    }
    const profileId = activeCustomer.profile?.profileId || activeCustomer.id;
    try {
      const cart = await api.getCartByCustomerProfileId(profileId);
      setCartCount(cart.products?.length || 0);
    } catch {
      setCartCount(0);
    }
  }, [activeCustomer]);

  useEffect(() => {
    updateCartCount();
  }, [updateCartCount]);

  const handleAddToCart = async (product) => {
    if (!activeCustomer) {
      showToast('info', 'Sign In Required', 'Please sign in or create an account to add items to your cart.');
      openAuth('login');
      return;
    }
    const profileId = activeCustomer.profile?.profileId || activeCustomer.id;
    try {
      await api.addProductToCart(profileId, product.id);
      showToast('success', 'Added to Cart', `"${product.name}" added to cart for @${activeCustomer.name || activeCustomer.username}.`);
      updateCartCount();
    } catch (err) {
      showToast('error', 'Add to Cart Failed', err.message);
    }
  };

  const handleEntityCreated = (type, entity) => {
    if (type === 'user') {
      setActiveCustomer(entity);
      showToast('success', 'Account Registered', `Logged in as ${entity.name || entity.username}.`);
    } else if (type === 'category') {
      setCategories(prev => [...prev, entity]);
    } else if (type === 'vendor') {
      setVendors(prev => [...prev, entity]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col antialiased text-slate-900">
      
      {/* Navbar Header */}
      <Navbar
        cartCount={cartCount}
        activeCustomer={activeCustomer}
        setActiveCustomer={setActiveCustomer}
        onOpenAuthModal={() => openAuth('login')}
        onLogout={handleLogout}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onShowToast={showToast}
      />

      {/* Main View Container with Routes */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8">
        <Routes>
          <Route
            path="/"
            element={
              <HomeView
                categories={categories}
                vendors={vendors}
                activeCustomer={activeCustomer}
                onOpenAuthModal={() => openAuth('register')}
              />
            }
          />

          <Route
            path="/catalog"
            element={
              <CatalogView
                categories={categories}
                vendors={vendors}
                activeCustomer={activeCustomer}
                onAddToCart={handleAddToCart}
                onShowToast={showToast}
                onOpenAuthModal={() => openAuth('login')}
              />
            }
          />

          <Route
            path="/cart"
            element={
              <CartView
                activeCustomer={activeCustomer}
                onShowToast={showToast}
                onOpenAuthModal={() => openAuth('login')}
                onOrderPlaced={() => {
                  updateCartCount();
                  navigate('/orders');
                }}
              />
            }
          />

          <Route
            path="/orders"
            element={
              <OrdersView
                activeCustomer={activeCustomer}
                onShowToast={showToast}
                onOpenAuthModal={() => openAuth('login')}
              />
            }
          />

          <Route
            path="/batch"
            element={
              <BatchSellerHub
                categories={categories}
                vendors={vendors}
                onShowToast={showToast}
                onProductsUpdated={() => {
                  initData();
                }}
              />
            }
          />

          <Route
            path="/showcase"
            element={
              <HibernateShowcase />
            }
          />
        </Routes>
      </main>

      {/* Authentication Modal (Sign In / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
        onShowToast={showToast}
      />

      {/* Entity Creation Modal (Vendors, Categories, Products) */}
      <CreateEntityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        categories={categories}
        vendors={vendors}
        onShowToast={showToast}
        onEntityCreated={handleEntityCreated}
      />

      {/* Floating Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
