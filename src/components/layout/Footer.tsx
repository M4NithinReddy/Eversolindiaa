import { Link } from 'react-router-dom';
import { Sun, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const footerLinks = {
  products: [
    { name: 'Solar Panels', path: '/shop?category=panels' },
    { name: 'Solar Inverters', path: '/shop?category=inverters' },
    { name: 'Solar Batteries', path: '/shop?category=batteries' },
    { name: 'Rooftop Kits', path: '/shop?category=kits' },
  ],
  solutions: [
    { name: 'Residential', path: '/solutions#residential' },
    { name: 'Commercial', path: '/solutions#commercial' },
    { name: 'Industrial', path: '/solutions#industrial' },
    { name: 'Government', path: '/solutions#government' },
  ],
  company: [
    { name: 'About Us', path: '/about' },
    { name: 'Our Impact', path: '/impact' },
    { name: 'Careers', path: '/about#careers' },
    { name: 'Contact', path: '/contact' },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Sun className="h-10 w-10 text-solar" />
              <span className="text-3xl font-heading font-bold">
                EVER<span className="text-solar">SOL</span>
              </span>
            </Link>
            <p className="text-primary-foreground/80 mb-4 max-w-sm leading-relaxed">
              Powering India's sustainable future with premium solar energy solutions. 
              Generate | Conserve | Contribute
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-solar hover:text-accent-foreground transition-all duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-solar hover:text-accent-foreground transition-all duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-solar hover:text-accent-foreground transition-all duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-solar hover:text-accent-foreground transition-all duration-300">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-solar">Products</h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-primary-foreground/80 hover:text-solar transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-solar">Solutions</h4>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-primary-foreground/80 hover:text-solar transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-solar">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-solar shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80">
                  EVERSOL Energy Pvt. Ltd.<br />
                  New Delhi, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-solar shrink-0" />
                <a href="tel:+911234567890" className="text-primary-foreground/80 hover:text-solar transition-colors">
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-solar shrink-0" />
                <a href="mailto:info@eversol.in" className="text-primary-foreground/80 hover:text-solar transition-colors">
                  info@eversol.in
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © {new Date().getFullYear()} EVERSOL Energy Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-primary-foreground/60 hover:text-solar transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-primary-foreground/60 hover:text-solar transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
