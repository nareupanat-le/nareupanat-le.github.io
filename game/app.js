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
        if (reduction_cache.size > 50000) reduction_cache.clear();
        reduction_cache.set(cache_key, false);
        return false;
    }
    
    // Fast integer-indexed memo array instead of object/string keys
    // Size: (m + 1) * (n + 1) * 3. Types: 0 = null/'e', 1 = '0', 2 = '1'
    let memo = new Int8Array((m + 1) * (n + 1) * 3);
    memo.fill(-1);
    
    function check(a_idx, b_idx, last_type) {
        let key = (a_idx * (n + 1) + b_idx) * 3 + last_type;
        if (memo[key] !== -1) return memo[key] === 1;
        
        if (b_idx === n) {
            let res = (a_idx === m);
            memo[key] = res ? 1 : 0;
            return res;
        }
        
        let res = false;
        // Option 1: match character under <=_C (exact match OR alpha[a_idx]==='0' and beta[b_idx]==='1' since 0 <=_C 1)
        if (a_idx < m && (alpha[a_idx] === beta[b_idx] || (alpha[a_idx] === '0' && beta[b_idx] === '1'))) {
            let next_type = (alpha[a_idx] === '1') ? 2 : 1;
            res = res || check(a_idx + 1, b_idx + 1, next_type);
        }
        
        // Option 2: assign u[b_idx] = epsilon ('e')
        // Rule 1: b_idx > 0 (first tuple element cannot be epsilon)
        // Rule 2: last_type !== 2 (epsilon cannot follow '1')
        if (!res && b_idx > 0 && last_type !== 2) {
            res = res || check(a_idx, b_idx + 1, 0);
        }
        
        memo[key] = res ? 1 : 0;
        return res;
    }
    
    let result = check(0, 0, 0);
    if (reduction_cache.size > 50000) reduction_cache.clear();
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

// Check if a collection of blocks forms a valid partition assignment of a strict antichain of F (Paper Definition / Section 5)
function is_valid_partition_antichain(blocks) {
    let all_words = [];
    for (let b of blocks) {
        for (let w of b) {
            all_words.push(w);
        }
    }
    let unique_set = new Set(all_words);
    if (unique_set.size !== all_words.length) return false;
    for (let i = 0; i < all_words.length; i++) {
        for (let j = 0; j < all_words.length; j++) {
            if (i !== j) {
                if (is_reduction(all_words[i], all_words[j])) return false;
            }
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

// Compute RepSet(Gamma_i, {Gamma_j}) according to Definition 5.4.1:
// rep^r(alpha, {Gamma_j}) = { Z_1 ... Z_m : Z_p in (if alpha[p]=='1' then {{1}, Gamma_j} else {{0}}) }
// RepSet(Gamma_i, {Gamma_j}) = cross-union over alpha in Gamma_i of rep^r(alpha, {Gamma_j})
function compute_exact_repset(Gamma_i, Gamma_j) {
    let rep_r_for_each_word = [];
    
    for (let alpha of Gamma_i) {
        let ones_pos = [];
        for (let p = 0; p < alpha.length; p++) {
            if (alpha[p] === '1') ones_pos.push(p);
        }
        let k = ones_pos.length;
        let sets_for_alpha = [];
        let total_masks = 1 << k;
        
        for (let mask = 0; mask < total_masks; mask++) {
            let pos_options = [];
            let one_counter = 0;
            for (let p = 0; p < alpha.length; p++) {
                if (alpha[p] === '0') {
                    pos_options.push(['0']);
                } else {
                    let replace_this = (mask & (1 << one_counter)) !== 0;
                    one_counter++;
                    if (replace_this) {
                        pos_options.push(Gamma_j);
                    } else {
                        pos_options.push(['1']);
                    }
                }
            }
            
            let combo_words = [''];
            for (let opts of pos_options) {
                let next = [];
                for (let pre of combo_words) {
                    for (let opt of opts) {
                        next.push(pre + opt);
                    }
                }
                combo_words = next;
            }
            let unique_words = Array.from(new Set(combo_words)).sort();
            sets_for_alpha.push(unique_words);
        }
        rep_r_for_each_word.push(sets_for_alpha);
    }
    
    // Cross-union (biguplus) across all words in Gamma_i
    let all_repsets = [[]];
    for (let sets_for_alpha of rep_r_for_each_word) {
        let next_repsets = [];
        for (let cur of all_repsets) {
            for (let S_alpha of sets_for_alpha) {
                let union_words = Array.from(new Set([...cur, ...S_alpha])).sort();
                next_repsets.push(union_words);
            }
        }
        all_repsets = next_repsets;
    }
    
    let unique_repsets = [];
    let seen_keys = new Set();
    for (let s of all_repsets) {
        let key = s.join(',');
        if (!seen_keys.has(key)) {
            seen_keys.add(key);
            unique_repsets.push(s);
        }
    }
    return unique_repsets;
}

// Verify Admissibility of partition ideal assignment P according to Definition 5.4.7
function verify_admissibility(P) {
    let n = P.length;
    if (n <= 1) {
        return {
            is_admissible: true,
            pairs: [],
            is_single_block: true
        };
    }
    
    let pairs = [];
    let all_admissible = true;
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === j) continue;
            
            let Gamma_i = P[i];
            let Gamma_j = P[j];
            
            // 1. Condition 1: Concatenation Gamma_i Gamma_j
            let concats = [];
            for (let w1 of Gamma_i) {
                for (let w2 of Gamma_j) {
                    concats.push(w1 + w2);
                }
            }
            let C_ij = Array.from(new Set(concats)).sort();
            
            // 1(a): Singleton block
            let cond1_a = (Gamma_i.length === 1 || Gamma_j.length === 1);
            let cond1_a_reason = cond1_a ? (Gamma_i.length === 1 && Gamma_j.length === 1 ? `|\\Gamma_{${i+1}}|=1, |\\Gamma_{${j+1}}|=1` : (Gamma_i.length === 1 ? `|\\Gamma_{${i+1}}|=1` : `|\\Gamma_{${j+1}}|=1`)) : null;
            
            // 1(b): Boundary zero
            let cond1_b_left = Gamma_i.every(w => w[w.length - 1] === '0');
            let cond1_b_right = Gamma_j.every(w => w[0] === '0');
            let cond1_b = cond1_b_left || cond1_b_right;
            let cond1_b_reason = cond1_b ? (cond1_b_left && cond1_b_right ? `ทุกสายใน \\(\\Gamma_{${i+1}}\\) ลงท้ายด้วย 0 และทุกสายใน \\(\\Gamma_{${j+1}}\\) ขึ้นต้นด้วย 0` : (cond1_b_left ? `ทุกสายใน \\(\\Gamma_{${i+1}}\\) ลงท้ายด้วย 0` : `ทุกสายใน \\(\\Gamma_{${j+1}}\\) ขึ้นต้นด้วย 0`)) : null;
            
            // 1(c): Lower bounded by some Gamma_k in P
            let cond1_c_reducers = [];
            for (let k = 0; k < n; k++) {
                if (set_ll(P[k], C_ij)) {
                    cond1_c_reducers.push(k + 1);
                }
            }
            let cond1_c = cond1_c_reducers.length > 0;
            let cond1_satisfied = cond1_a || cond1_b || cond1_c;
            
            // 2. Condition 2: Replacement RepSet(Gamma_i, {Gamma_j})
            let cond2_a = (Gamma_j.length === 1);
            let cond2_b = false;
            let cond2_satisfied = false;
            let repset_list = [];
            let violating_sets = [];
            
            if (cond2_a) {
                cond2_satisfied = true;
            } else {
                repset_list = compute_exact_repset(Gamma_i, Gamma_j);
                for (let S of repset_list) {
                    let has_reducer = false;
                    for (let k = 0; k < n; k++) {
                        if (set_ll(P[k], S)) {
                            has_reducer = true;
                            break;
                        }
                    }
                    if (!has_reducer) {
                        violating_sets.push(S);
                    }
                }
                cond2_b = (violating_sets.length === 0);
                cond2_satisfied = cond2_b;
            }
            
            let pair_admissible = cond1_satisfied && cond2_satisfied;
            if (!pair_admissible) {
                all_admissible = false;
            }
            
            pairs.push({
                i: i + 1,
                j: j + 1,
                pair_label: `(\\Gamma_{${i+1}}, \\Gamma_{${j+1}})`,
                cond1_satisfied,
                cond1_a,
                cond1_a_reason,
                cond1_b,
                cond1_b_reason,
                cond1_c,
                cond1_c_reducers,
                cond2_satisfied,
                cond2_a,
                cond2_b,
                violating_sets,
                repset_count: repset_list.length,
                repset_preview: repset_list.slice(0, 4),
                concat_words: C_ij,
                is_admissible: pair_admissible
            });
        }
    }
    
    return {
        is_admissible: all_admissible,
        pairs: pairs
    };
}

