import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldCheck, Handshake, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type LoginType = 'user' | 'admin' | 'partner';

const LoginPortal = () => {
  const [selectedType, setSelectedType] = useState<LoginType>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login and redirect based on type
    if (selectedType === 'admin') {
      navigate('/admindashboard');
    } else if (selectedType === 'partner') {
      navigate('/partner-dashboard');
    } else {
      navigate('/user-dashboard');
    }
  };

  const fillDemoCredentials = () => {
    if (selectedType === 'user') {
      setEmail('customer@eversol.in');
      setPassword('demo123');
    } else if (selectedType === 'partner') {
      setEmail('partner@eversol.in');
      setPassword('partner123');
    } else if (selectedType === 'admin') {
      setEmail('admin@eversol.in');
      setPassword('admin123');
    }
  };

  const portalOptions = [
    { id: 'user', icon: User, title: 'Customer Login', desc: 'Securely manage your solar ecosystem' },
    { id: 'admin', icon: ShieldCheck, title: 'Admin Login', desc: 'System management and oversight' },
    { id: 'partner', icon: Handshake, title: 'Partner Login', desc: 'Access installer and partner tools' },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pt-20 flex items-center justify-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-solar/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <div className="container relative z-10 max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Selection */}
          <div className="space-y-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl lg:text-5xl font-bold font-heading mb-4"
              >
                Access Your <span className="text-solar">Eversol</span> Portal
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 text-lg"
              >
                Choose your account type to proceed to your personalized dashboard experience.
              </motion.p>
            </div>

            <div className="space-y-4">
              {portalOptions.map((option, index) => {
                const Icon = option.icon;
                const isActive = selectedType === option.id;
                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    onClick={() => setSelectedType(option.id as LoginType)}
                    className={`group cursor-pointer p-6 rounded-2xl border transition-all duration-500 flex items-center gap-6 ${isActive
                        ? 'bg-white/10 border-solar/50 shadow-[0_0_20px_rgba(251,191,36,0.15)] shadow-lg'
                        : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`}
                  >
                    <div className={`p-4 rounded-xl transition-colors duration-500 ${isActive ? 'bg-solar text-black' : 'bg-white/10 text-white group-hover:bg-white/20'
                      }`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-1">{option.title}</h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors line-clamp-1">
                        {option.desc}
                      </p>
                    </div>
                    <ArrowRight className={`w-6 h-6 transition-transform duration-500 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 group-hover:opacity-50 group-hover:-translate-x-2'
                      }`} />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedType}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
                  <p className="text-gray-400 capitalize">Login to your {selectedType} account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        type="email"
                        placeholder="name@company.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/5 border-white/10 pl-12 h-14 rounded-xl focus:ring-solar focus:border-solar text-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/5 border-white/10 pl-12 pr-12 h-14 rounded-xl focus:ring-solar focus:border-solar text-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm py-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-solar focus:ring-solar transition-colors" />
                      <span className="text-gray-400 group-hover:text-white transition-colors">Remember me</span>
                    </label>
                    <button type="button" className="text-solar hover:underline">Forgot password?</button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 bg-solar hover:bg-solar/90 text-black font-bold text-lg rounded-xl shadow-lg shadow-solar/20 group"
                  >
                    Login to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>

                <div className="flex justify-center mt-2">
                  <button
                    onClick={fillDemoCredentials}
                    className="text-xs text-solar/80 hover:text-solar border border-solar/30 hover:border-solar/60 px-4 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                  >
                    <User className="w-3 h-3" /> Auto-fill Demo Credentials
                  </button>
                </div>

                <div className="relative pt-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[#1e293b] text-gray-500 rounded-full">New to Eversol?</span>
                  </div>
                </div>

                <div className="text-center">
                  <button className="text-white font-semibold hover:text-solar transition-colors">
                    Create an account
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPortal;
