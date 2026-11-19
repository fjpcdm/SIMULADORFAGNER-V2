// ============================================================
// ARQUIVO: script.js
// MOTOR DE SIMULAÇÃO - VOLANTE INFERIOR, CORREÇÃO SEM DESLIZE E VELOCIDADES MANTIDAS
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
    top: 60px !important;
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

  .camera-controls {
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
  }

  .btn-camera {
    flex: 1;
    padding: 8px 4px;
    font-size: 0.75rem;
    font-weight: bold;
    color: #ffffff;
    background: #334155;
    border: 1px solid #38bdf8;
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
  }

  .btn-camera.active {
    background: #38bdf8 !important;
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
    top: 56px !important;
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

  /* Barra inferior centralizada com volante e acelerador/freio sempre visíveis */
  .bottom-cockpit-bar {
    position: fixed !important;
    bottom: calc(14px + env(safe-area-inset-bottom, 0px)) !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    z-index: 999999 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 8px 14px;
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(148, 163, 184, 0.35);
    border-radius: 28px;
    max-width: calc(100vw - 16px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.65);
  }

  .steering-wheel-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .steering-wheel-visual {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    border: 6px solid #e2e8f0;
    background: radial-gradient(circle at center, rgba(30, 41, 59, 0.95) 35%, rgba(15, 23, 42, 0.95) 100%);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 0 8px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6);
    transition: transform 0.08s linear;
    flex-shrink: 0;
  }

  .steering-wheel-visual::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 5px;
    background: #94a3b8;
    border-radius: 2px;
  }

  .steering-wheel-visual::after {
    content: "";
    position: absolute;
    width: 5px;
    height: 55%;
    bottom: 0;
    background: #94a3b8;
    border-radius: 2px;
  }

  .steering-wheel-hub {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #38bdf8;
    border: 2px solid #0f172a;
    z-index: 2;
  }

  .pedal-controls-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-drive-touch {
    width: 52px;
    height: 52px;
    background: rgba(30, 41, 59, 0.95);
    border: 2px solid #38bdf8;
    border-radius: 50%;
    color: #ffffff;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    flex-shrink: 0;
  }

  .btn-drive-touch:active {
    background: rgba(56, 189, 248, 0.5);
    transform: scale(0.95);
  }

  .btn-drive-touch.btn-accel {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.45);
  }

  .btn-drive-touch.btn-accel:active {
    background: rgba(16, 185, 129, 0.9);
  }

  .btn-drive-touch.btn-brake {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.45);
  }

  .btn-drive-touch.btn-brake:active {
    background: rgba(239, 68, 68, 0.9);
  }

  @media (max-width: 480px) {
    .bottom-cockpit-bar {
      gap: 8px;
      padding: 6px 10px;
    }
    .steering-wheel-group {
      gap: 5px;
    }
    .steering-wheel-visual {
      width: 54px;
      height: 54px;
      border-width: 5px;
    }
    .pedal-controls-group {
      gap: 6px;
    }
    .btn-drive-touch {
      width: 44px;
      height: 44px;
      font-size: 1rem;
    }
  }

  .alert-toast {
    position: fixed;
    top: 70px;
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
  }, 1800);
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
    opt.value = "";
    opt.textContent = "Nenhuma linha encontrada nesta categoria";
    select.appendChild(opt);
    return;
  }

  filteredKeys.forEach(key => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = db[key].nome;
    select.appendChild(opt);
  });
}

document.getElementById('selectCategoryType').addEventListener('change', refreshLinesDropdown);

refreshLinesDropdown();
setTimeout(refreshLinesDropdown, 250);

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

  <div style="margin-bottom: 6px; font-size: 0.75rem; color: #94a3b8; font-weight: bold;">ESCOLHA DA CÂMERA</div>
  <div class="camera-controls">
    <button id="btnCamStreet" class="btn-camera active">🛣️ Visão Rua</button>
    <button id="btnCamTop" class="btn-camera">🌐 Visão Cima</button>
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

let bottomCockpitBar = document.createElement('div');
bottomCockpitBar.className = 'bottom-cockpit-bar';
bottomCockpitBar.style.display = 'none';
bottomCockpitBar.innerHTML = `
  <div class="steering-wheel-group">
    <button class="btn-drive-touch" id="btnTouchLeft">⬅️</button>
    <div class="steering-wheel-visual" id="steeringWheelVisual">
      <div class="steering-wheel-hub"></div>
    </div>
    <button class="btn-drive-touch" id="btnTouchRight">➡️</button>
  </div>
  <div class="pedal-controls-group">
    <button class="btn-drive-touch btn-accel" id="btnTouchUp">⬆️</button>
    <button class="btn-drive-touch btn-brake" id="btnTouchDown">⬇️</button>
  </div>
`;
document.body.appendChild(bottomCockpitBar);

let map = null;
let busMarker = null;
let animationFrameId = null;

