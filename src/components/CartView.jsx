import React, { useState, useEffect, useCallback } from 'react';
import SEO from './SEO';
import { 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  UserCheck, 
  Store, 
  Tag, 
  RefreshCw 
} from 'lucide-react';
import { api } from '../services/api';

export default function CartView({
  activeCustomer,
  onShowToast,
  onOrderPlaced
}) {
  const [cart, setCart] = useState({ products: [], totalItems: 0 });
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [placingOrder, setPlacingOrder] = useState(false);

  const customerProfileId = activeCustomer?.profile?.profileId || activeCustomer?.id || 1;

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getCartByCustomerProfileId(customerProfileId);
      setCart(data);
      const initialQty = {};
      data.products.forEach(p => {
        initialQty[p.id] = quantities[p.id] || 1;
      });
      setQuantities(initialQty);
    } catch (err) {
      onShowToast('error', 'Fetch Cart Failed', err.message);
    } finally {
      setLoading(false);
    }
  }, [customerProfileId, onShowToast]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleRemoveFromCart = async (productId, name) => {
    try {
      const updated = await api.removeProductFromCart(customerProfileId, productId);
      setCart(updated);
      onShowToast('info', 'Item Removed', `Removed "${name}" from cart.`);
    } catch (err) {
      onShowToast('error', 'Remove Failed', err.message);
    }
  };

  const handleQuantityChange = (productId, val) => {
    const qty = Math.max(1, parseInt(val, 10) || 1);
    setQuantities(prev => ({ ...prev, [productId]: qty }));
  };

  const calculateSubtotal = () => {
    return cart.products.reduce((acc, p) => {
      const q = quantities[p.id] || 1;
      return acc + (parseFloat(p.price) * q);
    }, 0);
  };

  const handleCheckout = async () => {
    if (cart.products.length === 0) return;
    setPlacingOrder(true);
    try {
      const orderItems = cart.products.map(p => ({
        productId: p.id,
        quantity: quantities[p.id] || 1
      }));

      const newOrder = await api.createOrder({
        customerProfileId,
        items: orderItems
      });

      onShowToast('success', 'Order Placed!', `Order #${newOrder.orderNumber || newOrder.id} placed successfully!`);
      onOrderPlaced(newOrder);
      fetchCart();
    } catch (err) {
      onShowToast('error', 'Checkout Failed', err.message);
    } font-semibold;
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <SEO 
        title="Shopping Cart | AuraMart"
        description="View and manage items in your consolidated multi-vendor shopping cart on AuraMart."
        canonical="https://auramart.vercel.app/cart"
      />
      
      {/* Banner Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Customer Shopping Cart
              </h1>
            </div>
            <p className="text-sm text-slate-500 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-slate-400" />
              Active Customer: <strong className="text-slate-900">{activeCustomer?.profile?.firstName ? `${activeCustomer.profile.firstName} ${activeCustomer.profile.lastName}` : activeCustomer?.username || 'Aarav Sharma'}</strong> (Profile #{customerProfileId})
            </p>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span>🇮🇳</span>
            Consolidated Cart
          </span>
        </div>
      </div>

      {loading && (
        <div className="py-16 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
          <p className="text-sm font-medium">Loading Shopping Cart Items...</p>
        </div>
      )}

      {!loading && cart.products.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">Your Shopping Cart is Empty</h3>
          <p className="text-sm text-slate-500">
            Browse the product catalog and click "Add to Cart" to build your order!
          </p>
        </div>
      )}

      {!loading && cart.products.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Cart Products List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.products.map(p => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      <Store className="w-3 h-3 text-slate-500" />
                      {p.storeName || 'Vendor ' + p.vendorId}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {p.categoryName}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{p.name}</h4>
                  <div className="text-xs font-mono text-slate-400">{p.sku}</div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Unit price */}
                  <div className="text-right">
                    <span className="text-xs text-slate-400 uppercase font-medium">Unit Price</span>
                    <div className="text-sm font-bold text-slate-900">₹{parseFloat(p.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                  </div>

                  {/* Quantity Input */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                    <span className="text-xs font-semibold text-slate-500">Qty:</span>
                    <input
                      type="number"
                      min="1"
                      max={p.stockQuantity}
                      value={quantities[p.id] || 1}
                      onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                      className="w-12 text-center bg-white border border-slate-200 rounded text-xs font-bold py-0.5 text-slate-900 focus:outline-none"
                    />
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[80px]">
                    <span className="text-xs text-slate-400 uppercase font-medium">Subtotal</span>
                    <div className="text-base font-extrabold text-emerald-600">
                      ₹{(parseFloat(p.price) * (quantities[p.id] || 1)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromCart(p.id, p.name)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                    title="Remove from Cart"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Checkout Summary Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs h-fit space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Unique Items:</span>
                <span className="font-semibold text-slate-900">{cart.products.length}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Quantity:</span>
                <span className="font-semibold text-slate-900">
                  {Object.values(quantities).reduce((a, b) => a + Number(b), 0)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 items-center">
                <span>Taxes & GST:</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  GST Included
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-base font-semibold text-slate-900">Total Amount:</span>
              <span className="text-2xl font-extrabold text-slate-900">
                ₹{calculateSubtotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={placingOrder}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              {placingOrder ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                  Processing Order...
                </>
              ) : (
                <>
                  Place Order
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </>
              )}
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Secure Checkout & GST Invoice
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
