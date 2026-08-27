function genDerivMedQuotientRational() {
  let a = rand(1, 3);
  let b = rand(1, 4);
  let c = rand(1, 3);
  let d = rand(1, 4);
  while (a * d - b * c === 0) { b = rand(1, 4); }
  let x0 = 0;

  let fExpr = `\\frac{${a === 1 ? "x" : `${a}x`} + ${b}}{${c === 1 ? "x" : `${c}x`} + ${d}}`;
  let det = a * d - b * c;
  let derivExpr = `\\frac{${det}}{(${c === 1 ? "x" : `${c}x`} + ${d})^{2}}`;
  let numAns = det;
  let denAns = d * d;
  let slopeValLatex = toFrac(numAns, denAns);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        \\left(\\frac{u}{v}\\right)' &= \\frac{v u' - u v'}{v^2} \\\\
        [u^n]' &= n u^{n-1} u' \\\\
        [c]' &= 0 \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ \\frac{${a === 1 ? "" : a}x + ${b}}{${c === 1 ? "" : c}x + ${d}} \\right] \\\\
        &= \\frac{(${c === 1 ? "" : c}x + ${d}) \\frac{d}{dx}(${a === 1 ? "" : a}x + ${b}) - (${a === 1 ? "" : a}x + ${b}) \\frac{d}{dx}(${c === 1 ? "" : c}x + ${d})}{(${c === 1 ? "" : c}x + ${d})^2} \\\\
        &= \\frac{(${c === 1 ? "" : c}x + ${d}) \\left[ \\frac{d}{dx}(${a === 1 ? "" : a}x) + \\frac{d}{dx}(${b}) \\right] - (${a === 1 ? "" : a}x + ${b}) \\left[ \\frac{d}{dx}(${c === 1 ? "" : c}x) + \\frac{d}{dx}(${d}) \\right]}{(${c === 1 ? "" : c}x + ${d})^2} \\\\
        &= \\frac{(${c === 1 ? "" : c}x + ${d})(${a} + 0) - (${a === 1 ? "" : a}x + ${b})(${c} + 0)}{(${c === 1 ? "" : c}x + ${d})^2} \\\\
        &= \\frac{${a}(${c === 1 ? "" : c}x + ${d}) - ${c}(${a === 1 ? "" : a}x + ${b})}{(${c === 1 ? "" : c}x + ${d})^2} \\\\
        &= \\frac{${a*c}x + ${a*d} - ${a*c}x - ${b*c}}{(${c === 1 ? "" : c}x + ${d})^2}.
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= \\frac{${det}}{(${c === 1 ? "" : c}(${x0}) + ${d})^2} \\\\
        &= \\frac{${det}}{(${d})^2} \\\\
        &= ${slopeValLatex}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeValLatex}$.
    </div>
  `;

  return {
    topic: "derivative",
    category: "อนุพันธ์: กฎผลหาร",
    difficulty: "med",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: slopeValLatex,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ใช้กฎผลหาร $\\left(\\frac{u}{v}\\right)' = \\frac{vu' - uv'}{v^2}$`,
    solHtml: solText,
    exactNum: numAns,
    exactDen: denAns
  };
}
