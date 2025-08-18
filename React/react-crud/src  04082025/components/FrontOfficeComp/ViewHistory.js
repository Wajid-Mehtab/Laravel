import React from 'react';
import DataTable from 'react-data-table-component';

const columns = [
  { name: 'Date', selector: row => row.date, sortable: true },
  { name: 'Time', selector: row => row.time, sortable: true },
  { name: 'Agent', selector: row => row.agent, sortable: true },
  { name: 'Action', selector: row => row.action },
  { name: 'Details', selector: row => row.details },
];

const data = [
  {
    date: '2025-06-01',
    time: '10:15 AM',
    agent: 'John Smith',
    action: 'Updated Note',
    details: 'Follow-up scheduled for 2025-06-05.',
  },
  {
    date: '2025-06-02',
    time: '02:30 PM',
    agent: 'Maria Ali',
    action: 'Closed Query',
    details: 'Issue resolved and query closed.',
  },
  {
    date: '2025-06-03',
    time: '11:45 AM',
    agent: 'Waqas Raza',
    action: 'Reassigned',
    details: 'Reassigned to Team B for further review.',
  },
];

export default function ViewHistoryTab() {
  return (
    <div className="card p-3 mt-3">
      <h5 className="mb-3">View History</h5>

      <DataTable
        columns={columns}
        data={data}
        pagination
        responsive
        highlightOnHover
        dense
      />
    </div>
  );
}
