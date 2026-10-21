/**
 * Polar Coordinates Interactive Learning App
 * Author: Nareupanat Lekkoksung (with Antigravity pair programmer)
 */

// Global Application State
const state = {
  // Current active point
  x: 3.0,
  y: 3.0,
  r: 4.24,
  theta: Math.PI / 4, // always kept in radians internally

  // Units & View Modes
  unit: 'rad', // 'rad' | 'deg'
  gridMode: 'both', // 'cartesian' | 'polar' | 'both'
  maxCoord: 6.0, // axis domain [-6, 6]
  
  // Dragging interaction state
  isDragging: false,
  dragTarget: null, // 'main' | 'quiz'

  // Saved points collection
  savedPoints: [],
  palette: ['#c0392b', '#2980b9', '#27ae60', '#8e44ad', '#d35400', '#16a085'],

  // Challenge / Quiz state
  quiz: {
    type: 'plot', // 'plot' | 'identify'
    targetR: 3,
    targetTheta: Math.PI / 3,
    targetLabel: '(3, \\frac{\\pi}{3})',
    userX: 0,
    userY: 0,
    options: [],
    correctIndex: 0,
    score: 0,
    streak: 0,
    solved: false
  }
};

// Canvas references
let mainCanvas, mainCtx;
let quizCanvas, quizCtx;
let quizIdCanvas, quizIdCtx;

// MathJax debouncer
let typesetTimeout = null;
function triggerMathJax() {
  if (window.MathJax && window.MathJax.typesetPromise) {
    clearTimeout(typesetTimeout);
    typesetTimeout = setTimeout(() => {
      window.MathJax.typesetPromise().catch(err => console.log('MathJax error:', err));
    }, 40);
  }
}

// Format number to 2 decimal places cleanly
function fmt(num) {
  if (Math.abs(num) < 1e-9) return '0';
  const s = num.toFixed(2);
  return s.endsWith('.00') ? s.slice(0, -3) : s.replace(/\.?0+$/, '');
}

// Convert angle to formatted Pi fraction string for TeX
function formatAngleTeX(rad) {
  let normalized = rad % (2 * Math.PI);
  if (normalized < 0) normalized += 2 * Math.PI;

  const fractions = [
    { val: 0, tex: '0' },
    { val: Math.PI / 6, tex: '\\frac{\\pi}{6}' },
    { val: Math.PI / 4, tex: '\\frac{\\pi}{4}' },
    { val: Math.PI / 3, tex: '\\frac{\\pi}{3}' },
    { val: Math.PI / 2, tex: '\\frac{\\pi}{2}' },
    { val: (2 * Math.PI) / 3, tex: '\\frac{2\\pi}{3}' },
    { val: (3 * Math.PI) / 4, tex: '\\frac{3\\pi}{4}' },
    { val: (5 * Math.PI) / 6, tex: '\\frac{5\\pi}{6}' },
    { val: Math.PI, tex: '\\pi' },
    { val: (7 * Math.PI) / 6, tex: '\\frac{7\\pi}{6}' },
    { val: (5 * Math.PI) / 4, tex: '\\frac{5\\pi}{4}' },
    { val: (4 * Math.PI) / 3, tex: '\\frac{4\\pi}{3}' },
    { val: (3 * Math.PI) / 2, tex: '\\frac{3\\pi}{2}' },
    { val: (5 * Math.PI) / 3, tex: '\\frac{5\\pi}{3}' },
    { val: (7 * Math.PI) / 4, tex: '\\frac{7\\pi}{4}' },
    { val: (11 * Math.PI) / 6, tex: '\\frac{11\\pi}{6}' },
    { val: 2 * Math.PI, tex: '2\\pi' }
  ];

  for (const f of fractions) {
    if (Math.abs(normalized - f.val) < 0.02) {
      return f.tex;
    }
  }

  // Fallback to decimal radians
  return fmt(rad) + '\\text{ rad}';
}

// Parse angle expression entered by student (e.g. "pi/3", "2pi/3", "45", "1.57")
function parseAngleString(str, unit) {
  if (!str) return 0;
  let clean = str.trim().toLowerCase().replace(/\s+/g, '');
  if (unit === 'deg') {
    // If unit is degree, parse as degrees and convert to rad
    clean = clean.replace(/°/g, '');
    const deg = parseFloat(clean);
    return isNaN(deg) ? 0 : (deg * Math.PI) / 180;
  }

  // Radian mode
  clean = clean.replace(/π/g, 'pi');
  if (clean.includes('pi')) {
    clean = clean.replace(/([0-9.]+)pi/g, '$1*pi');
    clean = clean.replace(/pi/g, Math.PI.toString());
  }

  try {
    if (/^[0-9.+\-*/()]+$/.test(clean)) {
      const val = Function('"use strict"; return (' + clean + ')')();
      return isNaN(val) ? 0 : val;
    }
  } catch (e) {
    // ignore
  }

  const val = parseFloat(clean);
  return isNaN(val) ? 0 : val;
}

// Initialize application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  mainCanvas = document.getElementById('plotCanvas');
  mainCtx = mainCanvas.getContext('2d');

  quizCanvas = document.getElementById('quizCanvas');
  quizCtx = quizCanvas ? quizCanvas.getContext('2d') : null;

  quizIdCanvas = document.getElementById('quizIdentifyCanvas');
  quizIdCtx = quizIdCanvas ? quizIdCanvas.getContext('2d') : null;

  setupCanvasEvents(mainCanvas, 'main');
  if (quizCanvas) setupCanvasEvents(quizCanvas, 'quiz');

  // Initial synchronization
  syncFromCartesian();
  generateNewQuiz();
});

