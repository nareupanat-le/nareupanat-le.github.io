function genDerivHardSecondDerivative() {
  let k = rand(2, 4);
  let x0 = 0;

  let fExpr = `x^2 e^{${k}x}`;
  // 1st deriv: x^2(k e^{kx}) + e^{kx}(2x) = (kx^2 + 2x)e^{kx}
  // 2nd deriv: (kx^2 + 2x)(k e^{kx}) + e^{kx}(2kx + 2) = (k^2 x^2 + 2kx + 2kx + 2)e^{kx} = (k^2 x^2 + 4kx + 2)e^{kx}
  let deriv2Expr = `(${k*k}x^2 + ${4*k}x + 2) e^{${k}x}`;
  let slopeVal = 2; // at x=0, it's 2*e^0 = 2

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        (u \\cdot v)' &= u v' + v u' \\\\
        [e^u]' &= e^u u' \\\\
        [u^n]' &= n u^{n-1} u'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์อันดับหนึ่ง $f'(x)$</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} (x^2 e^{${k}x}) \\\\
        &= x^2 \\frac{d}{dx}e^{${k}x} + e^{${k}x} \\frac{d}{dx}x^2 \\\\
        &= x^2(e^{${k}x}(${k})) + e^{${k}x}(2x) \\\\
        &= ${k}x^2 e^{${k}x} + 2x e^{${k}x}.
      \\end{align*}$$
      <strong>หาอนุพันธ์อันดับสอง $f''(x)$</strong>
      $$\\begin{align*}
        f''(x) &= \\frac{d}{dx} (${k}x^2 e^{${k}x} + 2x e^{${k}x}) \\\\
        &= \\frac{d}{dx} (${k}x^2 e^{${k}x}) + \\frac{d}{dx} (2x e^{${k}x}) \\\\
        &= \\left[ ${k}x^2 \\frac{d}{dx}e^{${k}x} + e^{${k}x} \\frac{d}{dx}(${k}x^2) \\right] + \\left[ 2x \\frac{d}{dx}e^{${k}x} + e^{${k}x} \\frac{d}{dx}(2x) \\right] \\\\
        &= \\left[ ${k}x^2\\left(e^{${k}x}\\frac{d}{dx}(${k}x)\\right) + e^{${k}x}(${2*k}x) \\right] + \\left[ 2x\\left(e^{${k}x}\\frac{d}{dx}(${k}x)\\right) + e^{${k}x}(2) \\right] \\\\
        &= \\left[ ${k}x^2(e^{${k}x}(${k})) + e^{${k}x}(${2*k}x) \\right] + \\left[ 2x(e^{${k}x}(${k})) + e^{${k}x}(2) \\right] \\\\
        &= ${k*k}x^2 e^{${k}x} + ${2*k}x e^{${k}x} + ${2*k}x e^{${k}x} + 2 e^{${k}x}.
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f''(x) = ${deriv2Expr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f''(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f''(x)$ จะได้</strong>
      $$\\begin{align*}
        f''(${x0}) &= (${k*k}(${x0})^2 + ${4*k}(${x0}) + 2) e^{${k}(${x0})} \\\\
        &= (0 + 0 + 2) e^{0} \\\\
        &= 2(1) \\\\
        &= 2.
      \\end{align*}$$
      ดังนั้น $f''(${x0}) = 2$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์: อันดับสอง",
    difficulty: "hard",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f''",
    derivLatex: deriv2Expr,
    ansLatex: `${slopeVal}`,
    promptText: `✍️ ทดลองคำนวณค่าอนุพันธ์อันดับสอง $f''(${x0})$:`,
    hintText: `หา $f'(x)$ ด้วยกฎผลคูณก่อน จากนั้นนำผลลัพธ์มาดิฟต่ออีกครั้งเพื่อหา $f''(x)$`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
