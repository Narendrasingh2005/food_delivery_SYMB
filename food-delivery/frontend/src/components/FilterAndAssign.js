import React, { useState } from "react";
import { filterOrders, assignDelivery } from "../api";

const FilterAndAssign = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMaxDist, setFilterMaxDist] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(null);

  const [assignMaxDist, setAssignMaxDist] = useState("");
  const [assignResult, setAssignResult] = useState(null);

  const [filterLoading, setFilterLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);

  const handleFilter = async () => {
    setFilterLoading(true);
    try {
      const params = {};
      if (filterStatus === "paid") params.isPaid = true;
      if (filterStatus === "unpaid") params.isPaid = false;
      if (filterMaxDist) params.maxDistance = Number(filterMaxDist);

      const res = await filterOrders(params);
      setFilteredOrders(res.data);
    } catch (err) {
      console.error("Filter failed. Ensure backend is running on port 8083.", err);
    } finally {
      setFilterLoading(false);
    }
  };

  const handleClearFilter = () => {
    setFilterStatus("all");
    setFilterMaxDist("");
    setFilteredOrders(null);
  };

  // ─── Handle Assign Delivery ──────────────────────────────
  const handleAssign = async () => {
    if (!assignMaxDist || Number(assignMaxDist) <= 0) {
      setAssignResult({ type: "warning", message: "Enter a valid max distance." });
      return;
    }
    setAssignLoading(true);
    try {
      const res = await assignDelivery(Number(assignMaxDist));
      const data = res.data;
      if (data.order) {
        setAssignResult({ type: "success", message: data.message, order: data.order });
      } else {
        setAssignResult({ type: "info", message: data.message });
      }
    } catch (err) {
      setAssignResult({ type: "warning", message: "Server error. Is the backend running?" });
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <>
      {/* ── Filter Card ────────────────────────────────────── */}
      <div className="card">
        <h2>🔍 Filter Orders</h2>

        <div className="filter-bar">
          <div className="form-group">
            <label>Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          <div className="form-group">
            <label>Max Distance (km)</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              placeholder="e.g. 10"
              value={filterMaxDist}
              onChange={(e) => setFilterMaxDist(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" onClick={handleFilter} disabled={filterLoading}>
            {filterLoading ? "Filtering…" : "Apply Filter"}
          </button>

          <button className="btn btn-outline" onClick={handleClearFilter}>
            Clear
          </button>
        </div>

        {/* Filtered results table */}
        {filteredOrders !== null && (
          <div className="mt-12">
            <p style={{ fontSize: 13, color: "#7f8c8d", marginBottom: 8 }}>
              {filteredOrders.length} result{filteredOrders.length !== 1 ? "s" : ""} found
            </p>

            {filteredOrders.length === 0 ? (
              <div className="result-panel info">
                <span className="panel-title">No orders match your filter criteria.</span>
              </div>
            ) : (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Restaurant</th>
                    <th>Items</th>
                    <th>Distance (km)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td><strong>#{order.orderId}</strong></td>
                      <td>{order.restaurantName}</td>
                      <td>{order.itemCount}</td>
                      <td>{order.deliveryDistance.toFixed(1)} km</td>
                      <td>
                        {/* FIX: Use order.isPaid to match JSON from Spring Boot */}
                        <span className={`badge ${order.paid ? "badge-paid" : "badge-unpaid"}`}>
                          {order.paid ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* ── Assign Delivery Card ─────────────────────────── */}
      <div className="card">
        <h2>🚴 Assign Delivery</h2>
        <p style={{ fontSize: 13, color: "#7f8c8d", marginBottom: 14 }}>
          Enter a max distance. The system will assign the <strong>nearest unpaid order</strong> within that range.
        </p>

        <div className="filter-bar">
          <div className="form-group">
            <label>Max Distance (km)</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              placeholder="e.g. 10"
              value={assignMaxDist}
              onChange={(e) => setAssignMaxDist(e.target.value)}
            />
          </div>

          <button className="btn btn-secondary" onClick={handleAssign} disabled={assignLoading}>
            {assignLoading ? "Assigning…" : "Assign Delivery"}
          </button>
        </div>

        {assignResult && (
          <div className={`result-panel ${assignResult.type} mt-12`}>
            <div className="panel-title">
              {assignResult.type === "success" && "✓ "}
              {assignResult.type === "info" && "ℹ "}
              {assignResult.type === "warning" && "⚠ "}
              {assignResult.message}
            </div>

            {assignResult.order && (
              <div className="panel-detail">
                <div><strong>Order ID:</strong> #{assignResult.order.orderId}</div>
                <div><strong>Restaurant:</strong> {assignResult.order.restaurantName}</div>
                <div><strong>Items:</strong> {assignResult.order.itemCount}</div>
                <div><strong>Distance:</strong> {assignResult.order.deliveryDistance.toFixed(1)} km</div>
                <div><strong>Status:</strong> <span className="badge badge-paid">Paid / Assigned</span></div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FilterAndAssign;