// Setup Mouse & Touch Events for Canvas
function setupCanvasEvents(canvas, target) {
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = (clientX - rect.left) * scaleX;
    const canvasY = (clientY - rect.top) * scaleY;

    // Convert canvas coords (pixels) to math coords ([-6, 6])
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radiusPixels = (canvas.width / 2) * 0.88;
    const scale = radiusPixels / state.maxCoord;

    const mathX = (canvasX - cx) / scale;
    const mathY = (cy - canvasY) / scale;

    return { mathX, mathY };
  }

  function onDown(e) {
    e.preventDefault();
    state.isDragging = true;
    state.dragTarget = target;
    const { mathX, mathY } = getPos(e);
    handlePointDrag(mathX, mathY, target);
  }

  function onMove(e) {
    if (!state.isDragging || state.dragTarget !== target) return;
    e.preventDefault();
    const { mathX, mathY } = getPos(e);
    handlePointDrag(mathX, mathY, target);
  }

  function onUp(e) {
    if (state.isDragging) {
      state.isDragging = false;
      state.dragTarget = null;
    }
  }

  canvas.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);

  canvas.addEventListener('touchstart', onDown, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onUp);
}

// Point Drag handler
function handlePointDrag(mathX, mathY, target) {
  // Clamp within bounds
  const dist = Math.hypot(mathX, mathY);
  if (dist > state.maxCoord) {
    mathX = (mathX / dist) * state.maxCoord;
    mathY = (mathY / dist) * state.maxCoord;
  }

  if (target === 'main') {
    state.x = Math.round(mathX * 20) / 20; // 0.05 step
    state.y = Math.round(mathY * 20) / 20;
    syncFromCartesian();
  } else if (target === 'quiz') {
    state.quiz.userX = Math.round(mathX * 20) / 20;
    state.quiz.userY = Math.round(mathY * 20) / 20;
    drawQuizPlot();
  }
}

// Sync Cartesian (x, y) to Polar (r, theta) and UI controls
function syncFromCartesian() {
  state.r = Math.hypot(state.x, state.y);
  state.theta = Math.atan2(state.y, state.x);
  if (state.theta < 0) state.theta += 2 * Math.PI;

  updateInputsUI();
  updateCalculationUI();
  updateEquivalentRepsUI();
  drawGraph();
}

// Sync Polar (r, theta) to Cartesian (x, y) and UI controls
function syncFromPolar() {
  state.x = state.r * Math.cos(state.theta);
  state.y = state.r * Math.sin(state.theta);

  updateInputsUI();
  updateCalculationUI();
  updateEquivalentRepsUI();
  drawGraph();
}

// Update Input fields & sliders
function updateInputsUI() {
  document.getElementById('inputX').value = fmt(state.x);
  document.getElementById('sliderX').value = state.x;

  document.getElementById('inputY').value = fmt(state.y);
  document.getElementById('sliderY').value = state.y;

  document.getElementById('inputR').value = fmt(state.r);
  document.getElementById('sliderR').value = state.r;

  // Theta representation in text input
  if (state.unit === 'rad') {
    const angleTeX = formatAngleTeX(state.theta);
    // User-friendly plain string for input
    document.getElementById('inputTheta').value = angleTeX.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2').replace(/\\pi/g, 'pi').replace(/\\text\{ rad\}/g, '');
    document.getElementById('sliderTheta').min = '0';
    document.getElementById('sliderTheta').max = (2 * Math.PI).toString();
    document.getElementById('sliderTheta').step = '0.01';
    let normTheta = state.theta % (2 * Math.PI);
    if (normTheta < 0) normTheta += 2 * Math.PI;
    document.getElementById('sliderTheta').value = normTheta;
  } else {
    let deg = (state.theta * 180) / Math.PI;
    deg = ((deg % 360) + 360) % 360;
    document.getElementById('inputTheta').value = fmt(deg);
    document.getElementById('sliderTheta').min = '0';
    document.getElementById('sliderTheta').max = '360';
    document.getElementById('sliderTheta').step = '1';
    document.getElementById('sliderTheta').value = deg;
  }

  // Update Quadrant Badge
  updateQuadrantBadge();
}

// Determine Quadrant & update badge text
function updateQuadrantBadge() {
  const badge = document.getElementById('canvasQuadrantBadge');
  if (!badge) return;

  const eps = 1e-4;
  let text = '';
  if (Math.abs(state.x) < eps && Math.abs(state.y) < eps) {
    text = 'จุดกำเนิด (Pole / Origin)';
  } else if (Math.abs(state.y) < eps) {
    text = state.x > 0 ? 'แกนเชิงขั้ว (+X Axis)' : 'แกน -X Axis';
  } else if (Math.abs(state.x) < eps) {
    text = state.y > 0 ? 'แกน +Y Axis (90°)' : 'แกน -Y Axis (270°)';
  } else if (state.x > 0 && state.y > 0) {
    text = 'Quadrant I (+, +)';
  } else if (state.x < 0 && state.y > 0) {
    text = 'Quadrant II (-, +)';
  } else if (state.x < 0 && state.y < 0) {
    text = 'Quadrant III (-, -)';
  } else {
    text = 'Quadrant IV (+, -)';
  }
  badge.textContent = text;
}

