import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ChevronDown, Thermometer, Clock, TrendingUp, FlaskConical, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { TOTAL_DATA_POINTS } from '../../lib/biocharKnowledgeBase';
import { BIOMASS_LIST } from '../../lib/database44';
import OutOfRangeAlert from './OutOfRangeAlert';

const biomassOptions = BIOMASS_LIST;

const agentOptions = [
  { value: 'Non', label: 'None (No Activation)' },
  { value: 'KOH', label: 'KOH (Chemical)' },
  { value: 'K2CO3', label: 'K₂CO₃ (Chemical)' },
  { value: 'KOH-CO2', label: 'KOH + CO₂ (Combined)' },
  { value: 'CO2', label: 'CO₂ (Physical)' },
  { value: 'LiCl', label: 'LiCl (Chemical)' },
];

function SliderField({ label, icon: Icon, value, min, max, step, unit, onChange }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Icon className="w-4 h-4 text-muted-foreground" />
          {label}
        </label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={e => onChange(Number(e.target.value))}
            className="w-20 text-right px-2 py-1 rounded-lg bg-muted border border-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #22c55e ${((value - min) / (max - min)) * 100}%, #e2e8f0 ${((value - min) / (max - min)) * 100}%)`
          }}
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange, isObject = false }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500/30"
        >
          {isObject
            ? options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)
            : options.map(opt => <option key={opt} value={opt}>{opt}</option>)
          }
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

export default function PredictorForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    biomass: 'Corn straw',
    temperature: 600,
    residenceTime: 60,
    heatingRate: 10,
    activator: 'Non',
    blend: { enabled: false, secondary: 'Corn straw', ratio: 50 },
  });

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    navigate('/results', { state: { params } });
  };

  return (
    <div className="glass-card rounded-3xl p-8 border border-border max-w-2xl mx-auto">
      {/* Data Source Badge */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 mb-6">
        <Database className="w-4 h-4 text-green-600 shrink-0" />
        <p className="text-xs text-green-700">
          <span className="font-semibold">Data Source:</span> Expert guidance based on{' '}
          <span className="font-bold">{TOTAL_DATA_POINTS.toLocaleString()} peer-reviewed experimental data points</span> — no live AI inference
        </p>
      </div>

      <div className="space-y-8">
        {/* Step 1 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-green-500 text-white text-xs font-bold flex items-center justify-center">1</div>
            <h3 className="font-space font-semibold text-base">Select Biomass</h3>
          </div>
          <SelectField
            label="Biomass / Feedstock Type"
            value={params.biomass}
            options={biomassOptions}
            onChange={v => setParams({ ...params, biomass: v })}
          />
          <p className="text-xs text-muted-foreground mt-1.5">Species with confirmed entries in the research database</p>
        </div>

        <div className="border-t border-border" />

        {/* Step 2 */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-blue-500 text-white text-xs font-bold flex items-center justify-center">2</div>
            <h3 className="font-space font-semibold text-base">Pyrolysis Parameters</h3>
          </div>
          <div className="space-y-6">
            <SliderField
              label="Pyrolysis Temperature"
              icon={Thermometer}
              value={params.temperature}
              min={350}
              max={900}
              step={50}
              unit="°C"
              onChange={v => setParams({ ...params, temperature: v })}
            />
            <SliderField
              label="Residence Time"
              icon={Clock}
              value={params.residenceTime}
              min={10}
              max={300}
              step={10}
              unit=" min"
              onChange={v => setParams({ ...params, residenceTime: v })}
            />
            <SliderField
              label="Heating Rate"
              icon={TrendingUp}
              value={params.heatingRate}
              min={1}
              max={20}
              step={1}
              unit="°C/min"
              onChange={v => setParams({ ...params, heatingRate: v })}
            />
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Step 3 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-purple-500 text-white text-xs font-bold flex items-center justify-center">3</div>
            <h3 className="font-space font-semibold text-base">Activation Method</h3>
          </div>
          <SelectField
            label="Chemical / Physical Activator"
            value={params.activator}
            options={agentOptions}
            onChange={v => setParams({ ...params, activator: v })}
            isObject
          />
        </div>

        <OutOfRangeAlert params={params} />

        {/* Optional Blend */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <input
                id="useBlend"
                type="checkbox"
                checked={params.blend.enabled}
                onChange={e => setParams(p => ({ ...p, blend: { ...p.blend, enabled: e.target.checked } }))}
                className="w-4 h-4 rounded-md"
              />
              <label htmlFor="useBlend" className="text-sm font-medium">Enable Blend / Composite</label>
            </div>
            <p className="text-xs text-muted-foreground">Compare predictions across mixed feedstocks</p>
          </div>

          {params.blend.enabled && (
            <div className="space-y-4">
              <SelectField
                label="Secondary Biomass"
                value={params.blend.secondary}
                options={biomassOptions}
                onChange={v => setParams(p => ({ ...p, blend: { ...p.blend, secondary: v } }))}
              />

              <div>
                <label className="text-sm font-medium">Blend Ratio ({params.blend.ratio}% secondary)</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={params.blend.ratio}
                  onChange={e => setParams(p => ({ ...p, blend: { ...p.blend, ratio: Number(e.target.value) } }))}
                  className="w-full mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">0% = pure primary · 100% = pure secondary</div>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-2xl gradient-green text-white font-space font-bold text-lg glow-green hover:scale-[1.02] transition-all disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Matching Research Data...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Generate Expert Guidance
            </>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          BioPredict AI v1.6 · Data-Driven Expert Guidance · Based on Historical Research Data
        </p>
      </div>
    </div>
  );
}
