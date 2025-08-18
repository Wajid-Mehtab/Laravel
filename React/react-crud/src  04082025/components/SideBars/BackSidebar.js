import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import avatar from '../../assets/avatar.png'; // Adjust path if needed

export default function BackSidebar({ onSelect, selectedTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState("backOffice");

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const handleMainMenuClick = (menuKey) => {
    setExpandedMenu((prev) => (prev === menuKey ? null : menuKey));
  };

  const handleSelect = (tab) => {
    onSelect(tab);
    closeSidebar();
  };

  const tabItems = [
    { tab: 'queries', label: 'Queries' },
    { tab: 'callerInfo', label: 'Caller Information' },
    { tab: 'agentdashboard', label: 'Agent Dashboard' },
    { tab: 'dashboard', label: 'Dashboard' },
    { tab: 'advocateInfo', label: 'Advocate Performance' },
    { tab: 'detail', label: 'Detail' },
    { tab: 'queryhistory', label: 'Query History' },
    { tab: 'notes', label: 'Notes' }
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="btn btn-primary d-md-none m-2" onClick={toggleSidebar}>
        ☰ Menu
      </button>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <div className={`custom-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="p-3">

          {/* Mobile Close */}
          <button className="btn btn-sm btn-danger d-md-none mb-2" onClick={closeSidebar}>
            ✕
          </button>

          {/* Avatar Dropdown */}
          <div className="dropdown mb-3 text-center">
            <a
              className="d-flex align-items-center justify-content-center text-decoration-none dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src={avatar}
                alt="User Avatar"
                className="w-px-40 h-auto rounded-circle me-2"
                width="40"
                height="40"
              />
              <strong className="d-none d-md-inline">Admin</strong>
            </a>
            <ul className="dropdown-menu text-small shadow w-100 mt-1">
              <li className="px-3 py-2">
                <h6 className="mb-0">Admin</h6>
                <small className="text-muted">Admin</small>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li><Link className="dropdown-item" to="#"><i className="bx bx-user me-2"></i> My Profile</Link></li>
              <li><Link className="dropdown-item" to="#"><i className="bx bx-cog me-2"></i> Admin</Link></li>
              <li><Link className="dropdown-item" to="/FrontOffice"><i className="bx bx-credit-card me-2"></i> Front Office <span className="badge bg-danger ms-2">4</span></Link></li>
              <li><Link className="dropdown-item" to="/backoffice"><i className="bx bx-credit-card me-2"></i> Back Office <span className="badge bg-danger ms-2">8</span></Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li><Link className="dropdown-item" to="/logout"><i className="bx bx-power-off me-2"></i> Log Out</Link></li>
            </ul>
          </div>

          {/* Back Office Menu */}
          <div>
            <button
              className="btn w-100 text-start mb-2"
              onClick={() => handleMainMenuClick("backOffice")}
            >
              Back Office
            </button>

            {expandedMenu === "backOffice" && (
              <ul className="nav flex-column ps-3">
                {tabItems.map(({ tab, label }) => (
                  <li className="nav-item" key={tab}>
                    <button
                      className={`nav-link btn btn-link text-start w-100 ${
                        selectedTab === tab ? 'active text-secondary fw-bold' : ''
                      }`}
                      onClick={() => handleSelect(tab)}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
