function genDerivHardLogDiff() {
  let k = rand(2, 5);
  let x0 = 1;

  let fExpr = `x^{${k}x}`;
  let derivExpr = `x^{${k}x} (${k} + ${k}\\ln(x))`;
  let slopeVal = k;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        \\ln(u^v) &= v \\ln(u) \\\\
        [\\ln(y)]' &= \\frac{1}{y} y' \\\\
        (u \\cdot v)' &= u v' + v u' \\\\
        [\\ln(x)]' &= \\frac{1}{x}
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        y &= x^{${k}x} \\\\
        \\ln(y) &= \\ln(x^{${k}x}) = ${k}x \\ln(x) \\\\
        \\frac{d}{dx} \\ln(y) &= \\frac{d}{dx} (${k}x \\ln(x)) \\\\
        \\frac{1}{y} \\frac{dy}{dx} &= ${k}x \\frac{d}{dx}\\ln(x) + \\ln(x) \\frac{d}{dx}(${k}x) \\\\
        \\frac{1}{y} \\frac{dy}{dx} &= ${k}x \\left(\\frac{1}{x}\\right) + \\ln(x) (${k}) \\\\
        \\frac{1}{y} \\frac{dy}{dx} &= ${k} + ${k}\\ln(x) \\\\
        \\frac{dy}{dx} &= y (${k} + ${k}\\ln(x)).
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= (${x0})^{${k}(${x0})} (${k} + ${k}\\ln(${x0})) \\\\
        &= 1 (${k} + ${k}(0)) \\\\
        &= 1(${k}) \\\\
        &= ${slopeVal}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeVal}$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์: โดยใช้ลอการิทึม",
    difficulty: "hard",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: `${slopeVal}`,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `เนื่องจากตัวแปรยกกำลังตัวแปร ให้ Take $\\ln$ ทั้งสองข้าง: $\\ln y = ${k}x \\ln x$ แล้วดิฟเทียบ $x$`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
