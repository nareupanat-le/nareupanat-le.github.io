function genDerivMixedExpArcCot() {
  let k = rand(1, 3);
  let a = rand(1, 4);
  let b = rand(1, 3);
  let x0 = 0;

  let fExpr = `(e^{${k === 1 ? "x" : `${k}x`}} ${a > 0 ? `+ ${a}x` : `- ${Math.abs(a)}x`})\\arctan(${b === 1 ? "x" : `${b}x`})`;
  let slopeVal = b;
  let derivExpr = `\\frac{${b}(e^{${k === 1 ? "x" : `${k}x`}} + ${a}x)}{1 + ${b*b}x^2} + (${k === 1 ? "" : k}e^{${k === 1 ? "x" : `${k}x`}} + ${a})\\arctan(${b === 1 ? "x" : `${b}x`})`;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        (u \\cdot v)' &= u v' + v u' \\\\
        [\\arctan(u)]' &= \\frac{1}{1+u^2} u' \\\\
        [e^u]' &= e^u u' \\\\
        [u^n]' &= n u^{n-1} u' \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ (e^{${k === 1 ? "" : k}x} + ${a}x)\\arctan(${b === 1 ? "" : b}x) \\right] \\\\
        &= (e^{${k === 1 ? "" : k}x} + ${a}x) \\frac{d}{dx} \\arctan(${b === 1 ? "" : b}x) + \\arctan(${b === 1 ? "" : b}x) \\frac{d}{dx} (e^{${k === 1 ? "" : k}x} + ${a}x) \\\\
        &= (e^{${k === 1 ? "" : k}x} + ${a}x) \\left( \\frac{1}{1+(${b === 1 ? "" : b}x)^2} \\frac{d}{dx}(${b === 1 ? "" : b}x) \\right) + \\arctan(${b === 1 ? "" : b}x) \\left[ \\frac{d}{dx}(e^{${k === 1 ? "" : k}x}) + \\frac{d}{dx}(${a}x) \\right] \\\\
        &= (e^{${k === 1 ? "" : k}x} + ${a}x) \\left( \\frac{1}{1+${b*b}x^2} (${b}) \\right) + \\arctan(${b === 1 ? "" : b}x) \\left[ e^{${k === 1 ? "" : k}x}\\frac{d}{dx}(${k === 1 ? "" : k}x) + ${a} \\right] \\\\
        &= \\frac{${b === 1 ? "" : b}(e^{${k === 1 ? "" : k}x} + ${a}x)}{1+${b*b}x^2} + \\arctan(${b === 1 ? "" : b}x) (${k === 1 ? "" : k}e^{${k === 1 ? "" : k}x} + ${a}).
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= \\frac{${b === 1 ? "" : b}(e^{${k}(${x0})} + ${a}(${x0}))}{1+${b*b}(${x0})^2} + (${k === 1 ? "" : k}e^{${k}(${x0})} + ${a})\\arctan(${b}(${x0})) \\\\
        &= \\frac{${b === 1 ? "" : b}(e^0 + 0)}{1+0} + (${k === 1 ? "" : k}e^0 + ${a})(0) \\\\
        &= \\frac{${b === 1 ? "" : b}(1 + 0)}{1} + 0 \\\\
        &= ${slopeVal}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeVal}$.
    </div>
  `;

  return {
    topic: "derivative",
    category: "อนุพันธ์ฟังก์ชันผสม: เอกซ์โป $\\times$ ตรีโกณมิติผกผัน",
    difficulty: "hard",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: `${slopeVal}`,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ใช้กฎผลคูณ $(uv)' = uv' + vu'$ โดยทราบว่า $\\arctan(0) = 0$`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
