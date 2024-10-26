const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false';
const UPDATE_INTERVAL = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

let cryptoData = [];
let updateInterval;
let currentFilter = 'all';

function formatNumber(num) {
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function formatPercentage(num) {
  const formattedNum = num.toFixed(2);
  return num >= 0 ? `+${formattedNum}%` : `${formattedNum}%`;
}

async function fetchCryptoData(retries = 0) {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    if (retries < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchCryptoData(retries + 1);
    }
    return [];
  }
}

function filterData(data, filter) {
  switch (filter) {
    case 'gainers':
      return data.filter(coin => coin.price_change_percentage_24h > 0).slice(0, 10);
    case 'losers':
      return data.filter(coin => coin.price_change_percentage_24h < 0).slice(0, 10);
    default:
      return data.slice(0, 10);
  }
}

function updateCryptoTable(newData) {
  const tableBody = document.getElementById('cryptoTableBody');
  if (!tableBody) {
    console.error('Crypto table body not found');
    return;
  }
  tableBody.innerHTML = ''; // Clear existing data

  const filteredData = filterData(newData, currentFilter);

  filteredData.forEach((coin, index) => {
    const row = document.createElement('tr');
    row.className = 'table-row';
    row.innerHTML = `
      <td class="table-data rank">${coin.market_cap_rank}</td>
      <td class="table-data">
        <div class="wrapper">
          <img src="${coin.image}" width="24" height="24" alt="${coin.name} logo" class="img">
          <span class="coin-name">${coin.name} <span class="coin-symbol">${coin.symbol.toUpperCase()}</span></span>
        </div>
      </td>
      <td class="table-data price">$${formatNumber(coin.current_price)}</td>
      <td class="table-data change">
        <span class="percentage-change ${coin.price_change_percentage_24h >= 0 ? 'positive-change' : 'negative-change'}">
          ${formatPercentage(coin.price_change_percentage_24h)}
        </span>
      </td>
      <td class="table-data market-cap">$${formatNumber(coin.market_cap)}</td>
    `;
    tableBody.appendChild(row);
  });
}

function updateCountdown(seconds) {
  const countdownElement = document.getElementById('updateCountdown');
  if (countdownElement) {
    countdownElement.textContent = `Next update in ${seconds} seconds`;
  }
}

async function updateMarketData() {
  const newData = await fetchCryptoData();
  if (newData.length > 0) {
    cryptoData = newData;
    updateCryptoTable(cryptoData);
  }
}

function startUpdateCycle() {
  let countdown = UPDATE_INTERVAL / 1000;

  updateMarketData(); // Initial update
  updateCountdown(countdown);

  if (updateInterval) {
    clearInterval(updateInterval);
  }

  updateInterval = setInterval(() => {
    countdown--;
    if (countdown <= 0) {
      updateMarketData();
      countdown = UPDATE_INTERVAL / 1000;
    }
    updateCountdown(countdown);
  }, 1000);
}

function initCryptoMarket() {
  const marketSection = document.querySelector('.section.market');
  if (!marketSection) {
    console.error('Market section not found');
    return;
  }

  if (marketSection.dataset.initialized === 'true') {
    console.log('Market already initialized');
    return;
  }

  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentFilter = button.getAttribute('data-filter');
      updateCryptoTable(cryptoData);
    });
  });

  startUpdateCycle();
  marketSection.dataset.initialized = 'true';
}

// Use both DOMContentLoaded and load events for better coverage
document.addEventListener('DOMContentLoaded', initCryptoMarket);
window.addEventListener('load', initCryptoMarket);

// Reinitialize on visibility change
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    initCryptoMarket();
  }
});