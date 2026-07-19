// Entry point for the application.
// Connects Model, View, and Controller together.

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize State (Model)
    const state = new GameState();
    
    // 2. Initialize Views
    const boardRenderer = new BoardRenderer(state);
    const uiRenderer = new UIRenderer(state);
    const latexRenderer = new LaTeXRenderer(state);
    
    // 3. Initialize Controllers
    const dragDropController = new DragDropController(state);
    const gameController = new GameController(state, boardRenderer, uiRenderer, latexRenderer, dragDropController);
    
    // 4. Start Game
    gameController.generateIncomparable();
});
