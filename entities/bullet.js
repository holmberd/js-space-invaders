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
    BULLET_SPEED = 6,
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
        bullet = new Entity(BULLET_GROUP_NAME, BULLET_POINT, BULLET_SPEED, BULLET_HEALTH, sprite);
        bullet.delegate = delegateObj;
        // 'pc' property default to false as player bullet, otherwise invader(pc)
        bullet.pc = false;
        scope.state.inactiveEntities.bullets.push(bullet);
    }
}

function Bullet() {}

Bullet.prototype.render = function bulletRender(scope) { // FIX: DRY = DONT REPEAT YOURSELF, seperate delegate class for bullets, invaders and player.
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
        if (this.inBoundary(scope)) {
            this.state.position.y -= this.state.moveSpeed;
        } else {
            this.kill(); 
            return this;
            //delete scope.state.entities[bullet.id]; // FIX: decouple from game state by setting flag to `killed` and handle in game update ? Removes need for including `scope` i.e. state in function.
        }
};

Bullet.prototype.collision = function(entity) {
    if (this.hasCollidedWith(entity)) {
        if (!this.pc && entity.group === 'player') {
            return this;
        } else {
        console.log('Event: Bullet has collided with something');
        // Set bullets state to killed
        this.kill();
        // call collision on the entity collided with
        entity.collision(this);
        }
    }
    /*
    if (this.hasCollidedWith(entity)) {
        console.log('Event: block collided with bullet');
        // Set bullets state to killed
        this.kill();
        // call collision on the entity collided with
        entity.collision(this);
        //delete scope.state.entities[entity.id];
    } */
    return this;
};

module.exports = createBullets;