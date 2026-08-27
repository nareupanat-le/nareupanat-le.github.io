function genLimitLHopitalExpTrig() {
  let k = rand(2, 4);
  let m = rand(1, 3);
  let probLatex = `\\lim_{x \\to 0} \\frac{e^{${k}x} - e^{-${k}x}}{\\sin(${m === 1 ? "x" : `${m}x`})}`;
  let finalNum = 2 * k;
  let finalDen = m;
  let finalValLatex = toFrac(finalNum, finalDen);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: ตรวจสอบรูปแบบไม่กำหนด</strong><br>
      เมื่อ $x \\to 0$ จะได้ $\\frac{e^0 - e^0}{\\sin(0)} = \\frac{0}{0}$ เป็นรูปแบบไม่กำหนด
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: ใช้หลักเกณฑ์ลอปีตาล (L'Hôpital's Rule) หาอนุพันธ์ทั้งเศษและส่วน</strong><br>
      ${adaptiveMath(
        `\\lim_{x \\to 0} \\frac{\\frac{d}{dx}\\left(e^{${k}x} - e^{-${k}x}\\right)}{\\frac{d}{dx}\\left(\\sin(${m === 1 ? "x" : `${m}x`})\\right)} = \\lim_{x \\to 0} \\frac{${k}e^{${k}x} - (-${k}e^{-${k}x})}{${m === 1 ? "" : m}\\cos(${m === 1 ? "x" : `${m}x`})}`,
        `\\lim_{x \\to 0} \\frac{e^{${k}x} - e^{-${k}x}}{\\sin(${m === 1 ? "x" : `${m}x`})} &= \\lim_{x \\to 0} \\frac{${k}e^{${k}x} + ${k}e^{-${k}x}}{${m === 1 ? "" : m}\\cos(${m === 1 ? "x" : `${m}x`})}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: แทนค่า $x = 0$</strong><br>
      ${adaptiveMath(
        `= \\frac{${k}(1) + ${k}(1)}{${m === 1 ? "1" : `${m}(1)`}} = \\frac{${2*k}}{${m}} = ${finalValLatex}`,
        `&= \\frac{${k}(1) + ${k}(1)}{${m === 1 ? "1" : `${m}(1)`}} \\\\ &= ${finalValLatex}`
      )}
      ดังนั้น $$\\lim_{x \\to 0} \\frac{e^{${k}x} - e^{-${k}x}}{\\sin(${m === 1 ? "x" : `${m}x`})} = ${finalValLatex}$$
    </div>
  `;

  return {
    topic: "limit",
    category: "ลิมิต: หลักเกณฑ์ลอปีตาล",
    difficulty: "hard",
    probLatex: probLatex,
    ansLatex: finalValLatex,
    promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
    hintText: `รูปแบบ $0/0$ ใช้หลักเกณฑ์ลอปีตาลดิฟทั้งเศษและส่วน $\\frac{k e^{kx} + k e^{-kx}}{m\\cos(mx)}$`,
    solHtml: solText,
    exactNum: finalNum,
    exactDen: finalDen
  };
}
