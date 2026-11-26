// ============================================================
// ARQUIVO: script.js
// MOTOR DE SIMULAÇÃO - MODO TRAJETO + MODO LIVRE + CÂMBIO + CABINE
// ============================================================

const STORAGE_KEY_STATE = 'simulador_bus_estado_v4';

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

  /* ============================================================
     VISTA DE CABINE / PRIMEIRA PESSOA (SEM VOLANTE E SEM RETROVISORES)
     ============================================================ */
  .cockpit-pov-overlay {
    position: fixed;
    inset: 0;
    z-index: 999990;
    pointer-events: none;
    display: none;
    overflow: hidden;
  }

  .cockpit-pov-overlay.active {
    display: block;
  }

  .pov-motion-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 42%, rgba(255,255,255,0.02) 38%, rgba(2, 6, 23, 0.52) 100%);
  }

  .pov-visor-top {
    position: absolute;
    top: 0;
    left: 12%;
    right: 12%;
    height: 10%;
    background: linear-gradient(180deg, #090d16 0%, #1e293b 88%, #0f172a 100%);
    border-bottom: 3px solid #334155;
    border-radius: 0 0 12px 12px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.65);
  }

  .pov-pillar-left {
    position: absolute;
    top: 0;
    left: 0;
    width: 8.5%;
    height: 78%;
    background: linear-gradient(90deg, #090d16 0%, #1e293b 82%, #0f172a 100%);
    clip-path: polygon(0 0, 100% 0, 58% 100%, 0 100%);
    box-shadow: 8px 0 22px rgba(0, 0, 0, 0.7);
  }

  .pov-pillar-right {
    position: absolute;
    top: 0;
    right: 0;
    width: 8.5%;
    height: 78%;
    background: linear-gradient(270deg, #090d16 0%, #1e293b 82%, #0f172a 100%);
    clip-path: polygon(0 0, 100% 0, 100% 100%, 42% 100%);
    box-shadow: -8px 0 22px rgba(0, 0, 0, 0.7);
  }

  .pov-dashboard {
    position: absolute;
    left: -2%;
    right: -2%;
    bottom: 0;
    height: 22%;
    background: linear-gradient(180deg, #291d18 0%, #181210 58%, #090d16 100%);
    border-top: 3px solid #3f3029;
    box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.85);
  }

  .pov-validator-console {
    position: absolute;
    left: 34%;
    bottom: 18%;
    width: 112px;
    height: 66px;
    background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
    border: 2px solid #475569;
    border-radius: 8px 8px 3px 3px;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.75);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 4px;
  }

  .pov-validator-screen {
    width: 90%;
    height: 26px;
    background: #020617;
    border: 1px solid #38bdf8;
    border-radius: 4px;
    color: #4ade80;
    font-family: monospace;
    font-size: 0.62rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 4px;
  }

  .pov-validator-keys {
    width: 84%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }

  .pov-validator-keys span {
    height: 6px;
    background: #334155;
    border-radius: 1px;
  }

  .pov-handrail-yellow {
    position: absolute;
    right: 17%;
    bottom: 8%;
    width: 120px;
    height: 14px;
    border: 4px solid #eab308;
    border-bottom: none;
    border-radius: 14px 14px 0 0;
    opacity: 0.92;
  }

  @media (max-width: 640px) {
    .pov-validator-console {
      display: none;
    }
    .pov-handrail-yellow {
      display: none;
    }
  }

  /* ============================================================
     SELETOR DE CÂMBIO (AUTOMÁTICO / MANUAL + MARCHAS)
     ============================================================ */
  .gearbox-widget {
    position: fixed !important;
    left: 12px !important;
    bottom: calc(18px + env(safe-area-inset-bottom, 0px)) !important;
    z-index: 999999 !important;
    background: rgba(15, 23, 42, 0.93);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1.5px solid rgba(56, 189, 248, 0.55);
    border-radius: 14px;
    padding: 8px 10px;
    color: #ffffff;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.65);
    display: none;
    flex-direction: column;
    gap: 6px;
    width: 154px;
  }

  .gearbox-top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
  }

  .btn-gear-mode {
    flex: 1;
    padding: 5px 6px;
    border-radius: 8px;
    border: 1px solid #38bdf8;
    background: #1e293b;
    color: #38bdf8;
    font-size: 0.7rem;
    font-weight: 800;
    cursor: pointer;
    text-align: center;
  }

  .btn-gear-mode.manual-active {
    background: #f59e0b;
    border-color: #fbbf24;
    color: #0f172a;
  }

  .gear-readout-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(2, 6, 23, 0.85);
    border: 1px solid rgba(148, 163, 184, 0.25);
    border-radius: 8px;
    padding: 5px 8px;
  }

  .gear-current-badge {
    font-family: monospace;
    font-size: 1.05rem;
    font-weight: 900;
    color: #10b981;
  }

  .gear-rpm-text {
    font-family: monospace;
    font-size: 0.68rem;
    color: #cbd5e1;
  }

  .gear-manual-btns {
    display: flex;
    gap: 6px;
  }

  .btn-gear-step {
    flex: 1;
    padding: 6px 0;
    border-radius: 8px;
    border: 1px solid #475569;
    background: #334155;
    color: #ffffff;
    font-size: 0.76rem;
    font-weight: 800;
    cursor: pointer;
  }

  .btn-gear-step:active {
    background: #38bdf8;
    color: #0f172a;
  }

  @media (max-width: 640px) {
    .gearbox-widget {
      left: 8px !important;
      bottom: calc(136px + env(safe-area-inset-bottom, 0px)) !important;
      width: 132px;
      padding: 6px 8px;
    }
  }

  /* ============================================================
     ESTILOS GERAIS / HUD / CONTROLES
     ============================================================ */
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
    gap: 10px;
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

  .btn-camera-view {
    background: #0f766e;
    border: 1px solid #2dd4bf;
    color: #ffffff;
    padding: 4px 9px;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: bold;
    cursor: pointer;
  }

  .btn-camera-view.cabine-on {
    background: #f59e0b;
    border-color: #fbbf24;
    color: #0f172a;
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

  .side-minimap-box {
    position: fixed !important;
    right: 12px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    z-index: 999999 !important;
    width: 156px;
    background: rgba(15, 23, 42, 0.94);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1.5px solid rgba(56, 189, 248, 0.65);
    border-radius: 14px;
    padding: 8px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.65);
    pointer-events: none;
    display: none;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .side-minimap-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.68rem;
    font-weight: 700;
    color: #38bdf8;
    letter-spacing: 0.02em;
  }

  .side-minimap-canvas {
    width: 138px;
    height: 138px;
    border-radius: 10px;
    background: rgba(2, 6, 23, 0.94);
    border: 1px solid rgba(148, 163, 184, 0.25);
    display: block;
  }

  .side-minimap-footer {
    width: 100%;
    font-size: 0.67rem;
    color: #e2e8f0;
    text-align: center;
    font-family: monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 640px) {
    .side-minimap-box {
      right: 8px !important;
      width: 118px;
      padding: 6px;
    }
    .side-minimap-canvas {
      width: 104px;
      height: 104px;
    }
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

  .rear-indicator-bar {
    position: fixed !important;
    bottom: calc(156px + env(safe-area-inset-bottom, 0px)) !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    z-index: 999999 !important;
    display: none;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    pointer-events: none;
    max-width: 92vw;
  }

  .rear-indicator-pill {
    background: rgba(15, 23, 42, 0.92);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border: 1.5px solid #f59e0b;
    color: #ffffff;
    padding: 5px 12px;
    border-radius: 16px;
    font-size: 0.76rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.55);
    white-space: nowrap;
  }

  .rear-indicator-pill.close {
    border-color: #ef4444;
    background: rgba(69, 10, 10, 0.92);
  }

  .rear-arrow-badge {
    color: #fbbf24;
    font-size: 0.88rem;
    line-height: 1;
  }

  .rear-dist-badge {
    color: #38bdf8;
    font-family: monospace;
    font-size: 0.78rem;
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
    width: 18px !important;
    height: 54px !important;
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
  'trem_laranja': { name: 'Trem Laranja', bodyColor: '#2A1974', stripeColor: '#EA7302' },
  'bhtrans_azul': { name: 'Azul BHTrans', bodyColor: '#1d5fa7', stripeColor: '#e2e8f0' },
  'metro_laranja_azul': { name: 'Metropolitano (Laranja/Azul)', bodyColor: '#f97316', stripeColor: '#1e3a8a' },
  'vermelho_vivo': { name: 'Vermelho Rodoviário', bodyColor: '#dc2626', stripeColor: '#0f172a' }
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
  } catch (e) {}
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
      <label>Modelo do Ônibus:</label>
      <select id="selectModelLine">
        <option value="metropolitano">Metropolitano (Foto 1)</option>
        <option value="bhtrans">BHTrans (Foto 2)</option>
        <option value="rodoviario">Rodoviário (Foto 3)</option>
      </select>
    </div>
    <div class="form-group">
      <label>Cor do Veículo:</label>
      <select id="selectColorLine">${colorOptionsHtml}</select>
    </div>
    <div class="form-group">
      <label>Tipo de Câmbio:</label>
      <select id="selectGearboxLine">
        <option value="auto">Automático</option>
        <option value="manual">Manual</option>
      </select>
    </div>
    <button class="btn-start-sim" id="btnStartLineMode">Iniciar Viagem</button>
    <button class="btn-back-menu" id="btnBackLine">Voltar</button>
  </div>

  <div class="setup-card" id="cardFreeMode" style="display: none;">
    <h2>🗺️ Modo Livre</h2>
    <div class="form-group">
      <label>Modelo do Ônibus:</label>
      <select id="selectModelFree">
        <option value="metropolitano">Metropolitano (Foto 1)</option>
        <option value="bhtrans">BHTrans (Foto 2)</option>
        <option value="rodoviario">Rodoviário (Foto 3)</option>
      </select>
    </div>
    <div class="form-group">
      <label>Cor do Veículo:</label>
      <select id="selectColorFree">${colorOptionsHtml}</select>
    </div>
    <div class="form-group">
      <label>Tipo de Câmbio:</label>
      <select id="selectGearboxFree">
        <option value="auto">Automático</option>
        <option value="manual">Manual</option>
      </select>
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

