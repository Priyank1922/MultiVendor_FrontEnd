import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  Layers,
  Zap,
  Plus,
  FileCode2,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Edit,
  User,
  LogIn,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export default function Navbar({
  cartCount = 0,
  activeCustomer,
  setActiveCustomer,
  onOpenAuthModal,
  onLogout,
  onOpenCreateModal,
  onShowToast
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Profile Edit State
  const [editingUser, setEditingUser] = useState(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [updatingUser, setUpdatingUser] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setEditFirstName(editingUser.profile?.firstName || editingUser.name || '');
      setEditLastName(editingUser.profile?.lastName || '');
      setEditEmail(editingUser.email || '');
      setEditPhone(editingUser.profile?.phone || '');
      setEditAddress(editingUser.profile?.shippingAddress || editingUser.profile?.address || '');
    }
  }, [editingUser]);

  const handleUpdateUserSubmit = async (e) => {
    e.preventDefault();
    setUpdatingUser(true);
    try {
      const updated = await api.updateUser(editingUser.id, {
        firstName: editFirstName,
        lastName: editLastName,
        name: `${editFirstName} ${editLastName}`.trim(),
        email: editEmail,
        phone: editPhone,
        shippingAddress: editAddress,
      });
      if (setActiveCustomer) setActiveCustomer(updated);
      setEditingUser(null);
      if (onShowToast) {
        onShowToast('success', 'Profile Updated', 'Your customer details were updated.');
      }
    } catch (err) {
      if (onShowToast) {
        onShowToast('error', 'Update Failed', err.message);
      } else {
        alert('Failed to update profile: ' + err.message);
      }
    } finally {
      setUpdatingUser(false);
    }
  };

  // Close mobile drawer whenever location/route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Extract avatar initials
  const getInitials = (user) => {
    if (!user) return 'GU';
    if (user.profile?.firstName && user.profile?.lastName) {
      return `${user.profile.firstName[0]}${user.profile.lastName[0]}`.toUpperCase();
    }
    if (user.name) {
      const parts = user.name.split(' ');
      if (parts.length > 1) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return user.name.slice(0, 2).toUpperCase();
    }
    return user.username ? user.username.slice(0, 2).toUpperCase() : 'US';
  };

  const getDisplayName = (user) => {
    if (!user) return 'Guest';
    if (user.profile?.firstName) {
      return `${user.profile.firstName} ${user.profile.lastName || ''}`.trim();
    }
    return user.name || user.username || user.email?.split('@')[0] || 'Customer';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Brand Logo & Tagline */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-800 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base tracking-tight group-hover:text-indigo-600 transition-colors">
                  AuraMart
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                  Neon DB
                </span>
              </div>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/90 text-xs font-semibold">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all ${isActive
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`
              }
            >
              <Home className="w-3.5 h-3.5 text-indigo-400" />
              Home
            </NavLink>

            <NavLink
              to="/catalog"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all ${isActive
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`
              }
            >
              <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
              Catalog
            </NavLink>

            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all relative ${isActive
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`
              }
            >
              <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
              Cart
              {cartCount > 0 && (
                <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-rose-500 rounded-full animate-pulse shadow-sm shadow-rose-500/50">
                  {cartCount}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all ${isActive
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`
              }
            >
              <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
              My Orders
            </NavLink>

            <NavLink
              to="/batch"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all ${isActive
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`
              }
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Seller Hub
            </NavLink>

            <NavLink
              to="/showcase"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all ${isActive
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`
              }
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              Platform
            </NavLink>
          </nav>

          {/* Right Section: Customer Profile & Actions */}
          <div className="hidden sm:flex items-center gap-3">

            {/* Authenticated User Pill or Sign In Button */}
            {activeCustomer ? (
              <div className="flex items-center gap-2 bg-slate-100/90 border border-slate-200/90 pl-1.5 pr-2.5 py-1 rounded-xl text-xs">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  {getInitials(activeCustomer)}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold leading-none">
                    Logged In
                  </span>
                  <span className="font-bold text-slate-900 max-w-[120px] truncate leading-tight">
                    {getDisplayName(activeCustomer)}
                  </span>
                </div>

                <div className="flex items-center gap-0.5 ml-1 border-l border-slate-200 pl-1.5">
                  <button 
                    onClick={() => setEditingUser(activeCustomer)}
                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-md transition-colors cursor-pointer"
                    title="Edit Account Details"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button 
                    onClick={onLogout}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm shadow-indigo-500/25 active:scale-95 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            )}

            {/* Quick Resource Creation Modal Trigger */}
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Add Resource</span>
            </button>

          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            {!activeCustomer ? (
              <button
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            ) : (
              <button
                onClick={onOpenCreateModal}
                className="sm:hidden inline-flex items-center p-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
                title="Add Resource"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200/90 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-fade-in-down">
          
          <div className="flex flex-col gap-1 text-sm font-semibold">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2.5 p-3 rounded-xl transition-colors ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'
                }`
              }
            >
              <Home className="w-4 h-4 text-indigo-400" />
              Home Overview
            </NavLink>

            <NavLink
              to="/catalog"
              className={({ isActive }) =>
                `flex items-center gap-2.5 p-3 rounded-xl transition-colors ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'
                }`
              }
            >
              <ShoppingBag className="w-4 h-4 text-indigo-400" />
              Browse Catalog
            </NavLink>

            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `flex items-center justify-between p-3 rounded-xl transition-colors ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'
                }`
              }
            >
              <span className="flex items-center gap-2.5">
                <ShoppingCart className="w-4 h-4 text-emerald-400" />
                Cart
              </span>
              {cartCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-rose-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `flex items-center gap-2.5 p-3 rounded-xl transition-colors ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'
                }`
              }
            >
              <FileCode2 className="w-4 h-4 text-blue-400" />
              My Orders
            </NavLink>

            <NavLink
              to="/batch"
              className={({ isActive }) =>
                `flex items-center gap-2.5 p-3 rounded-xl transition-colors ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'
                }`
              }
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Seller Hub
            </NavLink>

            <NavLink
              to="/showcase"
              className={({ isActive }) =>
                `flex items-center gap-2.5 p-3 rounded-xl transition-colors ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'
                }`
              }
            >
              <Layers className="w-4 h-4 text-purple-400" />
              Platform
            </NavLink>
          </div>

          {/* Mobile Profile & Status Controls */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-3">

            {activeCustomer ? (
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold">
                    {getInitials(activeCustomer)}
                  </div>
                  <div className="text-xs">
                    <div className="text-slate-400 text-[10px]">Logged In User</div>
                    <div className="font-bold text-slate-900">
                      {getDisplayName(activeCustomer)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingUser(activeCustomer)}
                    className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 text-xs font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={onLogout}
                    className="p-1.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs font-semibold"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setIsMobileMenuOpen(false); onOpenAuthModal(); }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold p-3 rounded-xl text-xs shadow-md"
              >
                <LogIn className="w-4 h-4" />
                Sign In / Create Account
              </button>
            )}

            {/* Quick Action Button */}
            <button
              onClick={onOpenCreateModal}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold p-3 rounded-xl text-xs"
            >
              <Plus className="w-4 h-4 text-indigo-400" />
              Add Resource
            </button>

          </div>

        </div>
      )}

      {/* Edit Profile Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Edit Customer Profile
            </h3>
            <form onSubmit={handleUpdateUserSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={editFirstName}
                    onChange={e => setEditFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={editLastName}
                    onChange={e => setEditLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phone (10 digits) *</label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Shipping Address *</label>
                <input
                  type="text"
                  required
                  value={editAddress}
                  onChange={e => setEditAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl transition-all text-sm cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingUser}
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  {updatingUser ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </header>
  );
}
