/**
 * Polar Coordinates Interactive Learning App
 * Pure Radian & Math Expression Parsing Edition
 * Author: Nareupanat Lekkoksung (with Antigravity pair programmer)
 */

// Global Application State
const state = {
  // Current active point
  x: 3.0,
  y: 3.0,
  r: 4.24,
  theta: Math.PI / 4, // always in radians

  // View settings
  gridMode: 'both', // 'cartesian' | 'polar' | 'both'
  maxCoord: 6.0,    // domain [-6, 6]
  
  // Dragging state
  isDragging: false,

  // Saved points collection
  savedPoints: [],
  palette: ['#c0392b', '#2980b9', '#27ae60', '#8e44ad', '#d35400', '#16a085']
};

// Canvas references
let mainCanvas, mainCtx;

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

// Simplify r into exact radical form (e.g. 2\sqrt{3}, 4\sqrt{3}, 3\sqrt{2}, 4, \sqrt{2})
function simplifyRExact(x, y) {
  const rSq = x * x + y * y;
  if (rSq < 1e-9) {
    return { tex: '0', plain: '0' };
  }

  // Check rational P/Q with Q in [1, 2, 4, 8, 9, 16, 25, 36, 49, 64, 100]
  let bestP = null, bestQ = null, minDiff = 1e9;
  for (const q of [1, 2, 4, 8, 9, 16, 25, 36, 49, 64, 100]) {
    const p = Math.round(rSq * q);
    const diff = Math.abs(rSq - p / q);
    if (diff < 0.005 && diff < minDiff) {
      minDiff = diff;
      bestP = p;
      bestQ = q;
    }
  }

  if (bestP !== null && minDiff < 0.005 && bestP > 0) {
    const p = bestP;
    const q = bestQ;
    const num = p * q;
    let bestA = 1;
    const maxA = Math.floor(Math.sqrt(num));
    for (let a = maxA; a > 1; a--) {
      if (num % (a * a) === 0) {
        bestA = a;
        break;
      }
    }
    const b = Math.floor(num / (bestA * bestA));
    let den = q;

    function gcd(n1, n2) {
      n1 = Math.abs(n1); n2 = Math.abs(n2);
      while (n2) { const t = n2; n2 = n1 % n2; n1 = t; }
      return n1;
    }

    const g = gcd(bestA, den);
    bestA /= g;
    den /= g;

    let tex = '', plain = '';
    if (b === 1) {
      if (den === 1) {
        tex = bestA.toString();
        plain = bestA.toString();
      } else {
        tex = `\\frac{${bestA}}{${den}}`;
        plain = `${bestA}/${den}`;
      }
    } else {
      const radTex = `\\sqrt{${b}}`;
      const radPlain = `sqrt(${b})`;
      if (bestA === 1) {
        if (den === 1) {
          tex = radTex;
          plain = radPlain;
        } else {
          tex = `\\frac{${radTex}}{${den}}`;
          plain = `${radPlain}/${den}`;
        }
      } else {
        if (den === 1) {
          tex = `${bestA}${radTex}`;
          plain = `${bestA}*${radPlain}`;
        } else {
          tex = `\\frac{${bestA}${radTex}}{${den}}`;
          plain = `(${bestA}*${radPlain})/${den}`;
        }
      }
    }
    return { tex, plain };
  }

  // Fallback to clean format if square isn't rational
  const val = Math.sqrt(rSq);
  return { tex: fmt(val), plain: fmt(val) };
}

// Convert angle to formatted Pi fraction string for TeX
function formatAngleTeX(rad) {
  if (Math.abs(rad) < 1e-4) return '0';
  const m = rad / Math.PI;

  let bestP = null, bestQ = null, minDiff = 1e9;
  for (const q of [1, 2, 3, 4, 6, 8, 12]) {
    const p = Math.round(m * q);
    const diff = Math.abs(m - p / q);
    if (diff < 0.005 && diff < minDiff) {
      minDiff = diff;
      bestP = p;
      bestQ = q;
    }
  }

  if (bestP !== null) {
    const p = bestP;
    const q = bestQ;
    if (q === 1) {
      if (p === 1) return '\\pi';
      if (p === -1) return '-\\pi';
      return p + '\\pi';
    } else {
      const sign = p < 0 ? '-' : '';
      const absP = Math.abs(p);
      const pStr = absP === 1 ? '' : absP.toString();
      return `${sign}\\frac{${pStr}\\pi}{${q}}`;
    }
  }

  return `${m.toFixed(3)}\\pi`;
}

