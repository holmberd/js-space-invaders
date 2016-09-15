// /js/entities/blocks.js

var Point = require('../utils/utils.math.js');
var Entity = require('./entity.js');

/** Block Module
 * Main block module
 */

function createBlocks(scope) {

	var SPEED = 0,
	HEALTH = 1,
	SPRITE_HEIGHT = 15,
	SPRITE_WIDTH = 15,
	SPRITE_IMAGE = null,
	BLOCK_GROUP_NAME = 'block';

	var sprite = {
		height: SPRITE_HEIGHT,
		width: SPRITE_WIDTH,
		image: SPRITE_IMAGE
	};

 	var NUM_OF_BLOCKS = 1, //24,
 		map = [[25,10], [25,6], [25,3], [25,13], [25,17], [25,20],
			[24,3], [24,4], [24,5], [24,6], [24,10], [24,11], [24,12], [24,13], [24,17], [24,18], [24,19], [24,20],
			[23,4], [23,5], [23,11], [23,12], [23,18], [23,19]];

	// set up all the blocks and handle them in the block object
 	for (var i = 0, block = {}; i < NUM_OF_BLOCKS; i++) {
 		block = new Entity(BLOCK_GROUP_NAME, new Point(map[i][1], map[i][0]), SPEED, HEALTH, sprite);
 		block.delegate = new Block();
 		scope.state.entities[block.id] = block;
 	}
 }

	// delegate state object constructor for our blocks
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

Block.prototype.update = function blockUpdate() {
	return this;
};

Block.prototype.collision = function blockCollision(scope, entity) {
	if (this.hasCollidedWith(entity)) {
	    console.log('Event: block collided with bullet');
	    delete scope.state.entities[entity.id];
	}
	return this;
};

module.exports = createBlocks;