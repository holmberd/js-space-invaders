// /js/entities/entity.js

/** Entity Class
 * This module contains the main entity class.
 */
function Entity(groupName, point, speed, health, sprite) {

    var _id = 'e' + Entity.prototype._count++;
    this.id = _id;
    this.group = groupName;
    this.collides = true;
    this.delegate = {};

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

//Entity.prototype.constructor = Entity;

Entity.prototype._count = 0;

Entity.prototype.inBoundary = function(scope) {
    var maxHeight = scope.constants.height - this.sprite.height,
        maxWidth = scope.constants.width - this.sprite.width,
        x = this.state.position.x,
        y = this.state.position.y;
    if (x < 0 || x > maxWidth) return false;
    if (y < 0 || y > maxHeight) return false;
    return true;
};

// 2D collision detection based of: 
// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
Entity.prototype.hasCollidedWith = function(entity) {
    var rect1 = { x: this.state.position.x, y: this.state.position.y, width: this.sprite.width, height: this.sprite.height };
    var rect2 = { x: entity.state.position.x, y: entity.state.position.y, width: entity.sprite.width, height: entity.sprite.height };
    return rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y;
};

Entity.prototype.kill = function() {
        this.state.killed = true;
        return this;
    };

Entity.prototype.update = function() {
    return this.delegate.update.apply(this, arguments);
};

Entity.prototype.render = function() {
    return this.delegate.render.apply(this, arguments);
};

Entity.prototype.collision = function() {
    return this.delegate.collision.apply(this, arguments);
};

module.exports = Entity;