import React, { useState, useEffect } from "react";
import axios from 'axios';
import { SAVE_CONTACT_URL } from "../config/api.js";
import FrontSidebar from "../components/SideBars/FrontSidebar.js";
import Softphone from "../components/Softphone/Softphone.js";
import SearchTab from "../components/FrontOfficeComp/Search.js";
import CallerProfileTab from "../components/FrontOfficeComp/CallerProfile.js";
import CallerDashbordTab from "../components/FrontOfficeComp/CallerDashbord.js";
import ListTab from "../components/FrontOfficeComp/Listtab.js";
import DetailTab from "../components/FrontOfficeComp/Detail.js";
import NotesTab from "../components/FrontOfficeComp/Notes.js";
import ViewHistoryTab from "../components/FrontOfficeComp/ViewHistory.js";
import RemindersTab from "../components/FrontOfficeComp/Reminders.js";
import SMSSendTab from "../components/FrontOfficeComp/SMSSend.js";

// CallerInformation Component
function CallerInformation({
                             form,
                             setForm,
                             religions,
                             Gender,
                             cities,
                             districts,
                             provinces,
                             countries,
                             handleChange,
                             handleNewCaller,
                             handleUpdateContact,
                             handleSave,
                             handleClear,
                             onCityChange,
                             onDistrictChange,
                             heardFromOptions,
                             maritalStatusOptions
                           }) {
  return (
      <div className="row">
        {/* Left Form */}
        <div className="col-md-8">
          <div className="card p-3">
            <div className="row g-2">
              {/* CLI */}
              <label className="form-label">CLI</label>
              <input
                  type="text"
                  name="PhoneNo"
                  className="form-control"
                  placeholder="03XXXXXXXXX"
                  required
                  maxLength={11}
                  value={form.PhoneNo}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, "");
                    setForm((prevForm) => ({ ...prevForm, PhoneNo: onlyNums }));
                  }}
                  onPaste={(e) => {
                    const pasted = e.clipboardData.getData("Text");
                    if (/\D/.test(pasted)) e.preventDefault();
                  }}
              />


              {/* Name */}
              <div className="col-md-4">
                <label className="form-label">Name</label>
                <input type="text" name="Name" className="form-control" value={form.Name} onChange={handleChange} />
              </div>

              {/* Gender */}
              <div className="col-md-4">
                <label className="form-label">Gender</label>
                <select name="Gender" className="form-select" value={form.Gender} onChange={handleChange}>
                  {/* <option value="">Select</option>*/}
                  {Gender.map((option, index) => (
                      <option key={index} value={option.Value}>{option.Value}</option>
                  ))}
                </select>
              </div>

              {/* Age */}
              <div className="col-md-4">
                <label className="form-label">Age</label>
                <input type="number" name="Age" className="form-control" value={form.Age} onChange={handleChange} />
              </div>

              {/* City */}
              {/* City Dropdown */}
              <div className="col-md-4">
                <label className="form-label">City</label>
                <select value={form.City} onChange={onCityChange} className="form-select">
                  <option value="">--Select City--</option>
                  {cities.map((city, idx) => (
                      <option key={idx} value={city.CityName}>{city.CityName}</option>
                  ))}
                </select>
              </div>

              {/* District Dropdown */}
              <div className="col-md-4">
                <label className="form-label">District</label>
                <select
                    value={form.AdditionalInfo2}
                    onChange={onDistrictChange}
                    className="form-select"
                    disabled={!form.City}
                >
                  <option value="">--Select District--</option>
                  {districts.map((d, idx) => (
                      <option key={idx} value={d.DistrictName}>{d.DistrictName}</option>
                  ))}
                </select>
              </div>

              {/* Province Dropdown */}
              <div className="col-md-4">
                <label className="form-label">Province</label>
                <select
                    value={form.AdditionalInfo3}
                    onChange={e =>
                        setForm(prev => ({ ...prev, AdditionalInfo3: e.target.value }))
                    }
                    className="form-select"
                    disabled={!form.City}
                >
                  <option value="">--Select Province--</option>
                  {provinces.map((p, idx) => (
                      <option key={idx} value={p.ProvinceName}>{p.ProvinceName}</option>
                  ))}
                </select>
              </div>


              {/* Country */}
              {/* Country */}
              <div className="col-md-4">
                <label className="form-label">Country</label>
                <select
                    name="AdditionalInfo4"
                    className="form-select"
                    value={form.AdditionalInfo4}
                    onChange={handleChange}
                >
                  <option value="">Select Country</option>
                  {countries.map((country, index) => (
                      <option key={index} value={country.CountryName}>
                        {country.CountryName}
                      </option>
                  ))}
                </select>
              </div>


              {/* Province
              <div className="col-md-4">
                <label className="form-label">Province</label>
                <input type="text" name="AdditionalInfo3" className="form-control" value={form.AdditionalInfo3} onChange={handleChange} />
              </div>*/}

              {/* District
              <div className="col-md-4">
                <label className="form-label">District</label>
                <input type="text" name="AdditionalInfo2" className="form-control" value={form.AdditionalInfo2} onChange={handleChange} />
              </div> */}

              {/* Heard From */}
              <div className="col-md-4">
                <label className="form-label">Heard From</label>
                <select
                    className="form-control"
                    name="AdditionalInfo5"
                    value={form.AdditionalInfo5}
                    onChange={handleChange}
                >
                  <option value="">--Select--</option>
                  {Array.isArray(heardFromOptions) && heardFromOptions.map((item, idx) => (
                      <option key={idx} value={item.Value}>{item.Value}</option>
                  ))}
                </select>
              </div>

              {/* CNIC */}
              <div className="col-md-4">
                <label className="form-label">CNIC</label>
                <input type="text" name="CNIC" className="form-control" value={form.CNIC} onChange={handleChange} />
              </div>

              {/* Father/Husband */}
              <div className="col-md-4">
                <label className="form-label">Father/Husband</label>
                <input type="text" name="FatherName" className="form-control" value={form.FatherName} onChange={handleChange} />
              </div>

              {/* Callback 1 */}
              <div className="col-md-4">
                <label className="form-label">Callback 1</label>
                <input type="text" name="CellNo" className="form-control" value={form.CellNo} onChange={handleChange} />
              </div>

              {/* Callback 2 */}
              <div className="col-md-4">
                <label className="form-label">Callback 2</label>
                <input type="text" name="AdditionalInfo10" className="form-control" value={form.AdditionalInfo10} onChange={handleChange} />
              </div>

              {/* Salary */}
              <div className="col-md-4">
                <label className="form-label">Salary</label>
                <input type="text" name="AdditionalInfo1" className="form-control" value={form.AdditionalInfo1} onChange={handleChange} />
              </div>

              {/* Address */}
              <div className="col-md-8">
                <label className="form-label">Address</label>
                <textarea name="Address" className="form-control" rows="2" value={form.Address} onChange={handleChange}></textarea>
              </div>

              {/* Religion */}
              <div className="col-md-4">
                <label className="form-label">Religion</label>
                <select
                    name="AdditionalInfo6"
                    className="form-control"
                    value={form.AdditionalInfo6}
                    onChange={(e) =>
                        setForm({ ...form, AdditionalInfo6: e.target.value })
                    }
                >
                  {/* <option value="">Select Religion</option>*/}
                  {religions.map((rel, index) => (
                      <option key={index} value={rel.Value}>
                        {rel.Value}
                      </option>
                  ))}
                </select>
              </div>

              {/* Marital State */}
              <div className="col-md-4">
                <label className="form-label">Marital State</label>
                <select
                    name="AdditionalInfo8"
                    className="form-select"
                    value={form.AdditionalInfo8}
                    onChange={handleChange}
                >
                  {maritalStatusOptions.map((status, index) => (
                      <option key={index} value={status}>
                        {status}
                      </option>
                  ))}
                </select>
              </div>

              {/* Remarks */}
              <div className="col-md-4">
                <label className="form-label">Remarks</label>
                <input type="text" name="AdditionalInfo9" className="form-control" value={form.AdditionalInfo9} onChange={handleChange} />
              </div>

              {/* Buttons */}
              <div className="col-md-12 mt-3 d-flex gap-2">
                <button className="btn btn-primary btn-sm" onClick={handleNewCaller}>New Caller</button>
                <button className="btn btn-success btn-sm" onClick={handleUpdateContact}>Update Contact</button>
                <button className="btn btn-info btn-sm" onClick={handleSave}>Save</button>
                <button className="btn btn-danger btn-sm" onClick={handleClear}>Clear Info</button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Softphone */}
        <div className="col-md-4">
          <div className="card p-3">
            <h5>Softphone</h5>
            <Softphone />
          </div>
        </div>
      </div>
  );
}

