import React, { useEffect, useMemo, useState } from 'react';

const API_BASE = 'http://localhost:8000/api';

// Pull agentId from SessionContext user (if you have one) or from storage.
// You can also pass agentId as a prop to override everything.
function resolveAgentId(agentIdProp) {
  if (agentIdProp != null && agentIdProp !== '') return String(agentIdProp);

  // 1) Session storage (your SessionContext writes here)
  try {
    const s = sessionStorage.getItem('user');
    if (s) {
      const u = JSON.parse(s);
      if (u?.userId != null && u.userId !== '') return String(u.userId);
    }
  } catch {} // ignore

  // 2) Legacy localStorage shape
  try {
    const l = localStorage.getItem('user');
    if (l) {
      const u = JSON.parse(l);
      if (u?.UserID != null && u.UserID !== '') return String(u.UserID);
    }
  } catch {} // ignore

  return '';
}

function todayYmd() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function isYmd(v) {
  return /^\d{4}-\d{2}-\d{2}$/.test(v);
}

// === Client-side validator mirroring Laravel rules ===
function validate({ agentId, from, to }) {
  const errors = {};

  // agentId: required|numeric
  if (agentId === '' || agentId == null) {
    errors.agentId = 'Agent is required.';
  } else if (!/^\d+$/.test(String(agentId))) {
    errors.agentId = 'Agent must be numeric.';
  }

  // from: required|date_format:Y-m-d|before_or_equal:today
  if (!from) {
    errors.from = 'From date is required.';
  } else if (!isYmd(from)) {
    errors.from = 'Invalid date format (use YYYY-MM-DD).';
  } else if (from > todayYmd()) {
    errors.from = "Date can't be greater than Today !";
  }

  // to: required|date_format:Y-m-d|before_or_equal:today|after_or_equal:from
  if (!to) {
    errors.to = 'To date is required.';
  } else if (!isYmd(to)) {
    errors.to = 'Invalid date format (use YYYY-MM-DD).';
  } else if (to > todayYmd()) {
    errors.to = "Date can't be greater than Today !";
  } else if (from && isYmd(from) && to < from) {
    errors.to = '"From" must be on or before "To".';
  }

  return errors;
}

export default function CallerProfileTab({ agentId: agentIdProp }) {
  const [agentId, setAgentId] = useState(resolveAgentId(agentIdProp));
  const [from, setFrom] = useState(todayYmd());
  const [to, setTo] = useState(todayYmd());

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState({});

  const [stats, setStats] = useState({
    total: 0,
    closed: 0,
    initiated: 0,
    completed: 0,
    approved: 0,
    corrected: 0,
    refer: 0,
    advised: 0,
  });

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  // run validation whenever inputs change
  useEffect(() => {
    setErrors(validate({ agentId, from, to }));
  }, [agentId, from, to]);

  async function fetchDashboard() {
    // final guard on client
    const e = validate({ agentId, from, to });
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    setApiError('');
    try {
      const url = new URL(`${API_BASE}/agent-dashboard-range`);
      url.searchParams.set('agentId', agentId);
      url.searchParams.set('from', from);
      url.searchParams.set('to', to);

      const res = await fetch(url.toString());
      const text = await res.text();

      if (!res.ok) {
        // Laravel validation -> 422 with JSON { message, errors }
        try {
          const j = JSON.parse(text);
          const msgs = j?.errors
              ? Object.values(j.errors).flat().join(' ')
              : j?.message || 'Request failed';
          throw new Error(msgs);
        } catch {
          throw new Error(text || 'Request failed');
        }
      }

      const json = JSON.parse(text);
      const d = json?.data || {};
      setStats({
        total: d.total ?? 0,
        closed: d.closed ?? 0,
        initiated: d.initiated ?? 0,
        completed: d.completed ?? 0,
        approved: d.approved ?? 0,
        corrected: d.corrected ?? 0,
        refer: d.refer ?? 0,
        advised: d.advised ?? 0,
      });
    } catch (err) {
      setApiError(err.message || 'Failed to load agent dashboard.');
      setStats({
        total: 0,
        closed: 0,
        initiated: 0,
        completed: 0,
        approved: 0,
        corrected: 0,
        refer: 0,
        advised: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
      <div className="card p-3 mt-3" style={{ backgroundColor: '#ccc' }}>
        <div className="text-center mb-3" style={{ backgroundColor: '#f9b36d', padding: '10px' }}>
          <h5 className="m-0 fw-bold" style={{ color: 'blue' }}>Current caller's history</h5>
        </div>

        {/* Filters */}
        <div className="row g-2 mb-3">
          <div className="col-md-3">
            <label className="form-label">Agent ID</label>
            <input
                type="text"
                className={`form-control form-control-sm ${errors.agentId ? 'is-invalid' : ''}`}
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                placeholder="e.g. 64"
            />
            {errors.agentId && <div className="invalid-feedback d-block">{errors.agentId}</div>}
          </div>

          <div className="col-md-3">
            <label className="form-label">From</label>
            <input
                type="date"
                className={`form-control form-control-sm ${errors.from ? 'is-invalid' : ''}`}
                value={from}
                max={todayYmd()}
                onChange={(e) => setFrom(e.target.value)}
            />
            {errors.from && <div className="invalid-feedback d-block">{errors.from}</div>}
          </div>

          <div className="col-md-3">
            <label className="form-label">To</label>
            <input
                type="date"
                className={`form-control form-control-sm ${errors.to ? 'is-invalid' : ''}`}
                value={to}
                max={todayYmd()}
                onChange={(e) => setTo(e.target.value)}
            />
            {errors.to && <div className="invalid-feedback d-block">{errors.to}</div>}
          </div>

          <div className="col-md-3 d-flex align-items-end">
            <button
                className="btn btn-primary btn-sm w-100"
                onClick={fetchDashboard}
                disabled={loading || !isValid}
                title={!isValid ? 'Fix validation errors first' : 'Search'}
            >
              {loading ? 'Searching…' : 'Search'}
            </button>
          </div>
        </div>

        {/* Server validation / errors */}
        {apiError && <div className="alert alert-danger py-2">{apiError}</div>}

        {/* Result grid (same layout you showed) */}
        <div className="container">
          <div className="row mb-2 text-center fw-bold">
            <div className="col bg-warning py-2">Total :</div>
            <div className="col bg-warning py-2">{stats.total}</div>
            <div className="col bg-warning py-2">Closed :</div>
            <div className="col bg-warning py-2">{stats.closed}</div>
          </div>

          <div className="row mb-2 text-center fw-bold">
            <div className="col bg-warning py-2">Initiated :</div>
            <div className="col bg-warning py-2">{stats.initiated || 'None'}</div>
            <div className="col bg-warning py-2">Completed :</div>
            <div className="col bg-warning py-2">{stats.completed || 'None'}</div>
          </div>

          <div className="row mb-2 text-center fw-bold">
            <div className="col bg-warning py-2">Approved :</div>
            <div className="col bg-warning py-2">{stats.approved || 'None'}</div>
            <div className="col bg-warning py-2">Corrected :</div>
            <div className="col bg-warning py-2">{stats.corrected || 'None'}</div>
          </div>

          <div className="row mb-2 text-center fw-bold">
            <div className="col bg-warning py-2">Refer :</div>
            <div className="col bg-warning py-2">{stats.refer || 'None'}</div>
            <div className="col bg-warning py-2">Advised :</div>
            <div className="col bg-warning py-2">{stats.advised || 'None'}</div>
          </div>
        </div>
      </div>
  );
}
