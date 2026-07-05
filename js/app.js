// ── CONFIGURATION ──
const SHEET_URL = "YOUR_PRIVATE_SCRIPT_URL";   // <-- Replace with your new private Apps Script URL
const CLIENT_ID = "401103632011-qgjvt6fko9knb651oe6b89rrs12fgobk.apps.googleusercontent.com"; // <-- Replace with your OAuth Client ID
const TARGET_KEY = "health-target-v1";

const C = {
  bg: "#080810", surface: "#11111f", card: "#181828", border: "#1e1e35", muted: "#2a2a45",
  dim: "#6b6b8a", text: "#e2e2f0", white: "#ffffff", indigo: "#818cf8", green: "#34d399",
  red: "#f87171", amber: "#fbbf24", orange: "#fb923c", blue: "#60a5fa", purple: "#a78bfa", teal: "#2dd4bf"
};

let fitData = [], strData = [], target = 70, currentChart = "weight";

// ── OAUTH2 STATE ──
let accessToken = null;
let tokenClient = null;

// ── AUTH FUNCTIONS ──

function initOAuth() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: "https://www.googleapis.com/auth/script.external_request",
    callback: (response) => {
      if (response.access_token) {
        accessToken = response.access_token;
        localStorage.setItem("oauth_token", accessToken);
        updateAuthUI(true);
        console.log("✅ OAuth token obtained");
      } else {
        console.error("❌ OAuth error:", response.error);
        updateAuthUI(false);
      }
    },
  });
}

function signIn() {
  tokenClient.requestAccessToken({ prompt: "consent" });
}

function signOut() {
  if (accessToken) {
    google.accounts.oauth2.revoke(accessToken, () => {
      accessToken = null;
      localStorage.removeItem("oauth_token");
      updateAuthUI(false);
      console.log("✅ Signed out");
    });
  } else {
    localStorage.removeItem("oauth_token");
    updateAuthUI(false);
  }
}

function getAccessToken() {
  const token = localStorage.getItem("oauth_token");
  if (token) {
    accessToken = token;
    return token;
  }
  return null;
}

function isAuthenticated() {
  return !!getAccessToken();
}

function updateAuthUI(isAuthenticated) {
  const dot = document.getElementById("dot");
  const lbl = document.getElementById("dot-label");
  const btnSignin = document.getElementById("btn-signin");
  const btnSignout = document.getElementById("btn-signout");

  if (isAuthenticated) {
    dot.className = "dot ok";
    lbl.textContent = "Authenticated ✅";
    if (btnSignin) btnSignin.style.display = "none";
    if (btnSignout) btnSignout.style.display = "inline-block";
  } else {
    dot.className = "dot err";
    lbl.textContent = "Sign in required";
    if (btnSignin) btnSignin.style.display = "inline-block";
    if (btnSignout) btnSignout.style.display = "none";
  }
}

// ── HELPERS ── (unchanged)

function lowerKeys(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key.toLowerCase()] = obj[key];
    return acc;
  }, {});
}

function sleepH(s) {
  if (!s) return null;
  const clean = String(s).replace("~", "").trim();
  const parts = clean.split(":");
  if (parts.length >= 2) return parseInt(parts[0]) + parseInt(parts[1]) / 60;
  return parseFloat(clean) || null;
}

function recScore(e) {
  if (!e) return null;
  let sc = 100;
  const sl = sleepH(e.sleep);
  if (sl !== null) { if (sl < 5) sc -= 30; else if (sl < 6) sc -= 15; else if (sl >= 7) sc += 5; }
  if (e.rhr) { if (e.rhr > 55) sc -= 20; else if (e.rhr > 50) sc -= 10; else if (e.rhr < 45) sc += 5; }
  if (e.hrv) { if (e.hrv < 40) sc -= 15; else if (e.hrv > 70) sc += 10; }
  return Math.max(0, Math.min(100, sc));
}

function isoToDate(s) {
  if (!s) return null;
  const str = String(s);
  if (/^\d{2}-[A-Za-z]{3}/.test(str)) return str;
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const d = new Date(str);
    const day = String(d.getUTCDate()).padStart(2, "0");
    const mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getUTCMonth()];
    return day + "-" + mon;
  }
  return str;
}

// ── DATA PARSING (unchanged) ──

