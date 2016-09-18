// /js/entities/Bullet.js

var Point = require('../utils/utils.math.js');
var Entity = require('./entity.js');

/** Bullet Module
 * Main bullet entity module.
 */

function createBullets(scope) {
    var SPRITE_HEIGHT = 8,
    SPRITE_WIDTH = 3,
    SPRITE_IMAGE = null,
    BULLET_VELOCITY = -6,
    BULLET_HEALTH = 1,
    BULLET_GROUP_NAME = 'bullet',
    BULLET_POINT = null,
    NUM_OF_BULLETS = 200;

    var sprite = {
        height: SPRITE_HEIGHT,
        width: SPRITE_WIDTH,
        image: SPRITE_IMAGE
    };

    // instantiate the delegate object (it is basicly a pointer to a prototype chain of methods)
    var delegateObj = new Bullet();

    // Instantiate bullets to store as inactive entities, 
    // this prevent us from instantiating every time a bullet is fired
    for (var n = 0, bullet = {}; n < NUM_OF_BULLETS; n++) {
        bullet = new Entity(BULLET_GROUP_NAME, BULLET_POINT, BULLET_VELOCITY, BULLET_HEALTH, sprite);
        bullet.delegate = delegateObj;
        // 'pc' property default to false as player bullet, otherwise invader(pc)
        bullet.pc = false;
        scope.state.inactiveEntities.bullets.push(bullet);
    }
}

function Bullet() {}

Bullet.prototype.render = function bulletRender(scope) {
    scope.context.fillStyle = '#40d870';
    scope.context.fillRect(
        this.state.position.x,
        this.state.position.y,
        this.sprite.width, 
        this.sprite.height
    );
};

Bullet.prototype.update = function bulletUpdate(scope) {
        var point = new Point(0, this.state.position.y);
        // If bullet is in game boundary update movement, 
        // otherwise set `killed` flag and remove before next update (decoupling)
        if (this.inBoundary(scope)) {
            this.state.position.y += this.state.velocity; // bullet direction is velocity dependent pos/neg
        } else {
            this.kill(); 
            return this;
        }
};

Bullet.prototype.collision = function(entity) {
    if (this.hasCollidedWith(entity)) {
        if (!this.pc && entity.group === 'player') { // checks that player's bullet can't collide with player
            return this;
        } else if (this.pc && entity.group === 'invader') { // checks that invader's bullet can't collide with invader
            return this;
        } else if (entity.group !== 'bullet') { // bullets can't collide with bullets
            console.log('Event: Bullet has collided with something');
            this.kill(); // Set `bullet` state to `killed`
            entity.collision(this); // call `collision` on the `entity` collided with
        }
    }
    return this;
};

module.exports = createBullets;