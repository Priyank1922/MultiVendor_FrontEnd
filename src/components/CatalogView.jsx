import React, { useState, useEffect, useCallback } from 'react';
import SEO from './SEO';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Trash2, 
  ArrowUpDown, 
  Store, 
  Tag, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw,
  Database,
  Layers,
  CheckCircle2,
  Edit
} from 'lucide-react';
import { api } from '../services/api';

export default function CatalogView({
  categories,
  vendors,
  activeCustomer,
  onAddToCart,
  onShowToast
}) {
  const [productsPage, setProductsPage] = useState({ content: [], totalPages: 1, totalElements: 0, number: 0 });
  const [loading, setLoading] = useState(false);
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(6);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCatId, setEditCatId] = useState('');
  const [editVendId, setEditVendId] = useState('');
  const [editSku, setEditSku] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setEditName(prod.name);
    setEditSku(prod.sku);
    setEditPrice(prod.price);
    setEditStock(prod.stockQuantity);
    setEditDesc(prod.description);
    setEditCatId(prod.categoryId || '');
    setEditVendId(prod.vendorId || '');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.updateProduct(editingProduct.id, {
        name: editName,
        sku: editSku,
        price: editPrice,
        stockQuantity: editStock,
        description: editDesc,
        categoryId: editCatId,
        vendorId: editVendId
      });
      onShowToast('success', 'Product Updated', `Successfully updated "${editName}"`);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      onShowToast('error', 'Update Failed', err.message);
    } finally {
      setUpdating(false);
    }
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.searchProducts({
        categoryId: selectedCategory || undefined,
        vendorId: selectedVendor || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        search: search || undefined,
        page,
        size,
        sortBy,
        sortDir
      });
      setProductsPage(data);
    } catch (err) {
      onShowToast('error', 'Fetch Failed', err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedVendor, minPrice, maxPrice, search, page, size, sortBy, sortDir, onShowToast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSoftDelete = async (productId, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the product catalog?`)) {
      return;
    }
    try {
      await api.deleteProduct(productId);
      onShowToast('success', 'Product Removed', `Product "${name}" has been removed from catalog.`);
      fetchProducts();
    } catch (err) {
      onShowToast('error', 'Delete Failed', err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <SEO 
        title="Product Catalog | AuraMart - Shop Premium Brands"
        description="Browse curated electronics, fashion, and home essentials on AuraMart."
        canonical="https://auramart.vercel.app/catalog"
      />
      
      {/* Light Theme Banner Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Product Catalog & Store Directory
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              Browse thousands of verified products from top Indian vendors with instant search and filters
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Spring Cache Active
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              MySQL Indexed
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Controls Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          
          {/* Search Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
              <Search className="w-3.5 h-3.5" /> Search Catalog
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="Product name, SKU..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Category
            </label>
            <select
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(0); }}
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Vendor Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
              <Store className="w-3.5 h-3.5" /> Vendor Store
            </label>
            <select
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              value={selectedVendor}
              onChange={(e) => { setSelectedVendor(e.target.value); setPage(0); }}
            >
              <option value="">All Vendors</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.storeName}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Price Range ($)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => { setMinPrice(e.target.value); setPage(0); }}
              />
              <input
                type="number"
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); setPage(0); }}
              />
            </div>
          </div>

          {/* Sorting */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort Order
            </label>
            <div className="flex gap-2">
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="id">ID</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
                <option value="stockQuantity">Stock</option>
              </select>
              <button
                onClick={() => setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-all cursor-pointer"
                title="Toggle Sort Direction"
              >
                {sortDir.toUpperCase()}
              </button>
            </div>
          </div>

        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
          <span className="text-xs font-semibold text-slate-400">Categories:</span>
          <button
            onClick={() => { setSelectedCategory(''); setPage(0); }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === '' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({productsPage.totalElements || 0})
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => { setSelectedCategory(String(c.id)); setPage(0); }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === String(c.id) 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="py-16 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
          <p className="text-sm font-medium">Executing Paginated JPQL Query & Fetching Products...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && productsPage.content.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Products Match Filters</h3>
          <p className="text-sm text-slate-500 mb-4">
            Try resetting your search parameters or adding products via the Seller Batch Hub.
          </p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedVendor(''); setMinPrice(''); setMaxPrice(''); setPage(0); }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Product Cards Grid */}
      {!loading && productsPage.content.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsPage.content.map(prod => (
            <div 
              key={prod.id} 
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Store Name & Category Pills */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    <Store className="w-3 h-3 text-slate-500" />
                    {prod.storeName || 'Vendor ' + prod.vendorId}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {prod.categoryName || 'Category ' + prod.categoryId}
                  </span>
                </div>

                {/* Title & SKU */}
                <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">
                  {prod.name}
                </h3>
                <div className="text-xs font-mono text-slate-400 mb-3">
                  {prod.sku}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                  {prod.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                {/* Price & Stock */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-medium text-slate-400 uppercase">Price</span>
                    <div className="text-xl font-extrabold text-slate-900">
                      ₹{parseFloat(prod.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-slate-400 uppercase">Stock</span>
                    <div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        prod.stockQuantity > 20
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {prod.stockQuantity} available
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onAddToCart(prod)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4 text-emerald-400" />
                    Add to Cart
                  </button>

                  <button
                    onClick={() => handleEditProduct(prod)}
                    className="inline-flex items-center justify-center p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 rounded-xl transition-all cursor-pointer"
                    title="Edit Product Details"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleSoftDelete(prod.id, prod.name)}
                    className="inline-flex items-center justify-center p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl transition-all cursor-pointer"
                    title="Remove Product Listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer Controls */}
      {productsPage.totalPages > 1 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          
          <div className="text-xs text-slate-500">
            Showing Page <strong className="text-slate-900 font-semibold">{productsPage.number + 1}</strong> of <strong className="text-slate-900 font-semibold">{productsPage.totalPages}</strong> ({productsPage.totalElements} Total Items)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={productsPage.first}
              onClick={() => setPage(prev => Math.max(0, prev - 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {Array.from({ length: productsPage.totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  page === i 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={productsPage.last}
              onClick={() => setPage(prev => Math.min(productsPage.totalPages - 1, prev + 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all cursor-pointer"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Items per page:</span>
            <select
              value={size}
              onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="6">6</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>

        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Edit className="w-5 h-5 text-indigo-600" />
              Edit Product Details
            </h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editPrice}
                    onChange={e => setEditPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={editStock}
                    onChange={e => setEditStock(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={editCatId}
                    onChange={e => setEditCatId(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white text-sm"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Seller / Vendor *</label>
                  <select
                    value={editVendId}
                    onChange={e => setEditVendId(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white text-sm"
                  >
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.storeName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description *</label>
                <textarea
                  rows="3"
                  required
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl transition-all text-sm cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  {updating ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
