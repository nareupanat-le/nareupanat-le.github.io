// Scripts are loaded globally in index.html

let currentCase = "(0, 1, 0, 0)";
let currentStrategy = new Strategy_0100();
let isSolutionVisible = false;
let slotsData = [];
let tilesData = {};
let selectedTileId = null;

// Turn-based state
let turnHistory = [];
let previousBoardState = [];
let turnCount = 1;

// DOM Elements
const lblCase = document.getElementById('lbl-case');
const btnRandomize = document.getElementById('btn-randomize');
const entryA1 = document.getElementById('entry-a1');
const entryA2 = document.getElementById('entry-a2');
const entryGamma = document.getElementById('entry-gamma');
const entryDelta = document.getElementById('entry-delta');
const btnLoad = document.getElementById('btn-load');
const btnToggleSol = document.getElementById('btn-toggle-sol');
const btnGenerate = document.getElementById('btn-generate');
const btnCopy = document.getElementById('btn-copy');

const btnRecordTurn = document.getElementById('btn-record-turn');
const btnGenerateLog = document.getElementById('btn-generate-log');
const btnCopyLog = document.getElementById('btn-copy-log');
const logOutput = document.getElementById('log-output');

const boardPanel = document.getElementById('board-panel');
const cellsSol = document.getElementById('cells-sol');
const cellsGamma = document.getElementById('cells-gamma');
const cellsSlots = document.getElementById('cells-slots');
const cellsTiles = document.getElementById('cells-tiles');

const outputPanel = document.getElementById('output-panel');
const latexOutput = document.getElementById('latex-output');
const mathjaxPreview = document.getElementById('mathjax-preview');

function getStrategy(lm1, rm1, caseVal) {
    if (lm1 === 0 && rm1 === 0) return new Strategy_00xx();
    if (caseVal === "(0, 1, 0, 0)") return new Strategy_0100();
    return new StrategyFuture();
}

btnRandomize.addEventListener('click', generateIncomparable);

function generateIncomparable() {
    boardPanel.style.display = 'none';
    outputPanel.style.display = 'none';
    isSolutionVisible = false;
    btnToggleSol.innerText = '👁️ Show Solution';
    
    const cases = ["(0, 0, 0, 0)", "(0, 0, 0, 1)", "(0, 0, 1, 0)", "(0, 0, 1, 1)", "(0, 1, 0, 0)"];
    currentCase = cases[Math.floor(Math.random() * cases.length)];
    lblCase.innerText = currentCase;
    
    const [lm1, rm1, lm2, rm2] = currentCase.replace(/[()]/g, '').split(', ').map(Number);
    currentStrategy = getStrategy(lm1, rm1, currentCase);
    
    let a1, a2, attempts = 0;
    while (true) {
        attempts++;
        let extend = Math.floor(attempts / 50);
        a1 = generateFullWord(lm1, rm1, 4, 12 + extend);
        a2 = generateFullWord(lm2, rm2, 3, 5 + extend);
        if (a1.split('1').length - 1 < 2) continue;
        if (!a1.includes('0') || !a2.includes('0') || !a2.includes('1')) continue;
        if (!checkLE(a1, a2) && !checkLE(a2, a1) && a1 !== a2) break;
    }
    
    const m = a1.length;
    let c = Array(m).fill(null);
    let onesIndices = [];
    for (let i = 0; i < a1.length; i++) if (a1[i] === '1') onesIndices.push(i);
    
    let shuffled = onesIndices.sort(() => 0.5 - Math.random());
    let j1 = shuffled[0], j2 = shuffled[1];
    c[j1] = a1;
    c[j2] = a2;
    
    for (let i = 0; i < m; i++) {
        if (a1[i] === '0') c[i] = '0';
        else if (c[i] === null) {
            let choices = ['1k', 'a1', 'a2'];
            let choice = choices[Math.floor(Math.random() * choices.length)];
            if (choice === '1k') c[i] = "1".repeat(Math.floor(Math.random() * 3) + 1);
            else if (choice === 'a1') c[i] = a1;
            else c[i] = a2;
        }
    }
    
    const gamma = c.join(" ");
    const selectedDelta = currentStrategy.generateDelta(m, c, a1, a2);
    
    entryA1.value = a1;
    entryA2.value = a2;
    entryGamma.value = gamma;
    entryDelta.value = selectedDelta;
}

