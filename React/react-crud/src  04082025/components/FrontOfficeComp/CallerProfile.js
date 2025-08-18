import React from 'react';

export default function CallerProfileTab() {
  const history = {
    total: 3,
    closed: 2,
    initiated: "None",
    completed: "None",
    approved: "None",
    corrected: "None",
    refer: 1,
    advised: "None"
  };

  return (
    <div className="card p-3 mt-3" style={{ backgroundColor: "#ccc" }}>
      <div className="text-center mb-3" style={{ backgroundColor: "#f9b36d", padding: "10px" }}>
        <h5 className="m-0 fw-bold" style={{ color: "blue" }}>Current caller's history</h5>
      </div>

      <div className="container">
        <div className="row mb-2 text-center fw-bold">
          <div className="col bg-warning py-2">Total :</div>
          <div className="col bg-warning py-2">{history.total}</div>
          <div className="col bg-warning py-2">Closed :</div>
          <div className="col bg-warning py-2">{history.closed}</div>
        </div>
        <div className="row mb-2 text-center fw-bold">
          <div className="col bg-warning py-2">Initiated :</div>
          <div className="col bg-warning py-2">{history.initiated}</div>
          <div className="col bg-warning py-2">Completed :</div>
          <div className="col bg-warning py-2">{history.completed}</div>
        </div>
        <div className="row mb-2 text-center fw-bold">
          <div className="col bg-warning py-2">Approved :</div>
          <div className="col bg-warning py-2">{history.approved}</div>
          <div className="col bg-warning py-2">Corrected :</div>
          <div className="col bg-warning py-2">{history.corrected}</div>
        </div>
        <div className="row mb-2 text-center fw-bold">
          <div className="col bg-warning py-2">Refer :</div>
          <div className="col bg-warning py-2">{history.refer}</div>
          <div className="col bg-warning py-2">Advised :</div>
          <div className="col bg-warning py-2">{history.advised}</div>
        </div>
      </div>
    </div>
  );
}
