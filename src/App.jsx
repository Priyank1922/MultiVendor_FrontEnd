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
import Toast from './components/Toast';
import { api } from './services/api';

function AppContent() {
  const navigate = useNavigate();
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  // Domain Data State
  const [users, setUsers] = useState([]);
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  
  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Toast Trigger Helper
  const showToast = useCallback((type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Load Initial Backend Data & Categories/Vendors
  const initData = useCallback(async () => {
    const isLive = await api.checkBackendHealth();
    setIsLiveBackend(isLive);

    try {
      const cats = await api.getAllCategories();
      setCategories(cats);

      const vends = await api.getAllVendors();
      setVendors(vends);

      const customersList = await api.getAllCustomers();
      setUsers(customersList);
      if (customersList.length > 0) {
        setActiveCustomer(customersList[0]);
      } else {
        setActiveCustomer(null);
      }
    } catch (err) {
      console.error('Data Init Error:', err);
    }
  }, []);

  useEffect(() => {
    initData();
  }, [initData]);

  // Update Cart Count for Active Customer
  const updateCartCount = useCallback(async () => {
    if (!activeCustomer) return;
    const profileId = activeCustomer.profile?.profileId || activeCustomer.id || 1;
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
    const profileId = activeCustomer?.profile?.profileId || activeCustomer?.id || 1;
    try {
      await api.addProductToCart(profileId, product.id);
      showToast('success', 'Added to Cart', `"${product.name}" added to cart for @${activeCustomer?.username || 'user'}.`);
      updateCartCount();
    } catch (err) {
      showToast('error', 'Add to Cart Failed', err.message);
    }
  };

  const handleEntityCreated = (type, entity) => {
    if (type === 'user') {
      setUsers(prev => [...prev, entity]);
      setActiveCustomer(entity);
    } else if (type === 'category') {
      setCategories(prev => [...prev, entity]);
    } else if (type === 'vendor') {
      setVendors(prev => [...prev, entity]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col antialiased text-slate-900">
      
      {/* Navbar Header with React Router NavLinks */}
      <Navbar
        cartCount={cartCount}
        activeCustomer={activeCustomer}
        setActiveCustomer={setActiveCustomer}
        users={users}
        isLiveBackend={isLiveBackend}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
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
              />
            }
          />

          <Route
            path="/cart"
            element={
              <CartView
                activeCustomer={activeCustomer}
                onShowToast={showToast}
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

      {/* Entity Creation Modal */}
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