const cockpitOverlay = document.createElement('div');
cockpitOverlay.className = 'cockpit-pov-overlay';
cockpitOverlay.id = 'cockpitPovOverlay';
cockpitOverlay.innerHTML = `
  <div class="pov-motion-vignette"></div>
  <div class="pov-visor-top"></div>
  <div class="pov-pillar-left"></div>
  <div class="pov-pillar-right"></div>
  <div class="pov-dashboard">
    <div class="pov-validator-console">
      <div class="pov-validator-screen" id="povValidatorText">LINHA</div>
      <div class="pov-validator-keys">
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
    </div>
    <div class="pov-handrail-yellow"></div>
  </div>
`;
document.body.appendChild(cockpitOverlay);

const gearboxWidget = document.createElement('div');
gearboxWidget.className = 'gearbox-widget';
gearboxWidget.id = 'gearboxWidget';
gearboxWidget.innerHTML = `
  <div class="gearbox-top-row">
    <button class="btn-gear-mode" id="btnToggleGearMode">AUTO</button>
  </div>
  <div class="gear-readout-row">
    <span class="gear-current-badge" id="gearBadgeDisplay">D1</span>
    <span class="gear-rpm-text" id="rpmDisplayText">900 RPM</span>
  </div>
  <div class="gear-manual-btns" id="gearManualBtns">
    <button class="btn-gear-step" id="btnGearDown" title="Reduzir marcha (Q)">-M</button>
    <button class="btn-gear-step" id="btnGearUp" title="Subir marcha (E)">+M</button>
  </div>
`;
document.body.appendChild(gearboxWidget);

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

const VALID_BUS_MODELS = ['metropolitano', 'bhtrans', 'rodoviario'];

function inferModelFromLine(lineData) {
  if (!lineData) return 'bhtrans';
  const tipo = (lineData.tipo || '').toLowerCase();
  const nome = (lineData.nome || '').toLowerCase();
  if (tipo === 'rodoviario' || nome.includes('rodovi')) return 'rodoviario';
  if (tipo === 'metropolitano' || nome.includes('metropolitano') || nome.includes('terminal')) return 'metropolitano';
  return 'bhtrans';
}

function syncLineModelWithSelectedLine() {
  const modelLineSelect = document.getElementById('selectModelLine');
  const lineSelect = document.getElementById('selectLine');
  if (!modelLineSelect || !lineSelect) return;
  const db = getLinesDatabase();
  const selectedKey = lineSelect.value;
  if (selectedKey && db[selectedKey]) {
    modelLineSelect.value = inferModelFromLine(db[selectedKey]);
  }
}

function applySavedPreferencesToUI() {
  const prefs = loadUserPreferences();
  const catSelect = document.getElementById('selectCategoryType');
  const modelLineSelect = document.getElementById('selectModelLine');
  const modelFreeSelect = document.getElementById('selectModelFree');
  const colorLineSelect = document.getElementById('selectColorLine');
  const colorFreeSelect = document.getElementById('selectColorFree');
  const gearLineSelect = document.getElementById('selectGearboxLine');
  const gearFreeSelect = document.getElementById('selectGearboxFree');
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
  if (prefs.modelFree && modelFreeSelect && VALID_BUS_MODELS.includes(prefs.modelFree)) {
    modelFreeSelect.value = prefs.modelFree;
  }
  if (prefs.gearboxMode && gearLineSelect && (prefs.gearboxMode === 'auto' || prefs.gearboxMode === 'manual')) {
    gearLineSelect.value = prefs.gearboxMode;
  }
  if (prefs.gearboxMode && gearFreeSelect && (prefs.gearboxMode === 'auto' || prefs.gearboxMode === 'manual')) {
    gearFreeSelect.value = prefs.gearboxMode;
  }
  if (prefs.freeLocation && freeLocInput) {
    freeLocInput.value = prefs.freeLocation;
  }

  refreshLinesDropdown();

  if (prefs.modelLine && modelLineSelect && VALID_BUS_MODELS.includes(prefs.modelLine)) {
    modelLineSelect.value = prefs.modelLine;
  } else {
    syncLineModelWithSelectedLine();
  }
}

document.getElementById('selectCategoryType').addEventListener('change', (e) => {
  saveUserPreferences({ categoryType: e.target.value });
  refreshLinesDropdown();
});

document.getElementById('selectLine').addEventListener('change', (e) => {
  saveUserPreferences({ lastLineKey: e.target.value });
  syncLineModelWithSelectedLine();
});

document.getElementById('selectModelLine').addEventListener('change', (e) => {
  saveUserPreferences({ modelLine: e.target.value });
  if (currentGameMode === 'line') {
    currentVehicleType = e.target.value;
    updateBusMarkerIcon(currentVehicleType, document.getElementById('selectColorLine')?.value);
  }
});