btnLoad.addEventListener('click', loadGameBoard);

function loadGameBoard() {
    if (!entryGamma.value || !entryDelta.value) {
        alert("Please Generate Game first!");
        return;
    }
    
    boardPanel.style.display = 'block';
    outputPanel.style.display = 'none';
    
    // Always hide solution by default when loading a new board
    isSolutionVisible = false;
    btnToggleSol.innerText = '👁️ Show Solution';
    
    cellsSol.innerHTML = '';
    cellsGamma.innerHTML = '';
    cellsSlots.innerHTML = '';
    cellsTiles.innerHTML = '';
    
    slotsData = [];
    tilesData = {};
    selectedTileId = null;
    turnHistory = [];
    turnCount = 1;
    btnRecordTurn.innerText = `✅ Record Turn (${turnCount})`;
    
    const gammaRaw = entryGamma.value.trim().split(" ");
    const deltaRaw = entryDelta.value.trim().split(" ");
    
    if (gammaRaw.length !== deltaRaw.length) {
        alert("Gamma (γ) and Delta (δ) must have the same number of blocks (separated by spaces)!");
        return;
    }
    
    const [lm1, rm1] = currentCase.replace(/[()]/g, '').split(', ').map(Number);
    const is00xx = (lm1 === 0 && rm1 === 0);
    
    const uSolution = currentStrategy.calculateSolution(gammaRaw, deltaRaw, entryA1.value.trim(), entryA2.value.trim());
    
    let globalIdx = 0;
    
    // Render Gamma and Slots
    gammaRaw.forEach((block, bIdx) => {
        let blockWrapper = document.createElement('div');
        blockWrapper.className = 'gamma-block';
        
        let slotWrapper = document.createElement('div');
        slotWrapper.style.display = 'flex';
        slotWrapper.style.gap = '2px';
        slotWrapper.style.padding = '5px';
        slotWrapper.style.border = '1px solid transparent';
        
        let solWrapper = document.createElement('div');
        solWrapper.style.display = 'flex';
        solWrapper.style.gap = '2px';
        solWrapper.style.padding = '5px';
        solWrapper.style.border = '1px solid transparent';
        
        for (let i = 0; i < block.length; i++) {
            const currentIdx = globalIdx;
            const char = block[i];
            const solData = uSolution[currentIdx];
            
            // Solution
            let solCell = document.createElement('div');
            solCell.className = `solution-cell sol-${currentIdx} hidden`;
            if (solData) {
                solCell.innerHTML = `${solData.char}<span style="font-size:0.7rem; vertical-align:sub">${solData.sub}</span>`;
            } else {
                solCell.classList.add('empty');
                solCell.innerHTML = 'ε';
            }
            solWrapper.appendChild(solCell);
            
            // Gamma
            let gCell = document.createElement('div');
            gCell.className = 'gamma-cell';
            gCell.innerText = char;
            blockWrapper.appendChild(gCell);
            
            // Slot
            let slot = document.createElement('div');
            slot.className = 'slot';
            slot.dataset.idx = currentIdx;
            
            // Events for Drop
            slot.addEventListener('dragover', (e) => { e.preventDefault(); slot.classList.add('drag-over'); });
            slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
            slot.addEventListener('drop', (e) => handleDrop(e, currentIdx));
            
            // Click-to-Place Event
            slot.addEventListener('click', (e) => {
                if (e.target !== slot) return; // Prevent bubble from tile
                handleSlotClick(currentIdx);
            });
            
            slotWrapper.appendChild(slot);
            
            slotsData[currentIdx] = { element: slot, filledBy: null };
            globalIdx++;
        }
        
        cellsSol.appendChild(solWrapper);
        cellsGamma.appendChild(blockWrapper);
        cellsSlots.appendChild(slotWrapper);
    });
    
    // Render Tiles
    let tileIdx = 0;
    if (is00xx) {
        deltaRaw.forEach((char, i) => {
            createTile(char, i + 1, tileIdx++);
        });
    } else {
        deltaRaw.forEach((block, i) => {
            let blockWrap = document.createElement('div');
            blockWrap.style.display = 'flex';
            blockWrap.style.gap = '2px';
            for (let j = 0; j < block.length; j++) {
                createTile(block[j], i + 1, tileIdx++, blockWrap);
            }
            cellsTiles.appendChild(blockWrap);
        });
    }
    
    // Initialize previous state after rendering
    previousBoardState = slotsData.map(s => s.filledBy);
}

