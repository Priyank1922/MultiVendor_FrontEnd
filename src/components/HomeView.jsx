import React from 'react';
import { Link } from 'react-router-dom';
import SEO from './SEO';
import { 
  ShoppingBag, 
  Zap, 
  Layers, 
  FileCode2, 
  ShoppingCart, 
  ShieldCheck, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Truck,
  Star,
  Clock,
  Award
} from 'lucide-react';

export default function HomeView({ categories = [], vendors = [], activeCustomer, onOpenAuthModal }) {
  return (
    <div className="space-y-16 pb-12 animate-fade-in-up">
      <SEO 
        title="AuraMart - Premier Multi-Vendor Online Marketplace"
        description="AuraMart is India's leading multi-vendor online marketplace. Shop electronics, premium fashion, audio, and wearables from verified sellers with express delivery."
        canonical="https://multi-vendor-front-end-rust.vercel.app/"
      />
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
        {/* Decorative Background Glowing Orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* User Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 backdrop-blur-md glow-indigo">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>✨ Powered by Neon PostgreSQL & Spring Boot</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Discover Quality Products from <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                Verified Sellers Across India
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Shop thousands of curated items from verified sellers with instant cart consolidation, GST invoices, and express delivery directly saved to Neon DB.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                Browse Catalog
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              {!activeCustomer && (
                <button
                  onClick={onOpenAuthModal}
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-3 rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:-translate-y-0.5 text-sm cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Sign In / Register
                </button>
              )}

              <Link
                to="/batch"
                className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-slate-100 font-semibold px-6 py-3 rounded-xl border border-slate-700/80 transition-all hover:-translate-y-0.5 text-sm backdrop-blur-sm"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                Seller Hub
              </Link>
            </div>

            {/* Live Highlights Pills */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs">
              <div>
                <div className="text-slate-400">Product Categories</div>
                <div className="text-lg font-bold text-white mt-0.5">{categories.length || 6} Curated</div>
              </div>
              <div>
                <div className="text-slate-400">Indian Merchants</div>
                <div className="text-lg font-bold text-indigo-400 mt-0.5">{vendors.length || 4} Verified</div>
              </div>
              <div>
                <div className="text-slate-400">Pan-India Delivery</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">Express Speed</div>
              </div>
            </div>

          </div>

          {/* Hero Right Visual Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5 animate-float backdrop-blur-md">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white">Live Store Activity</h3>
                    <p className="text-xs text-slate-400">GST Invoice & Buyer Guarantee</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  STORE ONLINE
                </span>
              </div>

              {/* Real-Time Live Order Activity Card */}
              <div className="bg-slate-950 rounded-xl p-4 text-xs text-slate-300 border border-slate-800/90 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-2">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    Recent Verified Purchase
                  </span>
                  <span className="text-emerald-400 font-semibold">Just Now</span>
                </div>
                <div className="flex items-center justify-between text-slate-200">
                  <div>
                    <div className="font-bold text-white text-sm">Pro Noise-Cancelling Headphones</div>
                    <div className="text-slate-400 text-[11px]">Sold by <span className="text-indigo-300">Bengaluru Electronics</span></div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-emerald-400 text-sm">₹2,499.00</div>
                    <div className="text-[10px] text-slate-400">Express Delivery</div>
                  </div>
                </div>
              </div>

              {/* Status Guarantee Checklist */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center justify-between bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Consolidated Multi-Vendor Shopping Cart
                  </span>
                  <span className="text-slate-400 text-[11px]">Auto Split</span>
                </div>

                <div className="flex items-center justify-between bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Merchant Inventory & Bulk Upload Hub
                  </span>
                  <span className="text-slate-400 text-[11px]">Instant Sync</span>
                </div>

                <div className="flex items-center justify-between bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Complete Order Tracking & Purchase Protection
                  </span>
                  <span className="text-slate-400 text-[11px]">Active</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ABOUT THE SYSTEM SECTION */}
      <section className="space-y-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Award className="w-3.5 h-3.5 text-indigo-600" />
            Marketplace Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Designed for Buyers & Independent Sellers
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Our platform provides a seamless experience for shoppers to discover top items while empowering independent vendors to manage catalog inventory efficiently.
          </p>
        </div>

        {/* 4 Feature User Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FileCode2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Real-Time Order Tracking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track purchase receipts, inspect individual item line breakdowns, and monitor shipment status across all your orders.
            </p>
            <Link to="/orders" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              View My Orders <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Merchant Seller Hub</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Powerful tools for independent merchants to list new items in bulk, adjust prices instantly, and update inventory stock.
            </p>
            <Link to="/batch" className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-800">
              Open Seller Portal <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Verified Quality & Safety</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Comprehensive buyer protection, transparent seller ratings, and guaranteed order history preservation.
            </p>
            <Link to="/showcase" className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800">
              Read Guarantees <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Unified Checkout</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Combine products from multiple vendors into a single shopping cart with transparent delivery calculation and one-click checkout.
            </p>
            <Link to="/catalog" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-800">
              Shop Marketplace <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>

      </section>

      {/* PLATFORM GUARANTEES & METRICS GRID */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Customer & Merchant Promise</span>
            <h3 className="text-xl sm:text-2xl font-bold mt-1">Built For Trust & Convenience</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
              Fast Checkout
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
              Verified Sellers
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
              Order Protection
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 text-xs text-slate-300">
          
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
              <Truck className="w-4 h-4 text-indigo-400" />
              Express Merchant Fulfillment
            </div>
            <p className="text-slate-400 leading-relaxed">
              Every vendor on AuraMart is vetted to ensure prompt shipping, accurate product descriptions, and reliable delivery times.
            </p>
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
              <Star className="w-4 h-4 text-amber-400" />
              Transparent Pricing & Reviews
            </div>
            <p className="text-slate-400 leading-relaxed">
              No hidden fees. Enjoy transparent pricing directly from sellers with real product ratings and customer feedback.
            </p>
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Secure Buyer Protection
            </div>
            <p className="text-slate-400 leading-relaxed">
              Your customer account details and order records are protected with enterprise-grade data security and privacy controls.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
