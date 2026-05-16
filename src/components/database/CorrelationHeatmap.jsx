import { useMemo } from 'react';

// Curated to scientifically most important features for CO₂ adsorption
const VARS = [
  { key: 'pyroTemp',    label: 'Pyro Temp' },
  { key: 'surfaceArea', label: 'BET Area' },
  { key: 'poreVolume',  label: 'Pore Vol' },
  { key: 'co2Uptake',   label: 'CO₂ Uptake' },
  { key: 'adsorpTemp',  label: 'Ads Temp' },
  { key: 'pressure',    label: 'Pressure' },
  { key: 'C_cha',       label: 'C content' },
];

function pearsonR(xs, ys) {
  const n = xs.length;
  if (n < 2) return null;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let num = 0, dx2 = 0, dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx, dy = ys[i] - my;
    num += dx * dy; dx2 += dx * dx; dy2 += dy * dy;
  }
  const denom = Math.sqrt(dx2 * dy2);
  if (denom === 0) return null;
  return num / denom;
}

function cellColor(r) {
  // positive: deep blue, near 0: white/grey, negative: warm orange
  if (r > 0) {
    const intensity = Math.round(r * 255);
    return `rgb(${255 - intensity}, ${255 - Math.round(intensity * 0.4)}, 255)`;
  } else {
    const intensity = Math.round(Math.abs(r) * 255);
    return `rgb(255, ${255 - Math.round(intensity * 0.55)}, ${255 - intensity})`;
  }
}

function textColor(r) {
  return Math.abs(r) > 0.5 ? '#fff' : '#374151';
}

export default function CorrelationHeatmap({ records = [] }) {
  const matrix = useMemo(() => {
    return VARS.map(v1 =>
      VARS.map(v2 => {
        if (v1.key === v2.key) return { value: 1, info: true };
        // Only include rows where both values are non-null numbers
        const pairs = records.filter(r => r[v1.key] != null && r[v2.key] != null);
        if (pairs.length < 2) return { value: null, info: false };
        const xs = pairs.map(r => r[v1.key]);
        const ys = pairs.map(r => r[v2.key]);
        const value = pearsonR(xs, ys);
        if (!Number.isFinite(value)) return { value: null, info: false };
        return { value: +value.toFixed(2), info: false };
      })
    );
  }, [records]);

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Pearson correlation coefficient (R) between key numerical variables. Blue = positive, Orange = negative. |R| &gt; 0.7 indicates strong correlation.
      </p>
      <div className="overflow-x-auto">
        <table className="text-xs border-collapse mx-auto">
          <thead>
            <tr>
              <th className="p-2 text-left text-muted-foreground w-24" />
              {VARS.map(v => (
                <th key={v.key} className="p-2 text-center font-semibold text-muted-foreground whitespace-nowrap w-20">{v.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {VARS.map((v1, i) => (
              <tr key={v1.key}>
                <td className="p-2 font-semibold text-foreground whitespace-nowrap pr-4">{v1.label}</td>
                {VARS.map((v2, j) => {
                  const cell = matrix[i][j];
                  const r = cell.value;
                  const isDiag = i === j;
                  const isMissing = r == null;
                  return (
                    <td key={v2.key} className="p-1">
                      <div
                        className="w-16 h-12 rounded-lg flex items-center justify-center font-bold transition-transform hover:scale-110 cursor-default"
                        style={{
                          background: isDiag ? 'linear-gradient(135deg,#22c55e,#16a34a)' : isMissing ? '#e5e7eb' : cellColor(r),
                          color: isDiag ? '#fff' : isMissing ? '#6b7280' : textColor(r),
                        }}
                        title={isMissing ? `${v1.label} × ${v2.label}: No data` : `${v1.label} × ${v2.label}: R = ${r}`}
                      >
                        {isDiag ? '1.00' : isMissing ? 'No data' : r.toFixed(2)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-3 justify-center flex-wrap text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-3 rounded" style={{ background: 'rgb(0,102,255)' }} />
          <span>Strong positive (R→+1)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-3 rounded bg-slate-200" />
          <span>No correlation (R≈0)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-3 rounded" style={{ background: 'rgb(255,140,0)' }} />
          <span>Strong negative (R→−1)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-3 rounded bg-slate-300" />
          <span>No data</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)' }} />
          <span>Diagonal (self)</span>
        </div>
      </div>
    </div>
  );
}