import React, { useState, useCallback } from "react";
import "./App.css";
import AddOrder       from "./components/AddOrder";
import OrdersList     from "./components/OrdersList";
import FilterAndAssign from "./components/FilterAndAssign";

const TABS = [
  { id: "add",    label: "Add Order" },
  { id: "list",   label: "View Orders" },
  { id: "filter", label: "Filter & Assign" },
];

function App() {
  const [activeTab, setActiveTab] = useState("add");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOrderAdded = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <>
      {/* ── Navbar ─────────────────────────────────────── */}
      <div className="navbar">
        <span className="logo-icon">🍔</span>
        <h1>Food Delivery Order Manager</h1>
      </div>

      {/* ── Tab bar ────────────────────────────────────── */}
      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Content ────────────────────────────────────── */}
      <div className="content">
        {activeTab === "add" && (
          <>
            <AddOrder onOrderAdded={handleOrderAdded} />
            {/* Show the list below the form on the same tab for convenience */}
            <OrdersList key={refreshKey} />
          </>
        )}

        {activeTab === "list" && (
          <OrdersList key={refreshKey} />
        )}

        {activeTab === "filter" && (
          <FilterAndAssign />
        )}
      </div>
    </>
  );
}

export default App;
