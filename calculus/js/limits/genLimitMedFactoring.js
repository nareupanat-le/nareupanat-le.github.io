function genLimitMedFactoring() {
  let a = rand(-3, 3);
  let termCancel = (a === 0) ? "x" : (a > 0 ? `x - ${a}` : `x + ${Math.abs(a)}`);
  
  let p1 = rand(1, 2), q1 = rand(-3, 3);
  let p2 = rand(1, 2), q2 = rand(-3, 3);
  while (p2 * a + q2 === 0) { q2 = rand(-3, 3); }

  let numExp = poly2(p1, q1 - a * p1, -a * q1);
  let denExp = poly2(p2, q2 - a * p2, -a * q2);

  let numFact = `(${termCancel})(${poly1(p1, q1)})`;
  let denFact = `(${termCancel})(${poly1(p2, q2)})`;

  let numSimp = poly1(p1, q1);
  let denSimp = poly1(p2, q2);

  let numVal = p1 * a + q1;
  let denVal = p2 * a + q2;

  let finalValLatex = toFrac(numVal, denVal);
  let probLatex = `\\lim_{x \\to ${a}} \\frac{${numExp}}{${denExp}}`;

  let solText = `
    <div class="solution-step">
      <strong>ขั้นที่ 1: ตรวจสอบรูปแบบ</strong><br>
      แทนค่า $x = ${a}$ ในโจทย์ จะได้ผลลัพธ์ในรูปแบบไม่กำหนด $\\frac{0}{0}$
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 2: แยกตัวประกอบเศษและส่วน</strong><br>
      ${adaptiveMath(
        `\\lim_{x \\to ${a}} \\frac{${numExp}}{${denExp}} = \\lim_{x \\to ${a}} \\frac{${numFact}}{${denFact}}`,
        `\\lim_{x \\to ${a}} \\frac{${numExp}}{${denExp}} &= \\lim_{x \\to ${a}} \\frac{${numFact}}{${denFact}}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 3: ตัดทอนพจน์ร่วม $(${termCancel})$</strong><br>
      ${adaptiveMath(
        `= \\lim_{x \\to ${a}} \\frac{${numSimp}}{${denSimp}}`,
        `&= \\lim_{x \\to ${a}} \\frac{${numSimp}}{${denSimp}}`
      )}
    </div>
    <div class="solution-step">
      <strong>ขั้นที่ 4: แทนค่า $x = ${a}$ เพื่อหาค่าลิมิต</strong><br>
      ${adaptiveMath(
        `= \\frac{${numVal}}{${denVal}} = ${finalValLatex}`,
        `&= \\frac{${numVal}}{${denVal}} \\\\ &= ${finalValLatex}`
      )}
      ดังนั้น $$\\lim_{x \\to ${a}} \\frac{${numExp}}{${denExp}} = ${finalValLatex}$$
    </div>
  `;

  return {
    topic: "limit",
    category: "ลิมิต: การแยกตัวประกอบพหุนาม",
    difficulty: "med",
    probLatex: probLatex,
    ansLatex: finalValLatex,
    promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
    hintText: `แยกตัวประกอบทั้งเศษและส่วนเพื่อตัดพจน์ $(${termCancel})$`,
    solHtml: solText,
    exactNum: numVal,
    exactDen: denVal
  };
}
