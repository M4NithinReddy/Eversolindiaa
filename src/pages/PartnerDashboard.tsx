import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Handshake, 
  TrendingUp, 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Search, 
  Bell, 
  Plus, 
  Download,
  Filter,
  DollarSign,
  Settings,
  HelpCircle,
  LogOut,
  Globe,
  FileText,
  Video,
  FileBadge,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Tag,
  ShoppingBag,
  Zap,
  Leaf,
  Battery,
  Sun,
  Edit2,
  Trash2,
  Star,
  Eye,
  LayoutGrid,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ViewState = 'overview' | 'leads' | 'installs' | 'commissions' | 'products' | 'products-sold' | 'categories' | 'add-product' | 'resources';

const PartnerDashboard = () => {
  const [view, setView] = useState<ViewState>('overview');
  const [productLayout, setProductLayout] = useState<'grid' | 'list'>('grid');

  const stats = [
    { label: 'Active Leads', value: '42', icon: Users, color: 'text-solar', bg: 'bg-amber-50', trend: '+12.5%', isUp: true },
    { label: 'Pending Installs', value: '18', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', trend: '-2', isUp: false },
    { label: 'Total Commission', value: '₹4,82,500', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+15.2%', isUp: true },
    { label: 'Products Sold', value: '134', icon: ShoppingBag, color: 'text-violet-600', bg: 'bg-violet-50', trend: '+8.2%', isUp: true },
  ];

  const sidebarLinks: { name: string; icon: React.ElementType; tab: ViewState; badge?: number }[] = [
    { name: 'Partner Hub', icon: Handshake, tab: 'overview' },
    { name: 'Lead Pipeline', icon: TrendingUp, tab: 'leads', badge: 4 },
    { name: 'Active Installs', icon: Settings, tab: 'installs' },
    { name: 'Commissions', icon: BarChart3, tab: 'commissions' },
  ];

  const productLinks: { name: string; icon: React.ElementType; tab: ViewState }[] = [
    { name: 'All Products', icon: Package, tab: 'products' },
    { name: 'Products Sold', icon: ShoppingBag, tab: 'products-sold' },
    { name: 'Categories', icon: Tag, tab: 'categories' },
    { name: 'Add Product', icon: Plus, tab: 'add-product' },
  ];

  const products = [
    { id: 'PRD-001', name: '400W Mono PERC Panel', category: 'Solar Panels', price: '₹6,200', stock: 48, sold: 312, rating: 4.8, icon: Sun, color: 'bg-amber-50 text-amber-600', status: 'Active' },
    { id: 'PRD-002', name: '10kW Hybrid Inverter', category: 'Inverters', price: '₹45,500', stock: 12, sold: 87, rating: 4.9, icon: Zap, color: 'bg-blue-50 text-blue-600', status: 'Active' },
    { id: 'PRD-003', name: '5kWh Lithium Battery', category: 'Batteries', price: '₹38,000', stock: 8, sold: 54, rating: 4.7, icon: Battery, color: 'bg-emerald-50 text-emerald-600', status: 'Low Stock' },
    { id: 'PRD-004', name: 'Solar Mounting Structure', category: 'Accessories', price: '₹4,800', stock: 0, sold: 210, rating: 4.5, icon: Package, color: 'bg-violet-50 text-violet-600', status: 'Out of Stock' },
    { id: 'PRD-005', name: '250W Bifacial Panel', category: 'Solar Panels', price: '₹4,100', stock: 65, sold: 188, rating: 4.6, icon: Sun, color: 'bg-amber-50 text-amber-600', status: 'Active' },
    { id: 'PRD-006', name: 'Smart Energy Monitor', category: 'Accessories', price: '₹3,200', stock: 22, sold: 96, rating: 4.4, icon: Leaf, color: 'bg-teal-50 text-teal-600', status: 'Active' },
  ];

  const pipeline = [
    { client: 'Rajesh Kumar', city: 'Madurai', system: '5kW Rooftop', status: 'In Review', progress: 35, statusColor: 'text-blue-600 bg-blue-50' },
    { client: 'Tech Parks South', city: 'Chennai', system: '50kW Industrial', status: 'Dispatched', progress: 60, statusColor: 'text-solar bg-amber-50' },
    { client: 'Ananya Sharma', city: 'Coimbatore', system: '3kW Residential', status: 'Installing', progress: 85, statusColor: 'text-emerald-600 bg-emerald-50' },
    { client: 'Green Hotels Ltd', city: 'Ooty', system: '20kW Hybrid', status: 'Pending', progress: 15, statusColor: 'text-amber-600 bg-amber-50' },
  ];

  const leads = [
    { name: 'Vinoth Selvam', type: 'Residential (3-5kW)', phone: '+91 94433 22110', status: 'New', score: 'Hot', date: 'Today' },
    { name: 'Karpagam Mills', type: 'Commercial (100kW+)', phone: '+91 98400 12345', status: 'Contacted', score: 'Warm', date: 'Yesterday' },
    { name: 'Priya Rajan', type: 'Residential (5kW)', phone: '+91 90031 44556', status: 'Site Visit', score: 'Hot', date: 'Apr 04' },
    { name: 'Apex Logistics', type: 'Industrial (50kW)', phone: '+91 99440 55667', status: 'Proposal Sent', score: 'Cold', date: 'Mar 30' },
  ];

  const categories = [
    { name: 'Solar Panels', count: 24, icon: Sun, color: 'bg-amber-50 text-amber-600', totalSold: 500, revenue: '₹28,00,000' },
    { name: 'Inverters', count: 12, icon: Zap, color: 'bg-blue-50 text-blue-600', totalSold: 87, revenue: '₹39,58,500' },
    { name: 'Batteries', count: 8, icon: Battery, color: 'bg-emerald-50 text-emerald-600', totalSold: 54, revenue: '₹20,52,000' },
    { name: 'Accessories', count: 32, icon: Package, color: 'bg-violet-50 text-violet-600', totalSold: 306, revenue: '₹12,44,800' },
  ];

  const soldData = [
    { id: 'SALE-482', product: '400W Mono PERC Panel × 10', client: 'Rajesh Kumar', date: 'Apr 02, 2026', amount: '₹62,000', commission: '₹3,720', status: 'Settled' },
    { id: 'SALE-471', product: '10kW Hybrid Inverter × 1', client: 'Tech Parks South', date: 'Mar 28, 2026', amount: '₹45,500', commission: '₹2,730', status: 'Settled' },
    { id: 'SALE-459', product: '5kWh Lithium Battery × 2', client: 'Green Hotels Ltd', date: 'Mar 20, 2026', amount: '₹76,000', commission: '₹4,560', status: 'Pending' },
    { id: 'SALE-441', product: 'Solar Mounting Structure × 8', client: 'Ananya Sharma', date: 'Mar 12, 2026', amount: '₹38,400', commission: '₹2,304', status: 'Settled' },
  ];

  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', stock: '', description: '', unit: '' });

  // ─── Views ──────────────────────────────────────────

  const OverviewView = () => (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 mb-2">Partner Hub</h1>
          <p className="text-slate-500 font-medium">Monitor your pipeline, product catalogue, and earnings.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setView('add-product')} variant="outline" className="rounded-xl font-bold text-slate-700 border-slate-200 hover:bg-slate-50 h-12 px-6">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
          <Button onClick={() => setView('leads')} className="rounded-xl font-bold bg-solar hover:bg-solar/90 text-black h-12 px-6 shadow-lg shadow-solar/20">
            <Plus className="w-4 h-4 mr-2" /> Add New Lead
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
            <Card className="border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-bold flex items-center gap-1 px-2.5 py-1 rounded-full ${stat.isUp ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                    {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {stat.trend}
                  </span>
                </div>
                <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recently Sold Products Quick View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-6 flex flex-row items-center justify-between border-b border-slate-50">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">Installation Pipeline</CardTitle>
              <p className="text-slate-400 text-xs mt-0.5">Active project statuses</p>
            </div>
            <button onClick={() => setView('installs')} className="text-xs font-bold text-solar hover:underline flex items-center gap-1">View All <ChevronRight className="w-3 h-3" /></button>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-slate-50">
            {pipeline.slice(0, 3).map((item, i) => (
              <div key={i} className="p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${item.statusColor}`}>{item.status}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{item.client}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {item.city} — {item.system}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-bold text-slate-400">{item.progress}%</p>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                    <div className="h-full bg-solar rounded-full" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-6 flex flex-row items-center justify-between border-b border-slate-50">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">Recent Product Sales</CardTitle>
              <p className="text-slate-400 text-xs mt-0.5">Latest settled transactions</p>
            </div>
            <button onClick={() => setView('products-sold')} className="text-xs font-bold text-solar hover:underline flex items-center gap-1">View All <ChevronRight className="w-3 h-3" /></button>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-slate-50">
            {soldData.slice(0, 3).map((sale, i) => (
              <div key={i} className="p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="p-3 bg-amber-50 rounded-xl shrink-0"><ShoppingBag className="w-4 h-4 text-solar" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{sale.product}</p>
                  <p className="text-xs text-slate-400">{sale.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-slate-900 text-sm">{sale.amount}</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">{sale.commission} commission</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const ProductsView = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">All Products</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your Eversol product catalogue.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-slate-100 rounded-xl p-1">
            <button onClick={() => setProductLayout('grid')} className={`p-2 rounded-lg transition-all ${productLayout === 'grid' ? 'bg-white shadow-sm text-solar' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setProductLayout('list')} className={`p-2 rounded-lg transition-all ${productLayout === 'list' ? 'bg-white shadow-sm text-solar' : 'text-slate-400 hover:text-slate-600'}`}><List className="w-4 h-4" /></button>
          </div>
          <Button onClick={() => setView('add-product')} className="rounded-xl font-bold bg-solar hover:bg-solar/90 text-black h-11 px-6 shadow-lg shadow-solar/20">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex-1 max-w-sm flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
          <Search className="w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search products..." className="bg-transparent text-sm w-full outline-none text-slate-800 placeholder:text-slate-400" />
        </div>
        {['All', 'Solar Panels', 'Inverters', 'Batteries', 'Accessories'].map((cat, i) => (
          <button key={cat} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${i === 0 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{cat}</button>
        ))}
      </div>

      {productLayout === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all group">
                <div className="bg-slate-50 p-8 flex items-center justify-center">
                  <div className={`w-20 h-20 rounded-2xl ${product.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <product.icon className="w-10 h-10" />
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{product.category}</p>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">{product.name}</h3>
                    </div>
                    <span className={`text-[10px] font-black tracking-wider uppercase px-2 py-1 rounded-full shrink-0 ${
                      product.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                      product.status === 'Low Stock' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                    }`}>{product.status}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-3.5 h-3.5 text-solar fill-solar" />
                    <span className="text-xs font-bold text-slate-600">{product.rating}</span>
                    <span className="text-xs text-slate-400 ml-1">· {product.sold} sold</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-black text-xl text-slate-900">{product.price}</p>
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>ID: {product.id}</span>
                    <span>Stock: <span className={product.stock === 0 ? 'text-red-600 font-bold' : product.stock <= 10 ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'}>{product.stock}</span></span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Sold</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((product, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${product.color}`}><product.icon className="w-5 h-5" /></div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{product.name}</p>
                          <p className="text-xs text-slate-400">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{product.category}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{product.price}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${product.stock === 0 ? 'text-red-600' : product.stock <= 10 ? 'text-amber-600' : 'text-emerald-600'}`}>{product.stock}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-bold">{product.sold}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full ${
                        product.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                        product.status === 'Low Stock' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                      }`}>{product.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Eye className="w-4 h-4" /></button>
                        <button className="p-1.5 text-slate-400 hover:text-solar hover:bg-amber-50 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );

  const ProductsSoldView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-heading">Products Sold</h2>
        <p className="text-slate-500 text-sm mt-1">History of all your product sales and associated commissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-solar/30 bg-amber-50 rounded-2xl shadow-none">
          <CardContent className="p-6">
            <p className="text-solar font-bold text-sm mb-2">Total Units Sold</p>
            <h3 className="text-3xl font-black text-slate-900">134</h3>
            <p className="text-xs text-slate-500 mt-1">This month vs last: <span className="text-emerald-600 font-bold">+8.2%</span></p>
          </CardContent>
        </Card>
        <Card className="border-2 border-emerald-200 bg-emerald-50 rounded-2xl shadow-none">
          <CardContent className="p-6">
            <p className="text-emerald-600 font-bold text-sm mb-2">Total Sales Revenue</p>
            <h3 className="text-3xl font-black text-slate-900">₹2,21,900</h3>
            <p className="text-xs text-slate-500 mt-1">Commission earned: <span className="text-emerald-600 font-bold">₹13,314</span></p>
          </CardContent>
        </Card>
        <Card className="border border-slate-100 rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-slate-500 font-bold text-sm mb-2">Top Product</p>
              <h3 className="text-base font-bold text-slate-900">400W Panel</h3>
              <p className="text-xs text-slate-400 mt-0.5">312 units sold</p>
            </div>
            <Sun className="w-8 h-8 text-slate-200" />
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-100 shadow-sm rounded-2xl">
        <CardHeader className="p-6 flex flex-row items-center justify-between border-b border-slate-50">
          <CardTitle className="text-base font-bold text-slate-900">Sales History</CardTitle>
          <Button variant="outline" size="sm" className="border-slate-200 rounded-xl text-slate-600 font-bold">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4">Sale ID</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Commission</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {soldData.map((sale, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-400">{sale.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900 text-sm">{sale.product}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{sale.client}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{sale.date}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{sale.amount}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">{sale.commission}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${sale.status === 'Settled' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{sale.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CategoriesView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Categories</h2>
          <p className="text-slate-500 text-sm mt-1">Manage product categories and browse performance metrics.</p>
        </div>
        <Button className="rounded-xl font-bold bg-solar hover:bg-solar/90 text-black h-11 px-6 shadow-lg shadow-solar/20">
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center gap-5 mb-5">
                  <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <cat.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-xl">{cat.name}</h3>
                    <p className="text-slate-500 text-sm mt-0.5">{cat.count} products listed</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-solar hover:bg-amber-50 rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Units Sold</p>
                    <p className="text-lg font-black text-slate-900">{cat.totalSold}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Revenue</p>
                    <p className="text-lg font-black text-slate-900">{cat.revenue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const AddProductView = () => (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-heading">Add New Product</h2>
        <p className="text-slate-500 text-sm mt-1">List a new solar product in the Eversol catalogue.</p>
      </div>

      <Card className="border border-slate-100 shadow-sm rounded-2xl">
        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Product Name *</label>
              <input
                type="text"
                placeholder="e.g. 400W Mono PERC Solar Panel"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-solar focus:ring-1 focus:ring-solar text-sm font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Category *</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-solar focus:ring-1 focus:ring-solar text-sm font-medium bg-white"
              >
                <option value="">Select Category</option>
                <option>Solar Panels</option>
                <option>Inverters</option>
                <option>Batteries</option>
                <option>Accessories</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Price (₹) *</label>
              <input
                type="number"
                placeholder="e.g. 6200"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-solar focus:ring-1 focus:ring-solar text-sm font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Stock Quantity *</label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-solar focus:ring-1 focus:ring-solar text-sm font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Unit</label>
              <select
                value={newProduct.unit}
                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-solar focus:ring-1 focus:ring-solar text-sm font-medium bg-white"
              >
                <option value="">Select Unit</option>
                <option>Per Piece</option>
                <option>Per Set</option>
                <option>Per kW</option>
                <option>Per kWh</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Description</label>
            <textarea
              rows={4}
              placeholder="Brief description of the product, key specs, and features..."
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-solar focus:ring-1 focus:ring-solar text-sm font-medium resize-none"
            />
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-solar transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-slate-100 group-hover:bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
              <Plus className="w-6 h-6 text-slate-400 group-hover:text-solar" />
            </div>
            <p className="font-bold text-slate-600 group-hover:text-solar transition-colors">Upload Product Image</p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
            <Button
              className="bg-solar hover:bg-solar/90 text-black font-bold rounded-xl h-12 px-8 shadow-lg shadow-solar/20"
              onClick={() => { alert('Product saved successfully!'); setView('products'); }}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" /> Save Product
            </Button>
            <Button variant="outline" className="border-slate-200 text-slate-600 font-bold rounded-xl h-12 px-6 hover:bg-slate-50" onClick={() => setView('products')}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const LeadsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Lead Pipeline</h2>
          <p className="text-slate-500 text-sm mt-1">Manage and track your prospective solar clients.</p>
        </div>
        <Button className="rounded-xl font-bold bg-solar hover:bg-solar/90 text-black h-11 px-6 shadow-lg shadow-solar/20">
          <Plus className="w-4 h-4 mr-2" /> Add Lead
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.map((lead, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border border-slate-100 shadow-sm rounded-2xl hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${lead.score === 'Hot' ? 'bg-red-100 text-red-600' : lead.score === 'Warm' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                    {lead.score} Lead
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{lead.date}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-solar transition-colors mb-1">{lead.name}</h3>
                <p className="text-sm text-slate-500 mb-5">{lead.type}</p>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-600">{lead.phone}</p>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">{lead.status}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const InstallsView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-heading">Active Installations</h2>
        <p className="text-slate-500 text-sm mt-1">Track hardware dispatch and site project progression.</p>
      </div>
      <div className="space-y-4">
        {pipeline.map((item, i) => (
          <Card key={i} className="border border-slate-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="md:w-1/3">
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{item.client}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {item.city} — {item.system}</p>
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                    <span>Initiated</span><span>Dispatch</span><span>Install</span><span>Grid</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.progress}%` }} transition={{ duration: 1 }}
                      className={`h-full rounded-full ${item.progress > 80 ? 'bg-emerald-500' : item.progress > 50 ? 'bg-solar' : item.progress > 20 ? 'bg-blue-500' : 'bg-slate-300'}`} />
                  </div>
                </div>
                <div className="md:w-48 flex flex-col items-end gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${item.statusColor}`}>{item.status}</span>
                  <Button variant="link" className="text-solar text-xs p-0 h-auto font-bold">Update Status <ChevronRight className="w-3 h-3 ml-1" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const CommissionsView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-heading">Commissions & Payouts</h2>
        <p className="text-slate-500 text-sm mt-1">Review your earnings history and pending balances.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-emerald-200 bg-emerald-50 rounded-2xl shadow-none">
          <CardContent className="p-6"><p className="text-emerald-600 font-bold text-sm mb-2">Total Earned (YTD)</p><h3 className="text-3xl font-black text-slate-900">₹14,80,000</h3></CardContent>
        </Card>
        <Card className="border-2 border-solar/30 bg-amber-50 rounded-2xl shadow-none">
          <CardContent className="p-6"><p className="text-solar font-bold text-sm mb-2">Pending Clearance</p><h3 className="text-3xl font-black text-slate-900">₹1,45,000</h3></CardContent>
        </Card>
        <Card className="border border-slate-100 rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div><p className="text-slate-500 font-bold text-sm mb-2">Next Payout</p><h3 className="text-xl font-bold text-slate-900">Apr 15, 2026</h3></div>
            <Calendar className="w-8 h-8 text-slate-200" />
          </CardContent>
        </Card>
      </div>
      <Card className="border border-slate-100 shadow-sm rounded-2xl">
        <CardHeader className="p-6 border-b border-slate-50"><CardTitle className="text-base font-bold text-slate-900">Recent Transactions</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-50">
            {[
              { id: 'TRX-982', date: 'Mar 15, 2026', desc: 'Commission — Green Hotels (20kW)', amount: '₹84,000' },
              { id: 'TRX-945', date: 'Feb 15, 2026', desc: 'Commission — Residential Pack (15kW)', amount: '₹62,500' },
            ].map((trx, idx) => (
              <div key={idx} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><DollarSign className="w-5 h-5" /></div>
                  <div><p className="font-bold text-slate-900">{trx.desc}</p><p className="text-xs text-slate-400 mt-0.5">{trx.id} · {trx.date}</p></div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-slate-900">{trx.amount}</p>
                  <p className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1 mt-0.5"><CheckCircle2 className="w-3 h-3" /> Paid</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ─── Layout ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col sticky top-0 h-screen shadow-sm z-20">
        <div className="p-7 flex-1 overflow-y-auto">
          <Link to="/" className="flex items-center gap-3 mb-10 h-10 cursor-pointer">
            <img src="/images/eversol.png" alt="Eversol Logo" className="h-full w-auto object-contain" />
          </Link>

          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 px-4">Partner Portal</p>
          <nav className="space-y-1.5 mb-6">
            {sidebarLinks.map((link) => (
              <button key={link.name} onClick={() => setView(link.tab)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 font-bold text-sm ${view === link.tab ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                <link.icon className={`w-5 h-5 ${view === link.tab ? 'text-solar' : ''}`} />
                <span className="flex-1 text-left">{link.name}</span>
                {link.badge && <span className="bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{link.badge}</span>}
              </button>
            ))}
          </nav>

          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 px-4">Products</p>
          <nav className="space-y-1.5">
            {productLinks.map((link) => (
              <button key={link.name} onClick={() => setView(link.tab)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 font-bold text-sm ${view === link.tab ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                <link.icon className={`w-5 h-5 ${view === link.tab ? 'text-solar' : ''}`} />
                {link.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-7 border-t border-slate-100 flex flex-col gap-3">
          <div className="rounded-2xl overflow-hidden relative bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white group mb-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-solar/20 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
            <h4 className="font-bold text-sm relative z-10 mb-1">Dedicated Support</h4>
            <p className="text-xs text-slate-400 relative z-10 mb-3">Talk to your rep: Vamsi</p>
            <Button size="sm" className="w-full bg-solar hover:bg-solar/90 text-black font-bold relative z-10">Ping Rep</Button>
          </div>
          <Link to="/"><Button variant="outline" className="w-full border-slate-200 text-slate-600 font-bold rounded-2xl h-12 hover:bg-slate-50 transition-colors"><Globe className="w-4 h-4 mr-2" /> Go to Website</Button></Link>
          <Link to="/login"><Button variant="outline" className="w-full border-slate-200 text-slate-600 font-bold rounded-2xl h-12 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"><LogOut className="w-4 h-4 mr-2" /> Sign Out</Button></Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl w-full max-w-md group focus-within:border-solar/50 transition-colors">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-solar transition-colors" />
              <input type="text" placeholder="Search products, leads, reports..." className="bg-transparent border-none focus:ring-0 text-sm w-full text-slate-800 placeholder:text-slate-400 outline-none" />
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:border-solar/40 transition-colors">
                <Bell className="w-5 h-5 text-slate-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-solar rounded-full border-2 border-white" />
              </button>
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 leading-none">Vamsi Krishna</p>
                  <p className="text-xs text-solar font-bold mt-0.5 uppercase tracking-widest leading-none">Diamond Partner</p>
                </div>
                <div className="w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-transparent group-hover:ring-solar transition-all">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Vamsi" alt="Partner Avatar" className="w-full h-full object-cover bg-slate-100" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 lg:p-12 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}>
              {view === 'overview' && <OverviewView />}
              {view === 'leads' && <LeadsView />}
              {view === 'installs' && <InstallsView />}
              {view === 'commissions' && <CommissionsView />}
              {view === 'products' && <ProductsView />}
              {view === 'products-sold' && <ProductsSoldView />}
              {view === 'categories' && <CategoriesView />}
              {view === 'add-product' && <AddProductView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default PartnerDashboard;
