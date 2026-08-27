function genLimitTrigCotCsc() {
  let a = rand(2, 6);
  let b = rand(2, 4);
  let k = rand(2, 5);

  let probLatex = `\\lim_{x \\to 0} \\frac{${a}x \\cot(${k}x)}{${b}}`;
  let numVal = a;
  let denVal = b * k;
  let finalValLatex = toFrac(numVal, denVal);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: เปลี่ยนรูป $\\cot(${k}x) = \\frac{1}{\\tan(${k}x)}$</strong><br>
      ${adaptiveMath(
        `\\lim_{x \\to 0} \\frac{${a}x \\cot(${k}x)}{${b}} = \\lim_{x \\to 0} \\frac{${a}x}{${b}\\tan(${k}x)}`,
        `\\lim_{x \\to 0} \\frac{${a}x \\cot(${k}x)}{${b}} &= \\lim_{x \\to 0} \\frac{${a}x}{${b}\\tan(${k}x)}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: ใช้สมบัติลิมิตมาตรฐาน $\\lim_{x \\to 0}\\frac{\\tan(kx)}{x} = k$ หรือ $\\lim_{x \\to 0}\\frac{x}{\\tan(kx)} = \\frac{1}{k}$</strong><br>
      ${adaptiveMath(
        `= \\frac{${a}}{${b}} \\cdot \\lim_{x \\to 0} \\frac{x}{\\tan(${k}x)} = \\frac{${a}}{${b}} \\cdot \\frac{1}{${k}} = ${finalValLatex}`,
        `&= \\frac{${a}}{${b}} \\cdot \\lim_{x \\to 0} \\frac{x}{\\tan(${k}x)} \\\\ &= \\frac{${a}}{${b}} \\cdot \\frac{1}{${k}} \\\\ &= ${finalValLatex}`
      )}
      ดังนั้น $$\\lim_{x \\to 0} \\frac{${a}x \\cot(${k}x)}{${b}} = ${finalValLatex}$$
    </div>
  `;

  return {
    topic: "limit",
    category: "ลิมิต: ตรีโกณมิติส่วนกลับ (Cot/Csc)",
    difficulty: "med",
    probLatex: probLatex,
    ansLatex: finalValLatex,
    promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
    hintText: `แปลง $\\cot(kx) = \\frac{1}{\\tan(kx)}$ แล้วใช้ลิมิตพื้นฐาน $\\lim_{x \\to 0}\\frac{x}{\\tan(kx)} = \\frac{1}{k}$`,
    solHtml: solText,
    exactNum: numVal,
    exactDen: denVal
  };
}
