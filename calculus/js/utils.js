// ==========================================
// 1. Math Utility Functions (แม่นยำ 100%)
// ==========================================
function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { let t = b; b = a % b; a = t; }
  return a || 1;
}

function toFrac(n, d) {
  if (d === 0) return "\\text{หาค่าไม่ได้}";
  if (n === 0) return "0";
  if (d < 0) { n = -n; d = -d; }
  let g = gcd(n, d);
  n /= g; d /= g;
  if (d === 1) return `${n}`;
  if (n < 0) return `-\\frac{${Math.abs(n)}}{${d}}`;
  return `\\frac{${n}}{${d}}`;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randNonZero(min, max) {
  let val = 0;
  while (val === 0) {
    val = rand(min, max);
  }
  return val;
}

function poly1(p, q) {
  if (p === 0) return `${q}`;
  let termX = (p === 1) ? "x" : (p === -1 ? "-x" : `${p}x`);
  if (q === 0) return termX;
  return q > 0 ? `${termX} + ${q}` : `${termX} - ${Math.abs(q)}`;
}

function poly2(A, B, C) {
  let res = "";
  if (A === 1) res += "x^{2}";
  else if (A === -1) res += "-x^{2}";
  else if (A !== 0) res += `${A}x^{2}`;

  if (B !== 0) {
    let sign = B > 0 ? (res ? " + " : "") : (res ? " - " : "-");
    let absB = Math.abs(B);
    let termX = absB === 1 ? "x" : `${absB}x`;
    res += `${sign}${termX}`;
  }
  if (C !== 0) {
    let sign = C > 0 ? (res ? " + " : "") : (res ? " - " : "-");
    res += `${sign}${Math.abs(C)}`;
  }
  return res || "0";
}

function poly3(A, B, C, D) {
  let res = "";
  if (A === 1) res += "x^{3}";
  else if (A === -1) res += "-x^{3}";
  else if (A !== 0) res += `${A}x^{3}`;

  if (B !== 0) {
    let sign = B > 0 ? (res ? " + " : "") : (res ? " - " : "-");
    let absB = Math.abs(B);
    let termX = absB === 1 ? "x^{2}" : `${absB}x^{2}`;
    res += `${sign}${termX}`;
  }
  if (C !== 0) {
    let sign = C > 0 ? (res ? " + " : "") : (res ? " - " : "-");
    let absC = Math.abs(C);
    let termX = absC === 1 ? "x" : `${absC}x`;
    res += `${sign}${termX}`;
  }
  if (D !== 0) {
    let sign = D > 0 ? (res ? " + " : "") : (res ? " - " : "-");
    res += `${sign}${Math.abs(D)}`;
  }
  return res || "0";
}

function formatRoot2(k, b) {
  let termX = (k === 1) ? "x" : `${k}x`;
  if (b === 0) return `\\sqrt{${termX}}`;
  return b > 0 ? `\\sqrt{${termX} + ${b}}` : `\\sqrt{${termX} - ${Math.abs(b)}}`;
}

function formatRoot3(k, b) {
  let termX = (k === 1) ? "x" : `${k}x`;
  if (b === 0) return `\\sqrt[3]{${termX}}`;
  return b > 0 ? `\\sqrt[3]{${termX} + ${b}}` : `\\sqrt[3]{${termX} - ${Math.abs(b)}}`;
}

function adaptiveMath(singleLatex, alignLatex) {
  return `
    <div class="adaptive-math">
      <div class="math-single">$$\\displaystyle ${singleLatex}$$</div>
      <div class="math-align">$$\\begin{align*} ${alignLatex} \\end{align*}$$</div>
    </div>
  `;
}

function adaptMathEquations() {
  const isMobile = window.innerWidth <= 600;
  const blocks = document.querySelectorAll('.adaptive-math');
  blocks.forEach(block => {
    if (isMobile) {
      block.classList.add('use-align');
      return;
    }
    block.classList.remove('use-align');
    const singleEl = block.querySelector('.math-single');
    if (!singleEl) return;
    const mjxEl = singleEl.querySelector('mjx-container') || singleEl;
    const containerWidth = block.clientWidth;
    const mathWidth = mjxEl.scrollWidth || singleEl.scrollWidth;

    if (containerWidth > 0 && mathWidth > containerWidth + 2) {
      block.classList.add('use-align');
    }
  });
}

function safeRenderMath(element) {
  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise(element ? [element] : []).then(function() {
      setTimeout(adaptMathEquations, 50);
    }).catch(function(err) {
      console.warn("MathJax error:", err);
    });
  }
}

window.addEventListener('resize', function() {
  adaptMathEquations();
});

// =========================================================
// 2. คลังโจทย์ลิมิต 12 รูปแบบ (Limit Generators Suite)
// =========================================================

// 2.1 ลิมิตแยกตัวประกอบผลต่างกำลังสอง


// 2.2 ลิมิตตรีโกณมิติพื้นฐาน


// 2.3 ลิมิตเอกซ์โพเนนเชียลพื้นฐาน


// 2.4 การแยกตัวประกอบพหุนามทั่วไป


