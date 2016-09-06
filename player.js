var player = (function() {

	var player = new Entity();
	player.addComponent(new Components.PlayerControlled());
	player.addComponent(new Components.Lifes(3));
	player.addComponent(new Components.Health(1));
	player.addComponent(new Components.Collision());
	player.addComponent(new Components.Velocity(5));
	player.addComponent(new Components.Visible());

	player._state = {};
	player._states = {
		moveLeft: function() {
			this.enter = function() {
				var vector = new Vector(this.vector.x - this.components.velocity, this.vector.y);
				if (grid.isInside(vector)) {
					this.vector.x -= this.components.velocity;
					return true;
				}
				return false;
			};
		},
		moveRight: function() {
			this.enter = function() {
				var vector = new Vector(this.vector.x + this.components.velocity, this.vector.y);
				if (grid.isInside(vector)) {
					this.vector.x += this.components.velocity;
					return true;
				}
				return false;
			};
		},
		shoot: function() {
			this.enter = function() {

			};
		}
	};

	player.handleInput = function(input) {
		if (input.isDown(input.LEFT)) {
			return new _states.moveLeft();
		} else if (input.isDown(input.RIGHT)) {
			return new _states.moveRight();
		} else if (input.isDown(input.SPACE)) {

		} return null;
		};

	player.update = function(input, grid) {
		var state = this.handleInput(input);
		if (state) {
			_state = state;
			_state.enter();
			return this;
		}
	};

	return player;

})();
