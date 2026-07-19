class Strategy_Unified extends BaseStrategy {
    generateDelta(m, c, a1, a2) {
        let dList = [];
        for (let i = 0; i < m; i++) {
            if (c[i] === a1 || c[i] === a2) {
                dList.push(c[i]);
            } else if (c[i] === '0') {
                dList.push('0');
            } else {
                dList.push('1'); // for 1^k
            }
        }
        return dList.join(" ");
    }
    
    calculateSolution(gammaRaw, deltaRaw, a1, a2) {
        const m = gammaRaw.length;
        const L = gammaRaw.reduce((sum, g) => sum + g.length, 0);
        const D = deltaRaw.reduce((sum, d) => sum + d.length, 0);
        let uSol = Array(L).fill(null);
        
        let c = gammaRaw;
        let d = deltaRaw;
        
        // Build prefix arrays for gamma (1-indexed)
        let RArr = Array(m + 1).fill(0);
        let LArr = Array(m + 1).fill(0);
        let currR = 0;
        for (let i = 1; i <= m; i++) {
            LArr[i] = currR + 1;
            currR += c[i - 1].length;
            RArr[i] = currR;
        }
        LArr[0] = 0; 
        
        // Build prefix arrays for delta (1-indexed)
        let SArr = Array(m + 1).fill(0);
        let IArr = Array(m + 1).fill(0);
        let currS = 0;
        for (let i = 1; i <= m; i++) {
            IArr[i] = currS + 1;
            currS += d[i - 1].length;
            SArr[i] = currS;
        }
        IArr[0] = 0;
        
        // Define K (blocks that are 1^k) -> 1-indexed
        // Since a1 and a2 always contain '0' in our game, any block without '0' must be 1^k.
        let K = new Set();
        for (let i = 1; i <= m; i++) {
            if (!c[i-1].includes('0')) {
                K.add(i);
            }
        }
        
        // Calculate E_i = min { p \in [i] : x \in K for all p <= x < i }
        let EArr = Array(m + 1).fill(0);
        for (let i = 1; i <= m; i++) {
            let p = i;
            while (p > 1 && K.has(p - 1)) {
                p--;
            }
            EArr[i] = p;
        }
        
        // Calculate r_i = min { x in [|d_i|] : d_i[x] == 0 } -> 1-indexed
        let rArr = Array(m + 1).fill(0);
        for (let i = 1; i <= m; i++) {
            if (!K.has(i)) {
                let r = d[i-1].indexOf('0') + 1; 
                rArr[i] = r;
            }
        }
        
        // Construct b_j and k_j for j in [D]
        let bJ = Array(D + 1).fill(0);
        let kJ = Array(D + 1).fill(0);
        for (let i = 1; i <= m; i++) {
            for (let j = IArr[i]; j <= SArr[i]; j++) {
                bJ[j] = i;
                kJ[j] = j - IArr[i] + 1;
            }
        }
        
        // Construct P_j (The Cap and Jump Engine)
        let PJ = Array(D + 1).fill(0);
        for(let j = 1; j <= D; j++) {
            let b = bJ[j];
            let k = kJ[j];
            let E_b = EArr[b];
            
            if (K.has(b)) {
                PJ[j] = LArr[E_b] + b - E_b;
            } else if (k <= rArr[b]) {
                PJ[j] = LArr[E_b] + b - E_b + k - 1; // The Cap
            } else {
                PJ[j] = LArr[b] + k - 1;             // The Jump
            }
        }
        
        // Populate uSol
        let y = " " + d.join(""); // 1-indexed string
        
        for (let j = 1; j <= D; j++) {
            let p = PJ[j];
            let b = bJ[j];
            // Mapping PJ[j] (1-indexed) to uSol (0-indexed)
            uSol[p - 1] = { char: y[j], sub: String(b) };
        }
        
        return uSol;
    }
    
    generateLatexText(a1, a2, gammaText, deltaText, colFormat, gammaRow, deltaRow, uRow) {
        const m1 = a1.length;
        let latex = `\\noindent\\textbf{Example}\n`;
        latex += `Let $\\alpha_1 = a_1 \\cdots a_{${m1}} = ${a1}$ and $\\alpha_2 = ${a2}$.\n`;
        latex += `We let $\\gamma = ${gammaText}$.\n`;
        latex += `We choose $\\delta = ${deltaText}$.\n`;
        latex += `By applying the Cap and Jump $P_j$ mappings from the Grand Unified Theorem, we obtain $\\mathbf{u} \\in \\mathsf{C}_{\\vert \\gamma \\vert}(\\delta)$ as follow.\n`;
        latex += `\\begin{table}[h!]\n\t\\centering\n\t\\begin{tabular}{${colFormat}}\n`;
        latex += `\t\t$\\gamma$ &\n\t\t${gammaRow} \\\\\n\t\t$\\delta$ &\n\t\t${deltaRow} \\\\\n\t\t$\\mathbf{u}$ & ${uRow}\n`;
        latex += `\t\\end{tabular}\n\\end{table}\n\n\\noindent Therefore, $\\delta \\leq \\gamma$. \\qedsymbol\n`;
        return latex;
    }
}
