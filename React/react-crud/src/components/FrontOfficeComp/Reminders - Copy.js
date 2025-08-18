// src/components/FrontOfficeComp/Reminders.js
import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';

import { getUsername, inspectUsernameSources } from '../../utils';
// src/components/FrontOfficeComp/Reminders.js


const API_BASE = 'http://localhost:8000/api';

// ---------------- Helpers ----------------
const MAX_DESC = 1000;

function toDatetimeLocalMin(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d}T${hh}:${mm}`;
}
function isValidDate(value) {
  const dt = new Date(value);
  return !Number.isNaN(dt.getTime());
}
function sqlToDatetimeLocal(sqlLike) {
  if (!sqlLike) return '';
  const s = String(sqlLike).replace(' ', 'T');
  const dt = new Date(s);
  if (Number.isNaN(dt.getTime())) return s.slice(0, 16);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  const hh = String(dt.getHours()).padStart(2, '0');
  const mm = String(dt.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d}T${hh}:${mm}`;
}
function validate(form) {
  const errors = {};
  const desc = (form.description || '').trim();
  if (!desc) errors.description = 'Description is required.';
  else if (desc.length < 5) errors.description = 'Please write at least 5 characters.';
  else if (desc.length > MAX_DESC) errors.description = `Max ${MAX_DESC} characters allowed.`;

  if (!form.isDead) {
    if (!form.remTime) errors.remTime = 'Reminder date & time is required.';
    else if (!isValidDate(form.remTime)) errors.remTime = 'Invalid date & time.';
    else {
      const chosen = new Date(form.remTime).getTime();
      const oneMinuteFromNow = Date.now() + 60 * 1000;
      if (chosen < oneMinuteFromNow) errors.remTime = 'Please select a time at least 1 minute in the future.';
    }
  }
  return errors;
}

// -------------- Component ----------------

