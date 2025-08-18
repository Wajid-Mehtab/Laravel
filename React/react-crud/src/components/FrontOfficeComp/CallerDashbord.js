import React, { useEffect, useState, useMemo } from 'react';
import { useSessionUser } from '../../SessionContext';

const API_BASE = 'http://localhost:8000/api';

export default function CallerDashbordTab() {
  const { user } = useSessionUser?.() ?? { user: null };

  // Prefer SessionContext; fallback to localStorage.user.UserID
  const agentId = useMemo(() => {
    if (user?.userId) return user.userId;
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      return u.UserID || u.userId || '';
    } catch {
      return '';
    }
  }, [user]);

  const [counts, setCounts] = useState({
    total: 0,
    initiated: 0,
    completed: 0,
    reviewed: 0,
    referred: 0,
    corrected: 0,
    advised: 0,
    closed: 0,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function loadDashboard() {
    if (!agentId || isNaN(Number(agentId))) {
      setErr('No valid agentId found in session/localStorage.');
      setCounts((c) => ({ ...c, total: 0 }));
      return;
    }
    try {
      setLoading(true);
      setErr('');
      const url = new URL(`${API_BASE}/agent-dashboard`);
      url.searchParams.set('agentId', String(agentId));
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.message || 'Failed to load agent dashboard');
      }
      setCounts(json.data || {});
    } catch (e) {
      setErr(e.message || 'Failed to load agent dashboard');
      setCounts({
        total: 0, initiated: 0, completed: 0, reviewed: 0,
        referred: 0, corrected: 0, advised: 0, closed: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId]);

  const Card = ({ title, value, variant = 'primary' }) => (
      <div className="col-sm-6 col-md-3 mb-3">
        <div className={`card border-${variant}`}>
          <div className={`card-body text-${variant}`}>
            <div className="fw-semibold small text-muted">{title}</div>
            <div className="fs-4">{value}</div>
          </div>
        </div>
      </div>
  );

  return (
      <div className="card p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">Agent Dashboard</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={loadDashboard} disabled={loading}>
            Refresh
          </button>
        </div>

        {err && <div className="alert alert-danger py-2">{err}</div>}
        {loading && <div className="text-muted mb-2">Loading…</div>}

        <div className="row">
          <Card title="Total" value={counts.total} variant="dark" />
          <Card title="Initiated" value={counts.initiated} variant="warning" />
          <Card title="Completed" value={counts.completed} variant="success" />
          <Card title="Reviewed (Approved)" value={counts.reviewed} variant="info" />
          <Card title="Referred" value={counts.referred} variant="secondary" />
          <Card title="Corrected" value={counts.corrected} variant="primary" />
          <Card title="Advised" value={counts.advised} variant="primary" />
          <Card title="Closed" value={counts.closed} variant="danger" />
        </div>
      </div>
  );
}
