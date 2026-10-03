/**
 * LE & POE Semigroups Explorer (Client-Side Mathematical Engine & UI)
 * Part of Algebraic Theory of Partition Ideal Elements Portal
 *
 * Implements 100% pure client-side analytics matching le_app:
 * - Dataset Loading (n=5, n=6 for LE and POE)
 * - Cayley & Lattice Matrix Visualizers
 * - Interactive Poset Hasse Diagrams (Vis.js)
 * - P-Ideal Elements Verification & Valuations
 * - P1 vs P2 Non-Equivalence Hunter
 * - P-Simple & (P1, P2)-Simple Detectors
 * - R-Regularity & X-Coincidence Analysis
 */

(function () {
    'use strict';

    // State
    const state = {
        currentTab: 'hunter',
        explorerSubTab: 'inspector',
        datasetType: 'le',        // 'le' or 'poe'
        datasetN: 5,              // 5 or 6
        dataCache: {},            // key: `${type}_n${n}`
        currentIndex: 1,
        currentOrderNo: 1,
        currentEntry: null,
        availableIndices: [],
        availableOrders: [],
        hasseNetwork: null,
        isScanning: false
    };

    // DOM Elements Cache
    let dom = {};

    function initDomElements() {
        dom = {
            // Main Portal Tabs
            tabBtnHunter: document.getElementById('tab-btn-hunter'),
            tabBtnExplorer: document.getElementById('tab-btn-explorer'),
            paneHunter: document.getElementById('portal-pane-hunter'),
            paneExplorer: document.getElementById('portal-pane-explorer'),

            // Explorer Sub-Navigation
            expSubBtns: document.querySelectorAll('.exp-subtab-btn'),
            expSubPanes: document.querySelectorAll('.exp-subpane'),

            // Dataset Controls & Guide
            datasetTypeSelect: document.getElementById('exp-dataset-type'),
            datasetNSelect: document.getElementById('exp-dataset-n'),
            dataLoadingIndicator: document.getElementById('exp-data-loading'),
            guidePanel: document.getElementById('exp-user-guide-panel'),
            btnToggleGuide: document.getElementById('exp-btn-toggle-guide'),
            btnCloseGuide: document.getElementById('exp-btn-close-guide'),

            // Semigroup Selector
            indexSelect: document.getElementById('exp-index-select'),
            indexInput: document.getElementById('exp-index-input'),
            btnPrevIndex: document.getElementById('exp-btn-prev-index'),
            btnNextIndex: document.getElementById('exp-btn-next-index'),
            orderSelect: document.getElementById('exp-order-select'),
            btnPrevOrder: document.getElementById('exp-btn-prev-order'),
            btnNextOrder: document.getElementById('exp-btn-next-order'),
            btnRandomSemigroup: document.getElementById('exp-btn-random'),
            semigroupBadge: document.getElementById('exp-semigroup-badge'),

            // Info & Tables
            semigroupTitle: document.getElementById('exp-semigroup-title'),
            topElementSpan: document.getElementById('exp-top-element'),
            levelsSpan: document.getElementById('exp-levels'),
            coveringSpan: document.getElementById('exp-covering-pairs'),
            hasseContainer: document.getElementById('exp-hasse-network'),
            multTableContainer: document.getElementById('exp-mult-table-box'),
            joinTableBox: document.getElementById('exp-join-table-box'),
            meetTableBox: document.getElementById('exp-meet-table-box'),
            joinTableContainer: document.getElementById('exp-join-table-container'),
            meetTableContainer: document.getElementById('exp-meet-table-container'),

            // Tool 1: P-Ideal
            pBlocksInput: document.getElementById('exp-p-blocks'),
            btnComputePIdeal: document.getElementById('exp-btn-compute-pideal'),
            pIdealResultsContainer: document.getElementById('exp-pideal-results'),

            // Tool 2: P1 vs P2
            p1BlocksInput: document.getElementById('exp-p1-blocks'),
            p2BlocksInput: document.getElementById('exp-p2-blocks'),
            btnSwapP1P2: document.getElementById('exp-btn-swap-p1p2'),
            btnCheckP1P2Single: document.getElementById('exp-btn-p1p2-single'),
            btnScanP1P2Dataset: document.getElementById('exp-btn-p1p2-dataset'),
            p1p2ResultsContainer: document.getElementById('exp-p1p2-results'),

            // Tool 3: P-Simple
            psimplePInput: document.getElementById('exp-psimple-p'),
            psimpleP1Input: document.getElementById('exp-psimple-p1'),
            psimpleP2Input: document.getElementById('exp-psimple-p2'),
            btnCheckSimpleCurrent: document.getElementById('exp-btn-check-simple-current'),
            btnScanPSimple: document.getElementById('exp-btn-scan-psimple'),
            btnScanP1P2Simple: document.getElementById('exp-btn-scan-p1p2simple'),
            psimpleResultsContainer: document.getElementById('exp-psimple-results'),

            // Tool 4: R-Regularity (LE)
            rWordsInput: document.getElementById('exp-r-words'),
            r1WordsInput: document.getElementById('exp-r1-words'),
            r2WordsInput: document.getElementById('exp-r2-words'),
            btnSwapR1R2: document.getElementById('exp-btn-swap-r1r2'),
            btnCheckRRegular: document.getElementById('exp-btn-check-rregular'),
            btnScanRRegular: document.getElementById('exp-btn-scan-rregular'),
            btnScanR1R2: document.getElementById('exp-btn-scan-r1r2'),
            rregResultsContainer: document.getElementById('exp-rreg-results'),

            // Tool 5: X-Coincidence (POE)
            poeBadgeIndex: document.getElementById('exp-poe-badge-index'),
            poeBadgeOrder: document.getElementById('exp-poe-badge-order'),
            poeBadgeTop: document.getElementById('exp-poe-badge-top'),
            poeSwitchAlert: document.getElementById('exp-poe-switch-alert'),
            btnForcePoe: document.getElementById('exp-btn-force-poe'),
            poeBtnPrevIdx: document.getElementById('exp-poe-btn-prev-idx'),
            poeBtnNextIdx: document.getElementById('exp-poe-btn-next-idx'),
            poeBtnPrevOrd: document.getElementById('exp-poe-btn-prev-ord'),
            poeBtnNextOrd: document.getElementById('exp-poe-btn-next-ord'),
            poeBtnRandom: document.getElementById('exp-poe-btn-random'),

            xWordsInput: document.getElementById('exp-x-words'),
            x1WordsInput: document.getElementById('exp-x1-words'),
            x2WordsInput: document.getElementById('exp-x2-words'),
            btnSwapX1X2: document.getElementById('exp-btn-swap-x1x2'),
            btnCheckXCoincidence: document.getElementById('exp-btn-check-xcoincidence'),
            btnScanXCoincidence: document.getElementById('exp-btn-scan-xcoincidence'),
            btnScanX1X2: document.getElementById('exp-btn-scan-x1x2'),
            xcoincResultsContainer: document.getElementById('exp-xcoinc-results')
        };
    }

    // ==========================================
    // 1. Mathematical Logic Core
    // ==========================================

    function leq_in_levels(x, y, levels) {
        let i = x - 1;
        let j = y - 1;
        return i === j || levels[i] < levels[j];
    }

    function mul(table, a, b) {
        return table[a - 1][b - 1];
    }

    function meet(meet_table, a, b) {
        return meet_table[a - 1][b - 1];
    }

    function join(join_table, a, b) {
        return join_table[a - 1][b - 1];
    }

    function is_full_word(alpha) {
        if (!alpha || typeof alpha !== 'string') return false;
        let has0 = false, has1 = false;
        for (let i = 0; i < alpha.length; i++) {
            let ch = alpha[i];
            if (ch === '0') has0 = true;
            else if (ch === '1') has1 = true;
            else return false;
        }
        return has0 && has1;
    }

    function overline_alpha(a, alpha, table, e) {
        let res = (alpha[0] === '1') ? a : e;
        for (let i = 1; i < alpha.length; i++) {
            let xi = (alpha[i] === '1') ? a : e;
            res = mul(table, res, xi);
        }
        return res;
    }

    function bigwedge_over_block(a, block, table, meet_table, e) {
        let values = [];
        for (let alpha of block) {
            values.push(overline_alpha(a, alpha, table, e));
        }
        let current = values[0];
        for (let i = 1; i < values.length; i++) {
            current = meet(meet_table, current, values[i]);
        }
        return { bigwedge: current, values: values };
    }

    function is_subidempotent(a, table, levels) {
        let a2 = mul(table, a, a);
        return leq_in_levels(a2, a, levels);
    }

    function covering_pairs_from_levels(levels) {
        let n = levels.length;
        let pairs = [];
        for (let a = 0; a < n; a++) {
            for (let b = 0; b < n; b++) {
                if (a === b) continue;
                if (levels[b] === levels[a] + 1) {
                    pairs.push([a + 1, b + 1]);
                }
            }
        }
        return pairs;
    }

    function find_P_ideal_elements_for_le(entry, blocks) {
        let n = entry.n;
        let table = entry.table;
        let levels = entry.levels;
        let meet_table = entry.meet;
        let e = entry.top;
        let results = [];

        for (let a = 1; a <= n; a++) {
            let sub = is_subidempotent(a, table, levels);
            if (!sub) continue;

            let ok = true;
            let blocks_info = [];

            for (let block of blocks) {
                let res = bigwedge_over_block(a, block, table, meet_table, e);
                if (!leq_in_levels(res.bigwedge, a, levels)) {
                    ok = false;
                    break;
                }
                blocks_info.push({
                    block: block,
                    bigwedge: res.bigwedge,
                    alphas_values: res.values
                });
            }

            if (ok) {
                results.push({
                    a: a,
                    blocks_info: blocks_info
                });
            }
        }
        return results;
    }

    function inspect_all_candidates_for_le(entry, blocks) {
        let n = entry.n;
        let table = entry.table;
        let levels = entry.levels;
        let meet_table = entry.meet;
        let e = entry.top;
        let candidate_details = [];

        for (let a = 1; a <= n; a++) {
            let a2 = mul(table, a, a);
            let sub = leq_in_levels(a2, a, levels);
            let blocks_info = [];
            let all_blocks_ok = sub;

            for (let block of blocks) {
                let res = bigwedge_over_block(a, block, table, meet_table, e);
                let passed = leq_in_levels(res.bigwedge, a, levels);
                if (!passed) all_blocks_ok = false;
                blocks_info.push({
                    block: block,
                    bigwedge: res.bigwedge,
                    alphas_values: res.values,
                    passed: passed
                });
            }

            candidate_details.push({
                a: a,
                a2: a2,
                subidempotent: sub,
                blocks_info: blocks_info,
                is_ideal: all_blocks_ok
            });
        }
        return candidate_details;
    }

    function is_R_regular(entry, R) {
        let a_regs = [];
        let n = entry.n;
        let table = entry.table;
        let levels = entry.levels;
        let e = entry.top;

        for (let a = 1; a <= n; a++) {
            let ok = true;
            let vals = {};
            for (let alpha of R) {
                let val = overline_alpha(a, alpha, table, e);
                vals[alpha] = val;
                if (!leq_in_levels(a, val, levels)) {
                    ok = false;
                    break;
                }
            }
            if (ok) a_regs.push(a);
        }
        return a_regs;
    }

    function alpha_ideal_elements_for_poe(table, levels, e, alpha) {
        let n = table.length;
        let res = [];
        for (let a = 1; a <= n; a++) {
            if (!is_subidempotent(a, table, levels)) continue;
            let val = overline_alpha(a, alpha, table, e);
            if (leq_in_levels(val, a, levels)) {
                res.push(a);
            }
        }
        return res;
    }

    function compute_X_coincidence_for_poe(table, levels, e, X) {
        let alpha_ideals = {};
        for (let alpha of X) {
            alpha_ideals[alpha] = alpha_ideal_elements_for_poe(table, levels, e, alpha);
        }
        if (!X || X.length === 0) return { is_coincident: false, ideals: alpha_ideals };

        let sets = Object.values(alpha_ideals).map(arr => arr.join(','));
        let first = sets[0];
        let is_coincident = sets.every(s => s === first);
        return {
            is_coincident: is_coincident,
            common_ideal: is_coincident ? alpha_ideals[X[0]] : null,
            ideals: alpha_ideals
        };
    }

    function parseBlocks(text) {
        let lines = text.split('\n');
        let blocks = [];
        for (let line of lines) {
            line = line.trim();
            if (!line) continue;
            let words = line.split(',').map(w => w.trim()).filter(w => w.length > 0);
            if (words.length > 0) {
                for (let w of words) {
                    if (!is_full_word(w)) {
                        throw new Error(`Word '${w}' is not a full word on {0, 1} (must contain both 0 and 1).`);
                    }
                }
                blocks.push(words);
            }
        }
        return blocks;
    }

    // ==========================================
    // 2. Data Loading & Indexing
    // ==========================================

    async function loadDataset(type, n) {
        let cacheKey = `${type}_n${n}`;
        if (state.dataCache[cacheKey]) {
            return state.dataCache[cacheKey];
        }

        if (dom.dataLoadingIndicator) {
            dom.dataLoadingIndicator.style.display = 'inline-flex';
        }

        let filename = (type === 'le')
            ? `data/le_semigroups_n${n}.json`
            : `data/ordered_semigroups_n${n}_with_top.json`;

        try {
            let res = await fetch(filename);
            if (!res.ok) throw new Error(`HTTP error ${res.status} when fetching ${filename}`);
            let data = await res.json();
            state.dataCache[cacheKey] = data;
            return data;
        } finally {
            if (dom.dataLoadingIndicator) {
                dom.dataLoadingIndicator.style.display = 'none';
            }
        }
    }

    async function switchDataset() {
        let type = dom.datasetTypeSelect.value;
        let n = parseInt(dom.datasetNSelect.value, 10);
        state.datasetType = type;
        state.datasetN = n;

        let data = await loadDataset(type, n);

        // Populate indices
        let indicesSet = new Set();
        for (let e of data) {
            indicesSet.add(e.index);
        }
        state.availableIndices = Array.from(indicesSet).sort((a, b) => a - b);

        dom.indexSelect.innerHTML = '';
        state.availableIndices.forEach(idx => {
            let opt = document.createElement('option');
            opt.value = idx;
            opt.textContent = `Index ${idx}`;
            dom.indexSelect.appendChild(opt);
        });

        // Set default index & order
        state.currentIndex = state.availableIndices[0] || 1;
        dom.indexSelect.value = state.currentIndex;
        dom.indexInput.value = state.currentIndex;

        updateOrderSelector(data);
        renderCurrentSemigroup();
    }

    function updateOrderSelector(data) {
        if (!data) data = state.dataCache[`${state.datasetType}_n${state.datasetN}`];
        if (!data) return;

        let matching = data.filter(e => e.index === state.currentIndex);
        if (matching.length === 0) return;

        dom.orderSelect.innerHTML = '';
        state.availableOrders = [];

        if (state.datasetType === 'le') {
            matching.forEach(e => {
                let ord = e.order_no || 1;
                state.availableOrders.push(ord);
                let opt = document.createElement('option');
                opt.value = ord;
                opt.textContent = `Order No ${ord}`;
                dom.orderSelect.appendChild(opt);
            });
            state.currentOrderNo = state.availableOrders[0] || 1;
        } else {
            // POE format: orders array inside matching[0]
            let entry = matching[0];
            let orders = entry.orders || [{ levels: entry.levels, top: entry.top_element || entry.top }];
            for (let i = 1; i <= orders.length; i++) {
                state.availableOrders.push(i);
                let opt = document.createElement('option');
                opt.value = i;
                opt.textContent = `Order No ${i} (of ${orders.length})`;
                dom.orderSelect.appendChild(opt);
            }
            state.currentOrderNo = 1;
        }

        dom.orderSelect.value = state.currentOrderNo;
    }

    function getCurrentEntry() {
        let data = state.dataCache[`${state.datasetType}_n${state.datasetN}`];
        if (!data) return null;

        if (state.datasetType === 'le') {
            let entry = data.find(e => e.index === state.currentIndex && (e.order_no || 1) === state.currentOrderNo);
            return entry || null;
        } else {
            let base = data.find(e => e.index === state.currentIndex);
            if (!base) return null;
            let orders = base.orders || [{ levels: base.levels, top: base.top_element || base.top, covering_pairs: base.covering_pairs }];
            let ordIdx = state.currentOrderNo - 1;
            let ordObj = orders[ordIdx] || orders[0];

            let levels = ordObj.levels;
            let top = ordObj.top || ordObj.top_element;
            if (!top) {
                let maxL = Math.max(...levels);
                top = levels.indexOf(maxL) + 1;
            }

            return {
                n: base.n,
                index: base.index,
                order_no: state.currentOrderNo,
                table: base.table,
                levels: levels,
                top: top,
                covering_pairs: ordObj.covering_pairs || covering_pairs_from_levels(levels)
            };
        }
    }

    // ==========================================
    // 3. UI Rendering & Matrix Visualizers
    // ==========================================

    function renderMatrixTable(container, table, title, symbol) {
        if (!container) return;
        let n = table.length;
        let html = `
            <div class="matrix-card">
                <div class="matrix-header">
                    <h4>${title}</h4>
                    <span class="matrix-symbol">${symbol}</span>
                </div>
                <div class="matrix-table-wrapper">
                    <table class="matrix-table">
                        <thead>
                            <tr>
                                <th class="corner-cell">${symbol}</th>
                                ${Array.from({ length: n }, (_, i) => `<th>${i + 1}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${table.map((row, i) => `
                                <tr>
                                    <th>${i + 1}</th>
                                    ${row.map(val => `<td>${val}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        container.innerHTML = html;
    }

    function renderHasseDiagram(levels, coveringPairs, topElement) {
        if (!dom.hasseContainer) return;

        let n = levels.length;
        let min_lv = Math.min(...levels);
        let max_lv = Math.max(...levels);
        let num_lvs = max_lv - min_lv + 1;

        // Group elements by level
        let level_groups = {};
        for (let i = 1; i <= n; i++) {
            let lv = levels[i - 1];
            if (!level_groups[lv]) level_groups[lv] = [];
            level_groups[lv].push(i);
        }

        let width = 320;
        let height = 260;
        let pad_y = 36;
        let pad_x = 36;
        let avail_h = height - 2 * pad_y;
        let avail_w = width - 2 * pad_x;

        // Calculate (x, y) coordinates for each element
        let coords = {};
        for (let lv_str in level_groups) {
            let lv = parseInt(lv_str, 10);
            let elems = level_groups[lv];
            let y = (num_lvs === 1) ? (height / 2) : (height - pad_y - (lv - min_lv) * (avail_h / (num_lvs - 1)));
            let k = elems.length;
            for (let idx = 0; idx < k; idx++) {
                let elem = elems[idx];
                let x = (k === 1) ? (width / 2) : (pad_x + (idx + 0.5) * (avail_w / k));
                coords[elem] = { x: x, y: y };
            }
        }

        // Generate SVG covering lines
        let linesSvg = coveringPairs.map(pair => {
            let p1 = coords[pair[0]];
            let p2 = coords[pair[1]];
            if (!p1 || !p2) return '';
            return `<line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" stroke="#7A5C3A" stroke-width="2" stroke-opacity="0.65" stroke-linecap="round" />`;
        }).join('');

        // Generate SVG node circles and text
        let nodesSvg = Object.keys(coords).map(elemStr => {
            let elem = parseInt(elemStr, 10);
            let pos = coords[elem];
            let isTop = (elem === topElement);
            let fill = isTop ? '#fef3c7' : '#ffffff';
            let stroke = isTop ? '#d97706' : '#7A5C3A';
            let strokeWidth = isTop ? 2.5 : 2;
            let textFill = isTop ? '#92400e' : '#1c1917';
            let r = 16;

            let topBadge = isTop ? `<text x="${pos.x.toFixed(1)}" y="${(pos.y - 21).toFixed(1)}" text-anchor="middle" fill="#d97706" font-size="10.5" font-weight="700" font-family="'Outfit', sans-serif">top e</text>` : '';

            return `
                <g class="hasse-node">
                    <circle cx="${pos.x.toFixed(1)}" cy="${pos.y.toFixed(1)}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}">
                        <title>Element ${elem} (Level ${levels[elem - 1]})</title>
                    </circle>
                    <text x="${pos.x.toFixed(1)}" y="${(pos.y + 1).toFixed(1)}" text-anchor="middle" dominant-baseline="central" fill="${textFill}" font-family="'Outfit', -apple-system, sans-serif" font-weight="700" font-size="14">${elem}</text>
                    ${topBadge}
                </g>
            `;
        }).join('');

        let svgHtml = `
            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 10px;">
                <svg viewBox="0 0 ${width} ${height}" style="width: 100%; max-width: ${width}px; height: auto; max-height: ${height}px;" preserveAspectRatio="xMidYMid meet">
                    ${linesSvg}
                    ${nodesSvg}
                </svg>
            </div>
        `;

        dom.hasseContainer.innerHTML = svgHtml;
    }

    function renderCurrentSemigroup() {
        let entry = getCurrentEntry();
        state.currentEntry = entry;
        if (!entry) return;

        // Semigroup Title and Badges
        dom.semigroupTitle.textContent = `${state.datasetType.toUpperCase()}-Semigroup: n=${entry.n}, Index=${entry.index}, Order No=${entry.order_no}`;
        dom.semigroupBadge.textContent = `${state.datasetType.toUpperCase()} | n=${entry.n}`;
        dom.topElementSpan.innerHTML = `<strong>${entry.top}</strong>`;
        dom.levelsSpan.textContent = `[${entry.levels.join(', ')}]`;

        let covPairs = entry.covering_pairs || covering_pairs_from_levels(entry.levels);
        if (covPairs.length > 0) {
            dom.coveringSpan.textContent = covPairs.map(p => `${p[0]} ≤ ${p[1]}`).join(', ');
        } else {
            dom.coveringSpan.textContent = '∅ (Antichain / None)';
        }

        // Update POE Context Banner if on POE or LE
        if (dom.poeBadgeIndex) dom.poeBadgeIndex.textContent = entry.index;
        if (dom.poeBadgeOrder) dom.poeBadgeOrder.textContent = entry.order_no;
        if (dom.poeBadgeTop) dom.poeBadgeTop.textContent = entry.top;
        if (dom.poeSwitchAlert) dom.poeSwitchAlert.style.display = (state.datasetType === 'poe') ? 'none' : 'block';

        // Render Tables
        renderMatrixTable(dom.multTableContainer, entry.table, 'Multiplication Table', '·');

        let detailsElem = document.getElementById('exp-lattice-tables-details');
        if (state.datasetType === 'le' && entry.join && entry.meet) {
            if (detailsElem) detailsElem.style.display = 'block';
            if (dom.joinTableBox) dom.joinTableBox.style.display = 'block';
            if (dom.meetTableBox) dom.meetTableBox.style.display = 'block';
            renderMatrixTable(dom.joinTableContainer, entry.join, 'Lattice Join Table', '∨');
            renderMatrixTable(dom.meetTableContainer, entry.meet, 'Lattice Meet Table', '∧');
        } else {
            if (detailsElem) detailsElem.style.display = 'none';
            if (dom.joinTableBox) dom.joinTableBox.style.display = 'none';
            if (dom.meetTableBox) dom.meetTableBox.style.display = 'none';
        }

        // Render Hasse Diagram
        renderHasseDiagram(entry.levels, covPairs, entry.top);

        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise();
        }
    }

    // ==========================================
    // 4. Tool 1: P-Ideal Elements Analysis
    // ==========================================

    function handleComputePIdeal() {
        let entry = state.currentEntry;
        if (!entry) return;

        if (state.datasetType !== 'le') {
            dom.pIdealResultsContainer.innerHTML = `<div class="error-msg">⚠️ P-ideal block meets require Lattice Meets (LE-semigroup). Please select LE-semigroups.</div>`;
            return;
        }

        let rawText = dom.pBlocksInput.value;
        let blocks;
        try {
            blocks = parseBlocks(rawText);
        } catch (e) {
            dom.pIdealResultsContainer.innerHTML = `<div class="error-msg">❌ Parse Error: ${e.message}</div>`;
            return;
        }

        if (blocks.length === 0) {
            dom.pIdealResultsContainer.innerHTML = `<div class="error-msg">⚠️ Please enter at least 1 partition block.</div>`;
            return;
        }

        let candidate_details = inspect_all_candidates_for_le(entry, blocks);
        let ideal_elements = candidate_details.filter(c => c.is_ideal).map(c => c.a);

        let html = `
            <div class="result-card" style="margin-top: 16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h4 style="margin:0; color:var(--text-primary);">📊 Analysis Results for \(\mathcal{P}\)</h4>
                    <span class="badge-status ${ideal_elements.length > 0 ? 'badge-admissible' : 'badge-inadmissible'}">
                        \(${ideal_elements.length}\) Ideal Element${ideal_elements.length !== 1 ? 's' : ''} Found
                    </span>
                </div>
                <p><strong>Configured Partition Blocks:</strong> ${blocks.map((b, i) => `\(\\Gamma_{${i + 1}} = \\{${b.join(', ')}\\}\\)`).join(', ')}</p>
                <div style="background:var(--bg-secondary); padding:10px 16px; border-radius:10px; margin-bottom:16px; border:1px solid var(--glass-border);">
                    <h5 style="margin:0 0 6px 0;">Principal \(\mathcal{P}\)-Ideal Elements Set:</h5>
                    <div style="font-size:1.15rem; font-weight:700; color:var(--accent-purple);">
                        \(\\mathcal{I}_{\\mathcal{P}}(S) = \\{${ideal_elements.join(', ') || '\\emptyset'}\\}\)
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Element \(a\)</th>
                                <th>Subidempotent (\(a^2 \\le a\))</th>
                                ${blocks.map((b, i) => `<th>Block \(\\Gamma_{${i + 1}}\): Meet \\(\\bigwedge \\bar{\\alpha}(a)\\)</th>`).join('')}
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${candidate_details.map(c => `
                                <tr style="background:${c.is_ideal ? 'rgba(21, 128, 61, 0.06)' : 'transparent'};">
                                    <td style="font-weight:700;">\(a = ${c.a}\) ${c.a === entry.top ? '<span style="color:#d97706;">(top e)</span>' : ''}</td>
                                    <td>
                                        ${c.subidempotent
                                            ? `<span style="color:var(--success);">✔ Pass (\(${c.a}^2 = ${c.a2} \\le ${c.a}\))</span>`
                                            : `<span style="color:var(--error);">✘ Fail (\(${c.a}^2 = ${c.a2} \\not\\le ${c.a}\))</span>`}
                                    </td>
                                    ${c.blocks_info.map(b => `
                                        <td>
                                            Valuations: [${b.alphas_values.join(', ')}]<br>
                                            Meet: <strong>${b.bigwedge}</strong>
                                            ${b.passed ? '<span style="color:var(--success);"> (\\(\\le a\\) ✔)</span>' : '<span style="color:var(--error);"> (\\(\\not\\le a\\) ✘)</span>'}
                                        </td>
                                    `).join('')}
                                    <td style="font-weight:700; color:${c.is_ideal ? 'var(--success)' : 'var(--error)'};">
                                        ${c.is_ideal ? '✔ \\(\\mathcal{P}\\)-Ideal Element' : '✘ Not Ideal'}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        dom.pIdealResultsContainer.innerHTML = html;
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise();
        }
    }

    // ==========================================
    // 5. Tool 2: P1 vs P2 Comparator & Hunter
    // ==========================================

    function handleCheckP1P2Single() {
        let entry = state.currentEntry;
        if (!entry) return;

        if (state.datasetType !== 'le') {
            dom.p1p2ResultsContainer.innerHTML = `<div class="error-msg">⚠️ P-ideal comparison requires LE-semigroups.</div>`;
            return;
        }

        let blocks1, blocks2;
        try {
            blocks1 = parseBlocks(dom.p1BlocksInput.value);
            blocks2 = parseBlocks(dom.p2BlocksInput.value);
        } catch (e) {
            dom.p1p2ResultsContainer.innerHTML = `<div class="error-msg">❌ Parse Error: ${e.message}</div>`;
            return;
        }

        let p1_ideals = find_P_ideal_elements_for_le(entry, blocks1).map(x => x.a);
        let p2_ideals = find_P_ideal_elements_for_le(entry, blocks2).map(x => x.a);
        let diff = p1_ideals.filter(a => !p2_ideals.includes(a));

        let html = `
            <div class="result-card" style="margin-top: 16px;">
                <h4>Single Semigroup Comparison Result</h4>
                <p><strong>Semigroup:</strong> n=${entry.n}, Index=${entry.index}, Order No=${entry.order_no}</p>
                <div style="display:flex; gap:16px; flex-wrap:wrap; margin-bottom:12px;">
                    <div style="flex:1; background:rgba(122,92,58,0.06); padding:12px; border-radius:8px;">
                        <strong>\\(\\mathcal{I}_{\\mathcal{P}_1}(S)\\):</strong> \\(\\{${p1_ideals.join(', ') || '\\emptyset'}\\}\\)
                    </div>
                    <div style="flex:1; background:rgba(122,92,58,0.06); padding:12px; border-radius:8px;">
                        <strong>\\(\\mathcal{I}_{\\mathcal{P}_2}(S)\\):</strong> \\(\\{${p2_ideals.join(', ') || '\\emptyset'}\\}\\)
                    </div>
                </div>
                <div style="padding:12px 16px; border-radius:8px; border:1px solid ${diff.length > 0 ? 'var(--accent-pink)' : 'var(--glass-border)'}; background:${diff.length > 0 ? 'rgba(217, 119, 6, 0.08)' : 'var(--bg-secondary)'};">
                    <h5 style="margin:0 0 6px 0; color:${diff.length > 0 ? 'var(--accent-pink)' : 'var(--text-primary)'};">
                        ${diff.length > 0 ? '🎯 Distinction Found: Elements in \\(\\mathcal{P}_1\\) but NOT \\(\\mathcal{P}_2\\)' : 'No Distinguishing Elements on this Semigroup'}
                    </h5>
                    <div>\\(\\mathcal{I}_{\\mathcal{P}_1} \\setminus \\mathcal{I}_{\\mathcal{P}_2} = \\{${diff.join(', ') || '\\emptyset'}\\}\\)</div>
                </div>
            </div>
        `;

        dom.p1p2ResultsContainer.innerHTML = html;
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise();
        }
    }

    async function handleScanP1P2Dataset() {
        if (state.datasetType !== 'le') {
            dom.p1p2ResultsContainer.innerHTML = `<div class="error-msg">⚠️ P-ideal batch scanner requires LE-semigroups.</div>`;
            return;
        }

        let blocks1, blocks2;
        try {
            blocks1 = parseBlocks(dom.p1BlocksInput.value);
            blocks2 = parseBlocks(dom.p2BlocksInput.value);
        } catch (e) {
            dom.p1p2ResultsContainer.innerHTML = `<div class="error-msg">❌ Parse Error: ${e.message}</div>`;
            return;
        }

        let data = state.dataCache[`${state.datasetType}_n${state.datasetN}`];
        if (!data) data = await loadDataset(state.datasetType, state.datasetN);

        dom.p1p2ResultsContainer.innerHTML = `<div class="card glass-panel" style="text-align:center;">⏳ Batch scanning ${data.length} semigroups... Please wait.</div>`;

        setTimeout(() => {
            let found = [];
            for (let entry of data) {
                let p1_ideals = find_P_ideal_elements_for_le(entry, blocks1).map(x => x.a);
                let p2_ideals = find_P_ideal_elements_for_le(entry, blocks2).map(x => x.a);
                let diff = p1_ideals.filter(a => !p2_ideals.includes(a));

                if (diff.length > 0) {
                    found.push({
                        n: entry.n,
                        index: entry.index,
                        order_no: entry.order_no || 1,
                        top: entry.top,
                        p1_ideals: p1_ideals,
                        p2_ideals: p2_ideals,
                        diff: diff
                    });
                }
            }

            let html = `
                <div class="result-card" style="margin-top: 16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <h4 style="margin:0;">🚀 Batch Scan Results</h4>
                        <span class="badge-status ${found.length > 0 ? 'badge-admissible' : 'badge-inadmissible'}">
                            ${found.length} Semigroups Found with \\(\\mathcal{P}_1 \\not\\subseteq \\mathcal{P}_2\\)
                        </span>
                    </div>
                    <p>Scanned entire dataset (<strong>${data.length}</strong> total semigroups).</p>

                    ${found.length === 0 ? `
                        <div style="padding:16px; background:var(--bg-secondary); border-radius:8px;">
                            No semigroups found where \\(\\mathcal{P}_1\\) has an ideal element not in \\(\\mathcal{P}_2\\).
                        </div>
                    ` : `
                        <div class="table-responsive" style="max-height:420px; overflow-y:auto;">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Index</th>
                                        <th>Order No</th>
                                        <th>Top \(e\)</th>
                                        <th>\(\\mathcal{I}_{\\mathcal{P}_1}\)</th>
                                        <th>\(\\mathcal{I}_{\\mathcal{P}_2}\)</th>
                                        <th>Difference (\(\\mathcal{P}_1 \\setminus \\mathcal{P}_2\))</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${found.slice(0, 100).map((r, i) => `
                                        <tr>
                                            <td>${i + 1}</td>
                                            <td><strong>${r.index}</strong></td>
                                            <td>${r.order_no}</td>
                                            <td>${r.top}</td>
                                            <td>{${r.p1_ideals.join(', ')}}</td>
                                            <td>{${r.p2_ideals.join(', ')}}</td>
                                            <td style="color:var(--accent-pink); font-weight:700;">{${r.diff.join(', ')}}</td>
                                            <td>
                                                <button class="btn btn-secondary btn-sm jump-semigroup-btn" data-index="${r.index}" data-order="${r.order_no}">
                                                    👁 View
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        ${found.length > 100 ? `<p style="font-size:0.85rem; color:var(--text-secondary); margin-top:8px;">(Displaying first 100 of ${found.length} results)</p>` : ''}
                    `}
                </div>
            `;

            dom.p1p2ResultsContainer.innerHTML = html;

            // Bind Jump buttons
            dom.p1p2ResultsContainer.querySelectorAll('.jump-semigroup-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    let idx = parseInt(btn.dataset.index, 10);
                    let ord = parseInt(btn.dataset.order, 10);
                    jumpToSemigroup(idx, ord);
                });
            });

            if (window.MathJax && window.MathJax.typesetPromise) {
                window.MathJax.typesetPromise();
            }
        }, 50);
    }

    // ==========================================
    // 6. Tool 3: P-Simple & (P1, P2)-Simple Detector
    // ==========================================

    function handleCheckSimpleCurrent() {
        let entry = state.currentEntry;
        if (!entry) return;

        if (state.datasetType !== 'le') {
            dom.psimpleResultsContainer.innerHTML = `<div class="error-msg">⚠️ Simple checking requires LE-semigroups.</div>`;
            return;
        }

        let blocks;
        try {
            blocks = parseBlocks(dom.psimplePInput.value);
        } catch (e) {
            dom.psimpleResultsContainer.innerHTML = `<div class="error-msg">❌ Parse Error: ${e.message}</div>`;
            return;
        }

        let p_ideals = find_P_ideal_elements_for_le(entry, blocks).map(x => x.a);
        let isSimple = (p_ideals.length === 1 && p_ideals[0] === entry.top);

        let html = `
            <div class="result-card" style="margin-top: 16px;">
                <h4>Current Semigroup \(\\mathcal{P}\)-Simplicity Verification</h4>
                <p><strong>Semigroup:</strong> n=${entry.n}, Index=${entry.index}, Order No=${entry.order_no}, Top e=${entry.top}</p>
                <p><strong>Ideal Elements:</strong> \\(\\mathcal{I}_{\\mathcal{P}}(S) = \\{${p_ideals.join(', ') || '\\emptyset'}\\}\\)</p>
                <div style="padding:14px; border-radius:8px; border:1px solid ${isSimple ? 'var(--success)' : 'var(--glass-border)'}; background:${isSimple ? 'rgba(21, 128, 61, 0.08)' : 'var(--bg-secondary)'};">
                    <h5 style="margin:0 0 6px 0; color:${isSimple ? 'var(--success)' : 'var(--error)'};">
                        ${isSimple ? '✔ S is \\(\\mathcal{P}\\)-Simple!' : '✘ S is NOT \\(\\mathcal{P}\\)-Simple'}
                    </h5>
                    <p style="margin:0; font-size:0.95rem;">
                        ${isSimple
                            ? 'The semigroup has no proper \\(\\mathcal{P}\\)-ideal elements other than the top element \\(e\\).'
                            : `There are ${p_ideals.length} ideal elements ({${p_ideals.join(', ')}}), so it contains proper \\(\\mathcal{P}\\)-ideals.`}
                    </p>
                </div>
            </div>
        `;

        dom.psimpleResultsContainer.innerHTML = html;
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise();
        }
    }

    async function handleScanPSimple() {
        let blocks;
        try {
            blocks = parseBlocks(dom.psimplePInput.value);
        } catch (e) {
            dom.psimpleResultsContainer.innerHTML = `<div class="error-msg">❌ Parse Error: ${e.message}</div>`;
            return;
        }

        let data = state.dataCache[`${state.datasetType}_n${state.datasetN}`];
        if (!data) data = await loadDataset(state.datasetType, state.datasetN);

        dom.psimpleResultsContainer.innerHTML = `<div class="card glass-panel" style="text-align:center;">⏳ Batch scanning for \\(\\mathcal{P}\\)-Simple semigroups across ${data.length} structures...</div>`;

        setTimeout(() => {
            let found = [];
            for (let entry of data) {
                let p_ideals = find_P_ideal_elements_for_le(entry, blocks).map(x => x.a);
                if (p_ideals.length === 1 && p_ideals[0] === entry.top) {
                    found.push({
                        n: entry.n,
                        index: entry.index,
                        order_no: entry.order_no || 1,
                        top: entry.top
                    });
                }
            }

            renderSimpleScanResults(found, data.length, '\\mathcal{P}-Simple Semigroups');
        }, 50);
    }

    async function handleScanP1P2Simple() {
        let blocks1, blocks2;
        try {
            blocks1 = parseBlocks(dom.psimpleP1Input.value);
            blocks2 = parseBlocks(dom.psimpleP2Input.value);
        } catch (e) {
            dom.psimpleResultsContainer.innerHTML = `<div class="error-msg">❌ Parse Error: ${e.message}</div>`;
            return;
        }

        let data = state.dataCache[`${state.datasetType}_n${state.datasetN}`];
        if (!data) data = await loadDataset(state.datasetType, state.datasetN);

        dom.psimpleResultsContainer.innerHTML = `<div class="card glass-panel" style="text-align:center;">⏳ Scanning for semigroups that are \\(\\mathcal{P}_1\\)-Simple but NOT \\(\\mathcal{P}_2\\)-Simple...</div>`;

        setTimeout(() => {
            let found = [];
            for (let entry of data) {
                let p1_ideals = find_P_ideal_elements_for_le(entry, blocks1).map(x => x.a);
                let p2_ideals = find_P_ideal_elements_for_le(entry, blocks2).map(x => x.a);

                let is_p1_simple = (p1_ideals.length === 1 && p1_ideals[0] === entry.top);
                let is_p2_simple = (p2_ideals.length === 1 && p2_ideals[0] === entry.top);

                if (is_p1_simple && !is_p2_simple) {
                    found.push({
                        n: entry.n,
                        index: entry.index,
                        order_no: entry.order_no || 1,
                        top: entry.top,
                        p1_count: p1_ideals.length,
                        p2_count: p2_ideals.length
                    });
                }
            }

            renderSimpleScanResults(found, data.length, '\\mathcal{P}_1-Simple but NOT \\mathcal{P}_2-Simple Semigroups');
        }, 50);
    }

    function renderSimpleScanResults(found, total, title) {
        let html = `
            <div class="result-card" style="margin-top: 16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h4 style="margin:0;">🚀 Scan Results: \\(${title}\\)</h4>
                    <span class="badge-status ${found.length > 0 ? 'badge-admissible' : 'badge-inadmissible'}">
                        ${found.length} Semigroups Found
                    </span>
                </div>
                <p>Scanned <strong>${total}</strong> semigroups in current dataset.</p>

                ${found.length === 0 ? `
                    <div style="padding:16px; background:var(--bg-secondary); border-radius:8px;">
                        No semigroups matched the simplicity criteria.
                    </div>
                ` : `
                    <div class="table-responsive" style="max-height:420px; overflow-y:auto;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Index</th>
                                    <th>Order No</th>
                                    <th>Top \(e\)</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${found.slice(0, 100).map((r, i) => `
                                    <tr>
                                        <td>${i + 1}</td>
                                        <td><strong>${r.index}</strong></td>
                                        <td>${r.order_no}</td>
                                        <td>${r.top}</td>
                                        <td>
                                            <button class="btn btn-secondary btn-sm jump-semigroup-btn" data-index="${r.index}" data-order="${r.order_no}">
                                                👁 View
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ${found.length > 100 ? `<p style="font-size:0.85rem; color:var(--text-secondary); margin-top:8px;">(Displaying first 100 of ${found.length} results)</p>` : ''}
                `}
            </div>
        `;

        dom.psimpleResultsContainer.innerHTML = html;

        dom.psimpleResultsContainer.querySelectorAll('.jump-semigroup-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                let idx = parseInt(btn.dataset.index, 10);
                let ord = parseInt(btn.dataset.order, 10);
                jumpToSemigroup(idx, ord);
            });
        });

        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise();
        }
    }

    // ==========================================
    // 7. Tool 4: R-Regularity (LE) & Tool 5: X-Coincidence (POE)
    // ==========================================

    function handleCheckRRegular() {
        let entry = state.currentEntry;
        if (!entry) return;

        let raw = dom.rWordsInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        for (let w of raw) {
            if (!is_full_word(w)) {
                dom.rregResultsContainer.innerHTML = `<div class="error-msg">❌ Word '${w}' is not a full word on {0, 1}.</div>`;
                return;
            }
        }

        let a_regs = is_R_regular(entry, raw);

        let html = `
            <div class="result-card" style="margin-top: 16px;">
                <div class="result-identity-card">
                    <div class="identity-badge-row">
                        <span class="badge-index">LE-Semigroup Index: <strong>#${entry.index}</strong></span>
                        <span class="badge-order">Order No: <strong>#${entry.order_no}</strong></span>
                        <span class="badge-top">Top Element: <strong>e = ${entry.top}</strong></span>
                    </div>
                </div>
                <h4>\\(\\mathcal{R}\\)-Regularity Analysis</h4>
                <p><strong>Full Words \\(R\\):</strong> {${raw.join(', ')}}</p>
                <div style="background:var(--bg-secondary); padding:14px; border-radius:8px;">
                    <strong>\\(\\mathcal{R}\\)-Regular Elements (\(a \\le \\bar{\\alpha}(a)\) for all \(\\alpha \\in R\)):</strong>
                    <div style="font-size:1.2rem; color:var(--accent-purple); font-weight:700; margin-top:6px;">
                        \\(\\{${a_regs.join(', ') || '\\emptyset'}\\}\\)
                    </div>
                </div>
            </div>
        `;
        dom.rregResultsContainer.innerHTML = html;
        if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise();
    }

    async function handleScanRRegular() {
        let raw = dom.rWordsInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        for (let w of raw) {
            if (!is_full_word(w)) {
                dom.rregResultsContainer.innerHTML = `<div class="error-msg">❌ Word '${w}' is not a full word on {0, 1}.</div>`;
                return;
            }
        }
        if (raw.length === 0) {
            dom.rregResultsContainer.innerHTML = `<div class="error-msg">⚠️ Please specify at least 1 word in R.</div>`;
            return;
        }

        dom.rregResultsContainer.innerHTML = `<div class="card glass-panel" style="text-align:center;">⏳ Batch scanning LE dataset for \\(\\mathcal{R}\\)-regular semigroups... Please wait.</div>`;

        let le_data = state.dataCache[`le_n${state.datasetN}`];
        if (!le_data) le_data = await loadDataset('le', state.datasetN);

        setTimeout(() => {
            let found = [];
            for (let entry of le_data) {
                let a_regs = is_R_regular(entry, raw);
                if (a_regs.length > 0) {
                    found.push({
                        index: entry.index,
                        order_no: entry.order_no || 1,
                        top: entry.top,
                        a_regs: a_regs
                    });
                }
            }

            let html = `
                <div class="result-card" style="margin-top: 16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
                        <h4 style="margin:0;">🚀 Scan Results: \\(\\mathcal{R}\\)-Regular Semigroups</h4>
                        <span class="badge-status ${found.length > 0 ? 'badge-admissible' : 'badge-inadmissible'}">
                            ${found.length} Semigroups Found
                        </span>
                    </div>
                    <p style="margin-bottom:10px;">Scanned <strong>${le_data.length}</strong> LE-semigroups for \\(R = \\{${raw.join(', ')}\\}\\).</p>
                    <div class="table-responsive" style="max-height:420px; overflow-y:auto;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>LE Index</th>
                                    <th>Order No</th>
                                    <th>Top \(e\)</th>
                                    <th>\(\\mathcal{R}\)-Regular Elements</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${found.slice(0, 150).map((r, i) => `
                                    <tr>
                                        <td>${i + 1}</td>
                                        <td><span class="badge-index"><strong>#${r.index}</strong></span></td>
                                        <td><span class="badge-order"><strong>#${r.order_no}</strong></span></td>
                                        <td><span class="badge-top"><strong>${r.top}</strong></span></td>
                                        <td style="color:var(--accent-purple); font-weight:700;">\\(\\{${r.a_regs.join(', ')}\\}\\)</td>
                                        <td>
                                            <button class="btn btn-secondary btn-sm jump-semigroup-btn" data-index="${r.index}" data-order="${r.order_no}" data-type="le">
                                                👁 View
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ${found.length > 150 ? `<p style="font-size:0.85rem; color:var(--text-secondary); margin-top:8px;">(Displaying first 150 of ${found.length} results)</p>` : ''}
                </div>
            `;
            dom.rregResultsContainer.innerHTML = html;
            dom.rregResultsContainer.querySelectorAll('.jump-semigroup-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    let idx = parseInt(btn.dataset.index, 10);
                    let ord = parseInt(btn.dataset.order, 10);
                    jumpToSemigroup(idx, ord, 'le');
                });
            });
            if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise();
        }, 50);
    }

    async function handleScanR1R2() {
        let raw1 = dom.r1WordsInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        let raw2 = dom.r2WordsInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);

        let le_data = state.dataCache[`le_n${state.datasetN}`];
        if (!le_data) le_data = await loadDataset('le', state.datasetN);

        dom.rregResultsContainer.innerHTML = `<div class="card glass-panel" style="text-align:center;">⏳ Batch scanning LE dataset for \\(R_1 \\not\\subseteq R_2\\) regularity...</div>`;

        setTimeout(() => {
            let found = [];
            for (let entry of le_data) {
                let regs1 = is_R_regular(entry, raw1);
                let regs2 = is_R_regular(entry, raw2);
                let diff = regs1.filter(a => !regs2.includes(a));
                if (diff.length > 0) {
                    found.push({
                        index: entry.index,
                        order_no: entry.order_no || 1,
                        top: entry.top,
                        regs1: regs1,
                        regs2: regs2,
                        diff: diff
                    });
                }
            }

            let html = `
                <div class="result-card" style="margin-top: 16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
                        <h4 style="margin:0;">🚀 Scan Results: \\(R_1\\)-Regular but NOT \\(R_2\\)-Regular</h4>
                        <span class="badge-status ${found.length > 0 ? 'badge-admissible' : 'badge-inadmissible'}">
                            ${found.length} Semigroups Found
                        </span>
                    </div>
                    <div class="table-responsive" style="max-height:420px; overflow-y:auto;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>LE Index</th>
                                    <th>Order No</th>
                                    <th>Top \(e\)</th>
                                    <th>\(R_1\)-Reg</th>
                                    <th>\(R_2\)-Reg</th>
                                    <th>Difference (\(R_1 \\setminus R_2\))</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${found.slice(0, 150).map((r, i) => `
                                    <tr>
                                        <td>${i + 1}</td>
                                        <td><span class="badge-index"><strong>#${r.index}</strong></span></td>
                                        <td><span class="badge-order"><strong>#${r.order_no}</strong></span></td>
                                        <td><span class="badge-top"><strong>${r.top}</strong></span></td>
                                        <td>{${r.regs1.join(', ')}}</td>
                                        <td>{${r.regs2.join(', ')}}</td>
                                        <td style="color:var(--accent-pink); font-weight:700;">{${r.diff.join(', ')}}</td>
                                        <td>
                                            <button class="btn btn-secondary btn-sm jump-semigroup-btn" data-index="${r.index}" data-order="${r.order_no}" data-type="le">
                                                👁 View
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            dom.rregResultsContainer.innerHTML = html;
            dom.rregResultsContainer.querySelectorAll('.jump-semigroup-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    let idx = parseInt(btn.dataset.index, 10);
                    let ord = parseInt(btn.dataset.order, 10);
                    jumpToSemigroup(idx, ord, 'le');
                });
            });
            if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise();
        }, 50);
    }

    async function ensurePoeLoaded() {
        if (state.datasetType !== 'poe') {
            dom.datasetTypeSelect.value = 'poe';
            await switchDataset();
        }
    }

    async function handleCheckXCoincidence() {
        await ensurePoeLoaded();
        let entry = state.currentEntry;
        if (!entry) return;

        let raw = dom.xWordsInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        for (let w of raw) {
            if (!is_full_word(w)) {
                dom.xcoincResultsContainer.innerHTML = `<div class="error-msg">❌ Word '${w}' is not a full word on {0, 1}.</div>`;
                return;
            }
        }
        if (raw.length === 0) {
            dom.xcoincResultsContainer.innerHTML = `<div class="error-msg">⚠️ Please specify at least 1 word in X.</div>`;
            return;
        }

        let res = compute_X_coincidence_for_poe(entry.table, entry.levels, entry.top, raw);
        let covPairs = entry.covering_pairs || covering_pairs_from_levels(entry.levels);
        let covText = covPairs.length > 0 ? covPairs.map(p => `${p[0]} ≤ ${p[1]}`).join(', ') : '∅';
        let citationText = `POE-semigroup (n=${entry.n}, index=${entry.index}, order_no=${entry.order_no}, top=${entry.top}): X-coincident=${res.is_coincident} for X={${raw.join(', ')}}`;

        let html = `
            <div class="result-card" style="margin-top: 16px;">
                <!-- High-Visibility Identity Banner -->
                <div class="result-identity-card">
                    <div class="identity-badge-row">
                        <span class="badge-index">POE-Semigroup Index: <strong>#${entry.index}</strong></span>
                        <span class="badge-order">Order No: <strong>#${entry.order_no}</strong></span>
                        <span class="badge-top">Top Element: <strong>e = ${entry.top}</strong></span>
                        <button class="btn btn-secondary btn-sm copy-citation-btn" data-citation="${citationText}">📋 Copy Info</button>
                    </div>
                    <div class="identity-details">
                        <span>Order Levels: <code>[${entry.levels.join(', ')}]</code></span>
                        <span>Covering Relations: <code>{${covText}}</code></span>
                    </div>
                </div>

                <!-- Coincidence Status Card -->
                <div style="padding: 14px 18px; border-radius: 10px; margin-bottom: 14px; border: 2px solid ${res.is_coincident ? 'var(--success)' : 'var(--error)'}; background: ${res.is_coincident ? 'rgba(21, 128, 61, 0.08)' : 'rgba(185, 28, 28, 0.08)'};">
                    <h4 style="margin: 0 0 6px 0; color: ${res.is_coincident ? 'var(--success)' : 'var(--error)'}; font-size: 1.15rem;">
                        ${res.is_coincident ? '✔ X-Coincidence Holds on this POE-Semigroup!' : '✘ X-Coincidence Fails on this POE-Semigroup'}
                    </h4>
                    <p style="margin: 0; font-size: 0.95rem; color: var(--text-primary);">
                        ${res.is_coincident 
                            ? `Every word in \\(X\\) induces the exact same ideal set: <strong style="color:var(--accent-purple); font-size:1.1rem;">\\(\\mathcal{I}_X(S) = \\{${res.common_ideal.join(', ') || '\\emptyset'}\\}\\)</strong>`
                            : 'The ideal sets \\(\\mathcal{I}_\\alpha(S)\\) differ across words in \\(X\\).'}
                    </p>
                </div>

                <!-- Per-Word Breakdown Table -->
                <h5 style="margin: 12px 0 8px 0; color: var(--text-secondary);">Ideal Sets Breakdown for Each Word \\(\\alpha \\in X\\):</h5>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Word \(\\alpha\)</th>
                                <th>Valuation Formula \(\\bar{\\alpha}(a)\)</th>
                                <th>\(\\alpha\)-Ideal Elements Set \(\\mathcal{I}_\\alpha(S)\)</th>
                                <th>Match Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${raw.map(alpha => {
                                let ideals = res.ideals[alpha] || [];
                                return `
                                    <tr>
                                        <td><code style="font-size:1rem; font-weight:700; color:var(--accent-purple);">${alpha}</code></td>
                                        <td>Mapping \(0 \\mapsto e (${entry.top}), 1 \\mapsto a\)</td>
                                        <td><strong style="color:var(--text-primary); font-size:1rem;">\\(\\{${ideals.join(', ') || '\\emptyset'}\\}\\)</strong></td>
                                        <td>${res.is_coincident ? '<span style="color:var(--success); font-weight:700;">✔ Coincident</span>' : '<span style="color:var(--text-secondary);">Evaluated</span>'}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        dom.xcoincResultsContainer.innerHTML = html;

        let copyBtn = dom.xcoincResultsContainer.querySelector('.copy-citation-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(copyBtn.dataset.citation);
                copyBtn.textContent = '✔ Copied!';
                setTimeout(() => { copyBtn.textContent = '📋 Copy Info'; }, 2000);
            });
        }

        if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise();
    }

    async function handleScanXCoincidence() {
        let raw = dom.xWordsInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        for (let w of raw) {
            if (!is_full_word(w)) {
                dom.xcoincResultsContainer.innerHTML = `<div class="error-msg">❌ Word '${w}' is not a full word on {0, 1}.</div>`;
                return;
            }
        }
        if (raw.length === 0) {
            dom.xcoincResultsContainer.innerHTML = `<div class="error-msg">⚠️ Please specify at least 1 word in X.</div>`;
            return;
        }

        dom.xcoincResultsContainer.innerHTML = `<div class="card glass-panel" style="text-align:center;">⏳ Batch scanning entire POE dataset for \\(X\\)-coincident structures... Please wait.</div>`;

        let poe_data = state.dataCache[`poe_n${state.datasetN}`];
        if (!poe_data) poe_data = await loadDataset('poe', state.datasetN);

        setTimeout(() => {
            let found = [];
            let totalConfigs = 0;

            for (let entry of poe_data) {
                let table = entry.table;
                let orders = entry.orders || [{ levels: entry.levels, top_element: entry.top }];
                for (let ordNo = 1; ordNo <= orders.length; ordNo++) {
                    totalConfigs++;
                    let ordObj = orders[ordNo - 1];
                    let levels = ordObj.levels;
                    let top = ordObj.top_element || ordObj.top;
                    if (!top) {
                        let maxL = Math.max(...levels);
                        top = levels.indexOf(maxL) + 1;
                    }
                    let info = compute_X_coincidence_for_poe(table, levels, top, raw);
                    if (info.is_coincident) {
                        found.push({
                            index: entry.index,
                            order_no: ordNo,
                            top: top,
                            levels: levels,
                            common_ideal: info.common_ideal || []
                        });
                    }
                }
            }

            let html = `
                <div class="result-card" style="margin-top: 16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
                        <h4 style="margin:0;">🚀 Batch Scan Results: \\(X\\)-Coincident POE-Semigroups</h4>
                        <span class="badge-status ${found.length > 0 ? 'badge-admissible' : 'badge-inadmissible'}">
                            ${found.length} Configurations Found
                        </span>
                    </div>
                    <p style="margin-bottom:10px;">Scanned <strong>${totalConfigs.toLocaleString()}</strong> configurations in POE dataset for \\(X = \\{${raw.join(', ')}\\}\\).</p>

                    ${found.length === 0 ? `
                        <div style="padding:16px; background:var(--bg-secondary); border-radius:8px;">
                            No POE semigroups found satisfying \\(X\\)-coincidence for these words.
                        </div>
                    ` : `
                        <div class="table-responsive" style="max-height:480px; overflow-y:auto;">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>POE Index</th>
                                        <th>Order No</th>
                                        <th>Top \(e\)</th>
                                        <th>Common Ideal \(\\mathcal{I}_X(S)\)</th>
                                        <th>Levels</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${found.slice(0, 150).map((r, i) => `
                                        <tr>
                                            <td>${i + 1}</td>
                                            <td><span class="badge-index"><strong>#${r.index}</strong></span></td>
                                            <td><span class="badge-order"><strong>#${r.order_no}</strong></span></td>
                                            <td><span class="badge-top"><strong>${r.top}</strong></span></td>
                                            <td style="font-weight:700; color:var(--accent-purple);">\\(\\{${r.common_ideal.join(', ') || '\\emptyset'}\\}\\)</td>
                                            <td><code>[${r.levels.join(', ')}]</code></td>
                                            <td>
                                                <button class="btn btn-secondary btn-sm jump-semigroup-btn" data-index="${r.index}" data-order="${r.order_no}" data-type="poe">
                                                    👁 View in Inspector
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        ${found.length > 150 ? `<p style="font-size:0.85rem; color:var(--text-secondary); margin-top:8px;">(Displaying first 150 of ${found.length} results)</p>` : ''}
                    `}
                </div>
            `;

            dom.xcoincResultsContainer.innerHTML = html;

            dom.xcoincResultsContainer.querySelectorAll('.jump-semigroup-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    let idx = parseInt(btn.dataset.index, 10);
                    let ord = parseInt(btn.dataset.order, 10);
                    jumpToSemigroup(idx, ord, 'poe');
                });
            });

            if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise();
        }, 50);
    }

    async function handleScanX1X2Coincidence() {
        let raw1 = dom.x1WordsInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        let raw2 = dom.x2WordsInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);

        for (let w of raw1.concat(raw2)) {
            if (!is_full_word(w)) {
                dom.xcoincResultsContainer.innerHTML = `<div class="error-msg">❌ Word '${w}' is not a full word on {0, 1}.</div>`;
                return;
            }
        }

        dom.xcoincResultsContainer.innerHTML = `<div class="card glass-panel" style="text-align:center;">⏳ Batch scanning POE dataset for \\(X_1\\)-coincident but NOT \\(X_2\\)-coincident semigroups...</div>`;

        let poe_data = state.dataCache[`poe_n${state.datasetN}`];
        if (!poe_data) poe_data = await loadDataset('poe', state.datasetN);

        setTimeout(() => {
            let found = [];
            let totalConfigs = 0;

            for (let entry of poe_data) {
                let table = entry.table;
                let orders = entry.orders || [{ levels: entry.levels, top_element: entry.top }];
                for (let ordNo = 1; ordNo <= orders.length; ordNo++) {
                    totalConfigs++;
                    let ordObj = orders[ordNo - 1];
                    let levels = ordObj.levels;
                    let top = ordObj.top_element || ordObj.top;
                    if (!top) {
                        let maxL = Math.max(...levels);
                        top = levels.indexOf(maxL) + 1;
                    }

                    let info1 = compute_X_coincidence_for_poe(table, levels, top, raw1);
                    let info2 = compute_X_coincidence_for_poe(table, levels, top, raw2);

                    if (info1.is_coincident && !info2.is_coincident) {
                        found.push({
                            index: entry.index,
                            order_no: ordNo,
                            top: top,
                            levels: levels,
                            common_ideal1: info1.common_ideal || []
                        });
                    }
                }
            }

            let html = `
                <div class="result-card" style="margin-top: 16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
                        <h4 style="margin:0;">🚀 Scan Results: \\(X_1\\)-Coincident but NOT \\(X_2\\)-Coincident</h4>
                        <span class="badge-status ${found.length > 0 ? 'badge-admissible' : 'badge-inadmissible'}">
                            ${found.length} Semigroups Found
                        </span>
                    </div>
                    <p style="margin-bottom:10px;">Scanned <strong>${totalConfigs.toLocaleString()}</strong> configurations where \\(X_1 = \\{${raw1.join(', ')}\\}\\) and \\(X_2 = \\{${raw2.join(', ')}\\}\\).</p>

                    ${found.length === 0 ? `
                        <div style="padding:16px; background:var(--bg-secondary); border-radius:8px;">
                            No POE semigroups found where \\(X_1\\)-coincidence holds and \\(X_2\\)-coincidence fails.
                        </div>
                    ` : `
                        <div class="table-responsive" style="max-height:480px; overflow-y:auto;">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>POE Index</th>
                                        <th>Order No</th>
                                        <th>Top \(e\)</th>
                                        <th>Common Ideal \(\\mathcal{I}_{X_1}(S)\)</th>
                                        <th>Levels</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${found.slice(0, 150).map((r, i) => `
                                        <tr>
                                            <td>${i + 1}</td>
                                            <td><span class="badge-index"><strong>#${r.index}</strong></span></td>
                                            <td><span class="badge-order"><strong>#${r.order_no}</strong></span></td>
                                            <td><span class="badge-top"><strong>${r.top}</strong></span></td>
                                            <td style="font-weight:700; color:var(--accent-purple);">\\(\\{${r.common_ideal1.join(', ') || '\\emptyset'}\\}\\)</td>
                                            <td><code>[${r.levels.join(', ')}]</code></td>
                                            <td>
                                                <button class="btn btn-secondary btn-sm jump-semigroup-btn" data-index="${r.index}" data-order="${r.order_no}" data-type="poe">
                                                    👁 View in Inspector
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        ${found.length > 150 ? `<p style="font-size:0.85rem; color:var(--text-secondary); margin-top:8px;">(Displaying first 150 of ${found.length} results)</p>` : ''}
                    `}
                </div>
            `;

            dom.xcoincResultsContainer.innerHTML = html;

            dom.xcoincResultsContainer.querySelectorAll('.jump-semigroup-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    let idx = parseInt(btn.dataset.index, 10);
                    let ord = parseInt(btn.dataset.order, 10);
                    jumpToSemigroup(idx, ord, 'poe');
                });
            });

            if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise();
        }, 50);
    }

    // ==========================================
    // 8. Navigation & Tab Switching
    // ==========================================

    function switchPortalTab(tabName) {
        state.currentTab = tabName;
        if (tabName === 'hunter') {
            dom.tabBtnHunter.classList.add('active');
            dom.tabBtnExplorer.classList.remove('active');
            dom.paneHunter.style.display = 'block';
            dom.paneExplorer.style.display = 'none';
            window.location.hash = '';
        } else {
            dom.tabBtnHunter.classList.remove('active');
            dom.tabBtnExplorer.classList.add('active');
            dom.paneHunter.style.display = 'none';
            dom.paneExplorer.style.display = 'block';
            window.location.hash = 'explorer';

            // Lazy load dataset on first switch
            if (!state.dataCache[`${state.datasetType}_n${state.datasetN}`]) {
                switchDataset();
            } else if (!state.currentEntry) {
                renderCurrentSemigroup();
            }
        }
    }

    function switchExplorerSubTab(subTabName) {
        state.explorerSubTab = subTabName;
        dom.expSubBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.subtab === subTabName);
        });
        dom.expSubPanes.forEach(pane => {
            pane.style.display = (pane.id === `subpane-${subTabName}`) ? 'block' : 'none';
        });
    }

    async function jumpToSemigroup(index, orderNo, targetType) {
        if (targetType && state.datasetType !== targetType) {
            if (dom.datasetTypeSelect) dom.datasetTypeSelect.value = targetType;
            await switchDataset();
        }

        state.currentIndex = index;
        if (dom.indexSelect) dom.indexSelect.value = index;
        if (dom.indexInput) dom.indexInput.value = index;

        let data = state.dataCache[`${state.datasetType}_n${state.datasetN}`];
        updateOrderSelector(data);

        state.currentOrderNo = orderNo;
        if (dom.orderSelect) dom.orderSelect.value = orderNo;

        renderCurrentSemigroup();
        switchExplorerSubTab('inspector');

        // Scroll to top of explorer
        if (dom.paneExplorer) dom.paneExplorer.scrollIntoView({ behavior: 'smooth' });
    }

    function setupEventListeners() {
        // Main Portal Tabs
        if (dom.tabBtnHunter) dom.tabBtnHunter.addEventListener('click', () => switchPortalTab('hunter'));
        if (dom.tabBtnExplorer) dom.tabBtnExplorer.addEventListener('click', () => switchPortalTab('explorer'));

        // Explorer Sub-Navigation
        dom.expSubBtns.forEach(btn => {
            btn.addEventListener('click', () => switchExplorerSubTab(btn.dataset.subtab));
        });

        // English User Guide Toggle & Close
        if (dom.btnToggleGuide && dom.guidePanel) {
            dom.btnToggleGuide.addEventListener('click', () => {
                let isHidden = (dom.guidePanel.style.display === 'none' || getComputedStyle(dom.guidePanel).display === 'none');
                dom.guidePanel.style.display = isHidden ? 'block' : 'none';
                if (isHidden) {
                    dom.guidePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    localStorage.removeItem('exp_guide_hidden');
                } else {
                    localStorage.setItem('exp_guide_hidden', '1');
                }
            });
        }
        if (dom.btnCloseGuide && dom.guidePanel) {
            dom.btnCloseGuide.addEventListener('click', () => {
                dom.guidePanel.style.display = 'none';
                localStorage.setItem('exp_guide_hidden', '1');
            });
        }
        // Initialize Guide Visibility from localStorage (open by default for first-time visitors)
        if (dom.guidePanel) {
            if (localStorage.getItem('exp_guide_hidden') === '1') {
                dom.guidePanel.style.display = 'none';
            } else {
                dom.guidePanel.style.display = 'block';
            }
        }

        // Dataset Selectors
        if (dom.datasetTypeSelect) dom.datasetTypeSelect.addEventListener('change', switchDataset);
        if (dom.datasetNSelect) dom.datasetNSelect.addEventListener('change', switchDataset);

        // Index / Order selectors
        if (dom.indexSelect) {
            dom.indexSelect.addEventListener('change', (e) => {
                state.currentIndex = parseInt(e.target.value, 10);
                dom.indexInput.value = state.currentIndex;
                updateOrderSelector();
                renderCurrentSemigroup();
            });
        }
        if (dom.indexInput) {
            dom.indexInput.addEventListener('change', (e) => {
                let val = parseInt(e.target.value, 10);
                if (state.availableIndices.includes(val)) {
                    state.currentIndex = val;
                    dom.indexSelect.value = val;
                    updateOrderSelector();
                    renderCurrentSemigroup();
                } else {
                    e.target.value = state.currentIndex;
                }
            });
        }
        if (dom.btnPrevIndex) {
            dom.btnPrevIndex.addEventListener('click', () => {
                let idx = state.availableIndices.indexOf(state.currentIndex);
                if (idx > 0) {
                    state.currentIndex = state.availableIndices[idx - 1];
                    dom.indexSelect.value = state.currentIndex;
                    dom.indexInput.value = state.currentIndex;
                    updateOrderSelector();
                    renderCurrentSemigroup();
                }
            });
        }
        if (dom.btnNextIndex) {
            dom.btnNextIndex.addEventListener('click', () => {
                let idx = state.availableIndices.indexOf(state.currentIndex);
                if (idx !== -1 && idx < state.availableIndices.length - 1) {
                    state.currentIndex = state.availableIndices[idx + 1];
                    dom.indexSelect.value = state.currentIndex;
                    dom.indexInput.value = state.currentIndex;
                    updateOrderSelector();
                    renderCurrentSemigroup();
                }
            });
        }
        if (dom.orderSelect) {
            dom.orderSelect.addEventListener('change', (e) => {
                state.currentOrderNo = parseInt(e.target.value, 10);
                renderCurrentSemigroup();
            });
        }
        if (dom.btnPrevOrder) {
            dom.btnPrevOrder.addEventListener('click', () => {
                let idx = state.availableOrders.indexOf(state.currentOrderNo);
                if (idx > 0) {
                    state.currentOrderNo = state.availableOrders[idx - 1];
                    dom.orderSelect.value = state.currentOrderNo;
                    renderCurrentSemigroup();
                }
            });
        }
        if (dom.btnNextOrder) {
            dom.btnNextOrder.addEventListener('click', () => {
                let idx = state.availableOrders.indexOf(state.currentOrderNo);
                if (idx !== -1 && idx < state.availableOrders.length - 1) {
                    state.currentOrderNo = state.availableOrders[idx + 1];
                    dom.orderSelect.value = state.currentOrderNo;
                    renderCurrentSemigroup();
                }
            });
        }
        if (dom.btnRandomSemigroup) {
            dom.btnRandomSemigroup.addEventListener('click', () => {
                if (state.availableIndices.length === 0) return;
                let randIdx = state.availableIndices[Math.floor(Math.random() * state.availableIndices.length)];
                state.currentIndex = randIdx;
                dom.indexSelect.value = randIdx;
                dom.indexInput.value = randIdx;
                updateOrderSelector();
                if (state.availableOrders.length > 0) {
                    state.currentOrderNo = state.availableOrders[Math.floor(Math.random() * state.availableOrders.length)];
                    dom.orderSelect.value = state.currentOrderNo;
                }
                renderCurrentSemigroup();
            });
        }

        // Tool 1: P-ideal
        if (dom.btnComputePIdeal) dom.btnComputePIdeal.addEventListener('click', handleComputePIdeal);

        // Tool 2: P1 vs P2
        if (dom.btnSwapP1P2) {
            dom.btnSwapP1P2.addEventListener('click', () => {
                let tmp = dom.p1BlocksInput.value;
                dom.p1BlocksInput.value = dom.p2BlocksInput.value;
                dom.p2BlocksInput.value = tmp;
            });
        }
        if (dom.btnCheckP1P2Single) dom.btnCheckP1P2Single.addEventListener('click', handleCheckP1P2Single);
        if (dom.btnScanP1P2Dataset) dom.btnScanP1P2Dataset.addEventListener('click', handleScanP1P2Dataset);

        // Tool 3: Simple
        if (dom.btnCheckSimpleCurrent) dom.btnCheckSimpleCurrent.addEventListener('click', handleCheckSimpleCurrent);
        if (dom.btnScanPSimple) dom.btnScanPSimple.addEventListener('click', handleScanPSimple);
        if (dom.btnScanP1P2Simple) dom.btnScanP1P2Simple.addEventListener('click', handleScanP1P2Simple);

        // Tool 4: R-Regularity (LE)
        if (dom.btnCheckRRegular) dom.btnCheckRRegular.addEventListener('click', handleCheckRRegular);
        if (dom.btnScanRRegular) dom.btnScanRRegular.addEventListener('click', handleScanRRegular);
        if (dom.btnSwapR1R2) {
            dom.btnSwapR1R2.addEventListener('click', () => {
                let tmp = dom.r1WordsInput.value;
                dom.r1WordsInput.value = dom.r2WordsInput.value;
                dom.r2WordsInput.value = tmp;
            });
        }
        if (dom.btnScanR1R2) dom.btnScanR1R2.addEventListener('click', handleScanR1R2);

        // Tool 5: X-Coincidence (POE)
        if (dom.btnForcePoe) {
            dom.btnForcePoe.addEventListener('click', async () => {
                await ensurePoeLoaded();
            });
        }
        if (dom.poeBtnPrevIdx) {
            dom.poeBtnPrevIdx.addEventListener('click', async () => {
                await ensurePoeLoaded();
                let idx = state.availableIndices.indexOf(state.currentIndex);
                if (idx > 0) {
                    state.currentIndex = state.availableIndices[idx - 1];
                    dom.indexSelect.value = state.currentIndex;
                    dom.indexInput.value = state.currentIndex;
                    updateOrderSelector();
                    renderCurrentSemigroup();
                }
            });
        }
        if (dom.poeBtnNextIdx) {
            dom.poeBtnNextIdx.addEventListener('click', async () => {
                await ensurePoeLoaded();
                let idx = state.availableIndices.indexOf(state.currentIndex);
                if (idx !== -1 && idx < state.availableIndices.length - 1) {
                    state.currentIndex = state.availableIndices[idx + 1];
                    dom.indexSelect.value = state.currentIndex;
                    dom.indexInput.value = state.currentIndex;
                    updateOrderSelector();
                    renderCurrentSemigroup();
                }
            });
        }
        if (dom.poeBtnPrevOrd) {
            dom.poeBtnPrevOrd.addEventListener('click', async () => {
                await ensurePoeLoaded();
                let idx = state.availableOrders.indexOf(state.currentOrderNo);
                if (idx > 0) {
                    state.currentOrderNo = state.availableOrders[idx - 1];
                    dom.orderSelect.value = state.currentOrderNo;
                    renderCurrentSemigroup();
                }
            });
        }
        if (dom.poeBtnNextOrd) {
            dom.poeBtnNextOrd.addEventListener('click', async () => {
                await ensurePoeLoaded();
                let idx = state.availableOrders.indexOf(state.currentOrderNo);
                if (idx !== -1 && idx < state.availableOrders.length - 1) {
                    state.currentOrderNo = state.availableOrders[idx + 1];
                    dom.orderSelect.value = state.currentOrderNo;
                    renderCurrentSemigroup();
                }
            });
        }
        if (dom.poeBtnRandom) {
            dom.poeBtnRandom.addEventListener('click', async () => {
                await ensurePoeLoaded();
                if (state.availableIndices.length === 0) return;
                let randIdx = state.availableIndices[Math.floor(Math.random() * state.availableIndices.length)];
                state.currentIndex = randIdx;
                dom.indexSelect.value = randIdx;
                dom.indexInput.value = randIdx;
                updateOrderSelector();
                if (state.availableOrders.length > 0) {
                    state.currentOrderNo = state.availableOrders[Math.floor(Math.random() * state.availableOrders.length)];
                    dom.orderSelect.value = state.currentOrderNo;
                }
                renderCurrentSemigroup();
            });
        }

        if (dom.btnCheckXCoincidence) dom.btnCheckXCoincidence.addEventListener('click', handleCheckXCoincidence);
        if (dom.btnScanXCoincidence) dom.btnScanXCoincidence.addEventListener('click', handleScanXCoincidence);
        if (dom.btnSwapX1X2) {
            dom.btnSwapX1X2.addEventListener('click', () => {
                let tmp = dom.x1WordsInput.value;
                dom.x1WordsInput.value = dom.x2WordsInput.value;
                dom.x2WordsInput.value = tmp;
            });
        }
        if (dom.btnScanX1X2) dom.btnScanX1X2.addEventListener('click', handleScanX1X2Coincidence);

        // Tool presets
        document.querySelectorAll('.exp-preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                let targetId = btn.dataset.target;
                let val = btn.dataset.val;
                let targetInput = document.getElementById(targetId);
                if (targetInput) targetInput.value = val;
            });
        });
    }

    // Initialize on DOM Ready
    document.addEventListener('DOMContentLoaded', () => {
        initDomElements();
        setupEventListeners();

        // Check hash
        if (window.location.hash === '#explorer') {
            switchPortalTab('explorer');
        }
    });

})();
