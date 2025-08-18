import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

export default function RemindersTab() {
  const [form, setForm] = useState({
    description: '',
    remTime: '',
    sendTo: '',
    isDead: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reminder Submitted:', form);
  };

  const columns = [
    { name: 'Description', selector: row => row.description, sortable: true },
    { name: 'Created On', selector: row => row.createdOn, sortable: true },
    { name: 'Created By', selector: row => row.createdBy },
    { name: 'Reminder Time', selector: row => row.remTime },
  ];

  const data = [
    {
      description: 'Call back after 1 hour',
      createdOn: '2025-06-25',
      createdBy: 'Admin',
      remTime: '2025-06-25 14:00:00'
    },
    {
      description: 'Follow up tomorrow',
      createdOn: '2025-06-24',
      createdBy: 'Support',
      remTime: '2025-06-26 10:00:00'
    }
  ];

  return (
    <div className="row g-3 mt-3">
      {/* Left Card */}
      <div className="col-md-4">
        <div className="card p-3 h-100">
          <h5 className="mb-3">Add Reminder</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="form-label">Description</label>
              <textarea
                className="form-control form-control-sm"
                rows="3"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Reminder Date & Time</label>
              <input
                type="datetime-local"
                className="form-control form-control-sm"
                name="remTime"
                value={form.remTime}
                onChange={handleChange}
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Send To</label>
              <select
                className="form-select form-select-sm"
                name="sendTo"
                value={form.sendTo}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="admin">Admin</option>
                <option value="support">Support</option>
                <option value="agent">Agent</option>
              </select>
            </div>

            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                name="isDead"
                checked={form.isDead}
                onChange={handleChange}
                id="isDeadCheckbox"
              />
              <label className="form-check-label" htmlFor="isDeadCheckbox">
                Is Dead
              </label>
            </div>

            <div className="d-flex justify-content-between mt-3">
              <button type="button" className="btn btn-outline-primary">
                Send Reminder
              </button>
              <button type="submit" className="btn btn-primary">
                Add Reminder
              </button>
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
            data={data}
            pagination
            responsive
            highlightOnHover
            dense
          />
        </div>
      </div>
    </div>
  );
}
