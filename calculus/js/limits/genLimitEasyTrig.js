function genLimitEasyTrig() {
  let k = rand(2, 5);
  let m = rand(1, 4);
  let probLatex = `\\lim_{x \\to 0} \\frac{\\sin(${k}x)}{${m === 1 ? "x" : `${m}x`}}`;
  let finalValLatex = toFrac(k, m);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: ตรวจสอบรูปแบบ</strong><br>
      เมื่อ $x \\to 0$ พบว่า $\\frac{\\sin(0)}{0} = \\frac{0}{0}$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: ใช้สมบัติลิมิตมาตรฐาน $\\lim_{\\theta \\to 0} \\frac{\\sin \\theta}{\\theta} = 1$</strong><br>
      จัดรูปมุมให้ตรงกันโดยคูณและหารด้วย $${k}$:<br>
      ${adaptiveMath(
        `\\lim_{x \\to 0} \\frac{\\sin(${k}x)}{${m === 1 ? "x" : `${m}x`}} = \\lim_{x \\to 0} \\left( \\frac{\\sin(${k}x)}{${k}x} \\cdot \\frac{${k}}{${m}} \\right)`,
        `\\lim_{x \\to 0} \\frac{\\sin(${k}x)}{${m === 1 ? "x" : `${m}x`}} &= \\lim_{x \\to 0} \\left( \\frac{\\sin(${k}x)}{${k}x} \\cdot \\frac{${k}}{${m}} \\right)`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่าลิมิต</strong><br>
      ${adaptiveMath(
        `= (1) \\cdot \\frac{${k}}{${m}} = ${finalValLatex}`,
        `&= (1) \\cdot \\frac{${k}}{${m}} \\\\ &= ${finalValLatex}`
      )}
      ดังนั้น $$\\lim_{x \\to 0} \\frac{\\sin(${k}x)}{${m === 1 ? "x" : `${m}x`}} = ${finalValLatex}$$
    </div>
  `;

  return {
    topic: "limit",
    category: "ลิมิต: ตรีโกณมิติพื้นฐาน",
    difficulty: "easy",
    probLatex: probLatex,
    ansLatex: finalValLatex,
    promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
    hintText: `ใช้สมบัติ $\\lim_{u \\to 0}\\frac{\\sin u}{u} = 1$ โดยปรับมุมให้เป็น $${k}x$`,
    solHtml: solText,
    exactNum: k,
    exactDen: m
  };
}
