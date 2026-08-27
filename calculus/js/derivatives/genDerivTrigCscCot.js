function genDerivTrigCscCot() {
  let a = rand(2, 4);
  let k = rand(2, 4);
  let x0 = 0;

  let fExpr = `${a}\\sin(${k}x) - \\cos(${k}x)`;
  let derivExpr = `${a*k}\\cos(${k}x) + ${k}\\sin(${k}x)`;
  let slopeVal = a * k;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        [\\sin(u)]' &= \\cos(u) u' \\\\
        [\\cos(u)]' &= -\\sin(u) u' \\\\
        [u^n]' &= n u^{n-1} u' \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ ${a}\\sin(${k}x) - \\cos(${k}x) \\right] \\\\
        &= ${a} \\frac{d}{dx} \\sin(${k}x) - \\frac{d}{dx} \\cos(${k}x) \\\\
        &= ${a} \\left(\\cos(${k}x)\\frac{d}{dx}(${k}x)\\right) - \\left(-\\sin(${k}x)\\frac{d}{dx}(${k}x)\\right) \\\\
        &= ${a} \\left(\\cos(${k}x)(${k})\\right) - \\left(-\\sin(${k}x)(${k})\\right) \\\\
        &= ${a*k}\\cos(${k}x) + ${k}\\sin(${k}x).
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= ${a*k}\\cos(${k}(${x0})) + ${k}\\sin(${k}(${x0})) \\\\
        &= ${a*k}\\cos(0) + ${k}\\sin(0) \\\\
        &= ${a*k}(1) + ${k}(0) \\\\
        &= ${slopeVal}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeVal}$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์: ฟังก์ชันตรีโกณมิติผสม",
    difficulty: "med",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: `${slopeVal}`,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ดิฟทีละพจน์ $\\frac{d}{dx}[\\sin(kx)] = k\\cos(kx)$ และ $\\frac{d}{dx}[\\cos(kx)] = -k\\sin(kx)$`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
