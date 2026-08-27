function genLimitHardDoubleConjugate() {
  let a = rand(1, 3);
  let c = rand(1, 3);
  let p = rand(1, 3);
  let q = rand(1, 3);
  let p2 = p * p;
  let q2 = q * q;

  let numRoot = `\\sqrt{${a === 1 ? "x" : `${a}x`} + ${p2}} - ${p}`;
  let denRoot = `\\sqrt{${c === 1 ? "x" : `${c}x`} + ${q2}} - ${q}`;
  let probLatex = `\\lim_{x \\to 0} \\frac{${numRoot}}{${denRoot}}`;

  let conjNum = `\\sqrt{${a === 1 ? "x" : `${a}x`} + ${p2}} + ${p}`;
  let conjDen = `\\sqrt{${c === 1 ? "x" : `${c}x`} + ${q2}} + ${q}`;

  let finalNum = a * q;
  let finalDen = c * p;
  let finalValLatex = toFrac(finalNum, finalDen);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: ตรวจสอบรูปแบบ</strong><br>
      แทนค่า $x = 0$ จะได้ $\\frac{\\sqrt{${p2}} - ${p}}{\\sqrt{${q2}} - ${q}} = \\frac{0}{0}$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: คูณด้วยสังยุคของทั้งตัวเศษและตัวส่วนพร้อมกัน (Double Conjugates)</strong><br>
      คูณด้วย $(${conjNum})$ และ $(${conjDen})$ ทั้งเศษและส่วน:<br>
      ${adaptiveMath(
        `\\lim_{x \\to 0} \\frac{(${numRoot})(${conjNum})(${conjDen})}{(${denRoot})(${conjDen})(${conjNum})}`,
        `\\lim_{x \\to 0} \\frac{${numRoot}}{${denRoot}} &= \\lim_{x \\to 0} \\frac{(${numRoot})(${conjNum})(${conjDen})}{(${denRoot})(${conjDen})(${conjNum})}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: ยุบผลต่างกำลังสองทั้งเศษและส่วน</strong><br>
      สังเกตว่า $(${numRoot})(${conjNum}) = ${a === 1 ? "x" : `${a}x`}$ และ $(${denRoot})(${conjDen}) = ${c === 1 ? "x" : `${c}x`}$<br>
      ${adaptiveMath(
        `= \\lim_{x \\to 0} \\frac{(${a === 1 ? "x" : `${a}x`})(${conjDen})}{(${c === 1 ? "x" : `${c}x`})(${conjNum})}`,
        `&= \\lim_{x \\to 0} \\frac{(${a === 1 ? "x" : `${a}x`})(${conjDen})}{(${c === 1 ? "x" : `${c}x`})(${conjNum})}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 4: ตัดทอน $x$ และแทนค่า $x = 0$</strong><br>
      ${adaptiveMath(
        `= \\lim_{x \\to 0} \\frac{${a}(${conjDen})}{${c}(${conjNum})} = \\frac{${a}(${2*q})}{${c}(${2*p})} = ${finalValLatex}`,
        `&= \\lim_{x \\to 0} \\frac{${a}(${conjDen})}{${c}(${conjNum})} \\\\ &= \\frac{${a}(${2*q})}{${c}(${2*p})} = ${finalValLatex}`
      )}
      ดังนั้น $$\\lim_{x \\to 0} \\frac{${numRoot}}{${denRoot}} = ${finalValLatex}$$
    </div>
  `;

  return {
    topic: "limit",
    category: "ลิมิต: สังยุคซ้อนทั้งเศษและส่วน",
    difficulty: "hard",
    probLatex: probLatex,
    ansLatex: finalValLatex,
    promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
    hintText: `เนื่องจากติดกรณฑ์ทั้งเศษและส่วน ต้องคูณด้วยสังยุคของทั้งเศษและส่วนพร้อมกัน`,
    solHtml: solText,
    exactNum: finalNum,
    exactDen: finalDen
  };
}
