class BoardRenderer {
    constructor(state) {
        this.state = state;
        this.cellsSol = document.getElementById('cells-sol');
        this.cellsGamma = document.getElementById('cells-gamma');
        this.cellsSlots = document.getElementById('cells-slots');
        this.cellsTiles = document.getElementById('cells-tiles');
        this.boardPanel = document.getElementById('board-panel');
        this.outputPanel = document.getElementById('output-panel');
    }

    clear() {
        this.cellsSol.innerHTML = '';
        this.cellsGamma.innerHTML = '';
        this.cellsSlots.innerHTML = '';
        this.cellsTiles.innerHTML = '';
    }

    renderBoard(dragDropController) {
        this.clear();
        this.boardPanel.style.display = 'block';
        this.outputPanel.style.display = 'none';

        let globalIdx = 0;
        this.state.gammaRaw.forEach((block, bIdx) => {
            let blockWrapper = document.createElement('div');
            blockWrapper.className = 'gamma-block';
            
            let slotWrapper = document.createElement('div');
            slotWrapper.style.display = 'flex';
            slotWrapper.style.gap = '2px';
            slotWrapper.style.padding = '5px';
            slotWrapper.style.border = '1px solid transparent';
            
            let solWrapper = document.createElement('div');
            solWrapper.style.display = 'flex';
            solWrapper.style.gap = '2px';
            solWrapper.style.padding = '5px';
            solWrapper.style.border = '1px solid transparent';
            
            for (let i = 0; i < block.length; i++) {
                const currentIdx = globalIdx;
                const char = block[i];
                const solData = this.state.uSolution[currentIdx];
                
                // Solution
                let solCell = document.createElement('div');
                solCell.className = `solution-cell sol-${currentIdx} hidden`;
                if (solData) {
                    solCell.innerHTML = `${solData.char}<span style="font-size:0.7rem; vertical-align:sub">${solData.sub}</span>`;
                } else {
                    solCell.classList.add('empty');
                    solCell.innerHTML = 'ε';
                }
                solWrapper.appendChild(solCell);
                
                // Gamma
                let gCell = document.createElement('div');
                gCell.className = 'gamma-cell';
                gCell.innerText = char;
                blockWrapper.appendChild(gCell);
                
                // Slot
                let slot = document.createElement('div');
                slot.className = 'slot';
                slot.dataset.idx = currentIdx;
                
                dragDropController.bindSlotEvents(slot, currentIdx);
                
                slotWrapper.appendChild(slot);
                
                this.state.slotsData[currentIdx] = { element: slot, filledBy: null };
                globalIdx++;
            }
            
            this.cellsSol.appendChild(solWrapper);
            this.cellsGamma.appendChild(blockWrapper);
            this.cellsSlots.appendChild(slotWrapper);
        });

        // Render Tiles
        let tileIdx = 0;
        const [lm1, rm1] = this.state.currentCase.replace(/[()]/g, '').split(', ').map(Number);
        const is00xx = (lm1 === 0 && rm1 === 0);

        if (is00xx) {
            this.state.deltaRaw.forEach((char, i) => {
                this.createTile(char, i + 1, tileIdx++, this.cellsTiles, dragDropController);
            });
        } else {
            this.state.deltaRaw.forEach((block, i) => {
                let blockWrap = document.createElement('div');
                blockWrap.style.display = 'flex';
                blockWrap.style.gap = '2px';
                for (let j = 0; j < block.length; j++) {
                    this.createTile(block[j], i + 1, tileIdx++, blockWrap, dragDropController);
                }
                this.cellsTiles.appendChild(blockWrap);
            });
        }

        this.state.previousBoardState = this.state.slotsData.map(s => s.filledBy);
    }

    createTile(char, sub, idx, parent, dragDropController) {
        let wrapper = document.createElement('div');
        wrapper.className = 'tile-wrapper';
        wrapper.style.width = '40px';
        wrapper.style.height = '40px';

        let tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.val = char;
        tile.dataset.id = `tile_${idx}`;
        tile.draggable = true;
        tile.innerHTML = `${char}<div class="sub-index">${sub}</div>`;
        
        dragDropController.bindTileEvents(tile, tile.dataset.id);
        
        this.state.tilesData[tile.dataset.id] = { char, sub, seq: idx, element: tile, originParent: wrapper };
        wrapper.appendChild(tile);
        parent.appendChild(wrapper);
    }
}
