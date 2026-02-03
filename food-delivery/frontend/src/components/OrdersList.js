import React, { useState, useEffect } from "react";
import { getAllOrders, deleteOrder } from "../api";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders();
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (loading) return <div className="card"><p style={{ color: "#7f8c8d" }}>Loading orders…</p></div>;

  return (
    <div className="card">
      <h2>📦 All Orders</h2>

      {orders.length === 0 ? (
        <div className="empty-state">No orders found. Add one above!</div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Restaurant</th>
              <th>Items</th>
              <th>Distance (km)</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td><strong>#{order.orderId}</strong></td>
                <td>{order.restaurantName}</td>
                <td>{order.itemCount}</td>
                <td>{order.deliveryDistance.toFixed(1)}</td>
                <td>
                  <span className={`badge ${order.paid ? "badge-paid" : "badge-unpaid"}`}>
                    {order.paid ? "Paid" : "Unpaid"}
                  </span>
                </td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(order.orderId)}>
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersList;
