import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

/** Columns EXACTLY as you requested */
const columns = [
  { name: 'NoteID',    selector: row => row.id,           sortable: true },
  { name: 'QueryID',   selector: row => row.complaintId,  sortable: true },
  { name: 'NoteOn',    selector: row => row.noteOn,       sortable: true },
  { name: 'NoteBy',    selector: row => row.noteBy,       sortable: true },
  { name: 'QueryNote', selector: row => row.complaintNote },
  { name: 'NoteType',  selector: row => row.noteType      },
];

/** Small helper for JSON fetches (used for /note-types, etc.) */
async function safeJsonFetch(url, init) {
  const res  = await fetch(url, init);
  const text = await res.text();
  const ct   = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) throw new Error(text || 'Non-JSON');
  return JSON.parse(text);
}

const Api = {
  getComplaintNotes: (qid) =>
      safeJsonFetch(`${API_BASE}/complaints/${encodeURIComponent(qid)}/notes`),
  getNoteTypes: () =>
      safeJsonFetch(`${API_BASE}/note-types`),
};

export default function NotesTab({ queryId, currentUserId }) {
  const [data, setData] = useState([]);          // table rows
  const [loading, setLoading] = useState(false); // page loader
  const [error, setError] = useState('');

  // left-form state
  const [form, setForm] = useState({
    qidInput: '',  // manual override; defaults from prop queryId
    note: '',
    noteType: '',
  });

  // dropdown options from backend
  const [noteTypeOptions, setNoteTypeOptions] = useState([]);

  /** keep qid input in sync with prop */
  useEffect(() => {
    setForm(f => ({ ...f, qidInput: queryId ? String(queryId) : '' }));
  }, [queryId]);

  /** effective QID (manual input > prop) */
  const effectiveQid = useMemo(
      () => (form.qidInput || queryId || '').toString().trim(),
      [form.qidInput, queryId]
  );

  /** load table rows */
  const loadNotes = async () => {
    if (!effectiveQid) {
      setData([]);
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res  = await axios.get(`${API_BASE}/complaints/${encodeURIComponent(effectiveQid)}/notes`);
      const rows = Array.isArray(res?.data?.data) ? res.data.data : [];

      // map server → table row shape expected by your columns
      const mapped = rows.map(r => ({
        id:            r.NoteID,     // NoteID → id
        complaintId:   r.QueryID,    // QueryID → complaintId
        noteOn:        r.NoteOn,
        noteBy:        r.NoteBy,
        complaintNote: r.QueryNote,  // QueryNote → complaintNote
        noteType:      r.NoteType,
      }));

      setData(mapped);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load notes');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  /** fetch notes whenever effective QID changes */
  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveQid]);

  /** load note types once */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const j = await Api.getNoteTypes();
        if (!alive) return;
        const opts = Array.isArray(j?.data) ? j.data : [];
        setNoteTypeOptions(opts);
      } catch (e) {
        console.warn('Failed to load note types', e);
      }
    })();
    return () => { alive = false; };
  }, []);

  /** save note → POST then reload */
  const handleSaveNote = async () => {
    const qid = effectiveQid;
    if (!qid) {
      setError('Please enter a valid Query ID.');
      return;
    }
    if (!form.note.trim()) {
      setError('Note is required.');
      return;
    }
    if (!form.noteType) {
      setError('Please select a note type.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await axios.post(`${API_BASE}/complaints/${encodeURIComponent(qid)}/notes`, {
        note: form.note,
        noteType: form.noteType,
        noteBy: currentUserId, // or let backend infer from auth
      });
      setForm(f => ({ ...f, note: '', noteType: '' }));
      await loadNotes();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="card p-3 mt-3">
        <h5 className="mb-3">List</h5>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {loading && <div className="text-muted small mb-2">Loading…</div>}

        <div className="row">
          {/* Left Card */}
          <div className="col-md-4">
            <div className="card p-3">
              <h6>Note Entry</h6>

              <div className="mb-3">
                <label className="form-label">Query ID</label>
                <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Enter Query ID"
                    value={form.qidInput}
                    onChange={e => setForm(f => ({ ...f, qidInput: e.target.value }))}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Note</label>
                <textarea
                    className="form-control form-control-sm"
                    rows="3"
                    placeholder="Enter note"
                    value={form.note}
                    onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Note Type</label>
                <select
                    className="form-select form-select-sm"
                    value={form.noteType}
                    onChange={e => setForm(f => ({ ...f, noteType: e.target.value }))}
                >
                  <option value="">--Select Note Type--</option>
                  {noteTypeOptions.map((v, idx) => (
                      <option key={idx} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <button
                  className="btn btn-sm btn-primary w-100"
                  onClick={handleSaveNote}
                  disabled={loading}
              >
                Save Note
              </button>
            </div>
          </div>

          {/* Right Table */}
          <div className="col-md-8">
            <div className="card p-3">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Notes Table</h6>
                <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={loadNotes}
                    disabled={loading || !effectiveQid}
                    title={effectiveQid ? `Reload notes for ${effectiveQid}` : 'Enter Query ID'}
                >
                  Refresh
                </button>
              </div>

              <DataTable
                  columns={columns}
                  data={data}
                  pagination
                  responsive
                  highlightOnHover
                  dense
              />
            </div>
          </div>
        </div>
      </div>
  );
}
