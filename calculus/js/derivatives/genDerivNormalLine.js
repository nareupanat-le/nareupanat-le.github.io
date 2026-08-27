function genDerivNormalLine() {
  let a = rand(1, 2);
  let b = randNonZero(-4, 4);
  let c = rand(-3, 3);
  let x0 = rand(-1, 2);

  let fExpr = poly2(a, b, c);
  let y0 = a * x0 * x0 + b * x0 + c;
  let slopeTangent = 2 * a * x0 + b;
  while (slopeTangent === 0) {
    b = randNonZero(-4, 4);
    slopeTangent = 2 * a * x0 + b;
  }
  let slopeNormalNum = -1;
  let slopeNormalDen = slopeTangent;
  let slopeNormalLatex = toFrac(slopeNormalNum, slopeNormalDen);

  let normalEq = `y ${y0 >= 0 ? `- ${y0}` : `+ ${Math.abs(y0)}`} = ${slopeNormalLatex}(x ${x0 >= 0 ? `- ${x0}` : `+ ${Math.abs(x0)}`})`;

  let customProbPrompt = `
    <div style="font-size: 0.95rem; color: var(--muted); margin-bottom: 6px;">กำหนดเส้นโค้ง:</div>
    $$\\displaystyle y = ${fExpr}$$
    <div style="font-size: 0.95rem; color: var(--muted); margin-top: 6px;">จงหาความชันของเส้นปกติ $m_n$ และสร้างสมการเส้นปกติที่จุด $x = ${x0}$</div>
  `;

  let customAnsContent = `
    <strong>ความชันเส้นสัมผัส:</strong> $$\\displaystyle m_t = f'(${x0}) = ${slopeTangent}$$
    <strong>ความชันเส้นปกติ:</strong> $$\\displaystyle m_n = -\\frac{1}{m_t} = ${slopeNormalLatex}$$
    <strong>สมการเส้นปกติ:</strong> $$\\displaystyle ${normalEq}$$
  `;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาสมการเส้นปกติ</strong>
      $$\\begin{align*}
        m_t &= f'(x_0) \\\\
        m_n &= -\\frac{1}{m_t} \\quad (m_t \\neq 0) \\\\
        y - y_0 &= m_n(x - x_0)
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ $f'(x)$</strong><br>
      ${adaptiveMath(
        `f'(x) = \\frac{d}{dx}\\left(${fExpr}\\right) = ${poly1(2*a, b)}`,
        `f'(x) &= \\frac{d}{dx}\\left(${fExpr}\\right) \\\\ &= ${poly1(2*a, b)}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: หาจุดสัมผัส $(x_0, y_0)$ โดยคำนวณ $y(${x0})$</strong><br>
      $$y_0 = f(${x0}) = ${y0}$$
      จะได้จุดสัมผัส $(x_0, y_0) = (${x0}, ${y0})$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 4: หาความชันของเส้นปกติ $m_n$</strong>
      $$\\begin{align*}
        m_t &= f'(${x0}) = ${slopeTangent} \\\\
        m_n &= -\\frac{1}{m_t} = -\\frac{1}{${slopeTangent}} = ${slopeNormalLatex}
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 5: หาสมการเส้นปกติ</strong><br>
      $$\\begin{align*}
        y - y_0 &= m_n(x - x_0) \\\\
        y ${y0 >= 0 ? `- ${y0}` : `+ ${Math.abs(y0)}`} &= ${slopeNormalLatex}(x ${x0 >= 0 ? `- ${x0}` : `+ ${Math.abs(x0)}`})
      \\end{align*}$$
      ดังนั้นสมการเส้นปกติคือ $$${normalEq}$$
    </div>
  `;

  return {
    topic: "tangent_normal",
    category: "อนุพันธ์: สมการเส้นปกติของเส้นโค้ง",
    difficulty: "med",
    probLatex: `y = ${fExpr}`,
    x0: x0,
    y0: y0,
    targetSymbol: "m_n",
    customProbPrompt: customProbPrompt,
    customAnsContent: customAnsContent,
    ansLatex: slopeNormalLatex,
    promptText: `✍️ ทดลองคำนวณความชันของเส้นปกติ $m_n$:`,
    hintText: `หาความชันเส้นสัมผัส $m_t = f'(${x0})$ ก่อน จากนั้นความชันเส้นปกติคือ $m_n = -\\frac{1}{m_t}$`,
    solHtml: solText,
    exactNum: slopeNormalNum,
    exactDen: slopeNormalDen
  };
}