// Update Step-by-Step Mathematical Breakdown
function updateCalculationUI() {
  const box = document.getElementById('calcBreakdown');
  if (!box) return;

  const xStr = fmt(state.x);
  const yStr = fmt(state.y);
  const rStr = fmt(state.r);
  const thetaTeX = formatAngleTeX(state.theta);
  const degVal = fmt(((state.theta * 180) / Math.PI) % 360);

  // Quadrant explanation
  let quadReason = '';
  if (state.x > 0 && state.y >= 0) {
    quadReason = 'เนื่องจาก $x > 0, y \\ge 0$ (Quadrant I) จึงใช้ค่า $\\theta = \\arctan(y/x)$ ได้โดยตรง';
  } else if (state.x < 0) {
    quadReason = 'เนื่องจาก $x < 0$ (Quadrant II หรือ III) ต้องปรับมุมโดยการบวก $\\pi$ ($180^\\circ$): $\\theta = \\arctan(y/x) + \\pi$';
  } else if (state.x > 0 && state.y < 0) {
    quadReason = 'เนื่องจาก $x > 0, y < 0$ (Quadrant IV) $\\theta = \\arctan(y/x) + 2\\pi$';
  } else if (Math.abs(state.x) < 1e-4) {
    quadReason = state.y >= 0 ? 'เนื่องจาก $x = 0, y > 0$ จุดอยู่บนแกน $+Y$ ได้ $\\theta = \\frac{\\pi}{2}$' : 'เนื่องจาก $x = 0, y < 0$ จุดอยู่บนแกน $-Y$ ได้ $\\theta = \\frac{3\\pi}{2}$';
  }

  const html = `
    <div class="math-step">
      <strong>ก. แปลงพิกัดฉาก $(x, y) \\to$ เชิงขั้ว $(r, \\theta)$:</strong><br>
      $$r = \\sqrt{x^2 + y^2} = \\sqrt{(${xStr})^2 + (${yStr})^2} = ${rStr}$$
      $$\\theta = \\operatorname{atan2}(${yStr}, ${xStr}) = ${thetaTeX} \\approx ${degVal}^\\circ$$
      <div style="font-size: 0.82rem; color: #666; margin-top: 4px;">${quadReason}</div>
    </div>
    <hr style="border: none; border-top: 1px dashed rgba(122,92,58,0.2); margin: 8px 0;">
    <div class="math-step">
      <strong>ข. แปลงพิกัดเชิงขั้ว $(r, \\theta) \\to$ พิกัดฉาก $(x, y)$:</strong><br>
      $$x = r \\cos\\theta = (${rStr}) \\cos(${thetaTeX}) = ${xStr}$$
      $$y = r \\sin\\theta = (${rStr}) \\sin(${thetaTeX}) = ${yStr}$$
    </div>
  `;

  box.innerHTML = html;
  triggerMathJax();
}

// Update Multiple Equivalent Polar Representations
function updateEquivalentRepsUI() {
  const container = document.getElementById('repListContainer');
  if (!container) return;

  const r = state.r;
  const th = state.theta;

  // 4 standard representations
  const reps = [
    { r: r, theta: th, label: 'รูปมาตรฐาน ($r \\ge 0$)' },
    { r: r, theta: th + 2 * Math.PI, label: 'บวกเพิ่ม $2\\pi$ ($+360^\\circ$)' },
    { r: -r, theta: th + Math.PI, label: 'กลับทิศรัศมี $-r$ และหมุนเพิ่ม $\\pi$' },
    { r: -r, theta: th - Math.PI, label: 'กลับทิศรัศมี $-r$ และหมุนลบ $\\pi$' }
  ];

  let html = '';
  reps.forEach((rep, idx) => {
    const rVal = fmt(rep.r);
    const thTex = formatAngleTeX(rep.theta);
    const degVal = fmt((rep.theta * 180) / Math.PI);
    html += `
      <div class="rep-item">
        <div>
          <strong>$(${rVal}, ${thTex})$</strong> <span style="font-size: 0.78rem; color: #777;">(${degVal}°)</span>
          <div style="font-size: 0.75rem; color: #888;">${rep.label}</div>
        </div>
        <button class="apply-btn" onclick="applyRepresentation(${rep.r}, ${rep.theta})">ลองใช้คู่นี้</button>
      </div>
    `;
  });

  container.innerHTML = html;
  triggerMathJax();
}

// Apply selected representation to inputs
window.applyRepresentation = function (r, th) {
  state.r = r;
  state.theta = th;
  // Calculate equivalent Cartesian to keep graph exact
  syncFromPolar();
};

// Event handlers for Cartesian inputs
window.onCartesianChange = function () {
  const x = parseFloat(document.getElementById('inputX').value);
  const y = parseFloat(document.getElementById('inputY').value);
  if (!isNaN(x)) state.x = x;
  if (!isNaN(y)) state.y = y;
  syncFromCartesian();
};

window.onSliderXChange = function () {
  state.x = parseFloat(document.getElementById('sliderX').value);
  syncFromCartesian();
};

