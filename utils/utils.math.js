// /utils/utils.math.js

/** Math Module
 * Contains the main Point class that has helper
 * methods for doing calculations on positioning in a grid.
 */

function Point(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Point.prototype.constructor = Point;

Point.prototype.set = function (x, y){
    this.x = x || 0;
    this.y = y || ( (y !== 0) ? this.x : 0 ); // If y is omitted, both x and y will be set to x.
};

Point.prototype.clone = function () {
    return new Point(this.x, this.y);
};

Point.prototype.copy = function (p) {
    this.set(p.x, p.y);
};

Point.prototype.equals = function (p) {
    return (p.x === this.x) && (p.y === this.y);
};

module.exports = Point;