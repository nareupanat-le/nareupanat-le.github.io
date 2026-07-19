class UIRenderer {
    constructor(state) {
        this.state = state;
        this.btnToggleSol = document.getElementById('btn-toggle-sol');
        this.btnRecordTurn = document.getElementById('btn-record-turn');
        this.logOutput = document.getElementById('log-output');
        this.outputPanel = document.getElementById('output-panel');
        
        // Modal elements
        this.btnShowRules = document.getElementById('btn-show-rules');
        this.btnCloseRules = document.getElementById('btn-close-rules');
        this.modal = document.getElementById('rules-modal');

        this.initModal();
    }

    initModal() {
        if (this.btnShowRules && this.btnCloseRules && this.modal) {
            this.btnShowRules.addEventListener('mouseover', () => {
                this.btnShowRules.style.transform = 'translateY(-2px)';
                this.btnShowRules.style.boxShadow = '0 6px 20px rgba(6, 214, 160, 0.6)';
            });
            this.btnShowRules.addEventListener('mouseout', () => {
                this.btnShowRules.style.transform = 'none';
                this.btnShowRules.style.boxShadow = '0 4px 15px rgba(6, 214, 160, 0.4)';
            });
            this.btnShowRules.addEventListener('click', () => {
                this.modal.classList.add('active');
            });
            this.btnCloseRules.addEventListener('click', () => {
                this.modal.classList.remove('active');
            });
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.modal.classList.remove('active');
                }
            });
        }
    }

    updateSolutionVisibility() {
        document.querySelectorAll('.solution-cell').forEach(cell => {
            if (this.state.isSolutionVisible) cell.classList.remove('hidden');
            else cell.classList.add('hidden');
        });
        this.btnToggleSol.innerText = this.state.isSolutionVisible ? '🙈 Hide Solution' : '👁️ Show Solution';
    }

    updateTurnButton() {
        this.btnRecordTurn.innerText = `✅ Record Turn (${this.state.turnCount})`;
    }

    showRecordSuccess() {
        this.btnRecordTurn.innerText = "✅ Recorded!";
        setTimeout(() => this.updateTurnButton(), 1000);
    }

    renderLogSummary(a1, a2, gammaRaw, deltaRaw) {
        let summary = `GAME SUMMARY\n`;
        summary += `====================\n`;
        summary += `Initial Parameters:\n`;
        summary += `a1 = ${a1}\n`;
        summary += `a2 = ${a2}\n`;
        summary += `gamma = ${gammaRaw}\n`;
        summary += `delta = ${deltaRaw}\n`;
        summary += `====================\n\n`;
        
        summary += this.state.turnHistory.join('\n\n') + '\n\n';
        
        summary += `====================\n`;
        let uCells = [];
        for (let i = 0; i < this.state.slotsData.length; i++) {
            let slot = this.state.slotsData[i];
            if (slot.filledBy) {
                let t = this.state.tilesData[slot.filledBy];
                uCells.push(`${t.char}_${t.sub}`);
            } else {
                uCells.push("epsilon");
            }
        }
        summary += `Final u = ${uCells.join(" ")}\n`;
        
        this.outputPanel.style.display = 'block';
        this.logOutput.value = summary;
    }
}
