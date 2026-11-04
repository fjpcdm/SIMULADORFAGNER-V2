// ============================================================
// ARQUIVO: script.js
// MOTOR DE SIMULAÇÃO - COM PROJEÇÃO PRECISA DE PARAGENS
// ============================================================

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
    top: 60px !important;
    left: 15px !important;
    z-index: 999999 !important;
    background: rgba(15, 23, 42, 0.92) !important;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    color: #ffffff !important;
    padding: 12px !important;
    border-radius: 12px !important;
    border: 1px solid rgba(255, 255, 255, 0.25) !important;
    width: 260px;
    max-width: calc(100vw - 30px);
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

  .pax-status-card {
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 8px 10px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pax-status-main {
    font-size: 0.8rem;
    color: #cbd5e1;
  }

  .pax-status-main strong {
    font-size: 1.15rem;
    color: #38bdf8;
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
    margin-top: 8px;
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
    bottom: 20px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    z-index: 999999 !important;
    background: rgba(10, 15, 25, 0.9) !important;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    color: #38bdf8 !important;
    padding: 8px 22px !important;
    border-radius: 25px !important;
    font-size: 1.6rem !important;
    font-weight: 800 !important;
    border: 2px solid #38bdf8 !important;
    display: flex;
    align-items: baseline;
    gap: 6px;
    pointer-events: none;
    box-shadow: 0 4px 15px rgba(0,0,0,0.6);
  }

  .speed-unit {
    font-size: 0.85rem;
    font-weight: 600;
    color: #94a3b8;
  }

  .mobile-controls-left {
    position: absolute !important;
    bottom: 30px !important;
    left: 15px !important;
    z-index: 999999 !important;
    display: flex;
    gap: 10px;
  }

  .mobile-controls-right {
    position: absolute !important;
    bottom: 85px !important;
    right: 15px !important;
    z-index: 999999 !important;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .btn-drive-touch {
    width: 62px;
    height: 62px;
    background: rgba(15, 23, 42, 0.9);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border: 2px solid #38bdf8;
    border-radius: 50%;
    color: #ffffff;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  }

  .btn-drive-touch:active {
    background: rgba(56, 189, 248, 0.5);
    transform: scale(0.95);
  }

  .btn-drive-touch.btn-accel {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.5);
  }

  .btn-drive-touch.btn-accel:active {
    background: rgba(16, 185, 129, 0.9);
  }

  .btn-drive-touch.btn-brake {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.5);
  }

  .btn-drive-touch.btn-brake:active {
    background: rgba(239, 68, 68, 0.9);
  }

  .alert-toast {
    position: fixed;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    background: #ef4444;
    color: #ffffff;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 0.9rem;
    z-index: 10000000;
    text-align: center;
    display: none;
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

  .stop-marker-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .stop-marker-label {
    background: #f59e0b;
    color: #0f172a;
    font-weight: bold;
    font-size: 0.72rem;
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid #ffffff;
    white-space: nowrap;
    box-shadow: 0 3px 8px rgba(0,0,0,0.7);
  }

  .maplibregl-marker {
    z-index: 9999999 !important;
    pointer-events: none !important;
  }

  .bus-marker-img {
    width: 28px !important;
    height: 64px !important;
    display: block !important;
    filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.95));
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
  }, 4000);
}

const COLOR_PRESETS = {
  'vermelho': { name: 'Vermelho', bodyColor: '#dc2626', stripeColor: '#ffffff' },
  'azul': { name: 'Azul', bodyColor: '#2563eb', stripeColor: '#ffffff' },
  'laranja': { name: 'Laranja', bodyColor: '#ea580c', stripeColor: '#ffffff' },
  'amarelo': { name: 'Amarelo', bodyColor: '#eab308', stripeColor: '#ffffff' },
  'verde': { name: 'Verde', bodyColor: '#16a34a', stripeColor: '#ffffff' },
  'trem_azul': { name: 'Trem Azul', bodyColor: '#1C4485', stripeColor: '#ffffff' },
  'trem_laranja': { name: 'Trem Laranja', bodyColor: '#E76F43', stripeColor: '#ffffff' }
};

