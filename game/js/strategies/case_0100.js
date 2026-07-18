class Strategy_0100 extends BaseStrategy {
    generateDelta(m, c, a1, a2) {
        let dList = [];
        for (let i = 0; i < m; i++) {
            if (c[i] === a2) dList.push(a2);
            else if (c[i] === '0') dList.push('0');
            else dList.push('1');
        }
        return dList.join(" ");
    }
    
    calculateSolution(gammaRaw, deltaRaw) {
        const m = gammaRaw.length;
        const L = gammaRaw.reduce((sum, g) => sum + g.length, 0);
        const D = deltaRaw.reduce((sum, d) => sum + d.length, 0);
        let uSol = Array(L).fill(null);
        
        let LArr = Array(m + 1).fill(0);
        let RArr = Array(m + 1).fill(0);
        let curr = 0;
        for (let i = 1; i <= m; i++) {
            LArr[i] = curr;
            curr += gammaRaw[i - 1].length;
            RArr[i] = curr - 1;
        }
        
        let IArr = Array(m + 1).fill(0);
        let SArr = Array(m + 1).fill(0);
        curr = 0;
        for (let i = 1; i <= m; i++) {
            IArr[i] = curr;
            curr += deltaRaw[i - 1].length;
            SArr[i] = curr - 1;
        }

        let bJ = Array(D).fill(0);
        let isOneBlock = Array(m).fill(false);
        for (let i = 1; i <= m; i++) {
            if (deltaRaw[i - 1] === '1') {
                isOneBlock[i - 1] = true;
            }
            for (let j = IArr[i]; j <= SArr[i]; j++) {
                bJ[j] = i;
            }
        }

        let qJ = Array(D).fill(0);
        for (let j = 0; j < D; j++) {
            let b = bJ[j];
            if (isOneBlock[b - 1]) {
                let k = b;
                while (k <= m && isOneBlock[k - 1]) {
                    k++;
                }
                qJ[j] = k - 1;
            }
        }
        
        for (let j = 0; j < D; j++) {
            let b = bJ[j];
            let dB = deltaRaw[b - 1];
            let yJ = dB[j - IArr[b]];
            let p;
            
            if (dB === '1') {
                let q = qJ[j];
                if (q === m) {
                    p = RArr[m] - m + b;
                } else {
                    let idealP = LArr[q] + b - 1;
                    let maxP = RArr[q] - q + b;
                    p = Math.min(idealP, maxP);
                }
            } else {
                if (j === IArr[b]) {
                    if (b > 1 && isOneBlock[b - 2]) {
                        p = Math.min(LArr[b - 1] + b - 1, LArr[b]);
                    } else {
                        p = LArr[b];
                    }
                } else {
                    p = RArr[b] - SArr[b] + j;
                }
            }
            uSol[p] = { char: yJ, sub: String(b) };
        }
        return uSol;
    }
    
    generateLatexText(a1, a2, gammaText, deltaText, colFormat, gammaRow, deltaRow, uRow) {
        const m1 = a1.length;
        let latex = `\\noindent\\textbf{Example}\n`;
        latex += `Let $\\alpha_1 = a_1 \\cdots a_{${m1}} = ${a1}$ and $\\alpha_2 = ${a2}$.\n`;
        latex += `We let $\\gamma = ${gammaText}$.\n`;
        latex += `We choose $\\delta = ${deltaText}$.\n`;
        latex += `Consider the construction of $\\mathbf{u} \\in \\mathsf{C}_{\\vert \\gamma \\vert}(\\delta)$ as follow.\n`;
        latex += `\\begin{table}[h!]\n\t\\centering\n\t\\begin{tabular}{${colFormat}}\n`;
        latex += `\t\t$\\gamma$ &\n\t\t${gammaRow} \\\\\n\t\t$\\delta$ &\n\t\t${deltaRow} \\\\\n\t\t$\\mathbf{u}$ & ${uRow}\n`;
        latex += `\t\\end{tabular}\n\\end{table}\n\n\\noindent Therefore, $\\delta \\leq \\gamma$. \\qedsymbol\n`;
        return latex;
    }
}
