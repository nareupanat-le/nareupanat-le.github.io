function genDerivMedInverseTrig() {
  let k = rand(2, 4);
  let x0 = 0;

  let fExpr = `\\arctan(${k}x)`;
  let derivExpr = `\\frac{${k}}{1 + ${k*k}x^{2}}`;
  let slopeVal = k;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        [\\arctan(u)]' &= \\frac{1}{1+u^2} u' \\\\
        [u^n]' &= n u^{n-1} u'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ \\arctan(${k}x) \\right] \\\\
        &= \\frac{1}{1+(${k}x)^2} \\frac{d}{dx} (${k}x) \\\\
        &= \\frac{1}{1+${k*k}x^2} (${k}) \\\\
        &= \\frac{${k}}{1+${k*k}x^2}.
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= \\frac{${k}}{1+${k*k}(${x0})^2} \\\\
        &= \\frac{${k}}{1+0} \\\\
        &= ${slopeVal}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeVal}$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์: ฟังก์ชันตรีโกณมิติผกผัน",
    difficulty: "med",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: `${slopeVal}`,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ใช้สูตร $\\frac{d}{dx}[\\arctan(u)] = \\frac{u'}{1+u^2}$`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
