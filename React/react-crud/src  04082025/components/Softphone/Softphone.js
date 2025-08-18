import React, { useState } from 'react';

export default function Softphone() {
  const [sipNumber, setSipNumber] = useState('');
  const [status, setStatus] = useState('Disconnected');

  const handleCall = () => {
    if (sipNumber.trim() !== '') {
      setStatus(`Calling ${sipNumber}...`);
    } else {
      setStatus('Please enter a SIP number.');
    }
  };

  const handleHangup = () => {
    setStatus('Call Ended');
  };

  return (
    <div className="col-md-12 mb-4">
      <div className="card p-3 w-100">
        <fieldset className="border p-3" style={{ height: '250px' }}>
          <legend className="w-auto px-2">EBBADE Softphone</legend>

          <div id="softphone-status" className="mb-2">
            Status: <span id="sipStatus">{status}</span>
          </div>

          <input
            type="text"
            id="target"
            className="form-control mb-2"
            placeholder="Enter SIP number to call"
            value={sipNumber}
            onChange={(e) => setSipNumber(e.target.value)}
          />

          <button
            id="callBtn"
            className="btn btn-success me-2"
            onClick={handleCall}
          >
            Call
          </button>

          <button
            id="hangupBtn"
            className="btn btn-danger"
            onClick={handleHangup}
          >
            Hang Up
          </button>
        </fieldset>
      </div>
    </div>
  );
}