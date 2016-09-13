// /js/entities/playerbullet.js

var Point = require('../utils/utils.math.js');
var Entity = require('./entity.js');

/** Player bullet Module
 * Main player bullet entity module.
 */
function PlayerBullet(scope, x, y) {
    var SPRITE_HEIGHT = 8,
        SPRITE_WIDTH = 3,
        SPRITE_IMAGE = null,
        BULLET_SPEED = 6,
        BULLET_HEALTH = 1,
        BULLET_GROUP_NAME = 'playerbullet';

    var point = new Point(x, y);
    var sprite = {
        height: SPRITE_HEIGHT,
        width: SPRITE_WIDTH,
        image: SPRITE_IMAGE
    };

    var bullet = new Entity(BULLET_GROUP_NAME, point, BULLET_SPEED, BULLET_HEALTH, sprite);

    // Draw the bullet on the canvas
    bullet.render = function bulletRender() {
        scope.context.fillStyle = '#40d870';
        scope.context.fillRect(
            bullet.state.position.x,
            bullet.state.position.y,
            sprite.width, sprite.height
        );
    };

    // Fired via the global update method.
    // Mutates state as needed for proper rendering next state
    bullet.update = function bulletUpdate() {
        var point = new Point(0, bullet.state.position.y);
        if (bullet.inBoundary(scope) && !bullet.state.killed) { // FIX: probably don't need killed state when already deleting prop from entities state
            bullet.state.position.y -= bullet.state.moveSpeed;
        } else {
            delete scope.state.entities[bullet.id];
        }
    };

    return bullet;
}

module.exports = PlayerBullet;