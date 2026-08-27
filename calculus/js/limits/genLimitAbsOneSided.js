function genLimitAbsOneSided() {
  let isType2 = Math.random() < 0.5;
  if (!isType2) {
    let a = rand(-4, 4);
    let isRight = Math.random() < 0.5;
    let signDir = isRight ? "+" : "-";
    let absA = Math.abs(a);
    let term = (a === 0) ? "x" : (a > 0 ? `x - ${a}` : `x + ${absA}`);
    let probLatex = `\\lim_{x \\to ${a}^{${signDir}}} \\frac{|${term}|}{${term}}`;
    let ansVal = isRight ? 1 : -1;

    let solText = `
      <div class="solution-step">
        <strong>ขั้นที่ 1: พิจารณานิยามค่าสัมบูรณ์ $|${term}|$</strong><br>
        จากนิยามค่าสัมบูรณ์ $|u| = \\begin{cases} u & \\text{เมื่อ } u \\geq 0 \\\\ -u & \\text{เมื่อ } u < 0 \\end{cases}$
      </div>
      <div class="solution-step">
        <strong>ขั้นที่ 2: พิจารณาทิศทางของลิมิต $x \\to ${a}^{${signDir}}$</strong><br>
        เมื่อ $x \\to ${a}^{${signDir}}$ จะได้ว่า ${isRight ? `${term} > 0$ ดังนั้น $|${term}| = ${term}` : `${term} < 0$ ดังนั้น $|${term}| = -(${term})`}
      </div>
      <div class="solution-step">
        <strong>ขั้นที่ 3: แทนค่าและคำนวณลิมิต</strong><br>
        ${adaptiveMath(
          `\\lim_{x \\to ${a}^{${signDir}}} \\frac{|${term}|}{${term}} = \\lim_{x \\to ${a}^{${signDir}}} \\frac{${isRight ? term : `-(${term})`}}{${term}} = ${ansVal}`,
          `\\lim_{x \\to ${a}^{${signDir}}} \\frac{|${term}|}{${term}} &= \\lim_{x \\to ${a}^{${signDir}}} \\frac{${isRight ? term : `-(${term})`}}{${term}} \\\\ &= ${ansVal}`
        )}
        ดังนั้น $$\\lim_{x \\to ${a}^{${signDir}}} \\frac{|${term}|}{${term}} = ${ansVal}$$
      </div>
    `;

    return {
      topic: "limit",
      category: "ลิมิต: ค่าสัมบูรณ์ทางเดียว",
      difficulty: "easy",
      probLatex: probLatex,
      ansLatex: `${ansVal}`,
      promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
      hintText: `พิจารณาเครื่องหมายของพจน์ในค่าสัมบูรณ์เมื่อ $x \\to ${a}^{${signDir}}$`,
      solHtml: solText,
      exactNum: ansVal,
      exactDen: 1
    };
  } else {
    let a = rand(2, 5);
    let b = rand(1, 3);
    let c = rand(2, 4);
    let d = rand(1, 2);
    while (c + d === 0) { d = rand(1, 3); }

    let probLatex = `\\lim_{x \\to 0^-} \\frac{${a}x - ${b === 1 ? "" : b}|x|}{${c}x - ${d === 1 ? "" : d}|x|}`;
    let numVal = a + b;
    let denVal = c + d;
    let finalLatex = toFrac(numVal, denVal);

    let solText = `
      <div class="solution-step">
        <strong>ขั้นที่ 1: พิจารณานิยามค่าสัมบูรณ์ $|x|$ เมื่อ $x \\to 0^-$</strong><br>
        เนื่องจาก $x \\to 0^-$ หมายถึง $x < 0$ ดังนั้น $|x| = -x$
      </div>
      <div class="solution-step">
        <strong>ขั้นที่ 2: แทน $|x| = -x$ ลงในโจทย์</strong><br>
        ${adaptiveMath(
          `\\frac{${a}x - ${b === 1 ? "" : b}(-x)}{${c}x - ${d === 1 ? "" : d}(-x)} = \\frac{${a}x + ${b === 1 ? "" : b}x}{${c}x + ${d === 1 ? "" : d}x} = \\frac{${numVal}x}{${denVal}x}`,
          `\\lim_{x \\to 0^-} \\frac{${a}x - ${b === 1 ? "" : b}|x|}{${c}x - ${d === 1 ? "" : d}|x|} &= \\lim_{x \\to 0^-} \\frac{${a}x - ${b === 1 ? "" : b}(-x)}{${c}x - ${d === 1 ? "" : d}(-x)} \\\\ &= \\lim_{x \\to 0^-} \\frac{${numVal}x}{${denVal}x}`
        )}
      </div>
      <div class="solution-step">
        <strong>ขั้นที่ 3: ตัดทอน $x$ และหาค่าลิมิต</strong><br>
        ${adaptiveMath(
          `= \\lim_{x \\to 0^-} \\frac{${numVal}}{${denVal}} = ${finalLatex}`,
          `&= \\lim_{x \\to 0^-} \\frac{${numVal}}{${denVal}} \\\\ &= ${finalLatex}`
        )}
        ดังนั้น $$\\lim_{x \\to 0^-} \\frac{${a}x - ${b === 1 ? "" : b}|x|}{${c}x - ${d === 1 ? "" : d}|x|} = ${finalLatex}$$
      </div>
    `;

    return {
      topic: "limit",
      category: "ลิมิต: ค่าสัมบูรณ์ทางเดียว",
      difficulty: "easy",
      probLatex: probLatex,
      ansLatex: finalLatex,
      promptText: "✍️ ทดลองคำนวณและใส่ค่าลิมิต:",
      hintText: `เมื่อ $x \\to 0^-$ จะได้ว่า $x < 0$ ดังนั้นปลดค่าสัมบูรณ์ $|x| = -x$`,
      solHtml: solText,
      exactNum: numVal,
      exactDen: denVal
    };
  }
}