let currentGameMode = 'line'; 
let activePresetKey = 'vermelho';
let currentVehicleType = 'urbano'; 
let activeLetreiroText = "EXECUTIVO";

let activePath = [];
let busLng = 0;
let busLat = 0;

let currentSpeedKmh = 0;
let isAutopilotMoving = false;

// Velocidades mantidas exatamente conforme definido
let cruiseSpeedKmh = 90;
let boostSpeedKmh = 140;

let vehicleHeading = 0; 
let distanceCoveredKm = 0;

let currentSegIndex = 0;
let segProgressMeters = 0;
let currentSegLength = 0;
let targetHeading = 0;
let smoothHeading = 0;
let currentCameraBearing = 0;

// Correção lateral limitada para não deslizar para fora da rota no modo linha
let lineLateralCorrectionMeters = 0;
const MAX_LINE_LATERAL_METERS = 3.2;
let steeringWheelAngle = 0;

let isLineFinished = false;
let isTripActive = false;

let tripStartTime = null;
let tripTimerInterval = null;
let tripStartRealTimeStr = "";
let speedMultiplier = 1.0;

let currentCameraMode = 'street'; 
let currentZoomLevel = 19.8; 

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

function setCameraMode(mode) {
  currentCameraMode = mode;
  ['btnCamStreet', 'btnCamTop'].forEach(id => {
    document.getElementById(id).classList.remove('active');
  });
  if (mode === 'street') {
    document.getElementById('btnCamStreet').classList.add('active');
    currentZoomLevel = 19.8;
  } else if (mode === 'top') {
    document.getElementById('btnCamTop').classList.add('active');
    currentZoomLevel = 18.5; 
  }
}

document.getElementById('btnCamStreet').addEventListener('click', () => setCameraMode('street'));
document.getElementById('btnCamTop').addEventListener('click', () => setCameraMode('top'));

function updateBusMarkerIcon() {
  if (!busMarker) return;
  const preset = COLOR_PRESETS[activePresetKey] || COLOR_PRESETS['vermelho'];
  busMarker.getElement().src = getBusSvg(preset.bodyColor, preset.stripeColor, currentVehicleType, activeLetreiroText);
}

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

  const db = getLinesDatabase();
  const lineData = db[selectedKey] || Object.values(db)[0];
  if (!lineData) {
    showAlert("Nenhuma linha cadastrada disponível no dados_rotas.js.");
    return;
  }

  currentVehicleType = lineData.tipo === 'rodoviario' ? 'rodoviario' : 'urbano';
  activeLetreiroText = lineData.nome || "LINHA MUNICIPAL";

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
    showAlert("A linha selecionada não possui coordenadas de trajeto válidas.");
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
  steeringWheelAngle = 0;

  targetHeading = calculateBearing(activePath[0], activePath[1]);
  smoothHeading = targetHeading;
  vehicleHeading = targetHeading;
  currentCameraBearing = targetHeading;

  updateTripStatus();
  startSimulation(activePath[0]);
});

