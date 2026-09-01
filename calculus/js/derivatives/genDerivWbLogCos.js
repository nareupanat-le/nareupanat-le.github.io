function genDerivWbLogCos() {
  let a = rand(2, 4);
  let b = rand(2, 5);
  let c = rand(2, 4);
  let x0 = 0;

  let fExpr = `\\ln(e^{${a}x^2} + ${b}x) - \\cos(${c}x^3)`;
  
  let slopeVal = b;
  let derivExpr = `\\frac{${2*a}x e^{${a}x^2} + ${b}}{e^{${a}x^2} + ${b}x} + \\sin(${c}x^3)(${3*c}x^2)`;
  
  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        [\\ln(u)]' &= \\frac{1}{u} u' \\\\
        [\\cos(u)]' &= -\\sin(u) u' \\\\
        [e^u]' &= e^u u' \\\\
        [u^n]' &= n u^{n-1} u'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ \\ln(e^{${a}x^2} + ${b}x) - \\cos(${c}x^3) \\right] \\\\
        &= \\frac{d}{dx} \\ln(e^{${a}x^2} + ${b}x) - \\frac{d}{dx} \\cos(${c}x^3) \\\\
        &= \\left( \\frac{1}{e^{${a}x^2} + ${b}x} \\frac{d}{dx}(e^{${a}x^2} + ${b}x) \\right) - \\left( -\\sin(${c}x^3) \\frac{d}{dx}(${c}x^3) \\right) \\\\
        &= \\left( \\frac{1}{e^{${a}x^2} + ${b}x} (e^{${a}x^2}(${2*a}x) + ${b}) \\right) + \\sin(${c}x^3) (${3*c}x^2) \\\\
        &= \\frac{${2*a}x e^{${a}x^2} + ${b}}{e^{${a}x^2} + ${b}x} + ${3*c}x^2 \\sin(${c}x^3).
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= \\frac{${2*a}(0) e^0 + ${b}}{e^0 + 0} + ${3*c}(0) \\sin(0) \\\\
        &= \\frac{0 + ${b}}{1 + 0} + 0 \\\\
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
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(0)$ (แทนค่า $x=0$):`,
    hintText: `ใช้ $\\frac{d}{dx}[\\ln(u)] = \\frac{u'}{u}$ และ $\\frac{d}{dx}[\\cos(u)] = -\\sin(u)u'$`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
