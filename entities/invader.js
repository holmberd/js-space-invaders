// /entities/invader.js

var Point = require('../utils/utils.math.js');
var Entity = require('./entity.js');

/** Invader Module
 * Main invader module
 */

function createInvaders(scope, map) {

	var VELOCITY = 1,
	HEALTH = 1,
	SPRITE_HEIGHT = 15,
	SPRITE_WIDTH = 15,
	SPRITE_IMAGE = null,
	GROUP_NAME = 'invader',
	NUM_OF_INVADERS =  60; // (5 * 12)

	var sprite = {
		height: SPRITE_HEIGHT,
		width: SPRITE_WIDTH,
		image: SPRITE_IMAGE
	};


	// Instantiate the delegate object (it is basicly a pointer to a prototype chain of methods)
	var delegateObj = new Invader();

	// Instantiate all the invaders and set them as active entities in the game state
 	for (var i = 0, invader = {}; i < NUM_OF_BLOCKS; i++) {
 		invader = new Entity(GROUP_NAME, new Point(map[i][1], map[i][0]), VELOCITY, HEALTH, sprite);
 		invader.delegate = delegateObj;
 		scope.state.entities[invader.id] = invader;
 	}
 }

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

Invader.prototype.atEdge = function invadersAtEdge(scope) {
	var entities = scope.state.entities;
	var point = {};
	
};

Invader.prototype.update = function invaderUpdate(scope) {
	var point = {};
	//this.velocity.x *= -1; // negative => postive & postive => negative
	//var point = new Point(this.state.position.x + 1)
	if (this.state.velocity > 0) {
		point = new Point(++this.state.position.x, this.state.position.y);
	} else {
		point = new Point(--this.state.position.x, this.state.position.y);
	}
};

Invader.prototype.collision = function invaderCollision(bullet) {
	// doesn't matter which bullet it has collided with, result is the same
	console.log('Event: Invader has collided with a bullet');
	this.kill();
	return this;
};

module.exports = createInvaders;