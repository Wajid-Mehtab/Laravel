// src/components/FrontOfficeComp/DetailTab.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000/api";
const sindhGovDepartments = [
  "--Select--",
  "Law & Order",
  "Agri Water Issue",
  "Drinking Water Issue",
  "Land Dispute",
  "Land Enchrochment",
  "Elct_Gas Utilities",
  "Group Insaurance",
  "Illegal Construction",
  "Financial Support",
  "Sport Facility",
  "Minority Issues",
  "Right to Education",
  "Health Issue",
  "Other",
  "Federal government",
  "N/A",
  "Other Province"
];

/** safe fetch with raw body logging to catch HTML error pages / bad JSON */
async function safeJsonFetch(url) {
  const res = await fetch(url);
  const text = await res.text();
  console.log("FETCH:", url, res.status, text);

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    throw new Error(`Non-JSON (${res.status}): ${text}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Bad JSON: ${text}`);
  }
}

export default function DetailTab({
                                    detailForm,
                                    setDetailForm,
                                    phoneNo = "",
                                    callerName = "",
                                    roleName = "FO",          // use "FOE" for stricter validation
                                    categories = [],          // main categories from parent [{id,name}] or [{ID,CCDescription}]
                                    // optional external tag buckets (kept intact if you still show them elsewhere)
                                    mflTags = [],
                                    setMflTags = () => {},
                                    oldTags = [],
                                    setOldTags = () => {},
                                    wrlmpTags = [],
                                    setWrlmpTags = () => {},
                                  }) {
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  const [subCategories, setSubCategories] = useState([]); // [{id,name}]
  const [children, setChildren] = useState([]);           // [{id,name}]
  const [tags, setTags] = useState([]);                   // [{id,name,checked}]
  const [faqs, setFaqs] = useState([]);                   // [{id,question}]
  const [faqEnabled, setFaqEnabled] = useState(false);
  const [tagOptions, setTagOptions]   = useState([]); // Select Tags (by child)
  const [mflList, setMflList]         = useState([]); // MFL list
  const [wrlmpList, setWrlmpList]     = useState([]); // WRLMP list

  useEffect(() => {
    (async () => {
      try {
        const mflRes   = await fetch(`${API_BASE}/tags/mfl`);
        const mflJson  = await mflRes.json();
        setMflList(mflJson?.success ? (mflJson.data || []) : []);

        const wrRes    = await fetch(`${API_BASE}/tags/wrlmp`);
        const wrJson   = await wrRes.json();
        setWrlmpList(wrJson?.success ? (wrJson.data || []) : []);
      } catch (e) {
        console.error('MFL/WRLMP load error', e);
        setMflList([]); setWrlmpList([]);
      }
    })();
  }, []);

  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/transfer/agents')
        .then(r => r.json())
        .then(j => {
          if (j.success) setAgents(j.data);
        })
        .catch(console.error);
  }, []);
  // When ChildCategoryID changes, load "Select Tags" options
  const [oldTagOptions, setOldTagOptions] = useState([]); // [{id,name}]
  useEffect(() => {
    const loadOldTags = async () => {
      try {
        const res = await fetch(`${API_BASE}/tags/old`);
        const json = await res.json();
        if (json?.success) {
          setOldTagOptions(json.data || []);
        } else {
          setOldTagOptions([]);
        }
      } catch (e) {
        console.error("Old tags load error", e);
        setOldTagOptions([]);
      }
    };
    loadOldTags();
  }, []);
  // const validate = () => {
  //   const e = [];
  //   // ...your other checks
  //   if (!detailForm.OldTagId) {
  //     e.push("Please select an Old Tag.");
  //   }
  //   return e;
  // };
  // const payload = {
  //   // ...your existing fields
  //   OldTagId: detailForm.OldTagId || null
  // };
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setDetailForm(prev => ({ ...prev, [name]: value }));
  };
  // ---------------------------
  // Controlled updates
  // ---------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDetailForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  // fetch children for a subcategory, pick the first, then resolve ChildCategoryID via by-name
  const pickFirstChildByName = async (subCatId) => {
    try {
      // 1) children list for selected subcategory
      const j = await safeJsonFetch(
          `${API_BASE}/subchildren?subcategory_id=${subCatId}`
      );
      const kids = j?.success ? (j.data || []) : [];
      setChildren(kids);

      if (kids.length > 0) {
        const firstName = kids[0].name;

        // set selected child name first (so UI updates)
        setDetailForm(prev => ({
          ...prev,
          SubCatChild: firstName,
          ChildCategoryID: null, // force by-name resolution
          FAQ: "",
        }));

        // 2) resolve ID via **by-name** (NOT by id)
        const r = await safeJsonFetch(
            `${API_BASE}/subchild/by-name?name=${encodeURIComponent(firstName)}`
        );
        const childId = r?.data?.id ?? r?.data?.SCCID ?? null;
        if (childId) {
          setDetailForm(prev => ({ ...prev, ChildCategoryID: childId }));
        }
      } else {
        // no children for this subcategory
        setDetailForm(prev => ({
          ...prev,
          SubCatChild: "",
          ChildCategoryID: null,
          FAQ: "",
        }));
      }
    } catch (err) {
      console.error("pickFirstChildByName error:", err);
      setChildren([]);
      setDetailForm(prev => ({
        ...prev,
        SubCatChild: "",
        ChildCategoryID: null,
        FAQ: "",
      }));
    }
  };

  // change main category -> reset dependent fields & lists
  const handleMainCatChange = (e) => {
    const main = e.target.value;
    setDetailForm((prev) => ({
      ...prev,
      MainCat: main,
      Category: "",
      CategoryID: null,
      SubCatChild: "",
      ChildCategoryID: null,
      FAQ: "",
    }));
    setSubCategories([]);
    setChildren([]);
    setTags([]);
    setFaqs([]);
    setFaqEnabled(false);
  };

  // change Category (UI) == Subcategory (DB)
  const handleCategoryChange = async (e) => {
    const picked = e.target.value;
    const found = subCategories.find((s) => s.name === picked);

    // reset dependent fields first
    setDetailForm((prev) => ({
      ...prev,
      Category: picked,
      CategoryID: found?.id ?? null,
      SubCatChild: "",
      ChildCategoryID: null,
      FAQ: "",
    }));
    setChildren([]);
    setTags([]);
    setFaqs([]);
    setFaqEnabled(false);

    // NEW: load children & auto-pick first, then resolve **by-name**
    if (found?.id) {
      await pickFirstChildByName(found.id);
    }
  };


  // change child by name; we set name immediately, and ID will be resolved if not known
  const handleChildChange = async (e) => {
    const pickedName = e.target.value;

    // set name first so UI reflects change
    setDetailForm((prev) => ({
      ...prev,
      SubCatChild: pickedName,
      ChildCategoryID: null,  // force by-name resolve
      FAQ: "",
    }));

    try {
      // resolve **by name** (NOT by id)
      const r = await safeJsonFetch(
          `${API_BASE}/subchild/by-name?name=${encodeURIComponent(pickedName)}`
      );
      const childId = r?.data?.id ?? r?.data?.SCCID ?? null;
      if (childId) {
        setDetailForm(prev => ({ ...prev, ChildCategoryID: childId }));
      }
    } catch (err) {
      console.error("handleChildChange by-name resolve failed:", err);
    }
  };


  const toggleTag = (idx) => {
    setTags((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], checked: !copy[idx].checked };
      return copy;
    });
  };

  const uncheckAll = () => {
    setTags((prev) => prev.map((t) => ({ ...t, checked: false })));
    setMflTags((prev) => prev.map((x) => ({ ...x, checked: false })));
    setOldTags((prev) => prev.map((x) => ({ ...x, checked: false })));
    setWrlmpTags((prev) => prev.map((x) => ({ ...x, checked: false })));
  };

  // ---------------------------
  // Effects
  // ---------------------------

  // 1) MainCat -> load subcategories
  useEffect(() => {
    const loadSubCats = async () => {
      const main = detailForm?.MainCat;
      if (!main) {
        setSubCategories([]);
        return;
      }
      try {
        const json = await safeJsonFetch(
            `${API_BASE}/subcategories?category=${encodeURIComponent(main)}`
        );

        if (json?.success) {
          const data = Array.isArray(json.data) ? json.data : [];
          setSubCategories(data);

          // keep category id from server object if provided
          setDetailForm((prev) => ({
            ...prev,
            CategoryID: prev.CategoryID ?? json.category?.id ?? null,
          }));

          // auto-select first subcategory if none chosen
          if ((!detailForm.Category || detailForm.Category === "") && data.length > 0) {
            setDetailForm((prev) => ({
              ...prev,
              Category: data[0].name,
              CategoryID: data[0].id,
            }));
          }
        } else {
          setSubCategories([]);
        }
      } catch (err) {
        console.error("Subcategories error:", err);
        setSubCategories([]);
      }
    };

    loadSubCats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailForm.MainCat]);



  // helper: given childId load tags & faqs
  // const loadTagsAndFaqs = useCallback(
  //     async (childId) => {
  //       try {
  //         // tags
  //         const qid = detailForm?.QueryID || "";
  //         const j2 = await safeJsonFetch(
  //             `${API_BASE}/subchild/${childId}/tags?qid=${encodeURIComponent(qid)}`
  //         );
  //         const normalizedTags = (j2?.data || []).map((t) => ({
  //           id: t.id ?? t.ID,
  //           name: t.name ?? t.Value ?? t.value,
  //           checked: !!(t.checked ?? t.is_checked ?? t.IsChecked),
  //         }));
  //         setTags(j2?.success ? normalizedTags : []);
  //
  //         // faqs
  //         const j3 = await safeJsonFetch(`${API_BASE}/subchild/${childId}/questions`);
  //         const normalizedFaqs = (j3?.data || []).map((q) => ({
  //           id: q.id ?? q.QuestionNoId,
  //           question: q.question ?? q.QuestionTitle,
  //         }));
  //         if (j3?.success && normalizedFaqs.length) {
  //           setFaqs(normalizedFaqs);
  //           setFaqEnabled(true);
  //         } else {
  //           setFaqs([]);
  //           setFaqEnabled(false);
  //         }
  //       } catch (err) {
  //         console.error("Tags/FAQs error:", err);
  //         setTags([]);
  //         setFaqs([]);
  //         setFaqEnabled(false);
  //       }
  //     },
  //     [detailForm?.QueryID]
  // );

  // 3) SubCatChild / ChildCategoryID -> resolve child id (if needed), then load tags/faqs
  // useEffect(() => {
  //   const run = async () => {
  //     const childName = detailForm?.SubCatChild?.trim();
  //     let childId = detailForm?.ChildCategoryID;
  //
  //     // nothing chosen
  //     if (!childName && !childId) {
  //       setTags([]);
  //       setFaqs([]);
  //       setFaqEnabled(false);
  //       return;
  //     }
  //
  //     try {
  //       // if only name is present, resolve ID
  //       if (!childId && childName) {
  //         const j1 = await safeJsonFetch(
  //             `${API_BASE}/subchild/by-name?name=${encodeURIComponent(childName)}`
  //         );
  //         if (!j1?.success || !(j1.data?.id ?? j1.data?.SCCID)) {
  //           setTags([]); setFaqs([]); setFaqEnabled(false);
  //           return;
  //         }
  //         childId = j1.data.id ?? j1.data.SCCID;
  //         setDetailForm((prev) => ({ ...prev, ChildCategoryID: childId }));
  //       }
  //
  //       if (childId) {
  //         await loadTagsAndFaqs(childId);
  //       }
  //     } catch (err) {
  //       console.error("Sub-child flow failed:", err);
  //       setTags([]);
  //       setFaqs([]);
  //       setFaqEnabled(false);
  //     }
  //   };
  //
  //   run();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [detailForm.SubCatChild, detailForm.ChildCategoryID, detailForm.QueryID]);

  // ---------------------------
  // Validate + Save
  // ---------------------------
  const validate = () => {
    const e = [];
    if (!detailForm.ComplaintSource || detailForm.ComplaintSource === "--Select--") {
      e.push("Source can't be empty.");
    }
    if (!phoneNo || !callerName) {
      e.push("Must select Caller (CLI and Name required).");
    }
    if (roleName === "FOE") {
      if (!detailForm.MainCat) e.push("Select main category.");
      if (!detailForm.Category) e.push("Select category (subcategory).");
    }
    return e;
  };

  const handleSaveDetails = async () => {
    const v = validate();
    if (v.length) { setErrors(v); return; }
    setErrors([]);

    const selectedTagIds = tags.filter((t) => t.checked).map((t) => t.id);

    const ADRQuery         = detailForm.ADRQuery ? "ADR Query" : " ";
    const COVID            = detailForm.COVID ? "COVID-19" : " ";
    const AgeAboveFifty    = detailForm.AgeAboveFifty ? "Age > 50" : " ";
    const Domesticviolence = detailForm.Domesticviolence ? "Gender Base Violence" : " ";
    const WomenRelated     = detailForm.WomenRelated ? "Women Related" : " ";
    const WomenProperty    = detailForm.WomenProperty ? "Women Property" : " ";
    const ShortQuery       = detailForm.ShortQuery ? "1" : "0";

    const payload = {
      ModifiedBy: detailForm.ModifiedBy || detailForm.Agentid || "",
      ContactPerson: callerName || detailForm.ContactPerson || "",
      ContactNumber: phoneNo || detailForm.ContactNumber || "",

      CategoryName: detailForm.MainCat || "",      // main
      SubCategoryName: detailForm.Category || "",  // subcategory (your UI "Category")
      SubCatChild: detailForm.SubCatChild || "",   // child label (optional)

      ComplaintSource: detailForm.ComplaintSource || "",
      Priority: detailForm.Priority || "",

      SMSText: detailForm.SMSText || "",
      Query: detailForm.Query || "",
      Solution: detailForm.Solution || "",

      AdditionalInfo1: ADRQuery,
      COVID,
      AgeAboveFifty,
      Domesticviolence,
      AdditionalInfo2: WomenRelated,
      WomenProperty,
      FurtherHelp: detailForm.FurtherHelp || "",
      SindhGovDept: detailForm.SindhGovDept || "",

      TagIds: selectedTagIds,

      AdditionalInfo3: roleName === "FOE" ? "1" : (detailForm.AdditionalInfo3 || "0"),
      ShortQuery,

      CategoryID: detailForm.CategoryID || null,        // subcategory id
      SubCategoryID: detailForm.SubCategoryID || null,  // deeper level if you add later
      ChildCategoryID: detailForm.ChildCategoryID || null,
    };

    if (!detailForm.QueryID) {
      setErrors(["Missing QueryID (ComplaintID)."]);
      return;
    }

    try {
      setSaving(true);
      await axios.put(`${API_BASE}/complaints/${detailForm.QueryID}`, payload);
      alert("Query updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to update query.");
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
      <div className="container-fluid p-2">
        <div className="card p-3 shadow-sm rounded-3">
          <h5 className="mb-3">Query Details</h5>

          {errors.length > 0 && (
              <div className="alert alert-danger py-2">
                {errors.map((x, i) => <div key={i}>{x}</div>)}
              </div>
          )}

          <div className="row g-1">
            {/* IDs / meta */}
            <div className="col-md-2">
              <label className="form-label">Query ID</label>
              <input
                  name="QueryID"
                  value={detailForm.QueryID || ""}
                  onChange={handleInputChange}
                  className="form-control form-control-sm"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Status</label>
              <input
                  className="form-control form-control-sm"
                  value={detailForm.JobStatus || "Initiated"}
                  disabled
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Launched By</label>
              <input
                  name="Created"
                  value={detailForm.Created || ""}
                  onChange={handleInputChange}
                  className="form-control form-control-sm"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Accepted By</label>
              <input
                  name="Modified"
                  value={detailForm.Modified || ""}
                  onChange={handleInputChange}
                  className="form-control form-control-sm"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Launched On</label>
              <input
                  type="date"
                  name="CreatedOn"
                  value={detailForm.CreatedOn || ""}
                  onChange={handleInputChange}
                  className="form-control form-control-sm"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Accepted On</label>
              <input
                  type="date"
                  name="ModifiedOn"
                  value={detailForm.ModifiedOn || ""}
                  onChange={handleInputChange}
                  className="form-control form-control-sm"
              />
            </div>

            {/* Main Category */}
            <div className="col-md-3">
              <label className="form-label">Main Category</label>
              <select
                  name="MainCat"
                  value={detailForm.MainCat || ""}
                  onChange={handleMainCatChange}
                  className="form-select form-select-sm"
              >
                <option value="">--Select--</option>
                {categories.map((c) => (
                    <option key={c.id ?? c.ID ?? c.name} value={c.name ?? c.CCDescription}>
                      {c.name ?? c.CCDescription}
                    </option>
                ))}
              </select>
            </div>

            {/* Category (UI) = Subcategory (DB) */}
            <div className="col-md-3">
              <label className="form-label">Category (Subcategory)</label>
              <select
                  className="form-select form-select-sm"
                  value={detailForm.Category || ""}
                  onChange={handleCategoryChange}
              >
                {subCategories.length === 0 && <option value="">-- No Subcategories --</option>}
                {subCategories.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Sub Category (Child) */}
            <div className="col-md-3">
              <label className="form-label">Sub Category (Child)</label>
              <select
                  className="form-select form-select-sm"
                  value={detailForm.SubCatChild || ""}
                  onChange={handleChildChange}
              >
                <option value="">--Select Sub-Child--</option>
                {children.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* FAQ */}
            <div className="col-md-3">
              <label className="form-label">FAQ</label>
              <select
                  className="form-select form-select-sm"
                  disabled={!faqEnabled}
                  value={detailForm.FAQ || ""}
                  onChange={(e) => setDetailForm((prev) => ({ ...prev, FAQ: e.target.value }))}
              >
                <option value="">--Select--</option>
                {faqs.map((f) => (
                    <option key={f.id} value={f.id}>{f.question}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="col-md-3">
              <label className="form-label">Old Tags</label>
              <select
                  name="OldTagId"                      // store selected id in detailForm.OldTagId
                  value={detailForm.OldTagId || ""}    // keep controlled
                  onChange={handleInputChange}
                  className="form-select form-select-sm"
              >
                <option value="">--Select Old Tag--</option>
                {oldTagOptions.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                ))}
              </select>
            </div>


            {/* Referred To + Short Query + Priority (same row) */}
            <div className="col-12 d-flex align-items-center gap-3 mt-1">
              <div className="form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="isReferred"
                    name="IsReferred"
                    checked={!!detailForm.IsReferred}
                    onChange={handleInputChange}
                />
                <label className="form-check-label ms-1" htmlFor="isReferred">
                  Referred To
                </label>
              </div>

              <div style={{ minWidth: 260 }}>
                <select
                    name="SelectedAgent"
                    value={detailForm.SelectedAgent || ""}
                    onChange={handleInputChange}
                    className="form-select form-select-sm"
                    disabled={!detailForm.IsReferred}
                >
                  <option value="">--Select Agent To Transfer Query--</option>
                  {agents.map((agent, idx) => (
                      <option key={idx} value={agent.FullName}>
                        {agent.FullName}
                      </option>
                  ))}
                </select>
              </div>

              <div className="form-check ms-2">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="shortQuery"
                    name="ShortQuery"
                    checked={!!detailForm.ShortQuery}
                    onChange={handleInputChange}
                />
                <label className="form-check-label ms-1" htmlFor="shortQuery">
                  Short Query
                </label>
              </div>

              <div className="ms-auto d-flex align-items-center">
                <label className="form-label me-2 mb-0">Priority:</label>
                <select
                    name="Priority"
                    value={detailForm.Priority || "Normal"}
                    onChange={handleInputChange}
                    className="form-select form-select-sm"
                    style={{ minWidth: 120 }}
                >
                  <option>High</option>
                  <option>Normal</option>
                  <option>Low</option>
                </select>
              </div>
            </div>

            {/* Source + Further Help + Sindh Gov Dept */}
            <div className="col-12 d-flex align-items-center gap-3 mt-1">
              <div className="d-flex align-items-center" style={{ minWidth: 320 }}>
                <label className="form-label me-2 mb-0">Source</label>
                <select
                    name="ComplaintSource"
                    value={detailForm.ComplaintSource || ""}
                    onChange={handleInputChange}
                    className="form-select form-select-sm bg-warning fw-bold"
                    style={{ minWidth: 200 }}
                >
                  <option value="">--Select--</option>
                  <option>Incoming call</option>
                  <option>Outbound call</option>
                  <option>Voicemail</option>
                  <option>Email</option>
                </select>
              </div>

              <div className="d-flex align-items-center flex-grow-1">
                <label className="form-label me-2 mb-0">Further Help:</label>
                <input
                    type="text"
                    name="FurtherHelp"
                    value={detailForm.FurtherHelp || ""}
                    onChange={handleInputChange}
                    className="form-control form-control-sm"
                />
              </div>

              <div className="d-flex align-items-center" style={{ minWidth: 360 }}>
                <label className="form-label me-2 mb-0">Sindh Gov Department</label>
                <select
                    name="SindhGovDept"
                    value={detailForm.SindhGovDept || ""}
                    onChange={handleInputChange}
                    className="form-select form-select-sm bg-warning fw-bold"
                    style={{ minWidth: 200 }}
                >
                  {sindhGovDepartments.map((dept, index) => (
                      <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Text areas */}
            <div className="col-md-6">
              <label className="form-label">Query</label>
              <textarea
                  name="Query"
                  value={detailForm.Query || ""}
                  onChange={handleInputChange}
                  rows={2}
                  className="form-control form-control-sm"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Solution</label>
              <textarea
                  name="Solution"
                  value={detailForm.Solution || ""}
                  onChange={handleInputChange}
                  rows={2}
                  className="form-control form-control-sm"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">SMS Text</label>
              <textarea
                  name="SMSText"
                  value={detailForm.SMSText || ""}
                  onChange={handleInputChange}
                  rows={2}
                  className="form-control form-control-sm"
              />
            </div>

            {/* Select Tags */}
            <div className="col-md-3">
              <label className="form-label">Select Tags</label>
              <select
                  name="SelectedTag"
                  value={detailForm.SelectedTag || ""}
                  onChange={handleSelectChange}
                  className="form-select form-select-sm"
              >
                <option value="">--Select Tag--</option>
                {tagOptions.map(tag => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                ))}
              </select>
            </div>

            {/* MFL */}
            <div className="col-md-3">
              <label className="form-label">For MFL</label>
              <select
                  name="MFL"
                  value={detailForm.MFL || ""}
                  onChange={handleSelectChange}
                  className="form-select form-select-sm"
              >
                <option value="">--Select MFL--</option>
                {mflList.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                ))}
              </select>
            </div>

            {/* WRLMP */}
            <div className="col-md-3">
              <label className="form-label">For WRLMP</label>
              <select
                  name="WRLMP"
                  value={detailForm.WRLMP || ""}
                  onChange={handleSelectChange}
                  className="form-select form-select-sm"
              >
                <option value="">--Select WRLMP--</option>
                {wrlmpList.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                ))}
              </select>
            </div>
            {/* Actions */}
            <div className="col-12 text-end mt-3">
              <button className="btn btn-secondary btn-sm me-2" onClick={uncheckAll}>
                Uncheck All Tags
              </button>
              <button
                  className="btn btn-success btn-sm"
                  onClick={handleSaveDetails}
                  disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
