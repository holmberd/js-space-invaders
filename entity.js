(function(){

	function Entity(vector, sprite) {
		var _killed = false;
		var _id = 'e' + Entity.prototype._count++;
		this.id = _id;
		this.vector = vector || null;
		this.sprite = sprite || null;
		this.components = {};
		return this;
	}
	Entity.prototype._count = 0;

	Entity.prototype.kill = function() {
		_killed = true;
		return this;
	};

	Entity.prototype.addComponent = function(component) {
		this.components[component.name] = component;
		return this;
	};

	Entity.prototype.removeComponent = function(component) {
		var _name = component;
		if (typeof component === 'function') {
			_name = component.name;
		}
		delete this.components[name];
		return this;
	};

	Entity.prototype.print = function() {
		console.log(JSON.stringify(this, null, 4));
		return this;
	};

	return Entity;

})();


