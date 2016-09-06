var invaders = (function() {
	var invaders = {};
	var HORIZONTAL = 0;
	var VERTICAL = 1;
	var HORIZONTAL_VELOCITY = 1;
	var VERTICAL_VELOCITY = 1;
	var MAX_HORIZONTAL_VELOCITY = 5;
	var MAX_VERTICAL_VELOCITY = 1;

	invaders.velocity = [HORIZONTAL_VELOCITY, VERTICAL_VELOCITY];
	invaders.entities = [];
	for (var i = 0; i < 50; i++) {
		invaders.entities[i] = new Entity();
		invaders.entities[i].addComponent(new Components.Group('01'));
		invaders.entities[i].addComponent(new Components.Health(1));
		invaders.entities[i].addComponent(new Components.Collision());
		invaders.entities[i].addComponent(new Components.Visible());
	}

	invaders.update = function(grid) {

		if (atEdge(grid, this.invaders.entities, this.invaders.velocity)) {
			this.invaders.velocity[HORIZONTAL] *= -1; //negative => postive & postive => negative
			if (this.invaders.velocity[HORIZONTAL] > 0) {
				this.invaders.velocity[HORIZONTAL]++;
			} else {
				this.invaders.velocity[HORIZONTAL]--;
			}
			updatePosition(this.invaders.velocity[HORIZONTAL], this.invaders.velocity[VERTICAL]);
		} else {
			updatePosition(this.invaders.velocity[HORIZONTAL]);
		}

		/*
		if (atEdge && this.invaders.velocity[HORIZONTAL] > 0) {
			this.invaders.velocity[HORIZONTAL] = -this.invaders.velocity[HORIZONTAL];
			updateVerticalPosition(this.invaders.velocity[HORIZONTAL], this.invaders.velocity[VERTICAL]);
		} else if (atEdge && this.invaders.velocity[HORIZONTAL] < 0) {
			this.invaders.velocity[HORIZONTAL] = INVADER__VERTICAL_VELOCITY;
			updateVerticalPosition(this.invaders.velocity[HORIZONTAL], this.invaders.velocity[VERTICAL]);
		} else {
			updatePosition(this.invaders.velocity[HORIZONTAL]);
		}
		*/

		function updatePosition(horizontal, vertical) {
			var vector = new Vector(horizontal, vertical || 0);
			for (var invader in this.invaders.entities) {
				invader.vector.plus(vector);
				//invader.vector.x += horizontal;
				//invader.vector.y += vertical || 0;
			}
		}

		function atEdge(grid, invaders, velocity) {
			var vector = null;
			for (var invader in invaders) {
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