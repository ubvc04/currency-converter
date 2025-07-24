// Currency Converter App
// Author: (Your Name)
// Modular, well-commented JavaScript for real-time currency conversion

const API_KEY = 'd701210775f8764265e48440';
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;
const CURRENCY_LIST_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/codes`;

// DOM Elements
const amountInput = document.getElementById('amount');
const fromSelect = document.getElementById('from-currency');
const toSelect = document.getElementById('to-currency');
const convertBtn = document.getElementById('convert-btn');
const swapBtn = document.getElementById('swap-btn');
const resultOutput = document.getElementById('result-output');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error-message');
const themeToggle = document.getElementById('theme-toggle');
const form = document.getElementById('converter-form');

// Currency code to country/flag/logo mapping
// (Partial list, can be extended)
const currencyMeta = {
  "USD": { country: "US", name: "US Dollar", logo: "fa-dollar-sign" },
  "EUR": { country: "EU", name: "Euro", logo: "fa-euro-sign" },
  "GBP": { country: "GB", name: "British Pound", logo: "fa-sterling-sign" },
  "JPY": { country: "JP", name: "Japanese Yen", logo: "fa-yen-sign" },
  "AUD": { country: "AU", name: "Australian Dollar", logo: "fa-dollar-sign" },
  "CAD": { country: "CA", name: "Canadian Dollar", logo: "fa-dollar-sign" },
  "CHF": { country: "CH", name: "Swiss Franc", logo: "fa-franc-sign" },
  "CNY": { country: "CN", name: "Chinese Yuan", logo: "fa-yen-sign" },
  "INR": { country: "IN", name: "Indian Rupee", logo: "fa-indian-rupee-sign" },
  "SGD": { country: "SG", name: "Singapore Dollar", logo: "fa-dollar-sign" },
  "ZAR": { country: "ZA", name: "South African Rand", logo: "fa-rand-sign" },
  "BRL": { country: "BR", name: "Brazilian Real", logo: "fa-dollar-sign" },
  "RUB": { country: "RU", name: "Russian Ruble", logo: "fa-ruble-sign" },
  "KRW": { country: "KR", name: "South Korean Won", logo: "fa-won-sign" },
  "MXN": { country: "MX", name: "Mexican Peso", logo: "fa-dollar-sign" },
  "TRY": { country: "TR", name: "Turkish Lira", logo: "fa-lira-sign" },
  "SEK": { country: "SE", name: "Swedish Krona", logo: "fa-dollar-sign" },
  "PLN": { country: "PL", name: "Polish Zloty", logo: "fa-dollar-sign" },
  "DKK": { country: "DK", name: "Danish Krone", logo: "fa-dollar-sign" },
  "NOK": { country: "NO", name: "Norwegian Krone", logo: "fa-dollar-sign" },
  "CZK": { country: "CZ", name: "Czech Koruna", logo: "fa-dollar-sign" },
  "HUF": { country: "HU", name: "Hungarian Forint", logo: "fa-dollar-sign" },
  "IDR": { country: "ID", name: "Indonesian Rupiah", logo: "fa-dollar-sign" },
  "MYR": { country: "MY", name: "Malaysian Ringgit", logo: "fa-dollar-sign" },
  "PHP": { country: "PH", name: "Philippine Peso", logo: "fa-dollar-sign" },
  "THB": { country: "TH", name: "Thai Baht", logo: "fa-dollar-sign" },
  "ILS": { country: "IL", name: "Israeli New Shekel", logo: "fa-shekel-sign" },
  "SAR": { country: "SA", name: "Saudi Riyal", logo: "fa-dollar-sign" },
  "AED": { country: "AE", name: "UAE Dirham", logo: "fa-dollar-sign" },
  "EGP": { country: "EG", name: "Egyptian Pound", logo: "fa-sterling-sign" },
  "NGN": { country: "NG", name: "Nigerian Naira", logo: "fa-naira-sign" },
  // Add more as needed
};

// --- Theme Handling ---
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.innerHTML = theme === 'dark'
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  setTheme(current === 'light' ? 'dark' : 'light');
}
function initTheme() {
  const saved = localStorage.getItem('theme');
  setTheme(saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
}
themeToggle.addEventListener('click', toggleTheme);
initTheme();

// --- Utility: Get flag URL from country code ---
function getFlagUrl(countryCode) {
  return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;
}

// --- Populate Currency Dropdowns ---
async function populateCurrencies() {
  try {
    showLoading(true);
    const res = await fetch(CURRENCY_LIST_URL);
    const data = await res.json();
    if (!data.supported_codes) throw new Error('Failed to fetch currency list.');
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    data.supported_codes.forEach(([code, name]) => {
      const meta = currencyMeta[code] || { country: code.slice(0,2), name };
      const flagUrl = getFlagUrl(meta.country);
      const logo = meta.logo ? `<i class="fa-solid ${meta.logo} currency-logo"></i>` : '';
      const optionHTML = `<option value="${code}">
        ${logo}<img src="${flagUrl}" class="currency-flag" alt="${meta.country}"> ${code} - ${meta.name || name}
      </option>`;
      fromSelect.insertAdjacentHTML('beforeend', optionHTML);
      toSelect.insertAdjacentHTML('beforeend', optionHTML);
    });
    // Set defaults
    fromSelect.value = 'USD';
    toSelect.value = 'EUR';
  } catch (err) {
    showError('Unable to load currencies. Please try again.');
  } finally {
    showLoading(false);
  }
}

// --- Show/Hide Loading State ---
function showLoading(show) {
  loadingDiv.classList.toggle('hidden', !show);
}

// --- Show Error Message ---
function showError(msg) {
  errorDiv.textContent = msg;
  errorDiv.style.display = 'block';
  resultOutput.textContent = '';
}
function clearError() {
  errorDiv.textContent = '';
  errorDiv.style.display = 'none';
}

// --- Fetch and Convert ---
async function convertCurrency() {
  clearError();
  resultOutput.textContent = '';
  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;
  if (isNaN(amount) || amount <= 0) {
    showError('Please enter a valid amount.');
    return;
  }
  showLoading(true);
  try {
    const res = await fetch(API_URL + from);
    const data = await res.json();
    if (data.result !== 'success') throw new Error('API error');
    const rate = data.conversion_rates[to];
    if (!rate) throw new Error('Currency not supported.');
    const converted = amount * rate;
    resultOutput.innerHTML = `<strong>${amount} ${from}</strong> = <strong>${converted.toLocaleString(undefined, {maximumFractionDigits: 4})} ${to}</strong>`;
  } catch (err) {
    showError('Conversion failed. Please check your network or try again.');
  } finally {
    showLoading(false);
  }
}

// --- Swap Currencies ---
swapBtn.addEventListener('click', () => {
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
  convertCurrency();
});

// --- Real-time Conversion ---
amountInput.addEventListener('input', () => {
  if (amountInput.value && fromSelect.value && toSelect.value) {
    convertCurrency();
  } else {
    resultOutput.textContent = '';
    clearError();
  }
});
fromSelect.addEventListener('change', convertCurrency);
toSelect.addEventListener('change', convertCurrency);

// --- Form Submit ---
form.addEventListener('submit', e => {
  e.preventDefault();
  convertCurrency();
});

// --- Initialize ---
populateCurrencies(); 