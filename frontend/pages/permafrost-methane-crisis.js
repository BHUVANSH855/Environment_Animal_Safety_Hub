/* =================================================================
   Permafrost Thaw & The Methane Time Bomb — Interactive Modules
   Issue #3128
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initPermafrostMap();
  initMethaneSimulator();
  initFeedbackLoopAnimation();
  initScrollAnimations();
});

/* ──────────────────────────────────────────────
   1. Interactive Permafrost Map
   ────────────────────────────────────────────── */

const MAP_CONFIG = {
  startYear: 2025,
  endYear: 2075,
  scenarios: {
    low: { label: 'Low Warming (+1.5 °C)', retreatRate: 0.4 },
    moderate: { label: 'Moderate Warming (+2.5 °C)', retreatRate: 0.7 },
    high: { label: 'High Warming (+4.0 °C)', retreatRate: 1.0 },
  },
  regions: [
    { name: 'Siberia', cx: 0.62, cy: 0.28, baseRadius: 38, color: '#5dade2' },
    { name: 'Alaska', cx: 0.15, cy: 0.32, baseRadius: 22, color: '#48c9b0' },
    { name: 'Canada', cx: 0.30, cy: 0.25, baseRadius: 30, color: '#7fb3d8' },
  ],
};

let mapState = {
  year: 2025,
  scenario: 'moderate',
  playing: false,
  animFrame: null,
};

function initPermafrostMap() {
  const canvas = document.getElementById('permafrost-map-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    drawMap(ctx, canvas);
  }

  window.addEventListener('resize', resize);
  resize();

  // Controls
  const slider = document.getElementById('year-slider');
  const yearLabel = document.getElementById('year-label');
  const scenarioSelect = document.getElementById('scenario-select');
  const playBtn = document.getElementById('play-btn');

  if (slider) {
    slider.addEventListener('input', (e) => {
      mapState.year = parseInt(e.target.value, 10);
      yearLabel.textContent = mapState.year;
      drawMap(ctx, canvas);
      updateMapInfo();
    });
  }

  if (scenarioSelect) {
    scenarioSelect.addEventListener('change', (e) => {
      mapState.scenario = e.target.value;
      drawMap(ctx, canvas);
      updateMapInfo();
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (mapState.playing) {
        mapState.playing = false;
        playBtn.textContent = '▶ Play';
        cancelAnimationFrame(mapState.animFrame);
      } else {
        if (mapState.year >= MAP_CONFIG.endYear) mapState.year = MAP_CONFIG.startYear;
        mapState.playing = true;
        playBtn.textContent = '⏸ Pause';
        animateMap(ctx, canvas, slider, yearLabel);
      }
    });
  }

  updateMapInfo();
}

function animateMap(ctx, canvas, slider, yearLabel) {
  if (!mapState.playing) return;
  mapState.year += 1;
  if (mapState.year > MAP_CONFIG.endYear) {
    mapState.playing = false;
    document.getElementById('play-btn').textContent = '▶ Play';
    return;
  }
  slider.value = mapState.year;
  yearLabel.textContent = mapState.year;
  drawMap(ctx, canvas);
  updateMapInfo();
  mapState.animFrame = setTimeout(() => animateMap(ctx, canvas, slider, yearLabel), 200);
}

