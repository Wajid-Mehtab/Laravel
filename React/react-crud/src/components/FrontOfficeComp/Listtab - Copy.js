import React, { useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const columns = [
  { name: "QID", selector: row => row.QID, sortable: true },
  { name: "Callers ID", selector: row => row.CallersID },
  { name: "Contact Person", selector: row => row.ContactPerson },
  { name: "Status", selector: row => row.Status },
  { name: "Contact Number", selector: row => row.ContactNumber },
  { name: "Routed To Department", selector: row => row.RoutedToDepartment },
  { name: "Edited", selector: row => row.Edited },
  { name: "Main Category", selector: row => row.MainCat },
  { name: "Category", selector: row => row.Cat },
  { name: "Sub-Category", selector: row => row["Sub-Cat"] },
  { name: "Office", selector: row => row.Office },
  { name: "Created On", selector: row => row.CreatedOn },
  { name: "Modified On", selector: row => row.ModifiedOn },
  { name: "Closed On", selector: row => row.ClosedOn ?? "—" },
  { name: "History", selector: row => row.History },
  { name: "Notes", selector: row => row.Notes },
  { name: "Tags", selector: row => row.TAGS },
  { name: "Created By", selector: row => row.CreatedBy },
  { name: "Modified By", selector: row => row.ModifyiedBy },
  { name: "Routed On", selector: row => row.RoutedOn ?? "—" },
  { name: "Routed By", selector: row => row.RoutedBy ?? "—" }
];

export default function ListTab() {
  const [filters, setFilters] = useState({
    all: '',
    dateFrom: '',
    dateTo: '',
    cli: '',
    queryId: '',
    callerId: '',
    status: '',
    notEdited: false,
  });

  const [checked, setChecked] = useState({
    all: false,
    dateFrom: false,
    dateTo: false,
    cli: false,
    queryId: false,
    callerId: false,
    status: false,
    notEdited: false,
  });

  const [data, setData] = useState([]);

  const handleInputChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckboxChange = (key) => {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async () => {
    const params = {};

    // Only include selected filters
    Object.entries(filters).forEach(([key, value]) => {
      if (checked[key] && value !== '') {
        params[key] = value;
      }
    });

    // Always send RoutedToDepartment and RoleName
    params.RoutedToDepartment = 'Call Center';
    params.RoleName = 'FO'; // You can dynamically get this from session or props

    try {
      const response = await axios.post('http://localhost:8000/api/search-history', params);
      setData(response.data);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  return (
      <div className="card p-3 mt-3">
        <h5 className="mb-3">List</h5>
        <div className="row">
          {/* Left Card - Filters */}
          <div className="col-md-4">
            <div className="card p-3">
              <h6 className="mb-3">Filter Options</h6>

              {[
                { label: 'All', key: 'all', type: 'text', placeholder: 'Enter All' },
                { label: 'Date From', key: 'dateFrom', type: 'date' },
                { label: 'Date To', key: 'dateTo', type: 'date' },
                { label: 'CLI', key: 'cli', type: 'text', placeholder: 'Enter CLI' },
                { label: 'Query ID', key: 'queryId', type: 'text', placeholder: 'Enter Query ID' },
                { label: 'Caller ID', key: 'callerId', type: 'text', placeholder: 'Enter Caller ID' },
                { label: 'Status', key: 'status', type: 'text', placeholder: 'Enter Status' },
              ].map(({ label, key, type, placeholder }) => (
                  <div className="d-flex align-items-center mb-2" key={key}>
                    <input
                        type="checkbox"
                        className="form-check-input me-2"
                        id={`chk-${key}`}
                        checked={checked[key]}
                        onChange={() => handleCheckboxChange(key)}
                    />
                    <label htmlFor={`chk-${key}`} className="form-check-label me-2" style={{ minWidth: '100px' }}>{label}</label>
                    <input
                        type={type}
                        className="form-control form-control-sm"
                        placeholder={placeholder || ''}
                        value={filters[key]}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                    />
                  </div>
              ))}

              {/* Not Edited */}
              <div className="form-check mb-3">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="chk-notEdited"
                    checked={checked.notEdited}
                    onChange={() => handleCheckboxChange('notEdited')}
                />
                <label htmlFor="chk-notEdited" className="form-check-label">Not Edited</label>
              </div>

              <button className="btn btn-primary w-100" onClick={handleSubmit}>Show</button>
            </div>
          </div>

          {/* Right Card - DataTable */}
          <div className="col-md-8">
            <div className="card p-3">
              <h6 className="mb-3">Caller Table</h6>
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
      </div>
  );
}
