import { Link } from 'react-router-dom';
import { Leaf, Twitter, Linkedin, Github, Mail, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-green flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-space font-bold text-lg text-white">
                Biochar<span className="text-green-400">Hub</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              The Global Biochar Intelligence Platform bridging material science and AI for carbon capture optimization.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
            { Icon: Twitter, href: '#' },
            { Icon: Linkedin, href: '#' },
            { Icon: Github, href: '#' },
            { Icon: Mail, href: '#' },
          ].map(({ Icon, href }, i) => (
            <a key={i} href={href} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-green-500/20 hover:text-green-400 flex items-center justify-center transition-all">
              <Icon className="w-4 h-4" />
            </a>
          ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Database', path: '/database' },
                { label: 'Property Estimator', path: '/property-estimator' },
                { label: 'CO₂ Estimator', path: '/predictor' },
                { label: 'Materials Advisor', path: '/advisor' },
                { label: 'Share Data', path: '/share' },
                { label: 'About', path: '/about' },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm hover:text-green-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Science */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Science</h4>
            <ul className="space-y-2.5 text-sm">
              {['CO₂ Adsorption', 'Pyrolysis Methods', 'Activation Techniques', 'Carbon Capture', 'Feedstock Analysis'].map(item => (
                <li key={item}><a href="#" className="hover:text-green-400 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-green-400" /> contact@biocharhub.ai</li>
              <li className="flex items-center gap-2"><Globe className="w-4 h-4 text-green-400" /> www.biocharhub.ai</li>
            </ul>
            <div className="mt-5 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-xs text-green-400 font-medium">Open Science Initiative</p>
              <p className="text-xs text-slate-400 mt-1">Contributing to IPCC carbon capture research goals</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© 2026 BiocharHub. All rights reserved. Advancing carbon capture science.</p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Data License</a>
          </div>
        </div>
      </div>
    </footer>
  );
}