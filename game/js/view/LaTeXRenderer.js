class LaTeXRenderer {
    constructor(state) {
        this.state = state;
        this.latexOutput = document.getElementById('latex-output');
        this.mathjaxPreview = document.getElementById('mathjax-preview');
        this.outputPanel = document.getElementById('output-panel');
    }

    generate(a1, a2, gammaRaw, deltaRaw) {
        let uCells = [], placedSeq = [];
        
        for (let i = 0; i < this.state.slotsData.length; i++) {
            let slot = this.state.slotsData[i];
            if (slot.filledBy) {
                let t = this.state.tilesData[slot.filledBy];
                uCells.push(`$${t.char}_{${t.sub}}$`);
                placedSeq.push(t.seq);
            } else {
                uCells.push("$\\varepsilon$");
            }
        }
        
        if (placedSeq.length !== Object.keys(this.state.tilesData).length) {
            alert("You haven't placed all elements of δ on the board!");
            return;
        }
        
        let sortedSeq = [...placedSeq].sort((a,b) => a-b);
        if (JSON.stringify(placedSeq) !== JSON.stringify(sortedSeq)) {
            alert("Elements of δ are OUT OF ORDER!");
            return;
        }
        
        const [lm1, rm1] = this.state.currentCase.replace(/[()]/g, '').split(', ').map(Number);
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
        
        const latex = this.state.currentStrategy.generateLatexText(
            a1, a2, gammaText, deltaText, colFormat, gammaRow, deltaCells.join(" & "), uCells.join(" & ")
        );
        
        this.outputPanel.style.display = 'block';
        this.latexOutput.value = latex;
        
        this.updateMathJaxPreview(latex, gammaRaw, deltaRaw, uCells);
    }

    updateMathJaxPreview(latex, gammaRaw, deltaRaw, uCells) {
        let latexPreview = latex;
        latexPreview = latexPreview.replace(/\\noindent\s*/g, '');
        latexPreview = latexPreview.replace(/\\textbf\{([^}]+)\}/g, '<b>$1</b>');
        latexPreview = latexPreview.replace(/\\qedsymbol/g, '$\\blacksquare$');
        latexPreview = latexPreview.replace(/\\ref\{[^}]+\}/g, '???');
        
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
        
        latexPreview = latexPreview.replace(/\\begin\{table\}.*?\\end\{table\}/s, htmlTable);
        this.mathjaxPreview.innerHTML = `<div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; font-size: 1.15rem;">${latexPreview.replace(/\n/g, '<br>')}</div>`;
        
        if (window.MathJax) {
            MathJax.typesetPromise([this.mathjaxPreview]).catch(err => console.error(err));
        }
    }
}
