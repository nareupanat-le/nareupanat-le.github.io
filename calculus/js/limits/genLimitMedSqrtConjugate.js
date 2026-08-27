function genLimitMedSqrtConjugate() {
  let a = rand(-2, 3);
  let k = rand(1, 2);
  let c = rand(1, 3);
  let b = c * c - k * a;
  let rootStr = formatRoot2(k, b);
  let termCancel = (a === 0) ? "x" : (a > 0 ? `x - ${a}` : `x + ${Math.abs(a)}`);

  let rootPart = `${rootStr} - ${c}`;
  let conj = `${rootStr} + ${c}`;
  let factorMultiplier = k;

  let p = rand(1, 2);
  let polyExp = (p === 1) ? termCancel : `${p}(${termCancel})`;
  if (p === 1 && a === 0) polyExp = "x";
  else if (p > 1 && a === 0) polyExp = `${p}x`;

  let probLatex = `\\lim_{x \\to ${a}} \\frac{${rootPart}}{${polyExp}}`;
  let numSimpText = factorMultiplier === 1 ? `(${termCancel})` : `${factorMultiplier}(${termCancel})`;
  let numAfterCancel = `${factorMultiplier}`;
  let denAfterCancel = (p === 1) ? `(${conj})` : `${p}(${conj})`;

  let finalNum = factorMultiplier;
  let finalDen = p * (2 * c);
  let finalValLatex = toFrac(finalNum, finalDen);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: ตรวจสอบรูปแบบ</strong><br>
      แทนค่า $x = ${a}$ พบว่าอยู่ในรูปแบบ $\\frac{0}{0}$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: คูณด้วยสังยุค (Conjugate) $(${conj})$ ทั้งเศษและส่วน</strong><br>
      ${adaptiveMath(
        `\\lim_{x \\to ${a}} \\frac{${rootPart}}{${polyExp}} = \\lim_{x \\to ${a}} \\frac{(${rootPart})(${conj})}{(${polyExp})(${conj})}`,
        `\\lim_{x \\to ${a}} \\frac{${rootPart}}{${polyExp}} &= \\lim_{x \\to ${a}} \\frac{(${rootPart})(${conj})}{(${polyExp})(${conj})}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: จัดรูปผลต่างกำลังสองที่ตัวเศษ</strong><br>
      ${adaptiveMath(
        `= \\lim_{x \\to ${a}} \\frac{${numSimpText}}{(${polyExp})(${conj})}`,
        `&= \\lim_{x \\to ${a}} \\frac{${numSimpText}}{(${polyExp})(${conj})}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 4: ตัดทอนพจน์ร่วม $(${termCancel})$ ออก และแทนค่า $x = ${a}$</strong><br>
      ${adaptiveMath(
        `= \\lim_{x \\to ${a}} \\frac{${numAfterCancel}}{${denAfterCancel}} = \\frac{${numAfterCancel}}{${finalDen}} = ${finalValLatex}`,
        `&= \\lim_{x \\to ${a}} \\frac{${numAfterCancel}}{${denAfterCancel}} \\\\ &= \\frac{${numAfterCancel}}{${finalDen}} = ${finalValLatex}`
      )}
      ดังนั้น $$\\lim_{x \\to ${a}} \\frac{${rootPart}}{${polyExp}} = ${finalValLatex}$$
    </div>
  `;

  return {
    topic: "limit",
    category: "ลิมิต: สังยุครากที่สอง",
    difficulty: "med",
    probLatex: probLatex,
    ansLatex: finalValLatex,
    promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
    hintText: `คูณด้วยสังยุค $(${conj})$ ทั้งเศษและส่วนเพื่อกำจัดเครื่องหมายกรณฑ์`,
    solHtml: solText,
    exactNum: finalNum,
    exactDen: finalDen
  };
}
