import React from "react";
import { Link } from "react-router-dom";

import avatar from '../../assets/avatar.png';// Replace with correct path

export default function Navbar({ appName = "MyApp", navbarFull = true, navbarHideToggle = false }) {
  return (
    <nav className="navbar navbar-expand-xl navbar-light bg-light px-3 padding-top:0rem">
      {/* Brand (only on xl+) */}
      {navbarFull && (
        <div className="navbar-brand d-none d-xl-flex py-0 me-4">
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <span className="fw-bold">{appName}</span>
          </Link>
        </div>
      )}

      {/* Toggler for small screens */}
      {!navbarHideToggle && (
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      )}

      {/* Collapsible menu */}
      
    </nav>
  );
}
