"""
BiocharHub – database44.js generator
Reads 44Database.xlsx → cleans → imputes → exports src/lib/database44.js
"""
import sys, io, json, math
import numpy as np
import pandas as pd
from pathlib import Path

if sys.stdout.encoding != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

EXCEL  = Path("C:/Users/fan_d/AppData/Local/Temp/44Database_temp.xlsx")
if not EXCEL.exists():
    EXCEL = Path("Database/44Database.xlsx")
OUTPUT = Path("src/lib/database44.js")

COL = {
    "isotherm":   "Isotherm",
    "biomass":    "Biomass species",
    "pyroTemp":   "Temperature_P(C)",
    "reTime":     "Resident_time_P(min)",
    "heatRate":   "Heating_rate_P(C/min)",
    "activator":  "Activator",
    "actType":    "Activation type",
    "actTemp":    "Activation_temperature(C)",
    "blend":      "Blend",
    "surface":    "Surface_area_act(m2/g)",
    "pore":       "Pore_volume_act(m3/kg)",
    "adsorpTemp": "Adsorption_temperature(C)",
    "pressure":   "Adsorption_Pressure(atm)",
    "co2":        "CO2_Uptake(mmol/g)",
    "C":          "C_cha(%)", "H": "H_cha(%)", "O": "O_cha(%)",
    "N":          "N_cha(%)", "S": "S_cha(%)",
}

BIOMASS_MAP = {
    "corn straw": "Corn straw", "coffee ground": "Coffee ground-based",
    "pine sawdust": "Pine sawdust powders", "bamboo": "Bamboo",
    "banana straw": "Banana straw", "pomelo peel": "Pomelo peel",
    "sugarcane bagasse": "Sugarcane bagasse", "cotton straw": "Cotton straw",
}
def norm_biomass(v):
    s = str(v).strip().lower()
    for k, m in BIOMASS_MAP.items():
        if k in s: return m
    return str(v).strip()

def norm_activator(v):
    if pd.isna(v) or str(v).strip().lower() in ("none","non","-",""): return "Non"
    s = str(v).strip().lower()
    if "koh" in s and "co2" in s: return "KOH-CO2"
    if "koh" in s: return "KOH"
    if "k2co3" in s: return "K2CO3"
    if "co2" in s: return "CO2"
    if "licl" in s: return "LiCl"
    return "Non"

def norm_act_type(v):
    if pd.isna(v): return "Non"
    s = str(v).strip().lower()
    if "comb" in s: return "Combined"
    if "chem" in s: return "Chemical"
    if "phys" in s: return "Physical"
    return "Non"

def norm_blend(v):
    if pd.isna(v) or str(v).strip().lower() in ("non","none","-",""): return "Non"
    return str(v).strip()

print("Loading Excel...")
df = pd.read_excel(EXCEL, engine="openpyxl")
df.columns = df.columns.str.strip()

df["bio"]      = df[COL["biomass"]].apply(norm_biomass)
df["act"]      = df[COL["activator"]].apply(norm_activator)
df["atype"]    = df[COL["actType"]].apply(norm_act_type)
df["blend"]    = df[COL["blend"]].apply(norm_blend)
df["isotherm"] = pd.to_numeric(df[COL["isotherm"]], errors="coerce")

for k, c in COL.items():
    if k not in ("biomass","activator","actType","blend","isotherm"):
        df[k] = pd.to_numeric(df[c], errors="coerce")

df["adsorpTemp"] = df["adsorpTemp"].fillna(25)

# Identify non-isotherm rows (Isotherm = 'Not') — no CO2 data but have BET
raw_iso_col = df[COL["isotherm"]].astype(str).str.strip().str.lower()
df["_is_isotherm"] = ~(raw_iso_col == "not")

# Isotherm records: require CO2, surface, pore
iso_df  = df[ df["_is_isotherm"] & (df["co2"] > 0) & df["pyroTemp"].notna() & df["surface"].notna()].copy()

