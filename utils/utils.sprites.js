// /utils/utils.sprites.js

var sprites = require('../sprites/sprites.json');

/** Sprite Module
 * Contains function that loads all the sprites images
 * from JSON data-uri.
 */

function loadSprites() {
	var spritesBuffer = {};

	for (var sprite in sprites) {
		var img = new Image(); // Create new `image`
		img.src = sprites[sprite]; // Append data-uri source
		spritesBuffer[sprite] = img; // Place in sprite buffer
		
	}
	return spritesBuffer;
}

module.exports = loadSprites;