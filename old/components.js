/**

function Components(name, component) {
	this[name] = component;
	return this;
}
*/

var Components = (function() {

	var Components = {};

	Components.Group = function(strId) {
		this.id = strId;
		return this;
	};
	Components.Group.prototype.name = 'group';

	Components.Bullet = function(type) {
		this.bullet = true;
		this.type = type || 'player' ;
		return this;
	};
	Components.Bullet.prototype.name = 'bullet';

	Components.PlayerControlled = function() {
		this.player = true;
		return this;
	};
	Components.PlayerControlled.prototype.name = 'playerControlled';

	Components.Block = function() {
		this.value = true;
		return this;
	};
	Components.Block.prototype.name = 'block';


	Components.Velocity = function(value) {
		this.value = value;
		return this;
	};
	Components.Velocity.prototype.name = 'velocity';

	Components.Health = function(value) {
		this.value = value || 1;
		return this;
	};
	Components.Health.prototype.name = 'health';

	Components.Collision = function() {
		this.collides = true;
		return this;
	};
	Components.Collision.prototype.name = 'collision';

	Components.Lives = function(value) {
		this.value = value || 3;
		return this;
	};
	Components.Lives.prototype.name = 'lives';

	Components.Visible = function(bool) {
		this.value = bool || true;
	};
	Components.Visible.prototype.name = 'Visible';

	return Components;

})();