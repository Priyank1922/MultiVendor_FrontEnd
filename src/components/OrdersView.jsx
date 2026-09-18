import React, { useState, useEffect, useCallback } from 'react';
import SEO from './SEO';
import { 
  FileCode2, 
  Package, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  Store, 
  ShieldCheck,
  Truck,
  LogIn
} from 'lucide-react';
import { api } from '../services/api';

export default function OrdersView({ activeCustomer, onShowToast, onOpenAuthModal }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const customerId = activeCustomer?.profile?.profileId || activeCustomer?.id;
  const customerName = activeCustomer?.name || (activeCustomer?.profile?.firstName 
    ? `${activeCustomer.profile.firstName} ${activeCustomer.profile.lastName}`
    : (activeCustomer?.username || 'User'));

  const fetchOrders = useCallback(async () => {
    if (!customerId) {
      setOrders([]);
      return;
    }
    setLoading(true);
    try {
      const fetchedOrders = await api.getOrdersByCustomerId(customerId);
      setOrders(fetchedOrders);
    } catch (err) {
      if (onShowToast) onShowToast('error', 'Orders Load Error', err.message);
    } finally {
      setLoading(false);
    }
  }, [customerId, onShowToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleRemoveOrderItem = async (orderId) => {
    if (!window.confirm(`Delete Order #${orderId}?`)) {
      return;
    }
    try {
      await api.removeOrderItem(orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      if (onShowToast) onShowToast('success', 'Order Deleted', `Order #${orderId} deleted successfully.`);
    } catch (err) {
      if (onShowToast) onShowToast('error', 'Removal Failed', err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <SEO 
        title="My Orders & Purchase Receipts | AuraMart"
        description="Inspect order history, vendor details, and shipping status for your purchases on AuraMart."
        canonical="https://multi-vendor-front-end-rust.vercel.app/orders"
      />
      
      {/* Banner Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileCode2 className="w-5 h-5 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                My Orders & Order History
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              {activeCustomer ? (
                <>Account: <strong className="text-slate-900">{customerName}</strong> ({activeCustomer.email})</>
              ) : (
                <span className="text-amber-600 font-medium">Please sign in to view your orders</span>
              )}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Neon DB Verified
          </span>
        </div>
      </div>

      {/* Guest Notice if Not Logged In */}
      {!activeCustomer && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
            <LogIn className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Sign in to view your order history</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Log in with your registered account to track real-time order status, download GST receipts, and manage your shipments.
          </p>
          <button
            onClick={onOpenAuthModal}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            Sign In / Register
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-16 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
          <p className="text-sm font-medium">Fetching Orders from Neon DB...</p>
        </div>
      )}

      {/* Empty State */}
      {activeCustomer && !loading && orders.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs space-y-2">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't placed any orders yet. Visit the catalog to explore items and create your first purchase!
          </p>
        </div>
      )}

      {/* Orders List */}
      {activeCustomer && !loading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-100">
                    #{order.id}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Order #{order.id}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Date: {order.orderDate || 'Today'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    CONFIRMED
                  </span>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Total Amount</div>
                    <div className="text-base font-black text-slate-900">
                      ₹{parseFloat(order.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveOrderItem(order.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Order"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Order Status footer */}
              <div className="bg-slate-50 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-indigo-500" />
                  <span>Standard Pan-India Express Delivery</span>
                </span>
                <span className="font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                  GST Invoiced & Stored in Neon DB
                </span>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
