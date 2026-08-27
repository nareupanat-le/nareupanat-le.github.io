function genDerivEasyTrig() {
  let a = rand(2, 4);
  let k = rand(2, 4);
  let x0 = 0;

  let fExpr = `${a}\\sin(${k}x)`;
  let derivExpr = `${a * k}\\cos(${k}x)`;
  let slopeVal = a * k;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        [\\sin(u)]' &= \\cos(u) u' \\\\
        (k_1f)' &= k_1f'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left(${fExpr}\\right) \\\\
        &= ${a} \\frac{d}{dx} \\sin(${k}x) \\\\
        &= ${a}\\cos(${k}x)\\frac{d}{dx}(${k}x) \\\\
        &= (${a})\\cos(${k}x)(${k}).
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= ${a * k}\\cos(${k}(${x0})) \\\\
        &= ${a * k}\\cos(0) \\\\
        &= ${a * k}(1) \\\\
        &= ${slopeVal}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeVal}$.
    </div>
  `;

  return {
    topic: "derivative",
    category: "อนุพันธ์: ตรีโกณมิติพื้นฐาน",
    difficulty: "easy",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: `${slopeVal}`,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ใช้สูตร $\\frac{d}{dx}[\\sin(kx)] = k\\cos(kx)$ แล้วแทนค่า $x = ${x0}$`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
