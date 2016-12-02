// /entities/Bullet.js

var Point = require('../utils/utils.math.js').Point;
var Entity = require('./entity.js');

/** Bullet Module
 * Contains the Bullet Object Constructor 
 * and the helper function for creating the bullets.
 */

// Create our bullets
function createBullets(scope) {

    // Setup bullet constants
    var SPRITE_HEIGHT = 8,
    SPRITE_WIDTH = 3,
    SPRITE_COLOR = '#EA1D1D',
    SPRITE_IMAGE = null,
    BULLET_VELOCITY = -6,
    BULLET_HEALTH = 1,
    BULLET_GROUP_NAME = 'bullet',
    BULLET_POINT = null,
    NUM_OF_BULLETS = 50;

    var sprite = {
        color: SPRITE_COLOR,
        defaultColor: SPRITE_COLOR,
        height: SPRITE_HEIGHT,
        width: SPRITE_WIDTH,
        image: SPRITE_IMAGE
    };

    // Instantiate the delegate object (reference to a prototype chain of methods)
    // allows group entities to share render / update / collison methods
    // over the delegate objects prototype chain. 
    // Uses a form of Parasitic inheritance.
    var delegateObj = new Bullet();

    // Instantiate bullets to store as inactive entities, 
    // this prevent the game from doing uncesseray instantiations every time a bullet is fired
    for (var n = 0, bullet = {}; n < NUM_OF_BULLETS; n++) {
        bullet = new Entity(BULLET_GROUP_NAME, BULLET_POINT, BULLET_VELOCITY, BULLET_HEALTH, sprite);
        bullet.delegate = delegateObj;
        bullet.pc = false; // `pc` property defaults to player(false), otherwise invader(true)
        scope.state.inactiveEntities.bullets.push(bullet);
    }
}

// Bullet object constructor
function Bullet() {}

// Bullet render method
Bullet.prototype.render = function bulletRender (scope) {
    scope.context.fillStyle = this.sprite.color;
    scope.context.fillRect(
        this.state.position.x,
        this.state.position.y,
        this.sprite.width, 
        this.sprite.height
    );
};

// Bullet update method
Bullet.prototype.update = function bulletUpdate (scope) {
        var point = new Point(0, this.state.position.y);

        // If bullet is in boundary, update movement, 
        // otherwise set `killed` flag and remove before next update.
        if (this.inBoundary(scope)) {
            this.state.position.y += this.state.velocity; // Bullet direction is velocity dependent pos/neg
        } else {
            this.kill(); 
            return this;
        }
};

// Bullet collision method
Bullet.prototype.collision = function (entity) {
        if (entity.group === 'player' && this.pc) { // (this.pc) Player's bullets can't collide with player
            this.kill();
        } else if (entity.group === 'invader' && !this.pc) { // (!this.pc) Invader's bullets can't collide with invader
            this.kill();
        } else if (entity.group === 'block') {
            this.kill();
        } 
        return this;
};

// Bullet reset method
Bullet.prototype.reset = function () {
    this.state.killed = false;
    this.pc = false;
    this.state.velocity = -Math.abs(this.state.velocity); // Restore velocity to default negative number
    this.sprite.color = this.sprite.defaultColor;
    return this;
};

module.exports = createBullets;