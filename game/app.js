// Mathematical Logic & Partition Ideal Generator Calculator

// 1. Core Reduction Relation (Higman's Lemma embedding with e restrictions)
// Rule 1: First element cannot be epsilon (v_1 != e).
// Rule 2: Epsilon cannot follow '1' (if v_i = 1, then v_{i+1} != e).
let reduction_cache = new Map();

function is_reduction(alpha, beta) {
    let cache_key = alpha + ',' + beta;
    if (reduction_cache.has(cache_key)) return reduction_cache.get(cache_key);

    let m = alpha.length;
    let n = beta.length;
    if (m > n) {
        reduction_cache.set(cache_key, false);
        return false;
    }
    
    let memo = {};
    function check(a_idx, b_idx, last_u_char) {
        let key = `${a_idx},${b_idx},${last_u_char}`;
        if (memo[key] !== undefined) return memo[key];
        
        if (b_idx === n) {
            return a_idx === m;
        }
        
        let res = false;
        
        // Option 1: match character under <=_C (exact match OR alpha[a_idx]==='0' and beta[b_idx]==='1' since 0 <=_C 1)
        if (a_idx < m && (alpha[a_idx] === beta[b_idx] || (alpha[a_idx] === '0' && beta[b_idx] === '1'))) {
            res = res || check(a_idx + 1, b_idx + 1, alpha[a_idx]);
        }
        
        // Option 2: assign u[b_idx] = epsilon ('e')
        // Rule 1: b_idx > 0 (first tuple element cannot be epsilon)
        // Rule 2: last_u_char !== '1' (epsilon cannot follow '1')
        if (!res && b_idx > 0 && last_u_char !== '1') {
            res = res || check(a_idx, b_idx + 1, 'e');
        }
        
        memo[key] = res;
        return res;
    }
    
    let result = check(0, 0, null);
    reduction_cache.set(cache_key, result);
    return result;
}

// Check if word alpha is reducible by any word in set S
function is_reducible_by_set(alpha, S) {
    for (let s of S) {
        if (is_reduction(s, alpha)) return true;
    }
    return false;
}

// Get minimal words under <= from a set of words (Optimized: sort by length ascending, compare only against minimal words found so far)
function get_minimal_words(words) {
    let unique_words = Array.from(new Set(words));
    unique_words.sort((a, b) => a.length - b.length);
    let min_words = [];
    for (let x of unique_words) {
        let is_min = true;
        for (let y of min_words) {
            if (is_reduction(y, x)) {
                is_min = false;
                break;
            }
        }
        if (is_min) {
            min_words.push(x);
        }
    }
    return min_words;
}

