// /js/entities/blocks.js

var Point = require('../utils/utils.math.js');
var Entity = require('./entity.js');

/** Block Module
 * Main block module
 */

function createBlocks(scope, map) {

	var VELOCITY = 0,
	HEALTH = 1,
	SPRITE_HEIGHT = 15,
	SPRITE_WIDTH = 15,
	SPRITE_IMAGE = null,
	GROUP_NAME = 'block';

	var sprite = {
		height: SPRITE_HEIGHT,
		width: SPRITE_WIDTH,
		image: SPRITE_IMAGE
	};

 	var NUM_OF_BLOCKS = 24; //24,

	// instantiate the delegate object (it is basicly a pointer to a prototype chain of methods)
	var delegateObj = new Block();

	// set up all the blocks and handle them in the block object
 	for (var i = 0, block = {}; i < NUM_OF_BLOCKS; i++) {
 		block = new Entity(GROUP_NAME, new Point(map[i][0], map[i][1]), VELOCITY, HEALTH, sprite);
 		block.delegate = delegateObj;
 		scope.state.entities[block.id] = block;
 	}
 }

// delegate state object constructor for our blocks,
// allows group entities to share render/update/collison functions
// over the delegate objects prototype chain. 
function Block() {}

Block.prototype.render = function blockRender(scope){
	scope.context.fillStyle = '#40d870';
    scope.context.fillRect(
        this.state.position.x,
        this.state.position.y,
        this.sprite.width, this.sprite.height
    );
    return this;
};

Block.prototype.update = function blockUpdate(scope) {
	return this;
};

Block.prototype.collision = function blockCollision(bullet) {
	// doesn't matter which bullet it has collided with, result is the same
	console.log('Event: Block has collided with a bullet');
	this.kill();
	return this;
};

module.exports = createBlocks;