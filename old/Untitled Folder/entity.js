function Cell(str, location) {
	this.str = str;
	this.location = location || null;
}

function Location(x, y) {
	this.x = x;
	this.y = y;
}

var entitiesConfig = {
	block: {
		sprite: '#',
		hp: 1,
		speed: 0,
		count: 76
	},
	invader: {
		sprite: '/-o-\\',
		hp: 1,
		speed: 1,
		count: 3
	},
	saucer: {
		sprite: '<ooo>',
		hp: 1,
		speed: 1,
		count: 1
	},
	ship: {
		sprite: '/-^-\\',
		hp: 3,
		speed: 1,
		count: 1
	},
	shipBullet: {
		sprite: '!',
		hp: 1,
		speed: 3,
		count: 1
	},
	invaderBullet: {
		sprite: ':',
		hp: 1,
		speed: 1,
		count: 1
	}
};

function createAllEntities(entitiesConfig) {
	var entities = {};
	Object.keys(entitiesConfig).forEach(function(entityName) {
		entities[entityName] = [];
		factory(entityName);
	}, this);
	function factory(entityName) {
		for (var i = 0; i < entitiesConfig[entityName].count; i++) {
			entities[entityName].push(createEntity(entityName, entitiesConfig));
		}
	}
	return entities;
}

function createEntity(entityName, entitiesConfig) {
	return new Entity(false, entitiesConfig[entityName].hp, entitiesConfig[entityName].speed, entitiesConfig[entityName].sprite);
}


function Entity(state, hp, speed, sprite) {
	this.killed = state;
	this.sprite = sprite;
	this.hp = hp;
	this.speed = speed;
}

Entity.prototype.spawn = function(location, grid) {
	this.cell = new Cell(sprite);
	this.set(location);
	grid.set(location, this.cell);
};

Entity.prototype.set = function(location) {
	this.cell.location = location;
};

Entity.prototype.kill = function() {
	this.killed = true;
};

Entity.prototype.update = function(grid) {
	grid.moveTo(this.cell.location, this.cell);
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

/*
var invader = new Entity(true, entitiesConfig.invader.hp, entitiesConfig.invader.speed, new Cell(entitiesConfig.invader.sprite));
invader.set({x:2, y:2});
*/