document.getElementById('selectModelFree').addEventListener('change', (e) => {
  saveUserPreferences({ modelFree: e.target.value });
  if (currentGameMode === 'free') {
    currentVehicleType = e.target.value;
    updateBusMarkerIcon(currentVehicleType, document.getElementById('selectColorFree')?.value);
  }
});

document.getElementById('selectColorLine').addEventListener('change', (e) => {
  saveUserPreferences({ colorLine: e.target.value });
  if (currentGameMode === 'line') {
    activePresetKey = e.target.value;
    updateBusMarkerIcon(currentVehicleType, activePresetKey);
  }
});

document.getElementById('selectColorFree').addEventListener('change', (e) => {
  saveUserPreferences({ colorFree: e.target.value });
  if (currentGameMode === 'free') {
    activePresetKey = e.target.value;
    updateBusMarkerIcon(currentVehicleType, activePresetKey);
  }
});

document.getElementById('selectGearboxLine').addEventListener('change', (e) => {
  saveUserPreferences({ gearboxMode: e.target.value });
});

document.getElementById('selectGearboxFree').addEventListener('change', (e) => {
  saveUserPreferences({ gearboxMode: e.target.value });
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
  <button class="btn-camera-view" id="btnToggleCameraView">👁️ Cabine</button>
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

const sideMinimapBox = document.createElement('div');
sideMinimapBox.className = 'side-minimap-box';
sideMinimapBox.id = 'sideMinimapBox';
sideMinimapBox.innerHTML = `
  <div class="side-minimap-header">
    <span>RADAR ROTA</span>
    <span id="minimapNextBadge" style="color:#fbbf24;">Aguardar</span>
  </div>
  <canvas class="side-minimap-canvas" id="sideMinimapCanvas" width="138" height="138"></canvas>
  <div class="side-minimap-footer" id="minimapNextInfo">Sem veículo próximo</div>
`;
document.body.appendChild(sideMinimapBox);

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

let isCabinViewActive = false;

// ============================================================
// SISTEMA DE CÂMBIO AUTOMÁTICO E MANUAL
// ============================================================
const GEAR_MAX_SPEEDS = {
  1: 24,
  2: 44,
  3: 68,
  4: 96,
  5: 130,
  6: 180
};

let gearboxMode = 'auto';
let currentGear = 1;
let isReverseGearEngaged = false;
let currentRpm = 850;

function updateGearboxUI() {
  const modeBtn = document.getElementById('btnToggleGearMode');
  const badgeEl = document.getElementById('gearBadgeDisplay');
  const rpmEl = document.getElementById('rpmDisplayText');
  const manualBtns = document.getElementById('gearManualBtns');
  if (!modeBtn || !badgeEl || !rpmEl || !manualBtns) return;

  if (gearboxMode === 'manual') {
    modeBtn.textContent = 'MANUAL';
    modeBtn.classList.add('manual-active');
    manualBtns.style.display = 'flex';
    badgeEl.textContent = isReverseGearEngaged ? 'R' : `M${currentGear}`;
  } else {
    modeBtn.textContent = 'AUTO';
    modeBtn.classList.remove('manual-active');
    manualBtns.style.display = 'none';
    badgeEl.textContent = isReverseGearEngaged ? 'R' : `D${currentGear}`;
  }

  rpmEl.textContent = `${Math.round(currentRpm)} RPM`;
}

function setGearboxMode(newMode) {
  gearboxMode = newMode === 'manual' ? 'manual' : 'auto';
  saveUserPreferences({ gearboxMode });
  if (gearboxMode === 'auto') {
    isReverseGearEngaged = false;
    currentGear = Math.max(1, currentGear);
  }
  updateGearboxUI();
  showAlert(gearboxMode === 'manual' ? '⚙️ Câmbio Manual ativo (E sobe / Q reduz)' : '⚙️ Câmbio Automático ativo');
}

function shiftManualGear(delta) {
  if (gearboxMode !== 'manual') {
    setGearboxMode('manual');
  }
  if (delta > 0) {
    if (isReverseGearEngaged) {
      isReverseGearEngaged = false;
      currentGear = 1;
    } else {
      currentGear = Math.min(6, currentGear + 1);
    }
  } else if (delta < 0) {
    if (currentGear <= 1 && Math.abs(currentSpeedKmh) < 1) {
      isReverseGearEngaged = true;
      currentGear = 1;
    } else {
      isReverseGearEngaged = false;
      currentGear = Math.max(1, currentGear - 1);
    }
  }
  updateGearboxUI();
}

function updateGearboxPhysics(deltaTime) {
  const absSpeed = Math.abs(currentSpeedKmh);

  if (gearboxMode === 'auto') {
    if (currentGameMode === 'free' && currentSpeedKmh < -0.5) {
      isReverseGearEngaged = true;
      currentGear = 1;
    } else {
      isReverseGearEngaged = false;
      if (absSpeed < 18) currentGear = 1;
      else if (absSpeed < 38) currentGear = 2;
      else if (absSpeed < 62) currentGear = 3;
      else if (absSpeed < 90) currentGear = 4;
      else if (absSpeed < 122) currentGear = 5;
      else currentGear = 6;
    }
  }

  const maxGearSpeed = isReverseGearEngaged ? 25 : (GEAR_MAX_SPEEDS[currentGear] || 180);
  const gearRatioProgress = Math.min(1, absSpeed / Math.max(1, maxGearSpeed));
  const targetRpm = absSpeed < 0.4
    ? 850
    : 1050 + gearRatioProgress * 2250;

  currentRpm += (targetRpm - currentRpm) * Math.min(1, 8.0 * deltaTime);
  updateGearboxUI();
  return maxGearSpeed;
}

function setCabinView(enabled) {
  isCabinViewActive = Boolean(enabled);
  const btnCam = document.getElementById('btnToggleCameraView');
  const validatorEl = document.getElementById('povValidatorText');
  if (cockpitOverlay) {
    cockpitOverlay.classList.toggle('active', isCabinViewActive);
  }
  if (btnCam) {
    btnCam.classList.toggle('cabine-on', isCabinViewActive);
    btnCam.textContent = isCabinViewActive ? '🗺️ Mapa' : '👁️ Cabine';
  }
  if (validatorEl) {
    validatorEl.textContent = activeLetreiroText || 'LINHA';
  }
  if (map) {
    map.setPitch(isCabinViewActive ? 45 : 25);
  }
}

document.getElementById('btnToggleCameraView').addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  setCabinView(!isCabinViewActive);
});

document.getElementById('btnToggleGearMode').addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  setGearboxMode(gearboxMode === 'auto' ? 'manual' : 'auto');
});

document.getElementById('btnGearUp').addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  shiftManualGear(1);
});

document.getElementById('btnGearDown').addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  shiftManualGear(-1);
});

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

const ZOOM_FAR_LEVEL = 18.3;
const ZOOM_NEAR_LEVEL = 19.2;
let currentZoomLevel = ZOOM_FAR_LEVEL;

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