# Non-isotherm records: require surface area; set CO2/pressure/pore to null; activator → Non
non_df  = df[~df["_is_isotherm"] & df["pyroTemp"].notna() & df["surface"].notna()].copy()
non_df["co2"]      = None
non_df["pressure"] = None
non_df["pore"]     = None
non_df["act"]      = "Non"    # no activation info → treat as unactivated
non_df["atype"]    = "Non"
non_df["blend"]    = "Non"
non_df["isotherm"] = None     # no isotherm ID

df = pd.concat([iso_df, non_df], ignore_index=True)
print(f"Isotherm records: {len(iso_df)}  |  Non-isotherm (BET-only): {len(non_df)}")


# Group-median imputation for reTime and heatRate
for col in ["reTime","heatRate"]:
    grp = df.groupby(["bio","act"])[col].transform("median")
    df[col] = df[col].fillna(grp).fillna(df[col].median())

df = df.dropna(subset=["reTime","heatRate"]).copy()
print(f"Records after cleaning: {len(df)}")

# Calculate-by-difference (dry basis only: sum of 4 known in [90,100])
ELEM = ["C","H","O","N","S"]
def calc_diff(row):
    vals = {c: row[c] for c in ELEM}
    nulls = [c for c,v in vals.items() if pd.isna(v)]
    if len(nulls) != 1: return row
    known_sum = sum(v for v in vals.values() if not pd.isna(v))
    if not (90 <= known_sum <= 100): return row
    row = row.copy(); row[nulls[0]] = round(100.0 - known_sum, 4)
    return row
df = df.apply(calc_diff, axis=1)

# Build JS records
def js_val(v):
    if v is None or (isinstance(v, float) and (math.isnan(v) or math.isinf(v))): return "null"
    if isinstance(v, bool): return str(v).lower()
    if isinstance(v, str): return f'"{v.replace(chr(34), chr(92)+chr(34))}"'
    if isinstance(v, float): return str(round(v, 6))
    return str(v)

BIOMASS_ORDER = ["Bamboo","Banana straw","Coffee ground-based","Corn straw",
                 "Cotton straw","Pine sawdust powders","Pomelo peel","Sugarcane bagasse"]

# Track which groups needed full-fallback imputation
rt_was_null  = df["reTime"].isna()   # already filled, but track via original
hr_was_null  = df["heatRate"].isna()

records = []
for i, row in df.reset_index(drop=True).iterrows():
    rid = i + 1
    rec = {
        "id":             rid,
        "isothermId":     int(row["isotherm"]) if not pd.isna(row["isotherm"]) else None,
        "biomass":        row["bio"],
        "pyroTemp":       int(row["pyroTemp"]) if not pd.isna(row["pyroTemp"]) else None,
        "residenceTime":  round(float(row["reTime"]), 1),
        "heatingRate":    round(float(row["heatRate"]), 1),
        "activator":      row["act"],
        "activationType": row["atype"],
        "activationTemp": str(row["actTemp"]).strip() if not pd.isna(row["actTemp"]) else None,
        "blend":          row["blend"],
        "surfaceArea":    round(float(row["surface"]), 2) if not pd.isna(row["surface"]) else None,
        "poreVolume":     float(f"{float(row['pore']):.6g}") if not pd.isna(row["pore"]) else None,
        "adsorpTemp":     int(row["adsorpTemp"]) if not pd.isna(row["adsorpTemp"]) else None,
        "pressure":       round(float(row["pressure"]), 6) if not pd.isna(row["pressure"]) else None,
        "isIsotherm":     bool(row.get("_is_isotherm", True)),
        "co2Uptake":      round(float(row["co2"]), 4) if row["co2"] is not None and not pd.isna(row["co2"]) else None,
        "C_cha":          round(float(row["C"]), 2) if not pd.isna(row["C"]) else None,
        "H_cha":          round(float(row["H"]), 2) if not pd.isna(row["H"]) else None,
        "O_cha":          round(float(row["O"]), 2) if not pd.isna(row["O"]) else None,
        "N_cha":          round(float(row["N"]), 2) if not pd.isna(row["N"]) else None,
        "S_cha":          round(float(row["S"]), 2) if not pd.isna(row["S"]) else None,
    }
    records.append(rec)

