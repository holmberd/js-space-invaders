var invaders = (function() {
	var invaders = {};
	var NUM_OF_INVADERS = 50;
	var HORIZONTAL = 0;
	var VERTICAL = 1;
	var HORIZONTAL_VELOCITY = 1;
	var VERTICAL_VELOCITY = 1;
	var MAX_HORIZONTAL_VELOCITY = 5;
	var MAX_VERTICAL_VELOCITY = 1;
	invaders.velocity = [HORIZONTAL_VELOCITY, VERTICAL_VELOCITY];
	invaders.list = new List();

	invaders.init = function() {
		for (var n = 0; n < NUM_OF_INVADERS; n++) {
			var invader = new Entity();
			invader.addComponent(new Components.Group('01'));
			invader.addComponent(new Components.Health(1));
			invader.addComponent(new Components.Collision());
			invader.addComponent(new Components.Visible());
			invaders.list.append(invader);
		}
		invaders.head = this.list.getHead();
	};

	invaders.update = function(grid) {

		function fireBullet() {

		}

		if (atEdge(grid, this.list, this.velocity)) { // invaders reached outer grid edge
			this.velocity[HORIZONTAL] *= -1; // negative => postive & postive => negative
			if (this.velocity[HORIZONTAL] > 0) { // increase invaders velocity
				this.velocity[HORIZONTAL]++;
			} else {
				this.velocity[HORIZONTAL]--;
			}
			updatePosition(this.velocity[HORIZONTAL], this.velocity[VERTICAL]); // move invaders down one step
		} else {
			updatePosition(this.velocity[HORIZONTAL]); // move invaders one step
		}

		function updatePosition(horizontal, vertical) {
			var vector = new Vector(horizontal, vertical || 0);
			for (var invader = this.head; invader; invader = invader.next) { // FIX: replace for a list.map() / list.forEach() method
				invader.vector.plus(vector);
			}
		}

		function atEdge(grid, invaders, velocity) {
			var vector = null;
			for (var invader = this.head; invader; invader = invader.next) {
				vector = new Vector(invader.vector.x + velocity, invader.vector.y);
				if (!grid.isInside(vector)) {
					return true;
				}
			}
			return false;
		}

		return this;
	};

	return invaders;
})();