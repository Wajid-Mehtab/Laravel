// ViewHistory.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';

const API_BASE = 'http://localhost:8000/api';

// Table columns (what you asked for)
const columns = [
  { name: 'Date',   selector: row => row.date,   sortable: true },
  { name: 'Time',   selector: row => row.time,   sortable: true },
  { name: 'Agent',  selector: row => row.agent,  sortable: true },
  { name: 'Action', selector: row => row.action },
  { name: 'Details',selector: row => row.details },
];

/** ---------- small helpers ---------- */
function pad2(n) {
  const s = String(n);
  return s.length < 2 ? '0' + s : s;
}
function formatDateYYYYMMDD(d) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}
function formatTime12h(d) {
  let h = d.getHours();
  const m = pad2(d.getMinutes());
  const am = h < 12;
  h = h % 12 || 12;
  return `${pad2(h)}:${m} ${am ? 'AM' : 'PM'}`;
}

/**
 * Safe fetch that:
 *  - always reads as text first
 *  - checks content-type
 *  - parses JSON only if type is JSON
 *  - throws helpful errors with a preview of the body when non-JSON
 */
async function safeFetchJSON(url, init) {
  const res = await fetch(url, {
    // ensure Laravel returns JSON on exceptions too
    headers: { Accept: 'application/json', ...(init && init.headers) },
    ...init,
  });
  const text = await res.text();
  const ct = res.headers.get('content-type') || '';

  // Quick debug in console if needed
  // console.log('HISTORY RAW', res.status, ct, text.slice(0, 300));

  if (!ct.includes('application/json')) {
    const preview = text.slice(0, 200);
    throw new Error(`Non-JSON response (${res.status}). Body: ${preview}`);
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new Error(`Bad JSON: ${e.message}. Body: ${text.slice(0, 200)}`);
  }

  if (!res.ok) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }
  return json;
}

/** ---------- main component ---------- */
/**
 * Usage:
 *   <ViewHistoryTab queryId={detailForm?.QueryID} />
 */
export default function ViewHistoryTab({ queryId }) {
  const [data, setData]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // If you later add a manual input, keep this memo
  const effectiveQid = useMemo(
      () => (queryId || '').toString().trim(),
      [queryId]
  );

  const abortRef = useRef(null);

  const loadHistory = async () => {
    if (!effectiveQid) {
      setData([]);
      setErr('');
      return;
    }

    try {
      setLoading(true);
      setErr('');

      // Abort previous in-flight request
      if (abortRef.current) abortRef.current.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      const url = `${API_BASE}/Search-history/${encodeURIComponent(effectiveQid)}/history`;
      const json = await safeFetchJSON(url, { signal: ac.signal });

      const rows = Array.isArray(json?.data) ? json.data : [];

      // Robust mapping: accept either curated keys from the controller
      // or raw History columns and compute locally.
      const mapped = rows.map((r, i) => {
        // Try curated values (from the Laravel controller we discussed)
        let date = r.DateOnly || '';
        let time = r.TimeAmPm || '';
        const agent =
            r.Agent ??
            r.FullName ??
            r.ModifiedBy ??
            '';

        const action =
            r.ActionText ??
            r.JobStatus ??
            r.Action ??
            r.Activity ??
            r.ActionTaken ??
            '';

        const details =
            r.DetailText ??
            r.Remarks ??
            r.Details ??
            r.Changes ??
            r.Comment ??
            '';

        // If backend didn’t send DateOnly/TimeAmPm, compute from ModifiedOn
        if ((!date || !time) && r.ModifiedOn) {
          const d = new Date(r.ModifiedOn);
          if (!date) date = formatDateYYYYMMDD(d);
          if (!time) time = formatTime12h(d);
        }

        return {
          date,
          time,
          agent,
          action: String(action || ''),
          details: String(details || ''),
          _modifiedOn: r.ModifiedOn || null,
          _rowIdx: i,
        };
      });

      setData(mapped);
    } catch (e) {
      // If aborted, ignore
      if (e.name === 'AbortError') return;
      setErr(e.message || 'Failed to load history');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveQid]);

  return (
      <div className="card p-3 mt-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">View History</h5>
          <button
              className="btn btn-sm btn-outline-secondary"
              onClick={loadHistory}
              disabled={loading || !effectiveQid}
              title={effectiveQid ? `Reload history for ${effectiveQid}` : 'No Query ID'}
          >
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>

        {!effectiveQid && (
            <div className="alert alert-warning py-2">
              No Query ID provided.
            </div>
        )}

        {err && <div className="alert alert-danger py-2">{err}</div>}

        <DataTable
            columns={columns}
            data={data}
            pagination
            responsive
            highlightOnHover
            dense
        />
      </div>
  );
}
