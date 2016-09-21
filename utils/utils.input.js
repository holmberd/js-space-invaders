// /utils/utils.input.js

/** Input Module
 * This module handles all the input events from the player
 * and is part of the state machine. 
 */

var inputHandler = {
	_isPressed: {},
	RIGHT: 39,
	LEFT: 37,
	SPACE: 32,
	ENTER: 13,

	isDown: function isDown (keyCode) {
		return this._isPressed[keyCode];
	},

	onKeydown: function onKeydown (event) {
		this._isPressed[event.keyCode] = true;
	},

	onKeyup: function onKeyup (event) {
		delete this._isPressed[event.keyCode];
	},

	init: function init () {
		console.log('Initiating input handler.');
		window.addEventListener('keyup', function(event) { event.preventDefault(); inputHandler.onKeyup(event); }, false);
		window.addEventListener('keydown', function(event) { event.preventDefault(); inputHandler.onKeydown(event); }, false);
	}
};

module.exports = inputHandler;