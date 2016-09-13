function Cell(element, location) {
	this.element = element || null;
	this.location = location || null;
}

function Location(x, y) {
	this.x = x;
	this.y = y;
}

Location.prototype.add = function(other) {
	return new Location(this.x + other.x, this.y + other.y);
};

Location.prototype.isEqualTo = function(other) {
	return this.x === other.x && this.y === other.y;
};

function Grid(height, width) {
	var space = createSpace(height, width);
	this.space = space;
	this.height = height;
	this.width = width;

	function createSpace(height, width) {
		var _grid = new Array(height);
		for (var i = 0; i < height; i++) {
			_grid[i] = [];
			for (var n = 0; n < width; n++) {
				_grid[i][n] = null;
			}
		}
		return _grid;
	}
}

Grid.prototype.isInside = function(location) {
	if (location.y > (this.height - 1) || location.y < 0) return false;
    if (location.x > (this.width - 1) || location.x < 0) return false;
    return true;
};

Grid.prototype.set = function(location, cell) {
	cell.location = location;
	this.space[location.y][location.x] = cell;
};

Grid.prototype.get = function(location) {
	return this.space[location.y][location.x];
};

Grid.prototype.delete = function(location) {
	this.space[location.y][location.x] = null;
};

Grid.prototype.moveTo = function(newLocation, cell) {
		var currLocation = cell.location;
		this.set(newLocation, cell);
		this.delete(currLocation);
};

Grid.prototype.clear = function() {
	for (var y = 0; y < this.height; y++) {
		for (var x = 0; x < this.width; x++) {
			var location = new Location(x, y);
			this.delete(location);
		}
	}
	return true;
};

Grid.prototype.print = function() {

};
