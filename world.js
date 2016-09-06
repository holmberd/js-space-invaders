
function World(map, entities, canvas) {
	var grid = new Grid(map.grid.height, map.grid.width);
	this.grid = grid;
	this.entities = entities;
	this.init = function() {
		systems.input.init(canvas);
	};


}

World.prototype.gameLoop = function() {
	// Handle user input

	// Update each entity

	// Physics and rendering
};



