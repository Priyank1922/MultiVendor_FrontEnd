import React, { useState } from 'react';
import SEO from './SEO';
import { 
  Layers, 
  ShieldCheck, 
  Zap, 
  Trash2, 
  Database, 
  CheckCircle2, 
  ArrowRight,
  Truck,
  Store,
  Lock,
  Package
} from 'lucide-react';

export default function HibernateShowcase() {
  const [activeTab, setActiveTab] = useState('performance');

  return (
    <div className="space-y-6 animate-fade-in-up">
      <SEO 
        title="Marketplace Guarantees & Features | AuraMart"
        description="Learn about AuraMart's buyer protection rules, verified seller compliance, and multi-vendor fulfillment capabilities."
        canonical="https://multi-vendor-front-end-rust.vercel.app/showcase"
      />
      
      {/* Banner Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-5 h-5 text-purple-600" />
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Marketplace Guarantees & Platform Features
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              Interactive overview of buyer protection rules, merchant seller tools, and catalog data structure.
            </p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Verified Standards
          </span>
        </div>
      </div>

      {/* Feature Selector Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-xs flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveTab('performance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'performance'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          Fast Checkout & Speed
        </button>

        <button
          onClick={() => setActiveTab('protection')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'protection'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Order History Preservation
        </button>

        <button
          onClick={() => setActiveTab('merchant')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'merchant'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-amber-400" />
          Bulk Merchant Tools
        </button>

        <button
          onClick={() => setActiveTab('cart')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'cart'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
          Clean Cart Sync
        </button>

        <button
          onClick={() => setActiveTab('model')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'model'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          Marketplace Data Model
        </button>
      </div>

      {/* Tab 1: Performance */}
      {activeTab === 'performance' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Optimized Multi-Vendor Browsing</h3>
              <p className="text-xs text-slate-500">
                Instant catalog filtering, fast cart recalculation, and seamless customer profile loading.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Single-Click Multi-Item Order Split
              </h4>
              <p className="leading-relaxed">
                When purchasing products from multiple independent vendors, items are consolidated automatically into clear order items.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Live Stock & Inventory Calculation
              </h4>
              <p className="leading-relaxed">
                Product stock levels adjust in real-time as purchases are completed across all merchant storefronts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Order History Protection */}
      {activeTab === 'protection' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Permanent Order History & Buyer Guarantee</h3>
              <p className="text-xs text-slate-500">
                Even if a merchant updates or archives a product, your past purchase receipts and order records remain 100% intact.
              </p>
            </div>
          </div>
          <div className="bg-slate-900 text-white p-5 rounded-xl text-xs space-y-2">
            <h4 className="font-bold text-emerald-400 text-sm">Safe Catalog Archiving</h4>
            <p className="text-slate-300 leading-relaxed">
              Our store guarantees that seller catalog modifications never alter existing customer receipts or historical order lines.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Bulk Merchant Tools */}
      {activeTab === 'merchant' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">High-Volume Merchant Operations</h3>
              <p className="text-xs text-slate-500">
                Independent sellers can add dozens of new products simultaneously and update pricing in bulk.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1">Bulk Product Import</h4>
              <p>Add up to 50 products per submission in the Merchant Seller Hub.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1">Instant Price Adjustments</h4>
              <p>Apply percentage-based discounts or global price adjustments across your vendor store.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Clean Cart Sync */}
      {activeTab === 'cart' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Automated Shopping Cart Clean Sync</h3>
              <p className="text-xs text-slate-500">
                Removing an item from your cart or modifying quantities instantly cleans your active profile cart.
              </p>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
            <p>Your active shopping cart automatically updates item counts, subtotal sums, and tax estimates without page reloads.</p>
          </div>
        </div>
      )}

      {/* Tab 5: Data Model Overview */}
      {activeTab === 'model' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Marketplace Domain Model</h3>
              <p className="text-xs text-slate-500">
                How users, vendors, products, categories, carts, and orders connect seamlessly.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block">Customer Account</span>
              <span className="text-slate-500 text-[11px]">Shipping & Cart Owner</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block">Vendor Merchant</span>
              <span className="text-slate-500 text-[11px]">Product Seller Profile</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block">Product Item</span>
              <span className="text-slate-500 text-[11px]">Price & Stock Unit</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block">Category</span>
              <span className="text-slate-500 text-[11px]">Catalog Grouping</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block">Shopping Cart</span>
              <span className="text-slate-500 text-[11px]">Active Items & Totals</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block">Customer Order</span>
              <span className="text-slate-500 text-[11px]">Receipt & Order Items</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
