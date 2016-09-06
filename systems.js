var systems = {};

systems.input = function(canvas) {
	this.inputHandler = {
		_pressed: {},
		RIGHT: 39,
		LEFT: 37,

		isDown: function(keyCode) {
			return this._pressed[keyCode];
		},
		onKeydown: function(event) {
			this._pressed[event.keyCode] = true;
		},
		onKeyup: function(event) {
			delete this._pressed[event.keyCode];
		}
	};
	this.init = function() {
		canvas.addEventListener('keyup', function(event) { this.inputHandler.onKeyup(event);} , false);
		canvas.addEventListener('keydown', function(event) { this.inputHandler.onKeydown(event); }, false);
	};
 };

systems.collision = function(entities) {

};

systems.spawn = function() {

};

systems.destroy = function() {

};

systems.gameScore = function() {

};