function createTile(char, sub, idx, parent = cellsTiles) {
    let wrapper = document.createElement('div');
    wrapper.className = 'tile-wrapper';
    wrapper.style.width = '40px';
    wrapper.style.height = '40px';

    let tile = document.createElement('div');
    tile.className = 'tile';
    tile.dataset.val = char;
    tile.dataset.id = `tile_${idx}`;
    tile.draggable = true;
    tile.innerHTML = `${char}<div class="sub-index">${sub}</div>`;
    
    tile.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', tile.dataset.id);
        clearSelection(); // clear any click-to-select state
    });
    
    // Click-to-Select Event
    tile.addEventListener('click', () => handleTileClick(tile.dataset.id));
    
    tilesData[`tile_${idx}`] = { char, sub, seq: idx, element: tile, originParent: wrapper };
    wrapper.appendChild(tile);
    parent.appendChild(wrapper);
}

// Click-to-Select & Click-to-Place Mechanics
function handleTileClick(tileId) {
    const tileObj = tilesData[tileId];
    // If clicking already selected tile, deselect
    if (selectedTileId === tileId) {
        clearSelection();
        return;
    }
    
    // Clear previous
    clearSelection();
    
    // Select this one
    selectedTileId = tileId;
    tileObj.element.classList.add('selected');
    
    // Highlight empty slots
    slotsData.forEach(slot => {
        if (!slot.filledBy) {
            slot.element.classList.add('selectable');
        }
    });
}

function handleSlotClick(slotIdx) {
    if (!selectedTileId) {
        // If clicking a filled slot without selection, we can un-place it (return to origin)
        const slot = slotsData[slotIdx];
        if (slot.filledBy) {
            const tileId = slot.filledBy;
            const tileObj = tilesData[tileId];
            tileObj.originParent.appendChild(tileObj.element);
            slot.filledBy = null;
        }
        return;
    }
    
    const slot = slotsData[slotIdx];
    if (slot.filledBy) {
        alert("This slot is already filled!");
        return;
    }
    
    placeTileInSlot(selectedTileId, slotIdx);
    clearSelection();
}

function clearSelection() {
    if (selectedTileId) {
        tilesData[selectedTileId].element.classList.remove('selected');
        selectedTileId = null;
    }
    slotsData.forEach(s => s.element.classList.remove('selectable'));
}

function handleDrop(e, slotIdx) {
    e.preventDefault();
    const slot = slotsData[slotIdx];
    slot.element.classList.remove('drag-over');
    
    const tileId = e.dataTransfer.getData('text/plain');
    if (slot.filledBy) return;
    
    placeTileInSlot(tileId, slotIdx);
}

function placeTileInSlot(tileId, slotIdx) {
    const tileObj = tilesData[tileId];
    const slot = slotsData[slotIdx];
    
    // Remove from old slot if any
    slotsData.forEach(s => {
        if (s.filledBy === tileId) s.filledBy = null;
    });
    
    slot.element.appendChild(tileObj.element);
    slot.filledBy = tileId;
}

btnToggleSol.addEventListener('click', () => {
    isSolutionVisible = !isSolutionVisible;
    document.querySelectorAll('.solution-cell').forEach(cell => {
        if (isSolutionVisible) cell.classList.remove('hidden');
        else cell.classList.add('hidden');
    });
    btnToggleSol.innerText = isSolutionVisible ? '🙈 Hide Solution' : '👁️ Show Solution';
});

