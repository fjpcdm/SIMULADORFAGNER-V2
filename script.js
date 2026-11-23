// ============================================================
// ARQUIVO: script.js
// MOTOR DE SIMULAÇÃO - MODO TRAJETO (SEM PARADAS) + PERSISTÊNCIA
// ============================================================

const STORAGE_KEY_STATE = 'simulador_bus_estado_v2';

const cssStyles = `
  * {
    box-sizing: border-box !important;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    user-select: none !important;
    -webkit-user-select: none !important;
  }

  html, body {
    width: 100vw;
    height: 100vh;
    overflow: hidden !important;
    background-color: #0f172a;
    touch-action: none;
    position: fixed;
    top: 0;
    left: 0;
  }

  #map {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

  .setup-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(15, 23, 42, 0.95);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .setup-card {
    background: #1e293b;
    border: 1px solid #38bdf8;
    border-radius: 16px;
    padding: 24px;
    width: 100%;
    max-width: 420px;
    max-height: 90vh;
    overflow-y: auto;
    color: #ffffff;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
  }

  .setup-card h2 {
    color: #f59e0b;
    font-size: 1.4rem;
    margin-bottom: 16px;
    text-align: center;
  }

  .mode-selection-box {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .btn-mode-select {
    width: 100%;
    padding: 16px;
    background: #334155;
    border: 2px solid #38bdf8;
    border-radius: 12px;
    color: #ffffff;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    text-align: center;
  }

  .btn-mode-select:active {
    background: #38bdf8;
    color: #0f172a;
  }

  .form-group {
    margin-bottom: 14px;
  }

  .form-group label {
    display: block;
    font-size: 0.9rem;
    color: #94a3b8;
    margin-bottom: 6px;
  }

  .form-group select, .form-group input {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    background: #0f172a;
    border: 1px solid #334155;
    color: #ffffff;
    font-size: 0.9rem;
  }

  .btn-start-sim {
    width: 100%;
    padding: 12px;
    background: #10b981;
    border: none;
    border-radius: 8px;
    color: #ffffff;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 10px;
  }

  .btn-back-menu {
    width: 100%;
    padding: 10px;
    background: #64748b;
    border: none;
    border-radius: 8px;
    color: #ffffff;
    font-weight: bold;
    font-size: 0.85rem;
    cursor: pointer;
    margin-top: 8px;
  }

  .map-instruction-banner {
    position: absolute !important;
    top: 15px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    z-index: 9999999 !important;
    background: rgba(245, 158, 11, 0.98) !important;
    color: #0f172a !important;
    padding: 10px 18px !important;
    border-radius: 20px !important;
    font-weight: bold !important;
    font-size: 0.85rem !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6) !important;
    border: 2px solid #ffffff !important;
    text-align: center !important;
    max-width: 90vw !important;
  }

  .mobile-top-bar {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(15, 23, 42, 0.92);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 20px;
    padding: 6px 14px;
    display: none;
    align-items: center;
    gap: 12px;
    z-index: 999999;
    color: #ffffff;
    font-size: 0.78rem;
    box-shadow: 0 4px 14px rgba(0,0,0,0.45);
    white-space: nowrap;
    max-width: calc(100vw - 16px);
  }

  .btn-toggle-hud {
    background: #3b82f6;
    border: none;
    color: #ffffff;
    padding: 4px 8px;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: bold;
    cursor: pointer;
  }

  .hud {
    position: absolute !important;
    top: 88px !important;
    left: 12px !important;
    z-index: 999999 !important;
    background: rgba(15, 23, 42, 0.92) !important;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    color: #ffffff !important;
    padding: 12px !important;
    border-radius: 12px !important;
    border: 1px solid rgba(255, 255, 255, 0.25) !important;
    width: 260px;
    max-width: calc(100vw - 24px);
    display: none;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  }

  .hud.mobile-visible {
    display: block !important;
  }

  .hud h2 {
    font-size: 0.95rem;
    margin-bottom: 6px;
    text-align: center;
    color: #f59e0b;
  }

  .line-badge {
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid #38bdf8;
    color: #38bdf8;
    padding: 6px 10px;
    border-radius: 6px;
    font-weight: bold;
    font-size: 0.8rem;
    text-align: center;
    margin-bottom: 8px;
  }

  .trip-info-box {
    padding: 8px 10px;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(51, 65, 85, 0.8);
    border-radius: 8px;
    font-size: 0.8rem;
    margin-bottom: 8px;
  }

  .trip-km-row {
    display: flex;
    justify-content: space-between;
    color: #cbd5e1;
    margin-bottom: 4px;
  }

  .trip-km-val {
    font-weight: bold;
    color: #38bdf8;
  }

  .trip-timer-val {
    font-weight: bold;
    color: #10b981;
    font-family: monospace;
    font-size: 0.95rem;
  }

  .trip-status-badge {
    width: 100%;
    padding: 8px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 0.85rem;
    text-align: center;
    margin-bottom: 8px;
  }

  .trip-status-badge.running {
    background: rgba(16, 185, 129, 0.85);
    color: #ffffff;
  }

  .trip-status-badge.stopped {
    background: rgba(239, 68, 68, 0.85);
    color: #ffffff;
  }

  .btn-trip-toggle {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 0.85rem;
    cursor: pointer;
    border: none;
    margin-bottom: 8px;
    color: #ffffff;
    transition: 0.2s;
  }

  .btn-trip-toggle.start {
    background: #10b981;
  }

  .btn-trip-toggle.stop {
    background: #f59e0b;
    color: #0f172a;
  }

  .zoom-controls {
    display: flex;
    gap: 8px;
    margin-top: 4px;
  }

  .btn-zoom {
    flex: 1;
    padding: 6px;
    font-size: 0.75rem;
    font-weight: bold;
    color: #ffffff;
    background: rgba(59, 130, 246, 0.8);
    border: 1px solid #60a5fa;
    border-radius: 6px;
    cursor: pointer;
  }

  .btn-zoom.active {
    background: #f59e0b !important;
    border-color: #fbbf24 !important;
    color: #0f172a;
  }

  .btn-exit-game {
    width: 100%;
    padding: 8px;
    margin-top: 8px;
    background: rgba(220, 38, 38, 0.85);
    border: 1px solid #f87171;
    border-radius: 6px;
    color: #ffffff;
    font-weight: bold;
    font-size: 0.8rem;
    cursor: pointer;
    text-align: center;
  }

  .speedometer-container {
    position: absolute !important;
    top: 88px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    z-index: 999999 !important;
    background: rgba(10, 15, 25, 0.9) !important;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    color: #38bdf8 !important;
    padding: 6px 18px !important;
    border-radius: 20px !important;
    font-size: 1.35rem !important;
    font-weight: 800 !important;
    border: 2px solid #38bdf8 !important;
    display: flex;
    align-items: baseline;
    gap: 6px;
    pointer-events: none;
    box-shadow: 0 4px 15px rgba(0,0,0,0.6);
  }

  .speed-unit {
    font-size: 0.8rem;
    font-weight: 600;
    color: #94a3b8;
  }

  .bottom-cockpit-bar {
    position: fixed !important;
    bottom: calc(14px + env(safe-area-inset-bottom, 0px)) !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    z-index: 999999 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .cross-dpad {
    --pad-size: 132px;
    --arm-w: 44px;
    --arm-r: 12px;
    position: relative;
    width: var(--pad-size);
    height: var(--pad-size);
    flex-shrink: 0;
    pointer-events: auto;
    filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.75));
  }

  .dpad-cross-v,
  .dpad-cross-h {
    position: absolute;
    background: #000000;
    border-radius: var(--arm-r);
    pointer-events: none;
  }

  .dpad-cross-v {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: var(--arm-w);
    height: 100%;
  }

  .dpad-cross-h {
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    height: var(--arm-w);
  }

  .dpad-arm-btn {
    position: absolute;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    z-index: 2;
    transition: transform 0.06s ease;
  }

  .dpad-arm-btn svg {
    width: 18px;
    height: 18px;
    fill: #ffffff;
    pointer-events: none;
    transition: fill 0.1s ease, transform 0.08s ease;
  }

  .dpad-arm-btn:active svg,
  .dpad-arm-btn.pressed svg {
    fill: #38bdf8;
    transform: scale(0.9);
  }

  .dpad-up {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: var(--arm-w);
    height: var(--arm-w);
  }

  .dpad-down {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: var(--arm-w);
    height: var(--arm-w);
  }

  .dpad-left {
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: var(--arm-w);
    height: var(--arm-w);
  }

  .dpad-right {
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: var(--arm-w);
    height: var(--arm-w);
  }

  @media (max-width: 480px) {
    .cross-dpad {
      --pad-size: 114px;
      --arm-w: 38px;
      --arm-r: 10px;
    }
    .dpad-arm-btn svg {
      width: 15px;
      height: 15px;
    }
  }

  @media (min-width: 900px) {
    .cross-dpad {
      --pad-size: 144px;
      --arm-w: 48px;
      --arm-r: 13px;
    }
    .dpad-arm-btn svg {
      width: 20px;
      height: 20px;
    }
  }

  .alert-toast {
    position: fixed;
    top: 132px;
    left: 50%;
    transform: translateX(-50%);
    background: #3b82f6;
    color: #ffffff;
    padding: 10px 18px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 0.85rem;
    z-index: 10000000;
    text-align: center;
    display: none;
    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    border: 2px solid #ffffff;
  }

  .report-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(15, 23, 42, 0.92);
    z-index: 99999999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .report-card {
    background: #1e293b;
    border: 2px solid #10b981;
    border-radius: 20px;
    padding: 24px;
    width: 100%;
    max-width: 420px;
    color: #ffffff;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.9);
    text-align: center;
  }

  .report-card h2 {
    color: #10b981;
    font-size: 1.5rem;
    margin-bottom: 12px;
  }

  .report-stats {
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 14px;
    margin: 16px 0;
    text-align: left;
    font-size: 0.95rem;
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #cbd5e1;
  }

  .report-stats strong {
    color: #38bdf8;
    float: right;
    font-family: monospace;
    font-size: 1.05rem;
  }

  .btn-close-report {
    width: 100%;
    padding: 14px;
    background: #10b981;
    border: none;
    border-radius: 10px;
    color: #ffffff;
    font-weight: bold;
    font-size: 1.05rem;
    cursor: pointer;
    margin-top: 10px;
  }

  .maplibregl-marker {
    z-index: 9999999 !important;
    pointer-events: none !important;
  }

  .bus-marker-img {
    width: 14px !important;
    height: 42px !important;
    display: block !important;
    filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.95));
    transform-origin: center center;
  }

  @media (max-width: 768px) {
    .speedometer-container {
      display: none !important;
    }
  }
`;