function getLinesDatabase() {
  return window.linesDatabase || {};
}

function extractCoordinates(rawTrajeto) {
  if (!rawTrajeto) return [];
  if (Array.isArray(rawTrajeto) && Array.isArray(rawTrajeto[0]) && typeof rawTrajeto[0][0] === 'number') {
    return rawTrajeto;
  }
  if (Array.isArray(rawTrajeto) && rawTrajeto[0] && rawTrajeto[0].features) {
    const lineFeature = rawTrajeto[0].features.find(f => f.geometry && f.geometry.type === 'LineString');
    if (lineFeature) return lineFeature.geometry.coordinates;
  }
  return [];
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
      <button class="btn-mode-select" id="btnSelectLineMode">📍 Modo Linha</button>
      <button class="btn-mode-select" id="btnSelectFreeMode">🗺️ Modo Livre</button>
    </div>
  </div>

  <div class="setup-card" id="cardLineMode" style="display: none;">
    <h2>🚍 Modo Linha</h2>
    <div class="form-group">
      <label>Linha de Operação:</label>
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
      <label>Pesquisar Local / Cidade:</label>
      <input type="text" id="inputFreeLocation" value="Belo Horizonte, MG" />
    </div>
    <button class="btn-start-sim" id="btnStartFreeMode">Iniciar</button>
    <button class="btn-back-menu" id="btnBackFree">Voltar</button>
  </div>
`;
document.body.appendChild(setupModal);

function refreshLinesDropdown() {
  const select = document.getElementById('selectLine');
  if (!select) return;

  const db = getLinesDatabase();
  const keys = Object.keys(db);

  select.innerHTML = '';
  if (keys.length === 0) {
    const opt = document.createElement('option');
    opt.value = "";
    opt.textContent = "Carregando linhas do dados_rotas.js...";
    select.appendChild(opt);
    return;
  }

  keys.forEach(key => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = db[key].nome;
    select.appendChild(opt);
  });
}

refreshLinesDropdown();
setTimeout(refreshLinesDropdown, 250);
setTimeout(refreshLinesDropdown, 750);

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
  <h2>🚍 Linha Operacional</h2>
  <div class="line-badge" id="lineBadgeDisplay">---</div>

  <div class="pax-status-card" id="cardPaxStatus">
    <div class="pax-status-main">
      Passageiros a Bordo:<br>
      <strong id="paxCountDisplay">0</strong> / <span id="maxPaxDisplay">42</span>
    </div>
    <div style="text-align: right; font-size: 0.75rem; color: #94a3b8;">
      Ocupação:<br>
      <strong id="paxPercentDisplay" style="color: #10b981; font-size: 0.95rem;">0%</strong>
    </div>
  </div>

  <div class="trip-info-box">
    <div class="trip-km-row">
      <span>Tempo de Viagem:</span>
      <span class="trip-timer-val" id="tripTimerDisplay">00:00</span>
    </div>
    <div class="trip-km-row">
      <span>Percorrido:</span>
      <span class="trip-km-val" id="kmCoveredDisplay">0.00 km</span>
    </div>
    <div id="stopInfoDynamic"></div>
  </div>

  <div class="trip-status-badge stopped" id="tripStatusBadge">Aguardando Partida</div>
  <button class="btn-trip-toggle start" id="btnTripToggle">▶️ Dar Entrada na Viagem</button>

  <div class="zoom-controls">
    <button id="btnZoomNear" class="btn-zoom active">🔍 Perto</button>
    <button id="btnZoomFar" class="btn-zoom">🌐 Longe</button>
  </div>

  <button class="btn-exit-game" id="btnExitGame">🚪 Sair do Jogo</button>
`;

let speedBox = document.createElement('div');
speedBox.className = 'speedometer-container';
speedBox.style.display = 'none';
speedBox.innerHTML = '<span id="speedValue">0</span><span class="speed-unit">km/h</span>';
document.body.appendChild(speedBox);

let leftControlsContainer = document.createElement('div');
leftControlsContainer.className = 'mobile-controls-left';
leftControlsContainer.style.display = 'none';
leftControlsContainer.innerHTML = `
  <button class="btn-drive-touch" id="btnTouchLeft">⬅️</button>
  <button class="btn-drive-touch" id="btnTouchRight">➡️</button>
`;
document.body.appendChild(leftControlsContainer);

let rightControlsContainer = document.createElement('div');
rightControlsContainer.className = 'mobile-controls-right';
rightControlsContainer.style.display = 'none';
rightControlsContainer.innerHTML = `
  <button class="btn-drive-touch btn-accel" id="btnTouchUp">⬆️</button>
  <button class="btn-drive-touch btn-brake" id="btnTouchDown">⬇️</button>
`;
document.body.appendChild(rightControlsContainer);

let map = null;
let busMarker = null;
let animationFrameId = null;
let currentVisibleMarker = null;

let currentGameMode = 'line'; 
let busLabelText = '';
let passengerCount = 42;
let maxPassengers = 42;
let activePresetKey = 'vermelho';

let activePath = [];
let activeStops = [];
let currentStopIndex = 0; 
let busLng = 0;
let busLat = 0;

let currentSpeedKmh = 0;
let isAutopilotMoving = false;

let cruiseSpeedKmh = 120;
let boostSpeedKmh = 150;

let targetHeading = 0;
let smoothHeading = 0;
let distanceCoveredKm = 0;
let totalPassengersTransported = 0;

let currentSegIndex = 0;
let segProgressMeters = 0;
let currentSegLength = 0;

let isAtBusStop = false;
let isLineFinished = false;
let isTripActive = false;

let tripStartTime = null;
let tripTimerInterval = null;
let tripStartRealTimeStr = "";
let speedMultiplier = 1.0;

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

// ============================================================
// FUNÇÃO DE PROJEÇÃO GEOMÉTRICA PRECISA PARA PARAGENS
// ============================================================
function projectPointOnSegment(p, a, b) {
  const [x, y] = p;
  const [x1, y1] = a;
  const [x2, y2] = b;

  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  return [xx, yy];
}

function pre calcularProjecaoParagens(path, stops) {
  let acumuladoMeters = 0;
  const segmentDistances = [];
  for (let i = 0; i < path.length - 1; i++) {
    const d = getMetersBetween(path[i], path[i+1]);
    segmentDistances.push(d);
  }

  return stops.map((stop) => {
    let minProjDist = Infinity;
    let bestSegIdx = 0;
    let bestProjCoord = stop.coords;
    let distAlongRoute = 0;

    let currentRouteDist = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i];
      const b = path[i+1];
      const proj = projectPointOnSegment(stop.coords, a, b);
      const dProj = getMetersBetween(stop.coords, proj);

      if (dProj < minProjDist) {
        minProjDist = dProj;
        bestSegIdx = i;
        bestProjCoord = proj;
        distAlongRoute = currentRouteDist + getMetersBetween(a, proj);
      }
      currentRouteDist += segmentDistances[i];
    }

    return {
      ...stop,
      targetSegmentIndex: bestSegIdx,
      projectedCoords: bestProjCoord,
      distanceAlongRoute: distAlongRoute,
      visited: false
    };
  });
}