function drawMap(ctx, canvas) {
  const w = canvas.width / window.devicePixelRatio;
  const h = canvas.height / window.devicePixelRatio;
  ctx.clearRect(0, 0, w, h);

  // Background — dark ocean
  ctx.fillStyle = '#0a1628';
  ctx.fillRect(0, 0, w, h);

  // Grid lines
  ctx.strokeStyle = 'rgba(170, 212, 245, 0.06)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < w; i += 40) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
  }
  for (let j = 0; j < h; j += 40) {
    ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke();
  }

  // Arctic circle line
  const arcticY = h * 0.38;
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = 'rgba(170, 212, 245, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, arcticY);
  ctx.lineTo(w, arcticY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(170, 212, 245, 0.35)';
  ctx.font = '11px Segoe UI';
  ctx.fillText('Arctic Circle 66.5°N', 10, arcticY - 6);

  // Permafrost zones
  const elapsed = mapState.year - MAP_CONFIG.startYear;
  const rate = MAP_CONFIG.scenarios[mapState.scenario].retreatRate;
  const retreat = elapsed * rate;

  // Draw permafrost ground (shrinks from top)
  const permafrostTop = Math.min(h * 0.12 + retreat * 1.8, h * 0.8);
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(170, 212, 245, 0.03)');
  grad.addColorStop(permafrostTop / h, 'rgba(93, 173, 226, 0.15)');
  grad.addColorStop(1, 'rgba(93, 173, 226, 0.02)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Continuous permafrost zone
  const contTop = Math.min(h * 0.05 + retreat * 0.6, h * 0.5);
  ctx.fillStyle = 'rgba(93, 173, 226, 0.22)';
  ctx.fillRect(0, 0, w, contTop);

  // Discontinuous permafrost zone
  const discontTop = Math.min(contTop + h * 0.12 + retreat * 0.8, h * 0.7);
  ctx.fillStyle = 'rgba(93, 173, 226, 0.10)';
  ctx.fillRect(0, contTop, w, discontTop - contTop);

  // Thawed zone label
  if (retreat > 5) {
    ctx.fillStyle = 'rgba(255, 140, 0, 0.15)';
    ctx.fillRect(0, 0, w, contTop * 0.6);
    ctx.fillStyle = 'rgba(255, 140, 0, 0.6)';
    ctx.font = 'bold 12px Segoe UI';
    ctx.fillText('THAWED ZONE', w * 0.42, contTop * 0.3);
  }

  // Region bubbles with methane emission indicators
  MAP_CONFIG.regions.forEach((region) => {
    const x = region.cx * w;
    const y = region.cy * h;
    const thawFactor = 1 + retreat * 0.015;
    const r = region.baseRadius * thawFactor;

    // Glow
    const glowGrad = ctx.createRadialGradient(x, y, r * 0.3, x, y, r * 1.5);
    glowGrad.addColorStop(0, 'rgba(255, 140, 0, 0.25)');
    glowGrad.addColorStop(1, 'rgba(255, 140, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(x, y, r * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Circle
    ctx.fillStyle = region.color + '33';
    ctx.strokeStyle = region.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 13px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText(region.name, x, y - r - 8);

    // Methane emission value
    const methane = (retreat * (region.baseRadius / 25) * 0.8).toFixed(1);
    ctx.fillStyle = var_methane_color(methane);
    ctx.font = '11px Segoe UI';
    ctx.fillText(`CH₄: +${methane} Tg`, x, y + 5);
    ctx.textAlign = 'start';
  });

  // Year display on canvas
  ctx.fillStyle = 'rgba(255, 140, 0, 0.9)';
  ctx.font = 'bold 28px Segoe UI';
  ctx.textAlign = 'right';
  ctx.fillText(mapState.year, w - 18, 38);
  ctx.textAlign = 'start';
}

function var_methane_color(val) {
  if (val < 5) return '#ffc107';
  if (val < 15) return '#ff8c00';
  return '#e53935';
}

function updateMapInfo() {
  const info = document.getElementById('map-info-text');
  if (!info) return;
  const elapsed = mapState.year - MAP_CONFIG.startYear;
  const rate = MAP_CONFIG.scenarios[mapState.scenario].retreatRate;
  const retreatKm = (elapsed * rate * 12).toFixed(0);
  const carbonReleased = (elapsed * rate * 3.2).toFixed(1);
  info.innerHTML = `Permafrost line retreated <strong>~${retreatKm} km</strong> northward.<br>Est. carbon released: <strong>${carbonReleased} Gt</strong>`;
}

/* ──────────────────────────────────────────────
   2. Methane vs. CO₂ Simulator
   ────────────────────────────────────────────── */

let simChart = null;

function initMethaneSimulator() {
  const methaneSlider = document.getElementById('methane-release');
  const co2Slider = document.getElementById('co2-release');
  const timeframeSelect = document.getElementById('sim-timeframe');

  if (!methaneSlider || !co2Slider) return;

  const methaneVal = document.getElementById('methane-val');
  const co2Val = document.getElementById('co2-val');

  methaneSlider.addEventListener('input', () => {
    methaneVal.textContent = methaneSlider.value + ' Tg CH₄/yr';
    updateSimulation();
  });
  co2Slider.addEventListener('input', () => {
    co2Val.textContent = co2Slider.value + ' Gt CO₂/yr';
    updateSimulation();
  });
  if (timeframeSelect) {
    timeframeSelect.addEventListener('change', updateSimulation);
  }

  createSimChart();
  updateSimulation();
}

function createSimChart() {
  const canvas = document.getElementById('sim-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  simChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Methane (CH₄) Warming Effect',
          data: [],
          borderColor: '#ff8c00',
          backgroundColor: 'rgba(255, 140, 0, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 2,
        },
        {
          label: 'CO₂ Warming Effect',
          data: [],
          borderColor: '#5dade2',
          backgroundColor: 'rgba(93, 173, 226, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 2,
        },
        {
          label: 'Combined Forcing',
          data: [],
          borderColor: '#e53935',
          backgroundColor: 'rgba(229, 57, 53, 0.08)',
          borderDash: [6, 4],
          tension: 0.4,
          fill: false,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#9fb3c8', font: { size: 12 } },
        },
        tooltip: {
          backgroundColor: 'rgba(11, 29, 58, 0.9)',
          titleColor: '#e0e6ed',
          bodyColor: '#9fb3c8',
        },
      },
      scales: {
        x: {
          title: { display: true, text: 'Years', color: '#9fb3c8' },
          ticks: { color: '#9fb3c8' },
          grid: { color: 'rgba(170, 212, 245, 0.06)' },
        },
        y: {
          title: { display: true, text: 'Radiative Forcing (W/m²)', color: '#9fb3c8' },
          ticks: { color: '#9fb3c8' },
          grid: { color: 'rgba(170, 212, 245, 0.06)' },
        },
      },
    },
  });
}

