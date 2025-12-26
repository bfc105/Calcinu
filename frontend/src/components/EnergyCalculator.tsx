import React, { useState } from "react";

const EnergyCalculator: React.FC = () => {
  const [mass, setMass] = useState<number>(1);
  const [energy, setEnergy] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setEnergy(null);
    try {
      const response = await fetch("http://localhost:8000/calculate/energy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mass }),
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
      <label>
        Mass (kg):
        <input
          type="number"
          value={mass}
          onChange={(e) => setMass(parseFloat(e.target.value))}
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