const styleElement = document.createElement('style');
styleElement.innerHTML = cssStyles;
document.head.appendChild(styleElement);

const alertToast = document.createElement('div');
alertToast.className = 'alert-toast';
document.body.appendChild(alertToast);

function showAlert(message) {
  alertToast.textContent = message;
  alertToast.style.display = 'block';
  setTimeout(() => {
    alertToast.style.display = 'none';
  }, 2200);
}

const COLOR_PRESETS = {
  'vermelho': { name: 'Vermelho', bodyColor: '#ff2c2c', stripeColor: '#ff2c2c' },
  'azul': { name: 'Azul', bodyColor: '#1883ff', stripeColor: '#1883ff' },
  'laranja': { name: 'Laranja', bodyColor: '#ea580c', stripeColor: '#ffff00' },
  'amarelo': { name: 'Amarelo', bodyColor: '#eab308', stripeColor: '#ffffff' },
  'verde': { name: 'Verde', bodyColor: '#16a34a', stripeColor: '#ffffff' },
  'branco': { name: 'Branco', bodyColor: '#ffffff', stripeColor: '#ffffff' },
  'preto': { name: 'Preto', bodyColor: '#000000', stripeColor: '#000000' },
  'trem_laranja': { name: 'Trem Laranja', bodyColor: '#2A1974', stripeColor: '#EA7302' }
};

function getLinesDatabase() {
  return window.linesDatabase || {};
}

function isValidCoordPair(pt) {
  return (
    Array.isArray(pt) &&
    pt.length >= 2 &&
    typeof pt[0] === 'number' &&
    typeof pt[1] === 'number' &&
    Number.isFinite(pt[0]) &&
    Number.isFinite(pt[1])
  );
}

function getMetersBetween(coord1, coord2) {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function sanitizePath(rawCoords) {
  if (!Array.isArray(rawCoords)) return [];
  const cleaned = [];
  for (const pt of rawCoords) {
    if (!isValidCoordPair(pt)) continue;
    const pair = [Number(pt[0]), Number(pt[1])];
    if (cleaned.length === 0) {
      cleaned.push(pair);
    } else {
      const prev = cleaned[cleaned.length - 1];
      if (getMetersBetween(prev, pair) > 0.25) {
        cleaned.push(pair);
      }
    }
  }
  return cleaned;
}

function extractCoordinates(rawTrajeto) {
  if (!rawTrajeto) return [];
  if (Array.isArray(rawTrajeto) && rawTrajeto.length > 0 && Array.isArray(rawTrajeto[0]) && typeof rawTrajeto[0][0] === 'number') {
    return sanitizePath(rawTrajeto);
  }
  if (Array.isArray(rawTrajeto) && rawTrajeto[0] && Array.isArray(rawTrajeto[0].features)) {
    const lineFeature = rawTrajeto[0].features.find(f => f.geometry && f.geometry.type === 'LineString');
    if (lineFeature && Array.isArray(lineFeature.geometry.coordinates)) {
      return sanitizePath(lineFeature.geometry.coordinates);
    }
  }
  if (typeof rawTrajeto === 'object' && rawTrajeto !== null) {
    if (rawTrajeto.type === 'FeatureCollection' && Array.isArray(rawTrajeto.features)) {
      const lineFeature = rawTrajeto.features.find(f => f.geometry && f.geometry.type === 'LineString');
      if (lineFeature && Array.isArray(lineFeature.geometry.coordinates)) {
        return sanitizePath(lineFeature.geometry.coordinates);
      }
    }
    if (rawTrajeto.type === 'Feature' && rawTrajeto.geometry && rawTrajeto.geometry.type === 'LineString') {
      return sanitizePath(rawTrajeto.geometry.coordinates || []);
    }
    if (rawTrajeto.type === 'LineString' && Array.isArray(rawTrajeto.coordinates)) {
      return sanitizePath(rawTrajeto.coordinates);
    }
  }
  return [];
}

function saveUserPreferences(patch = {}) {
  try {
    const current = loadUserPreferences();
    const merged = { ...current, ...patch };
    localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(merged));
  } catch (e) {
    // Ignora erro de quota/privacidade
  }
}

function loadUserPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATE);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

const setupModal = document.createElement('div');
setupModal.className = 'setup-modal-overlay';

let colorOptionsHtml = '';
for (const key in COLOR_PRESETS) {
  colorOptionsHtml += `<option value="${key}">${COLOR_PRESETS[key].name}</option>`;
}

setupModal.innerHTML = `
  <div class="setup-card" id="cardMainMenu">
    <h2>🚍 Simulador de Ônibus & Trem</h2>
    <div class="mode-selection-box">
      <button class="btn-mode-select" id="btnSelectLineMode">🛣️ Modo Trajeto</button>
      <button class="btn-mode-select" id="btnSelectFreeMode">🗺️ Modo Livre</button>
    </div>
  </div>

  <div class="setup-card" id="cardLineMode" style="display: none;">
    <h2>🛣️ Modo Trajeto</h2>
    <div class="form-group">
      <label>Tipo de Linha de Operação:</label>
      <select id="selectCategoryType">
        <option value="urbano">Linhas Urbanas</option>
        <option value="rodoviario">Linhas Rodoviárias</option>
      </select>
    </div>
    <div class="form-group">
      <label>Selecione a Linha:</label>
      <select id="selectLine"></select>
    </div>
    <div class="form-group">
      <label>Cor do Veículo:</label>
      <select id="selectColorLine">${colorOptionsHtml}</select>
    </div>
    <button class="btn-start-sim" id="btnStartLineMode">Iniciar Viagem</button>
    <button class="btn-back-menu" id="btnBackLine">Voltar</button>
  </div>

  <div class="setup-card" id="cardFreeMode" style="display: none;">
    <h2>🗺️ Modo Livre</h2>
    <div class="form-group">
      <label>Cor do Veículo:</label>
      <select id="selectColorFree">${colorOptionsHtml}</select>
    </div>
    <div class="form-group">
      <label>Pesquisar Local / Rua:</label>
      <input type="text" id="inputFreeLocation" value="Avenida Amazonas, Belo Horizonte" />
    </div>
    <button class="btn-start-sim" id="btnStartFreeMode">Iniciar na Rua</button>
    <button class="btn-back-menu" id="btnBackFree">Voltar</button>
  </div>
`;
document.body.appendChild(setupModal);

function refreshLinesDropdown() {
  const select = document.getElementById('selectLine');
  const catSelect = document.getElementById('selectCategoryType');
  if (!select || !catSelect) return;

  const selectedCategory = catSelect.value;
  const db = getLinesDatabase();
  const keys = Object.keys(db);
  const prefs = loadUserPreferences();

  select.innerHTML = '';

  const filteredKeys = keys.filter(key => {
    const tipo = (db[key].tipo || 'urbano').toLowerCase();
    if (selectedCategory === 'rodoviario') {
      return tipo === 'rodoviario';
    } else {
      return tipo !== 'rodoviario';
    }
  });

  if (filteredKeys.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'Nenhuma linha encontrada nesta categoria';
    select.appendChild(opt);
    return;
  }

  filteredKeys.forEach(key => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = db[key].nome;
    select.appendChild(opt);
  });

  if (prefs.lastLineKey && Array.from(select.options).some(o => o.value === prefs.lastLineKey)) {
    select.value = prefs.lastLineKey;
  }
}

function applySavedPreferencesToUI() {
  const prefs = loadUserPreferences();
  const catSelect = document.getElementById('selectCategoryType');
  const colorLineSelect = document.getElementById('selectColorLine');
  const colorFreeSelect = document.getElementById('selectColorFree');
  const freeLocInput = document.getElementById('inputFreeLocation');

  if (prefs.categoryType && catSelect) {
    catSelect.value = prefs.categoryType;
  }
  if (prefs.colorLine && colorLineSelect && COLOR_PRESETS[prefs.colorLine]) {
    colorLineSelect.value = prefs.colorLine;
  }
  if (prefs.colorFree && colorFreeSelect && COLOR_PRESETS[prefs.colorFree]) {
    colorFreeSelect.value = prefs.colorFree;
  }
  if (prefs.freeLocation && freeLocInput) {
    freeLocInput.value = prefs.freeLocation;
  }

  refreshLinesDropdown();
}

document.getElementById('selectCategoryType').addEventListener('change', (e) => {
  saveUserPreferences({ categoryType: e.target.value });
  refreshLinesDropdown();
});

document.getElementById('selectLine').addEventListener('change', (e) => {
  saveUserPreferences({ lastLineKey: e.target.value });
});

document.getElementById('selectColorLine').addEventListener('change', (e) => {
  saveUserPreferences({ colorLine: e.target.value });
});

document.getElementById('selectColorFree').addEventListener('change', (e) => {
  saveUserPreferences({ colorFree: e.target.value });
});

document.getElementById('inputFreeLocation').addEventListener('change', (e) => {
  saveUserPreferences({ freeLocation: e.target.value.trim() });
});

applySavedPreferencesToUI();
setTimeout(applySavedPreferencesToUI, 250);

const mapBanner = document.createElement('div');
mapBanner.className = 'map-instruction-banner';
mapBanner.id = 'mapInstructionBanner';
mapBanner.style.display = 'none';
document.body.appendChild(mapBanner);

const mobileTopBar = document.createElement('div');
mobileTopBar.className = 'mobile-top-bar';
mobileTopBar.id = 'mobileTopBar';
mobileTopBar.style.display = 'none';
mobileTopBar.innerHTML = `
  <span>⏱️ <strong id="miniTimerDisplay" style="color:#10b981; font-family:monospace;">00:00</strong></span>
  <span>📍 <strong id="miniKmDisplay" style="color:#38bdf8;">0.00 km</strong></span>
  <span>🚀 <strong id="miniSpeedDisplay" style="color:#fbbf24;">0</strong> km/h</span>
  <button class="btn-toggle-hud" id="btnToggleHud">📊 Menu</button>
`;
document.body.appendChild(mobileTopBar);

