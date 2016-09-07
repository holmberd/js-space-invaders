var player = (function() {
	var VELOCITY = 1;
	var LIFES = 3;
	var HEALTH = 1;
	var SPRITE = '=';

	var player = {};
	player = new Entity();

	player.init = function(map) {
		this.addComponent(new Components.PlayerControlled());
		this.addComponent(new Components.Lives(VELOCITY));
		this.addComponent(new Components.Health(LIFES));
		this.addComponent(new Components.Collision());
		this.addComponent(new Components.Visible());
		this.velocity = VELOCITY;
		this.vector = [];
		this.sprite = SPRITE;
		map.player.forEach(function(point) {
			this.vector.push(new Vector(point[1], point[0]));
		}, this);
	};

	player._state = {};
	player._states = {
		moveLeft: function() {
			this.enter = function() {
				if (player._states.isInside(player.vector)) {
						player.vector.forEach(function(v) {
							v.x -= player.velocity;
						}); 
					return true;
				}
				return false;
			};
		},
		moveRight: function(grid) {
			this.enter = function() {
				if (player._states.isInside(player.vector)) {
						player.vector.forEach(function(v) {
							v.x += player.velocity;
						}); 
					return true;
				}
				return false;
			};
		},
		shoot: function() {
			this.enter = function() {

			};
		},
		isInside: function(vector) {
			var v = null;
			for (var i = 0; i < vector.length; i++) {
				v = new Vector(vector[i].x - player.velocity, vector[i].y);
				if (!grid.isInside(v)) {
					return false;
				}
			}
			return true;
		}
	};

	player.handleInput = function(input) {
		if (input.isDown(input.LEFT)) {
			return new this._states.moveLeft();
		} else if (input.isDown(input.RIGHT)) {
			return new this._states.moveRight();
		} else if (input.isDown(input.SPACE)) {

		} return null;
		};

	player.update = function(input) {
		var state = this.handleInput(input);
		if (state) {
			_state = state;
			_state.enter();
			return this;
		}
	};

	return player;

})();

//player.init(map);
//var a = new player._states.moveLeft(grid);
