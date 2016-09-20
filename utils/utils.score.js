// /utils/utils.score.js

function gameScore(scope) {
	if (scope.state.win || scope.state.lost) {
		window.cancelAnimationFrame(scope.loop.stopLoop);
		scope.state.start = false;
		var menu = scope.state.inactiveEntities.menu;
		scope.state.entities = {};
		scope.state.entities.menu = menu;
		scope.loop.main();
	}
	return; 
}

module.exports = gameScore;