// Frontoffice Main Component
export default function Frontoffice() {
  const [listData, setListData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("callerInfo");

  const initialForm = {
    PhoneNo: "",
    CRN: "crn",
    Name: "",
    Gender: "",
    Age: "",
    City: "",
    AdditionalInfo2: "",
    AdditionalInfo3: "",
    AdditionalInfo4: "",
    CNIC: "",
    FatherName: "",
    CellNo: "",
    AdditionalInfo10: "",
    AdditionalInfo1: "",
    Address: "",
    AdditionalInfo6: "",
    AdditionalInfo8: "",
    AdditionalInfo9: "",
    AdditionalInfo5: ""
  };

  const [form, setForm] = useState(initialForm);
  const [religions, setReligions] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [countries, setCountries] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [heardFromOptions, setHeardFromOptions] = useState([]);
  const [maritalStatusOptions, setMaritalStatusOptions] = useState([]);

  const handleRowDoubleClick = (rowData) => {
    console.log("Double clicked row:", rowData);
    setForm((prev) => ({
      ...prev,
      id: rowData.id,
      PhoneNo: rowData.ContactNumber || "",
      Name: rowData.ContactPerson || "",
      Gender: rowData.Gender || "",
      CNIC: rowData.CNIC || "",
      City: rowData.City || "",
      Address: rowData.Address || "",
      AdditionalInfo2: rowData.District || "",
      AdditionalInfo3: rowData.Province || "",
      AdditionalInfo4: rowData.Country || "",
      AdditionalInfo5: rowData.HeardFrom || "",
      AdditionalInfo6: rowData.Religion || "",
      AdditionalInfo8: rowData.MaritalStatus || "",
      AdditionalInfo9: rowData.Remarks || "",
      AdditionalInfo10: rowData.Callback2 || "",
      CellNo: rowData.Callback1 || "",
      AdditionalInfo1: rowData.Salary || "",
      FatherName: rowData.FatherName || "",
      Age: rowData.Age || "",
      QID: rowData.QID || ""
    }));
    setSelectedTab("callerInfo");
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchHeardFrom = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/heard-from");
      if (res.data.success) setHeardFromOptions(res.data.data);
    } catch (err) {
      console.error("Heard From fetch error:", err);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/cities");
      const data = await res.json();
      setCities(data);
    } catch (err) {
      console.error("City fetch error:", err);
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/countries");
      const data = await res.json();
      if (data.success) setCountries(data.data);
    } catch (err) {
      console.error("Error fetching countries:", err);
    }
  };

  const fetchGenderOptions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/gender-options");
      if (res.data.success) setGenderOptions(res.data.data);
    } catch (err) {
      console.error("Gender options error:", err);
    }
  };

  const fetchReligions = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/religions");
      const data = await res.json();
      if (data.success) setReligions(data.data);
    } catch (err) {
      console.error("Religions error:", err);
    }
  };

  const fetchMaritalStatusOptions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/marital-status");
      if (res.data.success) setMaritalStatusOptions(res.data.data);
    } catch (err) {
      console.error("Marital status error:", err);
    }
  };

  useEffect(() => {
    fetchHeardFrom();
    fetchCities();
    fetchCountries();
    fetchGenderOptions();
    fetchReligions();
    fetchMaritalStatusOptions();
  }, []);

  const onCityChange = async (e) => {
    const selectedCity = e.target.value;
    setForm((prev) => ({ ...prev, City: selectedCity }));

    if (!selectedCity) {
      setDistricts([]);
      setProvinces([]);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/city-info?city=${encodeURIComponent(selectedCity)}`);
      const data = await res.json();
      if (data.length > 0) {
        setDistricts([{ DistrictName: data[0].DistrictName }]);
        setProvinces([{ ProvinceName: data[0].ProvinceName }]);
        setForm((prev) => ({
          ...prev,
          AdditionalInfo2: data[0].DistrictName,
          AdditionalInfo3: data[0].ProvinceName
        }));
      }
    } catch (err) {
      console.error("Error fetching city info:", err);
    }
  };

  const onDistrictChange = (e) => {
    setForm((prev) => ({ ...prev, AdditionalInfo2: e.target.value }));
  };

  const handleNewCaller = () => {
    alert("New Caller initialized");
    setForm(initialForm);
    setSelectedTab("callerInfo");
  };

  const handleUpdateContact = async () => {
    if (!form.id) return alert("No contact selected to update.");
    try {
      const res = await fetch(SAVE_CONTACT_URL(form.id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await res.json();
      if (res.ok) alert("Contact updated!");
      else alert("Failed: " + result.message);
    } catch (err) {
      alert("Error updating contact.");
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(SAVE_CONTACT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await res.json();
      if (res.ok) {
        alert("Saved successfully!");
        setForm(initialForm);
      } else alert("Failed: " + result.message);
    } catch (err) {
      alert("Error saving data.");
    }
  };

  const handleClear = () => {
    if (window.confirm("Clear the form?")) {
      setForm(initialForm);
      setListData([]); // reset ListTab data too
    }
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "search": return <SearchTab />;
      case "profile": return <CallerProfileTab />;
      case "dashboard": return <CallerDashbordTab />;
      case "list": return <ListTab onRowClick={handleRowDoubleClick}
                                   data={listData}
                                   setData={setListData} />;
      case "detail": return <DetailTab />;
      case "notes": return <NotesTab />;
      case "viewhistory": return <ViewHistoryTab />;
      case "reminders": return <RemindersTab />;
      case "sendsms": return <SMSSendTab />;
      default:
        return (
            <CallerInformation
                form={form}
                setForm={setForm}
                religions={religions}
                Gender={genderOptions}
                cities={cities}
                districts={districts}
                provinces={provinces}
                countries={countries}
                handleChange={handleChange}
                handleNewCaller={handleNewCaller}
                handleUpdateContact={handleUpdateContact}
                handleSave={handleSave}
                handleClear={handleClear}
                onCityChange={onCityChange}
                onDistrictChange={onDistrictChange}
                heardFromOptions={heardFromOptions}
                maritalStatusOptions={maritalStatusOptions}
            />
        );
    }
  };



  return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2 p-0">
            <FrontSidebar selectedTab={selectedTab} onSelect={setSelectedTab} />
          </div>

          <div className="col-md-10 p-3">
            <div className="row bg-white py-2 border-bottom mb-3">
              <div className="col-md-4 text-start"><strong>Caller:</strong>{form.PhoneNo} </div>
              <div className="col-md-4 text-center"><strong>Query ID:</strong> {form.CNIC} </div>
              <div className="col-md-4 text-end"><strong>Caller Name:</strong> {form.Name}</div>
            </div>

            {renderContent()}
          </div>
        </div>
      </div>
  );
}
