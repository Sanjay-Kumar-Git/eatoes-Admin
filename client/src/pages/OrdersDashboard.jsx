import { useCallback, useEffect, useMemo, useState, memo } from "react";
import api from "../api";

const STATUS_OPTIONS = [
  "",
  "Pending",
  "Preparing",
  "Ready",
  "Delivered",
  "Cancelled",
];

const STATUS_BADGE = {
  Pending: "bg-warning text-dark",
  Preparing: "bg-info text-dark",
  Ready: "bg-primary",
  Delivered: "bg-success",
  Cancelled: "bg-danger",
};

function OrdersDashboard() {
  // -------------------------------
  // STATE
  // -------------------------------
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const limit = 5;

  // -------------------------------
  // HELPERS
  // -------------------------------
  const buildOrdersUrl = useCallback(() => {
    let url = `/api/orders?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${encodeURIComponent(status)}`;
    }
    return url;
  }, [page, status]);

  // -------------------------------
  // FETCH ORDERS
  // -------------------------------
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(buildOrdersUrl());
      setOrders(res.data.orders);
      setTotalPages(res.data.totalPages);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [buildOrdersUrl]);

  // -------------------------------
  // EFFECTS
  // -------------------------------
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // -------------------------------
  // UPDATE STATUS
  // -------------------------------
  const updateStatus = useCallback(
    async (orderId, newStatus) => {
      try {
        await api.patch(`/api/orders/${orderId}/status`, { status: newStatus });
        fetchOrders();
      } catch {
        alert("Failed to update status");
      }
    },
    [fetchOrders],
  );

  // -------------------------------
  // MEMOIZED ROWS
  // -------------------------------
  const renderedRows = useMemo(
    () =>
      orders.map((order) => (
        <tr key={order._id}>
          <td className="fw-semibold">{order.orderNumber}</td>
          <td>{order.customerName || "-"}</td>
          <td>{order.tableNumber || "-"}</td>
          <td className="fw-bold">₹{order.totalAmount}</td>
          <td>
            <span
              className={`badge ${
                STATUS_BADGE[order.status] || "bg-secondary"
              }`}
            >
              {order.status}
            </span>
          </td>
          <td>
            <select
              className="form-select form-select-sm"
              aria-label="Update order status"
              value={order.status}
              onChange={(e) => updateStatus(order._id, e.target.value)}
            >
              {STATUS_OPTIONS.filter((s) => s).map((s, idx) => (
                <option key={idx} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </td>
          <td>
            <button
              className="btn btn-sm btn-outline-info"
              onClick={() =>
                setExpandedOrder(expandedOrder === order._id ? null : order._id)
              }
              aria-expanded={expandedOrder === order._id}
            >
              {expandedOrder === order._id ? "Hide" : "View"}
            </button>
          </td>
        </tr>
      )),
    [orders, expandedOrder, updateStatus],
  );

  // -------------------------------
  // MEMOIZED DETAILS PANEL
  // -------------------------------
  const expandedPanel = useMemo(() => {
    const order = orders.find((o) => o._id === expandedOrder);

    if (!order) return null;

    return (
      <div key={order._id} className="card mb-3 shadow-sm">
        <div className="card-body">
          <h5 className="fw-semibold mb-3">
            Order Details — {order.orderNumber}
          </h5>

          <ul className="list-group">
            {order.items.map((item, idx) => (
              <li
                key={idx}
                className="list-group-item d-flex justify-content-between"
              >
                <span>
                  {item.menuItem?.name || "Item"} ×{item.quantity}
                </span>
                <span className="fw-semibold">
                  ₹{item.price * item.quantity}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }, [orders, expandedOrder]);

  return (
    <div>
      {/* DASHBOARD HEADER */}
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-semibold mb-0">Orders Dashboard</h2>
            <small className="text-muted">
              Track and manage customer orders
            </small>
          </div>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Filter by Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => {
                  setPage(1);
                  setStatus(e.target.value);
                }}
              >
                {STATUS_OPTIONS.map((s, idx) => (
                  <option key={idx} value={s}>
                    {s || "All Statuses"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* STATUS */}
      {loading && <div className="alert alert-info">Loading orders...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* TABLE PANEL */}
      <div className="card shadow-sm mb-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">Order #</th>
                  <th>Customer</th>
                  <th>Table</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Update</th>
                  <th className="pe-3">Details</th>
                </tr>
              </thead>
              <tbody>{renderedRows}</tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DETAILS PANEL */}
      {expandedPanel && (
        <div className="card shadow-sm mb-3">
          <div className="card-body">{expandedPanel}</div>
        </div>
      )}

      {/* PAGINATION */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-outline-secondary"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>

        <span className="fw-semibold">
          Page {page} of {totalPages}
        </span>

        <button
          className="btn btn-outline-secondary"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default memo(OrdersDashboard);
