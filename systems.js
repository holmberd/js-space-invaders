var systems = {};

systems.input = {
	inputHandler: {
		_pressed: {},
		RIGHT: 39,
		LEFT: 37,
		SPACE: 32,

		isDown: function(keyCode) {
			return this._pressed[keyCode];
		},
		onKeydown: function(event) {
			this._pressed[event.keyCode] = true;
		},
		onKeyup: function(event) {
			delete this._pressed[event.keyCode];
		}
	},
	init: function(canvas) {
		window.addEventListener('keyup', function(event) { event.preventDefault(); systems.input.inputHandler.onKeyup(event); }, false);
		window.addEventListener('keydown', function(event) { event.preventDefault(); systems.input.inputHandler.onKeydown(event); }, false);
	}
 };

 systems.render = {
 	init: function(canvas, grid) {
		makeBoard(canvas, grid);

		function makeBoard(table, grid) {
		    var height = grid.height,
		    	width = grid.width,
		    	tableRow = null,
		    	tableCell = null,
		    	vector = null;
		    for (var row = 0; row < height; row++) {
		    	tableRow = table.insertRow(row);
		    	for (var col = 0; col < width; col++) {
		    		tableCell = tableRow.insertCell(col);
		    		tableCell.id = 'cell' + String(row) + String(col);
		    		vector = new Vector(col, row);
		    		grid.setCell(vector, tableCell);
		    	}
		    }
		}
	},
	renderCanvas: function(entities, grid) {
		clearCanvas();

		drawCanvas(entities.player);

		function drawCanvas(entity) {
			entity.vector.forEach(function(v) {
				grid.getCell(v).style.backgroundColor = 'blue';
			}, this);
		}

		function clearCanvas() {
			grid.forEach(function(cell) {
				cell.style.backgroundColor = '#fff';
			});
		}
	}
};

systems.collision = function(entities) {

};

systems.spawn = function() {

};

systems.destroy = function() {

};

systems.gameScore = function() {

};