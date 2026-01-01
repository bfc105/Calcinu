import React, { useState } from "react";
import type { ToolProps } from "../types/tools";

const Settlement: React.FC<ToolProps> = ({
  domain,
  field,
  topic,
  tool,
}) => {
  const [n, setN] = useState<number>(10);
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/unordered_one_to_one", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain,
          field,
          topic,
          tool,
          input: n.toString(),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail);

      setResult(data.energy);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Simple fake curve for visualization
  const graphPoints = Array.from({ length: 20 }, (_, i) => ({
    x: i * 10,
    y: 100 - Math.exp(-i / 3) * 80,
  }));

  return (
    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
      
      {/* LEFT: INPUT */}
      <div style={{ flex: 1 }}>
        <h3>Input</h3>
        <label>
          Subintervals (n):
          <input
            type="number"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
        <br />
        <button onClick={handleCalculate} style={{ marginTop: "1rem" }}>
          Calculate
        </button>
      </div>

      {/* MIDDLE: OUTPUT */}
      <div style={{ flex: 1 }}>
        <h3>Settlement Result</h3>
        {loading && <p>Calculating...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {result !== null && (
          <p style={{ fontSize: "1.2rem" }}>
            Settlement ≈ <strong>{result.toFixed(5)}</strong>
          </p>
        )}
      </div>

      {/* RIGHT: GRAPH */}
      <div style={{ flex: 1 }}>
        <h3>Convergence (illustrative)</h3>
        <svg width="200" height="120" style={{ border: "1px solid #ccc" }}>
          {graphPoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={2} fill="blue" />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default Settlement;