let hudContainer = document.createElement('div');
hudContainer.className = 'hud';
hudContainer.style.display = 'none';
document.body.appendChild(hudContainer);

hudContainer.innerHTML = `
  <h2>🛣️ Trajeto Operacional</h2>
  <div class="line-badge" id="lineBadgeDisplay">---</div>

  <div class="trip-info-box">
    <div class="trip-km-row">
      <span>Tempo de Viagem:</span>
      <span class="trip-timer-val" id="tripTimerDisplay">00:00</span>
    </div>
    <div class="trip-km-row">
      <span>Percorrido:</span>
      <span class="trip-km-val" id="kmCoveredDisplay">0.00 km</span>
    </div>
  </div>

  <div class="trip-status-badge stopped" id="tripStatusBadge">Aguardando Partida</div>
  <button class="btn-trip-toggle start" id="btnTripToggle">▶️ Dar Entrada na Viagem</button>

  <div class="zoom-controls">
    <button id="btnZoomNear" class="btn-zoom">🔍 Perto</button>
    <button id="btnZoomFar" class="btn-zoom active">🌐 Longe</button>
  </div>

  <button class="btn-exit-game" id="btnExitGame">🚪 Sair do Jogo</button>
`;

let speedBox = document.createElement('div');
speedBox.className = 'speedometer-container';
speedBox.style.display = 'none';
speedBox.innerHTML = '<span id="speedValue">0</span><span class="speed-unit">km/h</span>';
document.body.appendChild(speedBox);

let bottomCockpitBar = document.createElement('div');
bottomCockpitBar.className = 'bottom-cockpit-bar';
bottomCockpitBar.style.display = 'none';
bottomCockpitBar.innerHTML = `
  <div class="cross-dpad" aria-label="Controle Direcional">
    <div class="dpad-cross-v"></div>
    <div class="dpad-cross-h"></div>
    <button class="dpad-arm-btn dpad-up" id="btnDpadUp" title="Acelerar">
      <svg viewBox="0 0 24 24"><path d="M12 4.5c.6 0 1.2.3 1.5.9l6.8 11.2c.7 1.1-.1 2.6-1.5 2.6H5.2c-1.4 0-2.2-1.5-1.5-2.6l6.8-11.2c.3-.6.9-.9 1.5-.9z"/></svg>
    </button>
    <button class="dpad-arm-btn dpad-left" id="btnDpadLeft" title="Esquerda">
      <svg viewBox="0 0 24 24"><path d="M4.5 12c0-.6.3-1.2.9-1.5l11.2-6.8c1.1-.7 2.6.1 2.6 1.5v13.6c0 1.4-1.5 2.2-2.6 1.5L5.4 13.5c-.6-.3-.9-.9-.9-1.5z"/></svg>
    </button>
    <button class="dpad-arm-btn dpad-right" id="btnDpadRight" title="Direita">
      <svg viewBox="0 0 24 24"><path d="M19.5 12c0 .6-.3 1.2-.9 1.5L7.4 20.3c-1.1.7-2.6-.1-2.6-1.5V5.2c0-1.4 1.5-2.2 2.6-1.5l11.2 6.8c.6.3.9.9.9 1.5z"/></svg>
    </button>
    <button class="dpad-arm-btn dpad-down" id="btnDpadDown" title="Frear / Ré">
      <svg viewBox="0 0 24 24"><path d="M12 19.5c-.6 0-1.2-.3-1.5-.9L3.7 7.4c-.7-1.1.1-2.6 1.5-2.6h13.6c1.4 0 2.2 1.5 1.5 2.6l-6.8 11.2c-.3.6-.9.9-1.5.9z"/></svg>
    </button>
  </div>
`;
document.body.appendChild(bottomCockpitBar);

let map = null;
let busMarker = null;
let animationFrameId = null;

let currentGameMode = 'line';
let activePresetKey = 'vermelho';
let currentVehicleType = 'urbano';
let activeLetreiroText = 'EXECUTIVO';

let activePath = [];
let busLng = 0;
let busLat = 0;

let currentSpeedKmh = 0;
let isAutopilotMoving = false;

let cruiseSpeedKmh = 90;
let boostSpeedKmh = 140;
const MAX_REVERSE_SPEED_KMH = -25;

let vehicleHeading = 0;
let freeSteerRate = 0;
let distanceCoveredKm = 0;

let currentSegIndex = 0;
let segProgressMeters = 0;
let currentSegLength = 0;
let targetHeading = 0;
let smoothHeading = 0;
let currentCameraBearing = 0;

// Deslocamento padrão para a faixa da direita (evita andar na contramão)
const BASE_RIGHT_LANE_OFFSET_METERS = 1.9;
let lineLateralCorrectionMeters = 0;
let lineLateralVelocity = 0;
let busVisualYawOffset = 0;
const MAX_LINE_LATERAL_ADJUST_METERS = 2.6;

let isLineFinished = false;
let isTripActive = false;

let tripStartTime = null;
let tripTimerInterval = null;
let tripStartRealTimeStr = '';
let speedMultiplier = 1.0;

let currentZoomLevel = 17.5;

const keysPressed = { Up: false, Down: false, Left: false, Right: false };

function calculateBearing(startCoord, endCoord) {
  const [startLng, startLat] = startCoord;
  const [endLng, endLat] = endCoord;

  const y = Math.sin((endLng - startLng) * Math.PI / 180) * Math.cos(endLat * Math.PI / 180);
  const x = Math.cos(startLat * Math.PI / 180) * Math.sin(endLat * Math.PI / 180) -
            Math.sin(startLat * Math.PI / 180) * Math.cos(endLat * Math.PI / 180) * Math.cos((endLng - startLng) * Math.PI / 180);

  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function lerpHeading(current, target, factor) {
  let diff = (target - current + 360) % 360;
  if (diff > 180) diff -= 360;
  return (current + diff * factor + 360) % 360;
}

function applyRightLaneOffset(lng, lat, headingDeg, lateralMeters) {
  const perpHeading = (headingDeg + 90) % 360;
  const perpRad = (perpHeading * Math.PI) / 180;
  const metersPerDegreeLat = 111320;
  const metersPerDegreeLng = 111320 * Math.cos(lat * (Math.PI / 180));
  return [
    lng + (lateralMeters * Math.sin(perpRad)) / metersPerDegreeLng,
    lat + (lateralMeters * Math.cos(perpRad)) / metersPerDegreeLat
  ];
}

function startTripTimer() {
  tripStartTime = Date.now();
  const nowObj = new Date();
  tripStartRealTimeStr = String(nowObj.getHours()).padStart(2, '0') + ':' + String(nowObj.getMinutes()).padStart(2, '0');

  if (tripTimerInterval) clearInterval(tripTimerInterval);
  tripTimerInterval = setInterval(() => {
    if (!tripStartTime) return;
    const diff = Math.floor((Date.now() - tripStartTime) / 1000);
    const mins = String(Math.floor(diff / 60)).padStart(2, '0');
    const secs = String(diff % 60).padStart(2, '0');
    const timeFormatted = `${mins}:${secs}`;
    document.getElementById('tripTimerDisplay').textContent = timeFormatted;
    document.getElementById('miniTimerDisplay').textContent = timeFormatted;
  }, 1000);
}

function stopTripTimer() {
  if (tripTimerInterval) {
    clearInterval(tripTimerInterval);
    tripTimerInterval = null;
  }
}

document.getElementById('btnToggleHud').addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  hudContainer.classList.toggle('mobile-visible');
});

