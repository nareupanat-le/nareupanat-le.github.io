function genDerivInverseTrigArcSecCsc() {
  let a = rand(1, 4);
  let k = rand(2, 4);
  let x0 = 1;

  let fExpr = `${a === 1 ? "" : a}\\operatorname{arcsec}(${k}x)`;
  let derivExpr = `\\frac{${a}}{|x|\\sqrt{${k*k}x^2 - 1}}`;
  
  let slopeValLatex = `\\frac{${a}}{\\sqrt{${k*k - 1}}}`;
  if (a === 1) slopeValLatex = `\\frac{1}{\\sqrt{${k*k - 1}}}`;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        [\\operatorname{arcsec}(u)]' &= \\frac{1}{|u|\\sqrt{u^2-1}} u' \\\\
        [u^n]' &= n u^{n-1} u' \\\\
        (k_1f)' &= k_1f'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ ${a === 1 ? "" : a}\\operatorname{arcsec}(${k}x) \\right] \\\\
        &= ${a === 1 ? "1" : a} \\left( \\frac{1}{|${k}x|\\sqrt{(${k}x)^2-1}} \\right) \\frac{d}{dx} (${k}x) \\\\
        &= \\frac{${a === 1 ? "1" : a}}{${k}|x|\\sqrt{${k*k}x^2-1}} (${k}) \\\\
        &= \\frac{${a}}{|x|\\sqrt{${k*k}x^2-1}}.
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= \\frac{${a}}{|${x0}|\\sqrt{${k*k}(${x0})^2-1}} \\\\
        &= \\frac{${a}}{1\\sqrt{${k*k}-1}} \\\\
        &= ${slopeValLatex}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeValLatex}$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์: ตรีโกณมิติผกผัน (arcsec & arccsc)",
    difficulty: "hard",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: `\\frac{${a}}{\\sqrt{${k*k-1}}}`,
    promptText: `✍️ ตัวเศษเมื่อจัดรูป $f'(${x0})$ เป็น $\\frac{N}{\\sqrt{${k*k-1}}}$ คือ:`,
    hintText: `ใช้สูตร $\\frac{d}{dx}[\\operatorname{arcsec}(u)] = \\frac{u'}{|u|\\sqrt{u^2-1}}$`,
    solHtml: solText,
    exactNum: a,
    exactDen: 1
  };
}
