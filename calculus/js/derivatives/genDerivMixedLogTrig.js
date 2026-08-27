function genDerivMixedLogTrig() {
  let k = rand(2, 4);
  let a = rand(1, 3);
  let b = rand(1, 3);
  let x0 = 0;

  let numVal = k + a;
  let denVal = 1 + b;
  let slopeValLatex = toFrac(numVal, denVal);
  let fExpr = `\\ln\\left(e^{\\tan(${k}x)} + ${a}x + ${b}\\right)`;
  let derivExpr = `\\frac{${k}e^{\\tan(${k}x)}\\sec^2(${k}x) + ${a}}{e^{\\tan(${k}x)} + ${a}x + ${b}}`;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        [\\ln(u)]' &= \\frac{1}{u} u' \\\\
        [e^u]' &= e^u u' \\\\
        [\\tan(u)]' &= \\sec^2(u) u' \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ \\ln(e^{\\tan(${k}x)} + ${a}x + ${b}) \\right] \\\\
        &= \\frac{1}{e^{\\tan(${k}x)} + ${a}x + ${b}} \\frac{d}{dx} (e^{\\tan(${k}x)} + ${a}x + ${b}) \\\\
        &= \\frac{1}{e^{\\tan(${k}x)} + ${a}x + ${b}} \\left[ e^{\\tan(${k}x)} \\frac{d}{dx}\\tan(${k}x) + ${a} + 0 \\right] \\\\
        &= \\frac{1}{e^{\\tan(${k}x)} + ${a}x + ${b}} \\left[ e^{\\tan(${k}x)} \\sec^2(${k}x) \\frac{d}{dx}(${k}x) + ${a} \\right] \\\\
        &= \\frac{1}{e^{\\tan(${k}x)} + ${a}x + ${b}} \\left[ e^{\\tan(${k}x)} \\sec^2(${k}x) (${k}) + ${a} \\right] \\\\
        &= \\frac{${k}e^{\\tan(${k}x)}\\sec^2(${k}x) + ${a}}{e^{\\tan(${k}x)} + ${a}x + ${b}}.
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= \\frac{${k}e^{\\tan(0)}\\sec^2(0) + ${a}}{e^{\\tan(0)} + ${a}(0) + ${b}} \\\\
        &= \\frac{${k}(e^0)(1)^2 + ${a}}{e^0 + ${b}} \\\\
        &= \\frac{${k} + ${a}}{1 + ${b}} \\\\
        &= ${slopeValLatex}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeValLatex}$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์ฟังก์ชันผสม: ลอการิทึม $\\times$ เอกซ์โปและตรีโกณ",
    difficulty: "hard",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: slopeValLatex,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ใช้สูตร $\\frac{d}{dx}[\\ln(u)] = \\frac{u'}{u}$ โดยดิฟไส้ใน $u = e^{\\tan(kx)} + ax + b$`,
    solHtml: solText,
    exactNum: numVal,
    exactDen: denVal
  };
}
