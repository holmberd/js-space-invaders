// /entities/invader.js

var Point = require('../utils/utils.math.js').Point;
var getRandomInt = require('../utils/utils.math.js').getRandomInt;
var Entity = require('./entity.js');

/** Invader Module
 * Contains main wrapper Invaders Object constructor,
 * Invader Object constructor and helper function for creating the invaders.
 *
 * Main Invaders Constructor holds all invaders and delegates its methods trough 
 * the Invader delegate Object, which in turn delegates 
 * its methods to the each invader entitie.
 */

function createInvaders(scope, map) {

	// Setup invader constants
	var INVADER_VELOCITY = 1,
	INVADERS_VELOCITY_STEP = 0.02,
	INVADER_HEALTH = 1,
	INVADER_SPRITE_HEIGHT = 18,
	INVADER_SPRITE_WIDTH = 18,
	INVADER_SPRITE_IMAGE = null,
	INVADER_GROUP_NAME = 'invader',
	NUM_OF_INVADERS =  60; // (5 rows * 12 cols)

	var invaderImages = [
		scope.sprites['invader-1'], 
		scope.sprites['invader-2'], 
		scope.sprites['invader-3'], 
		scope.sprites['invader-4'], 
		scope.sprites['invader-5']];

	var invaderSprite = {
		height: INVADER_SPRITE_HEIGHT,
		width: INVADER_SPRITE_WIDTH,
		image: INVADER_SPRITE_IMAGE
	};

	// Instantiate the wrapper for all our entities
	var invaders = new Entity('invaders');
	invaders.collides = false; // Delegate Object for our entites will not have a collision method
	invaders.before = null; // Helper property for time calc with tFrame
	invaders.velocityStep = INVADERS_VELOCITY_STEP; // Each invader's step to update each frame
	invaders.state.velocity = INVADER_VELOCITY; // Init velocity
	invaders.sprite = {
		height: INVADER_SPRITE_HEIGHT * 5, // 5 rows of invaders
		width: INVADER_SPRITE_WIDTH * 12, // 12 invaders in every row
		image: null
	};
	invaders.delegate = new Invaders(); // Instantiate our delegate object
	scope.state.entities[invaders.id] = invaders;

	// Instantiate the delegate object for invader entity
	var delegateObj = new Invader();

	// Instantiate all the invaders and set them as active entities in the game state
 	for (var i = 0, invader = {}; i < NUM_OF_INVADERS; i++) {
 		if (i <= 11) invaderSprite.image = invaderImages[0];
 		if (i > 11 && i <= 23) invaderSprite.image = invaderImages[1];
 		if (i > 23 && i <= 35) invaderSprite.image = invaderImages[2];
 		if (i > 35 && i <= 47) invaderSprite.image = invaderImages[3];
 		if (i > 47) invaderSprite.image = invaderImages[4];
 		invader = new Entity(INVADER_GROUP_NAME, new Point(map[i][0], map[i][1]), INVADER_VELOCITY, INVADER_HEALTH, invaderSprite);
 		invader.delegate = delegateObj;
 		scope.state.entities[invader.id] = invader;
 	}
 	return this;
 }

// Invader object constructor
// acts as the wrapper for our invader entities
function Invaders() {}

// Are left empty, they are handled on `Entity` level
Invaders.prototype.render = function () { return this; };
Invaders.prototype.collison = function () { return this; };