// Set reduction order: A << B iff for all alpha in A, there exists beta in B s.t. alpha <= beta
function set_ll(set_A, set_B) {
    for (let alpha of set_A) {
        let found = false;
        for (let beta of set_B) {
            if (is_reduction(alpha, beta)) {
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }
    }
    return true;
}

// Get minimal sets under << from a collection of sets
function get_minimal_sets(collection_of_sets) {
    let unique_sets = [];
    let seen_keys = new Set();
    for (let s of collection_of_sets) {
        let sorted = [...s].sort().join(',');
        if (!seen_keys.has(sorted)) {
            seen_keys.add(sorted);
            unique_sets.push(s);
        }
    }
    
    let min_sets = [];
    for (let X of unique_sets) {
        let is_min = true;
        for (let Y of unique_sets) {
            if (X === Y) continue;
            if (set_ll(Y, X) && !set_ll(X, Y)) {
                is_min = false;
                break;
            }
            if (set_ll(Y, X) && set_ll(X, Y)) {
                if (Y.join(',') < X.join(',')) {
                    is_min = false;
                    break;
                }
            }
        }
        if (is_min) {
            min_sets.push(X);
        }
    }
    return min_sets;
}

// Replace each '1' in word alpha with elements from set Y (each '1' can either be replaced by an element of Y or left as '1', excluding trivial all-'1' retention)
function rep_word(alpha, Y) {
    let options = [];
    for (let char of alpha) {
        if (char === '1') {
            options.push(Array.from(new Set(['1', ...Y])));
        } else {
            options.push(['0']);
        }
    }
    
    let current_combos = [""];
    for (let i = 0; i < options.length; i++) {
        let next_combos = [];
        for (let prefix of current_combos) {
            for (let opt of options[i]) {
                next_combos.push(prefix + opt);
                if (next_combos.length > 20000) {
                    throw new Error("Combinatorial explosion: replacement set exceeded 20,000 words.");
                }
            }
        }
        current_combos = next_combos;
    }
    let results = current_combos.filter(w => w !== alpha);
    return Array.from(new Set(results)).sort();
}

// Replace each '1' in words of X with elements from Y: rep(X, Y)
function rep_set(X, Y) {
    let all_words = [];
    for (let alpha of X) {
        all_words.push(...rep_word(alpha, Y));
    }
    return Array.from(new Set(all_words)).sort();
}

// Compute WQO Stabilizer Family E = min_ll R(P)
function compute_stabilizer_family(P) {
    reduction_cache.clear();

    // 1. Theoretical Optimization: For a single block P = {Gamma_1}, no cross-block interaction exists.
    // Thus R(P) = P and E = min_ll R(P) is simply P itself! No calculation needed!
    if (P.length === 1) {
        P[0].step_k = 1;
        return [...P];
    }

    let all_words_in_P = [];
    for (let block of P) {
        block.step_k = 1;
        all_words_in_P.push(...block);
    }
    
    let current_collection = [...P];
    
    // R^(1)(P) = P U { C(Gamma_i, Gamma_j) : i != j }
    for (let i = 0; i < P.length; i++) {
        for (let j = 0; j < P.length; j++) {
            if (i === j) continue;
            let concats = [];
            for (let w1 of P[i]) {
                for (let w2 of P[j]) {
                    concats.push(w1 + w2);
                }
            }
            let C_ij = Array.from(new Set(concats)).sort();
            let is_bounded = false;
            for (let k = 0; k < P.length; k++) {
                if (set_ll(P[k], C_ij)) {
                    is_bounded = true;
                    break;
                }
            }
            if (!is_bounded && C_ij.length > 0) {
                C_ij.step_k = 1;
                current_collection.push(C_ij);
            }
        }
    }
    
    current_collection = get_minimal_sets(current_collection);
    
    // Iteratively generate replacement sets rep(X, Y) ONLY for DISTINCT sets X != Y and NEW pairs
    let old_keys = new Set();
    let iteration = 0;
    while (true) {
        iteration++;
        if (iteration > 12) {
            // Safety break if complex multi-block interactions exceed 12 iterations
            break;
        }
        
        let new_sets = [];
        for (let X of current_collection) {
            let key_X = X.join(',');
            for (let Y of current_collection) {
                // NEVER replace a set with itself (X !== Y is required to prevent self-feeding loops)
                if (X === Y) continue;
                let key_Y = Y.join(',');
                if (old_keys.has(key_X) && old_keys.has(key_Y)) continue; // Skip already-evaluated pairs!

                let Z = rep_set(X, Y);
                if (Z.length > 0) {
                    Z.step_k = iteration + 1;
                    new_sets.push(Z);
                }
            }
        }
        
        for (let s of current_collection) {
            old_keys.add(s.join(','));
        }
        
        if (new_sets.length === 0) {
            return current_collection;
        }
        
        let candidate_collection = [...current_collection, ...new_sets];
        let min_candidate = get_minimal_sets(candidate_collection);
        
        if (min_candidate.length === current_collection.length) {
            let same = true;
            for (let s of min_candidate) {
                let key = s.join(',');
                if (!current_collection.some(cs => cs.join(',') === key)) {
                    same = false;
                    break;
                }
            }
            if (same) {
                return min_candidate;
            }
        }
        current_collection = min_candidate;
    }
    return current_collection;
}

// Convert word valuation \overline{\omega}(a): 0 -> e, 1 -> a, simplify powers
function word_valuation_latex(w) {
    let tokens = [];
    let i = 0;
    while (i < w.length) {
        let char = w[i];
        let count = 0;
        while (i < w.length && w[i] === char) {
            count++;
            i++;
        }
        let sym = char === '0' ? 'e' : 'a';
        if (count === 1) {
            tokens.push(sym);
        } else {
            tokens.push(`${sym}^${count}`);
        }
    }
    return tokens.join('');
}

// 2. Fast Deterministic Antichain Pool Generator (Guaranteed No Freeze!)
function generate_all_full_words(min_len, max_len) {
    let words = [];
    function build(current, len) {
        if (current.length === len) {
            if (current.includes('0') && current.includes('1')) {
                words.push(current);
            }
            return;
        }
        build(current + '0', len);
        build(current + '1', len);
    }
    for (let l = min_len; l <= max_len; l++) {
        build('0', l);
        build('1', l);
    }
    return words;
}

function shuffle_array(arr) {
    let shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function generate_incomparable_pool(count) {
    // Generate all full words of length 3 to 7 starting with '0' and shuffle
    let all_words = shuffle_array(generate_all_full_words(3, 7));
    let pool = [];
    
    for (let w of all_words) {
        let is_incomp = true;
        for (let existing of pool) {
            if (is_reduction(w, existing) || is_reduction(existing, w)) {
                is_incomp = false;
                break;
            }
        }
        if (is_incomp) {
            pool.push(w);
            if (pool.length === count) break;
        }
    }
    return pool;
}

// 3. UI Dynamics and Event Handlers
let blocksContainer = document.getElementById('blocks-container');
let blockCount = 0;

function addBlockRow(initialWords = '') {
    blockCount++;
    let row = document.createElement('div');
    row.className = 'block-row';
    row.innerHTML = `
        <span class="block-label">\\(\\Gamma_{${blockCount}}\\):</span>
        <input type="text" class="block-input" value="${initialWords}" placeholder="e.g. 01, 0110 (comma-separated words)">
        <button class="btn-copy-block" title="Copy words in this block" style="background:rgba(59, 130, 246, 0.15);border:1px solid rgba(59,130,246,0.3);color:#93c5fd;width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1rem;flex-shrink:0;">📋</button>
        <button class="btn-remove-block" title="Remove Block">&times;</button>
    `;
    blocksContainer.appendChild(row);
    
    let inputField = row.querySelector('.block-input');
    
    // Auto-select all text when focused so Cmd+C copies immediately
    inputField.addEventListener('focus', () => {
        inputField.select();
    });
    
    // Support Cmd+C / Ctrl+C even if no text is highlighted
    inputField.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'c') {
            if (inputField.selectionStart === inputField.selectionEnd) {
                navigator.clipboard.writeText(inputField.value);
                let origBg = inputField.style.backgroundColor;
                inputField.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
                setTimeout(() => { inputField.style.backgroundColor = origBg; }, 300);
            }
        }
    });
    
    let copyBtn = row.querySelector('.btn-copy-block');
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(inputField.value);
        copyBtn.innerHTML = '✅';
        setTimeout(() => { copyBtn.innerHTML = '📋'; }, 1000);
    });
    
    row.querySelector('.btn-remove-block').addEventListener('click', () => {
        if (blocksContainer.children.length > 1) {
            row.remove();
            reindexBlocks();
        } else {
            alert('At least one partition block is required.');
        }
    });
    
    if (window.MathJax) MathJax.typesetPromise();
}

