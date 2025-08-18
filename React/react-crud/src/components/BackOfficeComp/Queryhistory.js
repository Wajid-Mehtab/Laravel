import React from 'react';
import DataTable from 'react-data-table-component';

const columns = [
  { name: 'Caller Code', selector: row => row.code, sortable: true },
  { name: 'Caller Note', selector: row => row.note, sortable: true },
];

const data = [
  { code: '001', note: 'Follow up' },
  { code: '002', note: 'Callback later' },
];

export default function QueryhistoryTab() {
  return (
    <div className="card p-3 mt-3">
      <h5 className="mb-3">List</h5>

      <div className="row">
       
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
