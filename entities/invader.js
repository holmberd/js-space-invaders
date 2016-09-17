// /entities/invader.js

var Point = require('../utils/utils.math.js');
var Entity = require('./entity.js');

/** Invader Module
 * Main invader module
 */

// Creates our invader entities and the wrapper entity
// that acts to delegate our prototype methods to all invaders.
function createInvaders(scope, map) {

	var INVADER_VELOCITY = 1,
	INVADERS_VELOCITY_STEP = 0.15,
	INVADER_HEALTH = 1,
	INVADER_SPRITE_HEIGHT = 15,
	INVADER_SPRITE_WIDTH = 15,
	INVADER_SPRITE_IMAGE = null,
	INVADER_GROUP_NAME = 'invader',
	NUM_OF_INVADERS =  60; // (5 * 12)

	var invaderSprite = {
		height: INVADER_SPRITE_HEIGHT,
		width: INVADER_SPRITE_WIDTH,
		image: INVADER_SPRITE_IMAGE
	};

	// Instantiate the wrapper for all our entities
	var invaders = new Entity('invaders');
	invaders.collides = false; // Wrapper for our entites will not have a collision method
	invaders.velocityStep = INVADERS_VELOCITY_STEP;
	invaders.state.velocity = INVADER_VELOCITY;
	invaders.sprite = {
		height: INVADER_SPRITE_HEIGHT * 5, // 5 rows of invaders
		width: INVADER_SPRITE_WIDTH * 12, // 12 invaders in every row
		image: null
	};
	invaders.delegate = new Invaders(); // Instantiate our delegate object for the wrapper
	scope.state.entities[invaders.id] = invaders;

	// Instantiate the delegate object for invader entity
	var delegateObj = new Invader();

	// Instantiate all the invaders and set them as active entities in the game state
 	for (var i = 0, invader = {}; i < NUM_OF_INVADERS; i++) {
 		invader = new Entity(INVADER_GROUP_NAME, new Point(map[i][0], map[i][1]), INVADER_VELOCITY, INVADER_HEALTH, invaderSprite);
 		invader.delegate = delegateObj;
 		scope.state.entities[invader.id] = invader;
 	}
 	return this;
 }

// Invader object constructor
// acts as the wrapper for our invader entities
function Invaders() {}

// Are left empty, they are handled on `entity` level
Invaders.prototype.render = function() { return this; };
Invaders.prototype.collison = function() { return this; };

// Main update method for all our invaders
Invaders.prototype.update = function invadersUpdate(scope, tFrame) {
	var entities = scope.state.entities;
	var dimensionMarkers = {};
	var entityIdBuffer = [];

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
		arr.forEach(function(id) {
			entities[id].state.position.y += entities[id].sprite.height;
		}, this);
	}

	// Update all invader entities in the horizontal direction
	function moveAllHorizontal(arr) {
		arr.forEach(function(id) {
			entities[id].state.position.x += this.state.velocity;
		}, this);
	}

	// Loop over all entites and store each entity's `id` in a buffer array
	for (var entity in entities) {
		if (entities[entity].group === 'invader') {
			entityIdBuffer.push(entities[entity].id);
		}
	}

	dimensionMarkers = getDimensions(entityIdBuffer); // calc and store our dimension markers

	if (this.state.velocity > 0) { // if velocity is a positive number -> invaders are moving right 
		entities[dimensionMarkers.right].state.position.x += this.state.velocity; // increase position of the entity furthest right
		if (entities[dimensionMarkers.right].inBoundary(scope)) { // if that entity is still in game boundaries
			entities[dimensionMarkers.right].state.position.x -= this.state.velocity; // restore entity position before updating all
			moveAllHorizontal.call(this, entityIdBuffer); // move all entities position horizontally
		} else {
			entities[dimensionMarkers.right].state.position.x -= this.state.velocity; // restore entity position
			this.state.velocity += this.velocityStep; // increase velocity 
			this.state.velocity *= -1; // switch velocity direction, i.e. negative => postive & postive => negative
			moveAllVertical.call(this, entityIdBuffer); // move all invaders down one row 
		}
	} else { // else velocity is a negative number -> invaders are moving left
		entities[dimensionMarkers.left].state.position.x -= this.state.velocity;
		if (entities[dimensionMarkers.left].inBoundary(scope)) {
			entities[dimensionMarkers.left].state.position.x += this.state.velocity;
			moveAllHorizontal.call(this, entityIdBuffer);
		} else {
			entities[dimensionMarkers.left].state.position.x += this.state.velocity;
			this.state.velocity -= this.velocityStep;  
			this.state.velocity *= -1;
			moveAllVertical.call(this, entityIdBuffer);
		}
	}

};

 // delegate state object constructor for our invaders,
// allows group entities to share render/update/collison functions
// over the delegate objects prototype chain. 
function Invader() {}

Invader.prototype.render = function invaderRender(scope){
	scope.context.fillStyle = '#40d870';
    scope.context.fillRect(
        this.state.position.x,
        this.state.position.y,
        this.sprite.width, this.sprite.height
    );
    return this;
};

// Left empty, because it is handled by our global update wrapper
Invader.prototype.update = function invaderUpdate(scope) {
	return this;
};

Invader.prototype.collision = function invaderCollision(bullet) {
	// doesn't matter which bullet it has collided with, result is the same
	console.log('Event: Invader has collided with a bullet');
	this.kill();
	return this;
};

module.exports = createInvaders;