// 2.5 สังยุครากที่สองเดี่ยว


// 2.6 สังยุครากที่สาม


// 2.7 เศษส่วนซ้อน


// 2.8 สังยุคซ้อนทั้งเศษและส่วน


// 2.9 ลิมิตตรีโกณมิติกำลังสาม


// 2.10 ลิมิตตรีโกณมิติผสมผลคูณ


// 2.11 ลิมิตอนันต์ในรูปผลต่างกรณฑ์


// 2.12 ลิมิตผสมตรีโกณมิติและพหุนามที่จุด x -> a


// 2.13 ลิมิตค่าสัมบูรณ์ทางเดียว (One-sided Limits with Absolute Value)


// 2.14 ลิมิตผลต่างกำลังสาม (Difference of Cubes)


// 2.15 ลิมิตที่อนันต์ของฟังก์ชันตรรกยะ (Limits at Infinity - Rational)


// 2.16 ลิมิตที่อนันต์ติดกรณฑ์เมื่อ x -> -infinity (Radical Limit at -Infinity)


// 2.17 ลิมิตลอปีตาล: เอกซ์โพเนนเชียลกับตรีโกณมิติ


// 2.18 ลิมิตลอปีตาลหาอนุพันธ์ 2 ครั้ง


// 2.19 ลิมิตตรีโกณมิติส่วนกลับ (Cotangent & Cosecant Limits)


// 2.20 ลิมิตผลต่างแทนเจนต์และไซน์ (Tan & Sin Limit with x^3)


// =========================================================
// 3. คลังโจทย์อนุพันธ์ (Derivative Generators Suite)
// =========================================================

// 3.1 พหุนามกำลังสาม


// 3.2 ตรีโกณมิติพื้นฐาน + กฎลูกโซ่ 1 ชั้น


// 3.3 เอกซ์โพเนนเชียลพื้นฐาน


// 3.4 สมการเส้นสัมผัสพหุนาม


// 3.5 กฎผลคูณ: พหุนาม × เอกซ์โพเนนเชียล


// 3.6 กฎผลหารฟังก์ชันตรรกยะ


// 3.7 กฎลูกโซ่กรณฑ์


// 3.8 กฎลูกโซ่ลอการิทึม


// 3.9 ตรีโกณมิติผกผันพื้นฐาน


// 3.10 การหาอนุพันธ์โดยใช้ลอการิทึม


// 3.11 ฟังก์ชันผสมการสั่นสะเทือนแบบหน่วง


// 3.12 เอกลักษณ์ตรีโกณมิติผกผันแบบหักล้าง


// 3.13 ตรีโกณมิติผกผันของฟังก์ชันตรรกยะ


// 3.14 สมบัติลอการิทึมกับกรณฑ์และผลหาร


// 3.15 การหาอนุพันธ์อันดับสอง


// 3.16 อนุพันธ์เลขยกกำลังตรรกยะและติดลบ (Fractional & Negative Powers)


// 3.17 อนุพันธ์ผลคูณพหุนาม (Product Rule of Polynomials)


// 3.18 ตรีโกณมิติเซแคนต์และแทนเจนต์ (Secant & Tangent Derivatives)


// 3.19 ตรีโกณมิติแทนเจนต์และกฎลูกโซ่ (Tangent with Chain Rule)


// 3.20 ตรีโกณมิติโคเซแคนต์และโคแทนเจนต์ (Csc & Cot Derivatives)


// 3.21 ฟังก์ชันเอกซ์โพเนนเชียลฐานทั่วไป a^u (General Exponential)


// 3.22 สมการเส้นปกติของเส้นโค้ง (Normal Line Application)


// 3.23 อนุพันธ์โดยปริยาย: สมการวงกลม (Implicit Differentiation - Circle)


// 3.24 อนุพันธ์โดยปริยาย: พหุนามผสม xy (Implicit Differentiation - Polynomial)


// 3.25 ตรีโกณมิติโคแทนเจนต์และโคเซแคนต์ (Pure Cotangent & Cosecant)


// 3.26 ตรีโกณมิติผกผันอาร์กโคไซน์และอาร์กคอต (ArcCos & ArcCot Derivatives)


// 3.27 ตรีโกณมิติผกผันอาร์กเซกและอาร์กโคเซก (ArcSec & ArcCsc Derivatives)


// 3.28 ฟังก์ชันผสม: พหุนามคูณโคแทนเจนต์ (Polynomial times Cotangent)


// 3.29 ฟังก์ชันผสม: เอกซ์โพเนนเชียลคูณตรีโกณมิติผกผัน (Exponential times Inverse Trig)


// 3.30 ฟังก์ชันประกอบ: ตรีโกณซ้อนตรีโกณผกผัน (Nested Trig of Inverse Trig)


// 3.31 ผลหารตรีโกณมิติและผลบวกตรีโกณ (Quotient of Trigonometric Functions)


// 3.32 ลอการิทึมของฟังก์ชันเอกซ์โปผสมตรีโกณ (Log of Exp & Trig Composition)


// ==========================================