function updateBusMarkerIcon() {
  if (!busMarker) return;
  const preset = COLOR_PRESETS[activePresetKey] || COLOR_PRESETS['vermelho'];
  busMarker.getElement().src = getBusSvg(preset.bodyColor, preset.stripeColor, currentVehicleType, activeLetreiroText);
}

function bindControlTouch(elementId, keyName) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (keyName === 'Up') handleAccelerate();
    keysPressed[keyName] = true;
    el.classList.add('pressed');
  });
  const stopTouch = (e) => {
    e.preventDefault();
    keysPressed[keyName] = false;
    el.classList.remove('pressed');
  };
  el.addEventListener('pointerup', stopTouch);
  el.addEventListener('pointercancel', stopTouch);
  el.addEventListener('pointerleave', stopTouch);
}

bindControlTouch('btnDpadUp', 'Up');
bindControlTouch('btnDpadDown', 'Down');
bindControlTouch('btnDpadLeft', 'Left');
bindControlTouch('btnDpadRight', 'Right');

document.getElementById('btnSelectLineMode').addEventListener('click', () => {
  refreshLinesDropdown();
  document.getElementById('cardMainMenu').style.display = 'none';
  document.getElementById('cardLineMode').style.display = 'block';
});

document.getElementById('btnSelectFreeMode').addEventListener('click', () => {
  document.getElementById('cardMainMenu').style.display = 'none';
  document.getElementById('cardFreeMode').style.display = 'block';
});

document.getElementById('btnBackLine').addEventListener('click', () => {
  document.getElementById('cardLineMode').style.display = 'none';
  document.getElementById('cardMainMenu').style.display = 'block';
});

document.getElementById('btnBackFree').addEventListener('click', () => {
  document.getElementById('cardFreeMode').style.display = 'none';
  document.getElementById('cardMainMenu').style.display = 'block';
});

const btnTripToggle = document.getElementById('btnTripToggle');
btnTripToggle.addEventListener('click', () => {
  if (!isTripActive) {
    isTripActive = true;
    isLineFinished = false;
    isAutopilotMoving = true;
    startTripTimer();
    updateTripStatus();
  } else {
    isTripActive = false;
    isAutopilotMoving = false;
    currentSpeedKmh = 0;
    stopTripTimer();
    updateTripStatus();
  }
});

document.getElementById('btnStartLineMode').addEventListener('click', () => {
  currentGameMode = 'line';
  const selectedKey = document.getElementById('selectLine').value;
  activePresetKey = document.getElementById('selectColorLine').value || 'vermelho';
  saveUserPreferences({ lastLineKey: selectedKey, colorLine: activePresetKey });

  const db = getLinesDatabase();
  const lineData = db[selectedKey] || Object.values(db)[0];
  if (!lineData) {
    showAlert('Nenhuma linha cadastrada disponível no dados_rotas.js.');
    return;
  }

  currentVehicleType = lineData.tipo === 'rodoviario' ? 'rodoviario' : 'urbano';
  activeLetreiroText = lineData.nome || 'LINHA MUNICIPAL';

  if (currentVehicleType === 'rodoviario') {
    cruiseSpeedKmh = 140;
    boostSpeedKmh = 180;
  } else {
    cruiseSpeedKmh = 80;
    boostSpeedKmh = 100;
  }

  activePath = extractCoordinates(lineData.trajeto);
  speedMultiplier = 1.0;

  if (activePath.length < 2) {
    showAlert('A linha selecionada não possui coordenadas de trajeto válidas.');
    return;
  }

  document.getElementById('lineBadgeDisplay').textContent = `${lineData.nome}`;
  currentSegIndex = 0;
  segProgressMeters = 0;
  currentSegLength = getMetersBetween(activePath[0], activePath[1]);
  isLineFinished = false;
  isTripActive = false;
  isAutopilotMoving = false;
  currentSpeedKmh = 0;
  distanceCoveredKm = 0;
  lineLateralCorrectionMeters = 0;
  lineLateralVelocity = 0;
  busVisualYawOffset = 0;

  targetHeading = calculateBearing(activePath[0], activePath[1]);
  smoothHeading = targetHeading;
  vehicleHeading = targetHeading;
  currentCameraBearing = targetHeading;

  const initialLanePos = applyRightLaneOffset(
    activePath[0][0],
    activePath[0][1],
    targetHeading,
    BASE_RIGHT_LANE_OFFSET_METERS
  );

  updateTripStatus();
  startSimulation(activePath[0], initialLanePos);
});

