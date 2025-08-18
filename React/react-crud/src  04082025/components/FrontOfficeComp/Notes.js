import React from 'react';
import DataTable from 'react-data-table-component';

const columns = [
  { name: 'NoteID', selector: row => row.id, sortable: true },
  { name: 'QueryID', selector: row => row.complaintId, sortable: true },
  { name: 'NoteOn', selector: row => row.noteOn, sortable: true },
  { name: 'NoteBy', selector: row => row.noteBy, sortable: true }, // Assume already resolved from user table
  { name: 'QueryNote', selector: row => row.complaintNote },
  { name: 'NoteType', selector: row => row.noteType },
];

// Dummy data example
const data = [
  {
    id: 101,
    complaintId: 5001,
    noteOn: '2024-06-01',
    noteBy: 'John Doe',
    complaintNote: 'Caller requested follow-up.',
    noteType: 'Follow-Up',
  },
  {
    id: 102,
    complaintId: 5002,
    noteOn: '2024-06-02',
    noteBy: 'Sara Khan',
    complaintNote: 'Resolved with callback.',
    noteType: 'Resolution',
  },
];

export default function NotesTab() {
  return (
    <div className="card p-3 mt-3">
      <h5 className="mb-3">List</h5>

      <div className="row">
        {/* Left Card */}
        <div className="col-md-4">
          <div className="card p-3">
            <h6>Note Entry</h6>

            <div className="mb-3">
              <label className="form-label">Query ID</label>
              <input type="text" className="form-control form-control-sm" placeholder="Enter Query ID" />
            </div>

            <div className="mb-3">
              <label className="form-label">Note</label>
              <textarea className="form-control form-control-sm" rows="3" placeholder="Enter note"></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Note Type</label>
              <select className="form-select form-select-sm">
                <option value="">Select Type</option>
                <option value="Follow-Up">Follow-Up</option>
                <option value="Resolution">Resolution</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button className="btn btn-sm btn-primary w-100">Save Note</button>
          </div>
        </div>

        {/* Right Table */}
        <div className="col-md-8">
          <div className="card p-3">
            <h6>Notes Table</h6>
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
