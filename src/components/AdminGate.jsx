/**
 * AdminGate — wraps any route that requires admin access.
 * Guests see a passcode dialog instead of the protected content.
 */
import { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useRole } from '../lib/RoleContext';

export default function AdminGate({ children }) {
  const { isAdmin, login } = useRole();
  const [code, setCode]     = useState('');
  const [show, setShow]     = useState(false);
  const [error, setError]   = useState(false);
  const [shake, setShake]   = useState(false);

  if (isAdmin) return children;

  function handleSubmit(e) {
    e.preventDefault();
    if (login(code)) {
      setError(false);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setCode('');
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className={`glass-card rounded-3xl p-10 border border-border max-w-md w-full text-center
        ${shake ? 'animate-shake' : ''}`}
        style={shake ? { animation: 'shake 0.4s ease-in-out' } : {}}
      >
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20
          flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-amber-500" />
        </div>

        <h2 className="font-space font-bold text-2xl mb-2">Restricted Access</h2>
        <p className="text-muted-foreground text-sm mb-8">
          The <span className="font-semibold text-foreground">Contribute Data</span> page
          is available to research team members only. Enter the access code to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={code}
              onChange={e => { setCode(e.target.value); setError(false); }}
              placeholder="Enter access code"
              className={`w-full px-4 py-3 rounded-xl border text-sm font-mono
                bg-muted focus:outline-none focus:ring-2 transition-colors
                ${error
                  ? 'border-red-400 focus:ring-red-500/30 text-red-600'
                  : 'border-border focus:ring-green-500/30'
                }`}
            />
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-500 font-medium">Incorrect access code. Please try again.</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl gradient-green text-white font-semibold
              text-sm glow-green hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" /> Unlock Access
          </button>
        </form>

        <p className="text-[11px] text-muted-foreground mt-6">
          Contact the research team for access · BiocharInformaticsThailand
        </p>
      </div>

      {/* Shake keyframe */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-5px); }
          80%       { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
