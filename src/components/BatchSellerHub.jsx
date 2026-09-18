import React, { useState } from 'react';
import SEO from './SEO';
import { 
  Zap, 
  UploadCloud, 
  Plus, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Layers,
  Sparkles,
  Store,
  Tag
} from 'lucide-react';
import { api } from '../services/api';

export default function BatchSellerHub({
  categories,
  vendors,
  onShowToast,
  onProductsUpdated
}) {
  const [selectedVendorId, setSelectedVendorId] = useState(vendors[0]?.id || 1);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || 1);
  const [uploading, setUploading] = useState(false);
  const [batchLogs, setBatchLogs] = useState([
    'Merchant Seller Portal initialized.',
    'Ready for bulk product inventory upload & store sync...'
  ]);
  const [metrics, setMetrics] = useState(null);

  // Single Product state
  const [singleName, setSingleName] = useState('');
  const [singleSku, setSingleSku] = useState('');
  const [singlePrice, setSinglePrice] = useState('');
  const [singleStock, setSingleStock] = useState('100');
  const [singleDesc, setSingleDesc] = useState('');

  const addLog = (msg) => {
    setBatchLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleSimulateBatch = async (count) => {
    setUploading(true);
    setMetrics(null);
    addLog(`🚀 Starting Bulk Merchant Inventory Upload (${count} products)...`);
    
    const startTime = performance.now();
    const mockProducts = [];

    for (let i = 1; i <= count; i++) {
      mockProducts.push({
        name: `Merchant Item #${i} - ${Math.random().toString(36).substring(7).toUpperCase()}`,
        sku: `SKU-BATCH-${Date.now()}-${i}`,
        description: `Verified seller item uploaded via bulk merchant hub (${i}/${count})`,
        price: (Math.random() * 200 + 10).toFixed(2),
        stockQuantity: Math.floor(Math.random() * 150) + 10,
        categoryId: Number(selectedCategoryId),
        vendorId: Number(selectedVendorId)
      });
    }

    try {
      addLog(`Syncing ${count} items with store catalog...`);
      
      const created = await api.createBatchProducts(mockProducts);
      const endTime = performance.now();
      const elapsedMs = (endTime - startTime).toFixed(2);
      const batchesExecuted = Math.ceil(count / 50);

      addLog(`✅ Bulk Upload Complete! Successfully published ${created.length} products in ${elapsedMs}ms.`);
      addLog(`📦 Catalog updated and active across ${batchesExecuted} store batches.`);

      setMetrics({
        itemsCount: created.length,
        elapsedMs,
        batchSize: 50,
        flushesExecuted: batchesExecuted
      });

      onShowToast('success', 'Bulk Upload Complete', `Successfully published ${count} products in ${elapsedMs}ms!`);
      if (onProductsUpdated) onProductsUpdated();
    } catch (err) {
      addLog(`❌ Bulk Upload Error: ${err.message}`);
      onShowToast('error', 'Bulk Upload Failed', err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateSingle = async (e) => {
    e.preventDefault();
    if (!singleName || !singlePrice) return;

    try {
      const prod = await api.createProduct({
        name: singleName,
        sku: singleSku || `SKU-PROD-${Date.now()}`,
        description: singleDesc || 'Single product catalog entry',
        price: singlePrice,
        stockQuantity: singleStock,
        categoryId: selectedCategoryId,
        vendorId: selectedVendorId
      });

      onShowToast('success', 'Product Created', `Added "${prod.name}" to catalog.`);
      addLog(`Added product "${prod.name}" (SKU: ${prod.sku})`);
      setSingleName('');
      setSingleSku('');
      setSinglePrice('');
      setSingleDesc('');
      if (onProductsUpdated) onProductsUpdated();
    } catch (err) {
      onShowToast('error', 'Product Creation Failed', err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <SEO 
        title="Merchant Seller Hub & Bulk Inventory Portal | AuraMart"
        description="Empowering independent sellers to upload bulk product inventory and manage store listings on AuraMart."
        canonical="https://multi-vendor-front-end-rust.vercel.app/batch"
      />
      
      {/* Banner Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-amber-500" />
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Merchant Seller Hub & Bulk Inventory Portal
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              High-throughput seller bulk imports and catalog inventory sync.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Bulk Sync Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Bulk Batch Launchers & Single Form */}
        <div className="space-y-6">
          
          {/* Bulk Batch Generator Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <UploadCloud className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                Launch Bulk Inventory Upload
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Target Vendor Store</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none"
                  value={selectedVendorId} 
                  onChange={(e) => setSelectedVendorId(e.target.value)}
                >
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.storeName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Target Category</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none"
                  value={selectedCategoryId} 
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Select the volume of items to add to your merchant storefront in a single action:
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSimulateBatch(10)}
                disabled={uploading}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2.5 px-3 rounded-xl border border-indigo-200 text-xs transition-all flex flex-col items-center gap-1 cursor-pointer"
              >
                <span>+10 Products</span>
                <span className="text-[10px] text-indigo-500 font-normal">Quick Batch</span>
              </button>

              <button
                onClick={() => handleSimulateBatch(25)}
                disabled={uploading}
                className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold py-2.5 px-3 rounded-xl border border-amber-200 text-xs transition-all flex flex-col items-center gap-1 cursor-pointer"
              >
                <span>+25 Products</span>
                <span className="text-[10px] text-amber-500 font-normal">Medium Batch</span>
              </button>

              <button
                onClick={() => handleSimulateBatch(50)}
                disabled={uploading}
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold py-2.5 px-3 rounded-xl border border-purple-200 text-xs transition-all flex flex-col items-center gap-1 cursor-pointer"
              >
                <span>+50 Products</span>
                <span className="text-[10px] text-purple-500 font-normal">Full Catalog</span>
              </button>
            </div>
          </div>

          {/* Single Item Creation Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Plus className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                Add Single Product Listing
              </h3>
            </div>

            <form onSubmit={handleCreateSingle} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Product Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Ergonomic Office Chair" 
                  value={singleName}
                  onChange={(e) => setSingleName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">SKU / Code</label>
                  <input 
                    type="text" 
                    placeholder="Auto-generated" 
                    value={singleSku}
                    onChange={(e) => setSingleSku(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Price ($) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    placeholder="149.99" 
                    value={singlePrice}
                    onChange={(e) => setSinglePrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-slate-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Plus className="w-4 h-4" />
                Publish Product
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Real-Time Sync Console Log */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col h-[520px]">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Merchant Sync Activity Log</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">STATUS: READY</span>
            </div>

            {metrics && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">ITEMS UPLOADED</span>
                  <span className="text-emerald-400 font-bold text-sm">+{metrics.itemsCount} Products</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">SYNC SPEED</span>
                  <span className="text-amber-400 font-bold text-sm">{metrics.elapsedMs} ms</span>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs text-slate-300 pr-2">
              {batchLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed border-b border-slate-800/40 pb-1">
                  {log}
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
