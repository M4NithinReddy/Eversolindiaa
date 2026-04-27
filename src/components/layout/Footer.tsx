import { Link } from 'react-router-dom';
import { Sun, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const footerLinks = {
  quickLinks: [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/shop#product-search' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Impact', path: '/impact' },
    { name: 'Contact', path: '/contact' },
    { name: 'My Dashboard', path: '/user-dashboard' },
    { name: 'Shipping Policy', path: '/shipping-policy' },
    { name: 'Payment Policy', path: '/payment-policy' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Cancellation and Returns Policy', path: '/cancellation-policy' },
    { name: 'Terms and Conditions', path: '/terms' },
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
              <img
                src="/images/eversol.png"
                alt="Eversol Logo"
                className="h-28 w-auto object-contain"
              />
            </Link>
            <p className="text-primary-foreground/80 mb-4 max-w-sm leading-relaxed">
              Powering India's sustainable future with premium solar energy solutions.
              Generate | Conserve | Contribute
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.facebook.com/profile.php?id=61567848662496" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-solar hover:text-accent-foreground transition-all duration-300">
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

          {/* Quick Links Column 1 */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-solar">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.slice(0, 6).map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/80 hover:text-solar transition-colors duration-300"
                    onClick={() => {
                      if (link.path.includes('/shop')) {
                        ['shop_category', 'shop_brand', 'shop_invType', 'shop_invBrand', 'shop_search', 'shop_page'].forEach(k => sessionStorage.removeItem(k));
                      }
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column 2 */}
          <div className="flex flex-col">
            <div className="hidden lg:block h-7 mb-6" aria-hidden="true"></div>
            <ul className="space-y-3">
              {footerLinks.quickLinks.slice(6).map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/80 hover:text-solar transition-colors duration-300"
                    onClick={() => {
                      if (link.path.includes('/shop')) {
                        ['shop_category', 'shop_brand', 'shop_invType', 'shop_invBrand', 'shop_search', 'shop_page'].forEach(k => sessionStorage.removeItem(k));
                      }
                    }}
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
                  EVERSOL INDIA <br />
                  Vasu Complex New BEL Road,<br />
                  Bengaluru, Karnataka 560054
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-solar shrink-0" />
                <a href="tel:+919902843835" className="text-primary-foreground/80 hover:text-solar transition-colors">
                  +91 99028 43835
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
              © {new Date().getFullYear()} EVERSOL INDIA. All rights reserved.
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
