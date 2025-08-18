import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Softphone from '../components/Softphone';

export default function frontoffice1() {
  const [form, setForm] = useState({
    cli: "",
    lastName: "",
    email: "",
    district:"",
    cnic : "",
    fatherhusband: "",
    name: "",
    phoneNumber: "",
    address: "",
    age: "",
    city: "",
    province: "",
    country: "",
    heardfrom: "",
    language: "",
    timezone: "",
    currency: "",
    other1: '',
    other2: '',
    gender: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", form);
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4">Account Settings</h4>
      <div className="card mb-4">
  <div className="card-body">
    <div className="row">
      <div className="col-md-4 text-start">
        <strong>Caller:</strong> <span>{form.callerId || 'N/A'}</span>
      </div>
      <div className="col-md-4 text-center">
        <strong>Query ID:</strong> <span>{form.queryId || 'N/A'}</span>
      </div>
      <div className="col-md-4 text-end">
        <strong>Caller Name:</strong> <span>{form.callerName || 'N/A'}</span>
      </div>
    </div>
  </div>
</div>


      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* LEFT: FORM FIELDS */}
          <div className="col-md-8">
            <div className="row">
              {/* Left Side - First Name, Last Name, Email */}
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Cli</label>
                  <input className="form-control" name="cli" value={form.cli} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Age</label>
                  <input className="form-control" name="age" value={form.age} onChange={handleChange} />
                </div>
                  <div className="mb-3">
                    <label className="form-label">District</label>
                    <input className="form-control" name="district" value={form.district} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Cnic</label>
                    <input className="form-control" name="cnic" value={form.cnic} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                        <textarea className="form-control" name="address" value={form.address} onChange={handleChange} rows="4" />
                  </div>
                  
                
              </div>

              {/* Center Side - Remaining Fields */}
              <div className="col-md-8">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input className="form-control" name="name" value={form.name} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    <input className="form-control" name="gender" value={form.gender} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">City</label>
                    <input className="form-control" name="city" value={form.city} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Province</label>
                    <input className="form-control" name="province" value={form.province} onChange={handleChange} />
                  </div>
                
                   <div className="col-md-6">
                    <label className="form-label">Country</label>
                    <select className="form-select" name="country" value={form.country} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="pakistan">Pakistan</option>
                      <option value="india">India</option>
                      <option value="china">China</option>
                      <option value="iran">Iran</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                 
                  <div className="col-md-6">
                    <label className="form-label">Heard from</label>
                    <input className="form-control" name="heardfrom" value={form.heardfrom} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Father/Husband</label>
                    <input className="form-control" name="fatherhusband" value={form.fatherhusband} onChange={handleChange} />
                  </div>
                   <div className="col-md-6">
                    <label className="form-label">callback1</label>
                    <input className="form-control" name="callback1" value={form.callback1} onChange={handleChange} />
                  </div>
                  
                   <div className="col-md-6">
                    <label className="form-label">Salary</label>
                    <input className="form-control" name="salary" value={form.salary} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">CallBack 2</label>
                    <input className="form-control" name="callback2" value={form.callback2} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Reaion</label>
                    <input className="form-control" name="region" value={form.region} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Material State</label>
                    <input className="form-control" name="mstate" value={form.mstate} onChange={handleChange} />
                  </div>
                  
                
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: SOFTPHONE */}
          <div className="col-md-4">
            <div className="card p-3">
              <legend className="w-auto px-2">Softphone</legend>
              <Softphone />
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="text-center mt-4 mb-5">
          <button className="btn btn-primary" type="submit">Save Changes</button>
          <button
            type="reset"
            className="btn btn-outline-secondary ms-2"
            onClick={() => setForm({
              firstName: "",
              lastName: "",
              email: "",
              organization: "",
              phoneNumber: "",
              address: "",
              state: "",
              zipCode: "",
              country: "",
              language: "",
              timezone: "",
              currency: "",
              other1: '',
              other2: '',
              gender: '',
            })}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