window.onSliderYChange = function () {
  state.y = parseFloat(document.getElementById('sliderY').value);
  syncFromCartesian();
};

// Event handlers for Polar inputs
window.onPolarRChange = function () {
  const r = parseFloat(document.getElementById('inputR').value);
  if (!isNaN(r)) state.r = r;
  syncFromPolar();
};

window.onSliderRChange = function () {
  state.r = parseFloat(document.getElementById('sliderR').value);
  syncFromPolar();
};

window.onPolarThetaChange = function () {
  const str = document.getElementById('inputTheta').value;
  state.theta = parseAngleString(str, state.unit);
  syncFromPolar();
};

window.onSliderThetaChange = function () {
  const val = parseFloat(document.getElementById('sliderTheta').value);
  if (state.unit === 'deg') {
    state.theta = (val * Math.PI) / 180;
  } else {
    state.theta = val;
  }
  syncFromPolar();
};

// Quick Angle Presets
window.applyPresetAngle = function (rad, label) {
  state.theta = rad;
  syncFromPolar();
};

// Set angle unit (rad or deg)
window.setAngleUnit = function (unit) {
  state.unit = unit;
  document.getElementById('btnUnitRad').classList.toggle('active', unit === 'rad');
  document.getElementById('btnUnitDeg').classList.toggle('active', unit === 'deg');
  updateInputsUI();
};

// Set grid mode (cartesian, polar, both)
window.setGridMode = function (mode) {
  state.gridMode = mode;
  document.getElementById('gridBtnCartesian').classList.toggle('active', mode === 'cartesian');
  document.getElementById('gridBtnPolar').classList.toggle('active', mode === 'polar');
  document.getElementById('gridBtnBoth').classList.toggle('active', mode === 'both');
  drawGraph();
};

// Reset point to standard (3, 3)
window.resetPoint = function () {
  state.x = 3.0;
  state.y = 3.0;
  syncFromCartesian();
};

// Snap Point to clean coordinates
window.snapPointToGrid = function () {
  if (state.gridMode === 'polar') {
    // Snap r to integer and theta to nearest pi/12
    state.r = Math.round(state.r);
    state.theta = Math.round(state.theta / (Math.PI / 12)) * (Math.PI / 12);
    syncFromPolar();
  } else {
    // Snap x and y to integer
    state.x = Math.round(state.x);
    state.y = Math.round(state.y);
    syncFromCartesian();
  }
};

// Save current point to list
window.saveCurrentPoint = function () {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const label = letters[state.savedPoints.length % letters.length];
  const color = state.palette[state.savedPoints.length % state.palette.length];

  state.savedPoints.push({
    label: label,
    x: state.x,
    y: state.y,
    r: state.r,
    theta: state.theta,
    color: color
  });

  renderSavedPointsList();
  drawGraph();
};

// Render saved points list UI
function renderSavedPointsList() {
  const listEl = document.getElementById('savedPointsList');
  if (!listEl) return;

  if (state.savedPoints.length === 0) {
    listEl.innerHTML = '<div style="font-size: 0.85rem; color: #888; font-style: italic;">ยังไม่มีจุดที่บันทึก (กดปุ่ม "บันทึกจุดนี้" เพื่อปักหมุดเปรียบเทียบหลายจุด)</div>';
    return;
  }

  let html = '';
  state.savedPoints.forEach((pt, idx) => {
    const angleTeX = formatAngleTeX(pt.theta);
    html += `
      <div class="saved-item">
        <div>
          <span class="saved-dot" style="background: ${pt.color};"></span>
          <strong>จุด ${pt.label}:</strong> 
          ฉาก $(${fmt(pt.x)}, ${fmt(pt.y)})$ | 
          เชิงขั้ว $(${fmt(pt.r)}, ${angleTeX})$
        </div>
        <button class="del-btn" title="ลบจุดนี้" onclick="deleteSavedPoint(${idx})">×</button>
      </div>
    `;
  });

  listEl.innerHTML = html;
  triggerMathJax();
}

// Delete a saved point
window.deleteSavedPoint = function (index) {
  state.savedPoints.splice(index, 1);
  renderSavedPointsList();
  drawGraph();
};

