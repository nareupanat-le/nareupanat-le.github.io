// Mathematical Logic Engine

function is_reduction(alpha, beta) {
    let m = alpha.length;
    let n = beta.length;
    if (m > n) return false;
    
    let memo = {};
    function check(a_idx, b_idx, last_u_char) {
        let key = `${a_idx},${b_idx},${last_u_char}`;
        if (memo[key] !== undefined) return memo[key];
        
        if (b_idx === n) {
            return a_idx === m;
        }
        
        let res = false;
        
        // Option 1: assign u[b_idx] = alpha[a_idx]
        if (a_idx < m) {
            let u_char = alpha[a_idx];
            let b_char = beta[b_idx];
            let can_place = false;
            if (u_char === '0') can_place = true;
            else if (u_char === '1' && b_char === '1') can_place = true;
            
            if (can_place) {
                res = res || check(a_idx + 1, b_idx + 1, u_char);
            }
        }
        
        // Option 2: assign u[b_idx] = epsilon ('e')
        // Rule: u_1 != e (so b_idx > 0)
        // Rule: if u_i = e, then u_{i-1} != '1'. So last_u_char != '1'
        if (!res && b_idx > 0 && last_u_char !== '1') {
            res = res || check(a_idx, b_idx + 1, 'e');
        }
        
        memo[key] = res;
        return res;
    }
    
    return check(0, 0, null);
}

function generate_combinations(arrays) {
    if (arrays.length === 0) return [[]];
    let first = arrays[0];
    let rest = generate_combinations(arrays.slice(1));
    let result = [];
    for (let x of first) {
        for (let r of rest) {
            result.push([x, ...r]);
        }
    }
    return result;
}

function rep_r(alpha, Y, M_curr) {
    let options = [];
    for (let char of alpha) {
        if (char === '1') {
            options.push(['1', ...Y]);
        } else {
            options.push(['0']);
        }
    }
    
    // Generate combinations iteratively and prune early if possible
    let current_combos = [""];
    for (let i = 0; i < options.length; i++) {
        let next_combos = [];
        for (let prefix of current_combos) {
            for (let opt of options[i]) {
                next_combos.push(prefix + opt);
                if (next_combos.length > 100000) {
                    throw new Error("Combinatorial Explosion Warning: The set E is growing too large (exceeded 100,000 combinations for a single word). Aborting to prevent the browser from freezing.");
                }
            }
        }
        current_combos = next_combos;
    }
    
    let result = new Set();
    for (let combo of current_combos) {
        let word = combo;
        let is_minimal = true;
        for (let m of M_curr) {
            if (m !== word && is_reduction(m, word)) {
                is_minimal = false;
                break;
            }
        }
        if (is_minimal) {
            result.add(word);
        }
    }
    return Array.from(result);
}

function rep_r_set(X, Y, M_curr) {
    let result = new Set();
    for (let alpha of X) {
        for (let res of rep_r(alpha, Y, M_curr)) {
            result.add(res);
        }
    }
    return Array.from(result);
}

function get_min(set_X) {
    let min_set = [];
    for (let x of set_X) {
        let is_min = true;
        for (let y of set_X) {
            if (x === y) continue;
            if (is_reduction(y, x)) {
                is_min = false;
                break;
            }
        }
        if (is_min) {
            min_set.push(x);
        }
    }
    return min_set;
}

function omega_eval(alpha, Lambda) {
    let options = [];
    for (let char of alpha) {
        if (char === '1') {
            options.push(Lambda);
        } else {
            options.push(['0']);
        }
    }
    let combos = generate_combinations(options);
    let result = new Set();
    for (let combo of combos) {
        result.add(combo.join(''));
    }
    return Array.from(result);
}

function check_set_le(set_A, set_B) {
    // For every gamma in set_A, exists omega in set_B s.t. omega <= gamma
    for (let gamma of set_A) {
        let found = false;
        for (let w of set_B) {
            if (is_reduction(w, gamma)) {
                found = true;
                break;
            }
        }
        if (!found) return false;
    }
    return true;
}

function isValidWord(w) {
    return w.includes('0') && w.includes('1');
}

function generate_random_F(min_len, max_len) {
    while (true) {
        let len = Math.floor(Math.random() * (max_len - min_len + 1)) + min_len;
        let str = '';
        for (let i = 0; i < len; i++) {
            str += Math.random() < 0.5 ? '0' : '1';
        }
        if (isValidWord(str)) return str;
    }
}

