// 4. Combined Pool & Application Controller
// ==========================================
let currentTopic = 'derivative'; // 'all', 'limit', 'derivative'
let currentMode = 'free';  // 'free', 'filter', 'quiz'
let filterDifficulty = 'all'; // 'all', 'easy', 'med', 'hard'

let currentProblem = null;
let scoreCorrect = 0;
let streakCount = 0;

// Quiz Session State
let quizSession = {
  active: false,
  totalQuestions: 5,
  currentIdx: 0,
  score: 0,
  questions: []
};

// Persistent Stats
let userStats = {
  totalAnswered: 0,
  totalCorrect: 0,
  bestStreak: 0,
  limitCorrect: 0,
  derivCorrect: 0,
  hardSolved: 0,
  quizAceCount: 0,
  badges: []
};

const allAchievements = [
  { id: 'first_step', icon: '🥇', title: 'ก้าวแรกสู่แคลคูลัส', desc: 'ตอบถูกข้อแรกสำเร็จ' },
  { id: 'streak_5', icon: '🔥', title: 'ติดไฟต่อเนื่อง', desc: 'ทำ Streak ตอบถูกต่อเนื่อง 5 ข้อ' },
  { id: 'streak_10', icon: '⚡', title: 'แรงไม่หยุด', desc: 'ทำ Streak ตอบถูกต่อเนื่อง 10 ข้อ' },
  { id: 'limit_master', icon: '📘', title: 'เซียนลิมิต', desc: 'ทำโจทย์ลิมิตถูกต้องสะสม 5 ข้อ' },
  { id: 'deriv_master', icon: '📙', title: 'ปรมาจารย์อนุพันธ์', desc: 'ทำโจทย์อนุพันธ์ถูกต้องสะสม 5 ข้อ' },
  { id: 'hard_scholar', icon: '🧠', title: 'ยอดฝีมือระดับท้าทาย', desc: 'แก้โจทย์ระดับท้าทายสำเร็จ 5 ข้อ' },
  { id: 'quiz_ace', icon: '🏆', title: 'Calculus Quiz Ace (5/5)', desc: 'ได้คะแนนเต็มในแบบทดสอบย่อย 5 ข้อ' }
];

//const limitGenerators = [
//  genLimitEasyFactoring,
//  genLimitEasyTrig,
//  genLimitEasyExpLimit,
//  genLimitAbsOneSided,
//  genLimitDiffCubes,
//  genLimitMedFactoring,
//  genLimitMedSqrtConjugate,
//  genLimitMedCbrtConjugate,
//  genLimitMedComplexFraction,
//  genLimitInfinityPolyRatio,
//  genLimitInfinityRadicalRatio,
//  genLimitTrigCotCsc,
//  genLimitHardDoubleConjugate,
//  genLimitHardTrigCube,
//  genLimitHardTrigProduct,
//  genLimitHardInfinityConjugate,
//  genLimitHardTrigPolyPoint,
//  genLimitLHopitalExpTrig,
//  genLimitLHopitalDoubleDeriv,
//  genLimitTrigTanSec
//];

// 1. หมวดอนุพันธ์ฟังก์ชันชัดแจ้ง (Explicit Derivatives: y = f(x)) - ไม่รวมโดยปริยายและเส้นสัมผัส




// =========================================================
// 3.19 โจทย์รูปแบบซับซ้อนพิเศษ (อ้างอิงจากแบบฝึกหัด Workbook)
// =========================================================











const explicitDerivGenerators = [
  genDerivWbSecExp,
  genDerivWbProductExpPoly,
  genDerivWbLogCos,
  genDerivWbArctanLog,
  genDerivWbExpSinRadical,

  genDerivEasyPoly,
  genDerivEasyTrig,
  genDerivEasyExp,
  genDerivFractionalPower,
  genDerivProductPoly,
  genDerivMedProductExp,
  genDerivMedQuotientRational,
  genDerivMedChainRadical,
  genDerivMedChainLog,
  genDerivMedInverseTrig,
  genDerivTrigSec,
  genDerivTrigTanChain,
  genDerivTrigCscCot,
  genDerivTrigCotCscPure,
  genDerivInverseTrigArcCosCot,
  genDerivMixedPolyCot,
  genDerivGeneralExp,
  genDerivHardLogDiff,
  genDerivHardDamped,
  genDerivHardInverseTrigCancellation,
  genDerivHardArctanRational,
  genDerivHardLogNestedRadical,
  genDerivHardSecondDerivative,
  genDerivInverseTrigArcSecCsc,
  genDerivMixedExpArcCot,
  genDerivMixedNestedTrig,
  genDerivMixedQuotientTrigRadical,
  genDerivMixedLogTrig
];

