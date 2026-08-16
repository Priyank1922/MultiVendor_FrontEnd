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
  DollarSign,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { api } from '../services/api';

export default function OrdersView({ activeCustomer, onShowToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const customerId = activeCustomer?.profile?.profileId || activeCustomer?.id || 1;
  const customerName = activeCustomer?.profile?.firstName 
    ? `${activeCustomer.profile.firstName} ${activeCustomer.profile.lastName}`
    : (activeCustomer?.username || 'User');

  const fetchOrders = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const fetchedOrders = await api.getOrdersByCustomer(customerId);
      setOrders(fetchedOrders);
    } catch (err) {
      onShowToast('error', 'Orders Load Error', err.message);
    } finally {
      setLoading(false);
    }
  }, [customerId, onShowToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleRemoveOrderItem = async (orderId, orderItemId, prodName) => {
    if (!window.confirm(`Remove "${prodName}" from Order #${orderId}?`)) {
      return;
    }
    try {
      const updatedOrder = await api.removeOrderItem(orderId, orderItemId);
      setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      onShowToast('success', 'Item Removed', `"${prodName}" has been removed from Order #${orderId}.`);
    } catch (err) {
      onShowToast('error', 'Removal Failed', err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <SEO 
        title="My Orders & Purchase Receipts | AuraMart"
        description="Inspect order history, vendor details, and shipping status for your purchases on AuraMart."
        canonical="https://auramart.vercel.app/orders"
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
              Account: <strong className="text-slate-900">{customerName}</strong> (Profile #{customerId})
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified Transactions
          </span>
        </div>
      </div>

      {/* User-Friendly Guarantee Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Direct Seller Order Fulfillment & Buyer Guarantee</h4>
              <p className="text-xs text-slate-400">
                All order details, vendor assignments, and line items are verified and tracked in real time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 px-3.5 py-1.5 rounded-lg border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Orders</span>
              <span className="text-sm font-bold text-emerald-400">{orders.length} Placed</span>
            </div>
            <div className="bg-slate-800/80 px-3.5 py-1.5 rounded-lg border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Delivery Status</span>
              <span className="text-sm font-bold text-blue-400">Tracked</span>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="py-16 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
          <p className="text-sm font-medium">Loading Your Orders...</p>
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Orders Found for Customer</h3>
          <p className="text-sm text-slate-500">
            You haven't placed any orders yet. Visit the Catalog to add items to your cart!
          </p>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order.id}
              className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden"
            >
              {/* Order Top Bar */}
              <div className="bg-slate-50 border-b border-slate-200 p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    #{order.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">Order #{order.id}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {order.status || 'CONFIRMED'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.orderDate ? new Date(order.orderDate).toLocaleString() : 'Recent'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Order Total</span>
                    <span className="text-lg font-extrabold text-slate-900">
                      ₹{parseFloat(order.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="p-4 sm:p-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Purchased Items ({order.items?.length || 0})
                </h4>

                {order.items?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No items remain in this order.</p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                    {order.items.map((item) => (
                      <div 
                        key={item.itemId}
                        className="p-3 sm:p-4 bg-slate-50/50 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                            <Package className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">
                              {item.productName}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                              <Store className="w-3 h-3 text-slate-400" />
                              <span>{item.vendorName || 'Independent Vendor'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs justify-between sm:justify-end">
                          <div className="text-slate-600">
                            Qty: <strong className="text-slate-900 font-bold">{item.quantity}</strong>
                          </div>
                          <div className="text-slate-600">
                            Price: <strong className="text-slate-900 font-bold">₹{parseFloat(item.unitPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="text-sm font-extrabold text-emerald-600 min-w-[70px] text-right">
                            ₹{parseFloat(item.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>

                          <button
                            onClick={() => handleRemoveOrderItem(order.id, item.itemId, item.productName)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                            title="Remove this item from your order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
