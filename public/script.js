// Dashboard logic with error handling and loading states
const API_BASE = 'https://traffic-analyzer-9xqm.onrender.com';

let trafficChart = null;

// DOM elements
const statsGrid = document.getElementById('statsGrid');
const topPagesList = document.getElementById('topPagesList');
const loadingOverlay = document.getElementById('loadingOverlay');
const errorOverlay = document.getElementById('errorOverlay');
const themeToggle = document.getElementById('themeToggle');

// Theme toggle
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  themeToggle.innerHTML = newTheme === 'dark' 
    ? '<i class="fas fa-sun"></i><span>Light Mode</span>'
    : '<i class="fas fa-moon"></i><span>Dark Mode</span>';
  
  // Persist theme
  localStorage.setItem('theme', newTheme);
});

// Load theme on startup
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.innerHTML = savedTheme === 'dark' 
  ? '<i class="fas fa-sun"></i><span>Light Mode</span>'
  : '<i class="fas fa-moon"></i><span>Dark Mode</span>';

async function loadStats() {
  loadingOverlay.classList.remove('hidden');
  errorOverlay.classList.add('hidden');

  try {
    const response = await fetch(`${API_BASE}/stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // Populate stats cards
    populateStats(data);
    
    // Update charts
    updateCharts(data);
    
    // Update top pages
    populateTopPages(data.topPages);
    
  } catch (error) {
    console.error('Load stats error:', error);
    errorOverlay.classList.remove('hidden');
    
    // Fallback UI with defaults
    populateStats({
      totalVisitors: 0,
      uniqueVisitors: 0,
      daily: 0,
      weekly: 0,
      monthly: 0
    });
  } finally {
    loadingOverlay.classList.add('hidden');
  }
}

function populateStats(data) {
  const stats = [
    { id: 'total', label: 'Total Visitors', value: data.totalVisitors || 0, icon: 'fas fa-users' },
    { id: 'unique', label: 'Unique Visitors', value: data.uniqueVisitors || 0, icon: 'fas fa-user-friends' },
    { id: 'daily', label: 'Today', value: data.daily || 0, icon: 'fas fa-sun' },
    { id: 'weekly', label: 'This Week', value: data.weekly || 0, icon: 'fas fa-calendar-week' },
    { id: 'monthly', label: 'This Month', value: data.monthly || 0, icon: 'fas fa-calendar-alt' }
  ];

  statsGrid.innerHTML = stats.map(stat => `
    <div class="stat-card">
      <i class="${stat.icon} fa-2x" style="color: var(--accent); margin-bottom: 1rem;"></i>
      <div class="stat-number">${stat.value.toLocaleString()}</div>
      <div class="stat-label">${stat.label}</div>
    </div>
  `).join('');
}

function populateTopPages(pages) {
  if (!pages || pages.length === 0) {
    topPagesList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No data yet</p>';
    return;
  }

  topPagesList.innerHTML = pages.map((page, index) => `
    <div class="page-item">
      <span class="page-url">#${index + 1} ${page.page}</span>
      <span class="page-count">${page.count} visits</span>
    </div>
  `).join('');
}

function updateCharts(data) {
  const ctx = document.getElementById('trafficChart')?.getContext('2d');
  if (!ctx) return;

  if (trafficChart) {
    trafficChart.destroy();
  }

  const labels = ['Daily', 'Weekly', 'Monthly', 'Total'];
  const values = [data.daily || 0, data.weekly || 0, data.monthly || 0, data.totalVisitors || 0];

  trafficChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Visitors',
        data: values,
        borderColor: 'rgb(0, 123, 255)',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Auto-refresh every 30 seconds
setInterval(loadStats, 30000);

// Initial load
loadStats();

// Global error handler
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  // Don't break UI
});