function updateBusMarkerIcon(modelOverride = null, colorKeyOverride = null) {
  if (!busMarker) return;
  const chosenModel = modelOverride || currentVehicleType;
  const chosenColorKey = colorKeyOverride || activePresetKey;
  const preset = COLOR_PRESETS[chosenColorKey] || COLOR_PRESETS['vermelho'];
  busMarker.getElement().src = getBusSvg(preset.bodyColor, preset.stripeColor, chosenModel, activeLetreiroText);
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
  const selectedGear = document.getElementById('selectGearboxLine')?.value || 'auto';
  saveUserPreferences({ lastLineKey: selectedKey, colorLine: activePresetKey, gearboxMode: selectedGear });

  gearboxMode = selectedGear;
  currentGear = 1;
  isReverseGearEngaged = false;
  currentRpm = 850;
  updateGearboxUI();

  const db = getLinesDatabase();
  const lineData = db[selectedKey] || Object.values(db)[0];
  if (!lineData) {
    showAlert('Nenhuma linha cadastrada disponível no dados_rotas.js.');
    return;
  }

  const chosenModel = document.getElementById('selectModelLine')?.value || inferModelFromLine(lineData);
  saveUserPreferences({ modelLine: chosenModel });
  currentVehicleType = chosenModel;
  activeLetreiroText = (lineData.nome || 'LINHA MUNICIPAL').slice(0, 22);

  if (lineData.tipo === 'rodoviario' || chosenModel === 'rodoviario') {
    cruiseSpeedKmh = 140;
    boostSpeedKmh = 180;
  } else {
    cruiseSpeedKmh = 80;
    boostSpeedKmh = 100;
  }

  const isRoadCategory = (lineData.tipo || '').toLowerCase() === 'rodoviario' || chosenModel === 'rodoviario';
  activePath = extractCoordinates(lineData.trajeto);
  clearSameDirTraffic();
  configureTrafficThresholdsForRoute(activePath, isRoadCategory, activeLetreiroText);
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
  const chosenFreeModel = document.getElementById('selectModelFree')?.value || 'bhtrans';
  currentVehicleType = chosenFreeModel;
  activeLetreiroText = chosenFreeModel === 'rodoviario'
    ? 'RODOVIÁRIO'
    : (chosenFreeModel === 'metropolitano' ? 'METROPOLITANO' : 'BHTRANS LIVRE');
  activePresetKey = document.getElementById('selectColorFree').value || 'vermelho';
  const selectedGear = document.getElementById('selectGearboxFree')?.value || 'auto';
  const locationQuery = document.getElementById('inputFreeLocation').value.trim();
  saveUserPreferences({ modelFree: chosenFreeModel, colorFree: activePresetKey, gearboxMode: selectedGear, freeLocation: locationQuery });

  gearboxMode = selectedGear;
  currentGear = 1;
  isReverseGearEngaged = false;
  currentRpm = 850;
  updateGearboxUI();

  clearSameDirTraffic();
  activePath = [];
  document.getElementById('lineBadgeDisplay').textContent = 'Modo Livre';

  currentSpeedKmh = 0;
  isAutopilotMoving = false;
  isLineFinished = false;
  distanceCoveredKm = 0;
  cruiseSpeedKmh = 85;
  boostSpeedKmh = 120;
  speedMultiplier = 1.0;
  isTripActive = true;
  vehicleHeading = 0;
  smoothHeading = 0;
  targetHeading = 0;
  freeSteerRate = 0;
  lineLateralCorrectionMeters = 0;
  lineLateralVelocity = 0;
  busVisualYawOffset = 0;
  currentCameraBearing = 0;
  updateTripStatus();
  startTripTimer();

  let targetCoords = [-43.941879, -19.913783];
  if (locationQuery) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(locationQuery)}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const lon = parseFloat(data[0].lon);
        const lat = parseFloat(data[0].lat);
        if (Number.isFinite(lon) && Number.isFinite(lat)) {
          targetCoords = [lon, lat];
        }
      }
    } catch (err) {}
  }

  startSimulation(targetCoords, targetCoords);
  showAlert('🗺️ Modo Livre ativo: direção suave para curvas leves');
});

function startSimulation(baseCoords, initialRenderCoords) {
  setupModal.style.display = 'none';

  mobileTopBar.style.display = 'flex';
  bottomCockpitBar.style.display = 'flex';
  speedBox.style.display = 'flex';
  gearboxWidget.style.display = 'flex';
  setCabinView(false);

  if (currentGameMode === 'free') {
    btnTripToggle.style.display = 'none';
    sideMinimapBox.style.display = 'none';
  } else {
    btnTripToggle.style.display = 'block';
    sideMinimapBox.style.display = 'flex';
    drawSideMinimap(null, null);
  }

  busLng = baseCoords[0];
  busLat = baseCoords[1];

  const startRender = initialRenderCoords || baseCoords;
  initMap(startRender);
  setTimeout(() => {
    if (map) map.resize();
  }, 250);
}

const rearIndicatorEl = document.createElement('div');
rearIndicatorEl.className = 'rear-indicator-bar';
rearIndicatorEl.id = 'rearIndicatorBar';
document.body.appendChild(rearIndicatorEl);

function hideRearIndicator() {
  rearIndicatorEl.style.display = 'none';
  rearIndicatorEl.innerHTML = '';
}

