function genLimitMedComplexFraction() {
  let a = randNonZero(-3, 3);
  let absA = Math.abs(a);
  let k = rand(1, 3);
  let numPart = (a > 0) ? `\\frac{${k}}{x} - \\frac{${k}}{${a}}` : `\\frac{${k}}{x} + \\frac{${k}}{${absA}}`;
  let denPart = (a > 0) ? `x - ${a}` : `x + ${absA}`;
  let termCancel = (a > 0) ? `x - ${a}` : `x + ${absA}`;
  let probLatex = `\\lim_{x \\to ${a}} \\frac{${numPart}}{${denPart}}`;
  
  let finalNum = -k;
  let finalDen = a * a;
  let finalValLatex = toFrac(finalNum, finalDen);

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: ตรวจสอบรูปแบบ</strong><br>
      แทนค่า $x = ${a}$ จะได้ $\\frac{0}{0}$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: ทำตัวส่วนของเศษส่วนซ้อนให้เท่ากัน</strong><br>
      ${adaptiveMath(
        `${numPart} = \\frac{${k}(${a}) - ${k}x}{${a}x} = \\frac{-${k === 1 ? "" : k}(${termCancel})}{${a >= 0 ? a : `(${a})`}x}`,
        `${numPart} &= \\frac{${k}(${a}) - ${k}x}{${a >= 0 ? a : `(${a})`}x} \\\\ &= \\frac{-${k === 1 ? "" : k}(${termCancel})}{${a >= 0 ? a : `(${a})`}x}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: แทนกลับในลิมิตและตัดทอนพจน์ $(${termCancel})$</strong><br>
      ${adaptiveMath(
        `\\lim_{x \\to ${a}} \\frac{-${k === 1 ? "" : k}(${termCancel})}{${a >= 0 ? a : `(${a})`}x(${termCancel})} = \\lim_{x \\to ${a}} \\frac{-${k}}{${a >= 0 ? a : `(${a})`}x}`,
        `\\lim_{x \\to ${a}} \\frac{-${k === 1 ? "" : k}(${termCancel})}{${a >= 0 ? a : `(${a})`}x(${termCancel})} &= \\lim_{x \\to ${a}} \\frac{-${k}}{${a >= 0 ? a : `(${a})`}x}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 4: แทนค่า $x = ${a}$</strong><br>
      ${adaptiveMath(
        `= \\frac{-${k}}{(${a})(${a})} = ${finalValLatex}`,
        `&= \\frac{-${k}}{(${a})(${a})} \\\\ &= ${finalValLatex}`
      )}
      ดังนั้น $$\\lim_{x \\to ${a}} \\frac{${numPart}}{${denPart}} = ${finalValLatex}$$
    </div>
  `;

  return {
    topic: "limit",
    category: "ลิมิต: เศษส่วนซ้อน",
    difficulty: "med",
    probLatex: probLatex,
    ansLatex: finalValLatex,
    promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
    hintText: `หา ครน. ทำตัวส่วนของเศษส่วนซ้อนข้างบนให้เท่ากันก่อนตัดพจน์ $(${termCancel})$`,
    solHtml: solText,
    exactNum: finalNum,
    exactDen: finalDen
  };
}
