// ============================================================
// ARQUIVO: script.js
// MOTOR DE SIMULAÇÃO - MODO TRAJETO + MODO LIVRE + DIA/NOITE + PREFIXOS
// ============================================================

const STORAGE_KEY_STATE = 'simulador_bus_estado_v9';

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
    transition: filter 0.45s ease;
  }

  #map.night-mode-map {
    filter: brightness(0.62) contrast(1.18) saturate(0.85);
  }

  .night-tint-overlay {
    position: fixed;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    background: radial-gradient(circle at 50% 48%, rgba(15, 23, 42, 0.08) 28%, rgba(2, 6, 23, 0.42) 100%);
    opacity: 0;
    transition: opacity 0.45s ease;
  }

  .night-tint-overlay.active {
    opacity: 1;
  }

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
    background: radial-gradient(circle at 50% 42%, rgba(255,255,255,0.02) 42%, rgba(2, 6, 23, 0.46) 100%);
  }

  .pov-visor-top {
    position: absolute;
    top: 0;
    left: 14%;
    right: 14%;
    height: 8%;
    background: linear-gradient(180deg, #090d16 0%, #1e293b 88%, #0f172a 100%);
    border-bottom: 2px solid #334155;
    border-radius: 0 0 12px 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.55);
  }

  .pov-pillar-left {
    position: absolute;
    top: 0;
    left: 0;
    width: 7%;
    height: 75%;
    background: linear-gradient(90deg, #090d16 0%, #1e293b 82%, #0f172a 100%);
    clip-path: polygon(0 0, 100% 0, 56% 100%, 0 100%);
    box-shadow: 6px 0 18px rgba(0, 0, 0, 0.65);
  }

  .pov-pillar-right {
    position: absolute;
    top: 0;
    right: 0;
    width: 7%;
    height: 75%;
    background: linear-gradient(270deg, #090d16 0%, #1e293b 82%, #0f172a 100%);
    clip-path: polygon(0 0, 100% 0, 100% 100%, 44% 100%);
    box-shadow: -6px 0 18px rgba(0, 0, 0, 0.65);
  }

  .pov-dashboard {
    position: absolute;
    left: -2%;
    right: -2%;
    bottom: 0;
    height: 16%;
    background: linear-gradient(180deg, #1e293b 0%, #0f172a 65%, #020617 100%);
    border-top: 2px solid #334155;
    box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.75);
  }

  .gearbox-widget {
    display: none !important;
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
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 20px;
    padding: 6px 12px;
    display: none;
    align-items: center;
    gap: 8px;
    z-index: 999999;
    color: #ffffff;
    font-size: 0.75rem;
    box-shadow: 0 4px 14px rgba(0,0,0,0.45);
    white-space: nowrap;
    max-width: calc(100vw - 12px);
  }

  .btn-toggle-hud {
    background: #3b82f6;
    border: none;
    color: #ffffff;
    padding: 4px 8px;
    border-radius: 10px;
    font-size: 0.68rem;
    font-weight: bold;
    cursor: pointer;
  }

  .btn-camera-view {
    background: #0f766e;
    border: 1px solid #2dd4bf;
    color: #ffffff;
    padding: 4px 8px;
    border-radius: 10px;
    font-size: 0.68rem;
    font-weight: bold;
    cursor: pointer;
  }

  .btn-camera-view.cabine-on {
    background: #f59e0b;
    border-color: #fbbf24;
    color: #0f172a;
  }

  .btn-time-cycle {
    background: #1e293b;
    border: 1px solid #fbbf24;
    color: #fde047;
    padding: 4px 8px;
    border-radius: 10px;
    font-size: 0.68rem;
    font-weight: bold;
    cursor: pointer;
  }

  .btn-time-cycle.night-on {
    background: #312e81;
    border-color: #818cf8;
    color: #e0e7ff;
  }

  .hud {
    position: absolute !important;
    top: 88px !important;
    left: 12px !important;
    z-index: 999999 !important;
    background: rgba(15, 23, 42, 0.92) !important;
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

  .btn-pace-toggle {
    width: 100%;
    padding: 7px;
    margin-top: 8px;
    background: rgba(14, 116, 144, 0.85);
    border: 1px solid #22d3ee;
    border-radius: 6px;
    color: #ffffff;
    font-weight: bold;
    font-size: 0.78rem;
    cursor: pointer;
    text-align: center;
  }

  .btn-pace-toggle.fast {
    background: #d97706;
    border-color: #fbbf24;
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
    width: 162px;
    background: rgba(15, 23, 42, 0.94);
    border: 1.5px solid rgba(56, 189, 248, 0.65);
    border-radius: 14px;
    padding: 8px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
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
    gap: 4px;
    font-size: 0.65rem;
    font-weight: 700;
    color: #38bdf8;
    letter-spacing: 0.01em;
    white-space: nowrap;
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
      width: 128px;
      padding: 6px;
    }
    .side-minimap-header {
      font-size: 0.58rem;
    }
    .side-minimap-canvas {
      width: 104px;
      height: 104px;
    }
  }

  .bottom-cockpit-bar {
    position: fixed !important;
    bottom: calc(12px + env(safe-area-inset-bottom, 0px)) !important;
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

  .free-mode-controls {
    display: none;
    align-items: center;
    justify-content: center;
    gap: 18px;
    pointer-events: auto;
  }

  body.free-mode-active .cross-dpad {
    display: none !important;
  }

  body.free-mode-active .free-mode-controls {
    display: flex !important;
  }

  .free-wheel-stage {
    position: relative;
    width: 218px;
    height: 218px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 640px) {
    .free-wheel-stage {
      width: 184px;
      height: 184px;
    }
  }

  .free-steering-wheel {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transition: transform 0.05s linear;
    filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.85));
    pointer-events: none;
  }

  .free-steer-zone {
    position: absolute;
    top: 10%;
    bottom: 10%;
    width: 46%;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 3;
    border-radius: 28px;
  }

  .free-steer-left {
    left: 0;
  }

  .free-steer-right {
    right: 0;
  }

  .free-pedals-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .free-pedal-btn {
    width: 78px;
    height: 68px;
    border-radius: 14px;
    border: 2px solid rgba(255, 255, 255, 0.25);
    font-weight: 800;
    font-size: 0.78rem;
    color: #ffffff;
    cursor: pointer;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.65);
  }

  .free-pedal-accel {
    background: linear-gradient(180deg, #10b981 0%, #047857 100%);
  }

  .free-pedal-brake {
    background: linear-gradient(180deg, #ef4444 0%, #991b1b 100%);
  }

  .free-pedal-btn.pressed {
    transform: scale(0.95);
    filter: brightness(1.18);
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
    bottom: calc(234px + env(safe-area-inset-bottom, 0px)) !important;
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

  .bus-marker-wrap {
    width: 68px;
    height: 126px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    pointer-events: none !important;
    transform-origin: center 88px;
  }

  /* Prefixo estratégico fora da frente (na região traseira/lateral baixa do marcador) */
  .bus-prefix-tag {
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    background: #0f172a;
    border: 1.5px solid #fbbf24;
    color: #fef08a;
    font-size: 10.5px;
    font-weight: 800;
    font-family: monospace;
    line-height: 1.1;
    padding: 2px 6px;
    border-radius: 5px;
    letter-spacing: 0.04em;
    pointer-events: none;
    z-index: 5;
    white-space: nowrap;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.85);
  }

  .bus-headlight-beam {
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 46px;
    height: 64px;
    background: radial-gradient(ellipse at 50% 98%, rgba(254, 249, 195, 0.78) 0%, rgba(254, 240, 138, 0.32) 52%, rgba(254, 240, 138, 0) 100%);
    clip-path: polygon(35% 100%, 65% 100%, 100% 0%, 0% 0%);
    opacity: 0;
    transition: opacity 0.35s ease;
    pointer-events: none;
    z-index: 1;
  }

  body.night-mode-active .bus-headlight-beam {
    opacity: 1;
  }

  .bus-marker-img {
    width: 18px !important;
    height: 54px !important;
    display: block !important;
    filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.95));
    position: relative;
    z-index: 2;
    margin-bottom: 18px;
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

const nightTintOverlay = document.createElement('div');
nightTintOverlay.className = 'night-tint-overlay';
nightTintOverlay.id = 'nightTintOverlay';
document.body.appendChild(nightTintOverlay);

const alertToast = document.createElement('div');
alertToast.className = 'alert-toast';
document.body.appendChild(alertToast);

let toastTimeoutId = null;
function showAlert(message) {
  alertToast.textContent = message;
  alertToast.style.display = 'block';
  if (toastTimeoutId) clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => {
    alertToast.style.display = 'none';
  }, 2400);
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

function sanitizeBusPrefix(rawPrefix, fallback = '38185') {
  const digits = String(rawPrefix || '').replace(/\D/g, '').slice(0, 6);
  return digits.length > 0 ? digits : fallback;
}

function generateSupportPrefix(playerPrefixStr, usedPrefixesSet) {
  const cleanPlayer = sanitizeBusPrefix(playerPrefixStr, '38185');
  const num = parseInt(cleanPlayer, 10);

  if (Number.isFinite(num) && num >= 100) {
    const rangeStart = Math.floor(num / 100) * 100;
    const rangeEnd = rangeStart + 100;

    for (let attempt = 0; attempt < 150; attempt++) {
      const candidateNum = rangeStart + Math.floor(Math.random() * (rangeEnd - rangeStart + 1));
      const candidateStr = String(candidateNum).padStart(cleanPlayer.length, '0');
      if (candidateStr !== cleanPlayer && !usedPrefixesSet.has(candidateStr)) {
        usedPrefixesSet.add(candidateStr);
        return candidateStr;
      }
    }
  }

  for (let i = 100; i <= 999; i++) {
    const fallbackStr = `${cleanPlayer.slice(0, 2)}${i}`;
    if (fallbackStr !== cleanPlayer && !usedPrefixesSet.has(fallbackStr)) {
      usedPrefixesSet.add(fallbackStr);
      return fallbackStr;
    }
  }
  return '38101';
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
      <label>Prefixo do Seu Ônibus (ex: 38185):</label>
      <input type="text" id="inputBusPrefixLine" inputmode="numeric" maxlength="6" value="38185" placeholder="Ex: 38185" />
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
      <label>Período / Clima Visual:</label>
      <select id="selectTimeModeLine">
        <option value="day">☀️ Dia (Claro)</option>
        <option value="night">🌙 Noite (Apenas Farol)</option>
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
      <label>Período / Clima Visual:</label>
      <select id="selectTimeModeFree">
        <option value="day">☀️ Dia (Claro)</option>
        <option value="night">🌙 Noite (Apenas Farol)</option>
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
  <div class="pov-dashboard"></div>
`;
document.body.appendChild(cockpitOverlay);

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
  const timeLineSelect = document.getElementById('selectTimeModeLine');
  const timeFreeSelect = document.getElementById('selectTimeModeFree');
  const freeLocInput = document.getElementById('inputFreeLocation');
  const prefixLineInput = document.getElementById('inputBusPrefixLine');

  if (prefs.categoryType && catSelect) {
    catSelect.value = prefs.categoryType;
  }
  if (prefs.busPrefix && prefixLineInput) {
    prefixLineInput.value = prefs.busPrefix;
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
  if (prefs.timeMode && (prefs.timeMode === 'day' || prefs.timeMode === 'night')) {
    if (timeLineSelect) timeLineSelect.value = prefs.timeMode;
    if (timeFreeSelect) timeFreeSelect.value = prefs.timeMode;
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

document.getElementById('inputBusPrefixLine').addEventListener('input', (e) => {
  const clean = sanitizeBusPrefix(e.target.value, '38185');
  saveUserPreferences({ busPrefix: clean });
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

document.getElementById('selectTimeModeLine').addEventListener('change', (e) => {
  saveUserPreferences({ timeMode: e.target.value });
});

document.getElementById('selectTimeModeFree').addEventListener('change', (e) => {
  saveUserPreferences({ timeMode: e.target.value });
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
  <button class="btn-time-cycle" id="btnToggleTimeMode">☀️ Dia</button>
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

  <button class="btn-pace-toggle" id="btnTogglePace">⚡ Ritmo da Viagem: 1.0x</button>
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
    <span>Proximo Carro:</span>
    <span id="minimapNextBadge" style="color:#fbbf24;">Apoio</span>
  </div>
  <canvas class="side-minimap-canvas" id="sideMinimapCanvas" width="138" height="138"></canvas>
  <div class="side-minimap-footer" id="minimapNextInfo">Aguardando saída</div>
`;
document.body.appendChild(sideMinimapBox);

function getSteeringWheelSvg() {
  const wheelSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="84" fill="none" stroke="#090d16" stroke-width="20"/>
      <circle cx="100" cy="100" r="84" fill="none" stroke="#334155" stroke-width="5"/>
      <path d="M 24 102 L 76 102" stroke="#0f172a" stroke-width="16" stroke-linecap="round"/>
      <path d="M 124 102 L 176 102" stroke="#0f172a" stroke-width="16" stroke-linecap="round"/>
      <path d="M 100 116 L 100 176" stroke="#0f172a" stroke-width="18" stroke-linecap="round"/>
      <circle cx="100" cy="102" r="24" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
      <path d="M 100 22 L 94 34 L 106 34 Z" fill="#f59e0b"/>
      <text x="100" y="106" fill="#e2e8f0" font-size="9" font-weight="bold" font-family="sans-serif" text-anchor="middle">BUS</text>
    </svg>
  `;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(wheelSvg.trim());
}

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

  <div class="free-mode-controls" id="freeModeControls">
    <div class="free-wheel-stage">
      <img class="free-steering-wheel" id="freeSteeringWheelImg" src="${getSteeringWheelSvg()}" alt="Volante" />
      <button class="free-steer-zone free-steer-left" id="btnWheelLeft" title="Virar Esquerda"></button>
      <button class="free-steer-zone free-steer-right" id="btnWheelRight" title="Virar Direita"></button>
    </div>
    <div class="free-pedals-col">
      <button class="free-pedal-btn free-pedal-accel" id="btnFreeAccel">▲ ACE</button>
      <button class="free-pedal-btn free-pedal-brake" id="btnFreeBrake">▼ FRE</button>
    </div>
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
let playerBusPrefix = '38185';

let isCabinViewActive = false;
let isNightMode = false;
let wheelAngleDeg = 0;

function syncModeBodyClass() {
  document.body.classList.toggle('free-mode-active', currentGameMode === 'free');
}

function applyDayNightTheme(nightEnabled, silent = false) {
  isNightMode = Boolean(nightEnabled);
  const mapEl = document.getElementById('map');
  const tintEl = document.getElementById('nightTintOverlay');
  const btnTime = document.getElementById('btnToggleTimeMode');

  document.body.classList.toggle('night-mode-active', isNightMode);
  if (mapEl) mapEl.classList.toggle('night-mode-map', isNightMode);
  if (tintEl) tintEl.classList.toggle('active', isNightMode);

  if (btnTime) {
    btnTime.classList.toggle('night-on', isNightMode);
    btnTime.textContent = isNightMode ? '🌙 Noite' : '☀️ Dia';
  }

  saveUserPreferences({ timeMode: isNightMode ? 'night' : 'day' });
  if (!silent) {
    showAlert(isNightMode ? '🌙 Modo Noite ativo • Apenas farol aceso' : '☀️ Modo Dia ativo');
  }
}

document.getElementById('btnToggleTimeMode').addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  applyDayNightTheme(!isNightMode, false);
});

const routeCheckpointState = {
  totalKm: 0,
  milestones: [],
  finalApproachNotified: false
};

function setupRouteCheckpoints(pathCoords) {
  routeCheckpointState.totalKm = computeRouteTotalKm(pathCoords);
  routeCheckpointState.finalApproachNotified = false;
  const total = routeCheckpointState.totalKm;

  if (total < 1.2) {
    routeCheckpointState.milestones = [];
    return;
  }

  routeCheckpointState.milestones = [
    { km: total * 0.25, label: '🚏 Ponto de Referência (25% do trajeto)', triggered: false },
    { km: total * 0.50, label: '🚏 Ponto Central / Integração (50% do trajeto)', triggered: false },
    { km: total * 0.75, label: '🚏 Trecho Final da Linha (75% do trajeto)', triggered: false }
  ];
}

function checkRouteProgressAlerts() {
  if (currentGameMode !== 'line' || !isTripActive || isLineFinished) return;
  const total = routeCheckpointState.totalKm;
  if (total <= 0) return;

  for (const m of routeCheckpointState.milestones) {
    if (!m.triggered && distanceCoveredKm >= m.km) {
      m.triggered = true;
      showAlert(m.label);
      return;
    }
  }

  const remainingMeters = (total - distanceCoveredKm) * 1000;
  if (!routeCheckpointState.finalApproachNotified && remainingMeters > 40 && remainingMeters <= 300) {
    routeCheckpointState.finalApproachNotified = true;
    showAlert('🏁 Aproximando do ponto final / terminal (menos de 300 m)');
  }
}

function setCabinView(enabled) {
  isCabinViewActive = Boolean(enabled);
  const btnCam = document.getElementById('btnToggleCameraView');
  if (cockpitOverlay) {
    cockpitOverlay.classList.toggle('active', isCabinViewActive);
  }
  if (btnCam) {
    btnCam.classList.toggle('cabine-on', isCabinViewActive);
    btnCam.textContent = isCabinViewActive ? '🗺️ Mapa' : '👁️ Cabine';
  }
  if (map) {
    map.setPitch(isCabinViewActive ? 45 : 25);
  }
}

document.getElementById('btnToggleCameraView').addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  setCabinView(!isCabinViewActive);
});

let activePath = [];
let busLng = 0;
let busLat = 0;

let currentSpeedKmh = 0;
let isAutopilotMoving = false;
let holdBoostActive = false;
let freeCruiseEngaged = false;

const CRUISE_TARGET_KMH = 80;
const FREE_MAX_SPEED_KMH = 200;
let cruiseSpeedKmh = CRUISE_TARGET_KMH;
let boostSpeedKmh = 140;
const MAX_REVERSE_SPEED_KMH = -25;

let playerYieldTimer = 0;

let vehicleHeading = 0;
let freeSteerRate = 0;
let freeTapImpulseRate = 0;
let distanceCoveredKm = 0;

let currentSegIndex = 0;
let segProgressMeters = 0;
let currentSegLength = 0;
let targetHeading = 0;
let smoothHeading = 0;
let currentCameraBearing = 0;

const BASE_RIGHT_LANE_OFFSET_METERS = 1.2;
let lineLateralCorrectionMeters = 0;
let lineLateralVelocity = 0;
let busVisualYawOffset = 0;
const MAX_LINE_LATERAL_ADJUST_METERS = 1.8;

let isLineFinished = false;
let isTripActive = false;

let tripStartTime = null;
let tripTimerInterval = null;
let tripStartRealTimeStr = '';
let speedMultiplier = 1.0;
const PACE_LEVELS = [1.0, 1.5, 2.0];

function updatePaceButtonUI() {
  const btnPace = document.getElementById('btnTogglePace');
  if (!btnPace) return;
  const isFast = speedMultiplier > 1.05;
  btnPace.classList.toggle('fast', isFast);
  btnPace.textContent = `⚡ Ritmo da Viagem: ${speedMultiplier.toFixed(1)}x`;
}

document.getElementById('btnTogglePace').addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  const currentIdx = PACE_LEVELS.findIndex(p => Math.abs(p - speedMultiplier) < 0.05);
  const nextIdx = (currentIdx + 1) % PACE_LEVELS.length;
  speedMultiplier = PACE_LEVELS[nextIdx];
  updatePaceButtonUI();
  showAlert(`⚡ Ritmo da viagem ajustado para ${speedMultiplier.toFixed(1)}x`);
});

const ZOOM_FAR_LEVEL = 18.3;
const ZOOM_NEAR_LEVEL = 19.2;
let currentZoomLevel = ZOOM_FAR_LEVEL;

const keysPressed = { Up: false, Down: false, Left: false, Right: false };

function triggerFreeTapSteer(dir) {
  if (currentGameMode !== 'free') return;
  freeTapImpulseRate = Math.max(-72, Math.min(72, freeTapImpulseRate + dir * 42));
  freeSteerRate = freeTapImpulseRate * 0.75;
}

function calculateBearing(startCoord, endCoord) {
  const [startLng, startLat] = startCoord;
  const [endLng, endLat] = endCoord;

  const y = Math.sin((endLng - startLng) * Math.PI / 180) * Math.cos(endLat * Math.PI / 180);
  const x = Math.cos(startLat * Math.PI / 180) * Math.sin(endLat * Math.PI / 180) -
            Math.sin(startLat * Math.PI / 180) * Math.cos(endLat * Math.PI / 180) * Math.cos((endLng - startLng) * Math.PI / 180);

  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function lerpHeading(current, target, factor) {
  const clampedFactor = Math.min(1, Math.max(0, factor));
  let diff = (target - current + 360) % 360;
  if (diff > 180) diff -= 360;
  return (current + diff * clampedFactor + 360) % 360;
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

function createBusMarkerElement(bodyColor, stripeColor, modelKey, letreiroText, prefixCode = '', opacity = '1') {
  const wrap = document.createElement('div');
  wrap.className = 'bus-marker-wrap';
  wrap.style.opacity = opacity;

  const beam = document.createElement('div');
  beam.className = 'bus-headlight-beam';

  const img = document.createElement('img');
  img.className = 'bus-marker-img';
  img.src = getBusSvg(bodyColor, stripeColor, modelKey, letreiroText);

  wrap.appendChild(beam);
  wrap.appendChild(img);

  if (prefixCode) {
    const tag = document.createElement('div');
    tag.className = 'bus-prefix-tag';
    tag.textContent = String(prefixCode);
    wrap.appendChild(tag);
  }

  return wrap;
}

function updateBusMarkerIcon(modelOverride = null, colorKeyOverride = null) {
  if (!busMarker) return;
  const chosenModel = modelOverride || currentVehicleType;
  const chosenColorKey = colorKeyOverride || activePresetKey;
  const preset = COLOR_PRESETS[chosenColorKey] || COLOR_PRESETS['vermelho'];
  const el = busMarker.getElement();
  const imgEl = el.querySelector('.bus-marker-img');
  if (imgEl) {
    imgEl.src = getBusSvg(preset.bodyColor, preset.stripeColor, chosenModel, activeLetreiroText);
  }
  const tagEl = el.querySelector('.bus-prefix-tag');
  if (currentGameMode === 'line') {
    if (tagEl) {
      tagEl.textContent = playerBusPrefix;
    } else if (playerBusPrefix) {
      const newTag = document.createElement('div');
      newTag.className = 'bus-prefix-tag';
      newTag.textContent = playerBusPrefix;
      el.appendChild(newTag);
    }
  } else if (tagEl) {
    tagEl.remove();
  }
}

function bindControlTouch(elementId, keyName) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (keyName === 'Up') {
      handleAccelerate();
      if (currentGameMode === 'free') freeCruiseEngaged = true;
    }
    if (keyName === 'Left') triggerFreeTapSteer(-1);
    if (keyName === 'Right') triggerFreeTapSteer(1);
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
bindControlTouch('btnWheelLeft', 'Left');
bindControlTouch('btnWheelRight', 'Right');
bindControlTouch('btnFreeAccel', 'Up');
bindControlTouch('btnFreeBrake', 'Down');

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
    holdBoostActive = false;
    currentSpeedKmh = 0;
    stopTripTimer();
    updateTripStatus();
  }
});

document.getElementById('btnStartLineMode').addEventListener('click', () => {
  currentGameMode = 'line';
  syncModeBodyClass();
  const selectedKey = document.getElementById('selectLine').value;
  activePresetKey = document.getElementById('selectColorLine').value || 'vermelho';
  const chosenTimeMode = document.getElementById('selectTimeModeLine')?.value || 'day';
  playerBusPrefix = sanitizeBusPrefix(document.getElementById('inputBusPrefixLine')?.value, '38185');
  saveUserPreferences({
    lastLineKey: selectedKey,
    colorLine: activePresetKey,
    timeMode: chosenTimeMode,
    busPrefix: playerBusPrefix
  });

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

  cruiseSpeedKmh = CRUISE_TARGET_KMH;
  boostSpeedKmh = (lineData.tipo === 'rodoviario' || chosenModel === 'rodoviario') ? 160 : 120;

  const isRoadCategory = (lineData.tipo || '').toLowerCase() === 'rodoviario' || chosenModel === 'rodoviario';
  activePath = extractCoordinates(lineData.trajeto);
  clearSameDirTraffic();
  configureTrafficThresholdsForRoute(activePath, isRoadCategory, playerBusPrefix);
  setupRouteCheckpoints(activePath);
  speedMultiplier = 1.0;
  updatePaceButtonUI();

  if (activePath.length < 2) {
    showAlert('A linha selecionada não possui coordenadas de trajeto válidas.');
    return;
  }

  document.getElementById('lineBadgeDisplay').textContent = `${lineData.nome} • Carro ${playerBusPrefix}`;
  currentSegIndex = 0;
  segProgressMeters = 0;
  currentSegLength = getMetersBetween(activePath[0], activePath[1]);
  isLineFinished = false;
  isTripActive = false;
  isAutopilotMoving = false;
  holdBoostActive = false;
  playerYieldTimer = 0;
  currentSpeedKmh = 0;
  distanceCoveredKm = 0;
  lineLateralCorrectionMeters = 0;
  lineLateralVelocity = 0;
  busVisualYawOffset = 0;
  wheelAngleDeg = 0;

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
  startSimulation(activePath[0], initialLanePos, chosenTimeMode === 'night');
});

document.getElementById('btnStartFreeMode').addEventListener('click', async () => {
  currentGameMode = 'free';
  syncModeBodyClass();
  const chosenFreeModel = document.getElementById('selectModelFree')?.value || 'bhtrans';
  playerBusPrefix = '';
  currentVehicleType = chosenFreeModel;
  activeLetreiroText = chosenFreeModel === 'rodoviario'
    ? 'RODOVIÁRIO'
    : (chosenFreeModel === 'metropolitano' ? 'METROPOLITANO' : 'BHTRANS LIVRE');
  activePresetKey = document.getElementById('selectColorFree').value || 'vermelho';
  const chosenTimeMode = document.getElementById('selectTimeModeFree')?.value || 'day';
  const locationQuery = document.getElementById('inputFreeLocation').value.trim();
  saveUserPreferences({
    modelFree: chosenFreeModel,
    colorFree: activePresetKey,
    timeMode: chosenTimeMode,
    freeLocation: locationQuery
  });

  clearSameDirTraffic();
  activePath = [];
  routeCheckpointState.totalKm = 0;
  routeCheckpointState.milestones = [];
  document.getElementById('lineBadgeDisplay').textContent = 'Modo Livre';

  currentSpeedKmh = CRUISE_TARGET_KMH;
  freeCruiseEngaged = true;
  isAutopilotMoving = false;
  holdBoostActive = false;
  isLineFinished = false;
  playerYieldTimer = 0;
  distanceCoveredKm = 0;
  cruiseSpeedKmh = CRUISE_TARGET_KMH;
  boostSpeedKmh = FREE_MAX_SPEED_KMH;
  speedMultiplier = 1.0;
  updatePaceButtonUI();
  isTripActive = true;
  vehicleHeading = 0;
  smoothHeading = 0;
  targetHeading = 0;
  freeSteerRate = 0;
  freeTapImpulseRate = 0;
  wheelAngleDeg = 0;
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

  startSimulation(targetCoords, targetCoords, chosenTimeMode === 'night');
  showAlert(chosenTimeMode === 'night' ? '🌙 Modo Livre • Cruzeiro 80 km/h' : '🗺️ Modo Livre • Cruzeiro 80 km/h');
});

function startSimulation(baseCoords, initialRenderCoords, startAtNight = false) {
  setupModal.style.display = 'none';

  mobileTopBar.style.display = 'flex';
  bottomCockpitBar.style.display = 'flex';
  speedBox.style.display = 'flex';
  setCabinView(false);

  if (currentGameMode === 'free') {
    btnTripToggle.style.display = 'none';
    sideMinimapBox.style.display = 'none';
  } else {
    btnTripToggle.style.display = 'block';
    sideMinimapBox.style.display = 'flex';
    drawSideMinimap(null, []);
  }

  busLng = baseCoords[0];
  busLat = baseCoords[1];

  const startRender = initialRenderCoords || baseCoords;
  initMap(startRender);
  applyDayNightTheme(startAtNight, true);
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
  applyDayNightTheme(false, true);
  currentGameMode = 'line';
  syncModeBodyClass();
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
  freeCruiseEngaged = false;
  isAutopilotMoving = false;
  holdBoostActive = false;
  isTripActive = false;
  playerYieldTimer = 0;
  vehicleHeading = 0;
  freeSteerRate = 0;
  freeTapImpulseRate = 0;
  wheelAngleDeg = 0;
  distanceCoveredKm = 0;
  speedMultiplier = 1.0;
  updatePaceButtonUI();
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
  sideMinimapBox.style.display = 'none';
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
  holdBoostActive = false;
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
        <span>Linha / Veículo: <strong>${nomeLinha}</strong></span>
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

  const initialBearing = currentGameMode === 'line' ? targetHeading : vehicleHeading;

  map = new maplibregl.Map({
    container: 'map',
    antialias: false,
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
  const prefixForMarker = currentGameMode === 'line' ? playerBusPrefix : '';
  const busWrapEl = createBusMarkerElement(
    preset.bodyColor,
    preset.stripeColor,
    currentVehicleType,
    activeLetreiroText,
    prefixForMarker,
    '1'
  );

  busMarker = new maplibregl.Marker({
    element: busWrapEl,
    anchor: 'center',
    offset: [0, -28],
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
// CARROS AUXILIARES + SENTIDO CONTRÁRIO (QUANDO PERMITIDO)
// ============================================================

const SUPPORT_CAR_COLORS = [
  { bodyColor: '#1d5fa7', stripeColor: '#e2e8f0' },
  { bodyColor: '#ea580c', stripeColor: '#ffff00' },
  { bodyColor: '#16a34a', stripeColor: '#ffffff' },
  { bodyColor: '#e2e8f0', stripeColor: '#334155' }
];

const AUX_SPAWN_INTERVAL_KM = 2.5;

const sameDirTraffic = {
  vehicles: [],
  oncomingVehicles: [],
  oncomingAllowed: false,
  nextOncomingKm: 1.5,
  usedPrefixes: new Set(),
  totalRouteKm: 0,
  isRoadLine: false,
  spawnIntervalKm: AUX_SPAWN_INTERVAL_KM,
  nextSpawnKm: AUX_SPAWN_INTERVAL_KM,
  spawnedCount: 0,
  heldSpawnPending: false,
  postGoalWaveSpawned: false,
  lastToastMessage: '',
  lastCloseAlertTime: 0,
  lastOncomingAlertTime: 0
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

function configureTrafficThresholdsForRoute(pathCoords, isRoad = false, mainPrefix = '38185') {
  const totalKm = computeRouteTotalKm(pathCoords);
  sameDirTraffic.totalRouteKm = totalKm;
  sameDirTraffic.isRoadLine = Boolean(isRoad);
  // Sentido contrário permitido em linhas rodoviárias ou trajetos extensos (>= 4 km)
  sameDirTraffic.oncomingAllowed = Boolean(isRoad) || totalKm >= 4.0;
  sameDirTraffic.nextOncomingKm = 1.5;
  sameDirTraffic.spawnIntervalKm = AUX_SPAWN_INTERVAL_KM;
  sameDirTraffic.nextSpawnKm = AUX_SPAWN_INTERVAL_KM;
  sameDirTraffic.spawnedCount = 0;
  sameDirTraffic.heldSpawnPending = false;
  sameDirTraffic.postGoalWaveSpawned = false;
  sameDirTraffic.lastToastMessage = '';
  sameDirTraffic.lastCloseAlertTime = 0;
  sameDirTraffic.lastOncomingAlertTime = 0;
  sameDirTraffic.usedPrefixes = new Set([sanitizeBusPrefix(mainPrefix, '38185')]);
}

function clearSameDirTraffic() {
  for (const v of sameDirTraffic.vehicles) {
    if (v.marker) {
      try { v.marker.remove(); } catch (e) {}
    }
  }
  for (const ov of sameDirTraffic.oncomingVehicles) {
    if (ov.marker) {
      try { ov.marker.remove(); } catch (e) {}
    }
  }
  sameDirTraffic.vehicles = [];
  sameDirTraffic.oncomingVehicles = [];
  sameDirTraffic.oncomingAllowed = false;
  sameDirTraffic.nextOncomingKm = 1.5;
  sameDirTraffic.usedPrefixes = new Set([sanitizeBusPrefix(playerBusPrefix, '38185')]);
  sameDirTraffic.spawnedCount = 0;
  sameDirTraffic.nextSpawnKm = AUX_SPAWN_INTERVAL_KM;
  sameDirTraffic.heldSpawnPending = false;
  sameDirTraffic.postGoalWaveSpawned = false;
  sameDirTraffic.lastToastMessage = '';
  sameDirTraffic.lastCloseAlertTime = 0;
  sameDirTraffic.lastOncomingAlertTime = 0;
  hideRearIndicator();
  drawSideMinimap(null, []);
}

function isStartPointClearForSpawn() {
  const maxConcurrent = sameDirTraffic.isRoadLine ? 3 : 4;
  const activeCount = sameDirTraffic.vehicles.filter(v => !v.finished).length;
  if (activeCount >= maxConcurrent) return false;

  const startCoord = activePath[0];
  if (getMetersBetween([busLng, busLat], startCoord) < 75) {
    return false;
  }

  for (const v of sameDirTraffic.vehicles) {
    if (v.finished) continue;
    const vMeters = getRouteProgressMeters(v.segIndex, v.segProgress);
    if (vMeters < 80) {
      return false;
    }
  }
  return true;
}

function spawnSupportCarFromStart(seqNumber) {
  if (!map || !Array.isArray(activePath) || activePath.length < 2) return null;

  const p0 = activePath[0];
  const p1 = activePath[1];
  const initialHeading = calculateBearing(p0, p1);
  const segLen0 = getMetersBetween(p0, p1);

  const prefixCode = generateSupportPrefix(playerBusPrefix, sameDirTraffic.usedPrefixes);
  const palette = SUPPORT_CAR_COLORS[(seqNumber - 1) % SUPPORT_CAR_COLORS.length];
  const modelKey = sameDirTraffic.isRoadLine
    ? 'rodoviario'
    : (currentVehicleType === 'rodoviario' ? 'bhtrans' : currentVehicleType);

  const renderPos = applyRightLaneOffset(p0[0], p0[1], initialHeading, BASE_RIGHT_LANE_OFFSET_METERS);
  const wrapEl = createBusMarkerElement(
    palette.bodyColor,
    palette.stripeColor,
    modelKey,
    activeLetreiroText,
    prefixCode,
    '0.97'
  );

  const marker = new maplibregl.Marker({
    element: wrapEl,
    anchor: 'center',
    offset: [0, -28],
    rotationAlignment: 'map',
    pitchAlignment: 'map'
  })
    .setLngLat(renderPos)
    .setRotation(initialHeading)
    .addTo(map);

  const maxLineCap = sameDirTraffic.isRoadLine ? 165 : 130;
  const catchupSpeed = Math.min(maxLineCap, Math.max(102, CRUISE_TARGET_KMH + 30));

  return {
    id: seqNumber,
    prefix: prefixCode,
    lng: p0[0],
    lat: p0[1],
    segIndex: 0,
    segProgress: 0,
    segLength: segLen0,
    heading: initialHeading,
    speedKmh: catchupSpeed,
    currentLaneOffset: BASE_RIGHT_LANE_OFFSET_METERS,
    overtakeState: 'catching_up',
    yieldTimer: 0,
    finished: false,
    marker: marker
  };
}

function spawnOncomingCarIfAllowed() {
  if (!sameDirTraffic.oncomingAllowed || !map || !Array.isArray(activePath) || activePath.length < 4) return;
  if (sameDirTraffic.oncomingVehicles.length >= 1) return;

  const totalKm = sameDirTraffic.totalRouteKm || computeRouteTotalKm(activePath);
  const remainingKm = Math.max(0, totalKm - distanceCoveredKm);
  if (remainingKm < 0.8) return;

  if (distanceCoveredKm < sameDirTraffic.nextOncomingKm) return;

  // Posiciona o carro do sentido contrário à frente ao longo do trajeto, movendo-se em direção ao início
  const playerMeters = getRouteProgressMeters(currentSegIndex, segProgressMeters);
  const targetAheadMeters = Math.min((totalKm - 0.35) * 1000, playerMeters + 650);
  if (targetAheadMeters <= playerMeters + 220) return;

  let accum = 0;
  let startSeg = activePath.length - 2;
  let startProg = 0;
  for (let i = 0; i < activePath.length - 1; i++) {
    const segLen = getMetersBetween(activePath[i], activePath[i + 1]);
    if (accum + segLen >= targetAheadMeters) {
      startSeg = i;
      startProg = Math.max(0, targetAheadMeters - accum);
      break;
    }
    accum += segLen;
  }

  const pA = activePath[startSeg];
  const pB = activePath[startSeg + 1];
  const segLen = Math.max(0.1, getMetersBetween(pA, pB));
  const ratio = Math.min(1, startProg / segLen);
  const baseLng = pA[0] + (pB[0] - pA[0]) * ratio;
  const baseLat = pA[1] + (pB[1] - pA[1]) * ratio;

  // Sentido contrário ao sentido da rota (de pB para pA)
  const reverseHeading = calculateBearing(pB, pA);
  const prefixCode = generateSupportPrefix(playerBusPrefix, sameDirTraffic.usedPrefixes);
  const palette = SUPPORT_CAR_COLORS[(sameDirTraffic.spawnedCount + 1) % SUPPORT_CAR_COLORS.length];
  const modelKey = sameDirTraffic.isRoadLine ? 'rodoviario' : 'bhtrans';

  const oppPos = applyRightLaneOffset(baseLng, baseLat, reverseHeading, BASE_RIGHT_LANE_OFFSET_METERS);
  const wrapEl = createBusMarkerElement(
    palette.bodyColor,
    palette.stripeColor,
    modelKey,
    'SENTIDO OPOSTO',
    prefixCode,
    '0.97'
  );

  const marker = new maplibregl.Marker({
    element: wrapEl,
    anchor: 'center',
    offset: [0, -28],
    rotationAlignment: 'map',
    pitchAlignment: 'map'
  })
    .setLngLat(oppPos)
    .setRotation(reverseHeading)
    .addTo(map);

  sameDirTraffic.oncomingVehicles.push({
    id: `opp_${Date.now()}`,
    prefix: prefixCode,
    lng: baseLng,
    lat: baseLat,
    segIndex: startSeg,
    segProgress: startProg,
    segLength: segLen,
    heading: reverseHeading,
    speedKmh: sameDirTraffic.isRoadLine ? 78 : 64,
    finished: false,
    marker: marker
  });

  sameDirTraffic.nextOncomingKm += 3.5;
}

function updateOncomingTraffic(deltaTime, frameNow = performance.now()) {
  if (!sameDirTraffic.oncomingAllowed || !map) return;

  spawnOncomingCarIfAllowed();

  for (const ov of sameDirTraffic.oncomingVehicles) {
    if (ov.finished || !ov.marker) continue;

    const speedMps = (ov.speedKmh / 3.6) * speedMultiplier;
    let remDist = speedMps * deltaTime;

    while (remDist > 0 && ov.segIndex >= 0) {
      const p1 = activePath[ov.segIndex];
      const p2 = activePath[ov.segIndex + 1];
      if (!p1 || !p2) {
        ov.finished = true;
        break;
      }

      if (ov.segLength <= 0) {
        ov.segLength = getMetersBetween(p1, p2);
      }

      if (ov.segLength <= 0.1) {
        ov.segIndex--;
        ov.segProgress = ov.segIndex >= 0 ? getMetersBetween(activePath[ov.segIndex], activePath[ov.segIndex + 1]) : 0;
        continue;
      }

      if (remDist <= ov.segProgress) {
        ov.segProgress -= remDist;
        remDist = 0;
        const ratio = ov.segProgress / ov.segLength;
        ov.lng = p1[0] + (p2[0] - p1[0]) * ratio;
        ov.lat = p1[1] + (p2[1] - p1[1]) * ratio;
        ov.heading = calculateBearing(p2, p1);
      } else {
        remDist -= ov.segProgress;
        ov.segIndex--;
        if (ov.segIndex < 0) {
          ov.finished = true;
          break;
        }
        const prevP1 = activePath[ov.segIndex];
        const prevP2 = activePath[ov.segIndex + 1];
        ov.segLength = getMetersBetween(prevP1, prevP2);
        ov.segProgress = ov.segLength;
        ov.lng = prevP2[0];
        ov.lat = prevP2[1];
        ov.heading = calculateBearing(prevP2, prevP1);
      }
    }

    const distToPlayer = getMetersBetween([ov.lng, ov.lat], [busLng, busLat]);
    if (distToPlayer <= 160 && (frameNow - sameDirTraffic.lastOncomingAlertTime > 8000)) {
      sameDirTraffic.lastOncomingAlertTime = frameNow;
      showAlert(`↔️ Carro ${ov.prefix} no sentido contrário (${Math.round(distToPlayer)} m)`);
    }

    if (ov.finished || distToPlayer > 1400) {
      try { ov.marker.remove(); } catch (e) {}
      ov.marker = null;
      ov.finished = true;
      continue;
    }

    const oppRenderPos = applyRightLaneOffset(ov.lng, ov.lat, ov.heading, BASE_RIGHT_LANE_OFFSET_METERS);
    ov.marker.setLngLat(oppRenderPos);
    ov.marker.setRotation(ov.heading);
  }

  sameDirTraffic.oncomingVehicles = sameDirTraffic.oncomingVehicles.filter(ov => !ov.finished && ov.marker);
}

function spawnPostGoalWaveFromStart() {
  if (sameDirTraffic.postGoalWaveSpawned || !Array.isArray(activePath) || activePath.length < 2) return;
  sameDirTraffic.postGoalWaveSpawned = true;
  sameDirTraffic.spawnedCount++;
  const car = spawnSupportCarFromStart(sameDirTraffic.spawnedCount);
  if (car) {
    sameDirTraffic.vehicles.push(car);
  }
}

function maybeSpawnSameDirTraffic() {
  if (currentGameMode !== 'line') return;
  if (!Array.isArray(activePath) || activePath.length < 2) return;

  if (isLineFinished) {
    spawnPostGoalWaveFromStart();
    return;
  }

  const totalKm = sameDirTraffic.totalRouteKm || computeRouteTotalKm(activePath);
  const remainingKm = Math.max(0, totalKm - distanceCoveredKm);
  if (remainingKm < 0.35) return;

  if (distanceCoveredKm >= sameDirTraffic.nextSpawnKm) {
    sameDirTraffic.heldSpawnPending = true;
  }

  if (sameDirTraffic.heldSpawnPending) {
    if (!isStartPointClearForSpawn()) {
      return;
    }

    sameDirTraffic.spawnedCount++;
    const newVeh = spawnSupportCarFromStart(sameDirTraffic.spawnedCount);
    if (newVeh) {
      sameDirTraffic.vehicles.push(newVeh);
      sameDirTraffic.heldSpawnPending = false;
      sameDirTraffic.nextSpawnKm += sameDirTraffic.spawnIntervalKm;

      const msg = `🚌 Carro ${newVeh.prefix} saiu do ponto inicial na linha`;
      if (sameDirTraffic.lastToastMessage !== msg) {
        sameDirTraffic.lastToastMessage = msg;
        showAlert(msg);
      }
    }
  }
}

function updateRearDirectionalIndicator(trailingCandidates) {
  if (!rearIndicatorEl) return;
  if (currentGameMode !== 'line' || isLineFinished || !Array.isArray(trailingCandidates) || trailingCandidates.length === 0) {
    hideRearIndicator();
    return;
  }

  const visibleItems = trailingCandidates
    .filter(item => item.distMeters <= 1500)
    .sort((a, b) => a.distMeters - b.distMeters)
    .slice(0, 2);

  if (visibleItems.length === 0) {
    hideRearIndicator();
    return;
  }

  rearIndicatorEl.style.display = 'flex';
  rearIndicatorEl.innerHTML = visibleItems.map(item => {
    const isClose = item.distMeters <= 95;
    const distText = item.distMeters >= 1000
      ? `${(item.distMeters / 1000).toFixed(2)} km`
      : `${Math.round(item.distMeters)} m`;
    return `
      <div class="rear-indicator-pill ${isClose ? 'close' : ''}">
        <span class="rear-arrow-badge">${item.arrow}</span>
        <span>Carro ${item.prefix} ${item.tag}</span>
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
  const radarRadiusMeters = sameDirTraffic.isRoadLine ? 950 : 600;
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
  const startIdx = Math.max(0, currentSegIndex - 30);
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

  for (const ov of sameDirTraffic.oncomingVehicles) {
    if (ov.finished) continue;
    const [ox, oy] = toRadarXY(ov.lng, ov.lat);
    ctx.fillStyle = '#f87171';
    ctx.beginPath();
    ctx.arc(Math.max(8, Math.min(w - 8, ox)), Math.max(8, Math.min(h - 8, oy)), 4.2, 0, Math.PI * 2);
    ctx.fill();
  }

  const activeList = sameDirTraffic.vehicles.filter(v => !v.finished);
  if (activeList.length === 0) {
    const faltaKm = Math.max(0, sameDirTraffic.nextSpawnKm - distanceCoveredKm);
    badgeEl.textContent = playerBusPrefix;
    infoEl.textContent = faltaKm > 0 ? `Saída em ${faltaKm.toFixed(1)} km` : 'Aguardando';
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

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(clampedX, clampedY, isNext ? 5.5 : 3.8, 0, Math.PI * 2);
    ctx.fill();
  }

  if (nextVehicleItem) {
    const distStr = nextVehicleItem.distMeters >= 1000
      ? `${(nextVehicleItem.distMeters / 1000).toFixed(2)} km`
      : `${Math.round(nextVehicleItem.distMeters)} m`;
    badgeEl.textContent = nextVehicleItem.prefix;
    infoEl.textContent = `${distStr} • ${Math.round(nextVehicleItem.speedKmh || 0)}km/h`;
  } else if (trailingCandidates && trailingCandidates.length > 0) {
    const nearest = trailingCandidates[0];
    const distStr = nearest.distMeters >= 1000
      ? `${(nearest.distMeters / 1000).toFixed(2)} km`
      : `${Math.round(nearest.distMeters)} m`;
    badgeEl.textContent = nearest.prefix;
    infoEl.textContent = `Atrás: ${distStr}`;
  }
}

function updateSameDirTraffic(deltaTime, frameNow = performance.now()) {
  if (currentGameMode !== 'line' || !map) {
    hideRearIndicator();
    return;
  }

  maybeSpawnSameDirTraffic();
  updateOncomingTraffic(deltaTime, frameNow);

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

    if (!nextVehicleSummary || directDistMeters < nextVehicleSummary.distMeters) {
      nextVehicleSummary = {
        id: v.id,
        prefix: v.prefix,
        distMeters: directDistMeters,
        speedKmh: v.speedKmh
      };
    }

    if (deltaAlongRouteMeters > 4) {
      trailingCandidates.push({
        prefix: v.prefix,
        tag: deltaAlongRouteMeters < 110 ? 'ultrapassando' : 'alcançando',
        distMeters: directDistMeters,
        arrow: getRelativeBearingArrow([busLng, busLat], [v.lng, v.lat], targetHeading)
      });

      if (directDistMeters <= 95 && (frameNow - sameDirTraffic.lastCloseAlertTime > 9000)) {
        sameDirTraffic.lastCloseAlertTime = frameNow;
        showAlert(`⬅️ Carro ${v.prefix} ultrapassando • Reduzindo velocidade`);
      }
    }

    // Avança o carro auxiliar continuamente ao longo do trajeto
    const activeRefSpeed = currentSpeedKmh > 5
      ? currentSpeedKmh
      : (sameDirTraffic.isRoadLine ? 78 : 66);
    const maxTrafficSpeed = sameDirTraffic.isRoadLine ? 160 : 128;

    let desiredLaneOffset = BASE_RIGHT_LANE_OFFSET_METERS;
    let targetSpeedKmh = activeRefSpeed;

    // Só desvia para ultrapassar quando alcança o jogador e ainda não concluiu a passagem
    if (deltaAlongRouteMeters > -28 && deltaAlongRouteMeters < 55 && v.overtakeState !== 'done_passing') {
      desiredLaneOffset = -1.5;
      targetSpeedKmh = Math.min(maxTrafficSpeed, Math.max(92, activeRefSpeed + 22));
      if (deltaAlongRouteMeters < -22) {
        v.overtakeState = 'done_passing';
      }
    } else {
      desiredLaneOffset = BASE_RIGHT_LANE_OFFSET_METERS;
      if (deltaAlongRouteMeters > 70) {
        targetSpeedKmh = Math.min(maxTrafficSpeed, Math.max(98, activeRefSpeed + 26));
      } else if (deltaAlongRouteMeters > 0 && deltaAlongRouteMeters < 28) {
        targetSpeedKmh = Math.max(30, activeRefSpeed - 15);
      } else {
        targetSpeedKmh = activeRefSpeed;
      }
    }

    if (v.speedKmh < targetSpeedKmh) {
      v.speedKmh = Math.min(targetSpeedKmh, v.speedKmh + 40 * deltaTime);
    } else if (v.speedKmh > targetSpeedKmh) {
      v.speedKmh = Math.max(targetSpeedKmh, v.speedKmh - 36 * deltaTime);
    }

    v.currentLaneOffset += (desiredLaneOffset - v.currentLaneOffset) * Math.min(1, 7.0 * deltaTime);

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
        v.heading = calculateBearing(p1, p2);
      } else {
        remDist -= leftInSeg;
        v.segIndex++;
        v.segProgress = 0;
        if (v.segIndex >= activePath.length - 1) {
          v.lng = activePath[activePath.length - 1][0];
          v.lat = activePath[activePath.length - 1][1];
          v.finished = true;
          break;
        } else {
          const nextP1 = activePath[v.segIndex];
          const nextP2 = activePath[v.segIndex + 1];
          v.segLength = getMetersBetween(nextP1, nextP2);
          v.lng = nextP1[0];
          v.lat = nextP1[1];
          v.heading = calculateBearing(nextP1, nextP2);
        }
      }
    }

    if (v.finished) {
      try { v.marker.remove(); } catch (e) {}
      v.marker = null;
      continue;
    }

    const pos = applyRightLaneOffset(v.lng, v.lat, v.heading, v.currentLaneOffset);
    v.marker.setLngLat(pos);
    v.marker.setRotation(v.heading);
  }

  sameDirTraffic.vehicles = sameDirTraffic.vehicles.filter(v => !v.finished && v.marker);
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
  let desiredSpeed = 0;

  if (keysPressed.Up) {
    if (!isTripActive && currentGameMode === 'line') {
      isTripActive = true;
      startTripTimer();
    }
    mapBanner.style.display = 'none';
    isAutopilotMoving = true;
    holdBoostActive = true;
    if (currentGameMode === 'free') freeCruiseEngaged = true;
    updateTripStatus();
  } else {
    holdBoostActive = false;
  }

  let renderLng = busLng;
  let renderLat = busLat;
  let busWorldHeading = vehicleHeading;

  if (currentGameMode === 'line') {
    if (playerYieldTimer > 0) {
      playerYieldTimer = Math.max(0, playerYieldTimer - deltaTime);
    }

    if (isTripActive && isAutopilotMoving && !isLineFinished) {
      if (keysPressed.Down) {
        desiredSpeed = 0;
        currentSpeedKmh = Math.max(currentSpeedKmh - 65 * deltaTime, 0);
        if (currentSpeedKmh <= 2) {
          isAutopilotMoving = false;
        }
      } else if (playerYieldTimer > 0) {
        desiredSpeed = Math.max(38, CRUISE_TARGET_KMH - 28);
      } else if (holdBoostActive) {
        const boostedTarget = Math.min(boostSpeedKmh, Math.max(CRUISE_TARGET_KMH, currentSpeedKmh + 28 * deltaTime));
        desiredSpeed = boostedTarget;
      } else {
        desiredSpeed = CRUISE_TARGET_KMH;
      }

      const playerRouteMeters = getRouteProgressMeters(currentSegIndex, segProgressMeters);
      const playerLaneOffset = BASE_RIGHT_LANE_OFFSET_METERS + lineLateralCorrectionMeters;
      for (const v of sameDirTraffic.vehicles) {
        if (v.finished) continue;
        const vRouteMeters = getRouteProgressMeters(v.segIndex, v.segProgress);
        const gapAhead = vRouteMeters - playerRouteMeters;
        const sameLane = Math.abs(playerLaneOffset - v.currentLaneOffset) < 1.45;
        if (gapAhead > 0 && gapAhead < 24 && sameLane) {
          desiredSpeed = Math.min(desiredSpeed, Math.max(25, v.speedKmh - 6));
        }
      }
    }

    if (currentSpeedKmh < desiredSpeed) {
      currentSpeedKmh = Math.min(currentSpeedKmh + 48 * deltaTime, desiredSpeed);
    } else if (currentSpeedKmh > desiredSpeed) {
      currentSpeedKmh = Math.max(currentSpeedKmh - 38 * deltaTime, desiredSpeed);
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
      const maxLateralSpeed = 1.8 * speedFactor;
      let targetLateralVel = 0;

      if (keysPressed.Left) {
        targetLateralVel = -maxLateralSpeed;
      } else if (keysPressed.Right) {
        targetLateralVel = maxLateralSpeed;
      }

      lineLateralVelocity += (targetLateralVel - lineLateralVelocity) * Math.min(1, 9.0 * deltaTime);
      lineLateralCorrectionMeters = Math.max(
        -MAX_LINE_LATERAL_ADJUST_METERS,
        Math.min(MAX_LINE_LATERAL_ADJUST_METERS, lineLateralCorrectionMeters + lineLateralVelocity * deltaTime)
      );

      if (!keysPressed.Left && !keysPressed.Right) {
        lineLateralCorrectionMeters += (0 - lineLateralCorrectionMeters) * Math.min(1, 4.5 * deltaTime);
      }

      const targetYawOffset = (lineLateralVelocity / Math.max(0.5, maxLateralSpeed)) * 10;
      busVisualYawOffset += (targetYawOffset - busVisualYawOffset) * Math.min(1, 10.0 * deltaTime);
    } else {
      lineLateralVelocity = 0;
      busVisualYawOffset += (0 - busVisualYawOffset) * Math.min(1, 9.0 * deltaTime);
    }

    smoothHeading = lerpHeading(smoothHeading, targetHeading, 14.0 * deltaTime);

    const totalRightOffset = BASE_RIGHT_LANE_OFFSET_METERS + lineLateralCorrectionMeters;
    const lanePos = applyRightLaneOffset(busLng, busLat, targetHeading, totalRightOffset);
    renderLng = lanePos[0];
    renderLat = lanePos[1];
    busWorldHeading = (targetHeading + busVisualYawOffset + 360) % 360;
  } else {
    if (keysPressed.Up) {
      freeCruiseEngaged = true;
      if (currentSpeedKmh < 0) {
        currentSpeedKmh = Math.min(currentSpeedKmh + 85 * deltaTime, CRUISE_TARGET_KMH);
      } else if (currentSpeedKmh < CRUISE_TARGET_KMH) {
        currentSpeedKmh = Math.min(CRUISE_TARGET_KMH, currentSpeedKmh + 65 * deltaTime);
      } else {
        currentSpeedKmh = Math.min(FREE_MAX_SPEED_KMH, currentSpeedKmh + 34 * deltaTime);
      }
    } else if (keysPressed.Down) {
      freeCruiseEngaged = false;
      if (currentSpeedKmh > 0) {
        currentSpeedKmh = Math.max(currentSpeedKmh - 85 * deltaTime, 0);
      } else {
        currentSpeedKmh = Math.max(currentSpeedKmh - 32 * deltaTime, MAX_REVERSE_SPEED_KMH);
      }
    } else if (freeCruiseEngaged) {
      if (currentSpeedKmh < CRUISE_TARGET_KMH) {
        currentSpeedKmh = Math.min(CRUISE_TARGET_KMH, currentSpeedKmh + 48 * deltaTime);
      } else if (currentSpeedKmh > CRUISE_TARGET_KMH) {
        currentSpeedKmh = Math.max(CRUISE_TARGET_KMH, currentSpeedKmh - 34 * deltaTime);
      }
    } else {
      if (currentSpeedKmh > 0) {
        currentSpeedKmh = Math.max(currentSpeedKmh - 26 * deltaTime, 0);
      } else if (currentSpeedKmh < 0) {
        currentSpeedKmh = Math.min(currentSpeedKmh + 26 * deltaTime, 0);
      }
    }

    const absSpeed = Math.abs(currentSpeedKmh);
    const steerHold = (keysPressed.Right ? 1 : 0) - (keysPressed.Left ? 1 : 0);

    freeTapImpulseRate *= Math.pow(0.08, deltaTime);
    if (Math.abs(freeTapImpulseRate) < 1) freeTapImpulseRate = 0;

    const jitterWave = (Math.sin(now * 0.011) * 3.2 + Math.cos(now * 0.021) * 1.8);
    const rawTargetRate = steerHold * 74 + freeTapImpulseRate + (absSpeed > 2 ? jitterWave : 0);
    freeSteerRate += (rawTargetRate - freeSteerRate) * Math.min(1, 9.5 * deltaTime);

    const targetWheelDeg = Math.max(-125, Math.min(125, freeSteerRate * 1.05));
    wheelAngleDeg += (targetWheelDeg - wheelAngleDeg) * Math.min(1, 12.0 * deltaTime);
    const wheelImg = document.getElementById('freeSteeringWheelImg');
    if (wheelImg) {
      wheelImg.style.transform = `rotate(${wheelAngleDeg.toFixed(1)}deg)`;
    }

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
    busWorldHeading = (vehicleHeading + freeSteerRate * 0.08 + 360) % 360;
  }

  const distStep = getMetersBetween(prev, [busLng, busLat]) / 1000;
  if (!isNaN(distStep)) {
    distanceCoveredKm += distStep;
  }

  checkRouteProgressAlerts();

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

  const rawTargetBearing = currentGameMode === 'line' ? targetHeading : vehicleHeading;
  currentCameraBearing = lerpHeading(currentCameraBearing, rawTargetBearing, 10.0 * deltaTime);

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
    if (!keysPressed.Up) {
      handleAccelerate();
      if (currentGameMode === 'free') freeCruiseEngaged = true;
    }
    keysPressed.Up = true;
    document.getElementById('btnDpadUp')?.classList.add('pressed');
    document.getElementById('btnFreeAccel')?.classList.add('pressed');
  }
  if (['ArrowDown', 'KeyS'].includes(e.code)) {
    keysPressed.Down = true;
    document.getElementById('btnDpadDown')?.classList.add('pressed');
    document.getElementById('btnFreeBrake')?.classList.add('pressed');
  }
  if (['ArrowLeft', 'KeyA'].includes(e.code)) {
    if (!keysPressed.Left) triggerFreeTapSteer(-1);
    keysPressed.Left = true;
    document.getElementById('btnDpadLeft')?.classList.add('pressed');
  }
  if (['ArrowRight', 'KeyD'].includes(e.code)) {
    if (!keysPressed.Right) triggerFreeTapSteer(1);
    keysPressed.Right = true;
    document.getElementById('btnDpadRight')?.classList.add('pressed');
  }
});

window.addEventListener('keyup', (e) => {
  if (['ArrowUp', 'KeyW'].includes(e.code)) {
    keysPressed.Up = false;
    document.getElementById('btnDpadUp')?.classList.remove('pressed');
    document.getElementById('btnFreeAccel')?.classList.remove('pressed');
  }
  if (['ArrowDown', 'KeyS'].includes(e.code)) {
    keysPressed.Down = false;
    document.getElementById('btnDpadDown')?.classList.remove('pressed');
    document.getElementById('btnFreeBrake')?.classList.remove('pressed');
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
