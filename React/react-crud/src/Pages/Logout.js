import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔒 Clear session or any stored login flag
    localStorage.clear();
    sessionStorage.clear();

    // ✅ Redirect to login
    navigate('/login');
  }, [navigate]);

  return null; // or a loader if you want
}