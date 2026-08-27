function genLimitLHopitalDoubleDeriv() {
  let k = rand(2, 4);
  let probLatex = `\\lim_{x \\to 0} \\frac{e^{${k}x} - ${k}x - 1}{x^2}`;
  let finalNum = k * k;
  let finalDen = 2;
  let finalValLatex = toFrac(finalNum, finalDen);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: ตรวจสอบรูปแบบ</strong><br>
      เมื่อ $x \\to 0$ จะได้ $\\frac{e^0 - 0 - 1}{0} = \\frac{0}{0}$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: ใช้หลักเกณฑ์ลอปีตาลครั้งที่ 1</strong><br>
      ${adaptiveMath(
        `\\lim_{x \\to 0} \\frac{\\frac{d}{dx}\\left(e^{${k}x} - ${k}x - 1\\right)}{\\frac{d}{dx}\\left(x^2\\right)} = \\lim_{x \\to 0} \\frac{${k}e^{${k}x} - ${k}}{2x}`,
        `\\lim_{x \\to 0} \\frac{e^{${k}x} - ${k}x - 1}{x^2} &= \\lim_{x \\to 0} \\frac{${k}e^{${k}x} - ${k}}{2x}`
      )}
      เมื่อแทน $x = 0$ ยังคงได้รูปแบบ $\\frac{0}{0}$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: ใช้หลักเกณฑ์ลอปีตาลครั้งที่ 2</strong><br>
      ${adaptiveMath(
        `= \\lim_{x \\to 0} \\frac{\\frac{d}{dx}\\left(${k}e^{${k}x} - ${k}\\right)}{\\frac{d}{dx}(2x)} = \\lim_{x \\to 0} \\frac{${k*k}e^{${k}x}}{2}`,
        `&= \\lim_{x \\to 0} \\frac{${k*k}e^{${k}x}}{2}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 4: แทนค่า $x = 0$</strong><br>
      ${adaptiveMath(
        `= \\frac{${k*k}e^0}{2} = ${finalValLatex}`,
        `&= \\frac{${k*k}(1)}{2} \\\\ &= ${finalValLatex}`
      )}
      ดังนั้น $$\\lim_{x \\to 0} \\frac{e^{${k}x} - ${k}x - 1}{x^2} = ${finalValLatex}$$
    </div>
  `;

  return {
    topic: "limit",
    category: "ลิมิต: ลอปีตาลหาอนุพันธ์ 2 ครั้ง",
    difficulty: "hard",
    probLatex: probLatex,
    ansLatex: finalValLatex,
    promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
    hintText: `เนื่องจากดิฟครั้งแรกยังคงเป็น $0/0$ ให้ใช้หลักเกณฑ์ลอปีตาลซ้ำครั้งที่สอง`,
    solHtml: solText,
    exactNum: finalNum,
    exactDen: finalDen
  };
}
