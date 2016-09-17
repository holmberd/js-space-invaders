// /entities/invader.js

var Point = require('../utils/utils.math.js');
var Entity = require('./entity.js');

/** Invader Module
 * Main invader module
 */

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

	var invaders = new Entity('invaders');
	invaders.collides = false; // Wrapper for our entites will not have a collision method
	invaders.velocityStep = INVADERS_VELOCITY_STEP;
	invaders.state.velocity = INVADER_VELOCITY;
	invaders.sprite = {
		height: INVADER_SPRITE_HEIGHT * 5, // 5 rows of invaders
		width: INVADER_SPRITE_WIDTH * 12, // 12 invaders in every row
		image: null
	};
	invaders.delegate = new Invaders();
	scope.state.entities[invaders.id] = invaders;

	// Instantiate the delegate object (it is basicly a pointer to a prototype chain of methods)
	var delegateObj = new Invader();

	// Instantiate all the invaders and set them as active entities in the game state
 	for (var i = 0, invader = {}; i < NUM_OF_INVADERS; i++) {
 		invader = new Entity(INVADER_GROUP_NAME, new Point(map[i][0], map[i][1]), INVADER_VELOCITY, INVADER_HEALTH, invaderSprite);
 		invader.delegate = delegateObj;
 		scope.state.entities[invader.id] = invader;
 	}
 	return this;
 }

function Invaders() {}

Invaders.prototype.render = function() { return this; };
Invaders.prototype.collison = function() { return this; };

Invaders.prototype.update = function invadersUpdate(scope, tFrame) {
	var entities = scope.state.entities;
	var dimensionMarkers = {};
	var entityBuffer = [];
	var entityIdBuffer = [];


	function getInvadersDimensions(arr) {
		var bottom = new Dimension(0, null);
		var right = new Dimension(0, null);
		var left = new Dimension(999999, null);
		//var velocityStep = this.sprite.invaderWidth;

		function Dimension(num, id) {
			this.num = num;
			this.id = id;
			return this;
		}

		for (var i = 0; i < arr.length; i++) {
			if (arr[i].state.position.y > bottom.num) {
				bottom.num = arr[i].state.position.y;
				bottom.id = arr[i].id;
			}
			if (arr[i].state.position.x > right.num) {
				right.num = arr[i].state.position.x;
				right.id = arr[i].id;
			}
			if (arr[i].state.position.x < left.num) {
				left.num = arr[i].state.position.x;
				left.id = arr[i].id;
			}
		}
		return { bottom: bottom.id, right: right.id, left: left.id };
	}

	function moveAllVertical(arr) {
		arr.forEach(function(id) {
			entities[id].state.position.y += entities[id].sprite.height;
		}, this);
	}

	function moveAllHorizontal(arr) {
		arr.forEach(function(id) {
			entities[id].state.position.x += this.state.velocity;
		}, this);
	}

	for (var entity in entities) {
		if (entities[entity].group === 'invader') {
			entityBuffer.push(entities[entity]);
			entityIdBuffer.push(entities[entity].id);
		}
	}

	dimensionMarkers = getInvadersDimensions(entityBuffer);

	if (this.state.velocity > 0) {
		entities[dimensionMarkers.right].state.position.x += this.state.velocity;
		if (entities[dimensionMarkers.right].inBoundary(scope)) {
			entities[dimensionMarkers.right].state.position.x -= this.state.velocity;
			moveAllHorizontal.call(this, entityIdBuffer);
		} else {
			entities[dimensionMarkers.right].state.position.x -= this.state.velocity;
			this.state.velocity += this.velocityStep; // increase velocity 
			this.state.velocity *= -1; // switch velocity direction, i.e. negative => postive & postive => negative
			moveAllVertical.call(this, entityIdBuffer); // move all invaders down one row 
		}
	} else {
		entities[dimensionMarkers.left].state.position.x -= this.state.velocity;
		if (entities[dimensionMarkers.left].inBoundary(scope)) {
			entities[dimensionMarkers.left].state.position.x += this.state.velocity;
			moveAllHorizontal.call(this, entityIdBuffer);
		} else {
			entities[dimensionMarkers.left].state.position.x += this.state.velocity;
			this.state.velocity -= this.velocityStep; // increase velocity 
			this.state.velocity *= -1; // switch velocity direction, i.e. negative => postive & postive => negative
			moveAllVertical.call(this, entityIdBuffer); // move all invaders down one row 
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