function genLimitMedCbrtConjugate() {
  let a = rand(-2, 2);
  let k = rand(1, 2);
  let c = rand(1, 2);
  let b = c * c * c - k * a;
  let rootStr = formatRoot3(k, b);
  let termCancel = (a === 0) ? "x" : (a > 0 ? `x - ${a}` : `x + ${Math.abs(a)}`);

  let rootPart = `${rootStr} - ${c}`;
  let factorMultiplier = k;

  let u2 = `(${rootStr})^{2}`;
  let uv = (c === 1) ? `${rootStr}` : `${c}${rootStr}`;
  let v2 = `${c * c}`;
  let conj = `${u2} + ${uv} + ${v2}`;
  let conjVal = 3 * c * c;

  let p = rand(1, 2);
  let polyExp = (p === 1) ? termCancel : `${p}(${termCancel})`;
  if (p === 1 && a === 0) polyExp = "x";
  else if (p > 1 && a === 0) polyExp = `${p}x`;

  let probLatex = `\\lim_{x \\to ${a}} \\frac{${rootPart}}{${polyExp}}`;
  let finalNum = factorMultiplier;
  let finalDen = p * conjVal;
  let finalValLatex = toFrac(finalNum, finalDen);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: ตรวจสอบรูปแบบ</strong><br>
      แทนค่า $x = ${a}$ ได้ผลลัพธ์ $\\frac{0}{0}$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: ใช้เอกลักษณ์ผลต่างกำลังสาม $(A-B)(A^2+AB+B^2) = A^3 - B^3$</strong><br>
      คูณด้วยสังยุครากที่สามทั้งเศษและส่วน:<br>
      ${adaptiveMath(
        `\\lim_{x \\to ${a}} \\frac{${rootPart}}{${polyExp}} = \\lim_{x \\to ${a}} \\frac{(${rootPart})(${conj})}{(${polyExp})(${conj})}`,
        `\\lim_{x \\to ${a}} \\frac{${rootPart}}{${polyExp}} &= \\lim_{x \\to ${a}} \\frac{(${rootPart})(${conj})}{(${polyExp})(${conj})}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: จัดรูปตัวเศษ</strong><br>
      ${adaptiveMath(
        `= \\lim_{x \\to ${a}} \\frac{${factorMultiplier === 1 ? "" : factorMultiplier}(${termCancel})}{(${polyExp})(${conj})}`,
        `&= \\lim_{x \\to ${a}} \\frac{${factorMultiplier === 1 ? "" : factorMultiplier}(${termCancel})}{(${polyExp})(${conj})}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 4: ตัดทอนพจน์ร่วม $(${termCancel})$ และแทนค่า $x = ${a}$</strong><br>
      สังเกตว่าเมื่อ $x = ${a}$ พจน์สังยุคจะมีค่า $(${c})^2 + (${c})(${c}) + ${c*c} = ${conjVal}$<br>
      ${adaptiveMath(
        `= \\frac{${factorMultiplier}}{(${p})(${conjVal})} = ${finalValLatex}`,
        `&= \\frac{${factorMultiplier}}{(${p})(${conjVal})} \\\\ &= ${finalValLatex}`
      )}
      ดังนั้น $$\\lim_{x \\to ${a}} \\frac{${rootPart}}{${polyExp}} = ${finalValLatex}$$
    </div>
  `;

  return {
    topic: "limit",
    category: "ลิมิต: สังยุครากที่สาม",
    difficulty: "med",
    probLatex: probLatex,
    ansLatex: finalValLatex,
    promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
    hintText: `ใช้เอกลักษณ์ $(A-B)(A^2+AB+B^2) = A^3 - B^3$`,
    solHtml: solText,
    exactNum: finalNum,
    exactDen: finalDen
  };
}
