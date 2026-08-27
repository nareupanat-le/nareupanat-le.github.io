function genDerivImplicitCircle() {
  let pythagoreanTriplets = [
    {x: 3, y: 4, r2: 25},
    {x: -3, y: 4, r2: 25},
    {x: 4, y: 3, r2: 25},
    {x: 1, y: 2, r2: 5},
    {x: -1, y: 2, r2: 5},
    {x: 2, y: 1, r2: 5},
    {x: 1, y: 3, r2: 10},
    {x: -1, y: 3, r2: 10}
  ];
  let pt = pythagoreanTriplets[Math.floor(Math.random()*pythagoreanTriplets.length)];
  let x0 = pt.x;
  let y0 = pt.y;
  let rad2 = pt.r2;

  let slopeNum = -x0;
  let slopeDen = y0;
  let slopeValLatex = toFrac(slopeNum, slopeDen);

  let customProbPrompt = `
    <div style="font-size: 0.95rem; color: var(--muted); margin-bottom: 6px;">กำหนดสมการฟังก์ชันโดยปริยาย:</div>
    $$\\displaystyle x^2 + y^2 = ${rad2}$$
    <div style="font-size: 0.95rem; color: var(--muted); margin-top: 6px;">จงหาค่าของอนุพันธ์ $\\frac{dy}{dx}$ ที่จุด $(${x0}, ${y0})$</div>
  `;

  let customAnsContent = `
    <strong>อนุพันธ์โดยปริยาย:</strong> $$\\displaystyle \\frac{dy}{dx} = -\\frac{x}{y}$$
    <strong>ค่าที่จุด $(${x0}, ${y0})$:</strong> $$\\displaystyle \\left.\\frac{dy}{dx}\\right|_{(${x0}, ${y0})} = ${slopeValLatex}$$
  `;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์โดยปริยาย</strong>
      $$\\begin{align*}
        \\frac{d}{dx}[x^n] &= n x^{n-1} \\\\
        \\frac{d}{dx}[y^n] &= n y^{n-1} \\frac{dy}{dx} \\\\
        \\frac{d}{dx}[c] &= 0
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์เทียบกับตัวแปร $x$ ทั้งสองข้างของสมการ</strong>
      $$\\begin{align*}
        \\frac{d}{dx}\\left[x^2 + y^2\\right] &= \\frac{d}{dx}[${rad2}] \\\\
        \\frac{d}{dx}[x^2] + \\frac{d}{dx}[y^2] &= 0
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณอนุพันธ์ของแต่ละพจน์</strong>
      $$\\begin{align*}
        \\frac{d}{dx}[x^2] &= 2x\\frac{dx}{dx} = 2x(1) = 2x \\\\
        \\frac{d}{dx}[y^2] &= 2y\\frac{dy}{dx}
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 4: นำผลลัพธ์มารวมกันและจัดรูปหา $\\frac{dy}{dx}$</strong><br>
      $$\\begin{align*}
        2x + 2y\\frac{dy}{dx} &= 0 \\\\
        2y\\frac{dy}{dx} &= -2x \\\\
        \\frac{dy}{dx} &= -\\frac{2x}{2y} = -\\frac{x}{y}
      \\end{align*}$$
      ดังนั้น $$\\frac{dy}{dx} = -\\frac{x}{y}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 5: แทนค่าพิกัดจุดที่กำหนด $(x, y) = (${x0}, ${y0})$</strong>
      $$\\left.\\frac{dy}{dx}\\right|_{(${x0}, ${y0})} = -\\frac{${x0}}{${y0}} = ${slopeValLatex}$$
      ดังนั้น $$\\left.\\frac{dy}{dx}\\right|_{(${x0}, ${y0})} = ${slopeValLatex}$$
    </div>
  `;

  return {
    topic: "implicit",
    category: "อนุพันธ์โดยปริยาย: สมการวงกลม",
    difficulty: "hard",
    probLatex: `x^2 + y^2 = ${rad2}`,
    x0: x0,
    y0: y0,
    targetSymbol: "\\frac{dy}{dx}",
    customProbPrompt: customProbPrompt,
    customAnsContent: customAnsContent,
    ansLatex: slopeValLatex,
    promptText: `✍️ ทดลองคำนวณค่าของ $\\left.\\frac{dy}{dx}\\right|_{(${x0}, ${y0})}$:`,
    hintText: `ดิฟเทียบ $x$ ทั้งสองข้าง: $2x + 2y y' = 0$ จะได้ $y' = -\\frac{x}{y}$`,
    solHtml: solText,
    exactNum: slopeNum,
    exactDen: slopeDen
  };
}
