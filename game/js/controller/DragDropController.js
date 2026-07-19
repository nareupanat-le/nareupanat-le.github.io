class DragDropController {
    constructor(state) {
        this.state = state;
    }

    bindSlotEvents(slot, currentIdx) {
        slot.addEventListener('dragover', (e) => { e.preventDefault(); slot.classList.add('drag-over'); });
        slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
        slot.addEventListener('drop', (e) => this.handleDrop(e, currentIdx));
        
        slot.addEventListener('click', (e) => {
            if (e.target !== slot) return; 
            this.handleSlotClick(currentIdx);
        });
    }

    bindTileEvents(tile, tileId) {
        tile.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', tileId);
            this.clearSelection();
        });
        tile.addEventListener('click', () => this.handleTileClick(tileId));
    }

    handleTileClick(tileId) {
        const tileObj = this.state.tilesData[tileId];
        if (this.state.selectedTileId === tileId) {
            this.clearSelection();
            return;
        }
        
        this.clearSelection();
        this.state.selectedTileId = tileId;
        tileObj.element.classList.add('selected');
        
        this.state.slotsData.forEach(slot => {
            if (!slot.filledBy) {
                slot.element.classList.add('selectable');
            }
        });
    }

    handleSlotClick(slotIdx) {
        if (!this.state.selectedTileId) {
            const slot = this.state.slotsData[slotIdx];
            if (slot.filledBy) {
                const tileId = slot.filledBy;
                const tileObj = this.state.tilesData[tileId];
                tileObj.originParent.appendChild(tileObj.element);
                slot.filledBy = null;
            }
            return;
        }
        
        const slot = this.state.slotsData[slotIdx];
        if (slot.filledBy) {
            alert("This slot is already filled!");
            return;
        }
        
        this.placeTileInSlot(this.state.selectedTileId, slotIdx);
        this.clearSelection();
    }

    clearSelection() {
        if (this.state.selectedTileId) {
            this.state.tilesData[this.state.selectedTileId].element.classList.remove('selected');
            this.state.selectedTileId = null;
        }
        this.state.slotsData.forEach(s => s.element.classList.remove('selectable'));
    }

    handleDrop(e, slotIdx) {
        e.preventDefault();
        const slot = this.state.slotsData[slotIdx];
        slot.element.classList.remove('drag-over');
        
        const tileId = e.dataTransfer.getData('text/plain');
        if (slot.filledBy) return;
        
        this.placeTileInSlot(tileId, slotIdx);
    }

    placeTileInSlot(tileId, slotIdx) {
        const tileObj = this.state.tilesData[tileId];
        const slot = this.state.slotsData[slotIdx];
        
        this.state.slotsData.forEach(s => {
            if (s.filledBy === tileId) s.filledBy = null;
        });
        
        slot.element.appendChild(tileObj.element);
        slot.filledBy = tileId;
    }
}
