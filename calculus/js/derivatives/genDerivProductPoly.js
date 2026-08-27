function genDerivProductPoly() {
  let a = rand(1, 2);
  let b = rand(1, 3);
  let c = rand(1, 3);
  let d = rand(1, 4);
  let x0 = 1;

  let uExpr = `${a === 1 ? "x^2" : `${a}x^2`} + ${b}`;
  let vExpr = `${c === 1 ? "x" : `${c}x`} + ${d}`;
  let fExpr = `(${uExpr})(${vExpr})`;

  let slopeVal = (2 * a * x0) * (c * x0 + d) + (a * x0 * x0 + b) * c;
  let derivExpr = `${3*a*c}x^2 + ${2*a*d}x + ${b*c}`;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        (u \\cdot v)' &= u v' + v u' \\\\
        [u^n]' &= n u^{n-1} u' \\\\
        [c]' &= 0 \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ (${uExpr})(${vExpr}) \\right] \\\\
        &= (${uExpr}) \\frac{d}{dx} (${vExpr}) + (${vExpr}) \\frac{d}{dx} (${uExpr}) \\\\
        &= (${uExpr}) \\left[ \\frac{d}{dx}(${c === 1 ? "" : c}x) + \\frac{d}{dx}(${d}) \\right] + (${vExpr}) \\left[ \\frac{d}{dx}(${a === 1 ? "" : a}x^2) + \\frac{d}{dx}(${b}) \\right] \\\\
        &= (${uExpr}) (${c} + 0) + (${vExpr}) (${2*a}x + 0) \\\\
        &= (${a*c}x^2 + ${b*c}) + (${2*a*c}x^2 + ${2*a*d}x) \\\\
        &= ${3*a*c}x^2 + ${2*a*d}x + ${b*c}.
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= ${3*a*c}(${x0})^2 + ${2*a*d}(${x0}) + ${b*c} \\\\
        &= ${3*a*c} + ${2*a*d} + ${b*c} \\\\
        &= ${slopeVal}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeVal}$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์: กฎผลคูณพหุนาม",
    difficulty: "easy",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: `${slopeVal}`,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ใช้กฎผลคูณ $(uv)' = uv' + vu'$ โดย $u = ${uExpr}$ และ $v = ${vExpr}$`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
