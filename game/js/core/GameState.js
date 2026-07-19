class GameState {
    constructor() {
        this.currentCase = "(0, 1, 0, 0)";
        this.currentStrategy = null;
        this.isSolutionVisible = false;
        
        this.a1 = "";
        this.a2 = "";
        this.gammaRaw = [];
        this.deltaRaw = [];
        this.uSolution = [];
        
        this.slotsData = []; // Array of { element, filledBy }
        this.tilesData = {}; // Object { [id]: { char, sub, seq, element, originParent } }
        this.selectedTileId = null;
        
        this.turnHistory = [];
        this.previousBoardState = [];
        this.turnCount = 1;
    }

    resetBoard() {
        this.slotsData = [];
        this.tilesData = {};
        this.selectedTileId = null;
        this.turnHistory = [];
        this.turnCount = 1;
        this.previousBoardState = [];
        this.isSolutionVisible = false;
    }

    recordTurn() {
        let actions = [];
        let currentBoardState = this.slotsData.map(s => s.filledBy);
        
        for (let i = 0; i < this.slotsData.length; i++) {
            let prev = this.previousBoardState[i];
            let curr = currentBoardState[i];
            
            if (curr && curr !== prev) {
                let t = this.tilesData[curr];
                actions.push(`Placed tile ${t.char}_${t.sub} in slot index ${i}`);
            } else if (!curr && prev) {
                let t = this.tilesData[prev];
                actions.push(`Removed tile ${t.char}_${t.sub} from slot index ${i}`);
            }
        }
        
        if (actions.length === 0) return false;
        
        this.turnHistory.push(`Turn ${this.turnCount}:\n  - ` + actions.join('\n  - '));
        this.turnCount++;
        this.previousBoardState = currentBoardState;
        return true;
    }
}
