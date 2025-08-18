import React, { useState } from 'react';
import BackSidebar from '../components/SideBars/BackSidebar.js';
import DataTable from 'react-data-table-component';

import CallerInformationTab from "../components/BackOfficeComp/CallerInformation.js";
import AgentDashboardTab from "../components/BackOfficeComp/AgentDashboard.js";
import DashboardTab from "../components/BackOfficeComp/Dashboard.js"; 
import AdvocateInformationTab from "../components/BackOfficeComp/AdvocateInformation.js"; 
import QueryhistoryTab from '../components/BackOfficeComp/Queryhistory.js';
import DetailTab from "../components/BackOfficeComp/Detail.js";
import NotesTab from "../components/BackOfficeComp/Notes.js";

const Backoffice = () => {
  const [selectedTab, setSelectedTab] = useState("queries");

  const [form, setForm] = useState({
    query: "",
    status: "",
    queryId: "",
    agent: "",
    mainCat: "",
    date: "",
    dateTo: "",
    chk: false,
    enableDate: false,
    enableDateTo: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const columns = [
    { name: 'Query ID', selector: row => row.queryId, sortable: true },
    { name: 'Agent', selector: row => row.agent, sortable: true },
    { name: 'Status', selector: row => row.status },
    { name: 'Date', selector: row => row.date },
  ];

  const tableData = [
    { queryId: 'Q001', agent: 'John', status: 'Open', date: '2025-06-30' },
    { queryId: 'Q002', agent: 'Alice', status: 'Closed', date: '2025-06-29' },
  ];

  // Main content renderer
  const renderContent = () => {
    switch (selectedTab) {
      case "queries":
        return (
          <div className="row">
            {/* Left Filter Panel */}
            <div className="col-md-3">
              <div className="mb-2">
                <label>Queries:</label>
                <input type="text" className="form-control" name="query" value={form.query} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label>Status:</label>
                <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                  <option value="">Select</option>
                  <option>Open</option>
                  <option>Closed</option>
                </select>
              </div>
              <div className="mb-2">
                <label>Query ID:</label>
                <input type="text" className="form-control" name="queryId" value={form.queryId} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label>Agents:</label>
                <select className="form-select" name="agent" value={form.agent} onChange={handleChange}>
                  <option value="">Select Agent</option>
                  <option>Agent 1</option>
                  <option>Agent 2</option>
                </select>
              </div>
              <div className="mb-2 d-flex align-items-center">
                <input type="checkbox" name="enableDate" checked={form.enableDate} onChange={handleChange} className="me-2" />
                <input type="date" className="form-control" name="date" value={form.date} onChange={handleChange} disabled={!form.enableDate} />
              </div>
              <div className="mb-2 d-flex align-items-center">
                <input type="checkbox" name="enableDateTo" checked={form.enableDateTo} onChange={handleChange} className="me-2" />
                <input type="date" className="form-control" name="dateTo" value={form.dateTo} onChange={handleChange} disabled={!form.enableDateTo} />
              </div>
              <div className="mb-2">
                <label>MainCat:</label>
                <input type="text" className="form-control" name="mainCat" value={form.mainCat} onChange={handleChange} />
              </div>
              <div className="d-flex justify-content-between">
                <button className="btn btn-warning">Close GI</button>
                <button className="btn btn-primary">Show</button>
              </div>
            </div>

            {/* Data Table */}
            <div className="col-md-9 d-flex flex-column bg-secondary p-3">
              <div className="flex-grow-1 border border-dark bg-light mb-2">
                <DataTable
                  columns={columns}
                  data={tableData}
                  pagination
                  highlightOnHover
                  dense
                />
              </div>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <div>
                  <button className="btn btn-light me-2">&lt;&lt;</button>
                  <button className="btn btn-light">&gt;&gt;</button>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="chk"
                    checked={form.chk || false}
                    onChange={handleChange}
                    id="chk"
                  />
                  <label className="form-check-label" htmlFor="chk">chk</label>
                </div>
              </div>
            </div>
          </div>
        );
      case "callerInfo": return <CallerInformationTab />;
      case "agentdashboard": return <AgentDashboardTab />;
      case "dashboard": return <DashboardTab />;
      case "advocateInfo": return <AdvocateInformationTab />;
      case "detail": return <DetailTab />;
      case "queryhistory": return <QueryhistoryTab />;
      case "notes": return <NotesTab />;
      default: return <div>Select a tab from the sidebar</div>;
    }
  };

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-2 p-0">
          <BackSidebar selectedTab={selectedTab} onSelect={setSelectedTab} />
        </div>

        {/* Main Content */}
        <div className="col-md-10">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Backoffice;
