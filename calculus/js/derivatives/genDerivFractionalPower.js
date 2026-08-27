function genDerivFractionalPower() {
  let a = rand(1, 3);
  let b = rand(1, 4);
  let c = rand(2, 6);
  let x0 = 1;

  let fExpr = `${a === 1 ? "" : a}x^3 + \\frac{${b}}{x} + ${c}\\sqrt{x}`;
  
  let cFracNum = c % 2 === 0 ? c / 2 : c;
  let cFracDen = c % 2 === 0 ? "" : "2";
  let thirdTermDeriv = cFracDen === "" ? `\\frac{${cFracNum}}{\\sqrt{x}}` : `\\frac{${cFracNum}}{${cFracDen}\\sqrt{x}}`;
  
  let derivExpr = `${3*a}x^2 - \\frac{${b}}{x^2} + ${thirdTermDeriv}`;
  
  let numVal = 6 * a - 2 * b + c;
  let denVal = 2;
  let slopeValLatex = toFrac(numVal, denVal);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        u^n &= \\frac{1}{u^{-n}} \\\\
        \\sqrt[n]{u^m} &= u^{\\frac{m}{n}} \\\\
        [u^n]' &= n u^{n-1} u' \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left(${fExpr}\\right) \\\\
        &= \\frac{d}{dx} ${a === 1 ? "" : a}x^3 + \\frac{d}{dx} \\frac{${b}}{x} + \\frac{d}{dx} ${c}\\sqrt{x} \\\\
        &= ${a === 1 ? "1" : a} \\frac{d}{dx} x^3 + ${b} \\frac{d}{dx} x^{-1} + ${c} \\frac{d}{dx} x^{\\frac{1}{2}} \\\\
        &= (${a === 1 ? "1" : a})(3)x^2 + (${b})(-1)x^{-2} + (${c})\\left(\\frac{1}{2}\\right)x^{-\\frac{1}{2}}.
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= ${3*a}(${x0})^2 - \\frac{${b}}{(${x0})^2} + ${cFracDen === "" ? `\\frac{${cFracNum}}{\\sqrt{${x0}}}` : `\\frac{${cFracNum}}{${cFracDen}\\sqrt{${x0}}}`} \\\\
        &= ${3*a}(1) - \\frac{${b}}{1} + ${cFracDen === "" ? `${cFracNum}` : `\\frac{${cFracNum}}{${cFracDen}}`} \\\\
        &= ${3*a} - ${b} + ${cFracDen === "" ? `${cFracNum}` : `\\frac{${cFracNum}}{${cFracDen}}`} \\\\
        &= ${slopeValLatex}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeValLatex}$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์: เลขยกกำลังตรรกยะและติดลบ",
    difficulty: "easy",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: slopeValLatex,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `จัดรูป $\\frac{${b}}{x} = ${b}x^{-1}$ และ $\\sqrt{x} = x^{1/2}$ ก่อนดิฟ`,
    solHtml: solText,
    exactNum: numVal,
    exactDen: denVal
  };
}