// Main update method for all our invaders
Invaders.prototype.update = function invadersUpdate (scope, tFrame) {
	var entities = scope.state.entities;
	var dimensionMarkers = {};
	var entityIdBuffer = [];
	var elapsed = 0;
	var MIN_MS_FIRE = 2000;

	// Get the current dimensions edge marker so that we can determine
	// when the invaders have reached an inner/outer edge.
	function getDimensions(arr) {
		var bottom = new Dimension(0, null);
		var right = new Dimension(0, null);
		var left = new Dimension(999999, null);

		function Dimension(num, id) {
			this.num = num;
			this.id = id;
			return this;
		}
		// Perform calc to determine dimensions
		for (var i = 0; i < arr.length; i++) {
			if (entities[arr[i]].state.position.y > bottom.num) {
				bottom.num = entities[arr[i]].state.position.y;
				bottom.id = arr[i];
			}
			if (entities[arr[i]].state.position.x > right.num) {
				right.num = entities[arr[i]].state.position.x;
				right.id = arr[i];
			}
			if (entities[arr[i]].state.position.x < left.num) {
				left.num = entities[arr[i]].state.position.x;
				left.id = arr[i];
			}
		}
		return { bottom: bottom.id, right: right.id, left: left.id };
	}

	// Update all invader entities in the vertical direction
	function moveAllVertical(arr) {
		arr.forEach(function (id) {
			entities[id].state.position.y += entities[id].sprite.height;
		}, this);
	}

	// Update all invader entities in the horizontal direction
	function moveAllHorizontal(arr) {
		arr.forEach(function (id) {
			entities[id].state.position.x += this.state.velocity;
		}, this);
	}

	// Fires a bullet from a random entity
	function fireRandomBullet() {
		var randomNum = getRandomInt(0, entityIdBuffer.length);
		var entity = entities[entityIdBuffer[randomNum]]; // returns a random entity constrained to our `entityIdBuffer`
		
		// Takes one of the inactive bullet entities from our array
		// and set its position to the random selected entity
    var bullet = scope.state.inactiveEntities.bullets.pop();
    bullet.state.velocity *= -1; // switch bullet direction
    bullet.pc = true;	// set bullet to `pc`
    bullet.state.position.x = entity.state.position.x + (entity.sprite.width / 2) - (bullet.sprite.width / 2); 
    bullet.state.position.y = entity.state.position.y;
    scope.state.entities[bullet.id] = bullet;  // Place bullet in our active state of entities
	}

	// Loop over all entites and store each entity's `id` in a buffer array
	// and check if any invader has reached the surface.
	for (var entity in entities) {
		if (entities[entity].group === 'invader') {
			// If invaders reaches the surface then player has lost the game
			if (entities[entity].state.position.y > scope.constants.height - scope.constants.offset - entities[entity].sprite.height) {
				game.state.lost = true;
			}
			entityIdBuffer.push(entities[entity].id);
		}
	}

	// If there are not invaders left and `player` hasn't already lost
	// then game is set to `win`, otherwise continue updating
	if (entityIdBuffer.length === 0 && !game.state.lost) {
		game.state.win = true;
	} else {

		if (!this.before) { // Init to keep track of elapsed time to restrict fire rate
			this.before = tFrame;
		} else {
			elapsed = tFrame - this.before; // Calc elapsed time
			if (elapsed > MIN_MS_FIRE) { // Delay and restrict rate of fire for invaders
				fireRandomBullet(entityIdBuffer);
				this.before = null; // Reset before prop so we can fire again
			}
		}

		dimensionMarkers = getDimensions(entityIdBuffer); // Calc and store our dimension markers

		if (this.state.velocity > 0) { // If velocity is a positive number -> invaders are moving right 
			entities[dimensionMarkers.right].state.position.x += this.state.velocity; // Increase position of the entity furthest right
			if (entities[dimensionMarkers.right].inBoundary(scope)) { // If that entity is still in game boundaries
				entities[dimensionMarkers.right].state.position.x -= this.state.velocity; // Restore entity position before updating all
				moveAllHorizontal.call(this, entityIdBuffer); // Move all entities position horizontally
			} else {
				entities[dimensionMarkers.right].state.position.x -= this.state.velocity; // Restore entity position
				this.state.velocity += this.velocityStep; // Increase velocity
				//MIN_MS_FIRE -= 100; 
				this.state.velocity *= -1; // Switch velocity direction, i.e. negative => postive & postive => negative
				moveAllVertical.call(this, entityIdBuffer); // Move all invaders down one row 
			}
		} else { // Else velocity is a negative number -> invaders are moving left
			entities[dimensionMarkers.left].state.position.x += this.state.velocity;
			if (entities[dimensionMarkers.left].inBoundary(scope)) {
				entities[dimensionMarkers.left].state.position.x -= this.state.velocity;
				moveAllHorizontal.call(this, entityIdBuffer);
			} else {
				entities[dimensionMarkers.left].state.position.x -= this.state.velocity;  
				this.state.velocity *= -1;
				this.state.velocity += this.velocityStep;
				moveAllVertical.call(this, entityIdBuffer);
			}
		}
	}
};

// Delegate state object constructor for our invaders,
// allows group entities to share render/update/collison functions over the delegate objects prototype chain. 
function Invader() {}

// Main render method for all invaders
Invader.prototype.render = function invaderRender (scope) {
	scope.context.drawImage(
		this.sprite.image,
		this.state.position.x,
		this.state.position.y, 
		this.sprite.width, 
		this.sprite.height);

    return this;
};

// Left empty, because it is handled by the global `invaders` update method
Invader.prototype.update = function invaderUpdate (scope) {
	return this;
};

// Main collision method for all invaders
Invader.prototype.collision = function invaderCollision (entity, scope) {
	if (entity.group === 'bullet' && !entity.pc) {
		this.kill();
		return this;
	} else if (entity.group === 'block') {
		entity.kill();
		return this;
	} 
	return this;
};

module.exports = createInvaders;