function startTripTimer() {
  tripStartTime = Date.now();
  const nowObj = new Date();
  tripStartRealTimeStr = String(nowObj.getHours()).padStart(2, '0') + ":" + String(nowObj.getMinutes()).padStart(2, '0');

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

function bindTouch(elementId, keyName) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (keyName === 'Up') handleAccelerate();
    keysPressed[keyName] = true;
  });
  const stopTouch = (e) => {
    e.preventDefault();
    keysPressed[keyName] = false;
  };
  el.addEventListener('pointerup', stopTouch);
  el.addEventListener('pointercancel', stopTouch);
  el.addEventListener('pointerleave', stopTouch);
}

bindTouch('btnTouchUp', 'Up');
bindTouch('btnTouchDown', 'Down');
bindTouch('btnTouchLeft', 'Left');
bindTouch('btnTouchRight', 'Right');

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
    isAtBusStop = false;
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
  busLabelText = 'RODOVIÁRIO';

  const db = getLinesDatabase();
  const lineData = db[selectedKey] || Object.values(db)[0];
  if (!lineData) {
    showAlert("Nenhuma linha cadastrada disponível no dados_rotas.js.");
    return;
  }

  const isRodoviario = lineData.tipo === 'rodoviario';
  maxPassengers = 42;
  passengerCount = Math.floor(Math.random() * 13) + 30;
  totalPassengersTransported = passengerCount;

  document.getElementById('maxPaxDisplay').textContent = maxPassengers;

  if (isRodoviario) {
    cruiseSpeedKmh = 120;
    boostSpeedKmh = 150;
  } else {
    cruiseSpeedKmh = 75;
    boostSpeedKmh = 90;
  }

  activePath = extractCoordinates(lineData.trajeto);
  
  if (selectedKey === "BH_CONGONHAS") {
    let totalDistMeters = 0;
    for (let i = 0; i < activePath.length - 1; i++) {
      totalDistMeters += getMetersBetween(activePath[i], activePath[i + 1]);
    }
    const targetTimeSeconds = 20 * 60; 
    const requiredAvgSpeedMps = totalDistMeters / targetTimeSeconds;
    const requiredAvgSpeedKmh = requiredAvgSpeedMps * 3.6;
    speedMultiplier = Math.max(1.0, requiredAvgSpeedKmh / cruiseSpeedKmh);
  } else {
    speedMultiplier = 1.0;
  }

  currentStopIndex = 0; 
  const rawStops = lineData.pontos || [];
  activeStops = pre calcularProjecaoParagens(activePath, rawStops);

  if (activePath.length < 2) {
    showAlert("A linha selecionada não possui coordenadas de trajeto válidas.");
    return;
  }

  document.getElementById('lineBadgeDisplay').textContent = `${lineData.nome}`;
  currentSegIndex = 0;
  segProgressMeters = 0;
  currentSegLength = getMetersBetween(activePath[0], activePath[1]);
  isAtBusStop = false;
  isLineFinished = false;
  isTripActive = false;
  isAutopilotMoving = false;
  currentSpeedKmh = 0;
  distanceCoveredKm = 0;

  targetHeading = calculateBearing(activePath[0], activePath[1]);
  smoothHeading = targetHeading;

  updateTripStatus();
  startSimulation(activePath[0]);
});

