/** 
 * Score Module
 * Contains helper functions that keep track of game states:
 * if player has lost / won game.
 */

function gameScore(scope) {
	if (scope.state.win || scope.state.lost) {
    // Stops animation loop
		window.cancelAnimationFrame(scope.loop.stopLoop);
    // Reset game start state
		scope.state.start = false;
    // Get menu from `inactiveEntities`
		var menu = scope.state.inactiveEntities.menu;
		scope.state.entities = {};
    // Put menu in active entities
		scope.state.entities.menu = menu;
    // Re-start game loop
		scope.loop.main();
	}
	return; 
}

module.exports = gameScore;