// @ts-nocheck
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, ChevronDown, Thermometer, Clock, TrendingUp, FlaskConical, Database, Layers, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { TOTAL_DATA_POINTS } from '../../lib/biocharKnowledgeBase';
import { BIOMASS_LIST } from '../../lib/database44';
import { CO2_MODELS } from '../../lib/modelRegistry';
import ModelSelector from '../shared/ModelSelector';
import OutOfRangeAlert from './OutOfRangeAlert';

const biomassOptions = BIOMASS_LIST;

const agentOptions = [
  { value: 'Non',     label: 'None (No Activation)' },
  { value: 'KOH',     label: 'KOH (Chemical)' },
  { value: 'K2CO3',   label: 'K₂CO₃ (Chemical)' },
  { value: 'KOH-CO2', label: 'KOH + CO₂ (Combined)' },
  { value: 'CO2',     label: 'CO₂ (Physical)' },
  { value: 'LiCl',    label: 'LiCl (Chemical)' },
];

// Known blend chemicals — used for autocomplete + data availability hint
const KNOWN_CHEMS = [
  { key: 'PKBC', label: 'PKBC', desc: 'Palm Kernel Biochar Composite', color: '#f97316' },
  { key: 'TKBC', label: 'TKBC', desc: 'Teak Kernel Biochar Composite',  color: '#8b5cf6' },
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
            type="number" value={value} min={min} max={max} step={step}
            onChange={e => onChange(Number(e.target.value))}
            className="w-20 text-right px-2 py-1 rounded-lg bg-muted border border-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
      <div className="relative">
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #22c55e ${((value-min)/(max-min))*100}%, #e2e8f0 ${((value-min)/(max-min))*100}%)` }}
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>{min}{unit}</span><span>{max}{unit}</span>
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
        <select value={value} onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500/30">
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
  const navigate  = useNavigate();
  const location  = useLocation();
  const prefill   = location.state?.prefill ?? {};
  const hasPrefill = !!(prefill.biomass || prefill.activator || prefill.temperature);

  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('ridge');
  const [params, setParams] = useState({
    biomass:       prefill.biomass       ?? 'Corn straw',
    temperature:   prefill.temperature   ?? 600,
    residenceTime: prefill.residenceTime ?? 60,
    heatingRate:   prefill.heatingRate   ?? 10,
    activator:     prefill.activator     ?? 'Non',
    chemBlend: {
      enabled:  false,
      chemical: 'PKBC',  // chemical name (PKBC, TKBC, or custom)
      percent:  5.0,     // weight percent (0.1 – 100)
    },
  });

  const set = (k, v) => setParams(p => ({ ...p, [k]: v }));
  const setBlend = (field, val) =>
    setParams(p => ({ ...p, chemBlend: { ...p.chemBlend, [field]: val } }));

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    navigate('/results', { state: { params: { ...params, selectedModel } } });
  };

  const knownChem = KNOWN_CHEMS.find(c => c.key === params.chemBlend.chemical);

  return (
    <div className="glass-card rounded-3xl p-8 border border-border max-w-2xl mx-auto">
      {/* Pre-fill banner */}
      {hasPrefill && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50 border border-indigo-200 mb-4 text-xs text-indigo-700">
          <Zap className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
          Parameters pre-filled from a research scenario — adjust any value and click Generate.
        </div>
      )}

      {/* Data badge */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 mb-6">
        <Database className="w-4 h-4 text-green-600 shrink-0" />
        <p className="text-xs text-green-700">
          <span className="font-semibold">Data Source:</span> Expert guidance based on{' '}
          <span className="font-bold">{TOTAL_DATA_POINTS.toLocaleString()} peer-reviewed experimental records</span>
        </p>
      </div>

      <div className="space-y-8">

        {/* ── Step 1: Biomass ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-green-500 text-white text-xs font-bold flex items-center justify-center">1</div>
            <h3 className="font-space font-semibold text-base">Select Biomass</h3>
          </div>
          <SelectField
            label="Biomass / Feedstock Type"
            value={params.biomass}
            options={biomassOptions}
            onChange={v => set('biomass', v)}
          />
          <p className="text-xs text-muted-foreground mt-1.5">8 species with confirmed experimental records</p>
        </div>

        <div className="border-t border-border" />

        {/* ── Step 2: Pyrolysis ── */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-blue-500 text-white text-xs font-bold flex items-center justify-center">2</div>
            <h3 className="font-space font-semibold text-base">Pyrolysis Conditions</h3>
          </div>
          <div className="space-y-6">
            <SliderField label="Pyrolysis Temperature" icon={Thermometer}
              value={params.temperature} min={350} max={900} step={50} unit="°C"
              onChange={v => set('temperature', v)} />
            <SliderField label="Residence Time" icon={Clock}
              value={params.residenceTime} min={10} max={300} step={10} unit=" min"
              onChange={v => set('residenceTime', v)} />
            <SliderField label="Heating Rate" icon={TrendingUp}
              value={params.heatingRate} min={1} max={20} step={1} unit="°C/min"
              onChange={v => set('heatingRate', v)} />
          </div>
        </div>

        <div className="border-t border-border" />

        {/* ── Step 3: Activation ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-purple-500 text-white text-xs font-bold flex items-center justify-center">3</div>
            <h3 className="font-space font-semibold text-base">Activation Method</h3>
          </div>
          <SelectField
            label="Chemical / Physical Activator"
            value={params.activator}
            options={agentOptions}
            onChange={v => set('activator', v)}
            isObject
          />
        </div>

        <div className="border-t border-border" />

        {/* ── Step 4: Chemical Blend (optional) ── */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-cyan-500 text-white text-xs font-bold flex items-center justify-center">4</div>
            <h3 className="font-space font-semibold text-base">Chemical Blend</h3>
            <span className="text-xs text-muted-foreground font-normal ml-1">— optional</span>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 font-semibold">
              New · Limited data
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-4 ml-9">
            Mix biochar with a chemical composite (PKBC / TKBC). Enter the chemical name and weight %.
            Effect is interpolated from experimental records.
          </p>

          {/* Enable toggle */}
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => setBlend('enabled', !params.chemBlend.enabled)}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                params.chemBlend.enabled ? 'bg-cyan-500' : 'bg-muted border border-border'
              }`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                params.chemBlend.enabled ? 'translate-x-5' : 'translate-x-0.5'
              }`} />
            </button>
            <span className="text-sm font-medium">
              {params.chemBlend.enabled ? 'Blend enabled' : 'No blend (pure biochar)'}
            </span>
          </div>

          {params.chemBlend.enabled && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-4 p-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5">

              {/* Chemical name */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-500" /> Chemical Name
                </label>
                <div className="flex gap-2 flex-wrap">
                  {KNOWN_CHEMS.map(c => (
                    <button key={c.key} type="button"
                      onClick={() => setBlend('chemical', c.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        params.chemBlend.chemical === c.key
                          ? 'text-white border-transparent'
                          : 'border-border bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                      style={params.chemBlend.chemical === c.key
                        ? { background: c.color, borderColor: c.color }
                        : {}}
                    >
                      {c.label}
                      <span className="ml-1 opacity-60 font-normal">{c.desc}</span>
                    </button>
                  ))}
                  {/* Custom input */}
                  {!KNOWN_CHEMS.find(c => c.key === params.chemBlend.chemical) && (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-cyan-500 bg-cyan-500/10 text-cyan-700">
                      Custom: {params.chemBlend.chemical}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={params.chemBlend.chemical}
                  onChange={e => setBlend('chemical', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,''))}
                  placeholder="or type custom chemical (e.g. PKBC)"
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  maxLength={12}
                />
              </div>

              {/* Percentage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Blend Ratio (wt%)</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={params.chemBlend.percent}
                      min={0.1} max={100} step={0.5}
                      onChange={e => setBlend('percent', Math.min(100, Math.max(0.1, Number(e.target.value))))}
                      className="w-20 text-right px-2 py-1 rounded-lg bg-muted border border-border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                    />
                    <span className="text-xs text-muted-foreground">wt%</span>
                  </div>
                </div>
                <input
                  type="range" min={0.1} max={30} step={0.5}
                  value={Math.min(30, params.chemBlend.percent)}
                  onChange={e => setBlend('percent', Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #06b6d4 ${(Math.min(30,params.chemBlend.percent)/30)*100}%, #e2e8f0 ${(Math.min(30,params.chemBlend.percent)/30)*100}%)` }}
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>0.1%</span><span>5%</span><span>10%</span><span>20%</span><span>30%+</span>
                </div>
              </div>

              {/* Preview label */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/60 border border-cyan-500/20">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-cyan-700">
                  {params.chemBlend.percent}% {params.chemBlend.chemical} composite
                </span>
                {knownChem
                  ? <span className="text-[10px] text-muted-foreground">— {knownChem.desc}</span>
                  : <span className="text-[10px] text-amber-600">— custom chemical (no DB reference)</span>
                }
              </div>

              <p className="text-[10px] text-amber-600 flex items-start gap-1">
                <span>⚠</span>
                Blend effect is interpolated from limited records (2–3 per blend type).
                Use results as indicative estimates only.
              </p>
            </motion.div>
          )}
        </div>

        <div className="border-t border-border" />

        {/* ── Step 5: Model Selection ── */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 text-white text-xs font-bold flex items-center justify-center">5</div>
            <h3 className="font-space font-semibold text-base">ML Model</h3>
            <span className="text-xs text-muted-foreground font-normal ml-1">— choose your ML predictor</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4 ml-9">
            DB Statistical Lookup always shows. Select which <span className="font-semibold text-foreground">ML model</span> to highlight as your primary prediction alongside it.
          </p>
          <ModelSelector
            models={CO2_MODELS}
            selected={selectedModel}
            onChange={setSelectedModel}
            context="co2"
          />
        </div>

        <OutOfRangeAlert params={params} />

        {/* ── CTA ── */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-2xl gradient-green text-white font-space font-bold text-lg glow-green hover:scale-[1.02] transition-all disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-3"
        >
          {loading ? (
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Matching Research Data...</>
          ) : (
            <><Zap className="w-5 h-5" /> Generate Expert Guidance</>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          BioPredict AI v1.7 · Statistical + ML Pipeline · Based on Historical Research Data
        </p>
      </div>
    </div>
  );
}
