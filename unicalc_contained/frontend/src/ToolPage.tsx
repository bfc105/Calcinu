import React from "react";
import { useParams, useNavigate } from "react-router-dom";

interface ToolPageProps {
  toolMap: Record<string, React.ComponentType<any>>;
}

const ToolPage: React.FC<ToolPageProps> = ({ toolMap }) => {
  const { toolName } = useParams<{ toolName: string }>();
  const navigate = useNavigate();

  if (!toolName) return <p>No tool selected</p>;

  const ToolComponent = toolMap[toolName];

  if (!ToolComponent) return <p>Tool not found: {toolName}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h1>{toolName.split("_").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")}</h1>
      <ToolComponent />
    </div>
  );
};

export default ToolPage;