// Convert angle to simple text for input fields (e.g. "pi/4", "9pi/4", "-pi/2", "1.804pi")
function formatAnglePlain(rad) {
  if (Math.abs(rad) < 1e-4) return '0';
  const m = rad / Math.PI;

  let bestP = null, bestQ = null, minDiff = 1e9;
  for (const q of [1, 2, 3, 4, 6, 8, 12]) {
    const p = Math.round(m * q);
    const diff = Math.abs(m - p / q);
    if (diff < 0.005 && diff < minDiff) {
      minDiff = diff;
      bestP = p;
      bestQ = q;
    }
  }

  if (bestP !== null) {
    const p = bestP;
    const q = bestQ;
    if (q === 1) {
      if (p === 1) return 'pi';
      if (p === -1) return '-pi';
      return p + 'pi';
    } else {
      const sign = p < 0 ? '-' : '';
      const absP = Math.abs(p);
      const pStr = absP === 1 ? '' : absP.toString();
      return `${sign}${pStr}pi/${q}`;
    }
  }

  return `${m.toFixed(3)}pi`;
}

/**
 * Safe Math Expression Evaluator
 * Supports: sqrt(2), 2*sqrt(3), 2sqrt(3), pi, π, fractions (3/2), decimals, parentheses, arithmetic
 */
function evaluateMath(str) {
  if (!str) return NaN;
  let s = str.trim().toLowerCase().replace(/\s+/g, '');
  s = s.replace(/π/g, 'pi');

  // Handle implicit multiplication like 2sqrt(3) -> 2*sqrt(3), 2pi -> 2*pi, (2)(3) -> (2)*(3)
  s = s.replace(/([0-9.]+)sqrt/g, '$1*sqrt');
  s = s.replace(/([0-9.]+)pi/g, '$1*pi');
  s = s.replace(/\)([\(0-9a-z])/g, ')*$1');
  s = s.replace(/([0-9])\(/g, '$1*(');
  s = s.replace(/sqrt/g, 'Math.sqrt');
  s = s.replace(/pi/g, 'Math.PI');
  s = s.replace(/\^/g, '**');

  // Strict token validation
  const testSafe = s
    .replace(/Math\.sqrt/g, '')
    .replace(/Math\.PI/g, '')
    .replace(/[0-9.+\-*/()]/g, '');

  if (testSafe.length !== 0) {
    return NaN;
  }

  try {
    const val = Function('"use strict"; return (' + s + ')')();
    return (typeof val === 'number' && !isNaN(val)) ? val : NaN;
  } catch (e) {
    return NaN;
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  mainCanvas = document.getElementById('plotCanvas');
  mainCtx = mainCanvas.getContext('2d');

  setupCanvasEvents(mainCanvas);
  
  // Responsive layout: redraw on window resize and device orientation change
  window.addEventListener('resize', () => {
    drawGraph();
  });
  window.addEventListener('orientationchange', () => {
    setTimeout(drawGraph, 100);
  });

  // Initial sync
  syncFromCartesian(false);
});

// Setup Mouse & Touch Events for Canvas
function setupCanvasEvents(canvas) {
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
    const displayWidth = rect.width || 440;
    const radiusRatio = displayWidth < 380 ? 0.81 : 0.87;
    const radiusPixels = (canvas.width / 2) * radiusRatio;
    const scale = radiusPixels / state.maxCoord;

    const mathX = (canvasX - cx) / scale;
    const mathY = (cy - canvasY) / scale;

    return { mathX, mathY };
  }

  function onDown(e) {
    e.preventDefault();
    state.isDragging = true;
    const { mathX, mathY } = getPos(e);
    handlePointDrag(mathX, mathY);
  }

  function onMove(e) {
    if (!state.isDragging) return;
    e.preventDefault();
    const { mathX, mathY } = getPos(e);
    handlePointDrag(mathX, mathY);
  }

  function onUp(e) {
    if (state.isDragging) {
      state.isDragging = false;
    }
  }

  canvas.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);

  canvas.addEventListener('touchstart', onDown, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onUp);
  window.addEventListener('touchcancel', onUp);
}

