function genDerivHardLogNestedRadical() {
  let a = rand(1, 3);
  let b = rand(1, 3);
  let c = rand(1, 3);
  let d = rand(1, 3);
  while (a * d - b * c === 0) { b = rand(1, 4); }
  let x0 = 0;

  let fExpr = `\\ln\\left(\\sqrt{\\frac{${a === 1 ? "x" : `${a}x`} + ${b}}{${c === 1 ? "x" : `${c}x`} + ${d}}}\\right)`;
  let det = a * d - b * c;
  let derivNum = det % 2 === 0 ? det / 2 : det;
  let derivDen = det % 2 === 0 ? `(${a === 1 ? "x" : `${a}x`} + ${b})(${c === 1 ? "x" : `${c}x`} + ${d})` : `2(${a === 1 ? "x" : `${a}x`} + ${b})(${c === 1 ? "x" : `${c}x`} + ${d})`;
  let derivExpr = `\\frac{${derivNum}}{${derivDen}}`;
  
  let slopeValLatex = toFrac(det, 2 * b * d);
  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        \\ln\\left(\\sqrt{\\frac{u}{v}}\\right) &= \\frac{1}{2}(\\ln(u) - \\ln(v)) \\\\
        [\\ln(u)]' &= \\frac{1}{u} u' \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ \\ln\\left(\\sqrt{ \\frac{${a === 1 ? "" : a}x + ${b}}{${c === 1 ? "" : c}x + ${d}} }\\right) \\right] \\\\
        &= \\frac{d}{dx} \\left[ \\frac{1}{2} \\left( \\ln(${a === 1 ? "" : a}x + ${b}) - \\ln(${c === 1 ? "" : c}x + ${d}) \\right) \\right] \\\\
        &= \\frac{1}{2} \\left[ \\frac{d}{dx} \\ln(${a === 1 ? "" : a}x + ${b}) - \\frac{d}{dx} \\ln(${c === 1 ? "" : c}x + ${d}) \\right] \\\\
        &= \\frac{1}{2} \\left[ \\frac{1}{${a === 1 ? "" : a}x + ${b}} \\frac{d}{dx}(${a === 1 ? "" : a}x + ${b}) - \\frac{1}{${c === 1 ? "" : c}x + ${d}} \\frac{d}{dx}(${c === 1 ? "" : c}x + ${d}) \\right] \\\\
        &= \\frac{1}{2} \\left[ \\frac{${a}}{${a === 1 ? "" : a}x + ${b}} - \\frac{${c}}{${c === 1 ? "" : c}x + ${d}} \\right] \\\\
        &= \\frac{1}{2} \\left[ \\frac{${a}(${c === 1 ? "" : c}x + ${d}) - ${c}(${a === 1 ? "" : a}x + ${b})}{(${a === 1 ? "" : a}x + ${b})(${c === 1 ? "" : c}x + ${d})} \\right] \\\\
        &= \\frac{1}{2} \\left[ \\frac{${a*c}x + ${a*d} - ${a*c}x - ${b*c}}{(${a === 1 ? "" : a}x + ${b})(${c === 1 ? "" : c}x + ${d})} \\right] \\\\
        &= \\frac{${det}}{2(${a === 1 ? "" : a}x + ${b})(${c === 1 ? "" : c}x + ${d})} ${det % 2 === 0 ? `\\\\\\\\ &= \\frac{${det/2}}{(${a === 1 ? "" : a}x + ${b})(${c === 1 ? "" : c}x + ${d})}` : ""}
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= \\frac{${derivNum}}{${det % 2 === 0 ? "" : "2"}(${a === 1 ? "" : a}(${x0}) + ${b})(${c === 1 ? "" : c}(${x0}) + ${d})} \\\\
        &= \\frac{${derivNum}}{${det % 2 === 0 ? "" : "2"}(${b})(${d})} \\\\
        &= \\frac{${derivNum}}{${det % 2 === 0 ? "" : "2"}(${b*d})} \\\\
        &= ${slopeValLatex}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeValLatex}$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์: สมบัติลอการิทึมและฟังก์ชันกรณฑ์",
    difficulty: "hard",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: slopeValLatex,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ใช้สมบัติลอการิทึม $\\ln\\sqrt{A/B} = \\frac{1}{2}(\\ln A - \\ln B)$ แยกพจน์ก่อนดิฟจะง่ายกว่ามาก`,
    solHtml: solText,
    exactNum: det,
    exactDen: 2 * b * d
  };
}