// Alias เพื่อความเข้ากันได้
const derivGenerators = explicitDerivGenerators;

// 2. หมวดอนุพันธ์ฟังก์ชันโดยปริยาย (Implicit Derivatives)
const implicitGenerators = [
  genDerivImplicitCircle,
  genDerivImplicitPolynomial
];

// 3. หมวดเส้นสัมผัสและเส้นปกติ (Tangent & Normal Lines)
const tangentNormalGenerators = [
  genDerivEasyTangent,
  genDerivNormalLine
];

// หมวดทั้งหมด (คละบทเรียน)
const allGenerators = [
  //...limitGenerators,
  ...explicitDerivGenerators,
  ...implicitGenerators,
  ...tangentNormalGenerators
];

function loadStats() {
  try {
    let saved = localStorage.getItem('cal_hub_stats');
    if (saved) userStats = Object.assign(userStats, JSON.parse(saved));
  } catch(e) { console.warn("LocalStorage load error:", e); }
}

function saveStats() {
  try {
    localStorage.setItem('cal_hub_stats', JSON.stringify(userStats));
  } catch(e) { console.warn("LocalStorage save error:", e); }
}

function checkAchievements(isCorrect) {
  if (isCorrect && userStats.totalCorrect >= 1 && !userStats.badges.includes('first_step')) {
    userStats.badges.push('first_step');
  }
  if (streakCount >= 5 && !userStats.badges.includes('streak_5')) {
    userStats.badges.push('streak_5');
  }
  if (streakCount >= 10 && !userStats.badges.includes('streak_10')) {
    userStats.badges.push('streak_10');
  }
  if (userStats.limitCorrect >= 5 && !userStats.badges.includes('limit_master')) {
    userStats.badges.push('limit_master');
  }
  if (userStats.derivCorrect >= 5 && !userStats.badges.includes('deriv_master')) {
    userStats.badges.push('deriv_master');
  }
  if (userStats.hardSolved >= 5 && !userStats.badges.includes('hard_scholar')) {
    userStats.badges.push('hard_scholar');
  }
  if (quizSession.score === 5 && !userStats.badges.includes('quiz_ace')) {
    userStats.badges.push('quiz_ace');
  }
  saveStats();
}

function resetToPlaceholder() {
  currentProblem = null;
  
  // รีเซ็ตพื้นที่แสดงโจทย์
  let probBox = document.getElementById('probBox');
  if (probBox) {
    probBox.innerHTML = `
      <div style="text-align: center; color: var(--muted); padding: 40px 0;">
        <div style="font-size: 2.5rem; margin-bottom: 12px;">🎲</div>
        <div style="font-size: 1.1rem; font-weight: 600; color: var(--text);">พร้อมฝึกฝนโจทย์แคลคูลัส 1 หรือยัง?</div>
        <div style="font-size: 0.9rem; margin-top: 6px;">กดปุ่มด้านล่างเพื่อสุ่มโจทย์ใหม่ หรือเริ่มทำแบบทดสอบได้ทันที!</div>
      </div>
    `;
  }
  
  document.getElementById('topicBadge').textContent = 'สถานะ: รอสุ่มโจทย์';
  document.getElementById('diffBadge').classList.add('hidden');
  
  document.getElementById('ansBox').classList.add('hidden');
  document.getElementById('solBox').classList.add('hidden');
  document.getElementById('hintBox').classList.add('hidden');
  
  let quizPromptLabel = document.getElementById('quizPromptLabel');
  if (quizPromptLabel) quizPromptLabel.innerHTML = "✍️ ทดลองคำนวณและใส่คำตอบ:";
  
  let inputEl = document.getElementById('userAnsInput');
  if (inputEl) {
    inputEl.value = '';
    inputEl.classList.remove('input-success', 'input-error');
  }
  
  let feedback = document.getElementById('feedbackBox');
  if (feedback) {
    feedback.style.display = 'none';
    feedback.className = 'feedback-box';
    feedback.innerHTML = '';
  }
}

