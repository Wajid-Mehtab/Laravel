// src/components/FrontOfficeComp/Search.js
import React from 'react';
import DataTable from 'react-data-table-component';

const columns = [
  { name: 'ID', selector: row => row.id, sortable: true },
  { name: 'Name', selector: row => row.name, sortable: true },
  { name: 'Father Name', selector: row => row.fatherName, sortable: true },
  { name: 'Gender', selector: row => row.gender },
  { name: 'Age', selector: row => row.age },
  { name: 'Province', selector: row => row.additionalInfo3 },
  { name: 'District', selector: row => row.additionalInfo2 },
  { name: 'City', selector: row => row.city },
  { name: 'Phone No', selector: row => row.phoneNo },
  { name: 'Address', selector: row => row.address },
  { name: 'Heard From', selector: row => row.additionalInfo5 },
  { name: 'CNIC', selector: row => row.cnic },
  { name: 'Cell No', selector: row => row.cellNo },
  { name: 'Religion', selector: row => row.additionalInfo6 },
  { name: 'Salary', selector: row => row.additionalInfo1 },
  { name: 'Country', selector: row => row.additionalInfo4 },
  { name: 'Callback Two', selector: row => row.additionalInfo10 },
  { name: 'Remarks', selector: row => row.additionalInfo9 },
  { name: 'Marital Status', selector: row => row.additionalInfo8 },
];

const customStyles = {
  headRow: {
    style: {
      backgroundColor: '#343a40',
      color: '#fff',
      fontWeight: 'bold',
    },
  },
};

export default function SearchTab({ rows = [], loading = false }) {
  return (
      <div className="card p-3 mt-3">
        <h5 className="mb-3">Search Results</h5>
        <DataTable
            columns={columns}
            data={rows}
            pagination
            responsive
            highlightOnHover
            dense
            customStyles={customStyles}
            progressPending={loading}
            noDataComponent={<div className="text-muted">No results.</div>}
        />
      </div>
  );
}
