import React, { useState } from "react";
import type { ToolProps } from "../types/tools";

const EnergyCalculator: React.FC<ToolProps> = ({
  domain,
  field,
  topic,
  tool,
}) => {
  const [mass, setMass] = useState<number>(1);
  const [energy, setEnergy] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setEnergy(null);

    console.log({
      domain,
      field,
      topic,
      tool,
      input: mass.toString(),
    });

    try {
      const response = await fetch("/api/unordered_one_to_one", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain,
          field,
          topic,
          tool,
          input: mass.toString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Server error");
      }

      const data = await response.json();
      setEnergy(data.energy);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <p style={{ opacity: 0.7 }}>
        Domain: {domain} / Field: {field} / Topic: {topic}
      </p>

      <label>
        Mass (kg):
        <input
          type="number"
          value={mass}
          onChange={(e) => setMass(Number(e.target.value))}
          style={{ marginLeft: "0.5rem" }}
        />
      </label>

      <button
        onClick={handleCalculate}
        style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
      >
        Calculate
      </button>

      {loading && <p>Calculating...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {energy !== null && <p>Energy: {energy}</p>}
    </div>
  );
};

export default EnergyCalculator;
