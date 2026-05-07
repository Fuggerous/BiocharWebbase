import { useMemo } from 'react';
import { DB44_RECORDS } from '../../lib/database44';

const VARS = [
  { key: 'pyroTemp',    label: 'Pyro Temp' },
  { key: 'surfaceArea', label: 'BET Area' },
  { key: 'poreVolume',  label: 'Pore Vol' },
  { key: 'co2Uptake',  label: 'CO₂ Uptake' },
  { key: 'pressure',   label: 'Pressure' },
  { key: 'adsorpTemp', label: 'Ads Temp' },
];

function pearsonR(xs, ys) {
  const n = xs.length;
  if (n < 2) return 0;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let num = 0, dx2 = 0, dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx, dy = ys[i] - my;
    num += dx * dy; dx2 += dx * dx; dy2 += dy * dy;
  }
  const denom = Math.sqrt(dx2 * dy2);
  return denom === 0 ? 0 : num / denom;
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

export default function CorrelationHeatmap() {
  const matrix = useMemo(() => {
    const data = DB44_RECORDS;
    return VARS.map(v1 =>
      VARS.map(v2 => {
        const xs = data.map(r => r[v1.key]);
        const ys = data.map(r => r[v2.key]);
        return +pearsonR(xs, ys).toFixed(2);
      })
    );
  }, []);

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
                  const r = matrix[i][j];
                  const isDiag = i === j;
                  return (
                    <td key={v2.key} className="p-1">
                      <div
                        className="w-16 h-12 rounded-lg flex items-center justify-center font-bold transition-transform hover:scale-110 cursor-default"
                        style={{
                          background: isDiag ? 'linear-gradient(135deg,#22c55e,#16a34a)' : cellColor(r),
                          color: isDiag ? '#fff' : textColor(r),
                        }}
                        title={`${v1.label} × ${v2.label}: R = ${r}`}
                      >
                        {isDiag ? '1.00' : r.toFixed(2)}
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
          <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)' }} />
          <span>Diagonal (self)</span>
        </div>
      </div>
    </div>
  );
}