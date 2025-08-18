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

const data = [
  {
    id: 1,
    name: "Ali Raza",
    fatherName: "Ahmed Raza",
    gender: "Male",
    age: 28,
    additionalInfo3: "Punjab",
    additionalInfo2: "Lahore",
    city: "Lahore",
    phoneNo: "042-1234567",
    address: "Model Town, Lahore",
    additionalInfo5: "Friend",
    cnic: "35201-1234567-1",
    cellNo: "03001234567",
    additionalInfo6: "Islam",
    additionalInfo1: "50000",
    additionalInfo4: "Pakistan",
    additionalInfo10: "Next Week",
    additionalInfo9: "Good candidate",
    additionalInfo8: "Single"
  },
  {
    id: 2,
    name: "Sara Khan",
    fatherName: "Imran Khan",
    gender: "Female",
    age: 25,
    additionalInfo3: "Sindh",
    additionalInfo2: "Karachi",
    city: "Karachi",
    phoneNo: "021-7654321",
    address: "Gulshan, Karachi",
    additionalInfo5: "Facebook",
    cnic: "42101-7654321-0",
    cellNo: "03111234567",
    additionalInfo6: "Islam",
    additionalInfo1: "60000",
    additionalInfo4: "Pakistan",
    additionalInfo10: "Tomorrow",
    additionalInfo9: "Follow up",
    additionalInfo8: "Married"
  }
];
// Custom styles for DataTable
const customStyles = {
  headRow: {
    style: {
      backgroundColor: '#343a40', // Bootstrap bg-dark
      color: '#fff',              // White text
      fontWeight: 'bold',
    },
  },
};
export default function SearchTab() {
  return (
    <div className="card p-3 mt-3">
      <h5 className="mb-3">Search Results</h5>
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