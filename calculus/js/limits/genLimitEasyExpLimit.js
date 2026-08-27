function genLimitEasyExpLimit() {
  let k = rand(2, 5);
  let m = rand(1, 4);
  let probLatex = `\\lim_{x \\to 0} \\frac{e^{${k}x} - 1}{${m === 1 ? "x" : `${m}x`}}`;
  let finalValLatex = toFrac(k, m);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: ตรวจสอบรูปแบบ</strong><br>
      เมื่อแทนค่า $x = 0$ จะได้ $\\frac{e^0 - 1}{0} = \\frac{0}{0}$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: ใช้ลิมิตมาตรฐาน $\\lim_{u \\to 0} \\frac{e^u - 1}{u} = 1$</strong><br>
      จัดรูปตัวแปร $u = ${k}x$ จะได้ว่า<br>
      ${adaptiveMath(
        `\\lim_{x \\to 0} \\frac{e^{${k}x} - 1}{${m === 1 ? "x" : `${m}x`}} = \\lim_{x \\to 0} \\left( \\frac{e^{${k}x} - 1}{${k}x} \\cdot \\frac{${k}}{${m}} \\right)`,
        `\\lim_{x \\to 0} \\frac{e^{${k}x} - 1}{${m === 1 ? "x" : `${m}x`}} &= \\lim_{x \\to 0} \\left( \\frac{e^{${k}x} - 1}{${k}x} \\cdot \\frac{${k}}{${m}} \\right)`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่าลิมิต</strong><br>
      ${adaptiveMath(
        `= (1) \\cdot \\frac{${k}}{${m}} = ${finalValLatex}`,
        `&= (1) \\cdot \\frac{${k}}{${m}} \\\\ &= ${finalValLatex}`
      )}
      ดังนั้น $$\\lim_{x \\to 0} \\frac{e^{${k}x} - 1}{${m === 1 ? "x" : `${m}x`}} = ${finalValLatex}$$
    </div>
  `;

  return {
    topic: "limit",
    category: "ลิมิต: เอกซ์โพเนนเชียลพื้นฐาน",
    difficulty: "easy",
    probLatex: probLatex,
    ansLatex: finalValLatex,
    promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
    hintText: `ใช้ลิมิตมาตรฐาน $\\lim_{u \\to 0} \\frac{e^u - 1}{u} = 1$`,
    solHtml: solText,
    exactNum: k,
    exactDen: m
  };
}