def rec_to_js(rec):
    parts = []
    for k, v in rec.items():
        if v is None: parts.append(f"{k}: null")
        elif isinstance(v, bool): parts.append(f"{k}: {str(v).lower()}")
        elif isinstance(v, str):
            esc = v.replace("\\","\\\\").replace('"','\\"')
            parts.append(f'{k}: "{esc}"')
        elif isinstance(v, float) and (math.isnan(v) or math.isinf(v)):
            parts.append(f"{k}: null")
        else: parts.append(f"{k}: {v}")
    return "  { " + ", ".join(parts) + " }"

lines = [
    "// @ts-nocheck",
    "/**",
    " * BiocharHub - 44Database Full Records",
    " * Auto-generated from 44Database.xlsx by generate_database.py",
    f" * {len(records)} experimental isotherm data points | DO NOT EDIT MANUALLY",
    " * Imputation: group-median per (biomass, activator) for residenceTime & heatingRate",
    " */",
    "",
    "export const DB44_RECORDS = [",
]
for rec in records:
    lines.append(rec_to_js(rec) + ",")
lines[-1] = lines[-1].rstrip(",")
lines += [
    "];",
    "",
    "export const BIOMASS_LIST         = [...new Set(DB44_RECORDS.map(r => r.biomass))];",
    "export const ACTIVATOR_LIST       = [...new Set(DB44_RECORDS.map(r => r.activator))];",
    "export const ACTIVATION_TYPE_LIST = [...new Set(DB44_RECORDS.map(r => r.activationType))];",
    "export const BLEND_LIST           = [...new Set(DB44_RECORDS.map(r => r.blend))].sort();",
    "export const ADSORPTION_TEMP_LIST = [...new Set(DB44_RECORDS.map(r => r.adsorpTemp).filter(Boolean))].sort((a,b)=>a-b);",
    "export const PYRO_TEMP_LIST       = [...new Set(DB44_RECORDS.map(r => r.pyroTemp).filter(Boolean))].sort((a,b)=>a-b);",
    "",
    "export const BIOMASS_COLORS = {",
    "  'Corn straw':          '#3b82f6',",
    "  'Coffee ground-based': '#22c55e',",
    "  'Pine sawdust powders':'#a855f7',",
    "  'Bamboo':              '#f59e0b',",
    "  'Banana straw':        '#ec4899',",
    "  'Pomelo peel':         '#06b6d4',",
    "  'Sugarcane bagasse':   '#ef4444',",
    "  'Cotton straw':        '#84cc16',",
    "};",
    "",
    "export const BLEND_COLORS = {",
    "  'Non':     '#94a3b8',",
    "  '20PKBC':  '#f97316',",
    "  '20TKBC':  '#8b5cf6',",
    "  '0.5PKBC': '#fb923c',",
    "  '0.5TKBC': '#e879f9',",
    "};",
    "",
    "// Default filter state for the Database page",
    "export const DEFAULT_FILTERS = {",
    "  biomass: [], activator: [], activationType: [], blend: [], adsorpTemp: [],",
    "  surfaceAreaRange: [0, 3200], poreVolRange: [0, 1600],",
    "  co2Range: [0, 8], pyroTempRange: [300, 900], search: '',",
    "};",
    "",
    "export function parsePPRatio(blend) {",
    "  if (!blend || blend === 'Non') return null;",
    "  const m = String(blend).match(/^(\\d+(?:\\.\\d+)?)/);",
    "  return m ? Number(m[1]) : null;",
    "}",
    "",
    "export function isComposite(blend) {",
    "  return Boolean(blend && blend !== 'Non');",
    "}",
]

OUTPUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
size_kb = OUTPUT.stat().st_size / 1024
print(f"Wrote {OUTPUT}  ({size_kb:.0f} KB)  |  {len(records)} records")

# Export non-isotherm records to CSV for ml_01 to use (avoids double Excel read)
ML_OUT = Path("ML/outputs")
ML_OUT.mkdir(parents=True, exist_ok=True)
non_df.to_csv(ML_OUT / "non_isotherm_bet.csv", index=False)
print(f"Exported non-isotherm records: {len(non_df)}  →  ML/outputs/non_isotherm_bet.csv")
print("Done.")
