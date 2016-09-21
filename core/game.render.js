// /core/game.render.js

/** Game Render Module
 * Called by the game loop, this module will
 * use the game state to re-render the canvas. 
 * Additionally, it will call all game entities `render` methods.
 */
function gameRender(scope) {

    // Setup globals
    var w = scope.constants.width,
        h = scope.constants.height,
        offset = scope.constants.offset;

    return function render() {
        // Clear out the canvas
        scope.context.clearRect(0, 0, w, h);
        scope.context.font = '26px Courier';

        // If game has been started draw bottom score board divider
        if (scope.state.start) {
            scope.context.strokeStyle = '#40d870';
            scope.context.beginPath();
            scope.context.moveTo(0, h - (offset - 5));
            scope.context.lineTo(w, h - (offset - 5));
            scope.context.lineWidth = 1;
            scope.context.stroke();
            scope.context.lineWidth = 1;
        }

        // If we want to show the FPS, then render it in the top right corner.
        if (scope.constants.showFps) {
            scope.context.fillStyle = '#ff0';
            scope.context.fillText(~~scope.loop.fps, w - 50, 30);
        }

        // If there are entities, iterate through them and call their `render` methods
        if (scope.state.hasOwnProperty('entities')) {
            var entities = scope.state.entities;
            // Loop through entities
            for (var entity in entities) {
                // Fire off each active entities `render` method
                entities[entity].render(scope);
            }
        }
    };
}

module.exports = gameRender;