document.getElementById('btnStartFreeMode').addEventListener('click', async () => {
  currentGameMode = 'free';
  currentVehicleType = 'urbano';
  activeLetreiroText = 'EXECUTIVO LIVRE';
  activePresetKey = document.getElementById('selectColorFree').value || 'vermelho';
  const locationQuery = document.getElementById('inputFreeLocation').value.trim();
  saveUserPreferences({ colorFree: activePresetKey, freeLocation: locationQuery });

  document.getElementById('lineBadgeDisplay').textContent = 'Modo Livre';

  currentSpeedKmh = 0;
  isAutopilotMoving = false;
  distanceCoveredKm = 0;
  cruiseSpeedKmh = 90;
  boostSpeedKmh = 140;
  speedMultiplier = 1.0;
  isTripActive = true;
  vehicleHeading = 0;
  freeSteerRate = 0;
  lineLateralCorrectionMeters = 0;
  lineLateralVelocity = 0;
  busVisualYawOffset = 0;
  currentCameraBearing = 0;
  updateTripStatus();
  startTripTimer();

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}`);
    const data = await res.json();
    if (data && data.length > 0) {
      const lon = parseFloat(data[0].lon);
      const lat = parseFloat(data[0].lat);
      startSimulation([lon, lat], [lon, lat]);
    } else {
      startSimulation([-43.941879, -19.913783], [-43.941879, -19.913783]);
    }
  } catch (err) {
    startSimulation([-43.941879, -19.913783], [-43.941879, -19.913783]);
  }
});

function startSimulation(baseCoords, initialRenderCoords) {
  setupModal.style.display = 'none';

  mobileTopBar.style.display = 'flex';
  bottomCockpitBar.style.display = 'flex';
  speedBox.style.display = 'flex';

  if (currentGameMode === 'free') {
    btnTripToggle.style.display = 'none';
  } else {
    btnTripToggle.style.display = 'block';
  }

  busLng = baseCoords[0];
  busLat = baseCoords[1];

  const startRender = initialRenderCoords || baseCoords;
  initMap(startRender);
  setTimeout(() => {
    if (map) map.resize();
  }, 250);
}

function exitGame() {
  stopTripTimer();
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  if (busMarker) {
    busMarker.remove();
    busMarker = null;
  }
  if (map) {
    map.remove();
    map = null;
  }
  currentSpeedKmh = 0;
  isAutopilotMoving = false;
  isTripActive = false;
  vehicleHeading = 0;
  freeSteerRate = 0;
  distanceCoveredKm = 0;
  speedMultiplier = 1.0;
  lineLateralCorrectionMeters = 0;
  lineLateralVelocity = 0;
  busVisualYawOffset = 0;
  document.getElementById('tripTimerDisplay').textContent = '00:00';
  document.getElementById('miniTimerDisplay').textContent = '00:00';
  document.getElementById('kmCoveredDisplay').textContent = '0.00 km';
  document.getElementById('miniKmDisplay').textContent = '0.00 km';
  document.getElementById('miniSpeedDisplay').textContent = '0';

  hudContainer.style.display = 'none';
  hudContainer.classList.remove('mobile-visible');
  speedBox.style.display = 'none';
  mobileTopBar.style.display = 'none';
  bottomCockpitBar.style.display = 'none';
  mapBanner.style.display = 'none';

  document.getElementById('cardLineMode').style.display = 'none';
  document.getElementById('cardFreeMode').style.display = 'none';
  document.getElementById('cardMainMenu').style.display = 'block';
  setupModal.style.display = 'flex';
}

document.getElementById('btnExitGame').addEventListener('click', exitGame);

function mostrarRelatorioFinal() {
  stopTripTimer();
  isTripActive = false;
  isAutopilotMoving = false;
  currentSpeedKmh = 0;

  const tempoStr = document.getElementById('tripTimerDisplay').textContent;
  const kmStr = document.getElementById('kmCoveredDisplay').textContent;
  const nomeLinha = document.getElementById('lineBadgeDisplay').textContent;

  const nowObj = new Date();
  const chegadaStr = String(nowObj.getHours()).padStart(2, '0') + ':' + String(nowObj.getMinutes()).padStart(2, '0');

  const reportOverlay = document.createElement('div');
  reportOverlay.className = 'report-modal-overlay';
  reportOverlay.innerHTML = `
    <div class="report-card">
      <h2>🏆 Viagem Concluída!</h2>
      <p style="color: #94a3b8; font-size: 0.9rem;">Relatório Oficial de Operação</p>

      <div class="report-stats">
        <span>Linha: <strong>${nomeLinha}</strong></span>
        <span>Horário de Saída: <strong>${tripStartRealTimeStr || '00:00'}</strong></span>
        <span>Horário de Chegada: <strong>${chegadaStr}</strong></span>
        <span>Tempo da Viagem: <strong>${tempoStr}</strong></span>
        <span>Km Rodados: <strong>${kmStr}</strong></span>
      </div>

      <button class="btn-close-report" id="btnCloseReport">Voltar ao Menu Principal</button>
    </div>
  `;
  document.body.appendChild(reportOverlay);

  document.getElementById('btnCloseReport').addEventListener('click', () => {
    reportOverlay.remove();
    exitGame();
  });
}

function getBusSvg(bodyColor, stripeColor, tipo = 'urbano', letreiroText = 'EXECUTIVO') {
  let bodyPath = tipo === 'rodoviario'
    ? '<path d="M 12,18 C 12,8 20,4 50,4 C 80,4 88,8 88,18 L 90,188 C 90,195 80,196 50,196 C 20,196 10,195 10,188 Z" fill="' + bodyColor + '" />'
    : '<path d="M 10,15 C 10,6 18,4 50,4 C 82,4 90,6 90,15 L 90,188 C 90,195 80,196 50,196 C 20,196 10,195 10,188 Z" fill="' + bodyColor + '" />';

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" width="100" height="200">
      <rect x="4" y="6" width="92" height="188" rx="10" fill="rgba(0,0,0,0.5)" filter="blur(3px)" />
      ${bodyPath}
      <path d="M 10,75 L 90,75 L 90,135 L 10,138 Z" fill="${stripeColor}" opacity="0.95" />
      <path d="M 10,135 L 90,130 L 90,188 C 90,194 80,196 50,196 C 20,196 10,194 10,188 Z" fill="#1e293b" />
      <path d="M 14,10 L 86,10 L 80,38 L 20,38 Z" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.5" />
      <path d="M 17,13 L 83,13 L 78,35 L 22,35 Z" fill="#38bdf8" opacity="0.7" />

      <rect x="24" y="16" width="52" height="14" rx="2" fill="#000000" stroke="#38bdf8" stroke-width="0.8" />
      <text x="50" y="26" fill="#4ade80" font-size="8" font-weight="bold" font-family="monospace" text-anchor="middle">${letreiroText}</text>

      <rect x="12" y="46" width="8" height="25" rx="2" fill="#38bdf8" opacity="0.6" />
      <rect x="80" y="46" width="8" height="25" rx="2" fill="#38bdf8" opacity="0.6" />
      <rect x="12" y="80" width="8" height="25" rx="2" fill="#38bdf8" opacity="0.6" />
      <rect x="80" y="80" width="8" height="25" rx="2" fill="#38bdf8" opacity="0.6" />

      <rect x="14" y="3" width="12" height="4" rx="1" fill="#fbbf24" />
      <rect x="74" y="3" width="12" height="4" rx="1" fill="#fbbf24" />
      <rect x="16" y="193" width="10" height="3" fill="#ef4444" rx="1" />
      <rect x="74" y="193" width="10" height="3" fill="#ef4444" rx="1" />
    </svg>
  `);
}

