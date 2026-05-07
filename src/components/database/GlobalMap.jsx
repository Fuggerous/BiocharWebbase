import { useState } from 'react';
import { Globe, MapPin } from 'lucide-react';

const LOCATIONS = [
  { id: 1, country: 'China', lat: 35, lng: 105, count: 340, type: 'Agricultural Waste', color: '#22c55e' },
  { id: 2, country: 'USA', lat: 38, lng: -97, count: 280, type: 'Wood', color: '#3b82f6' },
  { id: 3, country: 'Brazil', lat: -10, lng: -55, count: 190, type: 'Agricultural Waste', color: '#22c55e' },
  { id: 4, country: 'Germany', lat: 51, lng: 10, count: 160, type: 'Sludge', color: '#a855f7' },
  { id: 5, country: 'India', lat: 20, lng: 77, count: 210, type: 'Crop Residue', color: '#f59e0b' },
  { id: 6, country: 'Australia', lat: -25, lng: 133, count: 95, type: 'Wood', color: '#3b82f6' },
  { id: 7, country: 'UK', lat: 55, lng: -3, count: 88, type: 'Municipal Solid', color: '#f43f5e' },
  { id: 8, country: 'Japan', lat: 36, lng: 138, count: 120, type: 'Sludge', color: '#a855f7' },
  { id: 9, country: 'Canada', lat: 56, lng: -106, count: 75, type: 'Wood', color: '#3b82f6' },
  { id: 10, country: 'South Africa', lat: -29, lng: 25, count: 55, type: 'Agricultural Waste', color: '#22c55e' },
];

function latLngToPercent(lat, lng) {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { x, y };
}

const typeColors = {
  'Agricultural Waste': 'bg-green-500',
  'Wood': 'bg-blue-500',
  'Sludge': 'bg-purple-500',
  'Crop Residue': 'bg-amber-500',
  'Municipal Solid': 'bg-rose-500',
};

export default function GlobalMap() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="glass-card rounded-2xl p-5 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-space font-semibold text-base">Global Feedstock Sources</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Dataset origins by country and biomass type</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Globe className="w-3.5 h-3.5" />
          {LOCATIONS.length} regions
        </div>
      </div>

      {/* Map container */}
      <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: '50%' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-sky-100 border border-border/50 rounded-xl">
          {/* Simple SVG world outline hint */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />
          {/* Continent silhouettes (simplified visual) */}
          <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 100 50">
            {/* North America */}
            <rect x="5" y="8" width="18" height="18" rx="3" fill="#1e40af" />
            {/* South America */}
            <rect x="18" y="28" width="10" height="14" rx="2" fill="#1e40af" />
            {/* Europe */}
            <rect x="42" y="8" width="10" height="12" rx="2" fill="#1e40af" />
            {/* Africa */}
            <rect x="44" y="22" width="10" height="16" rx="3" fill="#1e40af" />
            {/* Asia */}
            <rect x="54" y="6" width="26" height="20" rx="3" fill="#1e40af" />
            {/* Australia */}
            <rect x="72" y="30" width="12" height="8" rx="2" fill="#1e40af" />
          </svg>

          {/* Location dots */}
          {LOCATIONS.map(loc => {
            const { x, y } = latLngToPercent(loc.lat, loc.lng);
            const size = Math.max(12, Math.min(28, loc.count / 15));
            return (
              <div
                key={loc.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all"
                style={{ left: `${x}%`, top: `${y}%` }}
                onMouseEnter={() => setHovered(loc)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  className="rounded-full animate-pulse opacity-40 absolute inset-0"
                  style={{ backgroundColor: loc.color, width: size * 1.8, height: size * 1.8, transform: 'translate(-20%, -20%)' }}
                />
                <div
                  className="rounded-full relative z-10 border-2 border-white shadow-md flex items-center justify-center"
                  style={{ backgroundColor: loc.color, width: size, height: size }}
                >
                  {loc.count > 200 && <span className="text-white text-[7px] font-bold">{Math.round(loc.count / 100)}k</span>}
                </div>
                {hovered?.id === loc.id && (
                  <div className="absolute z-20 bg-white rounded-xl shadow-xl p-3 text-xs whitespace-nowrap border border-border"
                    style={{ bottom: '120%', left: '50%', transform: 'translateX(-50%)' }}
                  >
                    <p className="font-semibold text-foreground">{loc.country}</p>
                    <p className="text-muted-foreground">{loc.count} datasets</p>
                    <p style={{ color: loc.color }} className="font-medium">{loc.type}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4">
        {Object.entries(typeColors).map(([type, colorClass]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
            {type}
          </div>
        ))}
      </div>
    </div>
  );
}