import React, { useState } from 'react';

export default function AgentDashboardTab() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showData, setShowData] = useState(false);

  const queryStats = {
    total: 17,
    closed: 9,
    initiated: 3,
    approved: 2,
    refer: 3,
    completed: "None",
    corrected: "None",
    advised: "None",
  };

  const handleShow = () => {
    setShowData(true);
  };

  return (
    <div className="card p-3 mt-3" style={{ backgroundColor: "#ccc" }}>
      {/* Title */}
      <div className="text-center mb-3" style={{ backgroundColor: "#f9b36d", padding: "10px" }}>
        <h5 className="fw-bold text-primary m-0">My Queries History</h5>
      </div>

      <div className="row">
        {/* Date Pickers */}
        
        <div className="col-md-3">
           <div className="mb-2">
            <label className="form-label fw-bold">Date From :</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label className="form-label fw-bold">Date From :</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label className="form-label fw-bold">Date To :</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="form-control"
            />
          </div>
          <button onClick={handleShow} className="btn btn-light">Show</button>
        </div>

        {/* Stats Display */}
        <div className="col-md-9">
          {showData && (
            <div className="container">
              <div className="row mb-2 text-center fw-bold">
                <div className="col bg-warning py-2">Total :</div>
                <div className="col bg-warning py-2">{queryStats.total}</div>
                <div className="col bg-warning py-2">Closed :</div>
                <div className="col bg-warning py-2">{queryStats.closed}</div>
              </div>
              <div className="row mb-2 text-center fw-bold">
                <div className="col-3 bg-warning py-2">Initiated :</div>
                <div className="col-3 bg-warning py-2">{queryStats.initiated}</div>
                <div className="col-3 bg-warning py-2">Approved :</div>
                <div className="col-3 bg-warning py-2">{queryStats.approved}</div>
              </div>
              <div className="row mb-2 text-center fw-bold">
                <div className="col-3 bg-warning py-2">Refer :</div>
                <div className="col-3 bg-warning py-2">{queryStats.refer}</div>
                <div className="col-3 bg-warning py-2">Completed :</div>
                <div className="col-3 bg-warning py-2">{queryStats.completed}</div>
              </div>
              <div className="row mb-2 text-center fw-bold">
                <div className="col-3 bg-warning py-2">Corrected :</div>
                <div className="col-3 bg-warning py-2">{queryStats.corrected}</div>
                <div className="col-3 bg-warning py-2">Advised :</div>
                <div className="col-3 bg-warning py-2">{queryStats.advised}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* All Button */}
      <div className="text-end mt-3">
        <button className="btn btn-outline-primary">All</button>
      </div>
    </div>
  );
}
