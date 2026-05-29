// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, ShieldCheck, ChevronDown, LayoutDashboard, BookOpen, Flame, Zap, FileText, Users, Layers, Sun, Moon, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRole } from '../../lib/RoleContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../lib/ThemeContext';

const HOME_SECTIONS = [
  { label: 'Overview',           anchor: 'section-hero',        icon: LayoutDashboard },
  { label: 'Database Summary',   anchor: 'section-chemical',    icon: Zap },
  { label: 'Introduction',       anchor: 'section-intro',       icon: BookOpen },
  { label: 'Knowledge Center',   anchor: 'section-knowledge',   icon: Layers },
  { label: 'Research Docs',      anchor: 'section-documents',   icon: FileText },
  { label: 'Biochar Society',    anchor: 'section-society',     icon: Users },
  { label: 'CO₂ Heatmap',        anchor: 'section-heatmap',     icon: Flame },
  { label: 'Q&A / Help',         anchor: 'section-faq',         icon: HelpCircle },
];

const PUBLIC_LINKS = [
  { labelKey: 'nav.home',              path: '/' },
  { labelKey: 'nav.database',          path: '/database' },
  { labelKey: 'nav.propertyEstimator', path: '/property-estimator' },
  { labelKey: 'nav.co2Estimator',      path: '/predictor' },
  { labelKey: 'nav.advisor',           path: '/advisor' },
  { labelKey: 'nav.faq',              path: '/faq' },
  { labelKey: 'nav.about',             path: '/about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [homeDropOpen, setHomeDropOpen] = useState(false);
  const homeDropRef = useRef(null);
  const location  = useLocation();
  const { isAdmin } = useRole();
  const { t, i18n } = useTranslation();
  const { isDark, toggle: toggleTheme } = useTheme();
  const warnedRef = useRef(false);
  const restrictedThaiPages = ['/database', '/property-estimator', '/predictor', '/advisor'];
  const isRestrictedThaiPage = restrictedThaiPages.includes(location.pathname);

  // Show Share Data link only to admins
  const navLinks = isAdmin
    ? [...PUBLIC_LINKS, { labelKey: 'nav.shareData', path: '/share', admin: true }]
    : PUBLIC_LINKS;

  

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isRestrictedThaiPage && i18n.language === 'th') {
      if (!warnedRef.current) {
        window.alert('🇹🇭 Thai version is not available at this moment 🙏');
        warnedRef.current = true;
      }
      i18n.changeLanguage('en');
    }
    if (!isRestrictedThaiPage) {
      warnedRef.current = false;
    }
  }, [isRestrictedThaiPage, i18n.language]);

  const handleLangToggle = () => {
    if (isRestrictedThaiPage && i18n.language === 'en') {
      window.alert('🇹🇭 Thai version is not available at this moment 🙏');
      return;
    }
    i18n.changeLanguage(i18n.language === 'en' ? 'th' : 'en');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'glass shadow-lg shadow-blue-900/10 border-b border-white/40 dark:border-slate-700/40'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group min-w-0">
            <div className="relative w-10 h-10 rounded-2xl gradient-green flex items-center justify-center glow-green group-hover:scale-105 transition-transform shadow-lg shadow-green-500/20">
              <Leaf className="w-5 h-5 text-white" />
              <span className="absolute inset-0 rounded-2xl ring-1 ring-white/25" />
            </div>
            <div className="min-w-0 flex flex-col">
              <span className="font-space font-bold text-base sm:text-lg leading-tight tracking-tight text-foreground truncate">
                BiocharInformatics<span className="text-gradient-green">Thailand</span>
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-muted-foreground/80 leading-none mt-1 truncate">
                Biochar research platform
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const isHome = link.path === '/';

              if (isHome) {
                return (
                  <div
                    key={link.path}
                    ref={homeDropRef}
                    className="relative"
                    onMouseEnter={() => setHomeDropOpen(true)}
                    onMouseLeave={() => setHomeDropOpen(false)}
                  >
                    <Link
                      to={link.path}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                        isActive
                          ? 'bg-green-500 text-white font-semibold shadow-md shadow-green-500/20'
                          : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {t(link.labelKey)}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${homeDropOpen ? 'rotate-180' : ''}`} />
                    </Link>

                    <AnimatePresence>
                      {homeDropOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 w-52 glass-card rounded-xl border border-border shadow-xl shadow-black/10 overflow-hidden z-50 py-1"
                        >
                          {HOME_SECTIONS.map((s) => {
                            const Icon = s.icon;
                            return (
                              <a
                                key={s.anchor}
                                href={`/#${s.anchor}`}
                                onClick={() => setHomeDropOpen(false)}
                                className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                              >
                                <Icon className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                {s.label}
                              </a>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

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
              onClick={handleLangToggle}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-border bg-muted hover:border-green-400 hover:bg-green-500/10 transition-all text-sm font-semibold"
              title={i18n.language === 'en' ? 'Switch to Thai' : 'Switch to English'}
            >
              <span className={i18n.language === 'en' ? 'text-green-600' : 'text-muted-foreground'}>EN</span>
              <span className="text-muted-foreground/40 mx-0.5">|</span>
              <span className={i18n.language === 'th' ? 'text-green-600' : 'text-muted-foreground'}>TH</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-9 h-9 rounded-full border border-border dark:border-slate-600 bg-muted dark:bg-slate-700/80 hover:border-green-400 hover:bg-green-500/10 flex items-center justify-center transition-all shadow-sm"
            >
              {isDark
                ? <Sun className="w-4 h-4 text-amber-300" />
                : <Moon className="w-4 h-4 text-slate-500" />}
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile language toggle */}
            <button
              onClick={handleLangToggle}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-muted text-xs font-semibold"
            >
              <span className={i18n.language === 'en' ? 'text-green-600' : 'text-muted-foreground'}>EN</span>
              <span className="text-muted-foreground/40">|</span>
              <span className={i18n.language === 'th' ? 'text-green-600' : 'text-muted-foreground'}>TH</span>
            </button>
            {/* Mobile theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark
                ? <Sun className="w-4 h-4 text-amber-400" />
                : <Moon className="w-4 h-4 text-slate-500" />}
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