function exitGame() {
  stopTripTimer();
  clearSameDirTraffic();
  setCabinView(false);
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
  currentGear = 1;
  isReverseGearEngaged = false;
  currentRpm = 850;
  updateGearboxUI();

  document.getElementById('tripTimerDisplay').textContent = '00:00';
  document.getElementById('miniTimerDisplay').textContent = '00:00';
  document.getElementById('kmCoveredDisplay').textContent = '0.00 km';
  document.getElementById('miniKmDisplay').textContent = '0.00 km';
  document.getElementById('miniSpeedDisplay').textContent = '0';

  hudContainer.style.display = 'none';
  hudContainer.classList.remove('mobile-visible');
  speedBox.style.display = 'none';
  sideMinimapBox.style.display = 'none';
  gearboxWidget.style.display = 'none';
  mobileTopBar.style.display = 'none';
  bottomCockpitBar.style.display = 'none';
  mapBanner.style.display = 'none';
  hideRearIndicator();

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

function getBusSvg(bodyColor, stripeColor, tipo = 'bhtrans', letreiroText = 'EXECUTIVO') {
  const safeText = String(letreiroText || 'LINHA').replace(/[<>&"]/g, '').slice(0, 18);
  const modelKey = (tipo === 'rodoviario' || tipo === 'metropolitano' || tipo === 'bhtrans')
    ? tipo
    : 'bhtrans';

  let svgContent = '';

  if (modelKey === 'metropolitano') {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" width="100" height="200">
        <rect x="6" y="6" width="88" height="188" rx="11" fill="rgba(0,0,0,0.45)" />
        <path d="M 11,15 C 11,6 19,4 50,4 C 81,4 89,6 89,15 L 89,187 C 89,194 81,196 50,196 C 19,196 11,194 11,187 Z" fill="${bodyColor}" stroke="#0f172a" stroke-width="2" />
        <rect x="12" y="42" width="76" height="114" rx="4" fill="#1e293b" opacity="0.86" />
        <path d="M 12,112 L 88,112 L 88,148 L 12,148 Z" fill="${stripeColor}" opacity="0.95" />
        <rect x="9" y="52" width="4" height="22" rx="1" fill="#f97316" />
        <rect x="87" y="52" width="4" height="22" rx="1" fill="#f97316" />
        <rect x="9" y="102" width="4" height="22" rx="1" fill="#f97316" />
        <rect x="87" y="102" width="4" height="22" rx="1" fill="#f97316" />
        <rect x="27" y="54" width="46" height="28" rx="4" fill="#e2e8f0" stroke="#334155" stroke-width="1.5" />
        <line x1="35" y1="54" x2="35" y2="82" stroke="#64748b" stroke-width="1.1" />
        <line x1="43" y1="54" x2="43" y2="82" stroke="#64748b" stroke-width="1.1" />
        <line x1="51" y1="54" x2="51" y2="82" stroke="#64748b" stroke-width="1.1" />
        <line x1="59" y1="54" x2="59" y2="82" stroke="#64748b" stroke-width="1.1" />
        <line x1="67" y1="54" x2="67" y2="82" stroke="#64748b" stroke-width="1.1" />
        <rect x="33" y="96" width="34" height="14" rx="3" fill="#0f172a" stroke="#fb923c" stroke-width="1.2" />
        <path d="M 15,9 L 85,9 L 81,36 L 19,36 Z" fill="#0f172a" stroke="#e2e8f0" stroke-width="1.4" />
        <rect x="23" y="13" width="54" height="13" rx="2" fill="#020617" stroke="#fb923c" stroke-width="0.9" />
        <text x="50" y="22" fill="#fb923c" font-size="7.2" font-weight="bold" font-family="monospace" text-anchor="middle">${safeText}</text>
        <rect x="14" y="3" width="13" height="4" rx="1.5" fill="#fde047" />
        <rect x="73" y="3" width="13" height="4" rx="1.5" fill="#fde047" />
        <rect x="16" y="193" width="12" height="3.5" rx="1" fill="#ef4444" />
        <rect x="72" y="193" width="12" height="3.5" rx="1" fill="#ef4444" />
      </svg>
    `;
  } else if (modelKey === 'rodoviario') {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" width="100" height="200">
        <rect x="7" y="5" width="86" height="190" rx="16" fill="rgba(0,0,0,0.48)" />
        <path d="M 14,22 C 14,8 24,3 50,3 C 76,3 86,8 86,22 L 88,184 C 88,193 78,197 50,197 C 22,197 12,193 12,184 Z" fill="${bodyColor}" stroke="#0f172a" stroke-width="2" />
        <path d="M 14,44 C 24,38 76,38 86,44 L 87,158 L 13,158 Z" fill="#0f172a" opacity="0.92" />
        <path d="M 13,144 L 87,144 L 87,165 L 13,165 Z" fill="${stripeColor}" opacity="0.92" />
        <line x1="28" y1="50" x2="28" y2="138" stroke="#475569" stroke-width="1.4" stroke-dasharray="6 4" />
        <line x1="72" y1="50" x2="72" y2="138" stroke="#475569" stroke-width="1.4" stroke-dasharray="6 4" />
        <rect x="32" y="70" width="36" height="30" rx="5" fill="#1e293b" stroke="#64748b" stroke-width="1.2" />
        <path d="M 18,10 C 30,6 70,6 82,10 L 79,36 C 64,33 36,33 21,36 Z" fill="#090d16" stroke="#cbd5e1" stroke-width="1.3" />
        <rect x="26" y="13" width="48" height="12" rx="2" fill="#020617" stroke="#38bdf8" stroke-width="0.9" />
        <text x="50" y="21.5" fill="#4ade80" font-size="6.8" font-weight="bold" font-family="monospace" text-anchor="middle">${safeText}</text>
        <rect x="17" y="4" width="12" height="4" rx="1.5" fill="#fef08a" />
        <rect x="71" y="4" width="12" height="4" rx="1.5" fill="#fef08a" />
        <rect x="18" y="193" width="14" height="3.5" rx="1" fill="#dc2626" />
        <rect x="68" y="193" width="14" height="3.5" rx="1" fill="#dc2626" />
      </svg>
    `;
  } else {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" width="100" height="200">
        <rect x="6" y="6" width="88" height="188" rx="10" fill="rgba(0,0,0,0.45)" />
        <path d="M 10,14 C 10,6 18,4 50,4 C 82,4 90,6 90,14 L 90,187 C 90,194 82,196 50,196 C 18,196 10,194 10,187 Z" fill="${bodyColor}" stroke="#0f172a" stroke-width="2" />
        <rect x="11" y="44" width="78" height="102" rx="3" fill="${stripeColor}" opacity="0.9" />
        <rect x="24" y="52" width="52" height="84" rx="4" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.2" />
        <circle cx="50" cy="94" r="10" fill="#334155" stroke="#38bdf8" stroke-width="1.2" />
        <path d="M 14,9 L 86,9 L 81,37 L 19,37 Z" fill="#0f172a" stroke="#e2e8f0" stroke-width="1.4" />
        <rect x="23" y="13" width="54" height="13" rx="2" fill="#020617" stroke="#38bdf8" stroke-width="0.9" />
        <text x="50" y="22" fill="#4ade80" font-size="7.2" font-weight="bold" font-family="monospace" text-anchor="middle">${safeText}</text>
        <rect x="14" y="3" width="12" height="4" rx="1.5" fill="#fbbf24" />
        <rect x="74" y="3" width="12" height="4" rx="1.5" fill="#fbbf24" />
        <rect x="16" y="193" width="11" height="3.5" rx="1" fill="#ef4444" />
        <rect x="73" y="193" width="11" height="3.5" rx="1" fill="#ef4444" />
      </svg>
    `;
  }

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgContent.trim());
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
    pitch: isCabinViewActive ? 45 : 25,
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

// ============================================================
// DESPACHO SEQUENCIAL NA ESTAÇÃO + RITMO DE VIAGEM MAIS RÁPIDO
// + RADAR COM DESTAQUE DO PRÓXIMO CARRO + SENTIDO OPOSTO (IDA/VOLTA)
// ============================================================

const sameDirTraffic = {
  vehicles: [],
  totalRouteKm: 0,
  isRoadLine: false,
  hasRoundTrip: false,
  allowsOvertake: true,
  spawnIntervalKm: 4,
  nextSpawnKm: 4,
  spawnedCount: 0,
  lastToastMessage: '',
  lastCloseAlertTime: 0
};

function getRouteProgressMeters(segIndex, segProgress) {
  if (!Array.isArray(activePath) || activePath.length < 2) return 0;
  let meters = 0;
  const maxSeg = Math.min(segIndex, activePath.length - 1);
  for (let i = 0; i < maxSeg; i++) {
    meters += getMetersBetween(activePath[i], activePath[i + 1]);
  }
  return meters + Math.max(0, segProgress);
}

function getRelativeBearingArrow(fromCoord, toCoord, referenceHeadingDeg) {
  const bearingToTarget = calculateBearing(fromCoord, toCoord);
  let relAngle = (bearingToTarget - referenceHeadingDeg + 360) % 360;
  if (relAngle > 180) relAngle -= 360;
  if (relAngle < -155 || relAngle > 155) return '⬇';
  if (relAngle < 0) return '↙';
  return '↘';
}

function computeRouteTotalKm(pathCoords) {
  if (!Array.isArray(pathCoords) || pathCoords.length < 2) return 0;
  let totalMeters = 0;
  for (let i = 0; i < pathCoords.length - 1; i++) {
    totalMeters += getMetersBetween(pathCoords[i], pathCoords[i + 1]);
  }
  return totalMeters / 1000;
}

function detectRoundTripRoute(pathCoords, lineNameText = '') {
  if (!Array.isArray(pathCoords) || pathCoords.length < 4) return false;
  const startPt = pathCoords[0];
  const endPt = pathCoords[pathCoords.length - 1];
  const distStartEnd = getMetersBetween(startPt, endPt);
  const totalKm = computeRouteTotalKm(pathCoords);
  const nomeLower = String(lineNameText || '').toLowerCase();
  const hasRoundTripKeywords = nomeLower.includes('ida/volta') ||
    nomeLower.includes('ida e volta') ||
    nomeLower.includes('circular') ||
    nomeLower.includes('terminal');

  return totalKm >= 2.0 && (distStartEnd <= 900 || hasRoundTripKeywords);
}

function configureTrafficThresholdsForRoute(pathCoords, isRoad = false, lineNameText = '') {
  const totalKm = computeRouteTotalKm(pathCoords);
  sameDirTraffic.totalRouteKm = totalKm;
  sameDirTraffic.isRoadLine = Boolean(isRoad);
  sameDirTraffic.hasRoundTrip = detectRoundTripRoute(pathCoords, lineNameText);
  sameDirTraffic.allowsOvertake = true;
  sameDirTraffic.spawnIntervalKm = sameDirTraffic.isRoadLine ? 20 : 4;
  sameDirTraffic.nextSpawnKm = sameDirTraffic.spawnIntervalKm;
  sameDirTraffic.spawnedCount = 0;
  sameDirTraffic.lastToastMessage = '';
  sameDirTraffic.lastCloseAlertTime = 0;
}

function clearSameDirTraffic() {
  for (const v of sameDirTraffic.vehicles) {
    if (v.marker) {
      try { v.marker.remove(); } catch (e) {}
    }
  }
  sameDirTraffic.vehicles = [];
  sameDirTraffic.spawnedCount = 0;
  sameDirTraffic.nextSpawnKm = sameDirTraffic.spawnIntervalKm;
  sameDirTraffic.lastToastMessage = '';
  sameDirTraffic.lastCloseAlertTime = 0;
  hideRearIndicator();
  drawSideMinimap(null, []);
}

function createTrafficVehicleFromStation(seqNumber) {
  if (!map || !Array.isArray(activePath) || activePath.length < 2) return null;

  const p0 = activePath[0];
  const p1 = activePath[1];
  const initHeading = calculateBearing(p0, p1);
  const segLen = Math.max(0.5, getMetersBetween(p0, p1));

  const officialPreset = COLOR_PRESETS[activePresetKey] || COLOR_PRESETS['vermelho'];
  const modelKey = currentVehicleType || (sameDirTraffic.isRoadLine ? 'rodoviario' : 'bhtrans');
  const label = `SAÍDA 0${seqNumber}`;

  const baseOffset = seqNumber % 2 === 1
    ? BASE_RIGHT_LANE_OFFSET_METERS + 0.25
    : BASE_RIGHT_LANE_OFFSET_METERS - 0.25;

  const renderPos = applyRightLaneOffset(p0[0], p0[1], initHeading, baseOffset);

  const el = document.createElement('img');
  el.className = 'bus-marker-img';
  el.style.opacity = '0.96';
  el.src = getBusSvg(officialPreset.bodyColor, officialPreset.stripeColor, modelKey, label);

  const marker = new maplibregl.Marker({
    element: el,
    anchor: 'center',
    rotationAlignment: 'map',
    pitchAlignment: 'map'
  })
    .setLngLat(renderPos)
    .setRotation(initHeading)
    .addTo(map);

  const isFirstOut = seqNumber === 1;
  const cruiseTarget = sameDirTraffic.isRoadLine
    ? (isFirstOut ? 132 : 124)
    : (isFirstOut ? 95 : 88);

  return {
    id: seqNumber,
    lng: p0[0],
    lat: p0[1],
    segIndex: 0,
    segProgress: 0,
    segLength: segLen,
    heading: initHeading,
    speedKmh: 0,
    targetCruiseKmh: cruiseTarget,
    stationWaitSeconds: 2.6,
    baseLaneOffset: baseOffset,
    currentLaneOffset: baseOffset,
    overtakeState: 'none',
    overtakeStartDistMeters: 0,
    returnTripActive: false,
    returnNoticeShown: false,
    finished: false,
    marker: marker
  };
}

function maybeSpawnSameDirTraffic() {
  if (currentGameMode !== 'line' || !isTripActive || isLineFinished) return;
  if (!Array.isArray(activePath) || activePath.length < 2) return;

  const totalKm = sameDirTraffic.totalRouteKm || computeRouteTotalKm(activePath);
  const remainingKm = Math.max(0, totalKm - distanceCoveredKm);
  if (remainingKm < 0.25) return;

  const activeCount = sameDirTraffic.vehicles.filter(v => !v.finished).length;
  if (activeCount >= 2) return;

  if (distanceCoveredKm >= sameDirTraffic.nextSpawnKm) {
    sameDirTraffic.spawnedCount++;
    const newVeh = createTrafficVehicleFromStation(sameDirTraffic.spawnedCount);
    if (newVeh) {
      sameDirTraffic.vehicles.push(newVeh);
      const triggerKm = sameDirTraffic.nextSpawnKm;
      sameDirTraffic.nextSpawnKm += sameDirTraffic.spawnIntervalKm;
      const msg = `🚏 Carro 0${newVeh.id} parado na estação saindo (${triggerKm.toFixed(0)} km)`;
      if (sameDirTraffic.lastToastMessage !== msg) {
        sameDirTraffic.lastToastMessage = msg;
        showAlert(msg);
      }
    }
  }
}

function updateRearDirectionalIndicator(trailingCandidates) {
  if (!rearIndicatorEl) return;
  if (currentGameMode !== 'line' || !isTripActive || isLineFinished || !Array.isArray(trailingCandidates) || trailingCandidates.length === 0) {
    hideRearIndicator();
    return;
  }

  const visibleItems = trailingCandidates
    .filter(item => item.distMeters <= 1200)
    .sort((a, b) => a.distMeters - b.distMeters)
    .slice(0, 2);

  if (visibleItems.length === 0) {
    hideRearIndicator();
    return;
  }

  rearIndicatorEl.style.display = 'flex';
  rearIndicatorEl.innerHTML = visibleItems.map(item => {
    const isClose = item.distMeters <= 140;
    const distText = item.distMeters >= 1000
      ? `${(item.distMeters / 1000).toFixed(2)} km`
      : `${Math.round(item.distMeters)} m`;
    return `
      <div class="rear-indicator-pill ${isClose ? 'close' : ''}">
        <span class="rear-arrow-badge">${item.arrow}</span>
        <span>${item.label} atrás</span>
        <span class="rear-dist-badge">${distText}</span>
      </div>
    `;
  }).join('');
}

function drawSideMinimap(nextVehicleItem, trailingCandidates) {
  const canvas = document.getElementById('sideMinimapCanvas');
  const badgeEl = document.getElementById('minimapNextBadge');
  const infoEl = document.getElementById('minimapNextInfo');
  if (!canvas || !badgeEl || !infoEl) return;

  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(w / 2, h);
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  if (!Array.isArray(activePath) || activePath.length < 2) {
    badgeEl.textContent = 'Off';
    infoEl.textContent = 'Sem rota';
    return;
  }

  const metersPerDegreeLat = 111320;
  const metersPerDegreeLng = 111320 * Math.cos(busLat * (Math.PI / 180));
  const radarRadiusMeters = sameDirTraffic.isRoadLine ? 900 : 550;
  const scale = (w * 0.42) / radarRadiusMeters;

  const toRadarXY = (lng, lat) => {
    const dxMeters = (lng - busLng) * metersPerDegreeLng;
    const dyMeters = (lat - busLat) * metersPerDegreeLat;
    return [w / 2 + dxMeters * scale, h / 2 - dyMeters * scale];
  };

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.55)';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  let started = false;
  const startIdx = Math.max(0, currentSegIndex - 25);
  const endIdx = Math.min(activePath.length - 1, currentSegIndex + 40);
  for (let i = startIdx; i <= endIdx; i++) {
    const [px, py] = toRadarXY(activePath[i][0], activePath[i][1]);
    if (!started) {
      ctx.moveTo(px, py);
      started = true;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  const [stX, stY] = toRadarXY(activePath[0][0], activePath[0][1]);
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.arc(Math.max(6, Math.min(w - 6, stX)), Math.max(6, Math.min(h - 6, stY)), 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 4.5, 0, Math.PI * 2);
  ctx.fill();

  const activeList = sameDirTraffic.vehicles.filter(v => !v.finished);
  if (activeList.length === 0) {
    const faltaKm = Math.max(0, sameDirTraffic.nextSpawnKm - distanceCoveredKm);
    badgeEl.textContent = `${sameDirTraffic.spawnIntervalKm}km`;
    infoEl.textContent = faltaKm > 0 ? `Próx: ${faltaKm.toFixed(1)} km` : 'Aguardando';
    return;
  }

  for (const v of activeList) {
    const [vx, vy] = toRadarXY(v.lng, v.lat);
    const clampedX = Math.max(8, Math.min(w - 8, vx));
    const clampedY = Math.max(8, Math.min(h - 8, vy));
    const isNext = nextVehicleItem && nextVehicleItem.id === v.id;

    if (isNext) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(clampedX, clampedY, 8.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = v.returnTripActive ? '#38bdf8' : (v.stationWaitSeconds > 0 ? '#f97316' : (isNext ? '#fbbf24' : '#34d399'));
    ctx.beginPath();
    ctx.arc(clampedX, clampedY, isNext ? 5.5 : 3.8, 0, Math.PI * 2);
    ctx.fill();
  }

  if (nextVehicleItem) {
    const distStr = nextVehicleItem.distMeters >= 1000
      ? `${(nextVehicleItem.distMeters / 1000).toFixed(2)} km`
      : `${Math.round(nextVehicleItem.distMeters)} m`;
    badgeEl.textContent = `PRÓX V${nextVehicleItem.id}`;
    infoEl.textContent = `${distStr} • ${Math.round(nextVehicleItem.speedKmh || 0)}km/h`;
  } else if (trailingCandidates && trailingCandidates.length > 0) {
    const nearest = trailingCandidates[0];
    const distStr = nearest.distMeters >= 1000
      ? `${(nearest.distMeters / 1000).toFixed(2)} km`
      : `${Math.round(nearest.distMeters)} m`;
    badgeEl.textContent = 'Rota';
    infoEl.textContent = `Atrás: ${distStr}`;
  }
}

function updateSameDirTraffic(deltaTime, frameNow = performance.now()) {
  if (currentGameMode !== 'line' || !map) {
    hideRearIndicator();
    return;
  }

  maybeSpawnSameDirTraffic();

  if (sameDirTraffic.vehicles.length === 0) {
    hideRearIndicator();
    drawSideMinimap(null, []);
    return;
  }

  const playerRouteMeters = getRouteProgressMeters(currentSegIndex, segProgressMeters);
  const trailingCandidates = [];
  let nextVehicleSummary = null;

  for (const v of sameDirTraffic.vehicles) {
    if (v.finished || !v.marker) continue;

    const vRouteMeters = getRouteProgressMeters(v.segIndex, v.segProgress);
    const deltaAlongRouteMeters = playerRouteMeters - vRouteMeters;
    const directDistMeters = getMetersBetween([v.lng, v.lat], [busLng, busLat]);

    const isWaitingAtStation = v.stationWaitSeconds > 0;
    const statusLabel = v.returnTripActive
      ? 'Sentido oposto'
      : (isWaitingAtStation
        ? 'Na estação'
        : (v.overtakeState === 'passing' ? 'Ultrapassando' : (deltaAlongRouteMeters > 0 ? 'Atrás' : 'À frente')));

    if (!nextVehicleSummary || directDistMeters < nextVehicleSummary.distMeters) {
      nextVehicleSummary = {
        id: v.id,
        distMeters: directDistMeters,
        speedKmh: v.speedKmh,
        statusLabel: statusLabel
      };
    }

    if (!v.returnTripActive && deltaAlongRouteMeters > 12) {
      trailingCandidates.push({
        label: `SAÍDA 0${v.id}`,
        distMeters: directDistMeters,
        arrow: getRelativeBearingArrow([busLng, busLat], [v.lng, v.lat], smoothHeading)
      });

      if (directDistMeters <= 110 && (frameNow - sameDirTraffic.lastCloseAlertTime > 12000)) {
        sameDirTraffic.lastCloseAlertTime = frameNow;
        showAlert(`⬅️ SAÍDA 0${v.id} se aproximando (${Math.round(directDistMeters)} m)`);
      }
    }

    if (isTripActive && !isLineFinished) {
      if (v.stationWaitSeconds > 0) {
        v.stationWaitSeconds = Math.max(0, v.stationWaitSeconds - deltaTime);
        v.speedKmh = 0;
      } else {
        const baseCruiseCap = sameDirTraffic.isRoadLine ? 136 : 98;
        const paceBoost = v.id === 1 ? 8 : 5;
        let targetSpeedKmh = Math.min(baseCruiseCap, Math.max(v.targetCruiseKmh, currentSpeedKmh + paceBoost));
        if (currentSpeedKmh < 12) {
          targetSpeedKmh = Math.min(v.targetCruiseKmh, 42);
        }

        let desiredLaneOffset = v.returnTripActive ? -BASE_RIGHT_LANE_OFFSET_METERS : v.baseLaneOffset;

        const isBehindInOvertakeWindow = !v.returnTripActive && deltaAlongRouteMeters > 6 && deltaAlongRouteMeters < 52 && directDistMeters < 58;
        const canOvertakeCalmly = currentSpeedKmh <= baseCruiseCap;

        if (v.overtakeState === 'none' && isBehindInOvertakeWindow && canOvertakeCalmly) {
          v.overtakeState = 'passing';
          v.overtakeStartDistMeters = vRouteMeters;
        }

        if (v.overtakeState === 'passing') {
          const passedMeters = vRouteMeters - v.overtakeStartDistMeters;
          desiredLaneOffset = Math.max(-1.6, v.baseLaneOffset - 2.6);
          targetSpeedKmh = Math.min(baseCruiseCap, Math.max(v.targetCruiseKmh + 6, currentSpeedKmh + 10));

          if (passedMeters >= 62 || deltaAlongRouteMeters < -32) {
            v.overtakeState = 'returning';
          }
        } else if (v.overtakeState === 'returning') {
          desiredLaneOffset = v.baseLaneOffset;
          if (Math.abs(v.currentLaneOffset - v.baseLaneOffset) < 0.15) {
            v.overtakeState = 'none';
          }
        }

        if (v.speedKmh < targetSpeedKmh) {
          v.speedKmh = Math.min(targetSpeedKmh, v.speedKmh + 28 * deltaTime);
        } else if (v.speedKmh > targetSpeedKmh) {
          v.speedKmh = Math.max(targetSpeedKmh, v.speedKmh - 26 * deltaTime);
        }

        v.currentLaneOffset += (desiredLaneOffset - v.currentLaneOffset) * Math.min(1, 3.0 * deltaTime);

        const speedMps = (v.speedKmh / 3.6) * speedMultiplier;
        let remDist = speedMps * deltaTime;

        while (remDist > 0 && v.segIndex < activePath.length - 1) {
          const p1 = activePath[v.segIndex];
          const p2 = activePath[v.segIndex + 1];

          if (v.segLength <= 0) {
            v.segLength = getMetersBetween(p1, p2);
          }

          if (v.segLength <= 0.1) {
            v.segIndex++;
            v.segProgress = 0;
            v.segLength = v.segIndex < activePath.length - 1
              ? getMetersBetween(activePath[v.segIndex], activePath[v.segIndex + 1])
              : 0;
            continue;
          }

          const leftInSeg = v.segLength - v.segProgress;
          if (remDist < leftInSeg) {
            v.segProgress += remDist;
            remDist = 0;
            const ratio = v.segProgress / v.segLength;
            v.lng = p1[0] + (p2[0] - p1[0]) * ratio;
            v.lat = p1[1] + (p2[1] - p1[1]) * ratio;
            const segBear = calculateBearing(p1, p2);
            const visualBear = v.returnTripActive ? (segBear + 180) % 360 : segBear;
            v.heading = lerpHeading(v.heading, visualBear, Math.min(1, 8.0 * deltaTime));
          } else {
            remDist -= leftInSeg;
            v.segIndex++;
            v.segProgress = 0;
            if (v.segIndex >= activePath.length - 1) {
              if (sameDirTraffic.hasRoundTrip && !v.returnTripActive && distanceCoveredKm < (sameDirTraffic.totalRouteKm - 0.6)) {
                v.returnTripActive = true;
                v.segIndex = Math.max(1, Math.min(activePath.length - 2, Math.floor(activePath.length * 0.72)));
                v.segProgress = 0;
                v.segLength = getMetersBetween(activePath[v.segIndex], activePath[v.segIndex + 1]);
                v.lng = activePath[v.segIndex][0];
                v.lat = activePath[v.segIndex][1];
                const revBear = (calculateBearing(activePath[v.segIndex], activePath[v.segIndex + 1]) + 180) % 360;
                v.heading = revBear;
                v.currentLaneOffset = -BASE_RIGHT_LANE_OFFSET_METERS;
                if (!v.returnNoticeShown) {
                  v.returnNoticeShown = true;
                  showAlert(`↔️ Carro 0${v.id} em retorno no sentido oposto`);
                }
                break;
              } else {
                v.lng = activePath[activePath.length - 1][0];
                v.lat = activePath[activePath.length - 1][1];
                v.finished = true;
                break;
              }
            } else {
              v.segLength = getMetersBetween(activePath[v.segIndex], activePath[v.segIndex + 1]);
              v.lng = activePath[v.segIndex][0];
              v.lat = activePath[v.segIndex][1];
              const segBear = calculateBearing(activePath[v.segIndex], activePath[v.segIndex + 1]);
              const visualBear = v.returnTripActive ? (segBear + 180) % 360 : segBear;
              v.heading = lerpHeading(v.heading, visualBear, Math.min(1, 8.0 * deltaTime));
            }
          }
        }
      }
    }

    const pos = applyRightLaneOffset(v.lng, v.lat, v.heading, v.currentLaneOffset);
    v.marker.setLngLat(pos);
    v.marker.setRotation(v.heading);
  }

  updateRearDirectionalIndicator(trailingCandidates);
  drawSideMinimap(nextVehicleSummary, trailingCandidates);
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
  const gearCapKmh = updateGearboxPhysics(deltaTime);

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
        desiredSpeed = Math.min(boostSpeedKmh, gearCapKmh);
      } else {
        desiredSpeed = Math.min(cruiseSpeedKmh, gearCapKmh);
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

      if (!keysPressed.Left && !keysPressed.Right) {
        lineLateralCorrectionMeters += (0 - lineLateralCorrectionMeters) * Math.min(1, 2.2 * deltaTime);
      }

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
      if (gearboxMode === 'manual' && isReverseGearEngaged) {
        const revCap = -Math.min(Math.abs(MAX_REVERSE_SPEED_KMH), gearCapKmh);
        currentSpeedKmh = Math.max(currentSpeedKmh - 28 * deltaTime, revCap);
      } else {
        if (currentSpeedKmh < 0) {
          currentSpeedKmh = Math.min(currentSpeedKmh + 65 * deltaTime, 0);
        } else {
          desiredSpeed = Math.min(boostSpeedKmh, gearCapKmh);
          currentSpeedKmh = Math.min(currentSpeedKmh + 42 * deltaTime, desiredSpeed);
        }
      }
    } else if (keysPressed.Down) {
      if (currentSpeedKmh > 0) {
        currentSpeedKmh = Math.max(currentSpeedKmh - 65 * deltaTime, 0);
      } else if (gearboxMode === 'auto' || isReverseGearEngaged) {
        const revCap = -Math.min(Math.abs(MAX_REVERSE_SPEED_KMH), gearCapKmh);
        currentSpeedKmh = Math.max(currentSpeedKmh - 28 * deltaTime, revCap);
      }
    } else {
      if (currentSpeedKmh > 0) {
        currentSpeedKmh = Math.max(currentSpeedKmh - 24 * deltaTime, 0);
      } else if (currentSpeedKmh < 0) {
        currentSpeedKmh = Math.min(currentSpeedKmh + 24 * deltaTime, 0);
      }
    }

    const absSpeed = Math.abs(currentSpeedKmh);
    const steerInput = (keysPressed.Right ? 1 : 0) - (keysPressed.Left ? 1 : 0);
    const speedGripFactor = absSpeed < 0.5
      ? 0
      : Math.max(0.45, Math.min(1, 1.05 - (absSpeed / 140) * 0.55));
    const targetSteerRate = steerInput * 38 * speedGripFactor;
    freeSteerRate += (targetSteerRate - freeSteerRate) * Math.min(1, 6.0 * deltaTime);

    if (absSpeed > 0.05) {
      const reverseDirFactor = currentSpeedKmh < -0.5 ? -1 : 1;
      vehicleHeading = (vehicleHeading + freeSteerRate * reverseDirFactor * deltaTime + 360) % 360;

      const speedMps = (currentSpeedKmh / 3.6) * speedMultiplier;
      const metersToMove = speedMps * deltaTime;
      const metersPerDegreeLat = 111320;
      const cosLat = Math.max(0.1, Math.cos(busLat * (Math.PI / 180)));
      const metersPerDegreeLng = 111320 * cosLat;

      const rad = (vehicleHeading * Math.PI) / 180;
      busLng += (metersToMove * Math.sin(rad)) / metersPerDegreeLng;
      busLat += (metersToMove * Math.cos(rad)) / metersPerDegreeLat;
    }

    renderLng = busLng;
    renderLat = busLat;
    busWorldHeading = (vehicleHeading + freeSteerRate * 0.06 + 360) % 360;
  }

  const distStep = getMetersBetween(prev, [busLng, busLat]) / 1000;
  if (!isNaN(distStep)) {
    distanceCoveredKm += distStep;
  }

  const distFormatted = `${distanceCoveredKm.toFixed(2)} km`;
  const isReversing = currentSpeedKmh < -0.5;
  const speedRounded = Math.round(Math.abs(currentSpeedKmh));
  const speedDisplay = isReversing ? `R ${speedRounded}` : `${speedRounded}`;

  document.getElementById('kmCoveredDisplay').textContent = distFormatted;
  document.getElementById('miniKmDisplay').textContent = distFormatted;
  document.getElementById('speedValue').textContent = speedDisplay;
  document.getElementById('miniSpeedDisplay').textContent = speedDisplay;

  updateSameDirTraffic(deltaTime, now);

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
    pitch: isCabinViewActive ? 45 : 25,
    zoom: isCabinViewActive ? Math.max(currentZoomLevel, 18.8) : currentZoomLevel
  });

  if (!isLineFinished) {
    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

document.getElementById('btnZoomNear').addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  currentZoomLevel = ZOOM_NEAR_LEVEL;
  document.getElementById('btnZoomNear').classList.add('active');
  document.getElementById('btnZoomFar').classList.remove('active');
});

document.getElementById('btnZoomFar').addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  currentZoomLevel = ZOOM_FAR_LEVEL;
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
  if (e.code === 'KeyE') {
    shiftManualGear(1);
  }
  if (e.code === 'KeyQ') {
    shiftManualGear(-1);
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
