function genDerivImplicitPolynomial() {
  let a = rand(1, 2);
  let b = rand(1, 3);
  let c = rand(1, 2);
  let x0 = rand(1, 2);
  let y0 = rand(1, 2);
  let d = a * x0 * x0 - b * x0 * y0 + c * y0 * y0;

  let numSlope = b * y0 - 2 * a * x0;
  let denSlope = 2 * c * y0 - b * x0;
  while (denSlope === 0) {
    y0++;
    d = a * x0 * x0 - b * x0 * y0 + c * y0 * y0;
    numSlope = b * y0 - 2 * a * x0;
    denSlope = 2 * c * y0 - b * x0;
  }

  let slopeValLatex = toFrac(numSlope, denSlope);
  let eqLatex = `${a === 1 ? "x^2" : `${a}x^2`} - ${b === 1 ? "" : b}xy + ${c === 1 ? "y^2" : `${c}y^2`} = ${d}`;

  let customProbPrompt = `
    <div style="font-size: 0.95rem; color: var(--muted); margin-bottom: 6px;">กำหนดสมการฟังก์ชันโดยปริยาย:</div>
    $$\\displaystyle ${eqLatex}$$
    <div style="font-size: 0.95rem; color: var(--muted); margin-top: 6px;">จงหาค่าของ $\\frac{dy}{dx}$ ที่จุด $(${x0}, ${y0})$</div>
  `;

  let customAnsContent = `
    <strong>อนุพันธ์โดยปริยาย:</strong> $$\\displaystyle \\frac{dy}{dx} = \\frac{${b === 1 ? "y" : `${b}y`} - ${2*a}x}{${2*c}y - ${b === 1 ? "x" : `${b}x`}}$$
    <strong>ค่าที่จุด $(${x0}, ${y0})$:</strong> $$\\displaystyle \\left.\\frac{dy}{dx}\\right|_{(${x0}, ${y0})} = ${slopeValLatex}$$
  `;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์โดยปริยาย</strong>
      $$\\begin{align*}
        \\frac{d}{dx}[u \\cdot v] &= u \\frac{dv}{dx} + v \\frac{du}{dx} \\\\
        \\frac{d}{dx}[y^n] &= n y^{n-1} \\frac{dy}{dx} \\\\
        \\frac{d}{dx}[x^n] &= n x^{n-1} \\\\
        \\frac{d}{dx}[c] &= 0
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์เทียบกับตัวแปร $x$ ทั้งสองข้างของสมการ</strong>
      $$\\begin{align*}
        \\frac{d}{dx}\\left[${a === 1 ? "x^2" : `${a}x^2`} - ${b === 1 ? "" : b}xy + ${c === 1 ? "y^2" : `${c}y^2`}\\right] &= \\frac{d}{dx}[${d}] \\\\
        \\frac{d}{dx}[${a === 1 ? "x^2" : `${a}x^2`}] - ${b === 1 ? "" : b}\\frac{d}{dx}[xy] + \\frac{d}{dx}[${c === 1 ? "y^2" : `${c}y^2`}] &= 0
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณอนุพันธ์ของแต่ละพจน์</strong>
      $$\\begin{align*}
        \\frac{d}{dx}[${a === 1 ? "x^2" : `${a}x^2`}] &= ${2*a}x\\frac{dx}{dx} = ${2*a}x(1) = ${2*a}x \\\\
        \\frac{d}{dx}[xy] &= x\\frac{dy}{dx} + y\\frac{dx}{dx} = x\\frac{dy}{dx} + y(1) = x\\frac{dy}{dx} + y \\\\
        \\frac{d}{dx}[${c === 1 ? "y^2" : `${c}y^2`}] &= ${2*c}y\\frac{dy}{dx}
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 4: นำผลลัพธ์มารวมกันและจัดรูปหา $\\frac{dy}{dx}$</strong><br>
      $$\\begin{align*}
        ${2*a}x - ${b === 1 ? "" : b}\\left(x\\frac{dy}{dx} + y\\right) + ${2*c}y\\frac{dy}{dx} &= 0 \\\\
        ${2*a}x - ${b === 1 ? "y" : `${b}y`} - ${b === 1 ? "x" : `${b}x`}\\frac{dy}{dx} + ${2*c}y\\frac{dy}{dx} &= 0 \\\\
        \\left(${2*c}y - ${b === 1 ? "x" : `${b}x`}\\right)\\frac{dy}{dx} &= ${b === 1 ? "y" : `${b}y`} - ${2*a}x \\\\
        \\frac{dy}{dx} &= \\frac{${b === 1 ? "y" : `${b}y`} - ${2*a}x}{${2*c}y - ${b === 1 ? "x" : `${b}x`}}
      \\end{align*}$$
      ดังนั้น $$\\frac{dy}{dx} = \\frac{${b === 1 ? "y" : `${b}y`} - ${2*a}x}{${2*c}y - ${b === 1 ? "x" : `${b}x`}}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 5: แทนค่าพิกัดจุดที่กำหนด $(x, y) = (${x0}, ${y0})$</strong>
      $$\\left.\\frac{dy}{dx}\\right|_{(${x0}, ${y0})} = \\frac{${b === 1 ? "" : b}(${y0}) - ${2*a}(${x0})}{${2*c}(${y0}) - ${b === 1 ? "" : b}(${x0})} = ${slopeValLatex}$$
      ดังนั้น $$\\left.\\frac{dy}{dx}\\right|_{(${x0}, ${y0})} = ${slopeValLatex}$$
    </div>
  `;

  return {
    topic: "implicit",
    category: "อนุพันธ์โดยปริยาย: พหุนามผสม xy",
    difficulty: "hard",
    probLatex: eqLatex,
    x0: x0,
    y0: y0,
    targetSymbol: "\\frac{dy}{dx}",
    customProbPrompt: customProbPrompt,
    customAnsContent: customAnsContent,
    ansLatex: slopeValLatex,
    promptText: `✍️ ทดลองคำนวณค่าของ $\\left.\\frac{dy}{dx}\\right|_{(${x0}, ${y0})}$:`,
    hintText: `อย่าลืมใช้กฎผลคูณในการดิฟพจน์ $xy$: $\\frac{d}{dx}[xy] = y + x y'$`,
    solHtml: solText,
    exactNum: numSlope,
    exactDen: denSlope
  };
}
