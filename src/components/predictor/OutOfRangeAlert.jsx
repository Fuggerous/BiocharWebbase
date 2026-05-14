import { AlertTriangle, Info } from 'lucide-react';

/**
 * Displays out-of-range or low-data warnings on the predictor form.
 */
export default function OutOfRangeAlert({ params }) {
  const alerts = [];

  if (params.temperature < 500) {
    alerts.push({
      type: 'warning',
      message: `Pyrolysis temperature ${params.temperature}°C is below the well-characterized range. Only 40 database records exist for this bracket — estimate reliability is lower. Recommended: 600–800°C.`,
    });
  }

  if (params.temperature > 850) {
    alerts.push({
      type: 'warning',
      message: `Temperatures above 850°C have limited experimental coverage in the database. Results will be extrapolated from the 800°C bracket.`,
    });
  }

  if (params.activator === 'LiCl' && params.biomass === 'Coffee ground-based') {
    alerts.push({
      type: 'info',
      message: `LiCl activation combined with coffee ground-based biochar has minimal database coverage. The estimate will rely primarily on biomass-level statistics.`,
    });
  }

  if (params.activator === 'CO2' || params.activator === 'Physical') {
    alerts.push({
      type: 'info',
      message: `Physical CO₂ activation has only 26 database records — the smallest activator group. Confidence may be lower than for chemical activation methods.`,
    });
  }

  if (params.biomass === 'Pine sawdust powders') {
    alerts.push({
      type: 'info',
      message: `Pine sawdust has 60 database records (smallest biomass group). The estimate is less statistically robust than for Corn straw (311) or Coffee ground (504).`,
    });
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2 mt-4">
      {alerts.map((alert, i) => (
        <div
          key={i}
          className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs leading-relaxed ${
            alert.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}
        >
          {alert.type === 'warning'
            ? <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            : <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          }
          {alert.message}
        </div>
      ))}
    </div>
  );
}