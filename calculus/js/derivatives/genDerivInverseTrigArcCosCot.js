function genDerivInverseTrigArcCosCot() {
  let a = rand(1, 3);
  let k = rand(2, 4);
  let b = rand(1, 3);
  let m = rand(1, 3);
  let x0 = 0;

  let fExpr = `${a === 1 ? "" : a}\\arccos(${k}x) + ${b === 1 ? "" : b}\\operatorname{arccot}(${m === 1 ? "x" : `${m}x`})`;
  let derivExpr = `-\\frac{${a*k}}{\\sqrt{1 - ${k*k}x^2}} - \\frac{${b*m}}{1 + ${m*m}x^2}`;
  let slopeVal = - (a * k + b * m);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        [\\arccos(u)]' &= -\\frac{1}{\\sqrt{1-u^2}} u' \\\\
        [\\operatorname{arccot}(u)]' &= -\\frac{1}{1+u^2} u' \\\\
        [u^n]' &= n u^{n-1} u' \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ ${a === 1 ? "" : a}\\arccos(${k}x) + ${b === 1 ? "" : b}\\operatorname{arccot}(${m === 1 ? "x" : `${m}x`}) \\right] \\\\
        &= ${a === 1 ? "1" : a} \\frac{d}{dx} \\arccos(${k}x) + ${b === 1 ? "1" : b} \\frac{d}{dx} \\operatorname{arccot}(${m === 1 ? "x" : `${m}x`}) \\\\
        &= ${a === 1 ? "1" : a} \\left(-\\frac{1}{\\sqrt{1-(${k}x)^2}} \\frac{d}{dx}(${k}x)\\right) + ${b === 1 ? "1" : b} \\left(-\\frac{1}{1+(${m === 1 ? "x" : `${m}x`})^2} \\frac{d}{dx}(${m === 1 ? "x" : `${m}x`})\\right) \\\\
        &= -${a === 1 ? "1" : a} \\left(\\frac{1}{\\sqrt{1-${k*k}x^2}} (${k})\\right) - ${b === 1 ? "1" : b} \\left(\\frac{1}{1+${m*m}x^2} (${m})\\right) \\\\
        &= -\\frac{${a*k}}{\\sqrt{1-${k*k}x^2}} - \\frac{${b*m}}{1+${m*m}x^2}.
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= -\\frac{${a*k}}{\\sqrt{1-${k*k}(${x0})^2}} - \\frac{${b*m}}{1+${m*m}(${x0})^2} \\\\
        &= -\\frac{${a*k}}{\\sqrt{1}} - \\frac{${b*m}}{1} \\\\
        &= -${a*k} - ${b*m} \\\\
        &= ${slopeVal}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeVal}$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์: ตรีโกณมิติผกผัน (arccos & arccot)",
    difficulty: "med",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: `${slopeVal}`,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ดิฟทีละพจน์ $\\frac{d}{dx}[\\arccos(kx)] = -\\frac{k}{\\sqrt{1-k^2x^2}}$ และ $\\frac{d}{dx}[\\operatorname{arccot}(mx)] = -\\frac{m}{1+m^2x^2}$`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
