function genDerivMedChainLog() {
  let a = rand(1, 3);
  let b = rand(1, 5);
  let c = rand(1, 5);
  let x0 = 0;

  let fExpr = `\\ln(${a === 1 ? "" : a}x^2 + ${b}x + ${c})`;
  let derivExpr = `\\frac{${2*a}x + ${b}}{${a === 1 ? "" : a}x^2 + ${b}x + ${c}}`;
  let slopeValLatex = toFrac(b, c);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        [\\ln(u)]' &= \\frac{1}{u} u' \\\\
        [u^n]' &= n u^{n-1} u' \\\\
        [c]' &= 0 \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\ln(${a === 1 ? "" : a}x^2 + ${b}x + ${c}) \\\\
        &= \\frac{1}{${a === 1 ? "" : a}x^2 + ${b}x + ${c}} \\frac{d}{dx} (${a === 1 ? "" : a}x^2 + ${b}x + ${c}) \\\\
        &= \\frac{1}{${a === 1 ? "" : a}x^2 + ${b}x + ${c}} \\left[ \\frac{d}{dx}(${a === 1 ? "" : a}x^2) + \\frac{d}{dx}(${b}x) + \\frac{d}{dx}(${c}) \\right] \\\\
        &= \\frac{1}{${a === 1 ? "" : a}x^2 + ${b}x + ${c}} (${2*a}x + ${b} + 0).
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= \\frac{${2*a}(${x0}) + ${b}}{${a}(${x0})^2 + ${b}(${x0}) + ${c}} \\\\
        &= \\frac{${b}}{0 + 0 + ${c}} \\\\
        &= ${slopeValLatex}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeValLatex}$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์: กฎลูกโซ่ฟังก์ชันลอการิทึม",
    difficulty: "med",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: slopeValLatex,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ใช้สูตร $\\frac{d}{dx}[\\ln(u)] = \\frac{u'}{u}$`,
    solHtml: solText,
    exactNum: numAns,
    exactDen: denAns
  };
}
