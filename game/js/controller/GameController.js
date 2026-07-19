class GameController {
    constructor(state, boardRenderer, uiRenderer, latexRenderer, dragDropController) {
        this.state = state;
        this.boardRenderer = boardRenderer;
        this.uiRenderer = uiRenderer;
        this.latexRenderer = latexRenderer;
        this.dragDropController = dragDropController;

        this.lblCase = document.getElementById('lbl-case');
        this.entryA1 = document.getElementById('entry-a1');
        this.entryA2 = document.getElementById('entry-a2');
        this.entryGamma = document.getElementById('entry-gamma');
        this.entryDelta = document.getElementById('entry-delta');

        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('btn-randomize').addEventListener('click', () => this.generateIncomparable());
        document.getElementById('btn-load').addEventListener('click', () => this.loadGameBoard());
        
        document.getElementById('btn-toggle-sol').addEventListener('click', () => {
            this.state.isSolutionVisible = !this.state.isSolutionVisible;
            this.uiRenderer.updateSolutionVisibility();
        });
        
        document.getElementById('btn-record-turn').addEventListener('click', () => {
            if (this.state.recordTurn()) {
                this.uiRenderer.showRecordSuccess();
            } else {
                alert("No moves made in this turn!");
            }
        });
        
        document.getElementById('btn-generate-log').addEventListener('click', () => {
            if (this.state.turnHistory.length === 0) {
                alert("No turns recorded yet!");
                return;
            }
            this.uiRenderer.renderLogSummary(this.entryA1.value, this.entryA2.value, this.entryGamma.value, this.entryDelta.value);
        });
        
        document.getElementById('btn-generate').addEventListener('click', () => {
            this.latexRenderer.generate(
                this.entryA1.value.trim(), 
                this.entryA2.value.trim(), 
                this.state.gammaRaw, 
                this.state.deltaRaw
            );
        });

        document.getElementById('btn-copy').addEventListener('click', () => this.copyToClipboard('latex-output', 'btn-copy'));
        document.getElementById('btn-copy-log').addEventListener('click', () => this.copyToClipboard('log-output', 'btn-copy-log'));
    }

    copyToClipboard(elementId, btnId) {
        const el = document.getElementById(elementId);
        const btn = document.getElementById(btnId);
        el.select();
        document.execCommand('copy');
        const oldTxt = btn.innerText;
        btn.innerText = '✅ Copied!';
        setTimeout(() => btn.innerText = oldTxt, 2000);
    }

    getStrategy(lm1, rm1, caseVal) {
        if (lm1 === 0 && rm1 === 0) return new Strategy_00xx();
        if (caseVal === "(0, 1, 0, 0)") return new Strategy_0100();
        return new StrategyFuture();
    }

    generateIncomparable() {
        this.boardRenderer.boardPanel.style.display = 'none';
        this.boardRenderer.outputPanel.style.display = 'none';
        this.state.isSolutionVisible = false;
        this.uiRenderer.updateSolutionVisibility();
        
        const cases = ["(0, 0, 0, 0)", "(0, 0, 0, 1)", "(0, 0, 1, 0)", "(0, 0, 1, 1)", "(0, 1, 0, 0)"];
        this.state.currentCase = cases[Math.floor(Math.random() * cases.length)];
        this.lblCase.innerText = this.state.currentCase;
        
        const [lm1, rm1, lm2, rm2] = this.state.currentCase.replace(/[()]/g, '').split(', ').map(Number);
        this.state.currentStrategy = this.getStrategy(lm1, rm1, this.state.currentCase);
        
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
        const selectedDelta = this.state.currentStrategy.generateDelta(m, c, a1, a2);
        
        this.entryA1.value = a1;
        this.entryA2.value = a2;
        this.entryGamma.value = gamma;
        this.entryDelta.value = selectedDelta;
    }

    loadGameBoard() {
        if (!this.entryGamma.value || !this.entryDelta.value) {
            alert("Please Generate Game first!");
            return;
        }
        
        this.state.resetBoard();
        this.uiRenderer.updateSolutionVisibility();
        this.uiRenderer.updateTurnButton();
        
        const gammaRaw = this.entryGamma.value.trim().split(" ");
        const deltaRaw = this.entryDelta.value.trim().split(" ");
        
        if (gammaRaw.length !== deltaRaw.length) {
            alert("Gamma (γ) and Delta (δ) must have the same number of blocks (separated by spaces)!");
            return;
        }
        
        this.state.gammaRaw = gammaRaw;
        this.state.deltaRaw = deltaRaw;
        
        this.state.uSolution = this.state.currentStrategy.calculateSolution(
            gammaRaw, deltaRaw, this.entryA1.value.trim(), this.entryA2.value.trim()
        );
        
        this.boardRenderer.renderBoard(this.dragDropController);
    }
}
