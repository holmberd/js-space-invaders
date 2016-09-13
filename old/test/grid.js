/**

JSON prototype data delegation

{
  "name": "goblin grunt",
  "minHealth": 20,
  "maxHealth": 30,
  "resists": ["cold", "poison"],
  "weaknesses": ["fire", "light"]
}

{
  "name": "goblin wizard",
  "prototype": "goblin grunt",
  "spells": ["fire ball", "lightning bolt"]
}

{
  "name": "goblin archer",
  "prototype": "goblin grunt",
  "attacks": ["short bow"]
}

*/

/************************************************************************/


function Grid(height, width) {
	var _cells = new Array(width * height);
	this.cells = _cells;
	this.height = height;
	this.width = width;
}

Grid.prototype.isInside = function(vector) {
	if (vector.y > (this.height - 1) || vector.y < 0) return false;
    if (vector.x > (this.width - 1) || vector.x < 0) return false;
    return true;
};

Grid.prototype.setCell = function(vector, value) {
	this.cells[vector.x + this.width * vector.y] = value;
};

Grid.prototype.getCell = function(vector) {
	return this.cells[vector.x + this.width * vector.y];
};

Grid.prototype.removeCell = function(vector) {
	this.cells[vector.x + this.width * vector.y] = null;
};

Grid.prototype.moveCell = function(current, next) {
	this.setCell(next, this.get(current));
	this.removeCell(current);
};

Grid.prototype.clearCells = function() {
	var vector = null;
	for (var i = 0; i < this.cells.length; i++) {
			vector = new vector(x, y);
			this.removeCell(vector);
		}
};

Grid.prototype.toString = function() {
	var string = '';
	var cellBuffer = null;
	for (var y = 0; y < this.height; y++) {
		for (var x = 0; x < this.width; x++) {
			cellBuffer = this.getCell(new Vector(x, y)); 
			if (cellBuffer) {
				string += ' ' + cellBuffer + ' ';
			}
			else {
				string += ' . ';
			}
		}
		string += '\n';
	}
	return string;
};

Grid.prototype.print = function() {
	var output = this.toString();
	console.log(output);
};