document.getElementById('btnStartFreeMode').addEventListener('click', async () => {
  currentGameMode = 'free';
  busLabelText = 'RODOVIÁRIO';
  activePresetKey = document.getElementById('selectColorFree').value || 'vermelho';
  const locationQuery = document.getElementById('inputFreeLocation').value.trim();

  document.getElementById('lineBadgeDisplay').textContent = `Modo Livre`;

  currentSpeedKmh = 0;
  isAutopilotMoving = false;
  distanceCoveredKm = 0;
  cruiseSpeedKmh = 120;
  boostSpeedKmh = 150;
  speedMultiplier = 1.0;
  updateTripStatus();
  startTripTimer();

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}`);
    const data = await res.json();
    if (data && data.length > 0) {
      startSimulation([parseFloat(data[0].lon), parseFloat(data[0].lat)]);
    } else {
      startSimulation([-43.941879, -19.913783]);
    }
  } catch (err) {
    startSimulation([-43.941879, -19.913783]);
  }
});

function startSimulation(startCoords) {
  setupModal.style.display = 'none';
  
  mobileTopBar.style.display = 'flex';
  rightControlsContainer.style.display = 'flex';
  speedBox.style.display = 'flex';

  const cardPax = document.getElementById('cardPaxStatus');

  if (currentGameMode === 'free') {
    leftControlsContainer.style.display = 'flex';
    document.getElementById('stopInfoDynamic').innerHTML = '';
    btnTripToggle.style.display = 'none';
    if (cardPax) cardPax.style.display = 'none';
  } else {
    leftControlsContainer.style.display = 'none';
    btnTripToggle.style.display = 'block';
    if (cardPax) cardPax.style.display = 'flex';
    updateStopInfoDisplay();
  }

  busLng = startCoords[0];
  busLat = startCoords[1];

  initMap(startCoords);
}

function updateStopInfoDisplay() {
  const nextStop = activeStops[currentStopIndex];
  const nextName = nextStop ? nextStop.nome : "Fim da Linha";
  document.getElementById('stopInfoDynamic').innerHTML = `
    <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.1);">
      <span style="color: #94a3b8;">Próxima Parada:</span><br>
      <strong style="color: #f59e0b;">🚏 ${nextName}</strong>
    </div>
  `;
}

function atualizarMarcadorProximoPonto(busCoords) {
  if (currentGameMode !== 'line' || !map) return;

  const nextStop = activeStops[currentStopIndex];
  if (!nextStop || nextStop.visited) {
    if (currentVisibleMarker) {
      currentVisibleMarker.remove();
      currentVisibleMarker = null;
    }
    return;
  }

  const distToStop = getMetersBetween(busCoords, nextStop.projectedCoords);

  if (distToStop <= 250.0) {
    if (!currentVisibleMarker || currentVisibleMarker._stopId !== nextStop.id) {
      if (currentVisibleMarker) currentVisibleMarker.remove();

      const el = document.createElement('div');
      el.className = 'stop-marker-container';
      el.innerHTML = `<div class="stop-marker-label">🚏 ${nextStop.nome}</div>`;

      currentVisibleMarker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(nextStop.projectedCoords)
        .addTo(map);
      currentVisibleMarker._stopId = nextStop.id;
    }
  } else {
    if (currentVisibleMarker) {
      currentVisibleMarker.remove();
      currentVisibleMarker = null;
    }
  }
}

function exitGame() {
  stopTripTimer();
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  if (currentVisibleMarker) {
    currentVisibleMarker.remove();
    currentVisibleMarker = null;
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
  targetHeading = 0;
  smoothHeading = 0;
  distanceCoveredKm = 0;
  currentStopIndex = 0;
  totalPassengersTransported = 0;
  speedMultiplier = 1.0;
  document.getElementById('tripTimerDisplay').textContent = '00:00';
  document.getElementById('miniTimerDisplay').textContent = '00:00';
  document.getElementById('kmCoveredDisplay').textContent = '0.00 km';
  document.getElementById('miniKmDisplay').textContent = '0.00 km';
  document.getElementById('miniSpeedDisplay').textContent = '0';

  hudContainer.style.display = 'none';
  hudContainer.classList.remove('mobile-visible');
  speedBox.style.display = 'none';
  mobileTopBar.style.display = 'none';
  leftControlsContainer.style.display = 'none';
  rightControlsContainer.style.display = 'none';
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
  const chegadaStr = String(nowObj.getHours()).padStart(2, '0') + ":" + String(nowObj.getMinutes()).padStart(2, '0');

  const reportOverlay = document.createElement('div');
  reportOverlay.className = 'report-modal-overlay';
  reportOverlay.innerHTML = `
    <div class="report-card">
      <h2>🏆 Viagem Concluída!</h2>
      <p style="color: #94a3b8; font-size: 0.9rem;">Relatório Oficial de Operação</p>
      
      <div class="report-stats">
        <span>Linha: <strong>${nomeLinha}</strong></span>
        <span>Horário de Saída: <strong>${tripStartRealTimeStr || "00:00"}</strong></span>
        <span>Horário de Chegada: <strong>${chegadaStr}</strong></span>
        <span>Tempo da Viagem: <strong>${tempoStr}</strong></span>
        <span>Km Rodados: <strong>${kmStr}</strong></span>
        <span>Passageiros Transportados: <strong>${totalPassengersTransported}</strong></span>
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

