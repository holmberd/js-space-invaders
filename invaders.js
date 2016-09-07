var invaders = (function() {
	var invaders = {};
	var NUM_OF_INVADERS = 3;
	var HORIZONTAL = 0;
	var VERTICAL = 1;
	var HORIZONTAL_VELOCITY = 1;
	var VERTICAL_VELOCITY = 1;
	var MAX_HORIZONTAL_VELOCITY = 5;
	var MAX_VERTICAL_VELOCITY = 1;
	invaders.velocity = new Vector(HORIZONTAL_VELOCITY, VERTICAL_VELOCITY);
	invaders.list = new List();

	var map = [new Vector(7,5),new Vector(8,5), new Vector(9,5)];
	var sprite = '#';

	invaders.init = function(map) {
		for (var n = 0; n < NUM_OF_INVADERS; n++) {
			var invader = new Entity(map[n], sprite);
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

		if (atEdge.call(this, grid, this.velocity)) { // invaders reached outer grid edge
			console.log('DEBUG: at edge');
			this.velocity.x *= -1; // negative => postive & postive => negative
			if (this.velocity.x > 0) { // increase invaders velocity
				this.velocity.x++;
			} else {
				this.velocity.x--;
			}
			updatePosition.call(this, this.velocity.x, this.velocity.y); // move invaders down one step
		} else {
			updatePosition.call(this, this.velocity.x); // move invaders one step
		}

		function updatePosition(horizontal, vertical) {
			var vector = new Vector(horizontal, vertical || 0);
			for (var invader = this.head; invader; invader = invader.next) { // FIX: replace for a list.map() / list.forEach() method
				invader.element.vector = invader.element.vector.plus(vector);
			}
		}

		function atEdge(grid, velocity) {
			var vector = null;
			for (var invader = this.head; invader; invader = invader.next) {
				vector = new Vector(invader.element.vector.x + velocity.x, invader.element.vector.y);
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