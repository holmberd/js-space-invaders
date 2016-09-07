var player = (function() {
	var VELOCITY = 5;
	var LIFES = 3;
	var HEALTH = 1;

	var player = {};

	player.init = function(map) {
		player = new Entity();
		player.addComponent(new Components.PlayerControlled());
		player.addComponent(new Components.Lifes(VELOCITY));
		player.addComponent(new Components.Health(LIFES));
		player.addComponent(new Components.Collision());
		player.addComponent(new Components.Visible());
		player.velocity = VELOCITY;
	};

	player._state = {};
	player._states = {
		moveLeft: function(grid) {
			this.enter = function(grid) {
				var vector = new Vector(this.vector.x - this.velocity, this.vector.y);
				if (this.isInside(grid, vector)) {
					for (var v in this.vector) {
						v.x -= this.velocity;
					} 
					return true;
				}
				return false;
			};
		},
		moveRight: function(grid) {
			this.enter = function(grid) {
				var vector = new Vector(this.vector.x + this.velocity, this.vector.y);
				if (this.isInside(grid, vector)) {
					for (var v in this.vector) {
						v.x += this.velocity;
					}
					return true;
				}
				return false;
			};
		},
		shoot: function() {
			this.enter = function() {

			};
		},
		isInside: function(grid, vector) {
			for (var i = 0; i < vector.length; i++) {
				if (!grid.isInside(vector[i])) {
					return false;
				}
			}
			return true;
		}
	};

	player.handleInput = function(input, grid) {
		if (input.isDown(input.LEFT)) {
			return new _states.moveLeft(grid);
		} else if (input.isDown(input.RIGHT)) {
			return new _states.moveRight(grid);
		} else if (input.isDown(input.SPACE)) {

		} return null;
		};

	player.update = function(input, grid) {
		var state = this.handleInput(input, grid);
		if (state) {
			_state = state;
			_state.enter();
			return this;
		}
	};

	return player;

})();