function getBusSvg(bodyColor, stripeColor, isDD, label) {
  return 'data:image/svg+xml;utf8,+encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 280" width="130" height="280">
      <rect x="2" y="10" width="126" height="262" rx="16" fill="rgba(0,0,0,0.5)" filter="blur(5px)" />
      <rect x="6" y="6" width="118" height="268" rx="16" fill="#0f172a" stroke="#1e293b" stroke-width="3"/>
      <path d="M 8,22 C 8,10 22,8 65,8 C 108,8 122,10 122,22 L 122,258 C 122,268 108,274 65,274 C 22,274 8,268 8,258 Z" fill="${bodyColor}" />
      <path d="M 8,100 L 122,100 L 122,180 L 8,190 Z" fill="${stripeColor}" opacity="0.9" />
      <path d="M 8,185 L 122,175 L 122,260 C 122,268 108,272 65,272 C 22,272 8,268 8,260 Z" fill="#1e293b" />
      <path d="M 12,12 L 118,12 L 112,50 L 18,50 Z" fill="#0f172a" stroke="#cbd5e1" stroke-width="2" />
      <path d="M 16,16 L 114,16 L 109,46 L 21,46 Z" fill="#38bdf8" opacity="0.6" />
      <rect x="12" y="65" width="12" height="110" rx="3" fill="#0f172a" />
      <rect x="106" y="65" width="12" height="110" rx="3" fill="#0f172a" />
      <rect x="42" y="20" width="46" height="140" rx="6" fill="#334155" />
      <text x="65" y="95" fill="#fbbf24" font-size="9" font-family="monospace" font-weight="900" text-anchor="middle">EXECUTIVO</text>
      <rect x="12" y="6" width="18" height="6" rx="2" fill="#fbbf24" />
      <rect x="100" y="6" width="18" height="6" rx="2" fill="#fbbf24" />
      <rect x="35" y="4" width="60" height="4" rx="1" fill="#cbd5e1" />
      <rect x="14" y="268" width="16" height="4" fill="#ef4444" rx="1" />
      <rect x="100" y="268" width="16" height="4" fill="#ef4444" rx="1" />
    </svg>
  `);
}

function initMap(startCoords) {
  if (map) {
    map.remove();
    map = null;
  }

  map = new maplibregl.Map({
    container: 'map',
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
    zoom: 19.0,
    pitch: 0,
    bearing: smoothHeading
  });

  const preset = COLOR_PRESETS[activePresetKey] || COLOR_PRESETS['vermelho'];

  if (currentVisibleMarker) {
    currentVisibleMarker.remove();
    currentVisibleMarker = null;
  }

  const busImg = document.createElement('img');
  busImg.className = 'bus-marker-img';
  busImg.src = getBusSvg(preset.bodyColor, preset.stripeColor, currentGameMode === 'free', busLabelText);

  busMarker = new maplibregl.Marker({ element: busImg, anchor: 'center' })
    .setLngLat(startCoords)
    .addTo(map);

  map.on('load', () => {
    map.resize();
    busMarker.setLngLat(startCoords);
    lastFrameTime = performance.now();
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(gameLoop);
  });
}

function updateTripStatus() {
  if (currentGameMode === 'line') {
    document.getElementById('paxCountDisplay').textContent = passengerCount;
    const percent = Math.round((passengerCount / maxPassengers) * 100);
    const percentEl = document.getElementById('paxPercentDisplay');
    percentEl.textContent = `${percent}%`;

    if (percent > 85) percentEl.style.color = '#ef4444';
    else if (percent > 50) percentEl.style.color = '#f59e0b';
    else percentEl.style.color = '#10b981';
  }

  const badge = document.getElementById('tripStatusBadge');
  if (!isTripActive && !isLineFinished) {
    badge.className = 'trip-status-badge stopped';
    badge.textContent = 'Aguardando Início';
    btnTripToggle.className = 'btn-trip-toggle start';
    btnTripToggle.textContent = '▶️ Dar Entrada na Viagem';
  } else if (isAtBusStop) {
    badge.className = 'trip-status-badge stopped';
    badge.textContent = 'Parada Atendida (Acelere p/ Partir)';
    btnTripToggle.className = 'btn-trip-toggle stop';
    btnTripToggle.textContent = '🛑 Encerrar Viagem';
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
  
  isAtBusStop = false;
  mapBanner.style.display = 'none';

  isAutopilotMoving = true;
  updateTripStatus();
}

function processStop(stop) {
  stop.visited = true;

  if (currentVisibleMarker) {
    currentVisibleMarker.remove();
    currentVisibleMarker = null;
  }

  const desembarcados = Math.min(passengerCount, Math.floor(Math.random() * 6));
  passengerCount -= desembarcados;

  const vagasLivres = maxPassengers - passengerCount;
  const embarcados = Math.min(vagasLivres, Math.floor(Math.random() * 8) + 1);
  passengerCount += embarcados;
  
  if (embarcados > 0) {
    totalPassengersTransported += embarcados;
  }

  showAlert(`🚏 Parada: ${stop.nome} (-${desembarcados} / +${embarcados} pax). Acelere para prosseguir.`);
  pararEaguardarAceleracaoManual();
}

function pararEaguardarAceleracaoManual() {
  currentSpeedKmh = 0;
  isAutopilotMoving = false;
  isAtBusStop = true;
  updateTripStatus();
  updateStopInfoDisplay();
}

let lastFrameTime = performance.now();

function gameLoop(now) {
  if (!map) return;

  const deltaTime = Math.min((now - lastFrameTime) / 1000, 0.1);
  lastFrameTime = now;

  const prev = [busLng, busLat];

  if (currentGameMode === 'line') {
    let desiredSpeed = 0;

    if (keysPressed.Up) {
      if (!isTripActive && currentGameMode === 'line') {
        isTripActive = true;
        startTripTimer();
      }
      if (isAtBusStop) {
        isAtBusStop = false;
        mapBanner.style.display = 'none';
      }
      isAutopilotMoving = true;
      updateTripStatus();
    }

    if (isTripActive && isAutopilotMoving && !isAtBusStop && !isLineFinished) {
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

    if (currentSpeedKmh > 0 && !isAtBusStop && !isLineFinished && isTripActive) {
      const speedMps = (currentSpeedKmh / 3.6) * speedMultiplier;
      let remainingDistance = speedMps * deltaTime;

      while (remainingDistance > 0 && currentSegIndex < activePath.length - 1) {
        const p1 = activePath[currentSegIndex];
        const p2 = activePath[currentSegIndex + 1];

        if (currentSegLength <= 0) {
          currentSegLength = getMetersBetween(p1, p2);
        }

        const distanceLeftInSeg = currentSegLength - segProgressMeters;

        if (remainingDistance < distanceLeftInSeg) {
          segProgressMeters += remainingDistance;
          remainingDistance = 0;

          const ratio = currentSegLength > 0 ? (segProgressMeters / currentSegLength) : 0;
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

      smoothHeading = lerpHeading(smoothHeading, targetHeading, 8.0 * deltaTime);

      if (currentStopIndex < activeStops.length) {
        const nextStop = activeStops[currentStopIndex];
        if (!nextStop.visited) {
          const distToStop = getMetersBetween([busLng, busLat], nextStop.projectedCoords);
          
          if (distToStop < 10.0 || currentSegIndex >= nextStop.targetSegmentIndex) {
            currentStopIndex++; 
            processStop(nextStop);
          }
        }
      } else {
        if (!isLineFinished) {
          isLineFinished = true;
          mostrarRelatorioFinal();
        }
      }
    }
  } else {
    let desiredSpeed = 0;
    if (keysPressed.Down) {
      currentSpeedKmh = Math.max(currentSpeedKmh - 60 * deltaTime, 0);
      desiredSpeed = 0;
    } else if (keysPressed.Up) {
      desiredSpeed = boostSpeedKmh;
    } else if (currentSpeedKmh > 0) {
      desiredSpeed = cruiseSpeedKmh;
    }

    if (currentSpeedKmh < desiredSpeed) currentSpeedKmh = Math.min(currentSpeedKmh + 50 * deltaTime, desiredSpeed);
    else if (currentSpeedKmh > desiredSpeed && desiredSpeed > 0) currentSpeedKmh = Math.max(currentSpeedKmh - 40 * deltaTime, desiredSpeed);

    if (currentSpeedKmh < 0.1) {
      currentSpeedKmh = 0;
    }

    if (currentSpeedKmh > 1) {
      if (keysPressed.Left) smoothHeading = (smoothHeading - 60 * deltaTime + 360) % 360;
      if (keysPressed.Right) smoothHeading = (smoothHeading + 60 * deltaTime) % 360;
    }

    if (currentSpeedKmh > 0) {
      const speedMps = (currentSpeedKmh / 3.6) * speedMultiplier;
      const metersToMove = speedMps * deltaTime;
      const metersPerDegreeLat = 111320;
      const metersPerDegreeLng = 111320 * Math.cos(busLat * (Math.PI / 180));

      const rad = (smoothHeading * Math.PI) / 180;
      busLng += (metersToMove * Math.sin(rad)) / metersPerDegreeLng;
      busLat += (metersToMove * Math.cos(rad)) / metersPerDegreeLat;
    }
  }

  const distStep = getMetersBetween(prev, [busLng, busLat]) / 1000;
  if (!isNaN(distStep)) {
    distanceCoveredKm += distStep;
  }

  const distFormatted = `${distanceCoveredKm.toFixed(2)} km`;
  const speedRounded = Math.round(currentSpeedKmh);

  document.getElementById('kmCoveredDisplay').textContent = distFormatted;
  document.getElementById('miniKmDisplay').textContent = distFormatted;
  document.getElementById('speedValue').textContent = speedRounded;
  document.getElementById('miniSpeedDisplay').textContent = speedRounded;

  const currentCoords = [busLng, busLat];
  if (busMarker) {
    busMarker.setLngLat(currentCoords);
  }

  atualizarMarcadorProximoPonto(currentCoords);

  map.jumpTo({
    center: currentCoords,
    bearing: smoothHeading
  });

  if (!isLineFinished) {
    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

document.getElementById('btnZoomNear').addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  map.setZoom(19.2);
  document.getElementById('btnZoomNear').classList.add('active');
  document.getElementById('btnZoomFar').classList.remove('active');
});

document.getElementById('btnZoomFar').addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  map.setZoom(17.4);
  document.getElementById('btnZoomFar').classList.add('active');
  document.getElementById('btnZoomNear').classList.remove('active');
});

window.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'KeyW'].includes(e.code)) {
    if (!keysPressed.Up) handleAccelerate();
    keysPressed.Up = true;
  }
  if (['ArrowDown', 'KeyS'].includes(e.code)) keysPressed.Down = true;
  if (['ArrowLeft', 'KeyA'].includes(e.code)) keysPressed.Left = true;
  if (['ArrowRight', 'KeyD'].includes(e.code)) keysPressed.Right = true;
});

window.addEventListener('keyup', (e) => {
  if (['ArrowUp', 'KeyW'].includes(e.code)) keysPressed.Up = false;
  if (['ArrowDown', 'KeyS'].includes(e.code)) keysPressed.Down = false;
  if (['ArrowLeft', 'KeyA'].includes(e.code)) keysPressed.Left = false;
  if (['ArrowRight', 'KeyD'].includes(e.code)) keysPressed.Right = false;
});
