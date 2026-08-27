function genDerivTrigCotCscPure() {
  let a = rand(1, 4);
  let k = rand(2, 4);
  let x0 = 0;

  let fExpr = `${a === 1 ? "" : a}\\cot\\left(${k}x + \\frac{\\pi}{4}\\right)`;
  let derivExpr = `-${a*k}\\csc^2\\left(${k}x + \\frac{\\pi}{4}\\right)`;
  let slopeVal = -a * k * 2;
  
  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        [\\cot(u)]' &= -\\csc^2(u) u' \\\\
        [u^n]' &= n u^{n-1} u' \\\\
        [c]' &= 0 \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ ${a === 1 ? "" : a}\\cot\\left(${k}x + \\frac{\\pi}{4}\\right) \\right] \\\\
        &= ${a === 1 ? "1" : a} \\left( -\\csc^2\\left(${k}x + \\frac{\\pi}{4}\\right) \\right) \\frac{d}{dx} \\left(${k}x + \\frac{\\pi}{4}\\right) \\\\
        &= -${a === 1 ? "1" : a}\\csc^2\\left(${k}x + \\frac{\\pi}{4}\\right) \\left[ \\frac{d}{dx}(${k}x) + \\frac{d}{dx}\\left(\\frac{\\pi}{4}\\right) \\right] \\\\
        &= -${a === 1 ? "1" : a}\\csc^2\\left(${k}x + \\frac{\\pi}{4}\\right) (${k} + 0).
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= -${a*k}\\csc^2\\left(${k}(${x0}) + \\frac{\\pi}{4}\\right) \\\\
        &= -${a*k}\\csc^2\\left(\\frac{\\pi}{4}\\right) \\\\
        &= -${a*k}(\\sqrt{2})^2 \\\\
        &= -${a*k}(2) \\\\
        &= ${slopeVal}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeVal}$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์: ฟังก์ชันโคแทนเจนต์และโคเซแคนต์",
    difficulty: "med",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: `${slopeVal}`,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ใช้กฎลูกโซ่ $\\frac{d}{dx}[\\cot(u)] = -\\csc^2(u) \\cdot u'$ และ $\\csc(\\pi/4) = \\sqrt{2}$`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
