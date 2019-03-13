/** 
 * Sprite Module
 * Loads all the sprites images from JSON data-uri.
 */
var sprites = require('../sprites/sprites.json');

function loadSprites() {
	var spritesBuffer = {};
	for (var sprite in sprites) {
		var img = new Image();
		img.src = sprites[sprite];
		spritesBuffer[sprite] = img;
	}
	return spritesBuffer;
}

module.exports = loadSprites;