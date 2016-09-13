var LinkedList = require('./linked-list.js');

function Cell(char, state, location) {
	this.char = char;
	this.state = state;
	this.location = location || null;
}

function Location(x, y) {
	this.x = x;
	this.y = y;
}

function Cluster(cells) {
	this.cellList = new LinkedList();
	cells.forEach(function(cell) {
		this.cellList.append(cell);
	}, this);
}

Cluster.prototype.append = function(cell) {
	this.cellList.append(cell);
	return this;
};

Cluster.prototype.remove = function(cell) {
	return this.cellList.remove(cell);
};

Cluster.prototype.move = function(dir) {
	var head = this.cellList.getHead(),
		cell = null,
		x = null,
		y = null;

	for (var current = head; current; current = current.next) {
			cell = current.element;
			x = cell.location.x;
			y =	cell.location.y;
			cell.location = updateLocation();
		}

		function updateLocation() {
			if (dir === 'UP') {
				return new Location(x, y - 1);
			} else if (dir === 'RIGHT') {
				return new Location(x + 1, y);
			} else if (dir === 'DOWN') {
				return new Location(x, y + 1);
			} else if (dir === 'LEFT') {
				return (x - 1, y);
			}
		}
		return this;
};

Cluster.prototype.forEach = function(fn) {
	this.cellList.listToArray().forEach(function(element) {
		fn(element);
	}, this);
};