// ==========================================
// Canvas Drawing Routine (Main Explorer)
// ==========================================
window.drawGraph = function () {
  if (!mainCanvas || !mainCtx) return;

  const canvas = mainCanvas;
  const ctx = mainCtx;

  // HiDPI Scaling
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const displayWidth = rect.width || 440;
  const displayHeight = rect.height || 440;

  if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
  }

  ctx.save();
  ctx.scale(dpr, dpr);

  const w = displayWidth;
  const h = displayHeight;
  const cx = w / 2;
  const cy = h / 2;
  const maxR = state.maxCoord;
  const radiusPx = (w / 2) * 0.88;
  const scale = radiusPx / maxR;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  // Helper conversions
  function toCanvas(mx, my) {
    return {
      x: cx + mx * scale,
      y: cy - my * scale
    };
  }

  // 1. Draw Cartesian Grid if active
  if (state.gridMode === 'cartesian' || state.gridMode === 'both') {
    ctx.lineWidth = 1;
    ctx.strokeStyle = state.gridMode === 'both' ? 'rgba(122, 92, 58, 0.08)' : 'rgba(122, 92, 58, 0.15)';

    for (let i = -maxR; i <= maxR; i++) {
      if (i === 0) continue;
      // Vertical line
      const topPt = toCanvas(i, maxR);
      const btmPt = toCanvas(i, -maxR);
      ctx.beginPath();
      ctx.moveTo(topPt.x, topPt.y);
      ctx.lineTo(btmPt.x, btmPt.y);
      ctx.stroke();

      // Horizontal line
      const leftPt = toCanvas(-maxR, i);
      const rightPt = toCanvas(maxR, i);
      ctx.beginPath();
      ctx.moveTo(leftPt.x, leftPt.y);
      ctx.lineTo(rightPt.x, rightPt.y);
      ctx.stroke();
    }
  }

  // 2. Draw Polar Grid if active
  if (state.gridMode === 'polar' || state.gridMode === 'both') {
    // Concentric Circles
    for (let r = 1; r <= maxR; r++) {
      ctx.beginPath();
      ctx.arc(cx, cy, r * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(122, 92, 58, 0.16)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Radius number on positive axis
      ctx.fillStyle = 'rgba(122, 92, 58, 0.6)';
      ctx.font = '10px system-ui, sans-serif';
      ctx.fillText(r.toString(), cx + r * scale + 3, cy - 3);
    }

    // Radial Spokes (every 30 deg and 45 deg)
    const angles = [
      { rad: 0, label: '0' },
      { rad: Math.PI / 6, label: 'π/6 (30°)' },
      { rad: Math.PI / 4, label: 'π/4 (45°)' },
      { rad: Math.PI / 3, label: 'π/3 (60°)' },
      { rad: Math.PI / 2, label: 'π/2 (90°)' },
      { rad: (2 * Math.PI) / 3, label: '2π/3' },
      { rad: (3 * Math.PI) / 4, label: '3π/4' },
      { rad: (5 * Math.PI) / 6, label: '5π/6' },
      { rad: Math.PI, label: 'π (180°)' },
      { rad: (7 * Math.PI) / 6, label: '7π/6' },
      { rad: (5 * Math.PI) / 4, label: '5π/4' },
      { rad: (4 * Math.PI) / 3, label: '4π/3' },
      { rad: (3 * Math.PI) / 2, label: '3π/2 (270°)' },
      { rad: (5 * Math.PI) / 3, label: '5π/3' },
      { rad: (7 * Math.PI) / 4, label: '7π/4' },
      { rad: (11 * Math.PI) / 6, label: '11π/6' }
    ];

    angles.forEach(a => {
      const cosA = Math.cos(a.rad);
      const sinA = Math.sin(a.rad);

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + cosA * radiusPx, cy - sinA * radiusPx);
      ctx.strokeStyle = (a.rad % (Math.PI / 2) === 0) ? 'rgba(122, 92, 58, 0.25)' : 'rgba(122, 92, 58, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Outer rim labels
      const labelDist = radiusPx + 14;
      const lx = cx + cosA * labelDist;
      const ly = cy - sinA * labelDist;
      ctx.fillStyle = '#7A5C3A';
      ctx.font = '9px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(a.label, lx, ly);
    });
  }

  // 3. Main Axes (X and Y)
  ctx.strokeStyle = '#7A5C3A';
  ctx.lineWidth = 1.5;

  // X Axis
  ctx.beginPath();
  ctx.moveTo(cx - radiusPx - 10, cy);
  ctx.lineTo(cx + radiusPx + 10, cy);
  ctx.stroke();

  // Y Axis
  ctx.beginPath();
  ctx.moveTo(cx, cy + radiusPx + 10);
  ctx.lineTo(cx, cy - radiusPx - 10);
  ctx.stroke();

  // Axis Labels
  ctx.fillStyle = '#7A5C3A';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('X (แกนเชิงขั้ว)', cx + radiusPx + 8, cy + 18);
  ctx.textAlign = 'left';
  ctx.fillText('Y', cx + 6, cy - radiusPx - 4);

  // 4. Visual Guides for Active Point
  const ptCanvas = toCanvas(state.x, state.y);
  const chkTriangle = document.getElementById('chkTriangle')?.checked ?? true;
  const chkAngleArc = document.getElementById('chkAngleArc')?.checked ?? true;
  const chkNegativeR = document.getElementById('chkNegativeR')?.checked ?? true;
  const chkLabels = document.getElementById('chkLabels')?.checked ?? true;

  // Negative R guide
  if (chkNegativeR && state.r < 0) {
    // Show dashed line pointing in direction theta
    const dirX = Math.cos(state.theta) * Math.abs(state.r);
    const dirY = Math.sin(state.theta) * Math.abs(state.r);
    const dirCanvas = toCanvas(dirX, dirY);

    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#e67e22';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(dirCanvas.x, dirCanvas.y);
    ctx.stroke();

    ctx.fillStyle = '#e67e22';
    ctx.font = '10px system-ui, sans-serif';
    ctx.fillText('ทิศมุม θ (ก้าวถอยหลัง)', dirCanvas.x + 6, dirCanvas.y - 6);
    ctx.restore();
  }

  // Angle Arc
  if (chkAngleArc && Math.abs(state.x) + Math.abs(state.y) > 0.05) {
    ctx.save();
    ctx.beginPath();
    const arcRadius = Math.min(36, state.r * scale * 0.45);
    ctx.arc(cx, cy, Math.max(arcRadius, 18), 0, -state.theta, state.theta > 0);
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Arc theta label
    const midTheta = state.theta / 2;
    const arcLabelDist = Math.max(arcRadius, 18) + 12;
    const alx = cx + Math.cos(midTheta) * arcLabelDist;
    const aly = cy - Math.sin(midTheta) * arcLabelDist;
    ctx.fillStyle = '#2980b9';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('θ', alx, aly);
    ctx.restore();
  }

  // Right Triangle Projection
  if (chkTriangle && Math.abs(state.x) > 0.05 && Math.abs(state.y) > 0.05) {
    ctx.save();
    // X projection leg (Horizontal)
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(ptCanvas.x, cy);
    ctx.stroke();

    // Y projection leg (Vertical)
    ctx.strokeStyle = '#8e44ad';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ptCanvas.x, cy);
    ctx.lineTo(ptCanvas.x, ptCanvas.y);
    ctx.stroke();

    // Right-angle marker at (x, 0)
    const markerSize = 8;
    const sgnX = state.x >= 0 ? 1 : -1;
    const sgnY = state.y >= 0 ? 1 : -1;
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ptCanvas.x - sgnX * markerSize, cy);
    ctx.lineTo(ptCanvas.x - sgnX * markerSize, cy - sgnY * markerSize);
    ctx.lineTo(ptCanvas.x, cy - sgnY * markerSize);
    ctx.stroke();
    ctx.restore();
  }

  // Radius vector line (Hypotenuse)
  ctx.save();
  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(ptCanvas.x, ptCanvas.y);
  ctx.stroke();
  ctx.restore();

  // 5. Draw Saved Points
  state.savedPoints.forEach(pt => {
    const sCanvas = toCanvas(pt.x, pt.y);
    ctx.beginPath();
    ctx.arc(sCanvas.x, sCanvas.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = pt.color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = pt.color;
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillText(` ${pt.label}`, sCanvas.x + 6, sCanvas.y - 4);
  });

  // 6. Draw Main Active Point P
  ctx.save();
  // Pulsing glow
  ctx.beginPath();
  ctx.arc(ptCanvas.x, ptCanvas.y, 8, 0, 2 * Math.PI);
  ctx.fillStyle = '#b33939';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Label badge near point
  if (chkLabels) {
    const labelX = ptCanvas.x + 10;
    const labelY = ptCanvas.y - 10;
    const textCart = `(${fmt(state.x)}, ${fmt(state.y)})`;
    const textPol = `[${fmt(state.r)}, ${fmt((state.theta * 180) / Math.PI)}°]`;

    ctx.font = 'bold 11px system-ui, sans-serif';
    const textW = Math.max(ctx.measureText(textCart).width, ctx.measureText(textPol).width) + 14;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeStyle = 'rgba(122, 92, 58, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(labelX - 4, labelY - 24, textW, 30, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#111';
    ctx.textAlign = 'left';
    ctx.fillText(textCart, labelX, labelY - 12);
    ctx.fillStyle = '#7A5C3A';
    ctx.fillText(textPol, labelX, labelY + 2);
  }
  ctx.restore();

  ctx.restore();
};

