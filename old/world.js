function World(map, entities) {
	var grid = new Grid(map.grid.height, map.grid.width);
	this.grid = grid;
	this.entities = entities;
	this.init = function(map, canvas) {
		entities.player.init(map);
		entities.invaders.init(map);
		//entities.bullets.init();
		systems.render.init(canvas, this.grid);
		systems.input.init(canvas);
	};
}