function reindexBlocks() {
    let rows = blocksContainer.querySelectorAll('.block-row');
    blockCount = 0;
    rows.forEach(row => {
        blockCount++;
        row.querySelector('.block-label').innerHTML = `\\(\\Gamma_{${blockCount}}\\):`;
    });
    if (window.MathJax) MathJax.typesetPromise();
}

function randomizeBlocks(num_blocks) {
    blocksContainer.innerHTML = '';
    blockCount = 0;
    
    // Determine how many words each block gets (1 or 2 words randomly)
    let block_sizes = [];
    let total_words = 0;
    for (let i = 0; i < num_blocks; i++) {
        // For 1 block, let's give 2 words; for more blocks, 1 or 2 words randomly
        let size = (num_blocks === 1) ? 2 : (Math.random() < 0.35 ? 2 : 1);
        block_sizes.push(size);
        total_words += size;
    }
    
    // Generate antichain pool of total_words instantly
    let pool = generate_incomparable_pool(total_words);
    
    let word_idx = 0;
    for (let i = 0; i < num_blocks; i++) {
        let size = block_sizes[i];
        let words = [];
        for (let j = 0; j < size; j++) {
            if (word_idx < pool.length) {
                words.push(pool[word_idx]);
                word_idx++;
            }
        }
        if (words.length === 0 && pool.length > 0) words.push(pool[0]); // safety fallback
        addBlockRow(words.join(', '));
    }
    
    // Immediately trigger computation
    document.getElementById('btn-compute').click();
}

// Attach event listeners safely using currentTarget
document.querySelectorAll('.btn-random').forEach(btn => {
    btn.addEventListener('click', (e) => {
        let num = parseInt(e.currentTarget.getAttribute('data-random'));
        randomizeBlocks(num);
    });
});

document.getElementById('btn-add-block').addEventListener('click', () => {
    addBlockRow('');
});

// Initialize with random 2 incomparable blocks on load
randomizeBlocks(2);

