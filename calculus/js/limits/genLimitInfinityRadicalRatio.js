function genLimitInfinityRadicalRatio() {
  let a = rand(2, 5);
  let sqrtC = rand(2, 4);
  let c = sqrtC * sqrtC;
  let b = rand(1, 4);
  let d = rand(1, 4);

  let numLatex = `${a}x + ${b}`;
  let denLatex = `\\sqrt{${c}x^2 + ${d}x + 1}`;
  let probLatex = `\\lim_{x \\to -\\infty} \\frac{${numLatex}}{${denLatex}}`;
  
  let finalNum = -a;
  let finalDen = sqrtC;
  let finalValLatex = toFrac(finalNum, finalDen);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: ระวังเครื่องหมายเมื่อ $x \\to -\\infty$</strong><br>
      เนื่องจาก $x < 0$ ดังนั้น $\\sqrt{x^2} = |x| = -x$ จึงได้ว่า $x = -\\sqrt{x^2}$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หารตัวเศษและตัวส่วนด้วย $x$ (สำหรับตัวส่วนนำ $x = -\\sqrt{x^2}$ เข้าไปในกรณฑ์)</strong><br>
      ${adaptiveMath(
        `\\lim_{x \\to -\\infty} \\frac{\\frac{${a}x + ${b}}{x}}{\\frac{\\sqrt{${c}x^2 + ${d}x + 1}}{-\\sqrt{x^2}}} = \\lim_{x \\to -\\infty} \\frac{${a} + \\frac{${b}}{x}}{-\\sqrt{${c} + \\frac{${d}}{x} + \\frac{1}{x^2}}}`,
        `\\lim_{x \\to -\\infty} \\frac{${numLatex}}{${denLatex}} &= \\lim_{x \\to -\\infty} \\frac{${a} + \\frac{${b}}{x}}{-\\sqrt{${c} + \\frac{${d}}{x} + \\frac{1}{x^2}}}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: หาค่าลิมิตเมื่อ $x \\to -\\infty$</strong><br>
      ${adaptiveMath(
        `= \\frac{${a} + 0}{-\\sqrt{${c} + 0 + 0}} = \\frac{${a}}{-${sqrtC}} = ${finalValLatex}`,
        `&= \\frac{${a} + 0}{-\\sqrt{${c} + 0 + 0}} \\\\ &= ${finalValLatex}`
      )}
      ดังนั้น $$\\lim_{x \\to -\\infty} \\frac{${numLatex}}{${denLatex}} = ${finalValLatex}$$
    </div>
  `;

  return {
    topic: "limit",
    category: "ลิมิตที่อนันต์: ฟังก์ชันติดกรณฑ์",
    difficulty: "med",
    probLatex: probLatex,
    ansLatex: finalValLatex,
    promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
    hintText: `เมื่อ $x \\to -\\infty$ พจน์ $x = -\\sqrt{x^2}$ ทำให้เกิดเครื่องหมายลบหน้ากรณฑ์`,
    solHtml: solText,
    exactNum: finalNum,
    exactDen: finalDen
  };
}
