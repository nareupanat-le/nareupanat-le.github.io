function genDerivTrigSec() {
  let a = rand(2, 4);
  let b = rand(1, 4);
  let x0 = 0;

  let fExpr = `${a}\\sec(x) + ${b}\\tan(x)`;
  let derivExpr = `${a}\\sec(x)\\tan(x) + ${b}\\sec^2(x)`;
  let slopeVal = b;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        [\\sec(u)]' &= \\sec(u)\\tan(u) u' \\\\
        [\\tan(u)]' &= \\sec^2(u) u' \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ ${a}\\sec(x) + ${b}\\tan(x) \\right] \\\\
        &= ${a} \\frac{d}{dx} \\sec(x) + ${b} \\frac{d}{dx} \\tan(x) \\\\
        &= ${a}\\sec(x)\\tan(x) + ${b}\\sec^2(x).
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= ${a}\\sec(0)\\tan(0) + ${b}\\sec^2(0) \\\\
        &= ${a}(1)(0) + ${b}(1)^2 \\\\
        &= 0 + ${b} \\\\
        &= ${slopeVal}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeVal}$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์: ฟังก์ชันเซแคนต์และแทนเจนต์",
    difficulty: "med",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: `${slopeVal}`,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ใช้สูตร $\\frac{d}{dx}[\\sec x] = \\sec x\\tan x$ และ $\\frac{d}{dx}[\\tan x] = \\sec^2 x$`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
