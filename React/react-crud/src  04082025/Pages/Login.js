import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/frontoffice');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8000/api/login', {
        username: form.username,
        password: form.password

      });

     // const user = res.data.user;
      const user = res.data.user;
      // Save session data (in cookies/localStorage as needed)
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      Cookies.set('login_name', user.loginName);


      // Redirect based on role
      const role = user.roles[0]?.RoleName;
      localStorage.setItem('role', role);
      Cookies.set('role', role);
      if (role === 'FO' || role === 'FOE') {
        navigate('/frontoffice');
      } else if (role === 'BO' || role === 'BOV') {
        navigate('/backoffice');
      } else if (role === 'AD') {
        navigate('/admin');
      } else {
        alert('No valid role assigned');
      }

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
      <div className="container mt-5">
        <h3>Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Username</label>
            <input
                type="text"
                name="username"
                className="form-control"
                value={form.username}
                onChange={handleChange}
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
            />
          </div>

          <button className="btn btn-primary" type="submit">Login</button>
        </form>
      </div>
  );
}
