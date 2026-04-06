import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Package,
  ShieldCheck,
  MapPin,
  CreditCard,
  LogOut,
  Search,
  Bell,
  CheckCircle2,
  Truck,
  Clock,
  ArrowRight,
  Edit2,
  Plus,
  Trash2,
  User,
  Settings,
  ChevronRight,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type ViewState = 'main' | 'orders' | 'details' | 'addresses' | 'payments';

const UserDashboard = () => {
  const [view, setView] = useState<ViewState>('main');

  const orders = [
    { id: 'ORD-4821', name: '400W Mono PERC Solar Panel × 12', date: 'Apr 2, 2026', status: 'Delivered', icon: CheckCircle2, statusColor: 'text-emerald-500 bg-emerald-500/10', amount: '₹72,000', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=150&q=80' },
    { id: 'ORD-4756', name: '10kW Hybrid Solar Inverter', date: 'Mar 28, 2026', status: 'In Transit', icon: Truck, statusColor: 'text-blue-500 bg-blue-500/10', amount: '₹45,500', image: 'https://images.unsplash.com/photo-1592833159057-6fcdd432d4b5?w=150&q=80' },
    { id: 'ORD-4690', name: '5kWh Lithium Battery Pack', date: 'Mar 15, 2026', status: 'Processing', icon: Clock, statusColor: 'text-amber-500 bg-amber-500/10', amount: '₹38,000', image: 'https://images.unsplash.com/photo-1620288627228-09556a310e20?w=150&q=80' },
  ];

  const addresses = [
    { id: 1, name: 'Sriram Murali', street: '42, Anna Nagar West', city: 'Chennai', state: 'Tamil Nadu', zip: '600040', phone: '+91 98765 43210', isDefault: true },
    { id: 2, name: 'Sriram Murali (Office)', street: 'Tech Park, OMR', city: 'Chennai', state: 'Tamil Nadu', zip: '600119', phone: '+91 98765 43210', isDefault: false },
  ];

  const paymentMethods = [
    { id: 1, type: 'Credit Card', brand: 'Visa', last4: '4242', expiry: '12/28', isDefault: true },
    { id: 2, type: 'UPI', idString: 'sriram@okhdsc', isDefault: false },
  ];

  const sidebarLinks: { name: string; icon: React.ElementType; tab: ViewState }[] = [
    { name: 'Account Overview', icon: User, tab: 'main' },
    { name: 'My Orders', icon: Package, tab: 'orders' },
    { name: 'Personal Details', icon: ShieldCheck, tab: 'details' },
    { name: 'Saved Addresses', icon: MapPin, tab: 'addresses' },
    { name: 'Payment Methods', icon: CreditCard, tab: 'payments' },
  ];

  const MainView = () => (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-xl"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-solar/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-2 font-heading">Welcome back, Sriram!</h2>
            <p className="text-slate-400 max-w-md">Manage your Eversol orders, personal details, addresses, and secure payment methods all in one place.</p>
          </div>
          <Button onClick={() => setView('orders')} className="bg-solar hover:bg-solar/90 text-black font-bold rounded-xl h-12 px-6 shadow-lg shadow-solar/20">
            Track Recent Order <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card onClick={() => setView('orders')} className="border-none shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl cursor-pointer group">
          <CardContent className="p-6 flex items-start gap-5">
            <div className="p-4 bg-slate-50 text-slate-800 rounded-2xl group-hover:bg-solar/10 group-hover:text-solar transition-colors">
              <Package className="w-8 h-8" />
            </div>
            <div className="flex-1 mt-1">
              <h3 className="text-xl font-bold text-slate-900 mb-1">My Orders</h3>
              <p className="text-slate-500 text-sm">Track shipments, view invoices, or reorder products.</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-solar mt-2 transition-colors" />
          </CardContent>
        </Card>

        <Card onClick={() => setView('details')} className="border-none shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl cursor-pointer group">
          <CardContent className="p-6 flex items-start gap-5">
            <div className="p-4 bg-slate-50 text-slate-800 rounded-2xl group-hover:bg-emerald-500/10 group-hover:text-emerald-600 transition-colors">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="flex-1 mt-1">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Personal Details</h3>
              <p className="text-slate-500 text-sm">Update your name, mobile number, and secure password.</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 mt-2 transition-colors" />
          </CardContent>
        </Card>

        <Card onClick={() => setView('addresses')} className="border-none shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl cursor-pointer group">
          <CardContent className="p-6 flex items-start gap-5">
            <div className="p-4 bg-slate-50 text-slate-800 rounded-2xl group-hover:bg-amber-500/10 group-hover:text-amber-600 transition-colors">
              <MapPin className="w-8 h-8" />
            </div>
            <div className="flex-1 mt-1">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Saved Addresses</h3>
              <p className="text-slate-500 text-sm">Manage delivery locations for future solar installations.</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 mt-2 transition-colors" />
          </CardContent>
        </Card>

        <Card onClick={() => setView('payments')} className="border-none shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl cursor-pointer group">
          <CardContent className="p-6 flex items-start gap-5">
            <div className="p-4 bg-slate-50 text-slate-800 rounded-2xl group-hover:bg-blue-500/10 group-hover:text-blue-600 transition-colors">
              <CreditCard className="w-8 h-8" />
            </div>
            <div className="flex-1 mt-1">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Payment Methods</h3>
              <p className="text-slate-500 text-sm">Securely add or edit credit cards and UPI accounts.</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 mt-2 transition-colors" />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const OrdersView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-900 font-heading">My Orders</h2>
         <div className="flex gap-2">
            <Button variant="outline" className="border-slate-200">Past 30 Days</Button>
            <Button variant="outline" className="border-slate-200">Filter</Button>
         </div>
      </div>

      <div className="space-y-6">
        {orders.map((order, i) => (
          <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-10">
                  <div>
                    <p className="text-slate-400 font-medium mb-0.5">Order Placed</p>
                    <p className="font-bold text-slate-700">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium mb-0.5">Total Amount</p>
                    <p className="font-bold text-slate-700">{order.amount}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium mb-0.5">Ship To</p>
                    <p className="font-bold text-slate-700">Sriram Murali</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 font-medium mb-0.5">Order ID <span className="text-slate-700 font-bold">#{order.id}</span></p>
                  <button className="text-solar font-bold hover:underline">Download Invoice</button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-32 h-32 bg-white rounded-2xl border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center p-2">
                    <img src={order.image} alt={order.name} className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 ${order.statusColor}`}>
                          <order.icon className="w-3 h-3" /> {order.status}
                       </span>
                    </div>
                    <h4 className="font-bold text-xl text-slate-900 mb-2">{order.name}</h4>
                    <p className="text-sm text-slate-500 font-medium max-w-md">
                      Your premium Eversol equipment is on track. Ensure your site is prepared for installation upon arrival.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    <Button className="bg-solar hover:bg-solar/90 text-black font-bold rounded-xl w-full md:w-48">Buy it again</Button>
                    <Button variant="outline" className="border-slate-200 text-slate-700 font-bold rounded-xl w-full md:w-48 hover:bg-slate-50">Track Package</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const DetailsView = () => (
    <div className="space-y-6 max-w-3xl">
      <div>
         <h2 className="text-2xl font-bold text-slate-900 font-heading">Personal Details</h2>
         <p className="text-slate-500 mt-1">Manage your identity and security settings.</p>
      </div>

      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0 divide-y divide-slate-100">
          {[
             { label: 'Full Name', value: 'Sriram Murali', icon: User },
             { label: 'Email Address', value: 'sriram@example.com', icon: ShieldCheck },
             { label: 'Phone Number', value: '+91 98765 43210', icon: ShieldCheck },
             { label: 'Password', value: '••••••••', icon: ShieldCheck }
          ].map((field, idx) => (
             <div key={idx} className="p-6 sm:p-8 flex items-center justify-between hover:bg-slate-50 transition-colors">
               <div>
                 <p className="font-bold text-slate-900 mb-1">{field.label}</p>
                 <p className="text-slate-500 font-medium">{field.value}</p>
               </div>
               <Button variant="outline" className="border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-white hover:border-solar hover:text-solar">
                 Edit
               </Button>
             </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const AddressesView = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h2 className="text-2xl font-bold text-slate-900 font-heading">Saved Addresses</h2>
            <p className="text-slate-500 mt-1">Manage locations for delivery and installation.</p>
         </div>
         <Button className="bg-solar hover:bg-solar/90 text-black font-bold rounded-xl h-11 px-6 shadow-lg shadow-solar/20 shrink-0">
            <Plus className="w-4 h-4 mr-2" /> Add New Address
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <Card key={address.id} className={`border ${address.isDefault ? 'border-solar shadow-md shadow-solar/10' : 'border-none shadow-sm'} rounded-2xl overflow-hidden relative group`}>
            {address.isDefault && (
              <div className="absolute top-0 right-0 bg-solar text-black text-[10px] font-black tracking-widest px-4 py-1.5 rounded-bl-xl z-10 shadow-sm">
                DEFAULT
              </div>
            )}
            <CardContent className="p-8">
              <div className="mb-6">
                 <h4 className="font-bold text-xl text-slate-900 mb-3 flex items-center gap-2">
                    <MapPin className={`w-5 h-5 ${address.isDefault ? 'text-solar' : 'text-slate-400'}`} />
                    {address.name}
                 </h4>
                 <div className="text-slate-600 font-medium space-y-1">
                   <p>{address.street}</p>
                   <p>{address.city}, {address.state} {address.zip}</p>
                   <p>India</p>
                   <p className="pt-2 text-slate-900"><span className="text-slate-400">Phone:</span> {address.phone}</p>
                 </div>
              </div>
              <div className="flex flex-wrap gap-3">
                 <Button variant="outline" className="border-slate-200 hover:border-slate-300 font-bold rounded-xl flex-1">Edit</Button>
                 <Button variant="outline" className="border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 font-bold rounded-xl">Remove</Button>
                 {!address.isDefault && (
                    <Button variant="ghost" className="w-full mt-2 font-bold text-slate-500 hover:text-solar">Set as Default</Button>
                 )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const PaymentsView = () => (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h2 className="text-2xl font-bold text-slate-900 font-heading">Payment Methods</h2>
            <p className="text-slate-500 mt-1">Manage your credit cards and UPI accounts.</p>
         </div>
         <Button className="bg-solar hover:bg-solar/90 text-black font-bold rounded-xl h-11 px-6 shadow-lg shadow-solar/20 shrink-0">
            <Plus className="w-4 h-4 mr-2" /> Add Payment Method
         </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border-none overflow-hidden">
        <div className="divide-y divide-slate-100">
           {paymentMethods.map((method) => (
             <div key={method.id} className="p-6 sm:p-8 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-12 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center shrink-0">
                     {method.type === 'Credit Card' ? (
                        <span className="font-bold text-slate-600 text-[10px] uppercase tracking-widest">{method.brand}</span>
                     ) : (
                        <span className="font-black text-slate-600 text-xs">UPI</span>
                     )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">
                      {method.type === 'Credit Card' ? `${method.brand} ending in ${method.last4}` : method.idString}
                    </h4>
                    {method.type === 'Credit Card' && (
                      <p className="text-sm font-medium text-slate-500 mt-0.5">Expires {method.expiry}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                   {method.isDefault && <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">Default</span>}
                   <Button variant="ghost" className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl h-10 w-10 p-0">
                     <Trash2 className="w-5 h-5" />
                   </Button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col sticky top-0 h-screen shadow-sm z-20">
        <div className="p-7">
          <Link to="/" className="flex items-center gap-3 mb-10 cursor-pointer h-12">
            <img
              src="/images/eversol.png"
              alt="Eversol Logo"
              className="h-full w-auto object-contain"
            />
          </Link>

          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 px-4">Your Account</p>
          <nav className="space-y-2">
            {sidebarLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => setView(link.tab)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${
                  view === link.tab
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <link.icon className={`w-5 h-5 ${view === link.tab ? 'text-solar' : ''}`} />
                {link.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-7 flex flex-col gap-3">
          <Link to="/">
            <Button variant="outline" className="w-full border-slate-200 text-slate-600 font-bold rounded-2xl h-12 hover:bg-slate-50 transition-colors">
              <Globe className="w-4 h-4 mr-2" /> Go to Website
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="w-full border-slate-200 text-slate-600 font-bold rounded-2xl h-12 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-xl">
               <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl w-full group focus-within:border-solar/50 transition-colors">
                 <Search className="w-5 h-5 text-slate-400 group-focus-within:text-solar transition-colors" />
                 <input type="text" placeholder="Search your orders, invoices..." className="bg-transparent border-none focus:ring-0 text-sm w-full text-slate-800 placeholder:text-slate-400 outline-none" />
               </div>
            </div>
            
            <div className="flex items-center gap-5">
              <button className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:border-solar/40 transition-colors text-slate-500">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 leading-none">Sriram Murali</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Verified Customer</p>
                </div>
                <div className="w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-transparent group-hover:ring-solar transition-all shadow-sm">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sriram" alt="Avatar" className="w-full h-full object-cover bg-slate-100" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 lg:p-12 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {view === 'main' && <MainView />}
              {view === 'orders' && <OrdersView />}
              {view === 'details' && <DetailsView />}
              {view === 'addresses' && <AddressesView />}
              {view === 'payments' && <PaymentsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
