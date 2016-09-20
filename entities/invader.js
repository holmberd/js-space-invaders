// /entities/invader.js

var Point = require('../utils/utils.math.js');
var Entity = require('./entity.js');

/** Invader Module
 * Main invader module creates our invader entities and the wrapper entity
 * that acts to delegate our prototype methods to all invaders.
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

	// Instantiate the wrapper for all our entities
	var invaders = new Entity('invaders');
	invaders.collides = false; // wrapper for our entites will not have a collision method
	invaders.before = null; // helper property for time calc with tFrame
	invaders.velocityStep = INVADERS_VELOCITY_STEP; // each invader's step to update each frame
	invaders.state.velocity = INVADER_VELOCITY; // init velocity
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

	function fireRandomBullet() {		
		// Returns a random number between min (inclusive) and max (exclusive)
		function getRandomInt(min, max) {
  			min = Math.ceil(min);
  			max = Math.floor(max);
  			return Math.floor(Math.random() * (max - min)) + min;
		}
		var randomNum = getRandomInt(0, entityIdBuffer.length);
		var entity = entities[entityIdBuffer[randomNum]]; // returns a random entity from our buffer id array
		
		// Takes one of the inactive bullet entities from our array
		// and set its position to the random selected entity
        var bullet = scope.state.inactiveEntities.bullets.splice(0,1)[0];
        bullet.state.velocity *= -1; // switch bullet direction
        bullet.pc = true;	// set bullet to `pc`
        bullet.state.position.x = entity.state.position.x + (entity.sprite.width / 2) - (bullet.sprite.width / 2); 
        bullet.state.position.y = entity.state.position.y;
        scope.state.entities[bullet.id] = bullet;  // Place bullet in our active state of entities
	}

	// Loop over all entites and store each entity's `id` in a buffer array
	for (var entity in entities) {
		if (entities[entity].group === 'invader') {
			entityIdBuffer.push(entities[entity].id);
		}
	}

	// If there are not invaders left and `player` hasn't alredy lost
	// then game is set to `win`, otherwise continue updating
	if (entityIdBuffer.length === 0 && !game.state.lost) {
		game.state.win = true;
	} else {
		if (!this.before) { // init to keep track of elapsed time to restrict fire rate
			this.before = tFrame;
		} else {
			elapsed = tFrame - this.before; // calc elapsed time
			if (elapsed > MIN_MS_FIRE) { // delay and restrict rate of fire for invaders
				fireRandomBullet(entityIdBuffer);
				this.before = null; // reset before prop so we can fire again
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
				/*
				entityIdBuffer.forEach(function(id) { // update entities position to fill out last marginal to boundary edge
					entities[id].state.position.x += scope.constants.width - (entities[dimensionMarkers.right].state.position.x + entities[id].sprite.width);
				}, this);*/
				this.state.velocity += this.velocityStep; // increase velocity
				//MIN_MS_FIRE -= 100; 
				this.state.velocity *= -1; // switch velocity direction, i.e. negative => postive & postive => negative
				moveAllVertical.call(this, entityIdBuffer); // move all invaders down one row 
			}
		} else { // else velocity is a negative number -> invaders are moving left
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

Invader.prototype.render = function invaderRender(scope) {
	scope.context.drawImage(
		scope.img,
		this.state.position.x,
		this.state.position.y, 14, 14);
	/*
	scope.context.fillStyle = '#40d870';
    scope.context.fillRect(
        this.state.position.x,
        this.state.position.y,
        this.sprite.width, this.sprite.height
    );*/
    return this;
};

// Left empty, because it is handled by our global update wrapper
Invader.prototype.update = function invaderUpdate(scope) {
	return this;
};

Invader.prototype.collision = function invaderCollision(entity, scope) {

	if (entity.group === 'bullet' && !entity.pc) {
		console.log('Event: Invader has collided with a bullet');
		this.kill();
		return this;
	} else if (entity.group === 'block') {
		entity.kill();
		return this;
	} 
	return this;
};

module.exports = createInvaders;