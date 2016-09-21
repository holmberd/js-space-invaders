// /entities/blocks.js

var Point = require('../utils/utils.math.js');
var Entity = require('./entity.js');

/** Block Module
 * Contains the delegate block class
 * and the helper function for creating the blocks.
 */

// Create our blocks
function createBlocks(scope, map) {

	// Setup block constants
	var VELOCITY = 0,
	HEALTH = 1,
	SPRITE_HEIGHT = 15,
	SPRITE_WIDTH = 15,
	SPRITE_IMAGE = null,
	GROUP_NAME = 'block',
	NUM_OF_BLOCKS = 24;

	var sprite = {
		height: SPRITE_HEIGHT,
		width: SPRITE_WIDTH,
		image: SPRITE_IMAGE
	};

	// Instantiate the delegate object (it is basicly a pointer to a prototype chain of methods)
	var delegateObj = new Block();

	// Creates all the blocks and their delegate methods
 	for (var i = 0, block = {}; i < NUM_OF_BLOCKS; i++) {
 		block = new Entity(GROUP_NAME, new Point(map[i][0], map[i][1]), VELOCITY, HEALTH, sprite);
 		block.delegate = delegateObj;
 		scope.state.entities[block.id] = block;
 	}
 }

// Delegate state object constructor for our blocks,
// allows group entities to share render / update / collison methods
// over the delegate objects prototype chain. 
function Block() {}

// Block render method
Block.prototype.render = function blockRender(scope){
	scope.context.drawImage(
		scope.sprites.block, 
		this.state.position.x, 
		this.state.position.y, 
		this.sprite.width,
		this.sprite.height);

    return this;
};

// Block update method
Block.prototype.update = function blockUpdate(scope) {
	return this;
};

// Block collision method
Block.prototype.collision = function blockCollision(entity) {
	// Doesn't matter which bullet it has collided with, result is the same
	if (entity.group === 'bullet') {
		this.kill();
	}
	return this;
};

module.exports = createBlocks;