function genDerivGeneralExp() {
  let base = [2, 3, 5][rand(0, 2)];
  let k = rand(2, 4);
  let b = rand(1, 3);
  let x0 = 0;

  let fExpr = `${base}^{${k}x + ${b}}`;
  let coeffVal = k * Math.pow(base, b);
  let derivExpr = `${coeffVal}\\ln(${base}) \\cdot ${base}^{${k}x}`;

  derivExpr = `${k}\\ln(${base}) \\cdot ${base}^{${k}x + ${b}}`;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        [a^u]' &= a^u \\ln(a) u' \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g' \\\\
        [c]' &= 0
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ ${base}^{${k}x + ${b}} \\right] \\\\
        &= ${base}^{${k}x + ${b}} \\ln(${base}) \\frac{d}{dx} (${k}x + ${b}) \\\\
        &= ${base}^{${k}x + ${b}} \\ln(${base}) (${k}) \\\\
        &= ${k} \\ln(${base}) \\cdot ${base}^{${k}x + ${b}}.
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= ${k} \\ln(${base}) \\cdot ${base}^{${k}(${x0}) + ${b}} \\\\
        &= ${k} \\ln(${base}) \\cdot ${base}^{${b}} \\\\
        &= ${k * Math.pow(base, b)} \\ln(${base}).
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = ${k * Math.pow(base, b)} \\ln(${base})$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์: เอกซ์โพเนนเชียลฐานทั่วไป $a^u$",
    difficulty: "med",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: `${k}\\ln(${base}) \\cdot ${base}^{${k}x + ${b}}`,
    ansLatex: `${coeffVal}\\ln(${base})`,
    promptText: `✍️ สัมประสิทธิ์หน้า $\\ln(${base})$ ของ $f'(${x0})$ คือ:`,
    hintText: `ใช้สูตร $\\frac{d}{dx}[a^u] = a^u \\ln(a) \\cdot u'$ ที่ $x = 0$ จะได้ค่า $k \\cdot a^b \\ln(a)$`,
    solHtml: solText,
    exactNum: coeffVal,
    exactDen: 1
  };
}
