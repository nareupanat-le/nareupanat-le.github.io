function generateFullWord(minLen = 3, maxLen = 8) {
    const len = Math.floor(Math.random() * (Math.max(3, maxLen) - Math.max(3, minLen) + 1)) + Math.max(3, minLen);
    let word = "";
    for (let i = 0; i < len; i++) {
        word += Math.random() < 0.5 ? "1" : "0";
    }
    if (!word.includes('0')) {
        const zeroIndex = Math.floor(Math.random() * len);
        word = word.substring(0, zeroIndex) + '0' + word.substring(zeroIndex + 1);
    }
    return word;
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
