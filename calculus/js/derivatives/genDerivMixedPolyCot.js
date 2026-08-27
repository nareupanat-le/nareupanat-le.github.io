function genDerivMixedPolyCot() {
  let a = rand(1, 3);
  let b = rand(1, 4);
  let k = rand(1, 3);
  let x0 = 0;

  let uExpr = `${a === 1 ? "x^2" : `${a}x^2`} + ${b}`;
  let vExpr = `\\cot\\left(${k === 1 ? "" : k}x + \\frac{\\pi}{4}\\right)`;
  let fExpr = `(${uExpr})${vExpr}`;

  let slopeVal = -2 * b * k;
  derivExpr = `2(${a}x)${vExpr} - ${k === 1 ? "" : `${k}`}(${uExpr})\\csc^2\\left(${k === 1 ? "" : k}x + \\frac{\\pi}{4}\\right)`;

  let derivExpr = `2(${a}x)\\cot\\left(${k === 1 ? "" : k}x + \\frac{\\pi}{4}\\right) - ${k === 1 ? "" : k}(${a === 1 ? "" : a}x^2 + ${b})\\csc^2\\left(${k === 1 ? "" : k}x + \\frac{\\pi}{4}\\right)`;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        (u \\cdot v)' &= u v' + v u' \\\\
        [\\cot(u)]' &= -\\csc^2(u) u' \\\\
        [u^n]' &= n u^{n-1} u'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ (${uExpr}) \\cot\\left(${k === 1 ? "" : k}x + \\frac{\\pi}{4}\\right) \\right] \\\\
        &= (${uExpr}) \\frac{d}{dx} \\cot\\left(${k === 1 ? "" : k}x + \\frac{\\pi}{4}\\right) + \\cot\\left(${k === 1 ? "" : k}x + \\frac{\\pi}{4}\\right) \\frac{d}{dx} (${uExpr}) \\\\
        &= (${uExpr}) \\left( -\\csc^2\\left(${k === 1 ? "" : k}x + \\frac{\\pi}{4}\\right) \\frac{d}{dx}\\left(${k === 1 ? "" : k}x + \\frac{\\pi}{4}\\right) \\right) + \\cot\\left(${k === 1 ? "" : k}x + \\frac{\\pi}{4}\\right) (${2*a}x) \\\\
        &= (${uExpr}) \\left( -\\csc^2\\left(${k === 1 ? "" : k}x + \\frac{\\pi}{4}\\right) (${k}) \\right) + ${2*a}x \\cot\\left(${k === 1 ? "" : k}x + \\frac{\\pi}{4}\\right) \\\\
        &= ${2*a}x \\cot\\left(${k === 1 ? "" : k}x + \\frac{\\pi}{4}\\right) - ${k === 1 ? "" : k}(${uExpr})\\csc^2\\left(${k === 1 ? "" : k}x + \\frac{\\pi}{4}\\right).
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= ${2*a}(${x0}) \\cot\\left(\\frac{\\pi}{4}\\right) - ${k === 1 ? "1" : k}(${a}(${x0})^2 + ${b})\\csc^2\\left(\\frac{\\pi}{4}\\right) \\\\
        &= 0 - ${k === 1 ? "1" : k}(${b})(\\sqrt{2})^2 \\\\
        &= -${k === 1 ? "1" : k}(${b})(2) \\\\
        &= ${slopeVal}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeVal}$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์ฟังก์ชันผสม: พหุนาม $\\times$ โคแทนเจนต์",
    difficulty: "med",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: `${slopeVal}`,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ใช้กฎผลคูณ $(uv)' = uv' + vu'$ โดย $v = \\cot(kx+\\pi/4)$`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