function updateSimulation() {
  if (!simChart) return;

  const methaneRate = parseFloat(document.getElementById('methane-release').value);
  const co2Rate = parseFloat(document.getElementById('co2-release').value);
  const timeframeEl = document.getElementById('sim-timeframe');
  const years = timeframeEl ? parseInt(timeframeEl.value) : 100;

  const labels = [];
  const methaneData = [];
  const co2Data = [];
  const combinedData = [];

  // CH₄ half-life ≈ 12 years; CO₂ persists for centuries
  for (let y = 0; y <= years; y += (years <= 20 ? 1 : 5)) {
    labels.push('Year ' + y);

    // Simplified radiative forcing model
    // Methane: high initial forcing, decays
    const ch4Accumulated = methaneRate * 12 * (1 - Math.exp(-y / 12));
    const ch4Forcing = ch4Accumulated * 0.00037; // W/m² per Tg

    // CO₂: persistent, accumulates steadily (airborne fraction ~0.5)
    const co2Accumulated = co2Rate * y * 0.5;
    const co2Forcing = 5.35 * Math.log(1 + co2Accumulated / 880); // ln approximation

    methaneData.push(parseFloat(ch4Forcing.toFixed(3)));
    co2Data.push(parseFloat(co2Forcing.toFixed(3)));
    combinedData.push(parseFloat((ch4Forcing + co2Forcing).toFixed(3)));
  }

  simChart.data.labels = labels;
  simChart.data.datasets[0].data = methaneData;
  simChart.data.datasets[1].data = co2Data;
  simChart.data.datasets[2].data = combinedData;
  simChart.update();

  // Update insight
  updateSimInsight(methaneRate, co2Rate, years, methaneData, co2Data);
  // Update gas comparison cards
  updateGasCards(methaneRate);
}

function updateSimInsight(methaneRate, co2Rate, years, methaneData, co2Data) {
  const insight = document.getElementById('sim-insight-text');
  if (!insight) return;

  const peakCH4 = Math.max(...methaneData);
  const finalCO2 = co2Data[co2Data.length - 1];
  const ratio20yr = (methaneRate > 0) ? ((peakCH4 / (finalCO2 || 0.001)) * 100).toFixed(0) : 0;

  insight.innerHTML = `At <strong>${methaneRate} Tg CH₄/yr</strong>, methane creates a peak forcing of <strong>${peakCH4.toFixed(2)} W/m²</strong> within ~12 years, then stabilizes as it decays. Meanwhile, CO₂ at <strong>${co2Rate} Gt/yr</strong> accumulates relentlessly, reaching <strong>${finalCO2.toFixed(2)} W/m²</strong> by year ${years}. In the short term, methane is the dominant warming agent — this is why permafrost thaw is so dangerous.`;
}

function updateGasCards(methaneRate) {
  const gwp20 = document.getElementById('gwp-20yr');
  const gwp100 = document.getElementById('gwp-100yr');
  if (gwp20) gwp20.textContent = '×80';
  if (gwp100) gwp100.textContent = '×28';

  const equivEl = document.getElementById('co2-equivalent');
  if (equivEl) {
    const equiv = (methaneRate * 80 / 1000).toFixed(1);
    equivEl.textContent = equiv + ' Gt CO₂-eq (20yr)';
  }
}

/* ──────────────────────────────────────────────
   3. Feedback Loop Animation
   ────────────────────────────────────────────── */

function initFeedbackLoopAnimation() {
  const steps = document.querySelectorAll('.loop-step');
  if (!steps.length) return;

  let current = 0;
  setInterval(() => {
    steps.forEach((s) => s.style.borderColor = 'rgba(170, 212, 245, 0.15)');
    steps[current].style.borderColor = '#ff8c00';
    steps[current].style.boxShadow = '0 0 18px rgba(255, 140, 0, 0.3)';
    setTimeout(() => {
      steps[current].style.boxShadow = 'none';
    }, 800);
    current = (current + 1) % steps.length;
  }, 1200);
}

/* ──────────────────────────────────────────────
   4. Scroll-triggered Animations
   ────────────────────────────────────────────── */

function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.card, .impact-event, .story-card, .action-card, .gas-card').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}
