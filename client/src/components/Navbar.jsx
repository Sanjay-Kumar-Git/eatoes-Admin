import { memo, useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  const linkClass = useCallback(
    ({ isActive }) =>
      `nav-link px-3 ${
        isActive
          ? 'active fw-semibold text-warning'
          : 'text-light'
      }`,
    []
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container-fluid px-3">
        {/* Brand */}
        <NavLink
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          to="/"
          onClick={closeMenu}
        >
          <span
            className="d-inline-flex align-items-center justify-content-center bg-warning text-dark rounded-circle"
            style={{
              width: '32px',
              height: '32px',
              fontSize: '0.9rem'
            }}
          >
            EA
          </span>
          <span className="d-none d-sm-inline">
            Eatoes Admin
          </span>
        </NavLink>

        {/* Hamburger */}
        <button
          className="navbar-toggler border-0"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(prev => !prev)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div
          className={`collapse navbar-collapse ${
            open ? 'show' : ''
          }`}
        >
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={linkClass}
                onClick={closeMenu}
              >
                Menu
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/orders"
                className={linkClass}
                onClick={closeMenu}
              >
                Orders
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default memo(Navbar);
