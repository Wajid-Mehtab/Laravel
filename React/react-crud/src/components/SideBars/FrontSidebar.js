import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Sidebar.css';
import avatar from '../../assets/avatar.png';

export default function FrontSidebar({ onSelect, selectedTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [role, setRole] = useState('');

  useEffect(() => {
    // Get role from localStorage or cookie
    const storedRole = localStorage.getItem('role') || Cookies.get('role');
    setRole(storedRole);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const handleMainMenuClick = (menuKey) => {
    setExpandedMenu((prev) => (prev === menuKey ? null : menuKey));
  };

  const handleSelect = (tab) => {
    onSelect(tab);
    closeSidebar();
  };

  const frontOfficeTabs = [
    { tab: 'callerInfo', label: 'Caller Information' },
    { tab: 'search', label: 'Search' },
    { tab: 'profile', label: 'Caller Profile' },
    { tab: 'dashboard', label: 'Dashboard' },
    { tab: 'list', label: 'List' },
    { tab: 'detail', label: 'Detail' },
    { tab: 'notes', label: 'Notes' },
    { tab: 'viewhistory', label: 'View History' },
    { tab: 'reminders', label: 'Reminders' },
    { tab: 'sendsms', label: 'Send SMS' },
  ];

  return (
      <>
        {/* Mobile Toggle Button */}
        <button className="btn btn-primary d-md-none m-2" onClick={toggleSidebar}>
          ☰ Menu
        </button>

        {/* Overlay on mobile */}
        {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

        {/* Sidebar Container */}
        <div className={`custom-sidebar ${isOpen ? 'open' : ''}`}>
          <div className="p-3">
            {/* Mobile Close */}
            <button className="btn btn-sm btn-danger d-md-none mt-2" onClick={closeSidebar}>
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
                <strong className="d-none d-md-inline">{role || 'User'}</strong>
              </a>
              <ul className="dropdown-menu text-small shadow w-100 mt-1">
                <li className="px-3 py-2">
                  <h6 className="mb-0">{role || 'User'}</h6>
                  <small className="text-muted">{role || 'Role'}</small>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="#"><i className="bx bx-user me-2"></i> My Profile</Link></li>
                <li><Link className="dropdown-item" to="#"><i className="bx bx-cog me-2"></i> Admin</Link></li>

                {/* Only show if Admin */}
                {role === 'AD' && (
                    <li><Link className="dropdown-item" to="/admin"><i className="bx bx-shield-quarter me-2"></i> Admin Panel</Link></li>
                )}

                {/* Show only if FO or FOE */}
                {(role === 'FO' || role === 'FOE') && (
                    <li><Link className="dropdown-item" to="/FrontOffice"><i className="bx bx-credit-card me-2"></i> Front Office</Link></li>
                )}

                {/* Show only if BO or BOV */}
                {(role === 'BO' || role === 'BOV') && (
                    <li><Link className="dropdown-item" to="/backoffice"><i className="bx bx-credit-card me-2"></i> Back Office</Link></li>
                )}

                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/logout"><i className="bx bx-power-off me-2"></i> Log Out</Link></li>
              </ul>
            </div>

            {/* Front Office Menu - Show only if FO or FOE */}
            {(role === 'FO' || role === 'FOE') && (
                <div>
                  <button
                      className="btn w-100 text-start mb-2"
                      onClick={() => handleMainMenuClick("frontOffice")}
                  >
                    Front Office
                  </button>

                  {expandedMenu === "frontOffice" && (
                      <ul className="nav flex-column ps-3">
                        {frontOfficeTabs.map(({ tab, label }) => (
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
            )}
          </div>
        </div>
      </>
  );
}