function initMap(startCoords) {
  if (map) {
    map.remove();
    map = null;
  }

  const initialBearing = currentGameMode === 'line' ? smoothHeading : vehicleHeading;

  map = new maplibregl.Map({
    container: 'map',
    antialias: true,
    style: {
      version: 8,
      sources: {
        'google-hybrid-source': {
          type: 'raster',
          tiles: [
            'https://mt0.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}',
            'https://mt1.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}',
            'https://mt2.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}',
            'https://mt3.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}'
          ],
          tileSize: 256,
          maxzoom: 22
        }
      },
      layers: [{ id: 'google-hybrid-layer', type: 'raster', source: 'google-hybrid-source', minzoom: 0, maxzoom: 22 }]
    },
    center: startCoords,
    zoom: currentZoomLevel,
    pitch: 25,
    bearing: initialBearing,
    renderWorldCopies: false
  });

  const preset = COLOR_PRESETS[activePresetKey] || COLOR_PRESETS['vermelho'];

  const busImg = document.createElement('img');
  busImg.className = 'bus-marker-img';
  busImg.src = getBusSvg(preset.bodyColor, preset.stripeColor, currentVehicleType, activeLetreiroText);

  busMarker = new maplibregl.Marker({
    element: busImg,
    anchor: 'center',
    rotationAlignment: 'map',
    pitchAlignment: 'map'
  })
    .setLngLat(startCoords)
    .setRotation(initialBearing)
    .addTo(map);

  map.on('load', () => {
    map.resize();
    setTimeout(() => { if (map) map.resize(); }, 250);
    busMarker.setLngLat(startCoords);
    lastFrameTime = performance.now();
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(gameLoop);
  });
}

function updateTripStatus() {
  const badge = document.getElementById('tripStatusBadge');
  if (!isTripActive && !isLineFinished) {
    badge.className = 'trip-status-badge stopped';
    badge.textContent = 'Aguardando Início';
    btnTripToggle.className = 'btn-trip-toggle start';
    btnTripToggle.textContent = '▶️ Dar Entrada na Viagem';
  } else if (isLineFinished) {
    badge.className = 'trip-status-badge stopped';
    badge.textContent = 'Viagem Concluída';
    btnTripToggle.className = 'btn-trip-toggle start';
    btnTripToggle.textContent = '🔄 Reiniciar Viagem';
  } else {
    badge.className = 'trip-status-badge running';
    badge.textContent = 'Em Viagem';
    btnTripToggle.className = 'btn-trip-toggle stop';
    btnTripToggle.textContent = '🛑 Encerrar Viagem';
  }
}

function handleAccelerate() {
  if (!isTripActive && currentGameMode === 'line') {
    isTripActive = true;
    startTripTimer();
  }
  mapBanner.style.display = 'none';
  isAutopilotMoving = true;
  updateTripStatus();
}

let lastFrameTime = performance.now();

