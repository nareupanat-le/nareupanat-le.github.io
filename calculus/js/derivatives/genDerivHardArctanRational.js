function genDerivHardArctanRational() {
  let a = rand(1, 3);
  let b = rand(1, 3);
  let c = rand(1, 3);
  let d = rand(1, 3);
  while (a * d - b * c === 0) { b = rand(1, 4); }
  let x0 = 0;

  let uExpr = `\\frac{${a === 1 ? "x" : `${a}x`} + ${b}}{${c === 1 ? "x" : `${c}x`} + ${d}}`;
  let fExpr = `\\arctan\\left(${uExpr}\\right)`;
  let det = a * d - b * c;
  let derivExpr = `\\frac{${det}}{(${c === 1 ? "x" : `${c}x`} + ${d})^{2} + (${a === 1 ? "x" : `${a}x`} + ${b})^{2}}`;

  let numAns = det;
  let denAns = d * d + b * b;
  let slopeValLatex = toFrac(numAns, denAns);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        [\\arctan(u)]' &= \\frac{1}{1+u^2} u' \\\\
        \\left(\\frac{u}{v}\\right)' &= \\frac{v u' - u v'}{v^2} \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ \\arctan\\left( \\frac{${a === 1 ? "" : a}x + ${b}}{${c === 1 ? "" : c}x + ${d}} \\right) \\right] \\\\
        &= \\frac{1}{1 + \\left( \\frac{${a === 1 ? "" : a}x + ${b}}{${c === 1 ? "" : c}x + ${d}} \\right)^2} \\frac{d}{dx} \\left( \\frac{${a === 1 ? "" : a}x + ${b}}{${c === 1 ? "" : c}x + ${d}} \\right) \\\\
        &= \\frac{(${c === 1 ? "" : c}x + ${d})^2}{(${c === 1 ? "" : c}x + ${d})^2 + (${a === 1 ? "" : a}x + ${b})^2} \\left[ \\frac{(${c === 1 ? "" : c}x + ${d})(${a}) - (${a === 1 ? "" : a}x + ${b})(${c})}{(${c === 1 ? "" : c}x + ${d})^2} \\right] \\\\
        &= \\frac{${a*c}x + ${a*d} - ${a*c}x - ${b*c}}{(${c === 1 ? "" : c}x + ${d})^2 + (${a === 1 ? "" : a}x + ${b})^2} \\\\
        &= \\frac{${det}}{(${c === 1 ? "" : c}x + ${d})^2 + (${a === 1 ? "" : a}x + ${b})^2}.
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= \\frac{${det}}{(${c === 1 ? "" : c}(${x0}) + ${d})^2 + (${a === 1 ? "" : a}(${x0}) + ${b})^2} \\\\
        &= \\frac{${det}}{(${d})^2 + (${b})^2} \\\\
        &= ${slopeValLatex}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeValLatex}$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์: ตรีโกณมิติผกผันของฟังก์ชันตรรกยะ",
    difficulty: "hard",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: slopeValLatex,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ใช้กฎลูกโซ่กับ $\\arctan(u)$ และใช้กฎผลหาร $\\left(\\frac{u}{v}\\right)' = \\frac{vu' - uv'}{v^2}$ กับไส้ใน`,
    solHtml: solText,
    exactNum: numAns,
    exactDen: denAns
  };
}