function parseRow(r) {
  function parseSleep(v) {
    if (!v) return null;
    const s = String(v);
    if (/^~?\d+:\d+$/.test(s.trim())) return s.trim();
    if (s.includes("T")) {
      try {
        const d = new Date(s);
        return d.getUTCHours() + ":" + String(d.getUTCMinutes()).padStart(2, "0");
      } catch (_) { }
    }
    return s;
  }
  const date = isoToDate(r.date) || String(r.date);
  return {
    date,
    weight: r.weight ? parseFloat(r.weight) : null,
    rhr: r.rhr ? parseInt(r.rhr) : null,
    sleep: parseSleep(r.sleep),
    calMin: r.calmin ? parseInt(r.calmin) : null,
    calMax: r.calmax ? parseInt(r.calmax) : null,
    protMin: r.protmin ? parseInt(r.protmin) : null,
    protMax: r.protmax ? parseInt(r.protmax) : null,
    move: r.move ? parseInt(r.move) : null,
    burn: r.totalburn ? parseInt(r.totalburn) : null,
    cardio: r.cardio ? String(r.cardio) : null,
    steps: r.steps ? parseInt(r.steps) : null,
    dist: r.distance ? parseFloat(r.distance) : null,
    hrv: r.hrv ? parseInt(r.hrv) : null,
    notes: r.notes ? String(r.notes) : null,
    run5k: r["5k"] ? String(r["5k"]) : null,
    run10k: r["10k"] ? String(r["10k"]) : null,
  };
}

function parseStrRows(rows) {
  console.log("parseStrRows received", rows.length, "rows");
  const sessions = {};
  rows.forEach(r => {
    const date = isoToDate(r.date) || String(r.date || "");
    const workout = String(r.workout || "").trim();
    const key = date + "|" + workout;
    if (!sessions[key]) sessions[key] = { date, workout, exercises: {} };
    const exName = String(r.exercise || "").trim();
    if (!sessions[key].exercises[exName]) sessions[key].exercises[exName] = [];
    const setCount = parseInt(r.set) || 1;
    for (let i = 0; i < setCount; i++) {
      sessions[key].exercises[exName].push({
        reps: r.reps ? String(r.reps).trim() : "",
        wt: r.weight && String(r.weight).trim().toUpperCase() !== "BW" ? String(r.weight).trim() : null
      });
    }
  });
  return Object.values(sessions).map(s => ({
    date: s.date,
    workout: s.workout,
    exercises: Object.entries(s.exercises).map(([name, sets]) => ({ name, sets }))
  }));
}

// ── UI INDICATORS ──

function setDot(state) {
  const dot = document.getElementById("dot");
  const lbl = document.getElementById("dot-label");
  dot.className = "dot" + (state === "ok" ? " ok" : state === "err" ? " err" : "");
  lbl.textContent = state === "ok" ? "Sheets OK" : state === "err" ? "Sheets Error" : "Connecting";
}

function setSyncMsg(msg, isErr) {
  const el = document.getElementById("sync-msg");
  el.textContent = msg || "";
  el.className = "sync-msg" + (isErr ? " err" : "");
}

// ── FETCH FROM SHEETS (with OAuth token) ──

async function loadFromSheets() {
  setSyncMsg("Loading from Google Sheets...");
  try {
    const token = getAccessToken();
    if (!token) {
      setSyncMsg("Please sign in with Google", true);
      setDot("err");
      return;
    }

    const [fr, sr] = await Promise.all([
      fetch(SHEET_URL + "?sheet=fitness", {
        headers: { "Authorization": "Bearer " + token }
      }).then(r => { if (!r.ok) throw new Error("Fitness GET " + r.status); return r.json(); }),
      fetch(SHEET_URL + "?sheet=strength", {
        headers: { "Authorization": "Bearer " + token }
      }).then(r => { if (!r.ok) throw new Error("Strength GET " + r.status); return r.json(); })
    ]);

    if (fr.status === "ok" && fr.data && fr.data.length > 0) {
      fitData = fr.data.map(row => parseRow(lowerKeys(row))).filter(r => r.date);
      setDot("ok");
      setSyncMsg("Live from Google Sheets");
      setTimeout(() => setSyncMsg(""), 3000);
    } else {
      setDot("err");
      setSyncMsg("No data in Fitness sheet", true);
    }
    if (sr.status === "ok" && sr.data && sr.data.length > 0) {
      strData = parseStrRows(sr.data.map(row => lowerKeys(row)));
    }
    renderAll();
  } catch (e) {
    setDot("err");
    setSyncMsg("Cannot reach Sheets: " + e.message, true);
    document.getElementById("hdr-sub").textContent = "Sheets unreachable";
    if (e.message.includes("401") || e.message.includes("403")) {
      // Token might be invalid – clear it and ask to sign in again
      localStorage.removeItem("oauth_token");
      updateAuthUI(false);
      setSyncMsg("Authentication expired – please sign in again", true);
    }
  }
}