document.getElementById('btnStartFreeMode').addEventListener('click', async () => {
  currentGameMode = 'free';
  currentVehicleType = 'urbano';
  activeLetreiroText = "EXECUTIVO LIVRE";
  activePresetKey = document.getElementById('selectColorFree').value || 'vermelho';
  const locationQuery = document.getElementById('inputFreeLocation').value.trim();

  document.getElementById('lineBadgeDisplay').textContent = `Modo Livre`;

  currentSpeedKmh = 0;
  isAutopilotMoving = true;
  distanceCoveredKm = 0;
  cruiseSpeedKmh = 90;
  boostSpeedKmh = 140;
  speedMultiplier = 1.0;
  isTripActive = true;
  vehicleHeading = 0;
  lineLateralCorrectionMeters = 0;
  steeringWheelAngle = 0;
  currentCameraBearing = 0;
  updateTripStatus();
  startTripTimer();

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}`);
    const data = await res.json();
    if (data && data.length > 0) {
      const lon = parseFloat(data[0].lon);
      const lat = parseFloat(data[0].lat);
      startSimulation([lon, lat]);
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
  bottomCockpitBar.style.display = 'flex';
  speedBox.style.display = 'flex';

  if (currentGameMode === 'free') {
    btnTripToggle.style.display = 'none';
  } else {
    btnTripToggle.style.display = 'block';
  }

  busLng = startCoords[0];
  busLat = startCoords[1];

  initMap(startCoords);
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
  distanceCoveredKm = 0;
  speedMultiplier = 1.0;
  lineLateralCorrectionMeters = 0;
  steeringWheelAngle = 0;
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
    zoom: currentZoomLevel,
    pitch: 70,
    bearing: currentGameMode === 'line' ? smoothHeading : vehicleHeading,
    renderWorldCopies: false
  });

  const preset = COLOR_PRESETS[activePresetKey] || COLOR_PRESETS['vermelho'];

  const busImg = document.createElement('img');
  busImg.className = 'bus-marker-img';
  busImg.src = getBusSvg(preset.bodyColor, preset.stripeColor, currentVehicleType, activeLetreiroText);

  busMarker = new maplibregl.Marker({ element: busImg, anchor: 'center' })
    .setLngLat(startCoords)
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

function updateSteeringWheelVisual() {
  const wheelEl = document.getElementById('steeringWheelVisual');
  if (!wheelEl) return;
  let targetAngle = 0;
  if (keysPressed.Left) targetAngle = -35;
  else if (keysPressed.Right) targetAngle = 35;
  else if (currentGameMode === 'line') {
    targetAngle = Math.max(-35, Math.min(35, (lineLateralCorrectionMeters / MAX_LINE_LATERAL_METERS) * 35));
  }
  steeringWheelAngle += (targetAngle - steeringWheelAngle) * 0.25;
  wheelEl.style.transform = `rotate(${steeringWheelAngle.toFixed(1)}deg)`;
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

  let renderLng = busLng;
  let renderLat = busLat;

  if (currentGameMode === 'line') {
    if (currentSpeedKmh > 0 && !isLineFinished && isTripActive) {
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

      // Correção lateral limitada para aproximar do meio-fio sem deslizar fora da rota
      const lateralAdjustRate = 2.8;
      if (keysPressed.Left) {
        lineLateralCorrectionMeters = Math.max(-MAX_LINE_LATERAL_METERS, lineLateralCorrectionMeters - lateralAdjustRate * deltaTime);
      } else if (keysPressed.Right) {
        lineLateralCorrectionMeters = Math.min(MAX_LINE_LATERAL_METERS, lineLateralCorrectionMeters + lateralAdjustRate * deltaTime);
      } else {
        // Retorna suavemente ao eixo da rota quando não há comando lateral ativo
        lineLateralCorrectionMeters += (0 - lineLateralCorrectionMeters) * Math.min(1, 3.5 * deltaTime);
      }

      smoothHeading = lerpHeading(smoothHeading, targetHeading, 6.0 * deltaTime);

      const perpHeading = (smoothHeading + 90) % 360;
      const perpRad = (perpHeading * Math.PI) / 180;
      const metersPerDegreeLat = 111320;
      const metersPerDegreeLng = 111320 * Math.cos(busLat * (Math.PI / 180));

      renderLng = busLng + (lineLateralCorrectionMeters * Math.sin(perpRad)) / metersPerDegreeLng;
      renderLat = busLat + (lineLateralCorrectionMeters * Math.cos(perpRad)) / metersPerDegreeLat;
    }
  } else {
    if (currentSpeedKmh > 0 || keysPressed.Up || keysPressed.Down || keysPressed.Left || keysPressed.Right) {
      if (keysPressed.Left) vehicleHeading = (vehicleHeading - 45 * deltaTime + 360) % 360;
      if (keysPressed.Right) vehicleHeading = (vehicleHeading + 45 * deltaTime) % 360;

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
  }

  updateSteeringWheelVisual();

  const distStep = getMetersBetween(prev, [renderLng, renderLat]) / 1000;
  if (!isNaN(distStep)) {
    distanceCoveredKm += distStep;
  }

  const distFormatted = `${distanceCoveredKm.toFixed(2)} km`;
  const speedRounded = Math.round(currentSpeedKmh);

  document.getElementById('kmCoveredDisplay').textContent = distFormatted;
  document.getElementById('miniKmDisplay').textContent = distFormatted;
  document.getElementById('speedValue').textContent = speedRounded;
  document.getElementById('miniSpeedDisplay').textContent = speedRounded;

  const currentCoords = [renderLng, renderLat];
  if (busMarker) {
    busMarker.setLngLat(currentCoords);
  }

  let targetPitch = 70;
  if (currentCameraMode === 'street') {
    targetPitch = 74; 
  } else if (currentCameraMode === 'top') {
    targetPitch = 25; 
  }

  const rawTargetBearing = currentGameMode === 'line' ? smoothHeading : vehicleHeading;
  currentCameraBearing = lerpHeading(currentCameraBearing, rawTargetBearing, 5.0 * deltaTime);

  if (busMarker && busMarker.getElement()) {
    if (currentCameraMode === 'street' && currentZoomLevel <= 18.5) {
      busMarker.getElement().style.transform = 'scale(0.85)';
    } else {
      busMarker.getElement().style.transform = 'scale(1)';
    }
  }

  map.jumpTo({
    center: currentCoords,
    bearing: currentCameraBearing,
    pitch: targetPitch,
    zoom: currentZoomLevel
  });

  if (!isLineFinished) {
    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

document.getElementById('btnZoomNear').addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  if (currentCameraMode === 'street') currentZoomLevel = 20.2;
  else currentZoomLevel = 19.2;
  document.getElementById('btnZoomNear').classList.add('active');
  document.getElementById('btnZoomFar').classList.remove('active');
});

document.getElementById('btnZoomFar').addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  if (currentCameraMode === 'street') currentZoomLevel = 18.2; 
  else currentZoomLevel = 17.5;
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
