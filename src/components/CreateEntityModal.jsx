import React, { useState } from 'react';
import { 
  UserPlus, 
  Store, 
  Tag, 
  Package, 
  X, 
  Sparkles,
  RefreshCw 
} from 'lucide-react';
import { api } from '../services/api';

export default function CreateEntityModal({
  isOpen,
  onClose,
  categories,
  vendors,
  onShowToast,
  onEntityCreated
}) {
  const [activeTab, setActiveTab] = useState('user');
  const [submitting, setSubmitting] = useState(false);

  // User Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Password123!');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('9876543210');
  const [shippingAddress, setShippingAddress] = useState('102 MG Road, Indiranagar');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('KA');
  const [zipCode, setZipCode] = useState('560001');

  // Vendor Form State
  const [storeName, setStoreName] = useState('');
  const [contactName, setContactName] = useState('');
  const [sellerCode, setSellerCode] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [vendorPhone, setVendorPhone] = useState('9876543211');
  const [vendorAddress, setVendorAddress] = useState('103 MG Road, Indiranagar');

  // Category Form State
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Product Form State
  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('100');
  const [prodCatId, setProdCatId] = useState(categories[0]?.id || 1);
  const [prodVendId, setProdVendId] = useState(vendors[0]?.id || 1);
  const [prodDesc, setProdDesc] = useState('');

  if (!isOpen) return null;

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newUser = await api.createUser({
        username,
        email,
        password,
        role: 'CUSTOMER',
        firstName,
        lastName,
        phone,
        shippingAddress,
        city,
        state,
        zipCode,
        country: 'India'
      });
      onShowToast('success', 'Account Registered', `Registered customer @${newUser.username}.`);
      onEntityCreated('user', newUser);
      onClose();
    } catch (err) {
      onShowToast('error', 'Registration Failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateVendor = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const vendor = await api.createVendor({
        storeName,
        contactName,
        contactEmail,
        phoneNumber: vendorPhone,
        address: vendorAddress,
        sellerCode: sellerCode || `VEND-${Date.now()}`
      });
      onShowToast('success', 'Merchant Registered', `Created store "${vendor.storeName}".`);
      onEntityCreated('vendor', vendor);
      onClose();
    } catch (err) {
      onShowToast('error', 'Merchant Creation Failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const cat = await api.createCategory({
        name: catName,
        description: catDesc || 'Product category'
      });
      onShowToast('success', 'Category Created', `Created category "${cat.name}".`);
      onEntityCreated('category', cat);
      onClose();
    } catch (err) {
      onShowToast('error', 'Category Creation Failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const prod = await api.createProduct({
        name: prodName,
        sku: prodSku || `SKU-PROD-${Date.now()}`,
        description: prodDesc || 'Catalog Product',
        price: prodPrice,
        stockQuantity: prodStock,
        categoryId: prodCatId,
        vendorId: prodVendId
      });
      onShowToast('success', 'Product Added', `Added "${prod.name}" to catalog.`);
      onEntityCreated('product', prod);
      onClose();
    } catch (err) {
      onShowToast('error', 'Product Addition Failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Add Marketplace Resource</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 grid grid-cols-4 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('user')}
            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'user' 
                ? 'bg-white border-indigo-200 text-indigo-600 shadow-xs' 
                : 'border-transparent text-slate-500 hover:bg-white/60'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Customer</span>
          </button>

          <button
            onClick={() => setActiveTab('vendor')}
            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'vendor' 
                ? 'bg-white border-indigo-200 text-indigo-600 shadow-xs' 
                : 'border-transparent text-slate-500 hover:bg-white/60'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Merchant</span>
          </button>

          <button
            onClick={() => setActiveTab('category')}
            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'category' 
                ? 'bg-white border-indigo-200 text-indigo-600 shadow-xs' 
                : 'border-transparent text-slate-500 hover:bg-white/60'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Category</span>
          </button>

          <button
            onClick={() => setActiveTab('product')}
            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'product' 
                ? 'bg-white border-indigo-200 text-indigo-600 shadow-xs' 
                : 'border-transparent text-slate-500 hover:bg-white/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product</span>
          </button>
        </div>

        {/* Tab Forms */}
        <div className="p-6">
          
          {/* USER FORM */}
          {activeTab === 'user' && (
            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="e.g. john_doe"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone (10 digits) *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Shipping Address *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={e => setShippingAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Zip Code</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={e => setZipCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  Register Customer Account
                </button>
              </div>
            </form>
          )}

          {/* VENDOR FORM */}
          {activeTab === 'vendor' && (
            <form onSubmit={handleCreateVendor} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Store / Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                    placeholder="e.g. Acme Tech Store"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    placeholder="e.g. Jane Smith"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Contact Email *</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    placeholder="support@store.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number (10 digits) *</label>
                  <input
                    type="text"
                    required
                    value={vendorPhone}
                    onChange={e => setVendorPhone(e.target.value)}
                    placeholder="e.g. 9876543211"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Physical Address *</label>
                <input
                  type="text"
                  required
                  value={vendorAddress}
                  onChange={e => setVendorAddress(e.target.value)}
                  placeholder="Min 5 characters address"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Store className="w-4 h-4" />}
                  Register Merchant Store
                </button>
              </div>
            </form>
          )}

          {/* CATEGORY FORM */}
          {activeTab === 'category' && (
            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={e => setCatName(e.target.value)}
                  placeholder="e.g. Smart Home Gadgets"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows="3"
                  value={catDesc}
                  onChange={e => setCatDesc(e.target.value)}
                  placeholder="Short description of products in this category..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
                  Add Product Category
                </button>
              </div>
            </form>
          )}

          {/* PRODUCT FORM */}
          {activeTab === 'product' && (
            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={e => setProdName(e.target.value)}
                  placeholder="e.g. Wireless Ergonomic Mouse"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodPrice}
                    onChange={e => setProdPrice(e.target.value)}
                    placeholder="49.99"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={e => setProdStock(e.target.value)}
                    placeholder="100"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={prodCatId}
                    onChange={e => setProdCatId(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Seller / Vendor *</label>
                  <select
                    value={prodVendId}
                    onChange={e => setProdVendId(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                  >
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.storeName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows="2"
                  value={prodDesc}
                  onChange={e => setProdDesc(e.target.value)}
                  placeholder="Key features and details..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
                  Add Product to Catalog
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
