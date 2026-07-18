class Strategy_00xx extends BaseStrategy {
    generateDelta(m, c, a1, a2) {
        return a1.split("").join(" ");
    }
    
    calculateSolution(gammaRaw, deltaRaw, a1, a2) {
        const m = gammaRaw.length;
        const totalL = gammaRaw.reduce((sum, g) => sum + g.length, 0);
        let uSol = Array(totalL).fill(null);
        
        let LArr = Array(m).fill(0);
        let curr = 0;
        for (let i = 0; i < m; i++) {
            LArr[i] = curr;
            curr += gammaRaw[i].length;
        }
        
        const a1Str = deltaRaw.join("");
        let j1 = -1;
        for (let i = 0; i < m; i++) {
            if (gammaRaw[i] === a1Str) {
                j1 = i;
                break;
            }
        }
        
        // Fix potential bug: If j1 is not found, throw error instead of bad index
        if (j1 === -1) {
            console.error(`Could not find alpha1 string '${a1Str}' in gammaRaw`);
            return uSol;
        }
                
        for (let r = 0; r < m; r++) {
            let p = r === 0 ? 0 : LArr[j1] + r;
            uSol[p] = { char: deltaRaw[r], sub: String(r + 1) };
        }
        return uSol;
    }
    
    generateLatexText(a1, a2, gammaText, deltaText, colFormat, gammaRow, deltaRow, uRow) {
        const deltaTextCompact = deltaText.replace(/ /g, "");
        const m1 = a1.length;
        let latex = `\\noindent\\textbf{Example}\n`;
        latex += `Let $\\alpha_1 = a_1 \\cdots a_{${m1}} = ${a1}$ and $\\alpha_2 = ${a2}$.\n`;
        latex += `We let $\\gamma = ${gammaText}$.\n`;
        latex += `By Lemma \\ref{lem:reduction_sub_00xx}, we choose $\\delta = ${deltaTextCompact} = \\alpha_1$.\n`;
        latex += `Consider the construction of $\\mathbf{u} \\in \\mathsf{C}_{\\vert \\gamma \\vert}(\\delta)$ using the sequence $(P_r)_{r=1}^{${m1}}$ where $P_1=1$ and $P_r = L_{j_1} + r - 1$.\n`;
        latex += `\\begin{table}[h!]\n\t\\centering\n\t\\begin{tabular}{${colFormat}}\n`;
        latex += `\t\t$\\gamma$ &\n\t\t${gammaRow} \\\\\n\t\t$\\delta$ &\n\t\t${deltaRow} \\\\\n\t\t$\\mathbf{u}$ & ${uRow}\n`;
        latex += `\t\\end{tabular}\n\\end{table}\n\n\\noindent Therefore, $\\delta \\leq \\gamma$. \\qedsymbol\n`;
        return latex;
    }
}
