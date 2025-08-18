import React from "react";
import Navbar from './components/NavbarComp/Navbar.js';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import logo from "./assets/avatar.png";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import Frontoffice from './Pages/Frontoffice';      // Home page
import Backoffice from './Pages/Backoffice';        // Backoffice page
import ErrorBoundary from "./Pages/ErrorBoundary";  // Error boundary
import Login from './Pages/Login.js';               // Login page (fix the casing!)
import Logout from './Pages/Logout';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Navbar appName="Call Center CMS" logo={logo} />
        <Routes>
          {/* Default/Home Route */}
          <Route path="/" element={<Login />} />

          {/* Explicit Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/backoffice" element={<Backoffice />} />
          <Route path="/frontoffice" element={<Frontoffice />} />

          {/* You can add a NotFound page here if needed */}
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