// UI Interaction

document.getElementById('btn-random').addEventListener('click', () => {
    let alpha1, alpha2;
    while (true) {
        alpha1 = generate_random_F(3, 5);
        alpha2 = generate_random_F(3, 5);
        if (!is_reduction(alpha1, alpha2) && !is_reduction(alpha2, alpha1)) {
            break;
        }
    }
    document.getElementById('alpha1').value = alpha1;
    document.getElementById('alpha2').value = alpha2;
    document.getElementById('btn-process').click();
});

document.getElementById('btn-process').addEventListener('click', () => {
    let alpha1 = document.getElementById('alpha1').value.trim();
    let alpha2 = document.getElementById('alpha2').value.trim();
    let errorMsg = document.getElementById('error-msg');
    let resultsSection = document.getElementById('results');

    errorMsg.innerText = '';
    
    if (!alpha1 || !alpha2) {
        errorMsg.innerText = 'Please enter both \u03B1\u2081 and \u03B1\u2082.';
        return;
    }
    if (!isValidWord(alpha1) || !isValidWord(alpha2)) {
        errorMsg.innerText = 'Both words must contain at least one 0 and one 1 (Full Words).';
        return;
    }

    if (is_reduction(alpha1, alpha2) || is_reduction(alpha2, alpha1)) {
        errorMsg.innerText = '\u03B1\u2081 and \u03B1\u2082 must be incomparable under \u2264.';
        return;
    }

    // Process sets
    let Gamma = [alpha1, alpha2];
    
    // Add irreducible concatenations C
    let C = [];
    if (!is_reduction(alpha1, alpha1 + alpha2) && !is_reduction(alpha2, alpha1 + alpha2)) {
        C.push(alpha1 + alpha2);
    }
    if (!is_reduction(alpha1, alpha2 + alpha1) && !is_reduction(alpha2, alpha2 + alpha1)) {
        C.push(alpha2 + alpha1);
    }
    
    let l_gamma = Math.max(alpha1.length, alpha2.length) - 1;
    let M_curr = [...Gamma, ...C];
    let M_prev = [];
    
    try {
        let iteration = 0;
        let max_iterations = 20;
        while (true) {
            iteration++;
            let Y = rep_r_set(M_curr, M_curr, M_curr);
            let union_set = new Set([...M_curr, ...Y]);
            
            M_prev = M_curr;
            M_curr = get_min(Array.from(union_set));
            
            if (M_curr.length === M_prev.length) {
                let same = true;
                for (let w of M_curr) {
                    if (!M_prev.includes(w)) {
                        same = false;
                        break;
                    }
                }
                if (same) {
                    break; // Fixed point reached!
                }
            }
            
            // Safety limit to avoid infinite loops in worst-case scenarios
            if (iteration > 20) {
                throw new Error("Reached maximum iterations (20). The minimal set did not stabilize.");
            }
        }
    } catch (e) {
        errorMsg.innerText = e.message;
        errorMsg.style.display = 'block';
        return;
    }
    
    let E = M_curr; // Mathematically E includes Gamma
    let E_minus_Gamma = E.filter(gamma => !is_reduction(alpha1, gamma) && !is_reduction(alpha2, gamma));

    let LambdaSet = new Set([...E]); // E already includes Gamma
    for (let l = 1; l <= l_gamma; l++) {
        LambdaSet.add('1'.repeat(l));
    }
    let Lambda = Array.from(LambdaSet);

    let x_expansion = Lambda.map(w => w.replace(/1/g, 'a').replace(/0/g, 'e')).join(' \\vee ');

    // Render Math
    let e_str = E_minus_Gamma.length > 0 ? `\\{ ${E_minus_Gamma.join(', ')} \\}` : '\\emptyset';
    let sentence = `Then, we have \\[E \\setminus \\Gamma = ${e_str}\\] and \\[x = ${x_expansion}.\\]`;
    document.getElementById('sentence-E-x').innerHTML = sentence;

    resultsSection.classList.remove('hidden');

    if (window.MathJax) {
        MathJax.typesetPromise();
    }
});

// Add Enter key support
document.getElementById('alpha1').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('btn-process').click();
    }
});

document.getElementById('alpha2').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('btn-process').click();
    }
});
