function genLimitHardTrigCube() {
  let k = rand(2, 4);
  let probLatex = `\\lim_{x \\to 0} \\frac{\\tan(${k}x) - \\sin(${k}x)}{x^3}`;
  let finalNum = k * k * k;
  let finalDen = 2;
  let finalValLatex = toFrac(finalNum, finalDen);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: ตรวจสอบรูปแบบ</strong><br>
      เมื่อ $x \\to 0$ จะได้ $\\frac{0 - 0}{0} = \\frac{0}{0}$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: แปลง $\\tan(${k}x) = \\frac{\\sin(${k}x)}{\\cos(${k}x)}$ และดึงตัวร่วม</strong><br>
      ${adaptiveMath(
        `\\tan(${k}x) - \\sin(${k}x) = \\frac{\\sin(${k}x)(1 - \\cos(${k}x))}{\\cos(${k}x)}`,
        `\\tan(${k}x) - \\sin(${k}x) &= \\frac{\\sin(${k}x) - \\sin(${k}x)\\cos(${k}x)}{\\cos(${k}x)} \\\\ &= \\frac{\\sin(${k}x)(1 - \\cos(${k}x))}{\\cos(${k}x)}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: กระจายพจน์ $x^3 = x \\cdot x^2$ แยกตามฟังก์ชัน</strong><br>
      ${adaptiveMath(
        `\\lim_{x \\to 0} \\frac{\\sin(${k}x)}{x} \\cdot \\frac{1 - \\cos(${k}x)}{x^2} \\cdot \\frac{1}{\\cos(${k}x)}`,
        `\\lim_{x \\to 0} \\frac{\\tan(${k}x) - \\sin(${k}x)}{x^3} &= \\lim_{x \\to 0} \\left( \\frac{\\sin(${k}x)}{x} \\cdot \\frac{1 - \\cos(${k}x)}{x^2} \\cdot \\frac{1}{\\cos(${k}x)} \\right)`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 4: คำนวณค่าลิมิตแต่ละส่วน</strong><br>
      ทราบว่า $\\lim_{x \\to 0}\\frac{\\sin(${k}x)}{x} = ${k}$, $\\lim_{x \\to 0}\\frac{1-\\cos(${k}x)}{x^2} = \\frac{${k}^2}{2} = \\frac{${k*k}}{2}$ และ $\\lim_{x \\to 0}\\cos(${k}x) = 1$<br>
      ${adaptiveMath(
        `= (${k}) \\cdot \\left(\\frac{${k*k}}{2}\\right) \\cdot 1 = ${finalValLatex}`,
        `&= (${k}) \\cdot \\left(\\frac{${k*k}}{2}\\right) \\cdot (1) \\\\ &= ${finalValLatex}`
      )}
      ดังนั้น $$\\lim_{x \\to 0} \\frac{\\tan(${k}x) - \\sin(${k}x)}{x^3} = ${finalValLatex}$$
    </div>
  `;

  return {
    topic: "limit",
    category: "ลิมิต: ตรีโกณมิติกำลังสาม",
    difficulty: "hard",
    probLatex: probLatex,
    ansLatex: finalValLatex,
    promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
    hintText: `เปลี่ยน $\\tan = \\frac{\\sin}{\\cos}$ แล้วดึงตัวร่วม $\\sin(${k}x)(1-\\cos(${k}x))$`,
    solHtml: solText,
    exactNum: finalNum,
    exactDen: finalDen
  };
}
