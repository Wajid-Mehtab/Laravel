import React from 'react';

export default function CallerInformationTab() {
  return (
    <div className="container-fluid mt-3">
  <div className="row">
    {/* Left Section */}
    <div className="col-md-6">
      <div className="card p-3 bg-light">
        <h6 className="fw-bold text-danger border-bottom pb-2 mb-3">
          Caller ID : <span className="text-dark">ID</span>
        </h6>

        {/* First Row */}
        <div className="row g-2 align-items-center">
          <div className="col-md-4">
            <label className="form-label">CLI :</label>
            <input className="form-control form-control-sm fw-bold" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Name :</label>
            <input className="form-control form-control-sm" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Province :</label>
            <input className="form-control form-control-sm" />
          </div>
        </div>

        {/* Second Row */}
        <div className="row g-2">
          <div className="col-md-4">
            <label className="form-label">Heard From :</label>
            <input className="form-control form-control-sm" />
          </div>
          <div className="col-md-4">
            <label className="form-label">District :</label>
            <input className="form-control form-control-sm" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Gender :</label>
            <input className="form-control form-control-sm" />
          </div>
        </div>

        {/* Third Row */}
        <div className="row g-2">
          <div className="col-md-4">
            <label className="form-label">Callback 2 :</label>
            <input className="form-control form-control-sm" />
          </div>
          <div className="col-md-4">
            <label className="form-label">City :</label>
            <input className="form-control form-control-sm" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Age :</label>
            <input className="form-control form-control-sm" />
          </div>
        </div>

        {/* Remarks */}
        <div className="row g-2 mt-2">
          <div className="col-12">
            <label className="form-label">Remarks :</label>
            <textarea className="form-control form-control-sm" rows="3" />
          </div>
        </div>
      </div>
    </div>

    {/* Right Section */}
    <div className="col-md-6">
      <div className="card p-3 bg-light">
        <h6 className="fw-bold text-danger border-bottom pb-2 mb-3">
          Additional Info
        </h6>

        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label">CNIC :</label>
            <input className="form-control form-control-sm" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Father/Husband :</label>
            <input className="form-control form-control-sm" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Religion :</label>
            <input className="form-control form-control-sm" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Country :</label>
            <input className="form-control form-control-sm" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Callback 1 :</label>
            <input className="form-control form-control-sm" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Salary :</label>
            <input className="form-control form-control-sm" />
          </div>
          <div className="col-12">
            <label className="form-label">Address :</label>
            <textarea className="form-control form-control-sm" rows="3" />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


  );
}
