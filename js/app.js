// ══════════════════════════════════════════════════════════
//  CONFIGURATION – EDIT THESE TWO VALUES
// ══════════════════════════════════════════════════════════
const SHEET_URL = "https://script.google.com/macros/s/AKfycbx8RQ4IP9sCldFxyOJSwMIF-5ekZ9LqaSB1sZPcqbDJkPO8BAUgR1m2uw9AaH9b8o7vOA/exec";   // <-- Replace with your private Apps Script URL
const CLIENT_ID = "401103632011-qgjvt6fko9knb651oe6b89rrs12fgobk.apps.googleusercontent.com"; // <-- Replace with your OAuth Client ID
// ══════════════════════════════════════════════════════════

const TARGET_KEY = "health-target-v1";
const C = {
  bg: "#080810", surface: "#11111f", card: "#181828", border: "#1e1e35", muted: "#2a2a45",
  dim: "#6b6b8a", text: "#e2e2f0", white: "#ffffff", indigo: "#818cf8", green: "#34d399",
  red: "#f87171", amber: "#fbbf24", orange: "#fb923c", blue: "#60a5fa", purple: "#a78bfa", teal: "#2dd4bf"
};

let fitData = [], strData = [], target = 70, currentChart = "weight";

// ──────────────────────────────────────────────────────────
//  OAUTH2 FUNCTIONS (unchanged)
// ──────────────────────────────────────────────────────────

let accessToken = null;
let tokenClient = null;

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
        loadFromSheets();
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
      fitData = [];
      strData = [];
      renderAll();
      setSyncMsg("Signed out", true);
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

