// /js/entities/bullet.js

var Point = require('../utils/utils.math.js');
var Entity = require('./entity.js');

/** Bullet Module
 * Main bullet entity module.
 */
function Bullet(scope, x, y) {
    var SPRITE_HEIGHT = 3,
        SPRITE_WIDTH = 3,
        SPRITE_IMAGE = null,
        BULLET_SPEED = 3;
        BULLET_HEALTH = 1;

    var point = new Point(x, y);
    var sprite = {
        height: SPRITE_HEIGHT,
        width: SPRITE_WIDTH,
        image: SPRITE_IMAGE
    };

    var bullet = new Entity(point, BULLET_SPEED, BULLET_HEALTH, sprite);
    // set bullet property to 'invader' owned
    bullet.pc = true;

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
        if (bullet.inBoundary(scope, point) && !bullet.state.killed) {
            bullet.state.position.y -= bullet.state.moveSpeed;
        } else {
            delete scope.state.entities[bullet.id];
        }
    };

    return bullet;
}

module.exports = PlayerBullet;