async function appendToSheet(sheet, row) {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Not authenticated – please sign in.");
  }

  const response = await fetch(SHEET_URL, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({ sheet, action: "append", row })
  });

  const text = await response.text();
  console.log("Sheet:", sheet);
  console.log("Status:", response.status);
  console.log("Response:", text);

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("oauth_token");
    accessToken = null;
    updateAuthUI(false);
    throw new Error("Authentication expired – please sign in again.");
  }
  if (!response.ok) throw new Error("HTTP " + response.status);
  return text;
}

// ── RENDER FUNCTIONS (unchanged) ──
// ... (all your renderAll, renderOverview, renderWeekly, renderRuns, renderProjection,
// renderNutrition, renderStrength, setChart, renderChart, renderLog are exactly the same.
// I'm not duplicating them here to keep the answer readable.
// Just copy them from your existing app.js – they don't change.

// ── ADD DATA ──

function showAddMsg(msg, isOk) {
  const el = document.getElementById("add-msg");
  if (!msg) { el.innerHTML = ""; return; }
  el.innerHTML = `<div class="${isOk ? "notice" : "notice err"}">${msg}</div>`;
}

async function parseAndSave() {
  // Check authentication first
  if (!isAuthenticated()) {
    showAddMsg("Please sign in with Google first", false);
    return;
  }

  const input = document.getElementById("json-input").value.trim();
  if (!input) { showAddMsg("Paste your JSON first", false); return; }
  try {
    const p = JSON.parse(input);
    let savedDates = [];

    // ── FITNESS ──
    if (p.fitness) {
      const f = p.fitness;
      if (!f.date) throw new Error("fitness.date is required");
      const date = isoToDate(f.date);
      const h = f.sleep != null ? Math.floor(f.sleep) : null;
      const m = f.sleep != null ? Math.round((f.sleep - Math.floor(f.sleep)) * 60) : null;
      const sleepStr = h != null ? h + ":" + (m < 10 ? "0" : "") + m : null;
      const newRow = {
        date,
        weight: f.weight != null ? parseFloat(f.weight) : null,
        rhr: f.rhr != null ? parseInt(f.rhr) : null,
        sleep: sleepStr,
        calMin: f.calMin != null ? parseInt(f.calMin) : null,
        calMax: f.calMax != null ? parseInt(f.calMax) : null,
        protMin: f.protMin != null ? parseInt(f.protMin) : null,
        protMax: f.protMax != null ? parseInt(f.protMax) : null,
        move: f.move != null ? parseInt(f.move) : null,
        burn: f.totalBurn != null ? parseInt(f.totalBurn) : null,
        cardio: f.cardio != null ? f.cardio + " min" : null,
        steps: f.steps != null ? parseInt(f.steps) : null,
        dist: f.distance != null ? parseFloat(f.distance) : null,
        hrv: f.hrv != null ? parseInt(f.hrv) : null,
        run5k: f.run5k || null,
        run10k: f.run10k || null,
        notes: f.notes || null,
      };
      const idx = fitData.findIndex(d => d.date === date);
      if (idx >= 0) fitData[idx] = newRow;
      else fitData.push(newRow);

      await appendToSheet("fitness", [
        date, newRow.weight, newRow.rhr, newRow.sleep,
        newRow.calMin, newRow.calMax, newRow.protMin, newRow.protMax,
        newRow.move, newRow.burn, newRow.cardio, newRow.steps, newRow.dist,
        newRow.hrv, newRow.notes || "", newRow.run5k || "", newRow.run10k || ""
      ]);
      savedDates.push(date);
    }

    // ── STRENGTH ──
    if (p.strength) {
      const s = p.strength;
      if (!s.date) throw new Error("strength.date is required");
      if (!s.workout) throw new Error("strength.workout is required");
      const date = isoToDate(s.date);

      const exercises = Object.entries(s)
        .filter(([k]) => k !== "workout" && k !== "date")
        .map(([k, v]) => {
          const rows = String(v).split(";").map(x => x.trim()).filter(Boolean);
          const sets = [];
          rows.forEach(row => {
            const m = row.match(/^(\d+)\s*x\s*([^@]+)\s*@\s*(.+)$/i);
            if (!m) return;
            const count = parseInt(m[1]);
            const reps = m[2].trim();
            const wt = m[3].trim();
            for (let i = 0; i < count; i++) {
              sets.push({ reps, wt: wt.toUpperCase() === "BW" ? null : wt });
            }
          });
          return { name: k, sets };
        });

      const session = { date, workout: s.workout, exercises };
      const si = strData.findIndex(x => x.date === date && x.workout === s.workout);
      if (si >= 0) strData[si] = session;
      else strData.push(session);

      for (const ex of exercises) {
        const groups = [];
        ex.sets.forEach(set => {
          const last = groups[groups.length - 1];
          if (last && last.reps === set.reps && last.wt === set.wt) {
            last.count++;
          } else {
            groups.push({ count: 1, reps: set.reps, wt: set.wt });
          }
        });
        for (const g of groups) {
          await appendToSheet("strength", [
            date,
            s.workout,
            ex.name,
            g.count,
            g.reps,
            g.wt || "BW",
            "kg",
            ""
          ]);
        }
      }
      savedDates.push(date);
    }

    if (savedDates.length === 0) throw new Error("No fitness or strength data provided");
    document.getElementById("json-input").value = "";
    showAddMsg("Saved " + savedDates.join(", ") + " and synced to Sheets", true);
    setTimeout(() => showAddMsg(null), 4000);
    renderAll();
  } catch (e) {
    showAddMsg("Error: " + e.message, false);
  }
}