// Point Drag handler
function handlePointDrag(mathX, mathY) {
  const dist = Math.hypot(mathX, mathY);
  if (dist > state.maxCoord) {
    mathX = (mathX / dist) * state.maxCoord;
    mathY = (mathY / dist) * state.maxCoord;
  }

  state.x = Math.round(mathX * 20) / 20; // 0.05 step
  state.y = Math.round(mathY * 20) / 20;

  syncFromCartesian('drag');
}

// Sync Cartesian (x, y) to Polar (r, theta)
function syncFromCartesian(source = 'all') {
  state.r = Math.hypot(state.x, state.y);
  state.theta = Math.atan2(state.y, state.x);
  if (state.theta < 0) state.theta += 2 * Math.PI;

  updateInputsUI(source);
  updateCalculationUI();
  updateEquivalentRepsUI();
  drawGraph();
}

// Sync Polar (r, theta) to Cartesian (x, y)
function syncFromPolar(source = 'all') {
  state.x = state.r * Math.cos(state.theta);
  state.y = state.r * Math.sin(state.theta);

  updateInputsUI(source);
  updateCalculationUI();
  updateEquivalentRepsUI();
  drawGraph();
}

// Update Input fields & evaluated previews
function updateInputsUI(source = 'all') {
  const inputX = document.getElementById('inputX');
  const inputY = document.getElementById('inputY');
  const inputR = document.getElementById('inputR');
  const inputTheta = document.getElementById('inputTheta');

  const rInfo = simplifyRExact(state.x, state.y);

  // If dragged, snapped, or full sync, update all text inputs
  if (source === 'drag' || source === 'all') {
    if (inputX) inputX.value = fmt(state.x);
    if (inputY) inputY.value = fmt(state.y);
    if (inputR) inputR.value = rInfo.plain;
    if (inputTheta) inputTheta.value = formatAnglePlain(state.theta);
  } else if (source === 'cartesian') {
    // When Cartesian was inputted, update Polar fields with exact radical & clean theta
    if (inputR) inputR.value = rInfo.plain;
    if (inputTheta) inputTheta.value = formatAnglePlain(state.theta);
  } else if (source === 'polar') {
    // When Polar was inputted, update Cartesian fields
    if (inputX) inputX.value = fmt(state.x);
    if (inputY) inputY.value = fmt(state.y);
  }

  // Previews (Exact, no approximation clutter)
  const px = document.getElementById('previewX');
  const py = document.getElementById('previewY');
  const pr = document.getElementById('previewR');
  const pt = document.getElementById('previewTheta');

  if (px) px.textContent = `= ${fmt(state.x)}`;
  if (py) py.textContent = `= ${fmt(state.y)}`;
  if (pr) pr.textContent = `= ${rInfo.plain}`;
  if (pt) pt.textContent = `= ${formatAnglePlain(state.theta)}`;

  // Live Result Badges under Card 1 and Card 2 (Exact MathJax typesetting)
  const cartRes = document.getElementById('cartesianResultText');
  if (cartRes) {
    cartRes.innerHTML = `$$r = ${rInfo.tex}, \\quad \\theta = ${formatAngleTeX(state.theta)}$$`;
  }

  const polRes = document.getElementById('polarResultText');
  if (polRes) {
    polRes.innerHTML = `$$x = ${fmt(state.x)}, \\quad y = ${fmt(state.y)}$$`;
  }

  // Update Quadrant Badge
  updateQuadrantBadge();
  triggerMathJax();
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
    text = state.x > 0 ? 'แกนเชิงขั้ว (+X Axis, θ = 0)' : 'แกน -X Axis (θ = π)';
  } else if (Math.abs(state.x) < eps) {
    text = state.y > 0 ? 'แกน +Y Axis (θ = π/2)' : 'แกน -Y Axis (θ = 3π/2)';
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

// Update Step-by-Step Mathematical Breakdown in Pure Radians
function updateCalculationUI() {
  const box = document.getElementById('calcBreakdown');
  if (!box) return;

  const xStr = fmt(state.x);
  const yStr = fmt(state.y);
  const rInfo = simplifyRExact(state.x, state.y);
  const thetaTeX = formatAngleTeX(state.theta);

  // Quadrant explanation & LaTeX arctan formula (pure radians)
  let quadReason = '';
  let thetaFormulaTeX = '';

  if (Math.abs(state.x) < 1e-4) {
    if (state.y > 0) {
      thetaFormulaTeX = `\\theta = \\frac{\\pi}{2}`;
      quadReason = 'เนื่องจาก $x = 0, y > 0$ จุดอยู่บนแกน $+Y$ จึงได้ $\\theta = \\frac{\\pi}{2}$';
    } else if (state.y < 0) {
      thetaFormulaTeX = `\\theta = \\frac{3\\pi}{2}`;
      quadReason = 'เนื่องจาก $x = 0, y < 0$ จุดอยู่บนแกน $-Y$ จึงได้ $\\theta = \\frac{3\\pi}{2}$';
    } else {
      thetaFormulaTeX = `\\theta = 0`;
      quadReason = 'จุดกำเนิด (Pole / Origin)';
    }
  } else if (state.x > 0 && state.y >= 0) {
    thetaFormulaTeX = `\\theta = \\arctan\\left(\\frac{y}{x}\\right) = \\arctan\\left(\\frac{${yStr}}{${xStr}}\\right) = ${thetaTeX}`;
    quadReason = 'เนื่องจาก $x > 0, y \\ge 0$ (Quadrant I) จึงใช้ค่า $\\theta = \\arctan(y/x)$ ได้โดยตรง';
  } else if (state.x < 0) {
    thetaFormulaTeX = `\\theta = \\arctan\\left(\\frac{y}{x}\\right) + \\pi = \\arctan\\left(\\frac{${yStr}}{${xStr}}\\right) + \\pi = ${thetaTeX}`;
    quadReason = 'เนื่องจาก $x < 0$ (Quadrant II หรือ III) ต้องปรับมุมโดยการบวก $\\pi$: $\\theta = \\arctan(y/x) + \\pi$';
  } else if (state.x > 0 && state.y < 0) {
    thetaFormulaTeX = `\\theta = \\arctan\\left(\\frac{y}{x}\\right) + 2\\pi = \\arctan\\left(\\frac{${yStr}}{${xStr}}\\right) + 2\\pi = ${thetaTeX}`;
    quadReason = `เนื่องจาก $x > 0, y < 0$ (Quadrant IV) จึงต้องบวกมุมด้วย $2\\pi$: $\\theta = \\arctan(y/x) + 2\\pi = ${thetaTeX}$`;
  }

  let multiTurnNote = '';
  if (Math.abs(state.theta) > 2 * Math.PI) {
    const turns = Math.floor(Math.abs(state.theta) / (2 * Math.PI));
    const sgnText = state.theta > 0 ? 'ทวนเข็มนาฬิกา' : 'ตามเข็มนาฬิกา';
    const remAngle = ((state.theta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    multiTurnNote = `
      <div style="background: rgba(41, 128, 185, 0.08); border-left: 3px solid #2980b9; padding: 8px 12px; margin-top: 10px; border-radius: 4px; font-size: 0.86rem; line-height: 1.5;">
        🌀 <strong>มุมหมุนมากกว่า 1 รอบ (${sgnText}):</strong><br>
        $\\theta = ${formatAngleTeX(state.theta)}$ 
        (หมุนไป <strong>${turns} รอบเต็ม</strong> + เศษมุม $${formatAngleTeX(remAngle)}$)
        <br><span style="color: #555; font-size: 0.82rem;">เส้นบนกราฟจะม้วนเป็นรูป<strong>ก้นหอย (Spiral)</strong> เพื่อแสดงการหมุนหลายรอบ และตำแหน่งสุดท้ายจะตกอยู่ที่เดียวกับมุม $${formatAngleTeX(remAngle)}$</span>
      </div>
    `;
  } else if (state.theta < 0) {
    const posAngle = ((state.theta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    multiTurnNote = `
      <div style="background: rgba(41, 128, 185, 0.08); border-left: 3px solid #2980b9; padding: 8px 12px; margin-top: 10px; border-radius: 4px; font-size: 0.86rem; line-height: 1.5;">
        🔄 <strong>มุมติดลบ (วัดตามเข็มนาฬิกา):</strong><br>
        $\\theta = ${formatAngleTeX(state.theta)}$ เทียบเท่ากับมุมทวนเข็ม $${formatAngleTeX(posAngle)}$
      </div>
    `;
  }

  const html = `
    <div class="math-step">
      <strong>ก. แปลงพิกัดฉาก $(x, y) \\to$ เชิงขั้ว $(r, \\theta)$:</strong><br>
      $$r = \\sqrt{x^2 + y^2} = \\sqrt{(${xStr})^2 + (${yStr})^2} = ${rInfo.tex}$$
      $$${thetaFormulaTeX}$$
      <div style="font-size: 0.82rem; color: #666; margin-top: 4px;">${quadReason}</div>
    </div>
    <hr style="border: none; border-top: 1px dashed rgba(122,92,58,0.2); margin: 8px 0;">
    <div class="math-step">
      <strong>ข. แปลงพิกัดเชิงขั้ว $(r, \\theta) \\to$ พิกัดฉาก $(x, y)$:</strong><br>
      $$x = r \\cos\\theta = (${rInfo.tex}) \\cos(${thetaTeX}) = ${xStr}$$
      $$y = r \\sin\\theta = (${rInfo.tex}) \\sin(${thetaTeX}) = ${yStr}$$
      ${multiTurnNote}
    </div>
  `;

  box.innerHTML = html;
  triggerMathJax();
}

// Update Multiple Equivalent Polar Representations (Pure Radians)
function updateEquivalentRepsUI() {
  const container = document.getElementById('repListContainer');
  if (!container) return;

  const r = state.r;
  const th = state.theta;

  const reps = [
    { r: r, theta: th, label: 'รูปมาตรฐาน ($r \\ge 0$)' },
    { r: r, theta: th + 2 * Math.PI, label: 'บวกมุมเพิ่ม $2\\pi$' },
    { r: -r, theta: th + Math.PI, label: 'กลับทิศรัศมี $-r$ และหมุนมุมเพิ่ม $\\pi$' },
    { r: -r, theta: th - Math.PI, label: 'กลับทิศรัศมี $-r$ และหมุนมุมลบ $\\pi$' }
  ];

  let html = '';
  reps.forEach((rep) => {
    const rVal = fmt(rep.r);
    const thTex = formatAngleTeX(rep.theta);
    html += `
      <div class="rep-item">
        <div>
          <strong>$(${rVal}, ${thTex})$</strong>
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
  document.getElementById('inputR').value = fmt(r);
  document.getElementById('inputTheta').value = formatAnglePlain(th);
  syncFromPolar('all');
};

// Event handlers: Apply Cartesian Inputs (Supports math expressions like sqrt(2))
window.applyCartesianInputs = function () {
  const strX = document.getElementById('inputX').value;
  const strY = document.getElementById('inputY').value;

  const valX = evaluateMath(strX);
  const valY = evaluateMath(strY);

  if (!isNaN(valX)) {
    state.x = valX;
    const px = document.getElementById('previewX');
    if (px) px.textContent = `≈ ${fmt(valX)}`;
  }
  if (!isNaN(valY)) {
    state.y = valY;
    const py = document.getElementById('previewY');
    if (py) py.textContent = `≈ ${fmt(valY)}`;
  }

  if (!isNaN(valX) && !isNaN(valY)) {
    syncFromCartesian('cartesian');
  }
};

// Event handlers: Apply Polar Inputs (Supports math expressions like 2*sqrt(3), pi/3)
window.applyPolarInputs = function () {
  const strR = document.getElementById('inputR').value;
  const strTheta = document.getElementById('inputTheta').value;

  const valR = evaluateMath(strR);
  const valTheta = evaluateMath(strTheta);

  if (!isNaN(valR)) {
    state.r = valR;
    const pr = document.getElementById('previewR');
    if (pr) pr.textContent = `≈ ${fmt(valR)}`;
  }
  if (!isNaN(valTheta)) {
    state.theta = valTheta;
    const pt = document.getElementById('previewTheta');
    const m = valTheta / Math.PI;
    if (pt) pt.textContent = `≈ ${m.toFixed(3)} π (${fmt(valTheta)} rad)`;
  }

  if (!isNaN(valR) && !isNaN(valTheta)) {
    syncFromPolar('polar');
  }
};

// Quick Angle Presets in Radians
window.applyPresetAngle = function (rad, text) {
  state.theta = rad;
  document.getElementById('inputTheta').value = text;
  syncFromPolar(false);
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
  document.getElementById('inputX').value = '3';
  document.getElementById('inputY').value = '3';
  syncFromCartesian(false);
};

// Snap Point to clean integer/special angle coordinates
window.snapPointToGrid = function () {
  if (state.gridMode === 'polar') {
    state.r = Math.round(state.r);
    state.theta = Math.round(state.theta / (Math.PI / 12)) * (Math.PI / 12);
    document.getElementById('inputR').value = fmt(state.r);
    document.getElementById('inputTheta').value = formatAnglePlain(state.theta);
    syncFromPolar(false);
  } else {
    state.x = Math.round(state.x);
    state.y = Math.round(state.y);
    document.getElementById('inputX').value = fmt(state.x);
    document.getElementById('inputY').value = fmt(state.y);
    syncFromCartesian(false);
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
// Canvas Drawing Routine (Pure Radians)
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
  const radiusRatio = w < 380 ? 0.81 : 0.87;
  const radiusPx = (w / 2) * radiusRatio;
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

  // 2. Draw Polar Grid if active (Pure Radians)
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

    // Radial Spokes (Pure Radians labels only)
    const angles = [
      { rad: 0, label: '0' },
      { rad: Math.PI / 6, label: 'π/6' },
      { rad: Math.PI / 4, label: 'π/4' },
      { rad: Math.PI / 3, label: 'π/3' },
      { rad: Math.PI / 2, label: 'π/2' },
      { rad: (2 * Math.PI) / 3, label: '2π/3' },
      { rad: (3 * Math.PI) / 4, label: '3π/4' },
      { rad: (5 * Math.PI) / 6, label: '5π/6' },
      { rad: Math.PI, label: 'π' },
      { rad: (7 * Math.PI) / 6, label: '7π/6' },
      { rad: (5 * Math.PI) / 4, label: '5π/4' },
      { rad: (4 * Math.PI) / 3, label: '4π/3' },
      { rad: (3 * Math.PI) / 2, label: '3π/2' },
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
      const labelDist = radiusPx + (w < 380 ? 11 : 14);
      const lx = cx + cosA * labelDist;
      const ly = cy - sinA * labelDist;
      ctx.fillStyle = '#7A5C3A';
      ctx.font = (w < 380 ? '9px' : '10px') + ' system-ui, sans-serif';
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
  if (w < 380) {
    ctx.fillText('X', cx + radiusPx + 6, cy + 14);
  } else {
    ctx.fillText('X (แกนเชิงขั้ว)', cx + radiusPx + 8, cy + 18);
  }
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

  // Angle Arc / Spiral Guide (ก้นหอยเมื่อหมุนเกิน 1 รอบ)
  if (chkAngleArc && Math.abs(state.theta) > 0.005) {
    ctx.save();
    const theta = state.theta;
    const absTheta = Math.abs(theta);
    const s = theta >= 0 ? 1 : -1;
    const ptDistPx = Math.hypot(ptCanvas.x - cx, ptCanvas.y - cy);

    if (absTheta > 2 * Math.PI) {
      // 🌀 Case A: Multi-turn angle (|theta| > 2*pi) -> Draw Archimedean Spiral!
      const turns = absTheta / (2 * Math.PI);
      const rStart = 16;
      // Cap maximum radius so spiral does not exceed the point or canvas boundary
      const rMax = Math.min(88, Math.max(34, ptDistPx * 0.72));
      const b = (rMax - rStart) / absTheta;

      // Sample points along the spiral
      const numSteps = Math.min(600, Math.max(90, Math.ceil(40 * turns)));
      ctx.beginPath();
      ctx.strokeStyle = '#2980b9';
      ctx.lineWidth = 2.0;

      let lastX = cx + rStart, lastY = cy;
      for (let i = 0; i <= numSteps; i++) {
        const phi = (i / numSteps) * absTheta;
        const currentR = rStart + b * phi;
        const currentAngle = s * phi;
        const px = cx + currentR * Math.cos(currentAngle);
        const py = cy - currentR * Math.sin(currentAngle);
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
        lastX = px;
        lastY = py;
      }
      ctx.stroke();

      // Tangent vector at the tip for the arrowhead:
      const tipAngle = s * absTheta;
      const dx = b * Math.cos(tipAngle) - s * rMax * Math.sin(tipAngle);
      const dy = -b * Math.sin(tipAngle) - s * rMax * Math.cos(tipAngle);
      const arrowTangent = Math.atan2(dy, dx);

      // Draw arrowhead at tip
      const arrowLen = 9;
      const arrowWing = 0.44;
      ctx.fillStyle = '#2980b9';
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(
        lastX - arrowLen * Math.cos(arrowTangent - arrowWing),
        lastY - arrowLen * Math.sin(arrowTangent - arrowWing)
      );
      ctx.lineTo(
        lastX - (arrowLen * 0.6) * Math.cos(arrowTangent),
        lastY - (arrowLen * 0.6) * Math.sin(arrowTangent)
      );
      ctx.lineTo(
        lastX - arrowLen * Math.cos(arrowTangent + arrowWing),
        lastY - arrowLen * Math.sin(arrowTangent + arrowWing)
      );
      ctx.closePath();
      ctx.fill();

      // Badge showing number of turns
      const turnLabel = `${(turns).toFixed(2)} รอบ`;
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.fillStyle = '#2980b9';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`🌀 ${turnLabel}`, lastX + 8, lastY - 4);

    } else {
      // Case B: Standard angle (|theta| <= 2*pi) -> Draw Circular Arc with Arrowhead
      const arcRadius = Math.min(34, Math.max(18, ptDistPx * 0.45));
      ctx.beginPath();
      if (s > 0) {
        ctx.arc(cx, cy, arcRadius, 0, -theta, true);
      } else {
        ctx.arc(cx, cy, arcRadius, 0, -theta, false);
      }
      ctx.strokeStyle = '#2980b9';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Arrowhead at the tip
      const tipX = cx + arcRadius * Math.cos(theta);
      const tipY = cy - arcRadius * Math.sin(theta);
      const arrowTangent = s > 0 ? -theta - Math.PI / 2 : -theta + Math.PI / 2;
      const arrowLen = 8;
      const arrowWing = 0.44;

      ctx.fillStyle = '#2980b9';
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(
        tipX - arrowLen * Math.cos(arrowTangent - arrowWing),
        tipY - arrowLen * Math.sin(arrowTangent - arrowWing)
      );
      ctx.lineTo(
        tipX - (arrowLen * 0.6) * Math.cos(arrowTangent),
        tipY - (arrowLen * 0.6) * Math.sin(arrowTangent)
      );
      ctx.lineTo(
        tipX - arrowLen * Math.cos(arrowTangent + arrowWing),
        tipY - arrowLen * Math.sin(arrowTangent + arrowWing)
      );
      ctx.closePath();
      ctx.fill();

      // Label theta near arc midpoint
      const midTheta = theta / 2;
      const arcLabelDist = arcRadius + 12;
      const alx = cx + Math.cos(midTheta) * arcLabelDist;
      const aly = cy - Math.sin(midTheta) * arcLabelDist;
      ctx.fillStyle = '#2980b9';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('θ', alx, aly);
    }
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
  ctx.beginPath();
  ctx.arc(ptCanvas.x, ptCanvas.y, 8, 0, 2 * Math.PI);
  ctx.fillStyle = '#b33939';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Label badge near point (Pure Radians & Exact Radical)
  if (chkLabels) {
    const rInfo = simplifyRExact(state.x, state.y);
    const labelX = ptCanvas.x + 10;
    const labelY = ptCanvas.y - 10;
    const textCart = `(${fmt(state.x)}, ${fmt(state.y)})`;
    const textPol = `[${rInfo.plain}, ${formatAnglePlain(state.theta)}]`;

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
// Tab Switching
// ==========================================
window.switchTab = function (tab) {
  document.getElementById('sectionExplorer').style.display = tab === 'explorer' ? 'block' : 'none';
  document.getElementById('sectionFormulas').style.display = tab === 'formulas' ? 'block' : 'none';

  document.getElementById('tabBtnExplorer').classList.toggle('active', tab === 'explorer');
  document.getElementById('tabBtnFormulas').classList.toggle('active', tab === 'formulas');

  if (tab === 'explorer') {
    drawGraph();
  }
  triggerMathJax();
};
