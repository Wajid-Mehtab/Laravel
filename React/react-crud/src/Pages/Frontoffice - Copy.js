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
                             heardFromOptions
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
                <input type="text" name="AdditionalInfo8" className="form-control" value={form.AdditionalInfo8} onChange={handleChange} />
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
  const [selectedTab, setSelectedTab] = useState("callerInfo");

  const initialForm = { /* same as before */ };

  const [form, setForm] = useState(initialForm);
  const [religions, setReligions] = useState([]);

 // const [districts, setDistricts] = useState([]);
 // const [provinces, setProvinces] = useState([]);
  //const [selectedDistrict, setSelectedDistrict] = useState('');
  //const [province, setProvince] = useState('');
 // const [provinceList, setProvinceList] = useState([]);

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [provinces, setProvinces] = useState([]);

  const [countries, setCountries] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [heardFromOptions, setHeardFromOptions] = useState([]);
  //Gender

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
///////
  const fetchHeardFrom = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/heard-from');
      if (response.data.success) {
        setHeardFromOptions(response.data.data);
      } else {
        setHeardFromOptions([]);
      }
    } catch (error) {
      console.error('Error fetching heard from:', error);
      setHeardFromOptions([]);
    }
  };

  ///
  useEffect(() => {
         // Optional: make this a separate function too
    fetchHeardFrom();      // Cleanly call the new function
  }, []);
  useEffect(() => {
    fetch('http://localhost:8000/api/cities')
        .then(res => res.json())
        .then(data => setCities(data))
        .catch(err => console.error('City fetch error:', err));
  }, []);

  // When city is selected
  const onCityChange = async (e) => {
    const selectedCity = e.target.value;

    setForm(prev => ({ ...prev, City: selectedCity }));

    if (selectedCity === '') {
      setDistricts([]);
      setProvinces([]);
      setForm(prev => ({
        ...prev,
        AdditionalInfo2: '',
        AdditionalInfo3: ''
      }));
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/city-info?city=${encodeURIComponent(selectedCity)}`);
      const data = await res.json();

      if (data.length > 0) {
        const { DistrictName, ProvinceName } = data[0];

        setDistricts([{ DistrictName }]);
        setProvinces([{ ProvinceName }]);

        setForm(prev => ({
          ...prev,
          AdditionalInfo2: DistrictName || '',
          AdditionalInfo3: ProvinceName || ''
        }));
      } else {
        setDistricts([]);
        setProvinces([]);
        setForm(prev => ({
          ...prev,
          AdditionalInfo2: '',
          AdditionalInfo3: ''
        }));
      }
    } catch (error) {
      console.error('Error fetching city info:', error);
    }
  };

  // Optional if you want user to manually change district
  const onDistrictChange = (e) => {
    setForm(prev => ({ ...prev, AdditionalInfo2: e.target.value }));
  };
  useEffect(() => {
    fetch('http://localhost:8000/api/countries')
        .then((res) => res.json())
        .then((data) => data.success && setCountries(data.data))
        .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/api/gender-options')
        .then((res) => res.data.success && setGenderOptions(res.data.data))
        .catch((err) => console.error("Error fetching gender options:", err));
  }, []);



  useEffect(() => {
    fetch("http://localhost:8000/api/religions")
        .then((res) => res.json())
        .then((data) => data.success && setReligions(data.data))
        .catch((err) => console.error("Error fetching religions:", err));
  }, []);

  const handleNewCaller = () => {
    alert("New Caller initialized");
    setForm(initialForm);
    setSelectedTab("callerInfo");
  };

  const handleUpdateContact = async () => { /* unchanged */ };
  const handleSave = async () => { /* unchanged */ };
  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the form?")) {
      setForm(initialForm);
    }
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "search": return <SearchTab />;
      case "profile": return <CallerProfileTab />;
      case "dashboard": return <CallerDashbordTab />;
      case "list": return <ListTab />;
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
                setHeardFromOptions={heardFromOptions}
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
              <div className="col-md-4 text-start"><strong>Caller:</strong> N/A</div>
              <div className="col-md-4 text-center"><strong>Query ID:</strong> N/A</div>
              <div className="col-md-4 text-end"><strong>Caller Name:</strong> N/A</div>
            </div>

            {renderContent()}
          </div>
        </div>
      </div>
  );
}
