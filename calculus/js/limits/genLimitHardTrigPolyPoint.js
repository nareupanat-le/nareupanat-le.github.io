function genLimitHardTrigPolyPoint() {
  let a = rand(1, 4);
  let a2 = a * a;
  let probLatex = `\\lim_{x \\to ${a}} \\frac{\\sin(x - ${a})}{x^2 - ${a2}}`;
  let finalNum = 1;
  let finalDen = 2 * a;
  let finalValLatex = toFrac(finalNum, finalDen);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: ตรวจสอบรูปแบบ</strong><br>
      แทนค่า $x = ${a}$ ได้ $\\frac{\\sin(0)}{${a2} - ${a2}} = \\frac{0}{0}$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: แยกตัวประกอบ $x^2 - ${a2} = (x - ${a})(x + ${a})$</strong><br>
      ${adaptiveMath(
        `\\lim_{x \\to ${a}} \\frac{\\sin(x - ${a})}{(x - ${a})(x + ${a})} = \\lim_{x \\to ${a}} \\left( \\frac{\\sin(x - ${a})}{x - ${a}} \\cdot \\frac{1}{x + ${a}} \\right)`,
        `\\lim_{x \\to ${a}} \\frac{\\sin(x - ${a})}{x^2 - ${a2}} &= \\lim_{x \\to ${a}} \\left( \\frac{\\sin(x - ${a})}{x - ${a}} \\cdot \\frac{1}{x + ${a}} \\right)`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: กำหนดตัวแปรเปลี่ยน $u = x - ${a}$</strong><br>
      เมื่อ $x \\to ${a}$ จะได้ว่า $u \\to 0$<br>
      จากลิมิตมาตรฐาน ทราบว่า $\\lim_{u \\to 0} \\frac{\\sin u}{u} = 1$<br>
      ${adaptiveMath(
        `= (1) \\cdot \\frac{1}{(${a}) + (${a})} = \\frac{1}{${2*a}} = ${finalValLatex}`,
        `&= (1) \\cdot \\frac{1}{(${a}) + (${a})} \\\\ &= \\frac{1}{${2*a}} = ${finalValLatex}`
      )}
      ดังนั้น $$\\lim_{x \\to ${a}} \\frac{\\sin(x - ${a})}{x^2 - ${a2}} = ${finalValLatex}$$
    </div>
  `;

  return {
    topic: "limit",
    category: "ลิมิต: ตรีโกณมิติผสมพหุนาม",
    difficulty: "hard",
    probLatex: probLatex,
    ansLatex: finalValLatex,
    promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
    hintText: `แยกตัวประกอบตัวส่วนเป็น $(x-${a})(x+${a})$ แล้วจับคู่กับ $\\sin(x-${a})$`,
    solHtml: solText,
    exactNum: finalNum,
    exactDen: finalDen
  };
}
