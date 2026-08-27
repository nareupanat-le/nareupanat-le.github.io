function genDerivHardInverseTrigCancellation() {
  let k = rand(2, 4);
  let x0 = 0;
  let fExpr = `x\\arcsin(${k}x) + \\frac{1}{${k}}\\sqrt{1 - ${k*k}x^{2}}`;
  let derivExpr = `\\arcsin(${k}x)`;
  let slopeVal = 0;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: กฎและสูตรที่ต้องใช้ในการหาอนุพันธ์</strong>
      $$\\begin{align*}
        (u \\cdot v)' &= u v' + v u' \\\\
        [\\arcsin(u)]' &= \\frac{1}{\\sqrt{1-u^2}} u' \\\\
        [\\sqrt{u}]' &= \\frac{1}{2\\sqrt{u}} u' \\\\
        (k_1f \\pm k_2 g)' &= k_1f' \\pm k_2g'
      \\end{align*}$$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: หาอนุพันธ์ของ $f$ จะได้</strong>
      $$\\begin{align*}
        f'(x) &= \\frac{d}{dx} \\left[ x \\arcsin(${k}x) + \\frac{1}{${k}} \\sqrt{1 - ${k*k}x^2} \\right] \\\\
        &= \\frac{d}{dx} \\left[ x \\arcsin(${k}x) \\right] + \\frac{1}{${k}} \\frac{d}{dx} \\left[ \\sqrt{1 - ${k*k}x^2} \\right] \\\\
        &= \\left( x \\frac{d}{dx} \\arcsin(${k}x) + \\arcsin(${k}x) \\frac{d}{dx}(x) \\right) + \\frac{1}{${k}} \\left( \\frac{1}{2\\sqrt{1-${k*k}x^2}} \\frac{d}{dx}(1-${k*k}x^2) \\right) \\\\
        &= \\left( x \\left(\\frac{1}{\\sqrt{1-(${k}x)^2}}\\right)(${k}) + \\arcsin(${k}x)(1) \\right) + \\frac{1}{${k}} \\left( \\frac{1}{2\\sqrt{1-${k*k}x^2}} (-${2*k*k}x) \\right) \\\\
        &= \\frac{${k}x}{\\sqrt{1-${k*k}x^2}} + \\arcsin(${k}x) - \\frac{${k}x}{\\sqrt{1-${k*k}x^2}} \\\\
        &= \\arcsin(${k}x).
      \\end{align*}$$
      ดังนั้น
      \\begin{equation*}
        f'(x) = ${derivExpr}.
      \\end{equation*}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: คำนวณค่า $f'(${x0})$ โดยแทน $x = ${x0}$ ลงใน $f'(x)$ จะได้</strong>
      $$\\begin{align*}
        f'(${x0}) &= \\arcsin(${k}(${x0})) \\\\
        &= \\arcsin(0) \\\\
        &= 0.
      \\end{align*}$$
      ดังนั้น $f'(${x0}) = 0$.
    </div>
  `;
  return {
    topic: "derivative",
    category: "อนุพันธ์: เอกลักษณ์ตรีโกณมิติผกผันแบบหักล้าง",
    difficulty: "hard",
    probLatex: `f(x) = ${fExpr}`,
    x0: x0,
    targetSymbol: "f'",
    derivLatex: derivExpr,
    ansLatex: `${slopeVal}`,
    promptText: `✍️ ทดลองคำนวณค่าของ $f'(${x0})$:`,
    hintText: `ดิฟพจน์หน้าด้วยกฎผลคูณ และดิฟพจน์หลังด้วยกฎลูกโซ่ สังเกตว่าพจน์ติดรูทจะตัดกันพอดี`,
    solHtml: solText,
    exactNum: slopeVal,
    exactDen: 1
  };
}
