// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from './components/NavbarComp/Navbar.js';
import logo from "./assets/avatar.png";

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Frontoffice from './Pages/Frontoffice';
import Backoffice from './Pages/Backoffice';
import ErrorBoundary from "./Pages/ErrorBoundary";
import Login from './Pages/Login.js';
import Logout from './Pages/Logout';

// ✅ Make sure this file exists at src/session/SessionContext.js

import { SessionProvider } from './SessionContext';

function App() {
    return (
        <SessionProvider>
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
                    </Routes>
                </Router>
            </ErrorBoundary>
        </SessionProvider>
    );
}

export default App;