// Compute WQO Stabilizer Family E = min_ll R(P)
function compute_stabilizer_family(P) {
    reduction_cache.clear();
    current_checked_log = [];

    // 1. Theoretical Optimization: For a single block P = {Gamma_1}, no cross-block interaction exists.
    // Thus R(P) = P and E = min_ll R(P) is simply P itself! No calculation needed!
    if (P.length === 1) {
        P[0].step_k = 1;
        P[0].origin_type = 'initial';
        P[0].origin_label = '\\Gamma_1';
        P[0].node_id = 'G1';
        P[0].parent_ids = [];
        current_checked_log.push({
            label: '\\Gamma_1',
            type: 'Initial Block',
            words: P[0],
            step_k: 1,
            survived: true,
            absorbed_by: 'None',
            node_id: 'G1',
            parent_ids: []
        });
        return [...P];
    }

    let all_words_in_P = [];
    for (let i = 0; i < P.length; i++) {
        let block = P[i];
        block.step_k = 1;
        block.origin_type = 'initial';
        block.origin_label = `\\Gamma_{${i+1}}`;
        block.node_id = `G${i+1}`;
        block.parent_ids = [];
        all_words_in_P.push(...block);
        current_checked_log.push({
            label: `\\Gamma_{${i+1}}`,
            type: 'Initial Block',
            words: block,
            step_k: 1,
            survived: true,
            absorbed_by: 'None',
            node_id: `G${i+1}`,
            parent_ids: []
        });
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
            let reducer_label = null;
            for (let k = 0; k < P.length; k++) {
                if (set_ll(P[k], C_ij)) {
                    reducer_label = `\\Gamma_{${k+1}}`;
                    break;
                }
            }
            if (C_ij.length > 0) {
                C_ij.node_id = `C_${i+1}_${j+1}`;
                C_ij.parent_ids = [`G${i+1}`, `G${j+1}`];
                current_checked_log.push({
                    label: `\\Gamma_{${i+1}} \\cdot \\Gamma_{${j+1}}`,
                    type: 'Concatenation',
                    words: C_ij,
                    step_k: 1,
                    survived: !reducer_label,
                    absorbed_by: reducer_label || 'None',
                    node_id: C_ij.node_id,
                    parent_ids: C_ij.parent_ids
                });
            }
            if (!reducer_label && C_ij.length > 0) {
                C_ij.step_k = 1;
                C_ij.origin_type = 'concatenation';
                C_ij.origin_label = `\\Gamma_{${i+1}} \\cdot \\Gamma_{${j+1}}`;
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
        for (let i = 0; i < current_collection.length; i++) {
            let X = current_collection[i];
            let key_X = X.join(',');
            for (let j = 0; j < current_collection.length; j++) {
                if (i === j) continue;
                let Y = current_collection[j];
                let key_Y = Y.join(',');
                if (old_keys.has(key_X) && old_keys.has(key_Y)) continue; // Skip already-evaluated pairs!

                let Z = rep_set(X, Y);
                if (Z.length > 0) {
                    Z.step_k = iteration + 1;
                    Z.origin_type = 'replacement';
                    Z.origin_label = `\\operatorname{rep}(${current_collection[i].origin_label || 'S_{' + (i+1) + '}'}, ${current_collection[j].origin_label || 'S_{' + (j+1) + '}'})`;
                    Z.node_id = `R_${i+1}_${j+1}_it${iteration}`;
                    Z.parent_ids = [current_collection[i].node_id || `S${i+1}`, current_collection[j].node_id || `S${j+1}`];
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
        
        for (let Z of new_sets) {
            let survived = min_candidate.some(ms => ms.join(',') === Z.join(','));
            let reducer_label = null;
            if (!survived) {
                for (let ms_idx = 0; ms_idx < min_candidate.length; ms_idx++) {
                    if (set_ll(min_candidate[ms_idx], Z)) {
                        reducer_label = min_candidate[ms_idx].origin_label || `S_{${ms_idx+1}}`;
                        break;
                    }
                }
            }
            current_checked_log.push({
                label: Z.origin_label,
                type: 'Replacement',
                words: Z,
                step_k: iteration + 1,
                survived: survived,
                absorbed_by: reducer_label || 'another minimal set in \\(\\mathbb{E}\\)',
                node_id: Z.node_id,
                parent_ids: Z.parent_ids
            });
        }
        
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
    // Attempt 1: Try diverse length ranges (lengths 4 to 7) with sparse ones (1 or 2 ones)
    // Why sparse ones? As deduced from the reduction relation definition (Rule 2: epsilon cannot follow '1'),
    // words with sparse ones prevent combinatorial blowup in rep(X,Y) while ensuring clean antichain properties!
    for (let attempt = 0; attempt < 50; attempt++) {
        let min_len = 4 + Math.floor(Math.random() * 2); // 4 or 5
        let max_len = min_len + 2; // up to 7
        
        let all_words = generate_all_full_words(min_len, max_len).filter(w => {
            let ones = 0;
            for (let char of w) if (char === '1') ones++;
            return ones >= 1 && ones <= 2;
        });
        all_words = shuffle_array(all_words);
        
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
                if (pool.length === count) return pool; // Guaranteed strict antichain of exact size!
            }
        }
    }
    
    // Bulletproof Fallback: Same-length antichain with sparse ones (1 or 2 ones)!
    // Theorem: Distinct binary words of the same length L with exact same number of 1s (M ones)
    // form a guaranteed strict antichain, while sparse ones prevent exponential combinatorial blowup in rep(X,Y)!
    let L = Math.max(6, count);
    let M = (count <= 6) ? 1 : 2;
    let all_L_words = generate_all_full_words(L, L).filter(w => {
        let ones = 0;
        for (let char of w) if (char === '1') ones++;
        return ones === M;
    });
    
    all_L_words = shuffle_array(all_L_words);
    return all_L_words.slice(0, count);
}

// 3. UI Dynamics and Event Handlers
let blocksContainer = document.getElementById('blocks-container');
let blockCount = 0;
let current_P = [];
let current_E = [];
let current_formula_summands = [];
let current_checked_log = [];
let current_is_admissible = true;
let current_admissibility_result = null;

// MathJax rendering queue to prevent overlapping promise freezes and scope rendering to target elements
let typesetQueue = Promise.resolve();
function safeTypeset(elements = null) {
    if (!window.MathJax) return;
    typesetQueue = typesetQueue.then(() => {
        let targets = elements ? (Array.isArray(elements) ? elements : [elements]) : null;
        return targets ? MathJax.typesetPromise(targets) : MathJax.typesetPromise();
    }).catch(err => console.warn('MathJax error:', err));
}

function addBlockRow(initialWords = '', skipTypeset = false) {
    blockCount++;
    let row = document.createElement('div');
    row.className = 'block-row';
    row.innerHTML = `
        <span class="block-label">\\(\\Gamma_{${blockCount}}\\):</span>
        <input type="text" class="block-input" value="${initialWords}" placeholder="e.g. 01, 0110 (comma-separated words)">
        <button class="btn-copy-block" title="Copy words in this block" style="border: 1px solid var(--glass-border);width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1rem;flex-shrink:0;">📋</button>
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
    
    if (!skipTypeset) safeTypeset([row]);
}

function reindexBlocks(skipTypeset = false) {
    let rows = blocksContainer.querySelectorAll('.block-row');
    blockCount = 0;
    rows.forEach(row => {
        blockCount++;
        row.querySelector('.block-label').innerHTML = `\\(\\Gamma_{${blockCount}}\\):`;
    });
    if (!skipTypeset) safeTypeset([blocksContainer]);
}

function randomizeBlocks(num_blocks) {
    blocksContainer.innerHTML = '';
    blockCount = 0;
    
    let block_sizes = [];
    let total_words = 0;
    for (let i = 0; i < num_blocks; i++) {
        let size = (num_blocks === 1) ? 2 : (Math.random() < 0.35 ? 2 : 1);
        block_sizes.push(size);
        total_words += size;
    }
    let pool = generate_incomparable_pool(total_words);
    let word_idx = 0;
    let blocks = [];
    for (let i = 0; i < num_blocks; i++) {
        let size = block_sizes[i];
        let words = [];
        for (let j = 0; j < size; j++) {
            words.push(pool[word_idx]);
            word_idx++;
        }
        blocks.push(words);
    }
    
    for (let b of blocks) {
        addBlockRow(b.join(', '), true);
    }
    
    reindexBlocks(true);
    safeTypeset([blocksContainer]);
    document.getElementById('btn-compute').click();
}

function load_blocks_to_ui(blocks) {
    blocksContainer.innerHTML = '';
    blockCount = 0;
    for (let b of blocks) {
        let val = Array.isArray(b) ? b.join(', ') : b;
        addBlockRow(val, true);
    }
    reindexBlocks(true);
    safeTypeset([blocksContainer]);
}

// Global toggle for pair details in verification table
window.togglePairDetail = function(idx) {
    let el = document.getElementById(`pair-detail-${idx}`);
    if (el) {
        el.classList.toggle('hidden');
        safeTypeset([el]);
    }
};

// 3. Preset and Hunter Handlers
document.getElementById('btn-preset-ex1').addEventListener('click', () => {
    load_blocks_to_ui([['110', '011'], ['101']]);
    document.getElementById('btn-compute').click();
});

document.getElementById('btn-preset-ex2').addEventListener('click', () => {
    load_blocks_to_ui([['00110'], ['1000', '01011'], ['01100', '0111']]);
    document.getElementById('btn-compute').click();
});

document.getElementById('btn-preset-quasi').addEventListener('click', () => {
    load_blocks_to_ui([['10', '01']]);
    document.getElementById('btn-compute').click();
});

document.getElementById('btn-preset-twosided').addEventListener('click', () => {
    load_blocks_to_ui([['10'], ['01']]);
    document.getElementById('btn-compute').click();
});

function hunt_admissible(num_blocks, options = {}) {
    let errorMsg = document.getElementById('error-msg');
    errorMsg.style.display = 'none';
    
    let max_attempts = 400;
    for (let attempt = 0; attempt < max_attempts; attempt++) {
        let block_sizes = [];
        let total_words = 0;
        for (let i = 0; i < num_blocks; i++) {
            let size = 1;
            if (options.require_rich) {
                size = (i < 2 || Math.random() < 0.5) ? 2 : 1;
            } else {
                size = (num_blocks === 1) ? 2 : (Math.random() < 0.35 ? 2 : 1);
            }
            block_sizes.push(size);
            total_words += size;
        }
        
        let pool = generate_incomparable_pool(total_words);
        let word_idx = 0;
        let P_test = [];
        for (let i = 0; i < num_blocks; i++) {
            let size = block_sizes[i];
            let words = [];
            for (let j = 0; j < size; j++) {
                words.push(pool[word_idx]);
                word_idx++;
            }
            P_test.push(words);
        }
        
        if (!is_valid_partition_antichain(P_test)) continue;
        
        let adm = verify_admissibility(P_test);
        if (adm.is_admissible) {
            if (options.require_rich) {
                let multi_count = P_test.filter(b => b.length >= 2).length;
                if (multi_count < 2) continue;
            }
            load_blocks_to_ui(P_test);
            document.getElementById('btn-compute').click();
            return true;
        }
    }
    
    // Fallback certified examples from monograph if random search times out
    if (num_blocks === 2) {
        load_blocks_to_ui([['110', '011'], ['101']]);
    } else if (num_blocks === 3) {
        load_blocks_to_ui([['00110'], ['1000', '01011'], ['01100', '0111']]);
    } else if (num_blocks === 4) {
        load_blocks_to_ui([['00110'], ['1000', '01011'], ['01100', '0111'], ['000101']]);
    } else {
        load_blocks_to_ui([['10', '01']]);
    }
    document.getElementById('btn-compute').click();
    return false;
}

document.getElementById('btn-hunt-adm-2').addEventListener('click', () => hunt_admissible(2));
document.getElementById('btn-hunt-adm-3').addEventListener('click', () => hunt_admissible(3));
document.getElementById('btn-hunt-adm-4').addEventListener('click', () => hunt_admissible(4));
document.getElementById('btn-hunt-rich-adm').addEventListener('click', () => hunt_admissible(3, { require_rich: true }));
document.getElementById('btn-random-antichain').addEventListener('click', () => randomizeBlocks(Math.random() < 0.5 ? 2 : 3));

document.getElementById('btn-add-block').addEventListener('click', () => {
    addBlockRow('');
});

document.getElementById('btn-export-latex').addEventListener('click', (e) => {
    if (!current_P.length || !current_E.length) return;
    let P_latex = current_P.map((b, i) => `\\Gamma_${i+1} = \\{ ${b.join(', ')} \\}`).join(',\\quad ');
    let E_latex = current_E.map((set, idx) => {
        let originNote = set.origin_label ? ` & (\\text{from } ${set.origin_label})` : '';
        return `    S_${idx+1} &= \\{ ${set.join(', ')} \\}${originNote}`;
    }).join(' \\\\\\ \n');
    let formula_latex = `\\langle a \\rangle_{\\mathcal{P}} = ${current_formula_summands.join(' \\vee ')}`;
    let adm_note = current_is_admissible 
        ? `จากการตรวจสอบตามบทนิยาม 5.4.7 พบว่าทุกคู่ดัชนี $i \\neq j$ สอดคล้องกับเงื่อนไขการต่อกันและเงื่อนไขการแทนที่เซต ดังนั้น $\\mathcal{P}$ จึงเป็นเซตกำหนดไอดีลยอมรับได้ (Admissible Ideal Assignment Set)`
        : `ข้อสังเกต: เซตกำหนดไอดีล $\\mathcal{P}$ นี้ไม่สอดคล้องกับเงื่อนไขในบทนิยาม 5.4.7 จึงไม่เป็นเซตกำหนดไอดีลยอมรับได้`;
    
    let fullLatex = `\\begin{example}\nพิจารณาเซตกำหนดไอดีล $\\mathcal{P} = \\{ \\Gamma_1, \\dots, \\Gamma_{${current_P.length}} \\}$ บน $\\mathsf{F}$ โดยที่\n\\[ ${P_latex} \\]\n${adm_note}\n\nโดยทฤษฎีบท 5.4.12 และบทตั้งของฮิกแมน วงศ์เสถียรภาพ $\\mathbb{E} = \\min_{\\ll} \\mathcal{R}(\\mathcal{P})$ ประกอบด้วยสมาชิกเล็กสุด ดังนี้\n\\begin{align*}\n${E_latex}\n\\end{align*}\nและสูตรตัวก่อกำเนิดหลักของสมาชิกไอดีลผลแบ่งกั้น $\\langle a \\rangle_{\\mathcal{P}}$ ในกึ่งกรุปอันดับ $le$ สรุปได้เป็น:\n\\[ ${formula_latex} \\]\n\\end{example}`;
    
    navigator.clipboard.writeText(fullLatex);
    let oldBtnText = e.currentTarget.innerHTML;
    e.currentTarget.innerHTML = '✅ Copied LaTeX to Clipboard!';
    e.currentTarget.style.borderColor = 'var(--success)';
    setTimeout(() => { 
        e.currentTarget.innerHTML = oldBtnText; 
        e.currentTarget.style.borderColor = 'rgba(147,51,234,0.4)';
    }, 2000);
});

// Initialize with Book Example 5.4.8 (Part 1) on load
load_blocks_to_ui([['110', '011'], ['101']]);

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
        
        // Validate strict antichain property of F across all blocks (Paper Definition / Section 5)
        let all_words_test = [];
        for (let i = 0; i < P.length; i++) {
            for (let w of P[i]) {
                all_words_test.push({ word: w, block_idx: i + 1 });
            }
        }
        for (let i = 0; i < all_words_test.length; i++) {
            for (let j = 0; j < all_words_test.length; j++) {
                if (i !== j) {
                    if (all_words_test[i].word === all_words_test[j].word) {
                        throw new Error(`Contradiction of Partition Definition: Word "${all_words_test[i].word}" appears in multiple blocks (\\(\\Gamma_{${all_words_test[i].block_idx}}\\) and \\(\\Gamma_{${all_words_test[j].block_idx}}\\)). A partition assignment must consist of disjoint blocks!`);
                    }
                    if (is_reduction(all_words_test[i].word, all_words_test[j].word)) {
                        throw new Error(`Contradiction of Antichain Definition: The union of all words across blocks is NOT an antichain of \\(\\mathbf{F}\\)! Word "${all_words_test[i].word}" (in \\(\\Gamma_{${all_words_test[i].block_idx}}\\)) reduces "${all_words_test[j].word}" (in \\(\\Gamma_{${all_words_test[j].block_idx}}\\)) under \\(\\leq\\) (remember that \\(0 \\leq_C 1\\)). According to the paper, \\(\\mathcal{P}\\) must be a partition assignment of a strict antichain of \\(\\mathbf{F}\\).`);
                    }
                }
            }
        }
        
        let l_gamma = Math.max(...all_words_flat.map(w => w.length)) - 1;
        
        // Admissibility Verification (Definition 5.4.7)
        let adm = verify_admissibility(P);
        current_is_admissible = adm.is_admissible;
        current_admissibility_result = adm;
        
        // Render Admissibility Banner Card
        let bannerCard = document.getElementById('admissible-banner-card');
        let bannerIcon = document.getElementById('admissible-banner-icon');
        let bannerTitle = document.getElementById('admissible-banner-title');
        let bannerDesc = document.getElementById('admissible-banner-desc');
        let bannerBadge = document.getElementById('admissible-banner-badge');
        
        if (adm.is_admissible) {
            bannerCard.className = 'admissible-banner-card pass';
            bannerIcon.innerText = '🌟';
            bannerTitle.innerText = 'เซตกำหนดไอดีลยอมรับได้ (Admissible Ideal Assignment Set)';
            bannerDesc.innerHTML = adm.is_single_block 
                ? 'เซตกำหนดไอดีลแบบ 1 บล็อก ถือเป็นเซตยอมรับได้โดยปริยาย (ไม่มีคู่ดัชนี \\(i \\neq j\\))'
                : `สอดคล้องกับบทนิยาม 5.4.7 ครบทั้งเงื่อนไขการต่อกัน (ข้อ 1) และการแทนที่เซต (ข้อ 2) สำหรับทุกคู่ดัชนี \\(i \\neq j\\) ทั้ง ${adm.pairs.length} คู่`;
            bannerBadge.className = 'badge-status pass';
            bannerBadge.innerText = '✅ Admissible Verified';
        } else {
            bannerCard.className = 'admissible-banner-card fail';
            bannerIcon.innerText = '⚠️';
            bannerTitle.innerText = 'ไม่เป็นเซตกำหนดไอดีลยอมรับได้ (Non-Admissible Ideal Assignment)';
            let failedCount = adm.pairs.filter(p => !p.is_admissible).length;
            bannerDesc.innerHTML = `มี ${failedCount} คู่ดัชนีที่ไม่ผ่านเกณฑ์ตามบทนิยาม 5.4.7 (สูตรตัวก่อกำเนิดหลักอาจไม่รับประกันสมบัติขอบเขตบนสมาชิก \\(\\mathcal{P}\\)-ไอดีล)`;
            bannerBadge.className = 'badge-status fail';
            bannerBadge.innerText = '❌ Non-Admissible';
        }
        
        // Compute E
        let E = compute_stabilizer_family(P);
        current_P = P;
        current_E = E;
        
        // Render Step 1 Summary
        document.getElementById('result-summary').innerHTML = `
            \\[ \\mathcal{P} = \\{ ${P.map((b, idx) => `\\Gamma_{${idx+1}} = \\{ ${b.join(', ')} \\}`).join(',\\quad ')} \\} \\]
            <p>จำนวนบล็อกทั้งหมด \\(|\\mathcal{P}| = ${P.length}\\) บล็อก, ความยาวสายอักขระมากสุดคือ \\(${l_gamma + 1}\\) จึงได้พารามิเตอร์ความยาว \\(l_\\Gamma = ${l_gamma}\\)</p>
            <p style="color: var(--success); font-weight:600; font-size:0.95rem;">✅ ตรวจสอบแล้ว: บล็อกทุกบล็อกแยกต่างหากจากกัน และยูเนียนของสายอักขระทั้งหมดเป็นปฏิโซ่แท้บน \\((\\mathsf{F}, \\le)\\)</p>
        `;
        
        // Render Step 2 Admissibility Matrix
        let admEl = document.getElementById('result-admissibility');
        if (adm.is_single_block) {
            admEl.innerHTML = `
                <div style="padding: 14px; background: var(--bg-secondary); border-radius: 10px; border: 1px solid var(--glass-border); font-size: 0.95rem;">
                    เนื่องจาก \\(|\\mathcal{P}| = 1\\) (มีเพียงบล็อกเดียว \\(\\Gamma_1\\)) จึงไม่มีคู่ดัชนีที่ต่างกัน \\(i \\neq j\\) ให้ต้องพิจารณา ทำให้สอดคล้องกับบทนิยาม 5.4.7 โดยอัตโนมัติ (Vacuously True)
                </div>
            `;
        } else {
            let rowsHtml = adm.pairs.map((p, idx) => {
                let cond1_pills = [];
                if (p.cond1_a) cond1_pills.push(`<span class="condition-pill satisfied" title="${p.cond1_a_reason || ''}">✅ 1(a) เซตโทน</span>`);
                if (p.cond1_b) cond1_pills.push(`<span class="condition-pill satisfied" title="${p.cond1_b_reason || ''}">✅ 1(b) ขอบศูนย์</span>`);
                if (p.cond1_c) cond1_pills.push(`<span class="condition-pill satisfied">✅ 1(c) มี \\(\\Gamma_{${p.cond1_c_reducers.join(',')}} \\ll \\Gamma_${p.i}\\Gamma_${p.j}\\)</span>`);
                if (!p.cond1_satisfied) cond1_pills.push(`<span class="condition-pill failed">❌ ไม่ผ่าน 1(a,b,c)</span>`);
                
                let cond2_pills = [];
                if (p.cond2_a) cond2_pills.push(`<span class="condition-pill satisfied">✅ 2(a) บล็อกตัวแทนเซตโทน</span>`);
                else if (p.cond2_b) cond2_pills.push(`<span class="condition-pill satisfied">✅ 2(b) ทุกเซตมี \\(\\Gamma_k \\ll S\\) (${p.repset_count} เซต)</span>`);
                else cond2_pills.push(`<span class="condition-pill failed">❌ 2(b) ล้มเหลว (${p.violating_sets.length} เซตไม่ลดทอน)</span>`);
                
                let statusBadge = p.is_admissible 
                    ? `<span class="badge-status pass">✅ ผ่าน</span>` 
                    : `<span class="badge-status fail">❌ ไม่ผ่าน</span>`;
                    
                let detailBtn = `<button class="pair-detail-btn" onclick="togglePairDetail(${idx})">🔍 ดูรายละเอียด</button>`;
                
                let detailContent = `
                    <div id="pair-detail-${idx}" class="pair-detail-content hidden">
                        <div><strong>การต่อกัน \\(\\Gamma_${p.i}\\Gamma_${p.j}\\) (${p.concat_words.length} สาย):</strong> \\(\\{ ${p.concat_words.join(', ')} \\}\\)</div>
                        ${p.cond2_a ? '<div style="margin-top:4px; color:var(--text-secondary);">การแทนที่: ไม่ต้องสร้าง RepSet เนื่องจากบล็อกตัวแทนเป็นเซตโทน (ข้อ 2(a))</div>' : `
                            <div style="margin-top:4px;"><strong>การแทนที่ \\(\\operatorname{RepSet}(\\Gamma_${p.i}, \\{\\Gamma_${p.j}\\})\\) (${p.repset_count} เซต):</strong></div>
                            <ul style="margin: 4px 0 0 16px; padding: 0;">
                                ${p.repset_preview.map((s, s_idx) => `<li>\\(S_{${s_idx+1}} = \\{ ${s.join(', ')} \\}\\)</li>`).join('')}
                                ${p.repset_count > 4 ? `<li>...และอีก ${p.repset_count - 4} เซต</li>` : ''}
                            </ul>
                            ${p.violating_sets.length > 0 ? `<div style="color:var(--error); margin-top:4px;"><strong>เซตที่ละเมิดเงื่อนไข (ไม่มี \\(\\Gamma_k\\) ลดทอน):</strong> ${p.violating_sets.map(vs => `\\(\\{${vs.join(',')}\\}\\)`).join('; ')}</div>` : ''}
                        `}
                    </div>
                `;
                
                return `
                    <tr>
                        <td style="font-weight:700; white-space:nowrap;">\\(${p.pair_label}\\)</td>
                        <td>${cond1_pills.join(' ')}</td>
                        <td>${cond2_pills.join(' ')}</td>
                        <td style="text-align:center;">${statusBadge}</td>
                        <td>${detailBtn}${detailContent}</td>
                    </tr>
                `;
            }).join('');
            
            admEl.innerHTML = `
                <div class="admissible-table-wrapper">
                    <table class="admissible-table">
                        <thead>
                            <tr>
                                <th>คู่ดัชนี</th>
                                <th>เงื่อนไขการต่อกัน (ข้อ 1)</th>
                                <th>เงื่อนไขการแทนที่เซต (ข้อ 2)</th>
                                <th style="text-align:center;">สถานะ</th>
                                <th>หลักฐานเชิงการจัด</th>
                            </tr>
                        </thead>
                        <tbody>${rowsHtml}</tbody>
                    </table>
                </div>
            `;
        }
        
        // Render Stabilizer Family
        let e_items = E.map((set, idx) => {
            let is_initial = P.some(pb => pb.sort().join(',') === [...set].sort().join(','));
            let badge = '';
            if (set.origin_type === 'initial' || is_initial) {
                badge = `<span style="font-size:0.85em;font-weight:600;">[Initial Block]</span>`;
            } else if (set.origin_type === 'concatenation') {
                let origin_str = set.origin_label ? ` <span style="font-size:0.85em;margin-left:4px;">(from \\(${set.origin_label}\\))</span>` : '';
                badge = `<span style="font-weight:700;font-size:0.85em;">[Surviving Concatenation Set]</span>${origin_str}`;
            } else {
                let origin_str = set.origin_label ? ` <span style="font-size:0.85em;margin-left:4px;">(from \\(${set.origin_label}\\))</span>` : '';
                badge = `<span style="font-weight:700;font-size:0.85em;">[Surviving Replacement Set]</span>${origin_str}`;
            }
            let copySetBtn = `<button class="btn-copy-set" data-words="${set.join(', ')}" title="Copy words in S_${idx+1}" style="border: 1px solid var(--glass-border);padding:2px 8px;border-radius:6px;font-size:0.8rem;cursor:pointer;margin-left:8px;">📋 Copy Words</button>`;
            let step_k_val = set.step_k || 1;
            return `<li style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:12px;gap:8px;border-bottom:1px solid var(--glass-border);padding-bottom:8px;"><div>\\(S_${idx+1} = \\{ ${set.join(', ')} \\}\\) ${badge} ${copySetBtn}</div><div style="font-weight:600;font-size:0.95em;font-family:monospace;margin-left:auto;">(k=${step_k_val})</div></li>`;
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
        
        // Render WQO Minimality Filter Log
        let logRows = current_checked_log.map((entry, idx) => {
            let statusBadge = entry.survived 
                ? `<span style="font-weight:700;">✅ Survived</span>` 
                : `<span style="font-weight:600;">❌ Absorbed by \\(${entry.absorbed_by}\\)</span>`;
            let wordsPreview = entry.words.length > 5 ? entry.words.slice(0, 5).join(', ') + `, ... (+${entry.words.length - 5} more)` : entry.words.join(', ');
            return `<tr style="border-bottom: 1px solid var(--glass-border);">
                <td style="padding: 8px; font-family: monospace;">\\(${entry.label}\\)</td>
                <td style="padding: 8px;">${entry.type}</td>
                <td style="padding: 8px; text-align: center;">\\(k=${entry.step_k}\\)</td>
                <td style="padding: 8px;">${statusBadge}</td>
                <td style="padding: 8px; font-family: monospace;  font-size: 0.8rem;">\\(\\{ ${wordsPreview} \\}\\)</td>
            </tr>`;
        }).join('');
        
        let logTableHtml = `<table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
                <tr style="border-bottom: 1px solid var(--glass-border); ">
                    <th style="padding: 8px;">Candidate Set</th>
                    <th style="padding: 8px;">Type</th>
                    <th style="padding: 8px; text-align: center;">Step</th>
                    <th style="padding: 8px;">\\(\\min_{\\ll}\\) Evaluation Status</th>
                    <th style="padding: 8px;">Generated Words Preview</th>
                </tr>
            </thead>
            <tbody>${logRows}</tbody>
        </table>`;
        
        let filterLogContainer = document.getElementById('filter-log-container');
        if (filterLogContainer) {
            filterLogContainer.innerHTML = logTableHtml;
        }
        
        let toggleBtn = document.getElementById('btn-toggle-filter-log');
        if (toggleBtn && filterLogContainer) {
            toggleBtn.onclick = () => {
                filterLogContainer.classList.toggle('hidden');
                if (filterLogContainer.classList.contains('hidden')) {
                    toggleBtn.innerHTML = '🔍 View WQO Minimality Filter Log (\\(\\min_{\\ll}\\) Evaluation of All Checked Candidates)';
                } else {
                    toggleBtn.innerHTML = '🙈 Hide WQO Minimality Filter Log';
                }
                safeTypeset([toggleBtn, filterLogContainer]);
            };
        }
        
        // Render Lineage Tree
        let treeHtml = E.map((set, idx) => {
            let label = `S_{${idx+1}}`;
            let color = 'var(--accent-cyan)';
            let typeName = 'Initial Block';
            let arrow = ` <-- \\(\\Gamma_{${idx+1}}\\)`;
            if (set.origin_type === 'concatenation') {
                color = 'var(--accent-purple)';
                typeName = 'Concatenation';
                arrow = ` <-- \\(${set.origin_label}\\)`;
            } else if (set.origin_type === 'replacement') {
                color = 'var(--accent-pink)';
                typeName = 'Replacement';
                arrow = ` <-- \\(${set.origin_label}\\)`;
            }
            return `<div style="padding: 8px 14px;  border-left: 4px solid ${color}; border-radius: 8px; margin-bottom: 8px; display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
                <strong style="color:${color}; font-size:1.05em;">\\(${label}\\)</strong> <span style="font-size:0.85em; opacity:0.8; background:var(--glass-border); padding:2px 8px; border-radius:4px;">[${typeName}]</span> <span style="">${arrow}</span> <span style="margin-left:auto; font-size:0.85em; ">(step k=${set.step_k || 1})</span>
            </div>`;
        }).join('');
        let lineageEl = document.getElementById('result-lineage-tree');
        if (lineageEl) lineageEl.innerHTML = treeHtml;
        
        lastComputedP = P;
        lastComputedE = E;
        lastCheckedLog = current_checked_log;
        renderInteractiveGraph(currentGraphMode);

        // Render Rare Phenomenon Radar
        let rareBox = document.getElementById('rare-radar-box');
        let rareIcon = document.getElementById('rare-radar-icon');
        let rareTitle = document.getElementById('rare-radar-title');
        let rareText = document.getElementById('rare-radar-text');
        let rareBadge = document.getElementById('rare-radar-badge');
        
        let concatCount = E.filter(s => s.origin_type === 'concatenation').length;
        let replaceCount = E.filter(s => s.origin_type === 'replacement').length;
        let maxK = Math.max(...E.map(s => s.step_k || 1));
        
        let rareReasons = [];
        if (maxK >= 3) {
            rareReasons.push(`Deep survival hierarchy reached (Step k=${maxK}).`);
        }
        if (concatCount >= 1) {
            rareReasons.push(`Surviving Concatenation Set detected (${concatCount} set${concatCount>1?'s':''}).`);
        }
        if (replaceCount >= 1) {
            rareReasons.push(`Surviving Replacement Set detected (${replaceCount} set${replaceCount>1?'s':''}).`);
        }
        if (E.length >= P.length + 2) {
            rareReasons.push(`High combinatorial expansion (|E| = ${E.length} vs |P| = ${P.length}).`);
        }
        
        if (rareReasons.length > 0) {
            rareText.innerText = rareReasons.join(' ');
            rareBox.classList.remove('hidden');
            
            // Switch themes: Gold if Replacement is present, Silver if only Concatenation is present
            if (replaceCount > 0) {
                // GOLD THEME (Gold Trophy)
                rareBox.style.border = '1px solid var(--accent-pink)';
                rareBox.style.background = 'linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(245,158,11,0.05) 100%)';
                rareBox.style.boxShadow = '0 0 25px rgba(251,191,36,0.2)';
                rareIcon.innerText = '🏆';
                rareTitle.style.color = 'var(--accent-pink)';
                rareTitle.innerText = 'Rare Mathematical Phenomenon Detected!';
                rareText.style.color = 'var(--text-secondary)';
                rareBadge.style.background = 'rgba(251,191,36,0.2)';
                rareBadge.style.borderColor = 'var(--accent-pink)';
                rareBadge.style.color = 'var(--accent-pink)';
                rareBadge.innerText = 'WQO Gold Radar';
            } else {
                // SILVER THEME (Silver Medal) - Only Concatenation found without Replacement
                rareBox.style.border = '1px solid var(--text-secondary)';
                rareBox.style.background = 'linear-gradient(135deg, rgba(203,213,225,0.15) 0%, rgba(148,163,184,0.05) 100%)';
                rareBox.style.boxShadow = '0 0 25px rgba(203,213,225,0.2)';
                rareIcon.innerText = '🥈';
                rareTitle.style.color = 'var(--text-primary)';
                rareTitle.innerText = 'Surviving Concatenation Structure Detected!';
                rareText.style.color = 'var(--text-secondary)';
                rareBadge.style.background = 'rgba(203,213,225,0.2)';
                rareBadge.style.borderColor = 'var(--text-secondary)';
                rareBadge.style.color = 'var(--text-secondary)';
                rareBadge.innerText = 'WQO Silver Radar';
            }
        } else {
            rareBox.classList.add('hidden');
        }

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
        current_formula_summands = unique_summands;
        
        let formula_str = `\\langle a \\rangle_{\\mathcal{P}} = ${unique_summands.join(' \\vee ')}`;
        document.getElementById('result-formula').innerHTML = `\\[ ${formula_str} \\]`;
        
        resultsSection.classList.remove('hidden');
        safeTypeset([resultsSection, blocksContainer]);
        
    } catch (err) {
        errorMsg.innerText = err.message;
        errorMsg.style.display = 'block';
        resultsSection.classList.add('hidden');
        safeTypeset([errorMsg, blocksContainer]);
    }
});

// ==========================================
// Interactive WQO Hasse Diagram & Lineage Network Renderer
// ==========================================
let networkInstance = null;
let currentGraphMode = 'lineage';
let showAbsorbedNodes = false;
let lastComputedP = [];
let lastComputedE = [];
let lastCheckedLog = [];

function inspectNode(node) {
    let panel = document.getElementById('node-inspector-panel');
    if (!panel || !node) return;
    
    let E = lastComputedE;
    let reduces = [];
    let reducedBy = [];
    
    if (node.words && Array.isArray(node.words)) {
        for (let idx = 0; idx < E.length; idx++) {
            let s = E[idx];
            if (s.join(',') !== node.words.join(',')) {
                if (set_ll(node.words, s)) reduces.push(`S_{${idx+1}}`);
                if (set_ll(s, node.words)) reducedBy.push(`S_{${idx+1}}`);
            }
        }
    }
    
    let statusHtml = node.survived ? 
        '<span style=" font-weight:600; font-size:0.88rem;">✅ Minimal Stabilizer Element (Survives in \\(\\mathbb{E}\\))</span>' : 
        `<span style=" font-weight:600; font-size:0.88rem;">❌ Absorbed by \\(${node.absorbed_by || 'E'}\\) under \\(\\ll\\)</span>`;

    let wordTags = (node.words || []).map(w => `<span class="inspector-word-tag">${w}</span>`).join('');
    
    panel.innerHTML = `
        <div style="border-bottom: 1px dashed var(--glass-border); padding-bottom: 12px; margin-bottom: 12px;">
            <span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px;   border: 1px solid var(--glass-border); padding:3px 8px; border-radius:6px; font-weight:600;">${node.set_type}</span>
            <h3 style="margin: 10px 0 6px 0;  font-size: 1.35rem;">\\(${node.display_label}\\)</h3>
            <div style=" font-size: 0.9rem; line-height: 1.5;">Origin: \\(${node.origin_label || 'User Defined'}\\)</div>
            <div style="margin-top: 8px;">${statusHtml}</div>
        </div>
        <div style="flex-grow: 1;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-size:0.9rem;  font-weight:600;">Word Elements (${(node.words || []).length}):</span>
                <button onclick="navigator.clipboard.writeText('${(node.words || []).join(', ')}'); this.innerText='Copied!'; setTimeout(()=>this.innerText='📋 Copy Words', 1500);" style="background:var(--glass-border); border: 1px solid var(--glass-border);  padding:4px 10px; border-radius:6px; cursor:pointer; font-size:0.75rem;">📋 Copy Words</button>
            </div>
            <div style="max-height: 180px; overflow-y: auto;  padding: 8px; border-radius: 8px; border: 1px solid var(--glass-border);">
                ${wordTags}
            </div>
        </div>
        <div style="margin-top: 14px; border-top: 1px dashed var(--glass-border); padding-top: 12px; font-size:0.88rem;  line-height: 1.6;">
            <div>⚡ <strong>Reduces (\\(\\ll\\)):</strong> ${reduces.length > 0 ? `\\(${reduces.join(', ')}\\)` : 'None'}</div>
            <div style="margin-top:4px;">🛡️ <strong>Reduced by (\\(\\gg\\)):</strong> ${reducedBy.length > 0 ? `\\(${reducedBy.join(', ')}\\)` : 'None (Minimal Source)'}</div>
        </div>
    `;
    safeTypeset([panel]);
}

function renderInteractiveGraph(mode) {
    currentGraphMode = mode || 'lineage';
    let container = document.getElementById('network-graph-container');
    if (!container) return;
    
    // Update active button states
    let btnLin = document.getElementById('btn-graph-lineage');
    let btnWqo = document.getElementById('btn-graph-wqo');
    let btnAbs = document.getElementById('btn-graph-absorbed');
    if (btnLin) btnLin.classList.toggle('active-mode', currentGraphMode === 'lineage');
    if (btnWqo) btnWqo.classList.toggle('active-mode', currentGraphMode === 'wqo');
    if (btnAbs) btnAbs.classList.toggle('active-mode', showAbsorbedNodes);
    
    if (typeof vis === 'undefined' || !vis.Network) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; ">⚠️ Graph visualization library (vis-network) is loading or unavailable. Please check internet connection for CDN.</div>';
        return;
    }
    
    let P = lastComputedP;
    let E = lastComputedE;
    let log = lastCheckedLog;
    if (!P || !E || P.length === 0) return;
    
    let nodeMap = {};
    let edges = [];
    
    // 1. Add Initial Blocks P
    for (let i = 0; i < P.length; i++) {
        let block = P[i];
        let nId = block.node_id || `G${i+1}`;
        let sIdx = E.findIndex(s => s.join(',') === block.join(','));
        if (sIdx !== -1) {
            nodeMap[nId] = {
                id: nId,
                label: `Γ${i+1} ≡ S${sIdx+1}\n[Minimal Block]`,
                title: `Initial Block Γ${i+1} (Survives as S${sIdx+1})\nWords: ${block.join(', ')}`,
                color: { background: '#ffffff', border: '#7A5C3A', highlight: { background: '#faf8f5', border: '#4E3A29' } },
                font: { color: '#111111', face: 'ui-monospace, monospace', size: 14 },
                shape: 'box', margin: 12,
                shadow: { enabled: true, color: 'rgba(56, 189, 248, 0.5)', size: 12 },
                set_type: 'Initial Block ≡ Minimal Set',
                display_label: `\\Gamma_{${i+1}} \\equiv S_{${sIdx+1}}`,
                origin_label: `\\Gamma_{${i+1}}`,
                survived: true,
                words: block,
                step_k: block.step_k || 1,
                parent_ids: []
            };
        } else {
            let absorbedBy = 'another set in E';
            let logItem = log.find(item => item.words && item.words.join(',') === block.join(','));
            if (logItem && logItem.absorbed_by) absorbedBy = logItem.absorbed_by;
            nodeMap[nId] = {
                id: nId,
                label: `Γ${i+1}\n[Absorbed]`,
                title: `Initial Block Γ${i+1} (Absorbed by ${absorbedBy})\nWords: ${block.join(', ')}`,
                color: { background: '#ffffff', border: '#7A5C3A', highlight: { background: '#faf8f5', border: '#4E3A29' } },
                font: { color: 'var(--text-secondary)', face: 'Outfit', size: 13 },
                shape: 'box', margin: 10,
                shapeProperties: { borderDashes: [5, 5] },
                set_type: 'Initial Block (Absorbed)',
                display_label: `\\Gamma_{${i+1}}`,
                origin_label: `\\Gamma_{${i+1}}`,
                survived: false,
                absorbed_by: absorbedBy,
                words: block,
                step_k: block.step_k || 1,
                parent_ids: []
            };
        }
    }
    
    // 2. Add Surviving Minimal Sets E
    for (let j = 0; j < E.length; j++) {
        let set = E[j];
        if (set.origin_type === 'initial') continue; // already added as G(i+1)
        let nId = set.node_id || `S${j+1}`;
        if (!nodeMap[nId]) {
            let isRep = set.origin_type === 'replacement';
            let bg = isRep ? 'var(--accent-pink)' : 'var(--accent-purple)';
            let border = isRep ? 'var(--accent-pink)' : 'var(--accent-purple)';
            let hlBg = isRep ? '#d97706' : '#7e22ce';
            let hlBorder = isRep ? 'var(--text-secondary)' : '#e9d5ff';
            let shadowCol = isRep ? 'rgba(251, 191, 36, 0.5)' : 'rgba(192, 132, 252, 0.5)';
            
            nodeMap[nId] = {
                id: nId,
                label: `S${j+1}\n${isRep ? '[Replacement]' : '[Concatenation]'}`,
                title: `Stabilizer Set S${j+1}\nOrigin: ${set.origin_label || ''}\nWords: ${set.join(', ')}`,
                color: { background: bg, border: border, highlight: { background: hlBg, border: hlBorder } },
                font: { color: '#111111', face: 'ui-monospace, monospace', size: 14 },
                shape: 'box', margin: 12,
                shadow: { enabled: true, color: shadowCol, size: 12 },
                set_type: isRep ? 'Surviving Replacement Set' : 'Surviving Concatenation Set',
                display_label: `S_{${j+1}}`,
                origin_label: set.origin_label || '',
                survived: true,
                words: set,
                step_k: set.step_k || 1,
                parent_ids: set.parent_ids || []
            };
        }
    }
    
    // 3. Optionally add Absorbed Candidates
    if (showAbsorbedNodes) {
        for (let item of log) {
            if (!item.survived && item.node_id && !nodeMap[item.node_id]) {
                nodeMap[item.node_id] = {
                    id: item.node_id,
                    label: `[Absorbed]\n${item.type}`,
                    title: `Absorbed Candidate (${item.type})\nOrigin: ${item.label}\nAbsorbed by: ${item.absorbed_by}\nWords: ${(item.words||[]).join(', ')}`,
                    color: { background: '#ffffff', border: '#7A5C3A', highlight: { background: '#faf8f5', border: '#4E3A29' } },
                    font: { color: 'var(--text-secondary)', face: 'Outfit', size: 12 },
                    shape: 'box', margin: 8,
                    shapeProperties: { borderDashes: [4, 4] },
                    set_type: `Absorbed Candidate (${item.type})`,
                    display_label: item.label || 'Candidate',
                    origin_label: item.label || '',
                    survived: false,
                    absorbed_by: item.absorbed_by || 'E',
                    words: item.words || [],
                    step_k: item.step_k || 1,
                    parent_ids: item.parent_ids || []
                };
            }
        }
    }
    
    let nodesArray = Object.values(nodeMap);
    
    // 4. Build Edges based on Mode
    if (currentGraphMode === 'lineage') {
        for (let node of nodesArray) {
            if (node.parent_ids && node.parent_ids.length > 0) {
                for (let pId of node.parent_ids) {
                    if (nodeMap[pId]) {
                        let isRep = node.set_type.includes('Replacement');
                        let isCat = node.set_type.includes('Concatenation');
                        edges.push({
                            from: pId,
                            to: node.id,
                            label: isRep ? 'rep' : (isCat ? 'cat' : 'gen'),
                            font: { align: 'middle', size: 11, color: 'var(--text-secondary)', background: 'rgba(15,23,42,0.85)', strokeWidth: 0 },
                            color: { color: isRep ? 'var(--accent-pink)' : (isCat ? 'var(--accent-purple)' : 'var(--accent-blue)'), highlight: 'var(--text-primary)' },
                            arrows: { to: { enabled: true, scaleFactor: 1.1 } },
                            smooth: { type: 'cubicBezier', forceDirection: 'vertical', roundness: 0.35 },
                            width: 2
                        });
                    }
                }
            }
            if (!node.survived && node.absorbed_by && node.words) {
                let targetId = null;
                for (let tId in nodeMap) {
                    if (tId !== node.id && nodeMap[tId].survived && set_ll(nodeMap[tId].words, node.words)) {
                        targetId = tId;
                        break;
                    }
                }
                if (targetId) {
                    edges.push({
                        from: node.id,
                        to: targetId,
                        label: '<< absorbed by',
                        font: { align: 'middle', size: 10, color: 'var(--error)', background: 'rgba(15,23,42,0.85)', strokeWidth: 0 },
                        color: { color: 'var(--error)', highlight: 'var(--error)' },
                        arrows: { to: { enabled: true, scaleFactor: 1.0 } },
                        dashes: [5, 5],
                        width: 1.5
                    });
                }
            }
        }
    } else if (currentGraphMode === 'wqo') {
        for (let i = 0; i < nodesArray.length; i++) {
            for (let j = 0; j < nodesArray.length; j++) {
                if (i === j) continue;
                let A = nodesArray[i];
                let B = nodesArray[j];
                if (set_ll(A.words, B.words)) {
                    if (set_ll(B.words, A.words) && A.id > B.id) continue;
                    
                    let isDirectCover = true;
                    for (let k = 0; k < nodesArray.length; k++) {
                        if (k === i || k === j) continue;
                        let C = nodesArray[k];
                        if (set_ll(A.words, C.words) && set_ll(C.words, B.words)) {
                            if (!set_ll(C.words, A.words) && !set_ll(B.words, C.words)) {
                                isDirectCover = false;
                                break;
                            }
                        }
                    }
                    if (isDirectCover) {
                        edges.push({
                            from: A.id,
                            to: B.id,
                            label: '<< reduces',
                            font: { align: 'middle', size: 11, color: '#a5f3fc', background: 'rgba(15,23,42,0.85)', strokeWidth: 0 },
                            color: { color: '#06b6d4', highlight: '#22d3ee' },
                            arrows: { to: { enabled: true, scaleFactor: 1.2 } },
                            width: 2.5,
                            dashes: true
                        });
                    }
                }
            }
        }
    }
    
    let data = {
        nodes: new vis.DataSet(nodesArray),
        edges: new vis.DataSet(edges)
    };
    
    let options = {
        layout: {
            hierarchical: {
                enabled: currentGraphMode === 'lineage',
                direction: 'UD',
                sortMethod: 'directed',
                levelSeparation: 120,
                nodeSpacing: 170
            }
        },
        physics: {
            enabled: currentGraphMode !== 'lineage',
            barnesHut: {
                gravitationalConstant: -5000,
                centralGravity: 0.35,
                springLength: 160,
                springConstant: 0.04
            },
            stabilization: { iterations: 150 }
        },
        interaction: {
            hover: true,
            tooltipDelay: 150,
            zoomView: true,
            dragView: true,
            navigationButtons: false
        }
    };
    
    if (networkInstance) {
        networkInstance.destroy();
    }
    
    networkInstance = new vis.Network(container, data, options);
    
    let defaultInspectNode = nodesArray.find(n => n.set_type.includes('Replacement')) || 
                             nodesArray.find(n => n.set_type.includes('Concatenation')) || 
                             nodesArray[0];
    if (defaultInspectNode) {
        inspectNode(defaultInspectNode);
        networkInstance.selectNodes([defaultInspectNode.id]);
    }
    
    networkInstance.on("selectNode", function (params) {
        if (params.nodes && params.nodes.length > 0) {
            let nId = params.nodes[0];
            if (nodeMap[nId]) {
                inspectNode(nodeMap[nId]);
            }
        }
    });
}

