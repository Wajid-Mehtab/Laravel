import React from 'react';

export default function QueryForm() {
  return (
    <div className="container-fluid p-2">
      <div className="border p-2">
        <div className="row g-1">

          {/* Left Column */}
          <div className="col-md-6">
            <div className="row g-1">
              <div className="col-6">
                <label className="form-label">Query:</label>
                <input className="form-control form-control-sm fw-bold" placeholder="Query ID" />
              </div>
              <div className="col-6">
                <label className="form-label">Status:</label>
                <input className="form-control form-control-sm fw-bold" value="Initiated" disabled />
              </div>

              <div className="col-6">
                <label className="form-label">Launched By:</label>
                <input className="form-control form-control-sm" />
              </div>
              <div className="col-6">
                <label className="form-label">Accepted By:</label>
                <input className="form-control form-control-sm" />
              </div>

              <div className="col-6">
                <label className="form-label">Launched On:</label>
                <input type="date" className="form-control form-control-sm" />
              </div>
              <div className="col-6">
                <label className="form-label">Accepted On:</label>
                <input type="date" className="form-control form-control-sm" />
              </div>

              <div className="col-12">
                <label className="form-label">Main Category:</label>
                <input className="form-control form-control-sm" />
              </div>

              <div className="col-12">
                <label className="form-label">Category:</label>
                <input className="form-control form-control-sm" />
              </div>

              <div className="col-12">
                <label className="form-label">Sub Category:</label>
                <input className="form-control form-control-sm" />
              </div>

              <div className="col-12">
                <label className="form-label">Tags:</label>
                <select className="form-select form-select-sm">
                  <option>Select Tag</option>
                  <option>WRLMP</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">SMS:</label>
                <textarea className="form-control form-control-sm" rows="2" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            <div className="row g-1">
              <div className="col-12 text-end">
                <button className="btn btn-warning btn-sm fw-bold">Edited</button>
              </div>
              <div className="col-12">
                <label className="form-label">Query:</label>
                <textarea className="form-control form-control-sm" rows="3" />
              </div>
              <div className="col-12">
                <label className="form-label">Solution:</label>
                <textarea className="form-control form-control-sm" rows="3" />
              </div>

              {/* Checkboxes Row */}
              <div className="col-2">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="wp" />
                  <label className="form-check-label" htmlFor="wp">Women Property</label>
                </div>
              </div>
              <div className="col-2">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="covid" />
                  <label className="form-check-label" htmlFor="covid">COVID-19</label>
                </div>
              </div>
              <div className="col-2">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="adr" />
                  <label className="form-check-label" htmlFor="adr">ADR Query</label>
                </div>
              </div>
              <div className="col-2">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="womenRel" />
                  <label className="form-check-label" htmlFor="womenRel">Women Related</label>
                </div>
              </div>
              <div className="col-2">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="gbv" />
                  <label className="form-check-label" htmlFor="gbv">Gender Base Violence</label>
                </div>
              </div>
              <div className="col-1">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="age" />
                  <label className="form-check-label" htmlFor="age">Age &gt; 50</label>
                </div>
              </div>
              <div className="col-1">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="short" />
                  <label className="form-check-label" htmlFor="short">Short</label>
                </div>
              </div>

              {/* Dropdown and Tag */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Sindh Gov Department:</label>
                <select className="form-select form-select-sm bg-warning">
                  <option>Select</option>
                  <option>Social Welfare</option>
                  <option>Police</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Select Tags:</label>
                <select className="form-select form-select-sm">
                  <option>Select Tag</option>
                </select>
              </div>
            </div>
          </div>

          {/* Further Help & Buttons */}
          <div className="col-12 d-flex align-items-center mt-2">
            <label className="me-2">Further Help:</label>
            <input className="form-control form-control-sm w-25 me-3" />
            <button className="btn btn-outline-secondary btn-sm me-2">View Notes</button>
            <button className="btn btn-outline-secondary btn-sm me-2">Refer</button>
            <button className="btn btn-outline-danger btn-sm me-2">Close</button>
            <button className="btn btn-outline-success btn-sm me-2">Accept</button>
          </div>

          {/* Bottom Warning Bar */}
          <div className="col-12 mt-2">
            <div className="bg-dark text-white p-1 fw-bold">
              Warnings
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
