function genDerivEasyExp() {
  let a = rand(1, 3);
  let k = rand(2, 4);
  let b = randNonZero(-4, 4);
  let x0 = 0;

  let fExpr = `${a === 1 ? "" : a}e^{${k}x} ${b > 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`}`;
  let derivExpr = `${a * k}e^{${k}x} ${b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`}`;
  let slopeVal = a * k + b;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        [e^u]' &= e^u u' \\\\
        [u^n]' &= n u^{n-1} u' \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left(${fExpr}\\right) \\\\
        &= \\frac{d}{dx} ${a === 1 ? "" : a}e^{${k}x} ${b > 0 ? "+" : "-"} \\frac{d}{dx} ${Math.abs(b)}x \\\\
        &= ${a === 1 ? "1" : a} \\frac{d}{dx} e^{${k}x} ${b > 0 ? "+" : "-"} ${Math.abs(b)} \\frac{d}{dx} x \\\\
        &= ${a === 1 ? "1" : a}e^{${k}x}\\frac{d}{dx}(${k}x) ${b > 0 ? "+" : "-"} ${Math.abs(b)}(1) \\\\
        &= (${a === 1 ? "1" : a})e^{${k}x}(${k}) ${b > 0 ? "+" : "-"} ${Math.abs(b)}.
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= ${a * k}e^{${k}(${x0})} ${b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`} \\\\
        &= ${a * k}e^0 ${b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`} \\\\
        &= ${a * k}(1) ${b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`} \\\\
        &= ${slopeVal}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeVal}$.
    </div>
  `;

  return {
    topic: "derivative",
    category: "อนุพันธ์: เอกซ์โพเนนเชียลพื้นฐาน",
    difficulty: "easy",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: `${slopeVal}`,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ใช้สูตร $\\frac{d}{dx}[e^{kx}] = k e^{kx}$`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
