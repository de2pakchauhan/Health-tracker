// Credentials & Configuration
const SHEET_URL = "https://script.google.com/macros/s/AKfycbx8RQ4IP9sCldFxyOJSwMIF-5ekZ9LqaSB1sZPcqbDJkPO8BAUgR1m2uw9AaH9b8o7vOA/exec";
const CLIENT_ID = "401103632011-qgjvt6fko9knb651oe6b89rrs12fgobk.apps.googleusercontent.com";

// State Management
let rawDataCache = [];
let currentPage = 0;
const PAGE_SIZE = 30;
let fitnessChartInstance = null;
let strengthChartInstance = null;

// Initialize Dashboard
document.addEventListener("DOMContentLoaded", () => {
  fetchSheetData();
});

function switchTab(tabId) {
  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  
  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');

  if (tabId === 'dashboard') {
    renderCharts();
  }
}

async function fetchSheetData() {
  try {
    // If your Apps Script requires OAuth token, you will need to pass it in the headers here.
    // For open/public Apps Script web apps, standard fetch works.
    const response = await fetch(SHEET_URL);
    rawDataCache = await response.json();
    
    renderMoreSessions();
    renderCharts();
  } catch (error) {
    console.error("Error fetching sheet data:", error);
  }
}

function renderMoreSessions() {
  const tbody = document.getElementById("sessionsBody");
  const startIndex = currentPage * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const pageItems = rawDataCache.slice(startIndex, endIndex);

  pageItems.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.date || ''}</td>
      <td>${item.exercise || ''}</td>
      <td>${item.setsReps || ''}</td>
      <td>${item.weight || ''}</td>
    `;
    tbody.appendChild(row);
  });

  currentPage++;
  if (endIndex >= rawDataCache.length) {
    document.getElementById("loadMoreBtn").style.display = "none";
  }
}

function renderCharts() {
  if (!rawDataCache.length) return;

  const labels = rawDataCache.slice(0, 30).map(d => d.date);
  const fitnessValues = rawDataCache.slice(0, 30).map(d => d.fitnessScore || 0);
  const strengthValues = rawDataCache.slice(0, 30).map(d => d.weight || 0);

  if (fitnessChartInstance) fitnessChartInstance.destroy();
  if (strengthChartInstance) strengthChartInstance.destroy();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  const ctxFitness = document.getElementById('fitnessChart').getContext('2d');
  fitnessChartInstance = new Chart(ctxFitness, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{ label: 'Fitness Score', data: fitnessValues, borderColor: '#0066ff', fill: false }]
    },
    options: chartOptions
  });

  const ctxStrength = document.getElementById('strengthChart').getContext('2d');
  strengthChartInstance = new Chart(ctxStrength, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{ label: 'Strength Weight (kg)', data: strengthValues, backgroundColor: '#28a745' }]
    },
    options: chartOptions
  });
}
