function genLimitTrigTanSec() {
  let k = rand(2, 4);
  let probLatex = `\\lim_{x \\to 0} \\frac{1 - \\cos(${k}x)}{x \\tan(${k}x)}`;
  let finalNum = k;
  let finalDen = 2;
  let finalValLatex = toFrac(finalNum, finalDen);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: ตรวจสอบรูปแบบไม่กำหนด</strong><br>
      เมื่อ $x \\to 0$ จะได้ $\\frac{1 - 1}{0} = \\frac{0}{0}$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: จัดรูปโดยหารด้วย $x^2$ ทั้งเศษและส่วน</strong><br>
      ${adaptiveMath(
        `\\lim_{x \\to 0} \\frac{\\frac{1 - \\cos(${k}x)}{x^2}}{\\frac{x\\tan(${k}x)}{x^2}} = \\lim_{x \\to 0} \\frac{\\frac{1 - \\cos(${k}x)}{x^2}}{\\frac{\\tan(${k}x)}{x}}`,
        `\\lim_{x \\to 0} \\frac{1 - \\cos(${k}x)}{x\\tan(${k}x)} &= \\lim_{x \\to 0} \\frac{\\frac{1 - \\cos(${k}x)}{x^2}}{\\frac{\\tan(${k}x)}{x}}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: ใช้ลิมิตมาตรฐาน $\\lim_{u \\to 0}\\frac{1-\\cos(ku)}{u^2} = \\frac{k^2}{2}$ และ $\\lim_{u \\to 0}\\frac{\\tan(ku)}{u} = k$</strong><br>
      ${adaptiveMath(
        `= \\frac{\\frac{${k*k}}{2}}{${k}} = \\frac{${k}}{2} = ${finalValLatex}`,
        `&= \\frac{\\frac{${k*k}}{2}}{${k}} \\\\ &= ${finalValLatex}`
      )}
      ดังนั้น $$\\lim_{x \\to 0} \\frac{1 - \\cos(${k}x)}{x \\tan(${k}x)} = ${finalValLatex}$$
    </div>
  `;

  return {
    topic: "limit",
    category: "ลิมิต: ตรีโกณมิติแทนเจนต์และโคไซน์",
    difficulty: "hard",
    probLatex: probLatex,
    ansLatex: finalValLatex,
    promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
    hintText: `จัดรูปหารด้วย $x^2$ ทั้งเศษและส่วนเพื่อแยกเป็นลิมิต $\\frac{1-\\cos(kx)}{x^2}$ และ $\\frac{\\tan(kx)}{x}$`,
    solHtml: solText,
    exactNum: finalNum,
    exactDen: finalDen
  };
}