export default function RemindersTab({ createdBy: createdByProp }) {
  // Resolve the user's FULL NAME (prefer the prop from Frontoffice, else localStorage.user.FullName, else other fallbacks)
  const fullName = React.useMemo(() => {
    if (createdByProp && String(createdByProp).trim()) return String(createdByProp).trim();
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      return (
          u.FullName || u.fullName || // full name first
          u.UserName || u.LoginName || u.username || u.name || '' // fallbacks if you only stored login
      );
    } catch {
      return '';
    }
  }, [createdByProp]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const [form, setForm] = useState({
    description: '',
    remTime: '',
    isDead: false,
  });
  const [touched, setTouched] = useState({});
  const [submitMsg, setSubmitMsg] = useState('');
  const errors = useMemo(() => validate(form), [form]);
  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);
  const minDateTime = useMemo(() => toDatetimeLocalMin(), []);

  // ---- API calls ----
  async function loadReminders() {
    if (!fullName) {
      setErr('No username available (full name). Make sure you pass a full name from SessionContext or set localStorage.user.FullName.');
      setRows([]);
      return;
    }
    try {
      setLoading(true);
      setErr('');
      const url = new URL(`${API_BASE}/reminders`);
      url.searchParams.set('createdBy', fullName);    // ✅ send FULL NAME to backend
      const res = await fetch(url.toString());
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Failed to load reminders');
      setRows(Array.isArray(json?.data) ? json.data : []);
    } catch (e) {
      setErr(e.message || 'Failed to load reminders');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function createReminder() {
    const payload = {
      description: form.description.trim(),
      remTime: form.isDead ? null : form.remTime,
      isDead: !!form.isDead,
      createdBy: fullName,
    };
    const res = await fetch(`${API_BASE}/reminders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || 'Failed to create reminder');
    return json;
  }

  // ---- Handlers ----
  const markTouched = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    if (name === 'description') {
      setForm((f) => ({ ...f, description: value.slice(0, MAX_DESC) }));
    } else {
      setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ description: true, remTime: true, isDead: true });

    if (!isValid) {
      setSubmitMsg('Please fix the highlighted fields.');
      return;
    }
    if (!fullName) {
      setSubmitMsg('No username available; cannot create reminder.');
      return;
    }

    try {
      setLoading(true);
      setSubmitMsg('');
      await createReminder();
      setSubmitMsg('Reminder added.');
      setForm({ description: '', remTime: '', isDead: false });
      setTouched({});
      await loadReminders();
    } catch (e2) {
      setSubmitMsg(e2.message || 'Failed to add reminder.');
    } finally {
      setLoading(false);
    }
  };

  const handleRowDoubleClick = (row) => {
    setForm({
      description: row.description || '',
      remTime: row.remTime ? sqlToDatetimeLocal(row.remTime) : '',
      isDead: !!row.isDead,
    });
    setTouched({});
    setSubmitMsg('');
  };

  // ---- Columns ----
  const columns = [
    { name: 'Description', selector: (r) => r.description, sortable: true, wrap: true },
    { name: 'Created On', selector: (r) => r.createdOn, sortable: true, width: '140px' },
    { name: 'Created By', selector: (r) => r.fullName, width: '140px' },
    { name: 'Reminder Time', selector: (r) => r.remTime || '—', width: '170px' },
    { name: 'Is Dead', selector: (r) => (r.isDead ? 'Yes' : 'No'), width: '90px' },
  ];

  // ---- Effects ----
  useEffect(() => {
    loadReminders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName]);

  const descLen = form.description.length;

  return (
      <div className="row g-3 mt-3">
        {/* Left Card */}
        <div className="col-md-4">
          <div className="card p-3 h-100">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-3">Add Reminder</h5>
              <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={loadReminders}
                  disabled={loading}
              >
                Refresh
              </button>
            </div>

            {err && <div className="alert alert-danger py-2">{err}</div>}
            {submitMsg && (
                <div className={`alert ${submitMsg.includes('added') ? 'alert-success' : 'alert-warning'} py-2`}>
                  {submitMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Description */}
              <div className="mb-2">
                <label className="form-label">Description</label>
                <textarea
                    className={`form-control form-control-sm ${touched.description && errors.description ? 'is-invalid' : ''}`}
                    rows="3"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    onBlur={markTouched}
                    maxLength={MAX_DESC}
                    placeholder="What should we be reminded about?"
                />
                <div className="d-flex justify-content-between">
                  <small className="text-muted">{descLen} / {MAX_DESC}</small>
                  {touched.description && errors.description && (
                      <div className="invalid-feedback d-block">{errors.description}</div>
                  )}
                </div>
              </div>

              {/* Reminder Date & Time */}
              <div className="mb-2">
                <label className="form-label">Reminder Date & Time</label>
                <input
                    type="datetime-local"
                    className={`form-control form-control-sm ${touched.remTime && errors.remTime ? 'is-invalid' : ''}`}
                    name="remTime"
                    value={form.remTime}
                    onChange={handleChange}
                    onBlur={markTouched}
                    min={minDateTime}
                    disabled={form.isDead}
                />
                {form.isDead && (
                    <small className="text-muted">Disabled because “Is Dead” is checked.</small>
                )}
                {touched.remTime && errors.remTime && (
                    <div className="invalid-feedback d-block">{errors.remTime}</div>
                )}
              </div>

              {/* Is Dead */}
              <div className="form-check mb-2">
                <input
                    className="form-check-input"
                    type="checkbox"
                    name="isDead"
                    id="isDeadCheckbox"
                    checked={form.isDead}
                    onChange={handleChange}
                    onBlur={markTouched}
                />
                <label className="form-check-label" htmlFor="isDeadCheckbox">
                  Is Dead
                </label>
              </div>

              <div className="d-flex justify-content-between mt-3">
                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => alert('Wire this to your “send now” API if needed.')}
                >
                  Send Reminder
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading || !isValid || !fullName}>
                  {loading ? 'Saving…' : 'Add Reminder'}
                </button>
              </div>

              <hr />
              <div className="small text-muted">
                <div><strong>Created By:</strong> {fullName || <em>not set</em>}</div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Card */}
        <div className="col-md-8">
          <div className="card p-3 h-100">
            <h5 className="mb-3">Reminder List</h5>
            <DataTable
                columns={columns}
                data={rows}
                pagination
                responsive
                highlightOnHover
                dense
                progressPending={loading}
                onRowDoubleClicked={handleRowDoubleClick}
            />
            <small className="text-muted d-block mt-2">
              Tip: double-click a row to load its values into the form.
            </small>
          </div>
        </div>
      </div>
  );
}
