function genDerivMedChainRadical() {
  let a = rand(1, 3);
  let b = rand(1, 5);
  let c_sqrt = rand(2, 4);
  let c2 = c_sqrt * c_sqrt;
  let x0 = 0;

  let fExpr = `\\sqrt{${a === 1 ? "" : a}x^2 + ${b}x + ${c2}}`;
  
  let derivNum = b % 2 === 0 ? `${a}x + ${b/2}` : `${2*a}x + ${b}`;
  let derivDen = b % 2 === 0 ? `\\sqrt{${a === 1 ? "" : a}x^2 + ${b}x + ${c2}}` : `2\\sqrt{${a === 1 ? "" : a}x^2 + ${b}x + ${c2}}`;
  let derivExpr = `\\frac{${derivNum}}{${derivDen}}`;
  
  let slopeValLatex = toFrac(b, 2 * c_sqrt);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        [\\sqrt{u}]' &= \\frac{1}{2\\sqrt{u}} u' \\\\
        [u^n]' &= n u^{n-1} u' \\\\
        [c]' &= 0 \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\sqrt{${a === 1 ? "" : a}x^2 + ${b}x + ${c2}} \\\\
        &= \\frac{1}{2\\sqrt{${a === 1 ? "" : a}x^2 + ${b}x + ${c2}}} \\frac{d}{dx} (${a === 1 ? "" : a}x^2 + ${b}x + ${c2}) \\\\
        &= \\frac{1}{2\\sqrt{${a === 1 ? "" : a}x^2 + ${b}x + ${c2}}} \\left[ \\frac{d}{dx}(${a === 1 ? "" : a}x^2) + \\frac{d}{dx}(${b}x) + \\frac{d}{dx}(${c2}) \\right] \\\\
        &= \\frac{1}{2\\sqrt{${a === 1 ? "" : a}x^2 + ${b}x + ${c2}}} (${2*a}x + ${b} + 0) ${b % 2 === 0 ? `\\\\ &= \\frac{${a}x + ${b/2}}{\\sqrt{${a === 1 ? "" : a}x^2 + ${b}x + ${c2}}}` : ""}
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= \\frac{${b % 2 === 0 ? a : 2*a}(${x0}) + ${b % 2 === 0 ? b/2 : b}}{${b % 2 === 0 ? "" : "2"}\\sqrt{${a}(${x0})^2 + ${b}(${x0}) + ${c2}}} \\\\
        &= \\frac{${b % 2 === 0 ? b/2 : b}}{${b % 2 === 0 ? "" : "2"}\\sqrt{0 + 0 + ${c2}}} \\\\
        &= \\frac{${b % 2 === 0 ? b/2 : b}}{${b % 2 === 0 ? "" : "2"}\\sqrt{${c2}}} \\\\
        &= \\frac{${b % 2 === 0 ? b/2 : b}}{${b % 2 === 0 ? "" : "2"}(${c_sqrt})} \\\\
        &= ${slopeValLatex}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeValLatex}$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์: กฎลูกโซ่ฟังก์ชันกรณฑ์",
    difficulty: "med",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: slopeValLatex,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `แปลง $\\sqrt{u} = u^{1/2}$ แล้วดิฟโดยใช้กฎลูกโซ่ $\\frac{1}{2\\sqrt{u}} \\cdot u'$`,
    solHtml: solText,
    exactNum: numAns,
    exactDen: denAns
  };
}
