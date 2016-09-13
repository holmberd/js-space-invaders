// /js/entities/entity.js

/** Entity Class
 * This module contains the main entity class.
 */
function Entity(point, speed, health, sprite) {

    var _id = 'e' + Entity.prototype._count++;
    this.id = _id;
    this.collides = true;

    var x = 0,
        y = 0,
        spriteHeight = 0,
        spriteWidth = 0,
        spriteImage = null,
        entitySpeed = speed || 0;
        entityHealth = health || 1;

    if (point) {
        x = point.x;
        y = point.y;
    }
    if (sprite) {
        spriteHeight = sprite.height;
        spriteWidth = sprite.width;
        spriteImage = sprite.image;
    }

    // Create the initial state
    this.state = {
        killed: false,
        position: {
            x: x,
            y: y
        },
        moveSpeed: entitySpeed,
        health: entityHealth
    };

    this.sprite = {
        height: spriteHeight,
        width: spriteWidth,
        image: spriteImage
    };

    return this;
}

Entity.prototype.constructor = Entity;

Entity.prototype._count = 0;

Entity.prototype.inBoundary = function(scope, point) {
    var maxHeight = scope.constants.height - this.sprite.height;
    var maxWidth = scope.constants.width - this.sprite.width;
    if (point.x < 0 || point.x > maxWidth) return false;
    if (point.y < 0 || point.y > maxHeight) return false;
    return true;
};

Entity.prototype.kill = function() {
        this.state.killed = true;
        return this;
    };

module.exports = Entity;