btnGenerate.addEventListener('click', () => {
    let uCells = [], placedSeq = [];
    
    for (let i = 0; i < slotsData.length; i++) {
        let slot = slotsData[i];
        if (slot.filledBy) {
            let t = tilesData[slot.filledBy];
            uCells.push(`$${t.char}_{${t.sub}}$`);
            placedSeq.push(t.seq);
        } else {
            uCells.push("$\\varepsilon$");
        }
    }
    
    if (placedSeq.length !== Object.keys(tilesData).length) {
        alert("You haven't placed all elements of δ on the board!");
        return;
    }
    
    let sortedSeq = [...placedSeq].sort((a,b) => a-b);
    if (JSON.stringify(placedSeq) !== JSON.stringify(sortedSeq)) {
        alert("Elements of δ are OUT OF ORDER!");
        return;
    }
    
    const gammaRaw = entryGamma.value.trim().split(" ");
    const deltaRaw = entryDelta.value.trim().split(" ");
    const [lm1, rm1] = currentCase.replace(/[()]/g, '').split(', ').map(Number);
    const is00xx = (lm1 === 0 && rm1 === 0);
    
    const gammaText = gammaRaw.map(b => b !== "0" ? `(${b})` : "0").join("");
    const cols = gammaRaw.map(b => "c".repeat(b.length));
    const colFormat = "c||" + cols.join("|") + "|";
    
    let gammaCells = [];
    gammaRaw.forEach(b => {
        b.split("").forEach(c => gammaCells.push(`$${c}$`));
    });
    const gammaRow = gammaCells.join(" & ");
    
    let deltaCells = [];
    const deltaText = is00xx ? deltaRaw.join("") : deltaRaw.map(b => b !== "0" ? `(${b})` : "0").join("");
    
    for (let i = 0; i < gammaRaw.length; i++) {
        let g = gammaRaw[i], d = deltaRaw[i];
        if (!d) continue; 
        
        let bIdx = i + 1;
        if (d.length === g.length && g.length > 1) {
            deltaCells.push(d.split("").map(c => `$${c}_{${bIdx}}$`).join(" & "));
        } else if (d.length === g.length && g.length === 1) {
            deltaCells.push(`$${d}_{${bIdx}}$`);
        } else {
            deltaCells.push(`\\multicolumn{${g.length}}{|c|}{$${d}_{${bIdx}}$}`);
        }
    }
    
    const latex = currentStrategy.generateLatexText(
        entryA1.value, entryA2.value, gammaText, deltaText, colFormat, gammaRow, deltaCells.join(" & "), uCells.join(" & ")
    );
    
    outputPanel.style.display = 'block';
    latexOutput.value = latex;
    
    // Update MathJax Preview
    let latexPreview = latex;
    
    // 1. Convert text formatting
    latexPreview = latexPreview.replace(/\\noindent\s*/g, '');
    latexPreview = latexPreview.replace(/\\textbf\{([^}]+)\}/g, '<b>$1</b>');
    latexPreview = latexPreview.replace(/\\qedsymbol/g, '$\\blacksquare$');
    latexPreview = latexPreview.replace(/\\ref\{[^}]+\}/g, '???');
    
    // 2. Build HTML Table
    let htmlTable = `<table style="margin: 20px auto; border-collapse: collapse; text-align: center; font-size: 1.1rem;">`;
    
    htmlTable += `<tr><td style="border-right: 3px double var(--text-color); padding: 5px 15px;">$\\gamma$</td>`;
    gammaRaw.forEach((gBlock, i) => {
        gBlock.split('').forEach((c, j) => {
            let borderRight = (j === gBlock.length - 1) ? '1px solid var(--text-color)' : 'none';
            if (i === gammaRaw.length - 1 && j === gBlock.length - 1) borderRight = 'none';
            htmlTable += `<td style="padding: 5px 15px; border-right: ${borderRight};">$${c}$</td>`;
        });
    });
    htmlTable += `</tr>`;
    
    htmlTable += `<tr><td style="border-right: 3px double var(--text-color); padding: 5px 15px;">$\\delta$</td>`;
    for (let i = 0; i < gammaRaw.length; i++) {
        let g = gammaRaw[i];
        let d = deltaRaw[i];
        let bIdx = i + 1;
        let borderRight = (i === gammaRaw.length - 1) ? 'none' : '1px solid var(--text-color)';
        
        if (!d) {
             htmlTable += `<td colspan="${g.length}" style="padding: 5px 15px; border-right: ${borderRight};"></td>`;
        } else if (d.length === g.length && g.length > 1) {
            d.split('').forEach((c, j) => {
                let cellBorder = (j === d.length - 1) ? borderRight : 'none';
                htmlTable += `<td style="padding: 5px 15px; border-right: ${cellBorder};">$${c}_{${bIdx}}$</td>`;
            });
        } else {
            htmlTable += `<td colspan="${g.length}" style="padding: 5px 15px; border-right: ${borderRight};">$${d}_{${bIdx}}$</td>`;
        }
    }
    htmlTable += `</tr>`;
    
    htmlTable += `<tr><td style="border-right: 3px double var(--text-color); padding: 5px 15px;">$\\mathbf{u}$</td>`;
    let uIdx = 0;
    gammaRaw.forEach((gBlock, i) => {
        gBlock.split('').forEach((c, j) => {
            let borderRight = (j === gBlock.length - 1) ? '1px solid var(--text-color)' : 'none';
            if (i === gammaRaw.length - 1 && j === gBlock.length - 1) borderRight = 'none';
            let uVal = uCells[uIdx++];
            htmlTable += `<td style="padding: 5px 15px; border-right: ${borderRight};">${uVal}</td>`;
        });
    });
    htmlTable += `</tr>`;
    
    htmlTable += `</table>`;
    
    // 3. Replace table in preview
    latexPreview = latexPreview.replace(/\\begin\{table\}.*?\\end\{table\}/s, htmlTable);
    
    // Wrap in standard font and render
    mathjaxPreview.innerHTML = `<div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; font-size: 1.15rem;">${latexPreview.replace(/\n/g, '<br>')}</div>`;
    
    if (window.MathJax) {
        MathJax.typesetPromise([mathjaxPreview]).catch(err => console.error(err));
    }
});