function setTopic(topic) {
  currentTopic = topic;
  document.getElementById('topicAllBtn').classList.toggle('active', topic === 'all');
  document.getElementById('topicLimitBtn').classList.toggle('active', topic === 'limit');
  document.getElementById('topicDerivBtn').classList.toggle('active', topic === 'derivative');
  document.getElementById('topicTangentBtn').classList.toggle('active', topic === 'tangent_normal');
  document.getElementById('topicImplicitBtn').classList.toggle('active', topic === 'implicit');

  resetToPlaceholder();
}

function setMode(mode) {
  currentMode = mode;
  document.getElementById('modeFreeBtn').classList.toggle('active', mode === 'free');
  document.getElementById('modeFilterBtn').classList.toggle('active', mode === 'filter');
  document.getElementById('modeQuizBtn').classList.toggle('active', mode === 'quiz');

  document.getElementById('filterPillsRow').classList.toggle('hidden', mode !== 'filter');
  document.getElementById('quizProgressWrap').classList.toggle('hidden', mode !== 'quiz');
  document.getElementById('quizCounterLabel').classList.toggle('hidden', mode !== 'quiz');
  document.getElementById('quizReportCard').classList.add('hidden');

  quizSession.active = false;
  let btnAction = document.getElementById('btnMainAction');
  if (mode === 'quiz') {
    btnAction.textContent = '▶️ เริ่มทำแบบทดสอบ 5 ข้อ';
  } else {
    btnAction.textContent = '🎲 สุ่มโจทย์ใหม่';
  }

  resetToPlaceholder();
}

function setFilterDifficulty(diff) {
  filterDifficulty = diff;
  document.querySelectorAll('.filter-pill').forEach(el => {
    el.classList.toggle('active', el.getAttribute('onclick').includes(`'${diff}'`));
  });
  resetToPlaceholder();
}

function getActivePool() {
  let pool = allGenerators;
  //if (currentTopic === 'limit') pool = limitGenerators;
  if (currentTopic === 'derivative' || currentTopic === 'explicit') pool = explicitDerivGenerators;
  else if (currentTopic === 'implicit') pool = implicitGenerators;
  else if (currentTopic === 'tangent_normal') pool = tangentNormalGenerators;

  if (currentMode === 'filter' && filterDifficulty !== 'all') {
    let filtered = pool.filter(g => {
      let testObj = g();
      return testObj.difficulty === filterDifficulty;
    });
    if (filtered.length > 0) pool = filtered;
  }
  return pool;
}

function generateNextProblem() {
  if (currentMode === 'quiz') {
    if (!quizSession.active) {
      startQuizSession();
    } else if (quizSession.currentIdx < quizSession.totalQuestions - 1) {
      quizSession.currentIdx++;
      loadQuizQuestion(quizSession.currentIdx);
    } else {
      finishQuizSession();
    }
  } else {
    generateRandomProblem();
  }
}

function generateRandomProblem() {
  let pool = getActivePool();
  let gen = pool[Math.floor(Math.random() * pool.length)];
  currentProblem = gen();
  renderProblemView(currentProblem);
}

