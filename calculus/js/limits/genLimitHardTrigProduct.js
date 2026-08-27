function genLimitHardTrigProduct() {
  let k = rand(2, 4);
  let m = rand(1, 4);
  let probLatex = `\\lim_{x \\to 0} \\frac{1 - \\cos(${k}x)}{x\\sin(${m === 1 ? "x" : `${m}x`})}`;
  let finalNum = k * k;
  let finalDen = 2 * m;
  let finalValLatex = toFrac(finalNum, finalDen);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: ตรวจสอบรูปแบบ</strong><br>
      แทน $x = 0$ ได้ $\\frac{1 - 1}{0} = \\frac{0}{0}$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: จัดรูปโดยหารด้วย $x^2$ ทั้งเศษและส่วน</strong><br>
      ${adaptiveMath(
        `\\lim_{x \\to 0} \\frac{\\frac{1 - \\cos(${k}x)}{x^2}}{\\frac{x\\sin(${m === 1 ? "x" : `${m}x`})}{x^2}} = \\lim_{x \\to 0} \\frac{\\frac{1 - \\cos(${k}x)}{x^2}}{\\frac{\\sin(${m === 1 ? "x" : `${m}x`})}{x}}`,
        `\\lim_{x \\to 0} \\frac{1 - \\cos(${k}x)}{x\\sin(${m === 1 ? "x" : `${m}x`})} &= \\lim_{x \\to 0} \\frac{\\frac{1 - \\cos(${k}x)}{x^2}}{\\frac{\\sin(${m === 1 ? "x" : `${m}x`})}{x}}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณลิมิตของเศษและส่วน</strong><br>
      ตัวเศษ: $\\lim_{x \\to 0}\\frac{1 - \\cos(${k}x)}{x^2} = \\frac{${k}^2}{2} = \\frac{${k*k}}{2}$<br>
      ตัวส่วน: $\\lim_{x \\to 0}\\frac{\\sin(${m === 1 ? "x" : `${m}x`})}{x} = ${m}$<br>
      ${adaptiveMath(
        `= \\frac{\\frac{${k*k}}{2}}{${m}} = ${finalValLatex}`,
        `&= \\frac{\\frac{${k*k}}{2}}{${m}} \\\\ &= ${finalValLatex}`
      )}
      ดังนั้น $$\\lim_{x \\to 0} \\frac{1 - \\cos(${k}x)}{x\\sin(${m === 1 ? "x" : `${m}x`})} = ${finalValLatex}$$
    </div>
  `;

  return {
    topic: "limit",
    category: "ลิมิต: ตรีโกณมิติผสมผลคูณ",
    difficulty: "hard",
    probLatex: probLatex,
    ansLatex: finalValLatex,
    promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
    hintText: `หารด้วย $x^2$ ทั้งเศษและส่วนเพื่อแยกเป็นลิมิตมาตรฐานสองชุด`,
    solHtml: solText,
    exactNum: finalNum,
    exactDen: finalDen
  };
}