// ==========================================
// Challenge / Quiz Engine
// ==========================================
window.switchTab = function (tab) {
  document.getElementById('sectionExplorer').style.display = tab === 'explorer' ? 'block' : 'none';
  document.getElementById('sectionChallenge').style.display = tab === 'challenge' ? 'block' : 'none';
  document.getElementById('sectionFormulas').style.display = tab === 'formulas' ? 'block' : 'none';

  document.getElementById('tabBtnExplorer').classList.toggle('active', tab === 'explorer');
  document.getElementById('tabBtnChallenge').classList.toggle('active', tab === 'challenge');
  document.getElementById('tabBtnFormulas').classList.toggle('active', tab === 'formulas');

  if (tab === 'explorer') {
    drawGraph();
  } else if (tab === 'challenge') {
    if (state.quiz.type === 'plot') {
      drawQuizPlot();
    } else {
      drawQuizIdentify();
    }
  }
  triggerMathJax();
};

window.setQuizType = function (type) {
  state.quiz.type = type;
  document.getElementById('quizModePlotBtn').classList.toggle('active', type === 'plot');
  document.getElementById('quizModeIdentifyBtn').classList.toggle('active', type === 'identify');

  document.getElementById('quizPlotArea').style.display = type === 'plot' ? 'flex' : 'none';
  document.getElementById('quizIdentifyArea').style.display = type === 'identify' ? 'flex' : 'none';

  generateNewQuiz();
};

