var entitiesConfig = {
	block: {
		sprite: '#',
		hp: 1,
		speed: 0
	},
	invader: {
		sprite: '/-o-\\',
		hp: 1,
		speed: 1
	},
	spaceShip: {
		sprite: '<ooo>',
		hp: 1,
		speed: 1,
	},
	player: {
		sprite: '/-^-\\',
		hp: 3,
		speed: 1,
	}
};

function Cell(str, location) {
	this.str = str;
	this.location = location || null;
}

function Location(x, y) {
	this.x = x;
	this.y = y;
}

function Entity(state, hp, speed, cell) {
	this.killed = state;
	this.hp = hp;
	this.speed = speed;
	this.cell = cell;
}

Entity.prototype.set = function(location) {
	this.cell.location = location;
};

Entity.prototype.kill = function() {
	this.killed = true;
};

Entity.prototype.update = function() {

};

Entity.prototype.move = function(dir) {
	var currLocation = this.cell.location;
	this.cell.location = updateLocation();

	function updateLocation() {
		if (dir === 'UP') {
			return new Location(currLocation.x, currLocation.y - 1);
		} else if (dir === 'RIGHT') {
			return new Location(currLocation.x + 1, currLocation.y);
		} else if (dir === 'DOWN') {
			return new Location(currLocation.x, currLocation.y + 1);
		} else if (dir === 'LEFT') {
			return new Location(currLocation.x - 1, currLocation.y);
		}
	}
};

var invader = new Entity(true, entitiesConfig.invader.hp, entitiesConfig.invader.speed, new Cell(entitiesConfig.invader.sprite));
invader.set({x:2, y:2});

