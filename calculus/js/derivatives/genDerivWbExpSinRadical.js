function genDerivWbExpSinRadical() {
  let a = rand(2, 5);
  let b = rand(2, 4);
  let c = rand(2, 5);
  let d = rand(2, 4);
  let p = 4; // sqrt(4) = 2
  let x0 = 0;

  let fExpr = `\\frac{${a}e^{-${b}x} + ${c}\\sin(${d}x)}{\\sqrt{4 - x^2}}`;
  
  let numVal = c*d - a*b;
  let denVal = 2;
  let slopeValLatex = toFrac(numVal, denVal);
  
  let derivExpr = `\\frac{\\sqrt{4 - x^2} (${c*d}\\cos(${d}x) - ${a*b}e^{-${b}x}) + \\frac{x(${a}e^{-${b}x} + ${c}\\sin(${d}x))}{\\sqrt{4 - x^2}}}{4 - x^2}`;
  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        \\left(\\frac{u}{v}\\right)' &= \\frac{v u' - u v'}{v^2} \\\\
        [e^u]' &= e^u u' \\\\
        [\\sin(u)]' &= \\cos(u) u' \\\\
        [\\sqrt{u}]' &= \\frac{1}{2\\sqrt{u}} u'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ \\frac{${a}e^{-${b}x} + ${c}\\sin(${d}x)}{\\sqrt{4 - x^2}} \\right] \\\\
        &= \\frac{\\sqrt{4 - x^2} \\frac{d}{dx}(${a}e^{-${b}x} + ${c}\\sin(${d}x)) - (${a}e^{-${b}x} + ${c}\\sin(${d}x)) \\frac{d}{dx}(\\sqrt{4 - x^2})}{(\\sqrt{4 - x^2})^2} \\\\
        &= \\frac{\\sqrt{4 - x^2} \\left[ ${a}e^{-${b}x}(-${b}) + ${c}\\cos(${d}x)(${d}) \\right] - (${a}e^{-${b}x} + ${c}\\sin(${d}x)) \\left[ \\frac{1}{2\\sqrt{4 - x^2}} (-2x) \\right]}{4 - x^2} \\\\
        &= \\frac{\\sqrt{4 - x^2} (${c*d}\\cos(${d}x) - ${a*b}e^{-${b}x}) + \\frac{x(${a}e^{-${b}x} + ${c}\\sin(${d}x))}{\\sqrt{4 - x^2}}}{4 - x^2}.
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= \\frac{\\sqrt{4} (${c*d}\\cos(0) - ${a*b}e^{0}) + \\frac{0}{\\sqrt{4}}}{4 - 0} \\\\
        &= \\frac{2 (${c*d}(1) - ${a*b}(1)) + 0}{4} \\\\
        &= \\frac{2 (${c*d} - ${a*b})}{4} \\\\
        &= \\frac{${numVal}}{2} \\\\
        &= ${slopeValLatex}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeValLatex}$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์: ฟังก์ชันผสม (ตามแบบฝึกหัด)",
    difficulty: "hard",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: `\\frac{vu' - uv'}{v^2} \\text{ (แทนค่าโดยตรงจะรวดเร็วกว่า)}`,
    ansLatex: slopeValLatex,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(0)$ (แทนค่า $x=0$):`,
    hintText: `หาค่าของ $u(0)$, $u'(0)$, $v(0)$, $v'(0)$ ก่อน แล้วนำไปแทนในสูตร $\\frac{vu'-uv'}{v^2}$ จะคิดเลขง่ายมาก`,
    solHtml: solText,
    exactNum: numVal,
    exactDen: denVal
  };
}
