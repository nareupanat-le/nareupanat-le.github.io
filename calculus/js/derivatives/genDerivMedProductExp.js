function genDerivMedProductExp() {
  let a = rand(1, 3);
  let b = rand(2, 5);
  let k = rand(2, 4);
  let x0 = 0;

  let uExpr = `${a === 1 ? "" : a}x + ${b}`;
  let fExpr = `(${uExpr}) e^{${k}x}`;
  let derivExpr = `(${k*a}x + ${k*b + a}) e^{${k}x}`;
  let slopeVal = k * b + a;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        (u \\cdot v)' &= u v' + v u' \\\\
        [e^u]' &= e^u u' \\\\
        [u^n]' &= n u^{n-1} u' \\\\
        [c]' &= 0 \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ (${uExpr})e^{${k}x} \\right] \\\\
        &= (${uExpr}) \\frac{d}{dx} e^{${k}x} + e^{${k}x} \\frac{d}{dx} (${uExpr}) \\\\
        &= (${uExpr}) \\left( e^{${k}x} \\frac{d}{dx}(${k}x) \\right) + e^{${k}x} \\left[ \\frac{d}{dx}(${a === 1 ? "" : a}x) + \\frac{d}{dx}(${b}) \\right] \\\\
        &= (${uExpr}) \\left( e^{${k}x} (${k}) \\right) + e^{${k}x} \\left[ ${a} + 0 \\right]
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= (${k*a}(${x0}) + ${k*b + a}) e^{${k}(${x0})} \\\\
        &= (${k*a*x0} + ${k*b + a}) e^0 \\\\
        &= ${slopeVal}(1) \\\\
        &= ${slopeVal}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeVal}$.
    </div>
  `;

  return {
    topic: "derivative",
    category: "อนุพันธ์: กฎผลคูณ",
    difficulty: "med",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: `${slopeVal}`,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `กำหนด $u = ${uExpr}$ และ $v = e^{${k}x}$ แล้วใช้สูตร $(uv)' = uv' + vu'$`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
