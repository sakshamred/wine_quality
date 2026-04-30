"use client";
import { useState } from "react";

/* ── helpers ─────────────────────────── */
function getVerdict(score: number): string {
  if (score <= 3) return "Questionable Vintage";
  if (score <= 5) return "A Decent Pour";
  if (score <= 7) return "Solid Choice";
  if (score <= 9) return "Exceptional Vintage";
  return "Liquid Perfection";
}

const FIELDS = [
  { key: "alcohol", label: "Alcohol %", hint: "Percentage by volume (ABV)" },
  {
    key: "fixed_acidity",
    label: "Fixed Acidity",
    hint: "g/dm³ of tartaric acid",
  },
  { key: "pH", label: "pH Level", hint: "Acidity scale 0 – 14" },
  { key: "sulphates", label: "Sulphates", hint: "g/dm³ of potassium sulphate" },
] as const;

/* generate bubbles once — stable across renders */
const BUBBLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: Math.random() * 90 + 18,
  left: Math.random() * 100,
  delay: Math.random() * 9,
  duration: Math.random() * 9 + 7,
}));

/* ── component ───────────────────────── */
export default function Home() {
  const [formData, setFormData] = useState({
    alcohol: 10.5,
    fixed_acidity: 7.4,
    pH: 3.3,
    sulphates: 0.65,
  });
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data.predicted_quality);
    } catch (err) {
      console.error("API Error:", err);
      alert("Failed to connect to the prediction server.");
    }
    setLoading(false);
  };

  return (
    <main className="wine-app">
      {/* ── Rising bubbles ── */}
      <div className="bubbles-container">
        {BUBBLES.map((b) => (
          <div
            key={b.id}
            className="bubble"
            style={{
              width: b.size,
              height: b.size,
              left: `${b.left}%`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
            }}
          />
        ))}
      </div>

      {/* ── Main card ── */}
      <div className="wine-card">
        {/* Header */}
        <div className="card-header">
          <div className="wine-icon-wrap">🍷</div>
          <h1 className="card-title">Wine Quality</h1>
          <p className="card-subtitle">Predict the essence of your bottle</p>
        </div>

        <div className="divider" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="wine-form">
          {FIELDS.map(({ key, label, hint }) => (
            <div key={key} className="field-group">
              <label className="field-label">{label}</label>
              <input
                type="number"
                step="0.01"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="field-input"
                required
              />
              <span className="field-hint">{hint}</span>
            </div>
          ))}

          <button type="submit" disabled={loading} className="predict-btn">
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" />
                Analyzing…
              </span>
            ) : (
              <span>Predict Quality ✦</span>
            )}
          </button>
        </form>

        {/* Result */}
        {result !== null && (
          <div className="result-panel">
            <p className="result-label">Classification Result</p>

            <div className="result-score">
              {result}
              <span className="result-denom">&thinsp;/ 10</span>
            </div>

            {/* Wine-glass rating */}
            <div className="wine-glasses">
              {Array.from({ length: 10 }, (_, i) => (
                <span
                  key={i}
                  className={`wine-glass-icon ${i < result ? "glass-filled" : "glass-empty"}`}
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  🍷
                </span>
              ))}
            </div>

            <p className="result-verdict">{getVerdict(result)}</p>

            {/* Score bar */}
            <div className="score-bar-wrap">
              <div className="score-bar" style={{ width: `${result * 10}%` }} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
