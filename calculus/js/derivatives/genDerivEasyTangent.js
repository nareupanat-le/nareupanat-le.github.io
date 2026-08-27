function genDerivEasyTangent() {
  let a = rand(1, 2);
  let b = randNonZero(-3, 3);
  let c = rand(-3, 3);
  let x0 = rand(-2, 2);

  let fExpr = poly2(a, b, c);
  let y0 = a * x0 * x0 + b * x0 + c;
  let slopeVal = 2 * a * x0 + b;
  let derivExpr = poly1(2 * a, b);

  let constTerm = y0 - slopeVal * x0;
  let tangentEq = `y = ${poly1(slopeVal, constTerm)}`;
  if (slopeVal === 0) tangentEq = `y = ${constTerm}`;

  let bFormatted = b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  let cFormatted = c === 0 ? "" : (c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`);

  let customProbPrompt = `
    <div style="font-size: 0.95rem; color: var(--muted); margin-bottom: 6px;">กำหนดสมการเส้นโค้ง:</div>
    $$\\displaystyle y = ${fExpr}$$
    <div style="font-size: 0.95rem; color: var(--muted); margin-top: 6px;">จงหาความชันของเส้นสัมผัส $m_t$ และสร้างสมการเส้นสัมผัสที่จุด $x = ${x0}$</div>
  `;

  let customAnsContent = `
    <strong>ความชันเส้นสัมผัส:</strong> $$\\displaystyle m_t = f'(${x0}) = ${slopeVal}$$
    <strong>จุดสัมผัส:</strong> $$\\displaystyle (${x0}, ${y0})$$
    <strong>สมการเส้นสัมผัส:</strong> $$\\displaystyle ${tangentEq}$$
  `;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: สูตรที่ต้องใช้ในการหาสมการเส้นสัมผัส</strong>
      $$\\begin{align*}
        m_t &= f'(x_0) \\\\
        y - y_0 &= m_t(x - x_0)
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ $f'(x)$</strong><br>
      ${adaptiveMath(
        `f'(x) = \\frac{d}{dx}\\left(${fExpr}\\right) = ${derivExpr}`,
        `f'(x) &= \\frac{d}{dx}\\left(${fExpr}\\right) \\\\ &= ${derivExpr}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: หาพิกัดจุดสัมผัส $(x_0, y_0)$ โดยคำนวณ $y(${x0})$</strong><br>
      $$y_0 = f(${x0}) = ${a}(${x0})^2 ${bFormatted}(${x0}) ${cFormatted} = ${y0}$$
      จะได้ $(x_0, y_0) = (${x0}, ${y0})$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 4: หาความชันของเส้นสัมผัส $m_t$</strong><br>
      $$m_t = f'(${x0}) = ${2 * a}(${x0 >= 0 ? x0 : `(${x0})`}) ${bFormatted} = ${slopeVal}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 5: สร้างสมการเส้นสัมผัส</strong><br>
      $$\\begin{align*}
        y - y_0 &= m_t(x - x_0) \\\\
        y ${y0 >= 0 ? `- ${y0}` : `+ ${Math.abs(y0)}`} &= ${slopeVal === 1 ? "" : (slopeVal === -1 ? "-" : slopeVal)}(x ${x0 >= 0 ? `- ${x0}` : `+ ${Math.abs(x0)}`})
      \\end{align*}$$
      ดังนั้นสมการเส้นสัมผัสคือ $$${tangentEq}$$
    </div>
  `;

  return {
    topic: "tangent_normal",
    category: "อนุพันธ์: การประยุกต์สมการเส้นสัมผัส",
    difficulty: "easy",
    probLatex: `y = ${fExpr}`,
    x0: x0,
    y0: y0,
    targetSymbol: "m_t",
    customProbPrompt: customProbPrompt,
    customAnsContent: customAnsContent,
    derivLatex: derivExpr,
    ansLatex: `${slopeVal}`,
    tangentLatex: tangentEq,
    promptText: `✍️ ทดลองคำนวณความชันของเส้นสัมผัส $m_t$ ที่จุด $x = ${x0}$:`,
    hintText: `หาความชัน $m_t = f'(${x0})$ โดยดิฟ $f(x)$ แล้วแทน $x = ${x0}$`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
