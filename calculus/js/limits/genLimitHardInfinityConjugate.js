function genLimitHardInfinityConjugate() {
  let a = rand(2, 6);
  let probLatex = `\\lim_{x \\to \\infty} \\left( \\sqrt{x^2 + ${a}x} - x \\right)`;
  let finalNum = a;
  let finalDen = 2;
  let finalValLatex = toFrac(finalNum, finalDen);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: ตรวจสอบรูปแบบ</strong><br>
      เมื่อ $x \\to \\infty$ จะได้รูปแบบไม่กำหนด $\\infty - \\infty$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: คูณด้วยสังยุค $(\\sqrt{x^2 + ${a}x} + x)$ ทั้งเศษและส่วน</strong><br>
      ${adaptiveMath(
        `\\lim_{x \\to \\infty} \\frac{(\\sqrt{x^2 + ${a}x} - x)(\\sqrt{x^2 + ${a}x} + x)}{\\sqrt{x^2 + ${a}x} + x} = \\lim_{x \\to \\infty} \\frac{(x^2 + ${a}x) - x^2}{\\sqrt{x^2 + ${a}x} + x}`,
        `\\lim_{x \\to \\infty} \\left( \\sqrt{x^2 + ${a}x} - x \\right) &= \\lim_{x \\to \\infty} \\frac{(x^2 + ${a}x) - x^2}{\\sqrt{x^2 + ${a}x} + x} \\\\ &= \\lim_{x \\to \\infty} \\frac{${a}x}{\\sqrt{x^2 + ${a}x} + x}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: หารด้วย $x$ ทั้งเศษและส่วน (นำ $x = \\sqrt{x^2}$ เข้าไปในกรณฑ์)</strong><br>
      ${adaptiveMath(
        `= \\lim_{x \\to \\infty} \\frac{${a}}{\\sqrt{1 + \\frac{${a}}{x}} + 1}`,
        `&= \\lim_{x \\to \\infty} \\frac{${a}}{\\sqrt{1 + \\frac{${a}}{x}} + 1}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 4: หาลิมิตเมื่อ $x \\to \\infty$ (พจน์ $\\frac{${a}}{x} \\to 0$)</strong><br>
      ${adaptiveMath(
        `= \\frac{${a}}{\\sqrt{1 + 0} + 1} = \\frac{${a}}{2} = ${finalValLatex}`,
        `&= \\frac{${a}}{\\sqrt{1 + 0} + 1} \\\\ &= \\frac{${a}}{2} = ${finalValLatex}`
      )}
      ดังนั้น $$\\lim_{x \\to \\infty} \\left( \\sqrt{x^2 + ${a}x} - x \\right) = ${finalValLatex}$$
    </div>
  `;

  return {
    topic: "limit",
    category: "ลิมิต: อนันต์สังยุค",
    difficulty: "hard",
    probLatex: probLatex,
    ansLatex: finalValLatex,
    promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
    hintText: `คูณสังยุค $(\\sqrt{x^2+${a}x}+x)$ แล้วหารด้วย $x$ สูงสุดทั้งเศษและส่วน`,
    solHtml: solText,
    exactNum: finalNum,
    exactDen: finalDen
  };
}
