function genDerivWbProductExpPoly() {
  let a = randNonZero(-4, 4);
  let b = rand(2, 4);
  let x0 = 1;

  let fExpr = `${a === 1 ? "" : (a === -1 ? "-" : a)}x^3 e^{${b}x^2 - ${b}}`;
  
  let slopeVal = a * (3 + 2*b);
  let derivExpr = `${3*a}x^2 e^{${b}x^2 - ${b}} + ${a === 1 ? "" : (a === -1 ? "-" : a)}x^3 e^{${b}x^2 - ${b}}(${2*b}x) = ${a}x^2 e^{${b}x^2 - ${b}}(3 + ${2*b}x^2)`;
  
  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        (u \\cdot v)' &= u v' + v u' \\\\
        [e^u]' &= e^u u' \\\\
        [u^n]' &= n u^{n-1} u' \\\\
        [c]' &= 0
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ ${a === 1 ? "" : (a === -1 ? "-" : a)}x^3 e^{${b}x^2 - ${b}} \\right] \\\\
        &= ${a === 1 ? "" : (a === -1 ? "-" : a)}x^3 \\frac{d}{dx} (e^{${b}x^2 - ${b}}) + e^{${b}x^2 - ${b}} \\frac{d}{dx} (${a === 1 ? "" : (a === -1 ? "-" : a)}x^3) \\\\
        &= ${a === 1 ? "" : (a === -1 ? "-" : a)}x^3 \\left( e^{${b}x^2 - ${b}} \\frac{d}{dx}(${b}x^2 - ${b}) \\right) + e^{${b}x^2 - ${b}} (${3*a}x^2) \\\\
        &= ${a === 1 ? "" : (a === -1 ? "-" : a)}x^3 \\left( e^{${b}x^2 - ${b}} (${2*b}x) \\right) + ${3*a}x^2 e^{${b}x^2 - ${b}} \\\\
        &= ${2*a*b}x^4 e^{${b}x^2 - ${b}} + ${3*a}x^2 e^{${b}x^2 - ${b}}.
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= ${2*a*b}(${x0})^4 e^{${b}(${x0})^2 - ${b}} + ${3*a}(${x0})^2 e^{${b}(${x0})^2 - ${b}} \\\\
        &= ${2*a*b}(1)e^0 + ${3*a}(1)e^0 \\\\
        &= ${2*a*b} + ${3*a} \\\\
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
    hintText: `ใช้กฎผลคูณ $uv' + vu'$ โดยดึงตัวร่วม x^2 e^{...} ออกมาเพื่อแทนค่าได้ง่ายขึ้น`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