// Attach UI Event Listeners for Interactive Graph
document.addEventListener('DOMContentLoaded', () => {
    let btnLin = document.getElementById('btn-graph-lineage');
    let btnWqo = document.getElementById('btn-graph-wqo');
    let btnAbs = document.getElementById('btn-graph-absorbed');
    let btnFit = document.getElementById('btn-graph-fit');
    let btnFull = document.getElementById('btn-graph-fullscreen');
    let btnExitFull = document.getElementById('btn-exit-fullscreen');
    let gridContainer = document.querySelector('.graph-grid-container');
    
    if (btnLin) btnLin.addEventListener('click', () => renderInteractiveGraph('lineage'));
    if (btnWqo) btnWqo.addEventListener('click', () => renderInteractiveGraph('wqo'));
    if (btnAbs) btnAbs.addEventListener('click', () => {
        showAbsorbedNodes = !showAbsorbedNodes;
        renderInteractiveGraph(currentGraphMode);
    });
    if (btnFit) btnFit.addEventListener('click', () => {
        if (networkInstance) networkInstance.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } });
    });
    
    function toggleFullscreenCanvas() {
        if (!gridContainer) return;
        let isFull = gridContainer.classList.toggle('fullscreen-mode');
        if (btnFull) {
            if (isFull) {
                btnFull.innerHTML = '❌ ย่อจอ (Exit Fullscreen)';
                btnFull.style.background = 'rgba(239, 68, 68, 0.25)';
                btnFull.style.borderColor = '#fca5a5';
                btnFull.style.color = '#fecaca';
                try {
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen();
                    }
                } catch(e) {}
            } else {
                btnFull.innerHTML = '⛶ ขยายเต็มจอ (Fullscreen Canvas)';
                btnFull.style.background = 'rgba(59, 130, 246, 0.2)';
                btnFull.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                btnFull.style.color = 'var(--accent-blue)';
                try {
                    if (document.fullscreenElement && document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                } catch(e) {}
            }
        }
        if (networkInstance) {
            setTimeout(() => {
                networkInstance.redraw();
                networkInstance.fit({ animation: { duration: 400, easingFunction: 'easeInOutQuad' } });
            }, 300);
        }
    }
    
    if (btnFull) btnFull.addEventListener('click', toggleFullscreenCanvas);
    if (btnExitFull) btnExitFull.addEventListener('click', toggleFullscreenCanvas);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && gridContainer && gridContainer.classList.contains('fullscreen-mode')) {
            toggleFullscreenCanvas();
        }
    });
});
