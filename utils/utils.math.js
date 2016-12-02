// /utils/utils.math.js

/** Math Module
 * Contains helper methods for doing calculations.
 */

// Point object constructor
// Contains methods for vector calculations.
function Point(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Point.prototype.constructor = Point;

// If y is omitted, both x and y will be set to x.
Point.prototype.set = function (x, y){
  this.x = x || 0;
  this.y = y || ( (y !== 0) ? this.x : 0 );
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

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
  Point: Point,
  getRandomInt: getRandomInt
};