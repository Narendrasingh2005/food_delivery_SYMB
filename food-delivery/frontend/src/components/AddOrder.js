import React, { useState } from "react";
import { createOrder } from "../api";

const AddOrder = ({ onOrderAdded }) => {
  const [form, setForm] = useState({
    restaurantName: "",
    itemCount: 1,
    isPaid: false,
    deliveryDistance: 1.0,
  });
  const [message, setMessage] = useState(null); // { type, text }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.restaurantName.trim()) {
      setMessage({ type: "warning", text: "Restaurant name is required." });
      return;
    }
    if (Number(form.itemCount) < 1) {
      setMessage({ type: "warning", text: "Item count must be at least 1." });
      return;
    }
    if (Number(form.deliveryDistance) <= 0) {
      setMessage({ type: "warning", text: "Delivery distance must be > 0." });
      return;
    }

    try {
      const payload = {
        restaurantName: form.restaurantName.trim(),
        itemCount: Number(form.itemCount),
        isPaid: form.isPaid,
        deliveryDistance: Number(form.deliveryDistance),
      };

      await createOrder(payload);

      setMessage({ type: "success", text: "Order added successfully!" });
      setForm({ restaurantName: "", itemCount: 1, isPaid: false, deliveryDistance: 1.0 });

      // Notify parent to refresh the list
      if (onOrderAdded) onOrderAdded();
    } catch (err) {
      setMessage({ type: "warning", text: "Failed to add order. Check if the server is running." });
    }
  };

  return (
    <div className="card">
      <h2>📝 Add New Order</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Restaurant Name</label>
            <input
              type="text"
              name="restaurantName"
              value={form.restaurantName}
              onChange={handleChange}
              placeholder="e.g. Pizza Palace"
            />
          </div>

          <div className="form-group" style={{ maxWidth: 110 }}>
            <label>Item Count</label>
            <input
              type="number"
              name="itemCount"
              value={form.itemCount}
              onChange={handleChange}
              min="1"
            />
          </div>

          <div className="form-group" style={{ maxWidth: 140 }}>
            <label>Distance (km)</label>
            <input
              type="number"
              name="deliveryDistance"
              value={form.deliveryDistance}
              onChange={handleChange}
              step="0.1"
              min="0.1"
            />
          </div>

          <div className="form-group" style={{ maxWidth: 100, justifyContent: "flex-end", paddingBottom: 6 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <input
                type="checkbox"
                name="isPaid"
                checked={form.isPaid}
                onChange={handleChange}
              />
              Paid
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-end" }}>
            + Add Order
          </button>
        </div>
      </form>

      {/* Result / feedback panel */}
      {message && (
        <div className={`result-panel ${message.type === "success" ? "success" : "warning"} mt-12`}>
          <span className="panel-title">
            {message.type === "success" ? "✓" : "⚠"} {message.text}
          </span>
        </div>
      )}
    </div>
  );
};

export default AddOrder;
