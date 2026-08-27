function genLimitInfinityPolyRatio() {
  let a = rand(2, 6);
  let b = rand(2, 5);
  let c = randNonZero(-5, 5);
  let d = randNonZero(-5, 5);
  let deg = rand(2, 4);

  let numLatex = `${a}x^{${deg}} ${c > 0 ? `+ ${c}x` : `- ${Math.abs(c)}x`}`;
  let denLatex = `${b}x^{${deg}} ${d > 0 ? `+ ${d}` : `- ${Math.abs(d)}`}`;
  let probLatex = `\\lim_{x \\to \\infty} \\frac{${numLatex}}{${denLatex}}`;
  let finalValLatex = toFrac(a, b);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: ตรวจสอบรูปแบบเมื่อ $x \\to \\infty$</strong><br>
      เมื่อแทน $x \\to \\infty$ จะได้รูปแบบไม่กำหนด $\\frac{\\infty}{\\infty}$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: นำตัวแปรดีกรีสูงสุดคือ $x^{${deg}}$ ไปหารทั้งเศษและส่วน</strong><br>
      ${adaptiveMath(
        `\\lim_{x \\to \\infty} \\frac{\\frac{${numLatex}}{x^{${deg}}}}{\\frac{${denLatex}}{x^{${deg}}}} = \\lim_{x \\to \\infty} \\frac{${a} ${c > 0 ? `+` : `-`} \\frac{${Math.abs(c)}}{x^{${deg-1}}}}{${b} ${d > 0 ? `+` : `-`} \\frac{${Math.abs(d)}}{x^{${deg}}}}`,
        `\\lim_{x \\to \\infty} \\frac{${numLatex}}{${denLatex}} &= \\lim_{x \\to \\infty} \\frac{${a} ${c > 0 ? `+` : `-`} \\frac{${Math.abs(c)}}{x^{${deg-1}}}}{${b} ${d > 0 ? `+` : `-`} \\frac{${Math.abs(d)}}{x^{${deg}}}}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: ใช้สมบัติ $\\lim_{x \\to \\infty}\\frac{k}{x^p} = 0$ เมื่อ $p > 0$</strong><br>
      ${adaptiveMath(
        `= \\frac{${a} - 0}{${b} + 0} = ${finalValLatex}`,
        `&= \\frac{${a} - 0}{${b} + 0} \\\\ &= ${finalValLatex}`
      )}
      ดังนั้น $$\\lim_{x \\to \\infty} \\frac{${numLatex}}{${denLatex}} = ${finalValLatex}$$
    </div>
  `;

  return {
    topic: "limit",
    category: "ลิมิตที่อนันต์: ฟังก์ชันตรรกยะ",
    difficulty: "med",
    probLatex: probLatex,
    ansLatex: finalValLatex,
    promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
    hintText: `นำ $x^{${deg}}$ ดีกรีสูงสุดหารทั้งเศษและส่วน`,
    solHtml: solText,
    exactNum: a,
    exactDen: b
  };
}
