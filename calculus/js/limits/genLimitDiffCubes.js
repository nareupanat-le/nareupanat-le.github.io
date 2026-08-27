function genLimitDiffCubes() {
  let a = rand(2, 5);
  let a3 = a * a * a;
  let probLatex = `\\lim_{x \\to ${a}} \\frac{x^3 - ${a3}}{x - ${a}}`;
  let finalVal = 3 * a * a;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: ตรวจสอบรูปแบบ</strong><br>
      แทนค่า $x = ${a}$ ในโจทย์ จะได้ผลลัพธ์ในรูปแบบไม่กำหนด $\\frac{0}{0}$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: ใช้เอกลักษณ์ผลต่างกำลังสาม $x^3 - a^3 = (x-a)(x^2 + ax + a^2)$</strong><br>
      ${adaptiveMath(
        `\\lim_{x \\to ${a}} \\frac{x^3 - ${a3}}{x - ${a}} = \\lim_{x \\to ${a}} \\frac{(x - ${a})(x^2 + ${a}x + ${a*a})}{x - ${a}}`,
        `\\lim_{x \\to ${a}} \\frac{x^3 - ${a3}}{x - ${a}} &= \\lim_{x \\to ${a}} \\frac{(x - ${a})(x^2 + ${a}x + ${a*a})}{x - ${a}}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: ตัดทอนพจน์ร่วม $(x - ${a})$ และแทนค่า $x = ${a}$</strong><br>
      ${adaptiveMath(
        `= \\lim_{x \\to ${a}} (x^2 + ${a}x + ${a*a}) = (${a})^2 + ${a}(${a}) + ${a*a} = ${finalVal}`,
        `&= \\lim_{x \\to ${a}} (x^2 + ${a}x + ${a*a}) \\\\ &= (${a})^2 + ${a}(${a}) + ${a*a} \\\\ &= ${finalVal}`
      )}
      ดังนั้น $$\\lim_{x \\to ${a}} \\frac{x^3 - ${a3}}{x - ${a}} = ${finalVal}$$
    </div>
  `;

  return {
    topic: "limit",
    category: "ลิมิต: ผลต่างกำลังสาม",
    difficulty: "easy",
    probLatex: probLatex,
    ansLatex: `${finalVal}`,
    promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
    hintText: `ใช้เอกลักษณ์ $x^3 - ${a3} = (x - ${a})(x^2 + ${a}x + ${a*a})$`,
    solHtml: solText,
    exactNum: finalVal,
    exactDen: 1
  };
}
