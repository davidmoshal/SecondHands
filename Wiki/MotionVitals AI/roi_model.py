"""Illustrative one-repeat cost model. No third-party dependencies.
Usage: python3 roi_model.py [input.json]
Defaults are hypothetical, not measured or quoted commercial values.
"""
import json
import math
import sys
from pathlib import Path


def calculate(x):
    required = {
        "participants", "visits_per_participant", "sites", "conventional_minutes",
        "automated_minutes", "staff_cost_per_hour", "conventional_repeat_rate",
        "automated_repeat_rate", "hardware_per_site", "software_per_study",
        "deployment_training_per_site", "validation_support_per_study",
    }
    if set(x) != required:
        raise ValueError("Input keys must exactly match roi_inputs.json")
    for key, value in x.items():
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or value < 0:
            raise ValueError(f"{key} must be a finite nonnegative number")
    for key in ("participants", "visits_per_participant", "sites"):
        if x[key] <= 0 or int(x[key]) != x[key]:
            raise ValueError(f"{key} must be a positive integer")
    for key in ("conventional_repeat_rate", "automated_repeat_rate"):
        if x[key] > 1:
            raise ValueError(f"{key} must be between 0 and 1")
    n = x["participants"] * x["visits_per_participant"]
    rate = x["staff_cost_per_hour"] / 60
    c = n * (1 + x["conventional_repeat_rate"]) * x["conventional_minutes"] * rate
    labor = n * (1 + x["automated_repeat_rate"]) * x["automated_minutes"] * rate
    nonlicense = x["sites"] * (x["hardware_per_site"] + x["deployment_training_per_site"]) + x["validation_support_per_study"]
    fixed = nonlicense + x["software_per_study"]
    total = labor + fixed
    delta = (c - labor) / n
    return {
        "assumptions": "USD; hypothetical inputs; at most one repeat; fixed sites at break-even",
        "scheduled_assessments": n,
        "conventional_total": round(c, 2),
        "automated_labor": round(labor, 2),
        "incremental_fixed_cost": round(fixed, 2),
        "motionvitals_total": round(total, 2),
        "savings": round(c - total, 2),
        "roi_percent": round(100 * (c - total) / total, 2) if total else None,
        "labor_saving_per_scheduled_assessment": round(delta, 2),
        "break_even_scheduled_assessments": math.ceil(fixed / delta) if delta > 0 else None,
        "break_even_software_fee_ceiling": round(c - labor - nonlicense, 2),
    }


if __name__ == "__main__":
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).with_name("roi_inputs.json")
    print(json.dumps(calculate(json.loads(path.read_text())), indent=2))
