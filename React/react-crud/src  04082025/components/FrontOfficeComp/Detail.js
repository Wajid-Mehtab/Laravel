import React from 'react';

export default function DetailTab() {
  return (
    <div className="container-fluid p-2">
      <div className="card p-3 shadow-sm rounded-3">
        <h5 className="mb-3">Query Details</h5>

        <div className="row g-1">
          {/* First Row */}
          <div className="col-md-2">
            <label className="form-label">Query ID:</label>
            <input className="form-control form-control-sm" />
          </div>
          <div className="col-md-2">
            <label className="form-label">Status:</label>
            <input className="form-control form-control-sm" value="Initiated" disabled />
          </div>
          <div className="col-md-2">
            <label className="form-label d-block">&nbsp;</label>
            <button className="btn btn-warning btn-sm w-100">Edited</button>
          </div>
          <div className="col-md-2">
            <label className="form-label">Launched By:</label>
            <input className="form-control form-control-sm" />
          </div>
          <div className="col-md-2">
            <label className="form-label">Accepted By:</label>
            <input className="form-control form-control-sm" />
          </div>

          {/* Second Row */}
          <div className="col-md-2">
            <label className="form-label">Launched On:</label>
            <input type="date" className="form-control form-control-sm" />
          </div>
          <div className="col-md-2">
            <label className="form-label">Accepted On:</label>
            <input type="date" className="form-control form-control-sm" />
          </div>

          {/* Categories */}
          <div className="col-md-3">
            <label className="form-label">Main Category:</label>
            <input className="form-control form-control-sm" />
          </div>
          <div className="col-md-3">
            <label className="form-label">Category:</label>
            <input className="form-control form-control-sm" />
          </div>
          <div className="col-md-3">
            <label className="form-label">Sub Category:</label>
            <input className="form-control form-control-sm" />
          </div>

          {/* Tags and FAQ */}
          <div className="col-md-3">
            <label className="form-label">Tags:</label>
            <select className="form-select form-select-sm">
              <option>-- Select --</option>
              <option>WRLMP</option>
              <option>MFL</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">FAQ:</label>
            <input className="form-control form-control-sm" />
          </div>

          {/* Query & Solution */}
          <div className="col-md-6">
            <label className="form-label">Query:</label>
            <textarea rows="2" className="form-control form-control-sm" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Solution:</label>
            <textarea rows="2" className="form-control form-control-sm" />
          </div>

          {/* Checkboxes & Dropdowns */}
          <div className="col-md-2">
            <div className="form-check mt-4">
              <input type="checkbox" className="form-check-input" id="referredTo" />
              <label htmlFor="referredTo" className="form-check-label">Referred To</label>
            </div>
          </div>
          <div className="col-md-2">
            <select className="form-select form-select-sm mt-4">
              <option>Department A</option>
              <option>Department B</option>
            </select>
          </div>
          <div className="col-md-2">
            <div className="form-check mt-4">
              <input type="checkbox" className="form-check-input" id="shortQuery" />
              <label htmlFor="shortQuery" className="form-check-label">Short Query</label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-check mt-4">
              <input type="checkbox" className="form-check-input" id="womenProperty" />
              <label htmlFor="womenProperty" className="form-check-label">Women Property</label>
            </div>
          </div>
          <div className="col-md-2">
            <label className="form-label">Priority:</label>
            <select className="form-select form-select-sm">
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          {/* Source and Help */}
          <div className="col-md-3">
            <label className="form-label">Source:</label>
            <select className="form-select form-select-sm bg-warning fw-bold">
              <option value="">Select Source</option>
              <option>Website</option>
              <option>Phone</option>
              <option>In-Person</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Further Help:</label>
            <select className="form-select form-select-sm bg-warning fw-bold">
              <option value="">Select Help</option>
              <option>NGO</option>
              <option>Lawyer</option>
              <option>Gov Department</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="col-12 text-end mt-3">
            <button className="btn btn-primary btn-sm me-2">Send SMS</button>
            <button className="btn btn-secondary btn-sm me-2">New Query</button>
            <button className="btn btn-info btn-sm me-2">View Notes</button>
            <button className="btn btn-success btn-sm me-2">Save</button>
            <button className="btn btn-warning btn-sm">Complete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