btnCopy.addEventListener('click', () => {
    latexOutput.select();
    document.execCommand('copy');
    const oldTxt = btnCopy.innerText;
    btnCopy.innerText = '✅ Copied!';
    setTimeout(() => btnCopy.innerText = oldTxt, 2000);
});

btnRecordTurn.addEventListener('click', () => {
    let actions = [];
    let currentBoardState = slotsData.map(s => s.filledBy);
    
    for (let i = 0; i < slotsData.length; i++) {
        let prev = previousBoardState[i];
        let curr = currentBoardState[i];
        
        if (curr && curr !== prev) {
            let t = tilesData[curr];
            actions.push(`Placed tile ${t.char}_${t.sub} in slot index ${i}`);
        } else if (!curr && prev) {
            let t = tilesData[prev];
            actions.push(`Removed tile ${t.char}_${t.sub} from slot index ${i}`);
        }
    }
    
    if (actions.length === 0) {
        alert("No moves made in this turn!");
        return;
    }
    
    turnHistory.push(`Turn ${turnCount}:\n  - ` + actions.join('\n  - '));
    turnCount++;
    previousBoardState = currentBoardState;
    
    btnRecordTurn.innerText = "✅ Recorded!";
    setTimeout(() => { btnRecordTurn.innerText = `✅ Record Turn (${turnCount})`; }, 1000);
});

btnGenerateLog.addEventListener('click', () => {
    if (turnHistory.length === 0) {
        alert("No turns recorded yet!");
        return;
    }
    
    let summary = `GAME SUMMARY\n`;
    summary += `====================\n`;
    summary += `Initial Parameters:\n`;
    summary += `a1 = ${entryA1.value}\n`;
    summary += `a2 = ${entryA2.value}\n`;
    summary += `gamma = ${entryGamma.value}\n`;
    summary += `delta = ${entryDelta.value}\n`;
    summary += `====================\n\n`;
    
    summary += turnHistory.join('\n\n') + '\n\n';
    
    summary += `====================\n`;
    let uCells = [];
    for (let i = 0; i < slotsData.length; i++) {
        let slot = slotsData[i];
        if (slot.filledBy) {
            let t = tilesData[slot.filledBy];
            uCells.push(`${t.char}_${t.sub}`);
        } else {
            uCells.push("epsilon");
        }
    }
    summary += `Final u = ${uCells.join(" ")}\n`;
    
    outputPanel.style.display = 'block';
    logOutput.value = summary;
});

btnCopyLog.addEventListener('click', () => {
    logOutput.select();
    document.execCommand('copy');
    const oldTxt = btnCopyLog.innerText;
    btnCopyLog.innerText = '✅ Copied!';
    setTimeout(() => btnCopyLog.innerText = oldTxt, 2000);
});

// Initialize with a game
generateIncomparable();
