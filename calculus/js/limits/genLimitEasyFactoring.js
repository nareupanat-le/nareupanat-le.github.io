function genLimitEasyFactoring() {
  let a = randNonZero(-4, 4);
  let a2 = a * a;
  let absA = Math.abs(a);
  let termCancel = (a > 0) ? `x - ${a}` : `x + ${absA}`;
  let termOther = (a > 0) ? `x + ${a}` : `x - ${absA}`;
  let probLatex = `\\lim_{x \\to ${a}} \\frac{x^2 - ${a2}}{${termCancel}}`;
  let finalVal = 2 * a;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: ตรวจสอบรูปแบบ</strong><br>
      แทนค่า $x = ${a}$ ในโจทย์ จะได้ผลลัพธ์ในรูปแบบไม่กำหนด $\\frac{0}{0}$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: แยกตัวประกอบผลต่างกำลังสองที่ตัวเศษ</strong><br>
      ${adaptiveMath(
        `\\lim_{x \\to ${a}} \\frac{x^2 - ${a2}}{${termCancel}} = \\lim_{x \\to ${a}} \\frac{(${termCancel})(${termOther})}{${termCancel}}`,
        `\\lim_{x \\to ${a}} \\frac{x^2 - ${a2}}{${termCancel}} &= \\lim_{x \\to ${a}} \\frac{(${termCancel})(${termOther})}{${termCancel}}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: ตัดทอนพจน์ร่วม $(${termCancel})$ และแทนค่า $x = ${a}$</strong><br>
      ${adaptiveMath(
        `= \\lim_{x \\to ${a}} (${termOther}) = (${a}) ${a > 0 ? `+ ${a}` : `- ${absA}`} = ${finalVal}`,
        `&= \\lim_{x \\to ${a}} (${termOther}) \\\\ &= (${a}) ${a > 0 ? `+ ${a}` : `- ${absA}`} \\\\ &= ${finalVal}`
      )}
      ดังนั้น $$\\lim_{x \\to ${a}} \\frac{x^2 - ${a2}}{${termCancel}} = ${finalVal}$$
    </div>
  `;

  return {
    topic: "limit",
    category: "ลิมิต: การแยกตัวประกอบผลต่างกำลังสอง",
    difficulty: "easy",
    probLatex: probLatex,
    ansLatex: `${finalVal}`,
    promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
    hintText: `ใช้เอกลักษณ์ $x^2 - ${a2} = (${termCancel})(${termOther})$ แล้วตัดทอนพจน์ร่วม $(${termCancel})$ ออก`,
    solHtml: solText,
    exactNum: finalVal,
    exactDen: 1
  };
}