document.getElementById('btn-compute').addEventListener('click', () => {
    let errorMsg = document.getElementById('error-msg');
    let resultsSection = document.getElementById('results');
    errorMsg.style.display = 'none';
    errorMsg.innerText = '';
    
    let rows = blocksContainer.querySelectorAll('.block-input');
    let P = [];
    let all_words_flat = [];
    
    try {
        rows.forEach((input, idx) => {
            let val = input.value.trim();
            if (!val) throw new Error(`Block \\(\\Gamma_{${idx+1}}\\) is empty.`);
            let words = val.split(',').map(w => w.trim()).filter(w => w.length > 0);
            if (words.length === 0) throw new Error(`Block \\(\\Gamma_{${idx+1}}\\) contains no valid words.`);
            for (let w of words) {
                if (!/^[01]+$/.test(w)) {
                    throw new Error(`Invalid word "${w}" in \\(\\Gamma_{${idx+1}}\\). Words must consist only of 0s and 1s.`);
                }
                if (!w.includes('0') || !w.includes('1')) {
                    throw new Error(`Word "${w}" in \\(\\Gamma_{${idx+1}}\\) is not a Full Word (must contain at least one 0 and one 1).`);
                }
                all_words_flat.push(w);
            }
            P.push(Array.from(new Set(words)));
        });
        
        let l_gamma = Math.max(...all_words_flat.map(w => w.length)) - 1;
        
        // Compute E
        let E = compute_stabilizer_family(P);
        
        // Render Summary
        document.getElementById('result-summary').innerHTML = `
            \\[ \\mathcal{P} = \\{ ${P.map(b => `\\{ ${b.join(', ')} \\}`).join(', ')} \\} \\]
            <p>Maximum word length in \\(\\mathcal{P}\\) is \\(${l_gamma + 1}\\), so the length parameter is \\(l_\\Gamma = ${l_gamma}\\).</p>
        `;
        
        // Render Stabilizer Family
        let e_items = E.map((set, idx) => {
            let is_initial = P.some(pb => pb.sort().join(',') === [...set].sort().join(','));
            let badge = is_initial ? `<span style="color:var(--accent-cyan);font-size:0.85em;">[Initial Block]</span>` : `<span style="color:var(--accent-pink);font-weight:700;font-size:0.85em;">[Surviving Replacement Set]</span>`;
            let copySetBtn = `<button class="btn-copy-set" data-words="${set.join(', ')}" title="Copy words in S_${idx+1}" style="background:rgba(236, 72, 153, 0.15);border:1px solid rgba(236, 72, 153, 0.3);color:#f472b6;padding:2px 8px;border-radius:6px;font-size:0.8rem;cursor:pointer;margin-left:8px;">📋 Copy Words</button>`;
            let step_k_val = set.step_k || 1;
            return `<li style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:12px;gap:8px;border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:8px;"><div>\\(S_${idx+1} = \\{ ${set.join(', ')} \\}\\) ${badge} ${copySetBtn}</div><div style="color:var(--text-muted);font-weight:600;font-size:0.95em;font-family:monospace;margin-left:auto;">(k=${step_k_val})</div></li>`;
        }).join('');
        document.getElementById('result-stabilizer').innerHTML = `<ul style="list-style-type:none;padding-left:0;line-height:1.8;margin:0;">${e_items}</ul>`;
        
        document.querySelectorAll('.btn-copy-set').forEach(btn => {
            btn.addEventListener('click', (e) => {
                navigator.clipboard.writeText(e.currentTarget.getAttribute('data-words'));
                let oldText = e.currentTarget.innerHTML;
                e.currentTarget.innerHTML = '✅ Copied!';
                setTimeout(() => { e.currentTarget.innerHTML = oldText; }, 1000);
            });
        });
        
        // Render Valuations
        let val_items = E.map((set, idx) => {
            let vals = set.map(w => word_valuation_latex(w));
            let meet_expr = vals.length === 1 ? vals[0] : `(${vals.join(' \\wedge ')})`;
            return `<li>For \\(S_${idx+1} = \\{ ${set.join(', ')} \\}\\): \\(\\bigwedge_{\\omega \\in S_${idx+1}} \\overline{\\omega}(a) = ${meet_expr}\\)</li>`;
        }).join('');
        document.getElementById('result-valuations').innerHTML = `<ul style="list-style-type:none;padding-left:0;line-height:2;">${val_items}</ul>`;
        
        // Render Formula
        let join_powers = [];
        for (let j = 1; j <= l_gamma; j++) {
            join_powers.push(j === 1 ? 'a' : `a^${j}`);
        }
        let meet_terms = E.map(set => {
            let vals = set.map(w => word_valuation_latex(w));
            return vals.length === 1 ? vals[0] : `(${vals.join(' \\wedge ')})`;
        });
        
        let all_summands = [...join_powers, ...meet_terms];
        let unique_summands = [];
        let seen = new Set();
        for (let sum of all_summands) {
            if (!seen.has(sum)) {
                seen.add(sum);
                unique_summands.push(sum);
            }
        }
        
        let formula_str = `\\langle a \\rangle_{\\mathcal{P}} = ${unique_summands.join(' \\vee ')}`;
        document.getElementById('result-formula').innerHTML = `\\[ ${formula_str} \\]`;
        
        resultsSection.classList.remove('hidden');
        if (window.MathJax) MathJax.typesetPromise();
        
    } catch (err) {
        errorMsg.innerText = err.message;
        errorMsg.style.display = 'block';
        resultsSection.classList.add('hidden');
        if (window.MathJax) MathJax.typesetPromise();
    }
});