function updateAuthUI(isAuth) {
  const dot = document.getElementById("dot");
  const lbl = document.getElementById("dot-label");
  const btnSignin = document.getElementById("btn-signin");
  const btnSignout = document.getElementById("btn-signout");

  if (isAuth) {
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

// ──────────────────────────────────────────────────────────
//  HELPERS (unchanged)
// ──────────────────────────────────────────────────────────

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

// ──────────────────────────────────────────────────────────
//  DATA PARSING (unchanged)
// ──────────────────────────────────────────────────────────

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

// ──────────────────────────────────────────────────────────
//  UI INDICATORS (unchanged)
// ──────────────────────────────────────────────────────────

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

// ──────────────────────────────────────────────────────────
//  SHEET COMMUNICATION – UPDATED (No Authorization header)
//  Token sent as query param for GET and inside body for POST
// ──────────────────────────────────────────────────────────

async function loadFromSheets() {
  setSyncMsg("Loading from Google Sheets...");
  try {
    const token = getAccessToken();
    if (!token) {
      setSyncMsg("Please sign in with Google", true);
      setDot("err");
      return;
    }

    // Append token as query parameter to avoid preflight
    const fitnessUrl = SHEET_URL + "?sheet=fitness&token=" + encodeURIComponent(token);
    const strengthUrl = SHEET_URL + "?sheet=strength&token=" + encodeURIComponent(token);

    const [fr, sr] = await Promise.all([
      fetch(fitnessUrl).then(r => { if (!r.ok) throw new Error("Fitness GET " + r.status); return r.json(); }),
      fetch(strengthUrl).then(r => { if (!r.ok) throw new Error("Strength GET " + r.status); return r.json(); })
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
    if (e.message.includes("401") || e.message.includes("403") || e.message.includes("Invalid token")) {
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

  // Send token inside the JSON body, not in Authorization header
  const payload = {
    sheet: sheet,
    action: "append",
    row: row,
    token: token
  };

  const response = await fetch(SHEET_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"  // avoids preflight
    },
    body: JSON.stringify(payload)
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

  // Parse response to check for server error
  let result;
  try {
    result = JSON.parse(text);
  } catch (_) {
    throw new Error("Invalid response from server");
  }
  if (result.status !== "ok") {
    throw new Error(result.message || "Unknown error");
  }
  return text;
}

// ──────────────────────────────────────────────────────────
//  RENDER FUNCTIONS – DASHBOARD + SUBS
// ──────────────────────────────────────────────────────────

function renderAll() {
  if (!fitData.length) return;
  const first = fitData[0];
  const latest = fitData[fitData.length - 1];
  document.getElementById("hdr-sub").textContent = fitData.length + " days | " + first.date + " to " + latest.date;

  // Render the new dashboard (replaces old overview)
  renderDashboard();

  // Keep other sub-views
  renderWeekly();
  renderRuns();
  renderProjection([...fitData].reverse().find(d => d.weight != null));
  renderNutrition();
  renderStrength();
  renderChart(currentChart);
  renderLog();
}

// ─── NEW DASHBOARD ────────────────────────────────────────

function renderDashboard() {
  if (!fitData.length) return;

  const latest = fitData[fitData.length - 1];
  const first = fitData[0];
  const lastW = [...fitData].reverse().find(d => d.weight != null);
  const avgCal = fitData.filter(d => d.calMin && d.calMax).slice(-7);
  const avgProt = fitData.filter(d => d.protMin && d.protMax).slice(-7);

  // Score
  const rec = recScore(latest);
  const score = Math.round(rec || 0);
  const color = score >= 75 ? C.green : score >= 50 ? C.amber : C.red;

  // Greeting
  const now = new Date();
  const dayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][now.getDay()];
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  document.getElementById('greeting').innerHTML = `
    Good Morning, Deepak! <small>${dayName}, ${dateStr}</small>
  `;

  // Score ring
  const r = 32, cx = 40, cy = 40, sw = 6, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  document.getElementById('score-ring').innerHTML = `
    <svg viewBox="0 0 80 80" width="80" height="80">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.muted}" stroke-width="${sw}"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}"
        stroke-dasharray="${dash} ${circ - dash}" stroke-dashoffset="${circ / 4}" stroke-linecap="round"/>
      <text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="18" font-weight="800" fill="${color}">${score}</text>
    </svg>
  `;

  // Quick stats
  const calAvg = avgCal.length ? Math.round(avgCal.reduce((s,d) => s + (d.calMin+d.calMax)/2, 0) / avgCal.length) : 0;
  const protAvg = avgProt.length ? Math.round(avgProt.reduce((s,d) => s + (d.protMin+d.protMax)/2, 0) / avgProt.length) : 0;
  const sleepHrs = latest.sleep ? sleepH(latest.sleep) : 0;
  const sleepStatus = sleepHrs >= 7 ? 'good' : sleepHrs >= 5 ? 'ok' : 'bad';
  const recStatus = score >= 75 ? 'good' : score >= 50 ? 'ok' : 'bad';

  document.getElementById('quick-stats').innerHTML = `
    <div class="quick-stat"><span class="label">Calories</span><span class="value">${calAvg || '--'}</span><span class="sub">/ 2,700 kcal</span></div>
    <div class="quick-stat"><span class="label">Protein</span><span class="value">${protAvg || '--'}g</span><span class="sub">/ 150g</span></div>
    <div class="quick-stat"><span class="label">Sleep</span><span class="value">${sleepHrs ? sleepHrs.toFixed(1)+'h' : '--'}</span><span class="sub ${sleepStatus}">${sleepStatus === 'good' ? 'Good' : sleepStatus === 'ok' ? 'OK' : 'Poor'}</span></div>
    <div class="quick-stat"><span class="label">Recovery</span><span class="value">${score}</span><span class="sub ${recStatus}">${score >= 75 ? 'Ready' : score >= 50 ? 'Moderate' : 'Rest'}</span></div>
  `;

  // AI Coach
  let coachMsg = '';
  if (score >= 75) coachMsg = 'Your recovery is good and your body is ready. Push workout recommended today.';
  else if (score >= 50) coachMsg = 'Moderate recovery. Consider a light workout or active recovery.';
  else coachMsg = 'Prioritise rest and recovery today.';
  document.getElementById('ai-card').innerHTML = `
    <div class="message">${coachMsg} <small>based on your recovery score</small></div>
    <button class="btn-ai" onclick="showTab('strength', document.querySelector('.nav-btn:nth-child(3)'))">View Recommendation →</button>
  `;

  // Progress Overview (4 cards)
  const weightTrend = lastW ? (first.weight - lastW.weight).toFixed(1) : 0;
  const rhrTrend = latest.rhr && first.rhr ? (first.rhr - latest.rhr) : 0;
  const stepsAvg = fitData.slice(-7).reduce((s,d) => s + (d.steps||0), 0) / 7;
  const calTrend = avgCal.length ? avgCal.reduce((s,d) => s + (d.calMin+d.calMax)/2, 0) / avgCal.length : 0;

  document.getElementById('progress-grid').innerHTML = `
    <div class="progress-card">
      <div class="label">Weight Trend</div>
      <div class="value" style="color:${weightTrend > 0 ? C.green : C.red}">${lastW ? lastW.weight.toFixed(1) : '--'} kg</div>
      <div class="trend ${weightTrend > 0 ? 'up' : 'down'}">${weightTrend > 0 ? '↓' : '↑'} ${Math.abs(weightTrend)} kg vs start</div>
    </div>
    <div class="progress-card">
      <div class="label">Recovery Trend</div>
      <div class="value" style="color:${color}">${score}/100</div>
      <div class="trend">HRV ${latest.hrv || '--'} · RHR ${latest.rhr || '--'}</div>
    </div>
    <div class="progress-card">
      <div class="label">Calories Trend</div>
      <div class="value" style="color:${C.amber}">${Math.round(calTrend)} kcal</div>
      <div class="trend">7-day avg</div>
    </div>
    <div class="progress-card">
      <div class="label">Steps</div>
      <div class="value" style="color:${C.blue}">${Math.round(stepsAvg).toLocaleString()}</div>
      <div class="trend">Daily avg</div>
    </div>
  `;

  // 5K & Volume
  const fiveKs = fitData.filter(d => d.run5k).map(d => {
    const m = String(d.run5k).match(/(\d+):(\d+)/);
    if (!m) return null;
    const secs = parseInt(m[1])*60 + parseInt(m[2]);
    return { date: d.date, secs, label: String(parseInt(m[1])).padStart(2,'0')+':'+String(parseInt(m[2])).padStart(2,'0') };
  }).filter(Boolean);
  const best5k = fiveKs.length ? fiveKs.reduce((b,c) => c.secs < b.secs ? c : b) : null;

  // Total volume (strength)
  let totalVol = 0;
  strData.forEach(s => {
    s.exercises.forEach(ex => {
      ex.sets.forEach(set => {
        const reps = parseInt(set.reps) || 0;
        const wt = set.wt ? parseFloat(set.wt) : 0;
        totalVol += reps * wt;
      });
    });
  });

  document.getElementById('fivek-card').innerHTML = `
    <div style="font-size:11px;font-weight:700;color:${C.purple};text-transform:uppercase;letter-spacing:0.4px">5K Performance</div>
    <div class="big" style="color:${C.amber}">${best5k ? best5k.label : '--'}</div>
    <div style="font-size:11px;color:${C.dim}">${best5k ? 'Best time' : 'No 5K logged'}</div>
  `;
  document.getElementById('volume-card').innerHTML = `
    <div style="font-size:11px;font-weight:700;color:${C.teal};text-transform:uppercase;letter-spacing:0.4px">Total Volume (Strength)</div>
    <div class="big" style="color:${C.white}">${totalVol.toLocaleString()} kg</div>
    <div style="font-size:11px;color:${C.dim}">Total in ${strData.length} sessions</div>
  `;

  // Level & XP (simulate)
  const xp = Math.min(2450, 3000);
  const pct = (xp / 3000) * 100;
  document.getElementById('level-card').innerHTML = `
    <div>
      <span class="level">Deepak Pro</span>
      <span class="xp">Level 12</span>
    </div>
    <div style="flex:1;margin-left:16px">
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--dim)">
        <span>${xp.toLocaleString()}</span>
        <span>3,000 XP</span>
      </div>
      <div class="xp-bar"><div class="fill" style="width:${pct}%"></div></div>
    </div>
  `;

  // Nutrition Summary (macros – approximate)
  const carbs = 45, protein = 30, fat = 25;
  document.getElementById('nutrition-summary').innerHTML = `
    <div class="nutrition-item"><div class="num" style="color:${C.amber}">${carbs}%</div><div class="lbl">Carbs</div></div>
    <div class="nutrition-item"><div class="num" style="color:${C.green}">${protein}%</div><div class="lbl">Protein</div></div>
    <div class="nutrition-item"><div class="num" style="color:${C.red}">${fat}%</div><div class="lbl">Fat</div></div>
    <div class="nutrition-item"><div class="num" style="color:${C.blue}">${calAvg || '--'}</div><div class="lbl">Calories</div></div>
  `;

  // Strength Overview (top 5 exercises by volume)
  const exVol = {};
  strData.forEach(s => {
    s.exercises.forEach(ex => {
      let vol = 0;
      ex.sets.forEach(set => {
        const reps = parseInt(set.reps) || 0;
        const wt = set.wt ? parseFloat(set.wt) : 0;
        vol += reps * wt;
      });
      if (!exVol[ex.name]) exVol[ex.name] = { vol: 0, count: 0, maxWt: 0, maxReps: 0 };
      exVol[ex.name].vol += vol;
      exVol[ex.name].count += 1;
      ex.sets.forEach(set => {
        const wt = set.wt ? parseFloat(set.wt) : 0;
        const reps = parseInt(set.reps) || 0;
        if (wt > exVol[ex.name].maxWt) exVol[ex.name].maxWt = wt;
        if (reps > exVol[ex.name].maxReps) exVol[ex.name].maxReps = reps;
      });
    });
  });
  const sorted = Object.entries(exVol).sort((a,b) => b[1].vol - a[1].vol).slice(0,5);
  document.getElementById('strength-overview').innerHTML = `
    <div class="row"><span class="ex-name">Exercise</span><span>Workouts</span><span>Top Set</span></div>
    ${sorted.map(([name, data]) => `
      <div class="row">
        <span class="ex-name">${name}</span>
        <span>${data.count}</span>
        <span>${data.maxWt ? data.maxWt + 'kg x ' + data.maxReps : '--'}</span>
      </div>
    `).join('')}
  `;

  // Recovery Details
  const sleepScore = latest.sleep ? Math.min(100, (sleepH(latest.sleep) / 8) * 100) : 0;
  const hrvScore = latest.hrv ? Math.min(100, (latest.hrv / 70) * 100) : 0;
  const rhrScore = latest.rhr ? Math.max(0, 100 - (latest.rhr - 40) * 2) : 0;
  document.getElementById('recovery-details').innerHTML = `
    <div class="recovery-item"><div class="label">Sleep Score</div><div class="value">${Math.round(sleepScore)}</div></div>
    <div class="recovery-item"><div class="label">HRV Score</div><div class="value">${Math.round(hrvScore)}</div></div>
    <div class="recovery-item"><div class="label">Resting HR Score</div><div class="value">${Math.round(rhrScore)}</div></div>
  `;

  // AI Coach Insights (static suggestions)
  const insights = [
    { icon: '🏋️‍♂️', text: "You're on a 142 day streak! Incredible consistency." },
    { icon: '📉', text: "Your weight loss rate is 0.6 kg/week. Perfect pace." },
    { icon: '💪', text: "Strength is improving! You hit 4 PRs this month." },
    { icon: '🚶', text: "Try to increase your daily steps. Aim for 10k steps." },
  ];
  document.getElementById('insights-list').innerHTML = insights.map(in => `
    <div class="insight-item"><span class="icon">${in.icon}</span> ${in.text}</div>
  `).join('');

  // Upcoming Workout (use latest workout or fallback)
  let upcoming = null;
  if (strData.length) {
    const lastSession = strData[strData.length - 1];
    if (lastSession) {
      upcoming = {
        name: lastSession.workout,
        exercises: lastSession.exercises.slice(0, 4).map(ex => ({
          name: ex.name,
          sets: ex.sets.length
        }))
      };
    }
  }
  if (!upcoming) {
    upcoming = {
      name: 'Push A',
      exercises: [
        { name: 'Floor Press', sets: 3 },
        { name: 'Shoulder Press', sets: 3 },
        { name: 'Incline Push Up', sets: 3 },
        { name: 'Tricep Dip', sets: 3 }
      ]
    };
  }
  document.getElementById('upcoming-workout').innerHTML = `
    <div style="font-size:14px;font-weight:700;margin-bottom:6px">${upcoming.name}</div>
    ${upcoming.exercises.map(ex => `
      <div class="upcoming-exercise"><span>${ex.name}</span><span class="sets">${ex.sets} sets</span></div>
    `).join('')}
    <button class="btn-ai" style="margin-top:8px;width:100%;" onclick="showTab('strength', document.querySelector('.nav-btn:nth-child(3)'))">Start Workout →</button>
  `;
}

// ─── EXISTING SUB-VIEWS ───────────────────────────────────

function renderWeekly() {
  const weeks = [];
  for (let i = 0; i < fitData.length; i += 7) {
    const c = fitData.slice(i, i + 7);
    if (c.length < 3) continue;
    const wt = c.filter(d => d.weight), sl = c.map(d => sleepH(d.sleep)).filter(Boolean), pr = c.filter(d => d.protMin && d.protMax);
    weeks.push({
      label: c[0].date + " to " + c[c.length - 1].date,
      avgWt: wt.length ? (wt.reduce((s, d) => s + d.weight, 0) / wt.length).toFixed(2) : null,
      avgRhr: c.filter(d => d.rhr).length ? Math.round(c.filter(d => d.rhr).reduce((s, d) => s + d.rhr, 0) / c.filter(d => d.rhr).length) : null,
      totSteps: c.reduce((s, d) => s + (d.steps || 0), 0),
      avgSl: sl.length ? (sl.reduce((a, b) => a + b, 0) / sl.length).toFixed(1) : null,
      avgProt: pr.length ? Math.round(pr.reduce((s, d) => s + (d.protMin + d.protMax) / 2, 0) / pr.length) : null,
      count: c.length,
    });
  }
  document.getElementById("sub-home-weekly").innerHTML = weeks.reverse().map(w => `
    <div class="card">
      <div style="font-size:12px;font-weight:700;color:${C.indigo};margin-bottom:8px">${w.label}</div>
      <div class="grid3">
        ${[["Avg Wt", w.avgWt ? w.avgWt + "kg" : "--", C.blue], ["Avg RHR", w.avgRhr ? String(w.avgRhr) : "--", C.red], ["Avg Sleep", w.avgSl ? w.avgSl + "h" : "--", C.purple], ["Steps", w.totSteps.toLocaleString(), C.green], ["Avg Prot", w.avgProt ? w.avgProt + "g" : "--", C.amber], ["Days", w.count + "/7", C.dim]].map(([l, v, c]) => `
          <div><div style="font-size:10px;color:${C.dim}">${l}</div><div style="font-size:14px;font-weight:700;color:${c}">${v}</div></div>`).join("")}
      </div>
    </div>`).join("");
}

function renderRuns() {
  const fiveKs = fitData.filter(d => d.run5k).map(d => {
    const m = String(d.run5k).match(/(\d+):(\d+)/);
    if (!m) return null;
    const secs = parseInt(m[1]) * 60 + parseInt(m[2]);
    return { date: d.date, secs, label: String(parseInt(m[1])).padStart(2, "0") + ":" + String(parseInt(m[2])).padStart(2, "0") };
  }).filter(Boolean);
  const best = fiveKs.length ? fiveKs.reduce((b, c) => c.secs < b.secs ? c : b) : null;
  const allRuns = fitData.filter(d => d.cardio && d.steps > 2000);

  document.getElementById("sub-home-runs").innerHTML = `
    <div class="card" style="margin-bottom:12px">
      <div style="font-size:13px;font-weight:700;color:${C.purple};margin-bottom:10px">5K Races</div>
      ${fiveKs.length === 0 ? `<div style="font-size:13px;color:${C.dim}">No 5K times logged yet</div>` : ""}
      ${fiveKs.map((r, i) => {
        const prev = fiveKs[i - 1], diff = prev ? prev.secs - r.secs : null;
        return `<div class="row">
          <span class="lbl">${r.date}</span>
          <span style="display:flex;align-items:center;gap:8px">
            <span class="val" style="color:${r === best ? C.amber : C.text}">${r.label}${r === best ? " PB" : ""}</span>
            ${diff !== null ? `<span style="font-size:11px;font-weight:700;color:${diff > 0 ? C.green : C.red}">${diff > 0 ? "-" + diff + "s" : "+" + Math.abs(diff) + "s"}</span>` : ""}
          </span></div>`;
      }).join("")}
      ${fiveKs.length > 1 ? `<div style="margin-top:8px;background:${C.surface};border-radius:8px;padding:8px 12px;font-size:12px;color:${C.dim}">Total off first: <span style="color:${C.green};font-weight:700">${fiveKs[0].secs - best.secs}s</span></div>` : ""}
    </div>
    <div class="card">
      <div style="font-size:13px;font-weight:700;color:${C.blue};margin-bottom:10px">All Cardio Sessions</div>
      ${allRuns.map(r => `<div class="row">
        <span class="lbl">${r.date}</span>
        <span style="display:flex;align-items:center;gap:8px">
          <span class="val">${r.cardio}</span>
          <span style="font-size:11px;color:${C.dim}">${r.steps ? r.steps.toLocaleString() : ""} steps</span>
        </span></div>`).join("")}
    </div>`;
}

function renderProjection(lastW) {
  const lkw = lastW ? lastW.weight : null;
  const lkd = lastW ? lastW.date : null;
  document.getElementById("target-display").textContent = target.toFixed(1) + " kg";
  document.getElementById("still-to-lose").textContent = "Still to lose: " + Math.max(0, (lkw || 0) - target).toFixed(1) + " kg";

  if (!lkw) { document.getElementById("proj-result").innerHTML = `<div class="card" style="color:${C.dim};font-size:13px">No weight data available.</div>`; return; }

  const ach = fitData.find(d => d.weight != null && d.weight <= target);
  if (ach) {
    document.getElementById("proj-result").innerHTML = `<div class="card" style="text-align:center">
      <div style="font-size:11px;color:${C.green};text-transform:uppercase;letter-spacing:.4px">Target Achieved</div>
      <div style="font-size:28px;font-weight:800;color:${C.green};margin-top:4px">${ach.date}</div>
      <div style="font-size:13px;color:${C.dim};margin-top:4px">You hit ${ach.weight} kg on this date</div>
      <div style="font-size:11px;color:${C.dim};margin-top:8px">Lower your target to set a new goal</div>
    </div>`; return;
  }

  const r = fitData.filter(d => d.weight != null).slice(-14);
  if (r.length < 7) { document.getElementById("proj-result").innerHTML = `<div class="card" style="color:${C.dim};font-size:13px">Need more data for projection.</div>`; return; }

  const n = r.length, sx = r.reduce((s, _, i) => s + i, 0), sy = r.reduce((s, d) => s + d.weight, 0);
  const sxy = r.reduce((s, d, i) => s + i * d.weight, 0), sx2 = r.reduce((s, _, i) => s + i * i, 0);
  const slope = (n * sxy - sx * sy) / (n * sx2 - sx * sx), ic = (sy - slope * sx) / n;
  if (slope >= 0) { document.getElementById("proj-result").innerHTML = `<div class="card" style="color:${C.dim};font-size:13px">Weight trend is not decreasing. Keep going!</div>`; return; }
  const days = Math.ceil((target - ic) / slope - (n - 1));
  if (days <= 0 || days > 365) { document.getElementById("proj-result").innerHTML = `<div class="card" style="color:${C.dim};font-size:13px">Set a target below ${lkw} kg.</div>`; return; }
  const dt = new Date(); dt.setDate(dt.getDate() + days);
  const dateStr = dt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const rate = Math.abs(slope * 7).toFixed(2);

  document.getElementById("proj-result").innerHTML = `<div class="card">
    <div style="text-align:center;margin-bottom:14px">
      <div style="font-size:11px;color:${C.dim};text-transform:uppercase;letter-spacing:.4px">Projected arrival</div>
      <div style="font-size:28px;font-weight:800;color:${C.green};margin-top:4px">${dateStr}</div>
      <div style="font-size:13px;color:${C.dim};margin-top:4px">${days} days away</div>
    </div>
    <div style="background:${C.surface};border-radius:10px;padding:10px 14px">
      ${[["Rate", "-" + rate + " kg/wk", C.green], ["Last weighed", lkw + " kg (" + lkd + ")", C.text], ["Target", target.toFixed(1) + " kg", C.blue]].map(([l, v, c]) => `
        <div class="row"><span class="lbl">${l}</span><span class="val" style="color:${c}">${v}</span></div>`).join("")}
    </div>
    <div style="margin-top:10px;font-size:11px;color:${C.dim}">Based on last 14 weighed days.</div>
  </div>`;
}

function renderNutrition() {
  const cals = fitData.filter(d => d.calMin), prots = fitData.filter(d => d.protMin);
  const avgCalMin = cals.length ? Math.round(cals.reduce((s, d) => s + d.calMin, 0) / cals.length) : 0;
  const avgCalMax = cals.length ? Math.round(cals.reduce((s, d) => s + d.calMax, 0) / cals.length) : 0;
  const avgProtMin = prots.length ? Math.round(prots.reduce((s, d) => s + d.protMin, 0) / prots.length) : 0;
  const avgProtMax = prots.length ? Math.round(prots.reduce((s, d) => s + d.protMax, 0) / prots.length) : 0;
  document.getElementById("nutr-sub").textContent = fitData.length + " days tracked";
  document.getElementById("nutr-avgs").innerHTML = `
    <div class="stat-card"><div class="stat-label">Avg Calories</div><div class="stat-val" style="color:${C.amber}">${avgCalMin}-${avgCalMax}</div><div class="stat-sub">kcal/day</div></div>
    <div class="stat-card"><div class="stat-label">Avg Protein</div><div class="stat-val" style="color:${C.green}">${avgProtMin}-${avgProtMax}g</div><div class="stat-sub">grams/day</div></div>`;
  document.getElementById("nutr-list").innerHTML = [...fitData].reverse().map(d => `
    <div class="card" style="padding:10px 14px;margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <div style="font-size:13px;font-weight:700;color:${C.white}">${d.date}</div>
        ${d.weight ? `<div style="font-size:11px;color:${C.blue};font-weight:600">${d.weight} kg</div>` : ""}
      </div>
      <div class="grid2">
        <div style="background:${C.surface};border-radius:8px;padding:8px 10px">
          <div style="font-size:10px;color:${C.dim};margin-bottom:2px">CALORIES</div>
          <div style="font-size:15px;font-weight:700;color:${C.amber}">${d.calMin && d.calMax ? d.calMin + "-" + d.calMax : "--"}</div>
        </div>
        <div style="background:${C.surface};border-radius:8px;padding:8px 10px">
          <div style="font-size:10px;color:${C.dim};margin-bottom:2px">PROTEIN</div>
          <div style="font-size:15px;font-weight:700;color:${C.green}">${d.protMin && d.protMax ? d.protMin + "-" + d.protMax + "g" : "--"}</div>
        </div>
      </div>
    </div>`).join("");
}

function renderStrength() {
  document.getElementById("str-sub").textContent = strData.length + " sessions logged";
  if (!strData.length) { document.getElementById("str-list").innerHTML = `<div class="card" style="color:${C.dim};font-size:13px">No sessions yet.</div>`; return; }
  document.getElementById("str-list").innerHTML = [...strData].reverse().map(s => `
    <div class="card" style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid ${C.border}">
        <div>
          <div style="font-size:14px;font-weight:800;color:${C.white}">${s.date}</div>
          <div style="font-size:11px;color:${C.indigo};font-weight:600;margin-top:2px">${s.workout}</div>
        </div>
        <div style="font-size:11px;color:${C.dim}">${s.exercises.length} exercises</div>
      </div>
      ${s.exercises.map((ex, j) => `
        <div style="margin-bottom:${j < s.exercises.length - 1 ? 12 : 0}px;padding-bottom:${j < s.exercises.length - 1 ? 12 : 0}px;border-bottom:${j < s.exercises.length - 1 ? "1px solid " + C.muted : "none"}">
          <div style="font-size:12px;font-weight:700;color:${C.purple};margin-bottom:6px">${ex.name}</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${ex.sets.map((set, k) => `
              <div style="background:${C.surface};border-radius:8px;padding:6px 10px;font-size:11px">
                <span style="color:${C.dim}">S${k + 1} </span>
                <span style="color:${C.white};font-weight:600">${set.reps}</span>
                ${set.wt ? `<span style="color:${C.amber}"> @ ${set.wt}</span>` : ""}
              </div>`).join("")}
          </div>
        </div>`).join("")}
    </div>`).join("");
}

function setChart(key) {
  currentChart = key;
  document.querySelectorAll("#chart-chips .chip").forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");
  renderChart(key);
}

function renderChart(key) {
  const COLORS = { weight: C.blue, rhr: C.red, steps: C.green, move: C.orange, burn: C.purple, hrv: C.teal };
  const color = COLORS[key] || C.blue;
  const pts = fitData.filter(d => d[key] != null);
  const vals = pts.map(d => d[key]);
  if (!vals.length) { document.getElementById("chart-container").innerHTML = `<div style="color:${C.dim};font-size:13px;padding:16px 0">No data yet</div>`; return; }
  const mn = Math.min(...vals), mx = Math.max(...vals), avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  document.getElementById("chart-stats").innerHTML = [["Min", mn, C.red], ["Avg", avg, C.amber], ["Max", mx, C.green]].map(([l, v, c]) => `
    <div class="card" style="text-align:center;padding:10px 6px;margin-bottom:0">
      <div style="font-size:16px;font-weight:700;color:${c}">${typeof v === "number" ? v % 1 ? v.toFixed(1) : v : v}</div>
      <div style="font-size:10px;color:${C.dim}">${l}</div>
    </div>`).join("");
  const W = 320, H = 130, PX = 10, PY = 14, rng = mx - mn || 1;
  const x = i => PX + (i / (pts.length - 1)) * (W - PX * 2);
  const y = v => PY + (H - PY * 2) - ((v - mn) / rng) * (H - PY * 2);
  const line = pts.map((r, i) => x(i) + "," + y(r[key])).join(" ");
  const fill = x(0) + "," + H + " " + line + " " + x(pts.length - 1) + "," + H;
  const ticks = [0, Math.floor(pts.length / 2), pts.length - 1];
  document.getElementById("chart-container").innerHTML = `
    <div style="font-size:12px;font-weight:700;color:${color};margin-bottom:10px">${key.charAt(0).toUpperCase() + key.slice(1)} all time</div>
    <div style="overflow-x:auto">
      <svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block">
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <polygon points="${fill}" fill="url(#cg)"/>
                <polyline points="${line}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>
        ${ticks.map(i => `
          <circle cx="${x(i)}" cy="${y(pts[i][key])}" r="3" fill="${color}"/>
          <text x="${x(i)}" y="${H - 2}" text-anchor="middle" font-size="9" fill="${C.dim}">${pts[i].date}</text>
          <text x="${x(i)}" y="${Math.max(12, y(pts[i][key]) - 5)}" text-anchor="middle" font-size="9" fill="${color}">${pts[i][key]}</text>`).join("")}
      </svg>
    </div>`;
}

function renderLog() {
  document.getElementById("log-list").innerHTML = [...fitData].reverse().map(r => `
    <div class="card" style="margin-bottom:8px;padding:12px 14px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
        <div style="font-size:13px;font-weight:700;color:${C.white}">${r.date}</div>
        <div style="display:flex;gap:6px">
          ${r.weight ? `<span style="background:${C.blue}22;color:${C.blue};padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700">${r.weight} kg</span>` : ""}
          ${r.rhr ? `<span style="background:${C.red}22;color:${C.red};padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700">${r.rhr} bpm</span>` : ""}
        </div>
      </div>
      <div class="grid2">
        ${[["Sleep", r.sleep || "--"], ["Cal", r.calMin && r.calMax ? r.calMin + "-" + r.calMax : "--"], ["Prot", r.protMin && r.protMax ? r.protMin + "-" + r.protMax + "g" : "--"], ["Steps", r.steps ? r.steps.toLocaleString() : "--"], ["Cardio", r.cardio || "--"], ["HRV", r.hrv ? r.hrv + " ms" : "--"]].map(([l, v]) => `
          <div style="font-size:11px;padding:2px 0;display:flex;gap:4px">
            <span style="color:${C.dim};min-width:38px">${l}</span>
            <span style="color:${C.text}">${v}</span>
          </div>`).join("")}
      </div>
    </div>`).join("");
}

// ──────────────────────────────────────────────────────────
//  ADD DATA (modified to check authentication)
// ──────────────────────────────────────────────────────────

function showAddMsg(msg, isOk) {
  const el = document.getElementById("add-msg");
  if (!msg) { el.innerHTML = ""; return; }
  el.innerHTML = `<div class="${isOk ? "notice" : "notice err"}">${msg}</div>`;
}

async function parseAndSave() {
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

// ──────────────────────────────────────────────────────────
//  TARGET WEIGHT (unchanged)
// ──────────────────────────────────────────────────────────

function bumpTarget(d) {
  target = parseFloat((Math.round((target + d) * 10) / 10).toFixed(1));
  localStorage.setItem(TARGET_KEY, String(target));
  const lastW = [...fitData].reverse().find(d => d.weight != null);
  renderProjection(lastW || null);
}

// ──────────────────────────────────────────────────────────
//  NAV & SUBS (unchanged)
// ──────────────────────────────────────────────────────────

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

// ──────────────────────────────────────────────────────────
//  EXAMPLE JSONS (unchanged)
// ──────────────────────────────────────────────────────────

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

// ──────────────────────────────────────────────────────────
//  INIT (modified for OAuth2)
// ──────────────────────────────────────────────────────────

const saved = localStorage.getItem(TARGET_KEY);
if (saved) target = parseFloat(saved);

document.addEventListener("DOMContentLoaded", function () {
  showExample("fitness");
  initOAuth();
  if (getAccessToken()) {
    updateAuthUI(true);
    loadFromSheets();
  } else {
    updateAuthUI(false);
    setSyncMsg("Please sign in with Google to load your data", true);
  }
});
