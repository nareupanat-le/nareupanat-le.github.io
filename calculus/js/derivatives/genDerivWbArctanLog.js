function genDerivWbArctanLog() {
  let a = rand(2, 5);
  let b = rand(2, 4);
  let c = rand(2, 4);
  let x0 = 0;

  let fExpr = `${a}\\arctan(${b}x) - \\ln(${c}x^2 + 1)`;
  
  let slopeVal = a * b;
  let derivExpr = `\\frac{${a*b}}{1 + ${b*b}x^2} - \\frac{${2*c}x}{${c}x^2 + 1}`;
  
  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        [\\arctan(u)]' &= \\frac{1}{1+u^2} u' \\\\
        [\\ln(u)]' &= \\frac{1}{u} u' \\\\
        [u^n]' &= n u^{n-1} u'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ ${a}\\arctan(${b}x) - \\ln(${c}x^2 + 1) \\right] \\\\
        &= ${a} \\frac{d}{dx} \\arctan(${b}x) - \\frac{d}{dx} \\ln(${c}x^2 + 1) \\\\
        &= ${a} \\left( \\frac{1}{1 + (${b}x)^2} \\frac{d}{dx}(${b}x) \\right) - \\left( \\frac{1}{${c}x^2 + 1} \\frac{d}{dx}(${c}x^2 + 1) \\right) \\\\
        &= ${a} \\left( \\frac{1}{1 + ${b*b}x^2} (${b}) \\right) - \\left( \\frac{1}{${c}x^2 + 1} (${2*c}x) \\right) \\\\
        &= \\frac{${a*b}}{1 + ${b*b}x^2} - \\frac{${2*c}x}{${c}x^2 + 1}.
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= \\frac{${a*b}}{1 + ${b*b}(0)} - \\frac{0}{1} \\\\
        &= \\frac{${a*b}}{1} - 0 \\\\
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
    hintText: `ใช้สูตรของ \\arctan(u) และ \\ln(u) แล้วแทนค่า x=0 ทันทีเพื่อความรวดเร็ว`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
