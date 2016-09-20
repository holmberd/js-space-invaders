// /utils/utils.sprites.js

var sprites = require('../sprites/sprites.json');

function loadSprites() {
	var spritesBuffer = {};
	console.log(sprites);

	for (var sprite in sprites) {
		var img = new Image();
		img.src = sprites[sprite];
		spritesBuffer[sprite] = img;
		
	}
	return spritesBuffer;
}

module.exports = loadSprites;