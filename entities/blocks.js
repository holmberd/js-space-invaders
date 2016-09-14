// /js/entities/blocks.js

var Point = require('../utils/utils.math.js');
var Entity = require('./entity.js');

/** Block Module
 * Main block module
 */

 function Block(scope, point) {

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

 	var block = new Entity(BLOCK_GROUP_NAME, point, SPEED, HEALTH, sprite);

 	block.render = function blockRender(){
 		scope.context.fillStyle = '#40d870';
        scope.context.fillRect(
            block.state.position.x,
            block.state.position.y,
            sprite.width, sprite.height
        );
 	};

 	block.update = function blockUpdate() {
 		// subscribe to collision module events
 	};

 	block.collision = function blockCollision(entity) {
 		console.log('bajs');
		if (block.hasCollidedWith(entity)) {
		    console.log('Event: block collided with bullet');
		    delete scope.state.entities[entity.id];
		}
		return;
    };

 	return block;
 }

 function createBlocks(scope) {

 	var NUM_OF_BLOCKS = 24,
 		BLOCK_POS = [[25,3], [25,6], [25,10], [25,13], [25,17], [25,20],
			[24,3], [24,4], [24,5], [24,6], [24,10], [24,11], [24,12], [24,13], [24,17], [24,18], [24,19], [24,20],
			[23,4], [23,5], [23,11], [23,12], [23,18], [23,19]];

 	// set up all the blocks and handle them in the block object
 	for (var i = 0, block = null; i < NUM_OF_BLOCKS; i++) {
 		block = new Block(scope, new Point(BLOCK_POS[i][1], BLOCK_POS[i][0]));
 		scope.state.entities[block.id] = block;
 	}

 }

module.exports = createBlocks;