function renderProblemView(prob) {
  // ป้ายแสดงระดับความยาก
  const diffBadge = document.getElementById('diffBadge');
  diffBadge.classList.remove('hidden', 'badge-easy', 'badge-med', 'badge-hard');
  if (prob.difficulty === 'easy') {
    diffBadge.classList.add('badge-easy');
    diffBadge.innerHTML = '🟢 ระดับ: พื้นฐาน';
  } else if (prob.difficulty === 'med') {
    diffBadge.classList.add('badge-med');
    diffBadge.innerHTML = '🟡 ระดับ: ปานกลาง';
  } else {
    diffBadge.classList.add('badge-hard');
    diffBadge.innerHTML = '🔴 ระดับ: ท้าทาย';
  }

  // อัปเดต UI
  document.getElementById('topicBadge').textContent = prob.category;
  
  if (prob.topic === 'limit') {
    document.getElementById('probBox').innerHTML = `
      <div style="font-size: 0.95rem; color: var(--muted); margin-bottom: 6px;">จงหาค่าของลิมิตต่อไปนี้:</div>
      $$\\displaystyle ${prob.probLatex}$$
    `;
    document.getElementById('ansContent').innerHTML = `$$\\displaystyle ${prob.ansLatex}$$`;
  } else {
    const sym = prob.targetSymbol || "f'";
    if (prob.customProbPrompt) {
      document.getElementById('probBox').innerHTML = prob.customProbPrompt;
    } else {
      document.getElementById('probBox').innerHTML = `
        <div style="font-size: 0.95rem; color: var(--muted); margin-bottom: 6px;">กำหนดฟังก์ชัน:</div>
        $$\\displaystyle ${prob.probLatex}$$
        <div style="font-size: 0.95rem; color: var(--muted); margin-top: 6px;">จงหาอนุพันธ์ $${sym}(x)$ และคำนวณค่าของ $${sym}(${prob.x0})$</div>
      `;
    }

    if (prob.customAnsContent) {
      document.getElementById('ansContent').innerHTML = prob.customAnsContent;
    } else {
      document.getElementById('ansContent').innerHTML = `
        <strong>อนุพันธ์:</strong> $$\\displaystyle ${sym}(x) = ${prob.derivLatex}$$
        <strong>ค่าที่จุด $x = ${prob.x0}$:</strong> $$\\displaystyle ${sym}(${prob.x0}) = ${prob.ansLatex}$$
        ${prob.tangentLatex ? `<strong>สมการเส้นสัมผัสที่จุด $x = ${prob.x0}$:</strong> $$\\displaystyle ${prob.tangentLatex}$$` : ""}
      `;
    }
  }

  document.getElementById('quizPromptLabel').innerHTML = prob.promptText || "✍️ ทดลองคำนวณและใส่คำตอบ:";
  document.getElementById('solContent').innerHTML = prob.solHtml;

  // Hint content
  document.getElementById('hintContent').textContent = prob.hintText || "ลองตรวจสอบรูปแบบและจัดรูปทีละขั้นตอน";
  document.getElementById('hintBox').classList.add('hidden');

  // รีเซ็ตสถานะ
  document.getElementById('ansBox').classList.add('hidden');
  document.getElementById('solBox').classList.add('hidden');
  
  let inputEl = document.getElementById('userAnsInput');
  inputEl.value = '';
  inputEl.classList.remove('input-success', 'input-error');

  let feedback = document.getElementById('feedbackBox');
  feedback.style.display = 'none';
  feedback.className = 'feedback-box';
  feedback.innerHTML = '';

  safeRenderMath(document.getElementById('probBox'));
  safeRenderMath(document.getElementById('quizPromptLabel'));
}

function startQuizSession() {
  quizSession.active = true;
  quizSession.currentIdx = 0;
  quizSession.score = 0;
  quizSession.questions = [];

  let pool = getActivePool();

  let easyPool = pool.filter(g => g().difficulty === 'easy');
  let medPool = pool.filter(g => g().difficulty === 'med');
  let hardPool = pool.filter(g => g().difficulty === 'hard');

  const pick = (arr, fallbackArr) => {
    let target = (arr && arr.length > 0) ? arr : fallbackArr;
    return target[Math.floor(Math.random() * target.length)]();
  };

  quizSession.questions.push(pick(easyPool, pool));
  quizSession.questions.push(pick(medPool, pool));
  quizSession.questions.push(pick(medPool, pool));
  quizSession.questions.push(pick(hardPool, pool));
  quizSession.questions.push(pick(hardPool, pool));

  document.getElementById('quizReportCard').classList.add('hidden');
  loadQuizQuestion(0);
}

function loadQuizQuestion(idx) {
  currentProblem = quizSession.questions[idx];
  document.getElementById('quizCounterLabel').textContent = `ข้อที่ ${idx + 1}/${quizSession.totalQuestions}`;
  document.getElementById('quizProgressBar').style.width = `${((idx + 1) / quizSession.totalQuestions) * 100}%`;
  
  let btnAction = document.getElementById('btnMainAction');
  btnAction.textContent = (idx === quizSession.totalQuestions - 1) ? '🏁 ส่งคำตอบ & สรุปผล' : '➡️ ข้อถัดไป';

  renderProblemView(currentProblem);
}

