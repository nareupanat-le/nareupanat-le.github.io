function genDerivHardDamped() {
  let a = rand(1, 3);
  let b = rand(2, 4);
  let x0 = 0;
  let fExpr = `e^{-${a === 1 ? "" : a}x} \\cos(${b}x)`;
  let derivExpr = `e^{-${a === 1 ? "" : a}x} \\left(-${b}\\sin(${b}x) - ${a === 1 ? "" : a}\\cos(${b}x)\\right)`;
  let slopeVal = -a;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        (u \\cdot v)' &= u v' + v u' \\\\
        [e^u]' &= e^u u' \\\\
        [\\cos(u)]' &= -\\sin(u) u' \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ e^{-${a === 1 ? "" : a}x}\\cos(${b}x) \\right] \\\\
        &= e^{-${a === 1 ? "" : a}x} \\frac{d}{dx} \\cos(${b}x) + \\cos(${b}x) \\frac{d}{dx} e^{-${a === 1 ? "" : a}x} \\\\
        &= e^{-${a === 1 ? "" : a}x} \\left( -\\sin(${b}x) \\frac{d}{dx}(${b}x) \\right) + \\cos(${b}x) \\left( e^{-${a === 1 ? "" : a}x} \\frac{d}{dx}(-${a === 1 ? "" : a}x) \\right) \\\\
        &= e^{-${a === 1 ? "" : a}x} ( -\\sin(${b}x) (${b}) ) + \\cos(${b}x) ( e^{-${a === 1 ? "" : a}x} (-${a}) ) \\\\
        &= -${b}e^{-${a === 1 ? "" : a}x}\\sin(${b}x) - ${a}e^{-${a === 1 ? "" : a}x}\\cos(${b}x).
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = -e^{-${a === 1 ? "" : a}x}(${b}\\sin(${b}x) + ${a}\\cos(${b}x)).
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= -e^{-${a}(${x0})}(${b}\\sin(${b}(${x0})) + ${a}\\cos(${b}(${x0}))) \\\\
        &= -e^0(${b}\\sin(0) + ${a}\\cos(0)) \\\\
        &= -(1)(0 + ${a}(1)) \\\\
        &= -${a}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = -${a}$.
    </div>
  `;

  return {
    topic: "derivative",
    category: "อนุพันธ์: ฟังก์ชันผสมการสั่นสะเทือนแบบหน่วง",
    difficulty: "hard",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: `${slopeVal}`,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ใช้กฎผลคูณ $(uv)' = uv' + vu'$ โดยอย่าลืมกฎลูกโซ่ในการดิฟไส้ในของทั้ง $e^{-${a}x}$ และ $\\sin(${b}x)$`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