window.generateNewQuiz = function () {
  const quiz = state.quiz;
  const feedback = document.getElementById('quizFeedbackBox');
  if (feedback) {
    feedback.className = 'quiz-feedback';
    feedback.style.display = 'none';
  }

  // Predefined student-friendly coordinate pairs
  const problemBank = [
    { r: 3, theta: Math.PI / 4, label: '(3, \\frac{\\pi}{4})' },
    { r: 4, theta: (2 * Math.PI) / 3, label: '(4, \\frac{2\\pi}{3})' },
    { r: 2, theta: (5 * Math.PI) / 6, label: '(2, \\frac{5\\pi}{6})' },
    { r: 3.5, theta: (4 * Math.PI) / 3, label: '(3.5, \\frac{4\\pi}{3})' },
    { r: 2.5, theta: (7 * Math.PI) / 4, label: '(2.5, \\frac{7\\pi}{4})' },
    { r: -3, theta: Math.PI / 3, label: '(-3, \\frac{\\pi}{3})' },
    { r: -2.5, theta: (3 * Math.PI) / 4, label: '(-2.5, \\frac{3\\pi}{4})' },
    { r: 3, theta: Math.PI / 2, label: '(3, \\frac{\\pi}{2})' }
  ];

  const item = problemBank[Math.floor(Math.random() * problemBank.length)];
  quiz.targetR = item.r;
  quiz.targetTheta = item.theta;
  quiz.targetLabel = item.label;
  quiz.solved = false;

  const targetX = item.r * Math.cos(item.theta);
  const targetY = item.r * Math.sin(item.theta);

  if (quiz.type === 'plot') {
    // Initial user point at origin
    quiz.userX = 0;
    quiz.userY = 0;
    document.getElementById('quizQuestionText').innerHTML = `
      จงคลิกหรือลากจุดสีน้ำเงินบนกราฟไปวางที่พิกัดเชิงขั้ว: <strong>$P${quiz.targetLabel}$</strong>
    `;
    drawQuizPlot();
  } else {
    // Identify quiz: generate 4 choices
    document.getElementById('quizQuestionText').innerHTML = `
      จุดสีแดงบนกราฟด้านล่าง มีพิกัดเชิงขั้วตรงกับตัวเลือกใด?
    `;

    const choices = [
      { r: item.r, theta: item.theta, text: `(${fmt(item.r)}, ${formatAngleTeX(item.theta)})`, isCorrect: true },
      { r: item.r, theta: item.theta + Math.PI / 2, text: `(${fmt(item.r)}, ${formatAngleTeX(item.theta + Math.PI / 2)})`, isCorrect: false },
      { r: -item.r, theta: item.theta, text: `(${fmt(-item.r)}, ${formatAngleTeX(item.theta)})`, isCorrect: false },
      { r: item.r, theta: (2 * Math.PI) - item.theta, text: `(${fmt(item.r)}, ${formatAngleTeX((2 * Math.PI) - item.theta)})`, isCorrect: false }
    ];

    // Shuffle
    choices.sort(() => Math.random() - 0.5);
    quiz.options = choices;

    const optContainer = document.getElementById('quizIdentifyOptions');
    if (optContainer) {
      let optHtml = '';
      choices.forEach((c, idx) => {
        optHtml += `
          <button class="btn-outline" style="padding: 10px; font-size: 0.95rem; text-align: center;" onclick="submitIdentifyQuiz(${idx})">
            $${c.text}$
          </button>
        `;
      });
      optContainer.innerHTML = optHtml;
    }

    drawQuizIdentify();
  }

  triggerMathJax();
};

// Draw Quiz Plot Canvas
function drawQuizPlot() {
  if (!quizCanvas || !quizCtx) return;
  const ctx = quizCtx;
  const w = quizCanvas.width;
  const h = quizCanvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const scale = (w / 2 * 0.85) / state.maxCoord;

  ctx.clearRect(0, 0, w, h);

  // Concentric Circles
  for (let r = 1; r <= 5; r++) {
    ctx.beginPath();
    ctx.arc(cx, cy, r * scale, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(122, 92, 58, 0.18)';
    ctx.stroke();
    ctx.fillStyle = 'rgba(122, 92, 58, 0.6)';
    ctx.font = '10px system-ui';
    ctx.fillText(r.toString(), cx + r * scale + 2, cy - 2);
  }

  // Radial rays
  [0, Math.PI/6, Math.PI/4, Math.PI/3, Math.PI/2, 2*Math.PI/3, 3*Math.PI/4, 5*Math.PI/6, Math.PI, 7*Math.PI/6, 5*Math.PI/4, 4*Math.PI/3, 3*Math.PI/2, 5*Math.PI/3, 7*Math.PI/4, 11*Math.PI/6].forEach(a => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * (w/2 * 0.85), cy - Math.sin(a) * (w/2 * 0.85));
    ctx.strokeStyle = 'rgba(122, 92, 58, 0.12)';
    ctx.stroke();
  });

  // Axes
  ctx.strokeStyle = '#7A5C3A';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, cy); ctx.lineTo(w, cy);
  ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
  ctx.stroke();

  // User Point
  const ux = cx + state.quiz.userX * scale;
  const uy = cy - state.quiz.userY * scale;

  ctx.beginPath();
  ctx.arc(ux, uy, 7, 0, 2 * Math.PI);
  ctx.fillStyle = '#2980b9';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // If solved, show target point in green
  if (state.quiz.solved) {
    const tx = cx + (state.quiz.targetR * Math.cos(state.quiz.targetTheta)) * scale;
    const ty = cy - (state.quiz.targetR * Math.sin(state.quiz.targetTheta)) * scale;
    ctx.beginPath();
    ctx.arc(tx, ty, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#27ae60';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.stroke();
  }
}

