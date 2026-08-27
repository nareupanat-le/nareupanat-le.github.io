function genDerivMixedQuotientTrigRadical() {

  let k = rand(2, 4);
  let b = rand(1, 4);
  let x0 = 0;

  let fExpr = `\\frac{\\sin(${k}x)}{\\sqrt{x^2 + ${b}}}`;
  let slopeVal = k / Math.sqrt(b);
  let slopeValLatex = slopeVal % 1 === 0 ? slopeVal.toString() : `\\frac{${k}}{\\sqrt{${b}}}`;
  let derivExpr = `\\frac{${k}(x^2+${b})\\cos(${k}x) - x\\sin(${k}x)}{(x^2+${b})^{\\frac{3}{2}}}`;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        \\left(\\frac{u}{v}\\right)' &= \\frac{v u' - u v'}{v^2} \\\\
        [\\sin(u)]' &= \\cos(u) u' \\\\
        [\\sqrt{u}]' &= \\frac{1}{2\\sqrt{u}} u' \\\\
        [u^n]' &= n u^{n-1} u' \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ \\frac{\\sin(${k}x)}{\\sqrt{x^2 + ${b}}} \\right] \\\\
        &= \\frac{\\sqrt{x^2 + ${b}} \\frac{d}{dx}\\sin(${k}x) - \\sin(${k}x) \\frac{d}{dx}\\sqrt{x^2 + ${b}}}{(\\sqrt{x^2 + ${b}})^2} \\\\
        &= \\frac{\\sqrt{x^2 + ${b}} \\left(\\cos(${k}x)\\frac{d}{dx}(${k}x)\\right) - \\sin(${k}x) \\left(\\frac{1}{2\\sqrt{x^2+${b}}}\\frac{d}{dx}(x^2+${b})\\right)}{x^2 + ${b}} \\\\
        &= \\frac{\\sqrt{x^2 + ${b}} \\left(\\cos(${k}x)(${k})\\right) - \\sin(${k}x) \\left(\\frac{1}{2\\sqrt{x^2+${b}}} \\left[ \\frac{d}{dx}(x^2) + \\frac{d}{dx}(${b}) \\right] \\right)}{x^2 + ${b}} \\\\
        &= \\frac{\\sqrt{x^2 + ${b}} (${k}\\cos(${k}x)) - \\sin(${k}x) \\left(\\frac{1}{2\\sqrt{x^2+${b}}} (2x + 0)\\right)}{x^2 + ${b}} \\\\
        &= \\frac{${k}\\sqrt{x^2 + ${b}}\\cos(${k}x) - \\frac{x\\sin(${k}x)}{\\sqrt{x^2+${b}}}}{x^2 + ${b}}.
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= \\frac{${k}((${x0})^2+${b})\\cos(${k}(${x0})) - (${x0})\\sin(${k}(${x0}))}{((${x0})^2+${b})^{\\frac{3}{2}}} \\\\
        &= \\frac{${k}(${b})\\cos(0) - 0}{(${b})^{\\frac{3}{2}}} \\\\
        &= \\frac{${k * b}(1) - 0}{${b}\\sqrt{${b}}} \\\\
        &= ${slopeValLatex}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeValLatex}$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์ฟังก์ชันผสม: ผลหารตรีโกณมิติ",
    difficulty: "hard",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: `${slopeVal}`,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ใช้กฎผลหาร $\\left(\\frac{u}{v}\\right)' = \\frac{vu' - uv'}{v^2}$`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
