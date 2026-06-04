import { Link } from 'react-router-dom';
import { Leaf, Twitter, Linkedin, Github, Mail, Globe } from 'lucide-react';
import { useState } from 'react';
import MarkdownModal from '../../components/ui/MarkdownModal';
import PRIVACY from '../../../PRIVACY_POLICY_v1.0.md?raw';
import TERMS from '../../../TERMS_OF_SERVICE_v1.0.md?raw';
import LICENSE from '../../../DATA_LICENSE_v1.0.md?raw';

export default function Footer() {
  const [open, setOpen] = useState(null);

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
                BiocharInformaticsThailand
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
                { label: 'Home', path: '/' },
                { label: 'Database', path: '/database' },
                { label: 'Property Estimator', path: '/property-estimator' },
                { label: 'CO₂ Estimator', path: '/predictor' },
                { label: 'Materials Advisor', path: '/advisor' },
                { label: 'Q&A / Help', path: '/faq' },
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
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-green-400" /> biocharinformaticthailand@gmail.com</li>
              <li className="flex items-center gap-2"><Globe className="w-4 h-4 text-green-400" /> https://biochar-ai-th.netlify.app/about</li>
            </ul>
            <div className="mt-5 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-xs text-green-400 font-medium">The Petroleum and Petrochemical College, Chulalongkorn University</p>
              <p className="text-xs text-slate-400 mt-1">Contributing to carbon capture research goals</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© 2026 BiocharInformaticsThailand. All rights reserved. Advancing carbon capture science.</p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <button onClick={() => setOpen('privacy')} className="hover:text-slate-300">Privacy Policy</button>
            <button onClick={() => setOpen('terms')} className="hover:text-slate-300">Terms of Service</button>
            <button onClick={() => setOpen('license')} className="hover:text-slate-300">Data License</button>
          </div>
        </div>
      </div>
      {open === 'privacy' && (
        <MarkdownModal open={true} title="Privacy Policy (V.1.0)" content={PRIVACY} onClose={() => setOpen(null)} />
      )}
      {open === 'terms' && (
        <MarkdownModal open={true} title="Terms of Service (V.1.0)" content={TERMS} onClose={() => setOpen(null)} />
      )}
      {open === 'license' && (
        <MarkdownModal open={true} title="Data License (V.1.0)" content={LICENSE} onClose={() => setOpen(null)} />
      )}
    </footer>
  );
}
