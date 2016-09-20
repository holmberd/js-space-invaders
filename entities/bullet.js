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
    NUM_OF_BULLETS = 50;

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
        if (entity.group === 'player' && this.pc) { // player's bullet can't collide with player
            this.kill(); // Set `bullet` state to `killed`
        } else if (entity.group === 'invader' && !this.pc) { // invader's bullet can't collide with invader
            this.kill();
        } else if (entity.group === 'block') {
            this.kill();
        } 
        return this;
};

Bullet.prototype.reset = function() {
    this.state.killed = false;
    this.pc = false;
    this.state.velocity = -Math.abs(this.state.velocity);
    return this;
};

module.exports = createBullets;