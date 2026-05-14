// @ts-nocheck
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRole } from '../../lib/RoleContext';
import { useLang } from '../../lib/LanguageContext';

const PUBLIC_LINKS = [
  { labelKey: 'nav.home',              path: '/' },
  { labelKey: 'nav.database',          path: '/database' },
  { labelKey: 'nav.propertyEstimator', path: '/property-estimator' },
  { labelKey: 'nav.co2Estimator',      path: '/predictor' },
  { labelKey: 'nav.advisor',           path: '/advisor' },
  { labelKey: 'nav.about',             path: '/about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location  = useLocation();
  const { isAdmin } = useRole();
  const { lang, toggleLang, t } = useLang();

  // Show Share Data link only to admins
  const navLinks = isAdmin
    ? [...PUBLIC_LINKS, { labelKey: 'nav.shareData', path: '/share', admin: true }]
    : PUBLIC_LINKS;

  

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'glass shadow-lg shadow-blue-900/10' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-green flex items-center justify-center glow-green group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-space font-700 text-lg leading-none text-foreground">
                Biochar<span className="text-gradient-green"> Assistant</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wide leading-none">
                Thailand
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-green-500 text-white font-semibold shadow-md shadow-green-500/20'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {t(link.labelKey)}
                  {link.admin && <ShieldCheck className="w-3 h-3 text-green-500" />}
                </Link>
              );
            })}
          </div>

          {/* CTA + Language Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-border bg-muted hover:border-green-400 hover:bg-green-500/10 transition-all text-sm font-semibold"
              title={lang === 'en' ? 'Switch to Thai' : 'Switch to English'}
            >
              <span className={lang === 'en' ? 'text-green-600' : 'text-muted-foreground'}>EN</span>
              <span className="text-muted-foreground/40 mx-0.5">|</span>
              <span className={lang === 'th' ? 'text-green-600' : 'text-muted-foreground'}>TH</span>
            </button>

            
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile language toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-muted text-xs font-semibold"
            >
              <span className={lang === 'en' ? 'text-green-600' : 'text-muted-foreground'}>EN</span>
              <span className="text-muted-foreground/40">|</span>
              <span className={lang === 'th' ? 'text-green-600' : 'text-muted-foreground'}>TH</span>
            </button>
            <button
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/20"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-green-500 text-white'
                        : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {t(link.labelKey)}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