function finishQuizSession() {
  quizSession.active = false;
  document.getElementById('quizReportCard').classList.remove('hidden');

  let score = quizSession.score;
  let pct = Math.round((score / quizSession.totalQuestions) * 100);
  document.getElementById('quizScoreVal').textContent = score;
  document.getElementById('quizPercentVal').textContent = `${pct}%`;

  let gradeBadge = document.getElementById('quizGradeBadge');
  if (score === 5) { gradeBadge.textContent = 'A+'; gradeBadge.style.color = '#2e7d32'; }
  else if (score === 4) { gradeBadge.textContent = 'B'; gradeBadge.style.color = '#1565c0'; }
  else if (score >= 3) { gradeBadge.textContent = 'C'; gradeBadge.style.color = '#e65100'; }
  else { gradeBadge.textContent = 'D'; gradeBadge.style.color = '#c62828'; }

  if (score === 5) {
    userStats.quizAceCount++;
  }
  checkAchievements(true);
}

function parseInputFraction(str) {
  str = str.trim().replace(/\s+/g, '');
  if (!str) return null;
  if (str.includes('/')) {
    let parts = str.split('/');
    if (parts.length !== 2) return null;
    let n = parseFloat(parts[0]);
    let d = parseFloat(parts[1]);
    if (isNaN(n) || isNaN(d) || d === 0) return null;
    return { val: n / d, num: n, den: d };
  }
  let v = parseFloat(str);
  if (isNaN(v)) return null;
  return { val: v, num: v, den: 1 };
}

function checkAnswer() {
  let feedback = document.getElementById('feedbackBox');
  let inputEl = document.getElementById('userAnsInput');
  inputEl.classList.remove('input-success', 'input-error');

  if (!currentProblem) {
    feedback.className = 'feedback-box feedback-error';
    feedback.innerHTML = '<div class="feedback-title"><span>⚠️</span> ยังไม่มีโจทย์</div><div>กรุณากดปุ่ม <strong>"🎲 สุ่มโจทย์ใหม่"</strong> ก่อนทำแบบฝึกหัดครับ</div>';
    return;
  }
  
  let inputStr = inputEl.value;
  let parsed = parseInputFraction(inputStr);

  if (!parsed) {
    inputEl.classList.add('input-error');
    feedback.className = 'feedback-box feedback-error';
    feedback.innerHTML = '<div class="feedback-title"><span>⚠️</span> รูปแบบคำตอบไม่ถูกต้อง</div><div>กรุณากรอกเป็นตัวเลขหรือเศษส่วน เช่น <code>1/2</code>, <code>-3/4</code>, <code>6</code>, <code>0</code></div>';
    return;
  }

  let exactVal = currentProblem.exactNum / currentProblem.exactDen;
  let isCorrect = Math.abs(parsed.val - exactVal) < 1e-5;

  userStats.totalAnswered++;

  if (isCorrect) {
    scoreCorrect++;
    streakCount++;
    userStats.totalCorrect++;
    if (currentProblem.topic === 'limit') userStats.limitCorrect++;
    else if (currentProblem.topic === 'derivative') userStats.derivCorrect++;
    if (currentProblem.difficulty === 'hard') userStats.hardSolved++;
    if (streakCount > userStats.bestStreak) userStats.bestStreak = streakCount;
    if (quizSession.active) quizSession.score++;

    document.getElementById('scoreCorrect').textContent = scoreCorrect;
    document.getElementById('streakCount').textContent = streakCount;

    inputEl.classList.add('input-success');
    feedback.className = 'feedback-box feedback-success';
    feedback.innerHTML = `
      <div class="feedback-title"><span>✅</span> ถูกต้องยอดเยี่ยม!</div>
      <div style="font-size: 1.05rem; margin-top: 4px;">
        คำตอบที่คุณใส่คือ <code>${inputStr}</code> — ตรงกับค่าจริง $$\\displaystyle ${currentProblem.ansLatex}$$
      </div>
    `;
  } else {
    streakCount = 0;
    document.getElementById('streakCount').textContent = streakCount;

    inputEl.classList.add('input-error');
    feedback.className = 'feedback-box feedback-error';
    feedback.innerHTML = `
      <div class="feedback-title"><span>❌</span> ยังไม่ถูกต้อง</div>
      <div style="font-size: 1.05rem; margin-top: 4px;">
        คำตอบที่คุณใส่คือ <code>${inputStr}</code> — ยังไม่ตรงกับค่าคำตอบของโจทย์ข้อนี้
      </div>
      <div style="font-size: 0.95rem; margin-top: 8px; color: #721c24;">
        💡 คำแนะนำ: ลองกดปุ่ม <strong>"💡 ดูคำใบ้"</strong> หรือกดปุ่ม <strong>"ดูวิธีทำอย่างละเอียด"</strong> ด้านล่าง
      </div>
    `;
  }

  checkAchievements(isCorrect);
  safeRenderMath(feedback);
}

