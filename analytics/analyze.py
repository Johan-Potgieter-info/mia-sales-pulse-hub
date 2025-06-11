import json
from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

DOCS_DIR = Path(__file__).resolve().parent / "documents"


def load_data() -> pd.DataFrame:
    files = list(DOCS_DIR.glob("*.json"))
    if not files:
        print("No JSON files found in documents directory.")
        return pd.DataFrame()
    frames = []
    for file in files:
        with open(file, "r") as f:
            frames.append(pd.json_normalize(json.load(f)))
    return pd.concat(frames, ignore_index=True)


def main() -> None:
    df = load_data()
    if df.empty:
        print("No data loaded for analysis.")
        return
    if {"month", "revenue"}.issubset(df.columns):
        plt.figure(figsize=(10, 6))
        sns.barplot(data=df, x="month", y="revenue", color="skyblue")
        plt.title("Revenue by Month")
        plt.tight_layout()
        out_path = DOCS_DIR / "revenue_by_month.png"
        plt.savefig(out_path)
        print(f"Saved visualisation to {out_path}")
    else:
        print("Required columns 'month' and 'revenue' not found in data.")


if __name__ == "__main__":
    main()
