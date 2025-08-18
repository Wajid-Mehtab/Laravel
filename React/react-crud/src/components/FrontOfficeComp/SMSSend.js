import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

export default function SMSSendTab() {
  const [form, setForm] = useState({
    queryId: '',
    phoneNo: '',
    smsText: '',
    sendSMS: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('SMS Submit:', form);
  };

  const columns = [
    { name: 'SMSID', selector: row => row.smsId, sortable: true },
    { name: 'Query ID', selector: row => row.queryId, sortable: true },
    { name: 'Created On', selector: row => row.createdOn, sortable: true },
    { name: 'SMS', selector: row => row.sms }
  ];

  const data = [
    {
      smsId: '101',
      queryId: 'Q001',
      createdOn: '2025-06-25 10:30:00',
      sms: 'Your query has been received.'
    },
    {
      smsId: '102',
      queryId: 'Q002',
      createdOn: '2025-06-25 11:00:00',
      sms: 'We will call you back shortly.'
    }
  ];

  return (
    <div className="row g-3 mt-3">
      {/* Left Card - Form */}
      <div className="col-md-4">
        <div className="card p-3 h-100">
          <h5 className="mb-3">Send SMS</h5>
          <form onSubmit={handleSubmit}>
            <div className="row mb-2">
              <div className="col-md-6">
                <label className="form-label">Query ID</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="queryId"
                  value={form.queryId}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone No</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="phoneNo"
                  value={form.phoneNo}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* SMS Text Area */}
            <div className="mb-2">
              <label className="form-label">Write SMS</label>
              <textarea
                className="form-control form-control-sm"
                name="smsText"
                rows="3"
                value={form.smsText}
                onChange={handleChange}
                placeholder="Type your SMS here..."
              ></textarea>
            </div>

            {/* Send SMS Checkbox */}
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                name="sendSMS"
                checked={form.sendSMS}
                onChange={handleChange}
                id="sendSMSCheck"
              />
              <label className="form-check-label" htmlFor="sendSMSCheck">
                Send SMS
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-2">
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Right Card - Table */}
      <div className="col-md-8">
        <div className="card p-3 h-100">
          <h5 className="mb-3">SMS History</h5>
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