function toggleHint() {
  let box = document.getElementById('hintBox');
  box.classList.toggle('hidden');
  if (!box.classList.contains('hidden')) {
    safeRenderMath(box);
  }
}

function toggleAnswer() {
  if (!currentProblem) return;
  let box = document.getElementById('ansBox');
  box.classList.toggle('hidden');
  if (!box.classList.contains('hidden')) safeRenderMath(box);
}

function toggleSolution() {
  if (!currentProblem) return;
  let box = document.getElementById('solBox');
  box.classList.toggle('hidden');
  if (!box.classList.contains('hidden')) safeRenderMath(box);
}

function toggleStatsModal() {
  let modal = document.getElementById('statsModal');
  modal.classList.toggle('hidden');
  if (!modal.classList.contains('hidden')) {
    document.getElementById('statTotalAnswered').textContent = userStats.totalAnswered;
    document.getElementById('statTotalCorrect').textContent = userStats.totalCorrect;
    document.getElementById('statLimitCorrect').textContent = userStats.limitCorrect;
    document.getElementById('statDerivCorrect').textContent = userStats.derivCorrect;
    let acc = userStats.totalAnswered > 0 ? Math.round((userStats.totalCorrect / userStats.totalAnswered)*100) : 0;
    document.getElementById('statAccuracy').textContent = `${acc}%`;
    document.getElementById('statBestStreak').textContent = userStats.bestStreak;

    let list = document.getElementById('achievementsList');
    list.innerHTML = allAchievements.map(ach => {
      let isUnlocked = userStats.badges.includes(ach.id);
      return `
        <div class="achievement-item ${isUnlocked ? '' : 'locked'}">
          <div class="achievement-icon">${ach.icon}</div>
          <div>
            <div style="font-weight:700; font-size:0.95rem;">${ach.title} ${isUnlocked ? '✅' : '🔒'}</div>
            <div style="font-size:0.85rem; color:#666;">${ach.desc}</div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function resetStats() {
  if (confirm("คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตสถิติและความสำเร็จทั้งหมด?")) {
    userStats = { totalAnswered: 0, totalCorrect: 0, bestStreak: 0, limitCorrect: 0, derivCorrect: 0, hardSolved: 0, quizAceCount: 0, badges: [] };
    scoreCorrect = 0; streakCount = 0;
    document.getElementById('scoreCorrect').textContent = 0;
    document.getElementById('streakCount').textContent = 0;
    saveStats();
    toggleStatsModal();
  }
}

// ล้างกรอบ error/success เมื่อเริ่มพิมพ์ใหม่
document.getElementById('userAnsInput').addEventListener('input', function() {
  this.classList.remove('input-success', 'input-error');
});

// Enter Key triggers answer check
document.getElementById('userAnsInput').addEventListener('keyup', function(e) {
  if (e.key === 'Enter') {
    checkAnswer();
  }
});

// เริ่มต้นหน้าเว็บ
document.addEventListener('DOMContentLoaded', function() {
  loadStats();
  document.getElementById('scoreCorrect').textContent = scoreCorrect;
  document.getElementById('streakCount').textContent = streakCount;

  let yearSpan = document.getElementById('y');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Highlight เมนูปัจจุบัน
  var currentUrl = window.location.pathname; 
  var navLinks = document.querySelectorAll('.nav a');
  navLinks.forEach(function(link) {
    var linkUrl = link.getAttribute('href');
    if (linkUrl === currentUrl || (linkUrl === '/' && currentUrl === '/index.html')) {
      link.classList.add('active');
    }
  });

  // URL Parameter check
  const urlParams = new URLSearchParams(window.location.search);
  const topicParam = urlParams.get('topic');
  if (['limit', 'derivative', 'tangent_normal', 'implicit'].includes(topicParam)) {
    setTopic(topicParam);
  } else {
    resetToPlaceholder();
  }
});