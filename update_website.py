"""
BiocharHub — Master Update Script
Run this whenever you have new data or improved ML models.

Usage:
  python update_website.py           # full update (data + ML + export)
  python update_website.py --ml      # ML only (skip database regen)
  python update_website.py --export  # export only (skip training)
"""

import sys
import subprocess
from pathlib import Path

BASE = Path(__file__).parent

def run(script, label):
    print(f"\n{'='*55}")
    print(f"  {label}")
    print(f"{'='*55}")
    result = subprocess.run(
        [sys.executable, "-X", "utf8", str(BASE / script)],
        cwd=BASE
    )
    if result.returncode != 0:
        print(f"\n  ERROR in {script} — stopping.")
        sys.exit(1)
    print(f"  Done: {script}")

args = set(sys.argv[1:])
skip_db    = "--ml"     in args or "--export" in args
skip_train = "--export" in args

if not skip_db:
    run("generate_database.py",              "Step 1/4  Regenerate database44.js")

if not skip_train:
    run("ML/ml_01_property_estimator.py",    "Step 2/4  Train Property Estimator (BET + PV)")
    run("ML/ml_02_co2_estimator.py",         "Step 3/4  Train CO2 Estimator")

run("ML/ml_export_for_website.py",           "Step 4/4  Export ML predictions JSON")

print(f"\n{'='*55}")
print("  ALL DONE — website files updated:")
print("    src/lib/database44.js       (if regenerated)")
print("    ML/outputs/*.pkl            (if retrained)")
print("    src/lib/ml_predictions.json (always)")
print("  Vite hot-reloads automatically.")
print(f"{'='*55}\n")