// ── TARGET WEIGHT ──

function bumpTarget(d) {
  target = parseFloat((Math.round((target + d) * 10) / 10).toFixed(1));
  localStorage.setItem(TARGET_KEY, String(target));
  const lastW = [...fitData].reverse().find(d => d.weight != null);
  renderProjection(lastW || null);
}

// ── NAV & SUBS (unchanged) ──

function showTab(id, btn) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  document.getElementById("page-" + id).classList.add("active");
  btn.classList.add("active");
}

function showSub(page, sub) {
  document.querySelectorAll("#sub-home-overview,#sub-home-weekly,#sub-home-runs,#sub-home-projection")
    .forEach(el => el.classList.remove("active"));
  document.querySelectorAll("#home-chips .chip").forEach(b => b.classList.remove("active"));
  document.getElementById("sub-home-" + sub).classList.add("active");
  event.target.classList.add("active");
}

// ── EXAMPLE JSONS (unchanged) ──

const EXAMPLES = {
  fitness: `{
  "fitness": {
    "date":"2026-07-04",
    "weight":72.7,
    "rhr":52,
    "sleep":7,
    "calMin":1700,
    "calMax":1900,
    "protMin":110,
    "protMax":125,
    "move":620,
    "totalBurn":2740,
    "cardio":45,
    "steps":9100,
    "distance":7.1,
    "hrv":51,
    "notes":"Good recovery"
  }
}`,
  strength: `{
  "strength": {
    "date":"2026-07-04",
    "workout":"Push A",
    "Floor Press":"3x10@8kg;1x15@6kg",
    "Shoulder Press":"3x10@6kg",
    "Lateral Raise":"1x10@4kg;2x10@2kg;1x6@2kg",
    "OH Triceps Ext":"1x12@6kg;1x5@6kg;2x10@4kg",
    "Plank":"1x30s@BW;1x16s@BW"
  }
}`,
  both: `{
  "fitness":{
    "date":"2026-07-04",
    "weight":72.7,
    "rhr":52,
    "sleep":7,
    "calMin":1700,
    "calMax":1900,
    "protMin":110,
    "protMax":125,
    "move":620,
    "totalBurn":2740,
    "cardio":45,
    "steps":9100,
    "distance":7.1,
    "hrv":51
  },
  "strength":{
    "date":"2026-07-04",
    "workout":"Push A",
    "Floor Press":"3x10@8kg;1x15@6kg",
    "Shoulder Press":"3x10@6kg",
    "Lateral Raise":"1x10@4kg;2x10@2kg;1x6@2kg",
    "OH Triceps Ext":"1x12@6kg;1x5@6kg;2x10@4kg",
    "Plank":"1x30s@BW;1x16s@BW"
  }
}`
};

function showExample(type, btn) {
  document.querySelectorAll("#example-chips .chip").forEach(c => c.classList.remove("active"));
  if (btn) btn.classList.add("active");
  document.getElementById("example-json").textContent = EXAMPLES[type];
  document.getElementById("json-input").value = EXAMPLES[type];
}

// ── INIT ──

// Load saved target
const saved = localStorage.getItem(TARGET_KEY);
if (saved) target = parseFloat(saved);

// Set initial example (on DOM ready)
document.addEventListener("DOMContentLoaded", function () {
  showExample("fitness");
  initOAuth();
  if (getAccessToken()) {
    updateAuthUI(true);
    // Optionally load data immediately after auth
    loadFromSheets();
  } else {
    updateAuthUI(false);
    // Show a message to sign in
    setSyncMsg("Please sign in with Google to load your data", true);
  }
});

// Also load from sheets if already authenticated (if token exists)
// The DOMContentLoaded already does it if token exists.
