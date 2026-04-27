import { useState, useEffect, MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Products', path: '/shop', hash: 'product-search' },
  { name: 'Solutions', path: '/solutions' },
  { name: 'Impact', path: '/impact' },
  { name: 'Contact', path: '/contact' },
  { name: 'Dashboard', path: '/user-dashboard' },
  { name: 'Login', path: '/login' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const handleNavClick = (e: MouseEvent, link: { path: string; hash?: string }) => {
    if (link.path.includes('/shop')) {
      ['shop_category', 'shop_brand', 'shop_invType', 'shop_invBrand', 'shop_search', 'shop_page'].forEach(k => sessionStorage.removeItem(k));
    }
    if (link.hash) {
      e.preventDefault();
      if (location.pathname === link.path) {
        // Already on the page — just scroll
        const el = document.getElementById(link.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Navigate first, then scroll after mount
        navigate(link.path);
        setTimeout(() => {
          const el = document.getElementById(link.hash!);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';
  const navBg = isScrolled || !isHome
    ? 'bg-background/95 backdrop-blur-md shadow-md'
    : 'bg-transparent';
  const textColor = isScrolled || !isHome ? 'text-foreground' : 'text-primary-foreground';
  const logoColor = isScrolled || !isHome ? 'text-primary' : 'text-primary-foreground';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center h-20">
            <img
              src="/images/eversol.png"
              alt="Eversol Logo"
              className="h-full w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.hash ? `${link.path}#${link.hash}` : link.path}
                onClick={(e) => link.hash ? handleNavClick(e, link) : undefined}
                className={`relative font-medium transition-colors duration-300 ${textColor} hover:text-solar underline-animate`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-solar"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/cart" className={`relative p-2 rounded-full hover:bg-white/10 transition-colors ${textColor}`}>
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
            <Link to="/user-dashboard" className={`p-2 rounded-full hover:bg-white/10 transition-colors ${textColor}`}>
              <User className="h-5 w-5" />
            </Link>
            <Button variant={isScrolled || !isHome ? "outline" : "heroOutline"} size="sm" asChild>
              <Link to="/contact">Get Quote</Link>
            </Button>
          </div>

          {/* Mobile: Cart + Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <Link to="/cart" className={`relative p-2 rounded-full hover:bg-white/10 transition-colors ${textColor}`}>
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
            <Link to="/user-dashboard" className={`p-2 rounded-full hover:bg-white/10 transition-colors ${textColor}`}>
              <User className="h-5 w-5" />
            </Link>
            <button
              className={`p-2 ${textColor}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.hash ? `${link.path}#${link.hash}` : link.path}
                  onClick={(e) => link.hash ? handleNavClick(e, link) : setIsMobileMenuOpen(false)}
                  className={`block py-3 font-medium text-foreground hover:text-primary transition-colors ${location.pathname === link.path ? 'text-primary' : ''
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart {totalItems > 0 && `(${totalItems})`}
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Get Quote</Link>
                </Button>
                <Button variant="solar" asChild className="w-full">
                  <Link to="/shop" onClick={() => {
                    ['shop_category', 'shop_brand', 'shop_invType', 'shop_invBrand', 'shop_search', 'shop_page'].forEach(k => sessionStorage.removeItem(k));
                    setIsMobileMenuOpen(false);
                  }}>Shop Now</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
