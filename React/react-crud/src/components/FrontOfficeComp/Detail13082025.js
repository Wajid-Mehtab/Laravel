import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axios from "axios";

/***********************************
 * Constants
 ***********************************/
const API_BASE = "http://localhost:8000/api";
export const sindhGovDepartments = [
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
  "Other Province",
];

/***********************************
 * Low-level Fetch Helpers
 ***********************************/
async function safeJsonFetch(url, init) {
  const res = await fetch(url, init);
  const text = await res.text();
  console.log("FETCH:", url, res.status);

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

/***********************************
 * API Client (all endpoints in one place)
 ***********************************/
const Api = {
  // Lists
  getMFLTags: () => safeJsonFetch(`${API_BASE}/tags/mfl`),
  getWRLMPTags: () => safeJsonFetch(`${API_BASE}/tags/wrlmp`),
  getAgents: () => safeJsonFetch(`${API_BASE}/transfer/agents`),
  getOldTagOptions: () => safeJsonFetch(`${API_BASE}/tags/old`),

  // Category trees
  getSubcategories: (main) =>
      safeJsonFetch(`${API_BASE}/subcategories?category=${encodeURIComponent(main)}`),
  getSubchildren: (subCategoryId) =>
      safeJsonFetch(`${API_BASE}/subchildren?subcategory_id=${subCategoryId}`),
  resolveChildByName: (name) =>
      safeJsonFetch(`${API_BASE}/subchild/by-name?name=${encodeURIComponent(name)}`),

  // Saved selections for a complaint
  getSavedSelections: (queryId) =>
      safeJsonFetch(`${API_BASE}/complaints/${encodeURIComponent(queryId)}/selections`).catch(
          () => null
      ),

  // Update complaint
  updateComplaint: (queryId, payload) => axios.put(`${API_BASE}/complaints/${queryId}`, payload),
};

/***********************************
 * Module-scope caches (survive remounts)
 ***********************************/
const selectionsCache = new Map(); // key: QueryID -> { OldTagIds, MFLIds, WRLMPIds, TagIds, MainTags, TagMFL, TagWRLMP }
const listCache = {
  mfl: null,
  wrlmp: null,
  old: null,
  agents: null,
};
const skey = (qid) => String(qid);

/***********************************
 * Shape Normalizers (reserved)
 ***********************************/
function normalizeTags(items) {
  const arr = Array.isArray(items) ? items : [];
  return arr.map((t) => ({
    id: t.id ?? t.ID,
    name: t.name ?? t.Value ?? t.value,
    checked: !!(t.checked ?? t.is_checked ?? t.IsChecked),
  }));
}

function normalizeFaqs(items) {
  const arr = Array.isArray(items) ? items : [];
  return arr.map((q) => ({
    id: q.id ?? q.QuestionNoId,
    question: q.question ?? q.QuestionTitle,
  }));
}

/***********************************
 * ID helpers + CSV helpers + mappers
 ***********************************/
const asKey = (x) => String(x);

// IDs -> NAMES
const namesFromIds = (ids = [], options = []) => {
  const byId = new Map(options.map((o) => [asKey(o.id), String(o.name ?? "").trim()]));
  const unique = Array.from(new Set((ids || []).map(asKey)));
  return unique
      .map((id) => byId.get(id) || "")
      .filter((n) => n.length > 0);
};

// CSV -> array of tokens (supports comma/semicolon)
const splitCsv = (val) =>
    String(val ?? "")
        .split(/[;,]/)
        .map((x) => x.trim())
        .filter((x) => x.length > 0);

// NAMES -> IDs
const idsFromNames = (names = [], options = []) => {
  const byName = new Map(
      options.map((o) => [String(o.name ?? "").trim().toLowerCase(), asKey(o.id)])
  );
  const uniq = Array.from(new Set((names || []).map((n) => String(n).trim().toLowerCase())));
  return uniq.map((n) => byName.get(n)).filter(Boolean);
};

/***********************************
 * Validation
 ***********************************/
function validate(detailForm, phoneNo, callerName, roleName) {
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
}

/***********************************
 * Small UI helper: Checkbox Multi-Select (Bootstrap dropdown)
 ***********************************/
function MultiCheckSelect({ label, placeholder = "--Select--", options = [], checkedIds = [], onToggle }) {
  const count = checkedIds.length;
  const summary = count === 0 ? placeholder : `${count} selected`;
  const checkedSet = new Set(checkedIds.map(asKey));
  return (
      <div className="dropdown w-100">
        <button
            className="btn btn-outline-secondary btn-sm dropdown-toggle w-100 text-start"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
        >
          <span className="me-2">{label}:</span>
          <span className="fw-semibold">{summary}</span>
        </button>
        <div className="dropdown-menu p-2" style={{ minWidth: 280, maxHeight: 260, overflowY: 'auto' }}>
          {options.length === 0 && <div className="text-muted small px-2">No options</div>}
          {options.map((opt) => {
            const key = asKey(opt.id);
            return (
                <label key={key} className="dropdown-item d-flex align-items-center gap-2">
                  <input
                      type="checkbox"
                      className="form-check-input m-0"
                      checked={checkedSet.has(key)}
                      onChange={() => onToggle(key)}
                  />
                  <span>{opt.name}</span>
                </label>
            );
          })}
        </div>
      </div>
  );
}

/***********************************
 * Component
 ***********************************/
export default function DetailTab({
                                    detailForm,
                                    setDetailForm,
                                    phoneNo = "",
                                    callerName = "",
                                    roleName = "FO", // use "FOE" for stricter validation
                                    categories = [], // used for main categories dropdown
                                    // external tag buckets (if you render elsewhere, we keep these in sync on uncheckAll)
                                    mflTags = [],
                                    setMflTags = () => {},
                                    oldTags = [],
                                    setOldTags = () => {},
                                    wrlmpTags = [],
                                    setWrlmpTags = () => {},
                                  }) {
  /********** State **********/
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  const [subCategories, setSubCategories] = useState([]); // [{id,name}]
  const [children, setChildren] = useState([]); // [{id,name}]
  const [tags, setTags] = useState([]); // reserved if you later add tag APIs
  const [faqs, setFaqs] = useState([]); // [{id,question}]
  const [faqEnabled, setFaqEnabled] = useState(false);

  const [tagOptions, setTagOptions] = useState([]); // select options derived from tags
  const [mflList, setMflList] = useState(listCache.mfl || []); // MFL list
  const [wrlmpList, setWrlmpList] = useState(listCache.wrlmp || []); // WRLMP list
  const [agents, setAgents] = useState(listCache.agents || []);
  const [oldTagOptions, setOldTagOptions] = useState(listCache.old || []); // [{id,name, code/slug?}]

  // One-time/force fetch state across remounts
  const loadedSelectionsRef = useRef(false); // component-level
  const selectionsFetchStateRef = useRef("idle"); // "idle" | "loading" | "loaded"

  /***********************************
   * Loaders (with module-level caches)
   ***********************************/
  const loadMflWrlmp = useCallback(async () => {
    if (Array.isArray(listCache.mfl) && Array.isArray(listCache.wrlmp)) {
      setMflList(listCache.mfl);
      setWrlmpList(listCache.wrlmp);
      console.log("⚡ lists from cache: MFL/WRLMP");
      return;
    }
    try {
      const [mflJson, wrJson] = await Promise.all([Api.getMFLTags(), Api.getWRLMPTags()]);
      const mfl = mflJson?.success ? mflJson.data || [] : [];
      const wr = wrJson?.success ? wrJson.data || [] : [];
      listCache.mfl = mfl;
      listCache.wrlmp = wr;
      setMflList(mfl);
      setWrlmpList(wr);
      console.log("⬇️ lists fetched: MFL/WRLMP");
    } catch (e) {
      console.error("MFL/WRLMP load error", e);
      setMflList([]);
      setWrlmpList([]);
    }
  }, []);

  const loadAgents = useCallback(async () => {
    if (Array.isArray(listCache.agents)) {
      setAgents(listCache.agents);
      console.log("⚡ agents from cache");
      return;
    }
    try {
      const j = await Api.getAgents();
      const a = j?.success ? j.data || [] : [];
      listCache.agents = a;
      setAgents(a);
    } catch (e) {
      console.error("Agents load error", e);
    }
  }, []);

  const loadOldTags = useCallback(async () => {
    if (Array.isArray(listCache.old)) {
      setOldTagOptions(listCache.old);
      // Ensure OldTagIds is always an array for MultiCheckSelect (use legacy OldTagId if present)
      setDetailForm((prev) => ({
        ...prev,
        OldTagIds: Array.isArray(prev.OldTagIds) ? prev.OldTagIds : (prev.OldTagId ? [String(prev.OldTagId)] : []),
      }));
      console.log("⚡ old tags from cache");
      return;
    }
    try {
      const json = await Api.getOldTagOptions();
      const opts = json?.success ? json.data || [] : [];
      listCache.old = opts;
      setOldTagOptions(opts);
      // Ensure OldTagIds is always an array for MultiCheckSelect (use legacy OldTagId if present)
      setDetailForm((prev) => ({
        ...prev,
        OldTagIds: Array.isArray(prev.OldTagIds) ? prev.OldTagIds : (prev.OldTagId ? [String(prev.OldTagId)] : []),
      }));
      console.log("⬇️ old tags fetched");
    } catch (e) {
      console.error("Old tags load error", e);
      setOldTagOptions([]);
    }
  }, [setDetailForm]);

  const loadSubCats = useCallback(
      async (main) => {
        if (!main) {
          setSubCategories([]);
          return;
        }
        try {
          const json = await Api.getSubcategories(main);
          if (json?.success) {
            const data = Array.isArray(json.data) ? json.data : [];
            setSubCategories(data);

            // keep CategoryID from server object if provided and not already set
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
      },
      [detailForm.Category, setDetailForm]
  );

  const pickFirstChildByName = useCallback(
      async (subCatId) => {
        try {
          const j = await Api.getSubchildren(subCatId);
          const kids = j?.success ? j.data || [] : [];
          setChildren(kids);

          if (kids.length > 0) {
            const firstName = kids[0].name;

            // set selected child name first (so UI updates)
            setDetailForm((prev) => ({
              ...prev,
              SubCatChild: firstName,
              ChildCategoryID: null, // force by-name resolution
              FAQ: "",
            }));

            // resolve ID via **by-name** (NOT by id)
            const r = await Api.resolveChildByName(firstName);
            const childId = r?.data?.id ?? r?.data?.SCCID ?? null;
            if (childId) {
              setDetailForm((prev) => ({ ...prev, ChildCategoryID: childId }));
            }
          } else {
            // no children for this subcategory
            setDetailForm((prev) => ({
              ...prev,
              SubCatChild: "",
              ChildCategoryID: null,
              FAQ: "",
            }));
          }
        } catch (err) {
          console.error("pickFirstChildByName error:", err);
          setChildren([]);
          setDetailForm((prev) => ({
            ...prev,
            SubCatChild: "",
            ChildCategoryID: null,
            FAQ: "",
          }));
        }
      },
      [setDetailForm]
  );

  /***********************************
   * Saved selections loader with cache
   ***********************************/
  const applySelectionsToState = useCallback(
      (sel) => {
        if (!sel) return;
        setDetailForm((prev) => ({
          ...prev,
          PreselectedTagIds: Array.isArray(sel.TagIds) ? sel.TagIds.map(asKey) : prev.PreselectedTagIds,
          MFLIds: Array.isArray(sel.MFLIds) ? sel.MFLIds.map(asKey) : prev.MFLIds,
          WRLMPIds: Array.isArray(sel.WRLMPIds) ? sel.WRLMPIds.map(asKey) : prev.WRLMPIds,
          OldTagIds: Array.isArray(sel.OldTagIds) ? sel.OldTagIds.map(asKey) : prev.OldTagIds,
        }));
      },
      [setDetailForm]
  );

  const loadSavedSelectionsIfAny = useCallback(
      async (force = false) => {
        const qid = detailForm?.QueryID;
        if (!qid) return;
        const k = skey(qid);

        // 1) Short-circuit from cache when not forced
        if (!force && selectionsCache.has(k)) {
          console.log("♻️ Using cached selections for", k, selectionsCache.get(k));
          applySelectionsToState(selectionsCache.get(k));
          return;
        }

        // 2) Fetch from server
        let server = null;
        try {
          server = await Api.getSavedSelections(qid);
        } catch (e) {
          server = null;
        }
        const src = server?.data ?? server ?? {};

        // Prefer arrays if present (backward-compat)
        let TagIdsArr = Array.isArray(src.TagIds) ? src.TagIds : [];
        let MFLIdsArr = Array.isArray(src.MFLIds) ? src.MFLIds : [];
        let WRIdsArr = Array.isArray(src.WRLMPIds) ? src.WRLMPIds : [];
        let OldIdsArr = Array.isArray(src.OldTagIds) ? src.OldTagIds : [];

        // If arrays missing but NAMES CSV present
        if (OldIdsArr.length === 0 && (src.MainTags ?? "").length > 0) {
          const names = splitCsv(src.MainTags);
          OldIdsArr = idsFromNames(names, listCache.old || oldTagOptions);
        }
        if (MFLIdsArr.length === 0 && (src.TagMFL ?? "").length > 0) {
          const names = splitCsv(src.TagMFL);
          MFLIdsArr = idsFromNames(names, listCache.mfl || mflList);
        }
        if (WRIdsArr.length === 0 && (src.TagWRLMP ?? "").length > 0) {
          const names = splitCsv(src.TagWRLMP);
          WRIdsArr = idsFromNames(names, listCache.wrlmp || wrlmpList);
        }

        // Also handle CSV-of-IDs (just in case)
        const csvIdsToArr = (v) => splitCsv(v).map(asKey);
        if (TagIdsArr.length === 0 && typeof src.TagIds === "string") TagIdsArr = csvIdsToArr(src.TagIds);
        if (MFLIdsArr.length === 0 && typeof src.MFLIds === "string") MFLIdsArr = csvIdsToArr(src.MFLIds);
        if (WRIdsArr.length === 0 && typeof src.WRLMPIds === "string") WRIdsArr = csvIdsToArr(src.WRLMPIds);
        if (OldIdsArr.length === 0 && typeof src.OldTagIds === "string") OldIdsArr = csvIdsToArr(src.OldTagIds);

        // 3) Normalize + cache
        const normalized = {
          TagIds: TagIdsArr.map(asKey),
          MFLIds: MFLIdsArr.map(asKey),
          WRLMPIds: WRIdsArr.map(asKey),
          OldTagIds: OldIdsArr.map(asKey),
          MainTags: src.MainTags ?? "",
          TagMFL: src.TagMFL ?? "",
          TagWRLMP: src.TagWRLMP ?? "",
        };
        selectionsCache.set(k, normalized);
        console.log("⬇️ Fetched & cached selections for", k, normalized);

        // 4) Apply to state
        applySelectionsToState(normalized);
      },
      [detailForm?.QueryID, applySelectionsToState, oldTagOptions, mflList, wrlmpList]
  );

  /***********************************
   * Fetch-once wrapper: initial load only; force after save
   ***********************************/
  const fetchSelectionsOnce = useCallback(
      async (force = false) => {
        const qid = detailForm?.QueryID;
        if (!qid) return;

        // Concurrency + once guards (component-level)
        if (!force) {
          if (loadedSelectionsRef.current) return; // already applied once in this mount
          if (selectionsFetchStateRef.current !== "idle") return; // in-flight or already loaded
        } else {
          // force: allow only if currently not loading
          if (selectionsFetchStateRef.current === "loading") return;
        }

        selectionsFetchStateRef.current = "loading";
        try {
          const k = skey(qid);
          console.log(
              force
                  ? "🔁 Forcing /selections (and cache refresh) after save"
                  : selectionsCache.has(k)
                      ? "♻️ Using cache on mount (no network)"
                      : "🟢 One-time /selections fetch on first mount",
          );
          await loadSavedSelectionsIfAny(force);
          loadedSelectionsRef.current = true;
          selectionsFetchStateRef.current = "loaded";
        } catch (e) {
          console.error("selections fetch failed", e);
          selectionsFetchStateRef.current = "loaded"; // avoid loops
        }
      },
      [detailForm?.QueryID, loadSavedSelectionsIfAny]
  );

  /***********************************
   * Effects (call loaders)
   ***********************************/
  useEffect(() => {
    loadMflWrlmp();
    loadAgents();
    loadOldTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset fetch guards when QueryID changes
  useEffect(() => {
    loadedSelectionsRef.current = false;
    selectionsFetchStateRef.current = "idle";
  }, [detailForm?.QueryID]);

  useEffect(() => {
    loadSubCats(detailForm?.MainCat);
  }, [detailForm?.MainCat, loadSubCats]);

  // Only once when lists are available (first mount or after remount)
  useEffect(() => {
    if (!detailForm?.QueryID) return;

    const listsReady = (oldTagOptions.length > 0 || (listCache.old && listCache.old.length > 0)) ||
        (mflList.length > 0 || (listCache.mfl && listCache.mfl.length > 0)) ||
        (wrlmpList.length > 0 || (listCache.wrlmp && listCache.wrlmp.length > 0));
    if (!listsReady) return;

    fetchSelectionsOnce(false);
  }, [detailForm?.QueryID, oldTagOptions.length, mflList.length, wrlmpList.length, fetchSelectionsOnce]);

  // Rehydrate from cached names if IDs were empty when lists weren't ready
  useEffect(() => {
    const qid = detailForm?.QueryID;
    if (!qid) return;
    const k = skey(qid);
    const cached = selectionsCache.get(k);
    if (!cached) return;

    const needOld = (!Array.isArray(detailForm.OldTagIds) || detailForm.OldTagIds.length === 0) &&
        (cached.MainTags || "").length > 0 && oldTagOptions.length > 0;
    const needMfl = (!Array.isArray(detailForm.MFLIds) || detailForm.MFLIds.length === 0) &&
        (cached.TagMFL || "").length > 0 && mflList.length > 0;
    const needWr  = (!Array.isArray(detailForm.WRLMPIds) || detailForm.WRLMPIds.length === 0) &&
        (cached.TagWRLMP || "").length > 0 && wrlmpList.length > 0;
    if (!needOld && !needMfl && !needWr) return;

    const next = { ...cached };
    if (needOld) next.OldTagIds = idsFromNames(splitCsv(cached.MainTags), oldTagOptions).map(asKey);
    if (needMfl) next.MFLIds    = idsFromNames(splitCsv(cached.TagMFL), mflList).map(asKey);
    if (needWr)  next.WRLMPIds  = idsFromNames(splitCsv(cached.TagWRLMP), wrlmpList).map(asKey);

    selectionsCache.set(k, next);
    applySelectionsToState(next);
    console.log("🔁 Rehydrated selections from names after lists ready", next);
  }, [detailForm?.QueryID, oldTagOptions, mflList, wrlmpList, applySelectionsToState]);

  /***********************************
   * Visibility derived from Old Tags
   ***********************************/
  const { showMFL, showWRLMP } = useMemo(() => {
    const selectedOld = (Array.isArray(detailForm.OldTagIds) ? detailForm.OldTagIds : [])
        .map((id) => oldTagOptions.find((o) => asKey(o.id) === asKey(id)))
        .filter(Boolean);

    const hasFlag = (tag, needle) => {
      const name = String(tag.name || "").toLowerCase();
      const code = String(tag.code || tag.slug || "").toLowerCase();
      const n = String(needle).toLowerCase();
      return name.includes(n) || code.includes(n);
    };

    const mfl = selectedOld.some((t) => hasFlag(t, "mfl"));
    const wr = selectedOld.some((t) => hasFlag(t, "wrlmp") || hasFlag(t, "wrlm") || hasFlag(t, "wr"));
    return { showMFL: mfl, showWRLMP: wr };
  }, [detailForm.OldTagIds, oldTagOptions]);

  /***********************************
   * Handlers (UI -> state)
   ***********************************/
  function handleSelectChange(e) {
    const { name, value } = e.target;
    setDetailForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleInputChange(e) {
    const { name, value, type, checked } = e.target;
    setDetailForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function handleMainCatChange(e) {
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
    setTagOptions([]);
    setFaqs([]);
    setFaqEnabled(false);
  }

  async function handleCategoryChange(e) {
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
    setTagOptions([]);
    setFaqs([]);
    setFaqEnabled(false);

    // load children & auto-pick first, then resolve **by-name**
    if (found?.id) {
      await pickFirstChildByName(found.id);
    }
  }

  async function handleChildChange(e) {
    const pickedName = e.target.value;

    // set name first so UI reflects change
    setDetailForm((prev) => ({
      ...prev,
      SubCatChild: pickedName,
      ChildCategoryID: null, // force by-name resolve
      FAQ: "",
    }));

    try {
      const r = await Api.resolveChildByName(pickedName);
      const childId = r?.data?.id ?? r?.data?.SCCID ?? null;
      if (childId) {
        setDetailForm((prev) => ({ ...prev, ChildCategoryID: childId }));
      }
    } catch (err) {
      console.error("handleChildChange by-name resolve failed:", err);
    }
  }

  function uncheckAll() {
    setTags((prev) => prev.map((t) => ({ ...t, checked: false })));
    setMflTags((prev) => prev.map((x) => ({ ...x, checked: false })));
    setOldTags((prev) => prev.map((x) => ({ ...x, checked: false })));
    setWrlmpTags((prev) => prev.map((x) => ({ ...x, checked: false })));
    setDetailForm((prev) => ({ ...prev, MFLIds: [], WRLMPIds: [], OldTagIds: [] }));
  }

  // toggle helper for multi-select arrays kept in detailForm (string-normalized)
  function toggleIdInArray(field, id) {
    const key = asKey(id);
    setDetailForm((prev) => {
      const arr = Array.isArray(prev[field]) ? prev[field].map(asKey) : [];
      const exists = arr.includes(key);
      const next = exists ? arr.filter((x) => x !== key) : [...arr, key];
      return { ...prev, [field]: next };
    });
  }

  /***********************************
   * Build payload (send NAMES for MainTags/TagMFL/TagWRLMP)
   ***********************************/
  function buildPayload(detailForm, tags, roleName, phoneNo, callerName) {
    const selectedTagIds = (tags || []).filter((t) => t.checked).map((t) => t.id);

    const ADRQuery = detailForm.ADRQuery ? "ADR Query" : " ";
    const COVID = detailForm.COVID ? "COVID-19" : " ";
    const AgeAboveFifty = detailForm.AgeAboveFifty ? "Age > 50" : " ";
    const Domesticviolence = detailForm.Domesticviolence ? "Gender Base Violence" : " ";
    const WomenRelated = detailForm.WomenRelated ? "Women Related" : " ";
    const WomenProperty = detailForm.WomenProperty ? "Women Property" : " ";
    const ShortQuery = detailForm.ShortQuery ? "1" : "0";

    // current selected IDs (arrays)
    const mflIds = Array.isArray(detailForm.MFLIds) ? detailForm.MFLIds : [];
    const wrlmpIds = Array.isArray(detailForm.WRLMPIds) ? detailForm.WRLMPIds : [];
    const oldIds = Array.isArray(detailForm.OldTagIds) ? detailForm.OldTagIds : [];

    // 👉 convert IDs → NAMES for saving (comma-separated values)
    const oldNamesCsv = namesFromIds(oldIds, listCache.old || oldTagOptions).join(",");
    const mflNamesCsv = namesFromIds(mflIds, listCache.mfl || mflList).join(",");
    const wrlmpNamesCsv = namesFromIds(wrlmpIds, listCache.wrlmp || wrlmpList).join(",");

    return {
      ModifiedBy: detailForm.ModifiedBy || detailForm.Agentid || "",
      ContactPerson: callerName || detailForm.ContactPerson || "",
      ContactNumber: phoneNo || detailForm.ContactNumber || "",

      CategoryName: detailForm.MainCat || "", // main
      SubCategoryName: detailForm.Category || "", // subcategory (UI "Category")
      SubCatChild: detailForm.SubCatChild || "", // child label (optional)

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

      // ✅ send VALUES (names) comma-separated — IDs **not** sent for these
      MainTags: oldNamesCsv, // Old tags (names)
      TagMFL: mflNamesCsv, // MFL (names)
      TagWRLMP: wrlmpNamesCsv, // WRLMP (names)

      // (Optional) legacy single fields
      OldTagId: oldIds[0] ?? detailForm.OldTagId ?? "",
      MFL: mflIds[0] ?? detailForm.MFL ?? "",
      WRLMP: wrlmpIds[0] ?? detailForm.WRLMP ?? "",

      AdditionalInfo3: roleName === "FOE" ? "1" : detailForm.AdditionalInfo3 || "0",
      ShortQuery,

      CategoryID: detailForm.CategoryID || null, // subcategory id
      SubCategoryID: detailForm.SubCategoryID || null, // placeholder (if added later)
      ChildCategoryID: detailForm.ChildCategoryID || null,
    };
  }

  /***********************************
   * Refresh after Save
   ***********************************/
  async function refreshSelectionsAfterSave() {
    // 1) Freeze current (saved) tag ids into PreselectedTagIds (if you later use `tags` list)
    const selectedTagIds = tags.filter((t) => t.checked).map((t) => t.id);
    setDetailForm((prev) => ({
      ...prev,
      PreselectedTagIds: selectedTagIds.map(asKey),
    }));

    // 2) Optionally re-fetch to make server the source of truth (if you add tags/faq APIs)
    const cid = detailForm?.ChildCategoryID;
    const qid = detailForm?.QueryID || "";
    if (cid && qid) {
      // If you later re-enable loadTagsAndFaqs, call it here.
    }
  }

  /***********************************
   * Save Flow
   ***********************************/
  async function handleSaveDetails() {
    const v = validate(detailForm, phoneNo, callerName, roleName);
    if (v.length) {
      setErrors(v);
      return;
    }
    setErrors([]);

    if (!detailForm.QueryID) {
      setErrors(["Missing QueryID (ComplaintID)."]);
      return;
    }

    const payload = buildPayload(detailForm, tags, roleName, phoneNo, callerName);

    // Debug logs
    console.log("🔗 Update URL:", `${API_BASE}/complaints/${detailForm.QueryID}`);
    console.log("📦 Payload names:", {
      MainTags: payload.MainTags,
      TagMFL: payload.TagMFL,
      TagWRLMP: payload.TagWRLMP,
    });

    try {
      setSaving(true);
      const res = await Api.updateComplaint(detailForm.QueryID, payload);

      // (optional) consume res
      const updated = res?.data?.data;
      if (updated && typeof updated === "object") {
        setDetailForm((prev) => ({
          ...prev,
        }));
      }

      // ✅ Save ke baad: cache invalidate + force fetch once
      const k = skey(detailForm.QueryID);
      selectionsCache.delete(k);
      loadedSelectionsRef.current = false; // allow next apply in this mount
      selectionsFetchStateRef.current = "idle"; // reset inflight guard

      await fetchSelectionsOnce(true); // force = true (will refill cache and apply)

      await refreshSelectionsAfterSave();
      alert("Query updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to update query.");
    } finally {
      setSaving(false);
    }
  }  /***********************************
   * Render
   ***********************************/
  return (
      <div className="container-fluid p-2">
        <div className="card p-3 shadow-sm rounded-3">
          <h5 className="mb-3">Query Details</h5>

          {errors.length > 0 && (
              <div className="alert alert-danger py-2">
                {errors.map((x, i) => (
                    <div key={i}>{x}</div>
                ))}
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
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
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
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
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
                    <option key={f.id} value={f.id}>
                      {f.question}
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
                      <option key={index} value={dept}>
                        {dept}
                      </option>
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

            {/* Old Tags (multi-select) */}
            <div className="col-md-3">
              <label className="form-label">Old Tags</label>
              <MultiCheckSelect
                  label="Old Tags"
                  placeholder="--Select Old Tags--"
                  options={oldTagOptions.map(({ id, name }) => ({ id, name }))}
                  checkedIds={Array.isArray(detailForm.OldTagIds) ? detailForm.OldTagIds.map(asKey) : []}
                  onToggle={(id) => toggleIdInArray("OldTagIds", id)}
              />
            </div>

            {/* MFL (multi-select) */}
            <div className="col-md-4">
              <label className="form-label">For MFL</label>
              <MultiCheckSelect
                  label="MFL"
                  placeholder="--Select MFL--"
                  options={mflList.map(({ id, name }) => ({ id, name }))}
                  checkedIds={Array.isArray(detailForm.MFLIds) ? detailForm.MFLIds.map(asKey) : []}
                  onToggle={(id) => toggleIdInArray("MFLIds", id)}
              />
            </div>

            {/* WRLMP (multi-select) */}
            <div className="col-md-4">
              <label className="form-label">For WRLMP</label>
              <MultiCheckSelect
                  label="WRLMP"
                  placeholder="--Select WRLMP--"
                  options={wrlmpList.map(({ id, name }) => ({ id, name }))}
                  checkedIds={Array.isArray(detailForm.WRLMPIds) ? detailForm.WRLMPIds.map(asKey) : []}
                  onToggle={(id) => toggleIdInArray("WRLMPIds", id)}
              />
            </div>

            {/* Actions */}
            <div className="col-12 text-end mt-3">
              <button className="btn btn-secondary btn-sm me-2" onClick={uncheckAll}>
                Uncheck All
              </button>
              <button className="btn btn-success btn-sm" >
                "Send SMS"
              </button>
              <button className="btn btn-success btn-sm" > "View Query"
              </button>
              <button className="btn btn-success btn-sm"> "View Notes"
              </button>
              <button className="btn btn-success btn-sm" >"Complete"
              </button>
              <button className="btn btn-success btn-sm" onClick={handleSaveDetails} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
