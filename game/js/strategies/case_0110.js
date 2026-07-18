class Strategy_0110 extends GameStrategy {
    generateSolution(alpha1, alpha2, gammaRaw) {
        // No solution known yet. User will figure it out by playing.
        return null;
    }

    generateLatexText(alpha1, alpha2, gammaText, deltaText, colFormat, gammaRow, deltaRow, uRow) {
        let latex = `\\begin{lemma}[Case: $(0,1,1,0)$] \\label{lem:reduction_sub_0110}\n`;
        latex += `\\end{lemma}\n\n`;
        latex += `\\begin{proof}\n`;
        latex += `    Let $\\vert \\gamma \\vert = L$. Suppose that $\\mathbf{v} = (v_1, \\ldots, v_L) \\in \\mathsf{C}_{L}(\\gamma)$.\n`;
        latex += `    Then, $\\gamma = v_1 \\cdots v_L$.\n\n`;
        
        latex += `    % TODO: Implement mathematical indices mapping\n\n`;
        
        latex += `    % Experimental Result from Game:\n`;
        latex += `    % $\\alpha_1 = ${alpha1}$, $\\alpha_2 = ${alpha2}$\n`;
        latex += `    % $\\gamma = ${gammaText}$\n`;
        latex += `    % $\\delta = ${deltaText}$\n\n`;
        
        latex += `    \\begin{table}[h!]\n`;
        latex += `        \\centering\n`;
        latex += `        \\begin{tabular}{${colFormat}}\n`;
        latex += `            $x$ & ${Array.from({length: gammaRow.split("&").length}, (_, i) => i+1).join(" & ")} \\\\\n`;
        latex += `            \\hline\n`;
        latex += `            $v_x$ & ${gammaRow} \\\\\n`;
        latex += `            $u_x$ & ${uRow} \\\\\n`;
        latex += `            & ${deltaRow} \\\\\n`;
        latex += `        \\end{tabular}\n`;
        latex += `    \\end{table}\n`;
        latex += `\\end{proof}`;
        return latex;
    }
}