// Draw Quiz Identify Canvas
function drawQuizIdentify() {
  if (!quizIdCanvas || !quizIdCtx) return;
  const ctx = quizIdCtx;
  const w = quizIdCanvas.width;
  const h = quizIdCanvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const scale = (w / 2 * 0.85) / state.maxCoord;

  ctx.clearRect(0, 0, w, h);

  // Concentric circles
  for (let r = 1; r <= 5; r++) {
    ctx.beginPath();
    ctx.arc(cx, cy, r * scale, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(122, 92, 58, 0.18)';
    ctx.stroke();
    ctx.fillStyle = 'rgba(122, 92, 58, 0.6)';
    ctx.font = '10px system-ui';
    ctx.fillText(r.toString(), cx + r * scale + 2, cy - 2);
  }

  // Radial rays
  [0, Math.PI/6, Math.PI/4, Math.PI/3, Math.PI/2, 2*Math.PI/3, 3*Math.PI/4, 5*Math.PI/6, Math.PI, 7*Math.PI/6, 5*Math.PI/4, 4*Math.PI/3, 3*Math.PI/2, 5*Math.PI/3, 7*Math.PI/4, 11*Math.PI/6].forEach(a => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * (w/2 * 0.85), cy - Math.sin(a) * (w/2 * 0.85));
    ctx.strokeStyle = 'rgba(122, 92, 58, 0.12)';
    ctx.stroke();
  });

  // Axes
  ctx.strokeStyle = '#7A5C3A';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, cy); ctx.lineTo(w, cy);
  ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
  ctx.stroke();

  // Draw Mystery Target Point in Red
  const tx = cx + (state.quiz.targetR * Math.cos(state.quiz.targetTheta)) * scale;
  const ty = cy - (state.quiz.targetR * Math.sin(state.quiz.targetTheta)) * scale;

  ctx.beginPath();
  ctx.arc(tx, ty, 7, 0, 2 * Math.PI);
  ctx.fillStyle = '#c0392b';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#c0392b';
  ctx.font = 'bold 12px system-ui';
  ctx.fillText('P ?', tx + 8, ty - 6);
}

// Submit Plot Quiz
window.submitPlotQuiz = function () {
  const quiz = state.quiz;
  const targetX = quiz.targetR * Math.cos(quiz.targetTheta);
  const targetY = quiz.targetR * Math.sin(quiz.targetTheta);
  const dist = Math.hypot(quiz.userX - targetX, quiz.userY - targetY);

  const feedback = document.getElementById('quizFeedbackBox');
  quiz.solved = true;
  drawQuizPlot();

  if (dist <= 0.45) {
    quiz.score += 10;
    quiz.streak += 1;
    feedback.className = 'quiz-feedback success';
    feedback.innerHTML = `
      🎉 <strong>ถูกต้องยอดเยี่ยม!</strong> คุณวางจุดได้แม่นยำมาก 
      (ระยะ $r = ${fmt(quiz.targetR)}$, มุม $\\theta = ${formatAngleTeX(quiz.targetTheta)}$)
      <br><button class="btn-action" style="margin-top: 8px; font-size: 0.85rem;" onclick="generateNewQuiz()">ลุยข้อต่อไป</button>
    `;
  } else {
    quiz.streak = 0;
    feedback.className = 'quiz-feedback error';
    let hint = '';
    if (quiz.targetR < 0) {
      hint = `💡 <em>ข้อควรระวัง:</em> รัศมี $r = ${quiz.targetR}$ ติดลบ หมายความว่าให้หันหน้าไปทิศ $\\theta$ แล้วเดินถอยหลังไปในทิศตรงข้าม!`;
    }
    feedback.innerHTML = `
      ❌ <strong>ยังไม่ถูกต้อง</strong> (ตำแหน่งที่ถูกคือจุดสีเขียวบนกราฟ)
      <br>${hint}
      <br>ตำแหน่งเป้าหมายคือพิกัดฉาก: $(x, y) = (${fmt(targetX)}, ${fmt(targetY)})$
      <br><button class="btn-action" style="margin-top: 8px; font-size: 0.85rem;" onclick="generateNewQuiz()">ลองข้อใหม่</button>
    `;
  }

  document.getElementById('quizScore').textContent = quiz.score;
  document.getElementById('quizStreak').textContent = quiz.streak;
  triggerMathJax();
};

// Submit Identify Quiz
window.submitIdentifyQuiz = function (choiceIndex) {
  const quiz = state.quiz;
  const choice = quiz.options[choiceIndex];
  const feedback = document.getElementById('quizFeedbackBox');

  if (choice && choice.isCorrect) {
    quiz.score += 10;
    quiz.streak += 1;
    feedback.className = 'quiz-feedback success';
    feedback.innerHTML = `
      🎉 <strong>ถูกต้อง!</strong> จุดดังกล่าวคือพิกัด $${choice.text}$
      <br><button class="btn-action" style="margin-top: 8px; font-size: 0.85rem;" onclick="generateNewQuiz()">ลุยข้อต่อไป</button>
    `;
  } else {
    quiz.streak = 0;
    feedback.className = 'quiz-feedback error';
    const correctOpt = quiz.options.find(c => c.isCorrect);
    feedback.innerHTML = `
      ❌ <strong>ยังไม่ถูกต้อง</strong> คำตอบที่ถูกต้องคือ: $${correctOpt.text}$
      <br><button class="btn-action" style="margin-top: 8px; font-size: 0.85rem;" onclick="generateNewQuiz()">ลองข้อใหม่</button>
    `;
  }

  document.getElementById('quizScore').textContent = quiz.score;
  document.getElementById('quizStreak').textContent = quiz.streak;
  triggerMathJax();
};
