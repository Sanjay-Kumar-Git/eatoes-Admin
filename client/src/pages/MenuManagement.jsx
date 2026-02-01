import { useCallback, useEffect, useMemo, useState, memo } from "react";
import api from "../api";
import { useDebounce } from "../hooks/useDebounce";

const CATEGORIES = ["", "Appetizer", "Main Course", "Dessert", "Beverage"];

function MenuManagement() {
  // -------------------------------
  // STATE
  // -------------------------------
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    ingredients: "",
    preparationTime: "",
    imageUrl: "",
  });

  const debouncedSearch = useDebounce(search, 300);

  // -------------------------------
  // HELPERS
  // -------------------------------
  const buildMenuUrl = useCallback(() => {
    let url = "/api/menu";
    const params = [];

    if (category) params.push(`category=${category}`);
    if (availability !== "") params.push(`availability=${availability}`);

    return params.length ? `${url}?${params.join("&")}` : url;
  }, [category, availability]);

  // -------------------------------
  // FETCH MENU
  // -------------------------------
  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(buildMenuUrl());
      setMenu(res.data);
    } catch {
      setError("Unable to load menu items. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [buildMenuUrl]);

  // -------------------------------
  // SEARCH EFFECT
  // -------------------------------
  useEffect(() => {
    const runSearch = async () => {
      if (!debouncedSearch) {
        fetchMenu();
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(
          `/api/menu/search?q=${encodeURIComponent(debouncedSearch)}`,
        );
        setMenu(res.data);
      } catch {
        setError("Search failed. Please retry.");
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [debouncedSearch, fetchMenu]);

  // -------------------------------
  // FILTER EFFECT
  // -------------------------------
  useEffect(() => {
    fetchMenu();
  }, [category, availability, fetchMenu]);

  // -------------------------------
  // OPTIMISTIC TOGGLE
  // -------------------------------
  const toggleAvailability = useCallback(
    async (id, currentStatus) => {
      const snapshot = menu;

      setMenu((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isAvailable: !currentStatus } : item,
        ),
      );

      try {
        await api.patch(`/api/menu/${id}/availability`);
      } catch {
        setMenu(snapshot);
        alert("Update failed. Changes have been reverted.");
      }
    },
    [menu],
  );

  // -------------------------------
  // FORM HANDLING
  // -------------------------------
  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      ingredients: "",
      preparationTime: "",
      imageUrl: "",
    });
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const payload = {
          ...formData,
          price: Number(formData.price),
          preparationTime: Number(formData.preparationTime || 0),
          ingredients: formData.ingredients
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean),
        };

        await api.post("/api/menu", payload);
        setShowModal(false);
        resetForm();
        fetchMenu();
      } catch {
        alert("Failed to save menu item.");
      }
    },
    [formData, fetchMenu, resetForm],
  );

  // -------------------------------
  // DELETE
  // -------------------------------
  const deleteItem = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this item?")) return;

      try {
        await api.delete(`/api/menu/${id}`);
        fetchMenu();
      } catch {
        alert("Delete failed. Please try again.");
      }
    },
    [fetchMenu],
  );

  // -------------------------------
  // INITIAL LOAD
  // -------------------------------
  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  // -------------------------------
  // MEMOIZED GRID
  // -------------------------------
  const renderedMenu = useMemo(() => {
    if (!menu.length && !loading) {
      return (
        <div className="col-12">
          <div className="alert alert-secondary text-center">
            No menu items found.
          </div>
        </div>
      );
    }

    return menu.map((item) => (
      <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4" key={item._id}>
        <div className="card h-100 shadow-sm border-0">
          {/* IMAGE CONTAINER */}
          <div
            style={{
              height: "180px",
              overflow: "hidden",
              backgroundColor: "#f1f3f5",
            }}
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
                loading="lazy"
              />
            ) : (
              <div className="d-flex h-100 align-items-center justify-content-center text-muted">
                No Image
              </div>
            )}
          </div>

          {/* BODY */}
          <div className="card-body d-flex flex-column p-3">
            {/* TITLE + CATEGORY */}
            <div className="mb-2">
              <h6 className="fw-semibold mb-1 text-truncate">{item.name}</h6>
              <span className="badge bg-light text-dark">{item.category}</span>
            </div>

            {/* DESCRIPTION */}
            <p
              className="text-muted small mb-3"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.description || "No description provided"}
            </p>

            {/* PRICE + STATUS */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold fs-6">₹{item.price}</span>
              <span
                className={`badge ${
                  item.isAvailable ? "bg-success" : "bg-danger"
                }`}
              >
                {item.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>

            {/* ACTION BAR */}
            <div className="mt-auto d-flex justify-content-between gap-2">
              <button
                className="btn btn-sm btn-outline-warning w-100"
                onClick={() => toggleAvailability(item._id, item.isAvailable)}
              >
                Toggle
              </button>

              <button
                className="btn btn-sm btn-outline-danger w-100"
                onClick={() => deleteItem(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    ));
  }, [menu, loading, toggleAvailability, deleteItem]);

  return (
    <div>
      {/* DASHBOARD HEADER */}
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-semibold mb-0">Menu Management</h2>
            <small className="text-muted">
              Manage menu items and availability
            </small>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            + Add Item
          </button>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Search</label>
              <input
                className="form-control"
                placeholder="Search by name or ingredient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat || "All Categories"}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Availability</label>
              <select
                className="form-select"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option value="">All</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* STATUS */}
      {loading && <div className="alert alert-info">Loading menu items...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* GRID */}
      <div className="row">{renderedMenu}</div>

      {/* MODAL */}
      {showModal && (
        <div
          className="modal d-block bg-dark bg-opacity-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Add Menu Item</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowModal(false)}
                  />
                </div>

                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        required
                      >
                        <option value="">Select</option>
                        <option value="Appetizer">Appetizer</option>
                        <option value="Main Course">Main Course</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Beverage">Beverage</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Price (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Preparation Time (min)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        value={formData.preparationTime}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            preparationTime: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <input
                        className="form-control"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        Ingredients (comma separated)
                      </label>
                      <input
                        className="form-control"
                        value={formData.ingredients}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            ingredients: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Image URL</label>
                      <input
                        className="form-control"
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            imageUrl: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(MenuManagement);
