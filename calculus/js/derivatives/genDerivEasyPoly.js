function genDerivEasyPoly() {
  let a = rand(1, 3);
  let b = randNonZero(-3, 3);
  let c = randNonZero(-4, 4);
  let d = rand(-4, 4);
  let x0 = rand(-1, 1);

  let fExpr = poly3(a, b, c, d);
  let derivExpr = poly2(3 * a, 2 * b, c);
  let slopeVal = 3 * a * x0 * x0 + 2 * b * x0 + c;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        [u^n]' &= n u^{n-1} u' \\\\
        [c]' &= 0 \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left(${fExpr}\\right) \\\\
        &= \\frac{d}{dx} ${a === 1 ? "" : a}x^3 ${b > 0 ? "+" : "-"} \\frac{d}{dx} ${Math.abs(b)}x^2 ${c > 0 ? "+" : "-"} \\frac{d}{dx} ${Math.abs(c)}x ${d > 0 ? "+" : "-"} \\frac{d}{dx} ${Math.abs(d)} \\\\
        &= ${a === 1 ? "1" : a} \\frac{d}{dx} x^3 ${b > 0 ? "+" : "-"} ${Math.abs(b)} \\frac{d}{dx} x^2 ${c > 0 ? "+" : "-"} ${Math.abs(c)} \\frac{d}{dx} x ${d > 0 ? "+" : "-"} \\frac{d}{dx} ${Math.abs(d)} \\\\
        &= (${a === 1 ? "1" : a})(3)x^2 ${b > 0 ? "+" : "-"} (${Math.abs(b)})(2)x ${c > 0 ? "+" : "-"} (${Math.abs(c)})(1) ${d > 0 ? "+" : "-"} 0.
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= ${3*a}(${x0})^2 ${2*b > 0 ? "+" : "-"} ${Math.abs(2*b)}(${x0}) ${c > 0 ? "+" : "-"} ${Math.abs(c)} \\\\
        &= ${3*a}(${x0*x0}) ${2*b > 0 ? "+" : "-"} ${Math.abs(2*b)*x0} ${c > 0 ? "+" : "-"} ${Math.abs(c)} \\\\
        &= ${slopeVal}.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${slopeVal}$.
    </div>
  `;

  return {
    topic: "derivative",
    category: "อนุพันธ์: ฟังก์ชันพหุนาม",
    difficulty: "easy",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: `${slopeVal}`,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ใช้กฎเลขยกกำลัง $\\frac{d}{dx}[x^n] = n x^{n-1}$ ดิฟทีละพจน์แล้วแทนค่า $x = ${x0}$`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
