function genDerivMixedNestedTrig() {
  let k = rand(2, 4);
  let x0 = 0;

  let fExpr = `\\tan(\\arcsin(${k}x))`;
  let derivExpr = `\\frac{${k}\\sec^2(\\arcsin(${k}x))}{\\sqrt{1-${k*k}x^2}}`;
  let slopeVal = k;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        [\\tan(u)]' &= \\sec^2(u) u' \\\\
        [\\arcsin(u)]' &= \\frac{1}{\\sqrt{1-u^2}} u' \\\\
        [u^n]' &= n u^{n-1} u'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\tan(\\arcsin(${k}x)) \\\\
        &= \\sec^2(\\arcsin(${k}x)) \\frac{d}{dx} \\arcsin(${k}x) \\\\
        &= \\sec^2(\\arcsin(${k}x)) \\left( \\frac{1}{\\sqrt{1-(${k}x)^2}} \\right) \\frac{d}{dx} (${k}x) \\\\
        &= \\sec^2(\\arcsin(${k}x)) \\left( \\frac{1}{\\sqrt{1-${k*k}x^2}} \\right) (${k}).
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= \\frac{${k}\\sec^2(\\arcsin(${k}(${x0})))}{\\sqrt{1-${k*k}(${x0})^2}} \\\\
        &= \\frac{${k}\\sec^2(\\arcsin(0))}{\\sqrt{1}} \\\\
        &= \\frac{${k}\\sec^2(0)}{1} \\\\
        &= ${k}(1)^2 \\\\
        &= ${slopeVal}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeVal}$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์ฟังก์ชันผสม: ตรีโกณซ้อนตรีโกณผกผัน",
    difficulty: "hard",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: `${slopeVal}`,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ใช้กฎลูกโซ่ $\\frac{d}{dx}[\\tan(u)] = \\sec^2(u) \\cdot u'$ โดย $u = \\arcsin(${k}x)$`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
