import { Routes, Route, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./App.css";
import ToolPage from "./ToolPage";

// ---- DYNAMIC IMPORTS ----
const toolModules = import.meta.glob("./components/*.tsx", { eager: true });
const toolMap: Record<string, React.ComponentType<any>> = {};
Object.entries(toolModules).forEach(([path, module]: any) => {
  const name = path.split("/").pop()?.replace(".tsx", "");
  if (name) toolMap[name.toLowerCase()] = module.default;
});

// ---- TYPES ----
interface ComponentStructure {
  [componentName: string]: string[];
}

// ---- APP COMPONENT ----
function App() {
  const [components, setComponents] = useState<ComponentStructure | null>(null);
  const navigate = useNavigate();

  // Fetch JSON mapping
  useEffect(() => {
    fetch("/resources/tool_paths.json")
      .then((res) => res.json())
      .then((data) => setComponents(data));
  }, []);

  // Group components by domain, field and topic
  const grouped: { [domain: string]: { [field: string]: { [topic: string]: string[] } } } = {};
  if (components) {
    Object.entries(components).forEach(([name, path]) => {
      if (path.length >= 3) {
        const domain = path[0];
        const field = path[1];
        const topic = path[2];
        if (!grouped[domain]) grouped[domain] = {};
        if (!grouped[domain][field]) grouped[domain][field] = {};
        if (!grouped[domain][field][topic]) grouped[domain][field][topic] = [];
        grouped[domain][field][topic].push(name);
      }
    });
  }

  // ---- MAIN PAGE LAYOUT ----
  const MainPage = () => (
    <div className="app">
      <h1 className="app-title">Universal Tools & Calculators</h1>
      <hr className="app-divider" />

      <div className="domains-container">
        {components &&
          Object.entries(grouped).map(([domain, fields]) => (
            <section key={domain} className="domain-section">
              <h2 className="domain-title">{domain}</h2>

              <div className="domain-grid">
                {Object.entries(fields).map(([field, topics]) => (
                  <section key={field} className="field-section">
                    <h3 className="field-title">{field}</h3>

                    {Object.entries(topics).map(([topic, names]) => (
                      <div key={topic} className="topic-section">
                        <h4 className="topic-title">{topic}</h4>
                        <ul className="component-list">
                          {names.map((name) => (
                            <li key={name} className="component-item">
                              <button
                                className="component-button"
                                onClick={() =>
                                  navigate(`${domain.toLowerCase()}/${field.toLowerCase()}/${topic.toLowerCase()}/${name.toLowerCase()}`)
                                }
                              >
                                {name
                                  .split("_")
                                  .map(
                                    (w) => w.charAt(0).toUpperCase() + w.slice(1)
                                  )
                                  .join(" ")}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </section>
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );



  // ---- ROUTES ----
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route
        path="/:domain/:field/:topic/:toolName" 
        element={<ToolPage toolMap={toolMap} />}
      />
    </Routes>
  );
}

export default App;
