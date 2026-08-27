function genDerivWbSecExp() {
  let a = rand(2, 4);
  let b = rand(2, 4);
  let x0 = 1;

  let fExpr = `e^{${a}x^2 - ${a}x} \\sec(${b}x^2 - ${b}x)`;
  
  // f(x) = u * v
  // u = e^{ax^2 - ax} => u' = e^{ax^2 - ax} * (2ax - a)
  // v = sec(bx^2 - bx) => v' = sec(bx^2 - bx)tan(bx^2 - bx) * (2bx - b)
  // At x = 1: 
  // ax^2 - ax = 0 => u(1) = 1, u'(1) = a
  // bx^2 - bx = 0 => v(1) = 1, v'(1) = 1 * 0 * b = 0
  // f'(1) = u(1)v'(1) + v(1)u'(1) = 1(0) + 1(a) = a
  
  let slopeVal = a;
  derivExpr = `e^{${a}x^2 - ${a}x}(${2*a}x - ${a})\\sec(${b}x^2 - ${b}x) + e^{${a}x^2 - ${a}x}\\sec(${b}x^2 - ${b}x)\\tan(${b}x^2 - ${b}x)(${2*b}x - ${b})`;
  
  let derivExpr = `(${2*b}x - ${b})e^{${a}x^2 - ${a}x}\\sec(${b}x^2 - ${b}x)\\tan(${b}x^2 - ${b}x) + (${2*a}x - ${a})e^{${a}x^2 - ${a}x}\\sec(${b}x^2 - ${b}x)`;
  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        (u \\cdot v)' &= u v' + v u' \\\\
        [\\sec(u)]' &= \\sec(u)\\tan(u) u' \\\\
        [e^u]' &= e^u u' \\\\
        [u^n]' &= n u^{n-1} u'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ e^{${a}x^2 - ${a}x} \\sec(${b}x^2 - ${b}x) \\right] \\\\
        &= e^{${a}x^2 - ${a}x} \\frac{d}{dx}\\sec(${b}x^2 - ${b}x) + \\sec(${b}x^2 - ${b}x) \\frac{d}{dx} e^{${a}x^2 - ${a}x} \\\\
        &= e^{${a}x^2 - ${a}x} \\left[ \\sec(${b}x^2 - ${b}x)\\tan(${b}x^2 - ${b}x) \\frac{d}{dx}(${b}x^2 - ${b}x) \\right] + \\sec(${b}x^2 - ${b}x) \\left[ e^{${a}x^2 - ${a}x} \\frac{d}{dx}(${a}x^2 - ${a}x) \\right] \\\\
        &= e^{${a}x^2 - ${a}x} \\left[ \\sec(${b}x^2 - ${b}x)\\tan(${b}x^2 - ${b}x) (${2*b}x - ${b}) \\right] + \\sec(${b}x^2 - ${b}x) \\left[ e^{${a}x^2 - ${a}x} (${2*a}x - ${a}) \\right] \\\\
        &= (${2*b}x - ${b})e^{${a}x^2 - ${a}x}\\sec(${b}x^2 - ${b}x)\\tan(${b}x^2 - ${b}x) + (${2*a}x - ${a})e^{${a}x^2 - ${a}x}\\sec(${b}x^2 - ${b}x).
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= (${2*b} - ${b})e^{0}\\sec(0)\\tan(0) + (${2*a} - ${a})e^{0}\\sec(0) \\\\
        &= (${b})(1)(1)(0) + (${a})(1)(1) \\\\
        &= 0 + ${a} \\\\
        &= ${slopeVal}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeVal}$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์: ฟังก์ชันผสม (ตามแบบฝึกหัด)",
    difficulty: "hard",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: `${slopeVal}`,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(1)$ (แทนค่า $x=1$):`,
    hintText: `ใช้กฎผลคูณและกฎลูกโซ่ระวังพจน์ \\sec(u) ได้ \\sec(u)\\tan(u)u' และ e^u ได้ e^uu'`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
