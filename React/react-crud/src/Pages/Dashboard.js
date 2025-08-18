import React from 'react';
import Softphone from '../components/Softphone'; // Adjust path as needed

export default function Dashboard() {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* You can add other form sections here */}
        <Softphone />
      </div>
    </div>
  );
}