function gameLoop(now) {
  if (!map) return;

  const deltaTime = Math.min((now - lastFrameTime) / 1000, 0.1);
  lastFrameTime = now;

  const prev = [busLng, busLat];

  let desiredSpeed = 0;

  if (keysPressed.Up) {
    if (!isTripActive && currentGameMode === 'line') {
      isTripActive = true;
      startTripTimer();
    }
    mapBanner.style.display = 'none';
    isAutopilotMoving = true;
    updateTripStatus();
  }

  let renderLng = busLng;
  let renderLat = busLat;
  let busWorldHeading = vehicleHeading;

  if (currentGameMode === 'line') {
    if (isTripActive && isAutopilotMoving && !isLineFinished) {
      if (keysPressed.Down) {
        desiredSpeed = 0;
        currentSpeedKmh = Math.max(currentSpeedKmh - 60 * deltaTime, 0);
        if (currentSpeedKmh <= 2) {
          isAutopilotMoving = false;
        }
      } else if (keysPressed.Up) {
        desiredSpeed = boostSpeedKmh;
      } else {
        desiredSpeed = cruiseSpeedKmh;
      }
    }

    if (currentSpeedKmh < desiredSpeed) {
      currentSpeedKmh = Math.min(currentSpeedKmh + 50 * deltaTime, desiredSpeed);
    } else if (currentSpeedKmh > desiredSpeed) {
      currentSpeedKmh = Math.max(currentSpeedKmh - 40 * deltaTime, desiredSpeed);
    }

    if (currentSpeedKmh > 0 && !isLineFinished && isTripActive) {
      const speedMps = (currentSpeedKmh / 3.6) * speedMultiplier;
      let remainingDistance = speedMps * deltaTime;

      while (remainingDistance > 0 && currentSegIndex < activePath.length - 1) {
        const p1 = activePath[currentSegIndex];
        const p2 = activePath[currentSegIndex + 1];

        if (currentSegLength <= 0) {
          currentSegLength = getMetersBetween(p1, p2);
        }

        if (currentSegLength <= 0.1) {
          currentSegIndex++;
          segProgressMeters = 0;
          currentSegLength = currentSegIndex < activePath.length - 1
            ? getMetersBetween(activePath[currentSegIndex], activePath[currentSegIndex + 1])
            : 0;
          continue;
        }

        const distanceLeftInSeg = currentSegLength - segProgressMeters;

        if (remainingDistance < distanceLeftInSeg) {
          segProgressMeters += remainingDistance;
          remainingDistance = 0;

          const ratio = segProgressMeters / currentSegLength;
          busLng = p1[0] + (p2[0] - p1[0]) * ratio;
          busLat = p1[1] + (p2[1] - p1[1]) * ratio;

          targetHeading = calculateBearing(p1, p2);
        } else {
          remainingDistance -= distanceLeftInSeg;
          currentSegIndex++;
          segProgressMeters = 0;

          if (currentSegIndex >= activePath.length - 1) {
            busLng = activePath[activePath.length - 1][0];
            busLat = activePath[activePath.length - 1][1];
            isLineFinished = true;
            mostrarRelatorioFinal();
            break;
          } else {
            currentSegLength = getMetersBetween(activePath[currentSegIndex], activePath[currentSegIndex + 1]);
            busLng = activePath[currentSegIndex][0];
            busLat = activePath[currentSegIndex][1];
            targetHeading = calculateBearing(activePath[currentSegIndex], activePath[currentSegIndex + 1]);
          }
        }
      }

      // Esterçamento natural ao mudar de lado na faixa: gira o nariz do ônibus e desloca sem patinar de lado
      const speedFactor = Math.min(1, Math.max(0.15, currentSpeedKmh / 35));
      const maxLateralSpeed = 2.6 * speedFactor;
      let targetLateralVel = 0;

      if (keysPressed.Left) {
        targetLateralVel = -maxLateralSpeed;
      } else if (keysPressed.Right) {
        targetLateralVel = maxLateralSpeed;
      }

      lineLateralVelocity += (targetLateralVel - lineLateralVelocity) * Math.min(1, 7.5 * deltaTime);
      lineLateralCorrectionMeters = Math.max(
        -MAX_LINE_LATERAL_ADJUST_METERS,
        Math.min(MAX_LINE_LATERAL_ADJUST_METERS, lineLateralCorrectionMeters + lineLateralVelocity * deltaTime)
      );

      // Quando não está pressionando esquerda/direita, retorna suavemente ao alinhamento da faixa direita
      if (!keysPressed.Left && !keysPressed.Right) {
        lineLateralCorrectionMeters += (0 - lineLateralCorrectionMeters) * Math.min(1, 2.2 * deltaTime);
      }

      // Calcula o ângulo de esterçamento da frente do veículo proporcional ao movimento lateral
      const targetYawOffset = (lineLateralVelocity / Math.max(0.5, maxLateralSpeed)) * 15;
      busVisualYawOffset += (targetYawOffset - busVisualYawOffset) * Math.min(1, 9.0 * deltaTime);
    } else {
      lineLateralVelocity = 0;
      busVisualYawOffset += (0 - busVisualYawOffset) * Math.min(1, 8.0 * deltaTime);
    }

    smoothHeading = lerpHeading(smoothHeading, targetHeading, 6.0 * deltaTime);

    const totalRightOffset = BASE_RIGHT_LANE_OFFSET_METERS + lineLateralCorrectionMeters;
    const lanePos = applyRightLaneOffset(busLng, busLat, smoothHeading, totalRightOffset);
    renderLng = lanePos[0];
    renderLat = lanePos[1];
    busWorldHeading = (smoothHeading + busVisualYawOffset + 360) % 360;
  } else {
    if (keysPressed.Up) {
      if (currentSpeedKmh < 0) {
        currentSpeedKmh = Math.min(currentSpeedKmh + 65 * deltaTime, 0);
      } else {
        desiredSpeed = boostSpeedKmh;
        currentSpeedKmh = Math.min(currentSpeedKmh + 50 * deltaTime, desiredSpeed);
      }
    } else if (keysPressed.Down) {
      if (currentSpeedKmh > 0) {
        currentSpeedKmh = Math.max(currentSpeedKmh - 70 * deltaTime, 0);
      } else {
        currentSpeedKmh = Math.max(currentSpeedKmh - 30 * deltaTime, MAX_REVERSE_SPEED_KMH);
      }
    } else {
      if (currentSpeedKmh > 0) {
        currentSpeedKmh = Math.max(currentSpeedKmh - 25 * deltaTime, 0);
      } else if (currentSpeedKmh < 0) {
        currentSpeedKmh = Math.min(currentSpeedKmh + 25 * deltaTime, 0);
      }
    }

    // Esterçamento progressivo vinculado ao movimento (evita rodar no próprio eixo parado ou patinar)
    const absSpeed = Math.abs(currentSpeedKmh);
    const steerInput = (keysPressed.Right ? 1 : 0) - (keysPressed.Left ? 1 : 0);
    const speedTurnScale = absSpeed < 1.0 ? 0 : Math.min(1, 0.35 + (absSpeed / 40) * 0.65);
    const targetSteerRate = steerInput * 52 * speedTurnScale;
    freeSteerRate += (targetSteerRate - freeSteerRate) * Math.min(1, 8.5 * deltaTime);

    if (absSpeed > 0.1) {
      const reverseDirFactor = currentSpeedKmh < -0.5 ? -1 : 1;
      vehicleHeading = (vehicleHeading + freeSteerRate * reverseDirFactor * deltaTime + 360) % 360;

      const speedMps = (currentSpeedKmh / 3.6) * speedMultiplier;
      const metersToMove = speedMps * deltaTime;
      const metersPerDegreeLat = 111320;
      const metersPerDegreeLng = 111320 * Math.cos(busLat * (Math.PI / 180));

      const rad = (vehicleHeading * Math.PI) / 180;
      busLng += (metersToMove * Math.sin(rad)) / metersPerDegreeLng;
      busLat += (metersToMove * Math.cos(rad)) / metersPerDegreeLat;
    }

    renderLng = busLng;
    renderLat = busLat;
    busWorldHeading = (vehicleHeading + freeSteerRate * 0.18 + 360) % 360;
  }

  const distStep = getMetersBetween(prev, [busLng, busLat]) / 1000;
  if (!isNaN(distStep)) {
    distanceCoveredKm += distStep;
  }

  const distFormatted = `${distanceCoveredKm.toFixed(2)} km`;
  const isReversing = currentGameMode === 'free' && currentSpeedKmh < -0.5;
  const speedRounded = Math.round(Math.abs(currentSpeedKmh));
  const speedDisplay = isReversing ? `R ${speedRounded}` : `${speedRounded}`;

  document.getElementById('kmCoveredDisplay').textContent = distFormatted;
  document.getElementById('miniKmDisplay').textContent = distFormatted;
  document.getElementById('speedValue').textContent = speedDisplay;
  document.getElementById('miniSpeedDisplay').textContent = speedDisplay;

  const currentCoords = [renderLng, renderLat];
  if (busMarker) {
    busMarker.setLngLat(currentCoords);
    busMarker.setRotation(busWorldHeading);
  }

  const rawTargetBearing = currentGameMode === 'line' ? smoothHeading : vehicleHeading;
  currentCameraBearing = lerpHeading(currentCameraBearing, rawTargetBearing, 5.5 * deltaTime);

  map.jumpTo({
    center: currentCoords,
    bearing: currentCameraBearing,
    pitch: 25,
    zoom: currentZoomLevel
  });

  if (!isLineFinished) {
    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

document.getElementById('btnZoomNear').addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  currentZoomLevel = 19.2;
  document.getElementById('btnZoomNear').classList.add('active');
  document.getElementById('btnZoomFar').classList.remove('active');
});

document.getElementById('btnZoomFar').addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  currentZoomLevel = 17.5;
  document.getElementById('btnZoomFar').classList.add('active');
  document.getElementById('btnZoomNear').classList.remove('active');
});

window.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'KeyW'].includes(e.code)) {
    if (!keysPressed.Up) handleAccelerate();
    keysPressed.Up = true;
    document.getElementById('btnDpadUp')?.classList.add('pressed');
  }
  if (['ArrowDown', 'KeyS'].includes(e.code)) {
    keysPressed.Down = true;
    document.getElementById('btnDpadDown')?.classList.add('pressed');
  }
  if (['ArrowLeft', 'KeyA'].includes(e.code)) {
    keysPressed.Left = true;
    document.getElementById('btnDpadLeft')?.classList.add('pressed');
  }
  if (['ArrowRight', 'KeyD'].includes(e.code)) {
    keysPressed.Right = true;
    document.getElementById('btnDpadRight')?.classList.add('pressed');
  }
});

window.addEventListener('keyup', (e) => {
  if (['ArrowUp', 'KeyW'].includes(e.code)) {
    keysPressed.Up = false;
    document.getElementById('btnDpadUp')?.classList.remove('pressed');
  }
  if (['ArrowDown', 'KeyS'].includes(e.code)) {
    keysPressed.Down = false;
    document.getElementById('btnDpadDown')?.classList.remove('pressed');
  }
  if (['ArrowLeft', 'KeyA'].includes(e.code)) {
    keysPressed.Left = false;
    document.getElementById('btnDpadLeft')?.classList.remove('pressed');
  }
  if (['ArrowRight', 'KeyD'].includes(e.code)) {
    keysPressed.Right = false;
    document.getElementById('btnDpadRight')?.classList.remove('pressed');
  }
});
