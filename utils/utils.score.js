// /utils/utils.score.js

/** Score Module
 * Contains function that keep track on game states
 * if player has lost / won game.
 */

function gameScore(scope) {
	if (scope.state.win || scope.state.lost) {
		window.cancelAnimationFrame(scope.loop.stopLoop); // Stops animation loop
		scope.state.start = false; // Reset game start state
		var menu = scope.state.inactiveEntities.menu; // Get menu from `inactiveEntities`
		scope.state.entities = {};
		scope.state.entities.menu = menu; // Put menu in active entities
		scope.loop.main(); // Re-start game loop
	}
	return; 
}

module.exports = gameScore;