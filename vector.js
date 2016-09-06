var Vector = (function() {

	function Vector (x, y) {
		this.x = x;
		this.y = y;
	}

	Vector.prototype.plus  = function (v) {
		return new Vector(this.x + v.x, this.y + v.y);
	};

	Vector.prototype.minus = function (v) {
		return new Vector(this.x - v.x, this.y - v.y);
	};

	Object.defineProperty(Vector.prototype, "length", {
		get: function() {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		}
	});

	Vector.prototype.distance = function(v) {
			return Math.sqrt(Math.pow((this.x - other.x), 2) + Math.pow((this.y - other.y), 2));
		};

	Vector.prototype.isEqualTo = function(v) {
		return this.x === v.x && this.y === v.y;
	};

	return Vector;

})();

