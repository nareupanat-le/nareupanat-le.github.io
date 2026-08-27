function genDerivTrigTanChain() {
  let a = rand(1, 3);
  let k = rand(2, 4);
  let b = rand(1, 4);
  let x0 = 0;

  let uExpr = `${k}x^2 + ${b}x`;
  let fExpr = `${a === 1 ? "" : a}\\tan(${uExpr})`;
  let derivExpr = `${a === 1 ? "" : a}(${2*k}x + ${b})\\sec^2(${uExpr})`;
  let slopeVal = a * b;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        [\\tan(u)]' &= \\sec^2(u) u' \\\\
        [u^n]' &= n u^{n-1} u' \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ ${a === 1 ? "" : a}\\tan(${k}x^2 + ${b}x) \\right] \\\\
        &= ${a === 1 ? "1" : a} \\sec^2(${k}x^2 + ${b}x) \\frac{d}{dx} (${k}x^2 + ${b}x) \\\\
        &= ${a === 1 ? "1" : a} \\sec^2(${k}x^2 + ${b}x) (${2*k}x + ${b}) \\\\
        &= ${a === 1 ? "" : a}(${2*k}x + ${b}) \\sec^2(${k}x^2 + ${b}x).
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= ${a === 1 ? "" : a}(${2*k}(${x0}) + ${b}) \\sec^2(${k}(${x0})^2 + ${b}(${x0})) \\\\
        &= ${a === 1 ? "" : a}(0 + ${b}) \\sec^2(0) \\\\
        &= ${a === 1 ? "" : a}(${b})(1)^2 \\\\
        &= ${slopeVal}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeVal}$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์: ฟังก์ชันแทนเจนต์และกฎลูกโซ่",
    difficulty: "med",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: `${slopeVal}`,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ใช้กฎลูกโซ่ $\\frac{d}{dx}[\\tan(u)] = \\sec^2(u) \\cdot u'$`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
