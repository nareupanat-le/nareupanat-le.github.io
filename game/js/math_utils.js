function generateFullWord(lm, rm, minLen = 3, maxLen = 8) {
    const coreLen = Math.floor(Math.random() * (Math.max(0, maxLen - 2) - Math.max(0, minLen - 2) + 1)) + Math.max(0, minLen - 2);
    let core = "";
    for (let i = 0; i < coreLen; i++) {
        core += Math.random() < 0.5 ? "1" : "0";
    }
    return String(lm) + core + String(rm);
}

function checkLE(d, g) {
    if (d.length > g.length) return false;
    
    function dfs(dIdx, gIdx, lastP) {
        if (dIdx === d.length) return true;
        for (let i = gIdx; i < g.length; i++) {
            if (d[dIdx] === g[i]) {
                if (dIdx > 0 && d[dIdx - 1] === '1' && i !== lastP + 1) continue;
                if (dfs(dIdx + 1, i + 1, i)) return true;
            }
        }
        return false;
    }
    return dfs(0, 0, -1);
}
