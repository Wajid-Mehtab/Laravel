
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useSessionUser } from '../SessionContext';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useSessionUser();

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-forward if already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') navigate('/frontoffice');
  }, [navigate]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/login', {
        username: form.username,
        password: form.password,
      });

      const user = res?.data?.user || {};

      // Normalize shapes from your SQL/API
      const userId    = user.UserID ?? user.user_id ?? user.id ?? '';
      const loginName = user.LoginName ?? user.loginName ?? user.username ?? user.name ?? '';
      const fullName  = user.FullName ?? user.fullName ?? user.name ?? loginName;
      const roleName  =
          (Array.isArray(user.roles) && user.roles[0]?.RoleName) ||
          user.RoleName ||
          user.role ||
          '';

      if (!userId || !fullName) {
        throw new Error('Login succeeded but user payload is missing required fields.');
      }

      // ---- Save to SessionContext (sessionStorage under the hood) ----
      setUser({ userId, username: fullName, roleName });

      // ---- Legacy localStorage (used by getUsername, etc.) ----
      localStorage.setItem(
          'user',
          JSON.stringify({
            UserID: userId,
            UserName: loginName,
            FullName: fullName,
            RoleName: roleName,
          })
      );
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', roleName);

      // ---- Cookies (if you still need them) ----
      Cookies.set('login_name', loginName || fullName);
      Cookies.set('role', roleName);

      // ---- Navigate by role ----
      const role = roleName?.toUpperCase();
      if (role === 'FO' || role === 'FOE') {
        navigate('/frontoffice');
      } else if (role === 'BO' || role === 'BOV') {
        navigate('/backoffice');
      } else if (role === 'AD') {
        navigate('/admin');
      } else {
        // Fallback to frontoffice if role missing/unknown
        navigate('/frontoffice');
      }
    } catch (err) {
      const msg =
          err?.response?.data?.error ||
          err?.message ||
          'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container mt-5" style={{ maxWidth: 480 }}>
        <h3 className="mb-3">Login</h3>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Username</label>
            <input
                type="text"
                name="username"
                className="form-control"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>
      </div>
  );
}
