// /js/entities/player.js

var input = require('../utils/utils.input.js');
var Point = require('../utils/utils.math.js');
var Entity = require('./entity.js');

/** Player Module
 * Main player entity module.
 */
function Player(scope) {

    // set up const player globals
    var START_POS_X = scope.constants.width / 2 - 22,
        START_POS_Y = scope.constants.height - 45,
        SPRITE_HEIGHT = 15,
        SPRITE_WIDTH = 45,
        SPRITE_IMAGE = null,
        PLAYER_LIVES = 3,
        PLAYER_VELOCITY = 3,
        PLAYER_HEALTH = 1,
        PLAYER_GROUP_NAME = 'player';

    // set up global for 'limbo' timing
    var elapsedDead = null,
        beforeDead = null,
        MIN_MS_DEAD = 1000;    

    // set up globals for firing timing
    var elapsedFireRate = null,
        beforeFireRate = null,
        MIN_MS_FIRE = 500;


    var point = new Point(START_POS_X, START_POS_Y);
    var sprite = {
        height: SPRITE_HEIGHT,
        width: SPRITE_WIDTH,
        image: SPRITE_IMAGE
    };

    var player = new Entity(PLAYER_GROUP_NAME, point, PLAYER_VELOCITY, PLAYER_HEALTH, sprite);
    player.state.lives = PLAYER_LIVES;
    player.state.died = false;

    var inputStates = {
        moveLeft: function() {
            this.enter = function() {
                player.state.position.x -= player.state.velocity;
                if (player.inBoundary(scope)) {
                    return this;
                } else {
                    player.state.position.x = 0;
                }
                return this;
            };
        },
        moveRight: function() {
            this.enter = function() {
                player.state.position.x += player.state.velocity;
                if (player.inBoundary(scope)) {
                    return this;
                } else {
                    player.state.position.x = scope.constants.width - player.sprite.width;    
                }
                return this;
            };
        },
        shoot: function(tFrame) {
            this.enter = function() {
                // Takes one of the inactive bullet entities from our array
                var bullet = scope.state.inactiveEntities.bullets.splice(0,1)[0];
                bullet.state.position.x = player.state.position.x + (player.sprite.width / 2) - (bullet.sprite.width / 2);
                bullet.state.position.y = player.state.position.y;
                // Place bullet in our active state of entities
                scope.state.entities[bullet.id] = bullet;
            };
            // set `now` property on shoot-event so we can put a delay and restrict rate of fire
            this.beforeFireRate = tFrame;
        }
    };

    // Fired via the global update method.
    // Mutates state as needed for proper rendering next state
    player.update = function playerUpdate(scope, tFrame) {

        function fireInputHandler(tFrame) {
            // handles firing input
            if (input.isDown(input.SPACE)) {
                var shoot = null;
                if (!beforeFireRate) {
                    shoot = new inputStates.shoot(tFrame);
                    beforeFireRate = tFrame;
                    return shoot;
                } else {
                    elapsedFireRate = tFrame - beforeFireRate;
                    // if elapsedFireRate time is bigger than minimum allowed, we can fire again
                    if (elapsedFireRate > MIN_MS_FIRE) {
                        beforeFireRate = null;
                        return shoot;
                    } 
                }
            }
        }

        function moveInputHandler() {
            // handles left/right input
            if (input.isDown(input.LEFT)) {
                return new inputStates.moveLeft();
            } else if (input.isDown(input.RIGHT)) {
                return new inputStates.moveRight();
            } return null;
        }

        // Check if keys are pressed, if so, update the players position.
        var moveState = moveInputHandler();
        if (moveState) {
            moveState.enter();
        }

        var fireState = fireInputHandler(tFrame);
        if (fireState) {
            fireState.enter();
        }

        if (player.state.died) {
            if (!beforeDead) {
                beforeDead = tFrame;
            } else {
                elapsedDead = tFrame - beforeDead;
                if (elapsedDead > MIN_MS_DEAD) {
                    beforeDead = null;
                    player.state.died = false;
                }
            }    
        }
        
    };

    player.collision = function playerCollision(entity) {

        // If `entity` is a bullet then bullet must come from an `invader` 
        // and `player` can't be in 'limbo' state
        if (entity.group === 'bullet' && entity.pc && !player.state.died) {
            player.state.lives--;
            if (player.state.lives === 0) {
                game.state.lost = true;
                return this;
            }
            player.state.died = true;
            console.log('Event: player lost one life');
            return this;
        } else if (entity.group === 'invader') { // If `entity` is a `invader`, game is lost
            game.state.lost = true;
        }
        return this;
    };

    // Draw the `player` on the canvas
    player.render = function playerRender() {
        if (player.state.died) {
            scope.context.globalAlpha = 0.5;
        }
        scope.context.fillStyle = '#40d870';
        scope.context.fillRect(
            player.state.position.x,
            player.state.position.y,
            sprite.width, sprite.height
        );
        scope.context.globalAlpha = 1;
    };

    return player;
}

module.exports = Player;