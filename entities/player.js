// /entities/player.js

var input = require('../utils/utils.input.js');
var Point = require('../utils/utils.math.js');
var Entity = require('./entity.js');

/** Player Module
 * Create main Player class
 */
function Player(scope) {

    // set up const player globals
    var START_POS_X = scope.constants.width / 2 - 22,
        START_POS_Y = scope.constants.height - 45,
        SPRITE_COLOR = '#E7E7E7',
        SPRITE_HEIGHT = 15,
        SPRITE_WIDTH = 45,
        SPRITE_IMAGE = scope.sprites.player,
        PLAYER_LIVES = 3,
        PLAYER_VELOCITY = 3,
        PLAYER_HEALTH = 1,
        PLAYER_GROUP_NAME = 'player';

    // Set up global for 'limbo' timing
    var elapsedDead = null,
        beforeDead = null,
        MIN_MS_DEAD = 1000;    

    // Set up globals for firing timing
    var elapsedFireRate = null,
        beforeFireRate = null,
        MIN_MS_FIRE = 500;

    var point = new Point(START_POS_X, START_POS_Y); // Player starting point
    var sprite = {
        color: SPRITE_COLOR,
        height: SPRITE_HEIGHT,
        width: SPRITE_WIDTH,
        image: SPRITE_IMAGE
    };

    // Instantiate Player
    var player = new Entity(PLAYER_GROUP_NAME, point, PLAYER_VELOCITY, PLAYER_HEALTH, sprite);
    player.state.lives = PLAYER_LIVES;
    player.state.died = false;

    // Player's input state functions in our state machine
    var inputStates = {
        moveLeft: function () { // Move player left
            this.enter = function () {
                player.state.position.x -= player.state.velocity;
                if (player.inBoundary(scope)) {
                    return this;
                } else {
                    player.state.position.x = 0;
                }
                return this;
            };
        },
        moveRight: function () {
            this.enter = function () { // Move player right
                player.state.position.x += player.state.velocity;
                if (player.inBoundary(scope)) {
                    return this;
                } else {
                    player.state.position.x = scope.constants.width - player.sprite.width;    
                }
                return this;
            };
        },
        shoot: function (tFrame) { // Player fire bullet
            this.enter = function () { 
                // Takes one of the inactive bullet entities from our array
                var bullet = scope.state.inactiveEntities.bullets.pop();
                bullet.sprite.color = player.sprite.color;
                bullet.state.position.x = player.state.position.x + (player.sprite.width / 2) - (bullet.sprite.width / 2);
                bullet.state.position.y = player.state.position.y;
                // Place bullet in our active state of entities
                scope.state.entities[bullet.id] = bullet;
            };
            // Set `beforeFireRate` property on shoot-event so we can put a delay and restrict rate of fire
            this.beforeFireRate = tFrame;
        }
    };

    // Fired via the global update method.
    // Mutates state as needed for proper rendering next state
    player.update = function playerUpdate (scope, tFrame) {
        // Handles input for player to fire bullets
        function fireInputHandler (tFrame) {
            if (input.isDown(input.SPACE)) {
                var shoot = null;
                if (!beforeFireRate) {
                    shoot = new inputStates.shoot(tFrame);
                    beforeFireRate = tFrame;
                    return shoot;
                } else {
                    elapsedFireRate = tFrame - beforeFireRate;

                    // If elapsedFireRate time is bigger than minimum allowed, we can fire again
                    if (elapsedFireRate > MIN_MS_FIRE) {
                        beforeFireRate = null;
                        return shoot;
                    } 
                }
            }
        }

        // Left/right input handler
        function moveInputHandler() {
            if (input.isDown(input.LEFT)) {
                return new inputStates.moveLeft();
            } else if (input.isDown(input.RIGHT)) {
                return new inputStates.moveRight();
            } return null;
        }

        // If keys are pressed, update the players position.
        var moveState = moveInputHandler();
        if (moveState) {
            moveState.enter();
        }
        // If key is pressed, fire bullet
        var fireState = fireInputHandler(tFrame);
        if (fireState && !player.state.died) { // Frevent player from firing if `died` state
            fireState.enter();
        }
        // If player died(lost life), keep in 'limbo' for MIN_MS
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

    // Player collision method
    player.collision = function playerCollision (entity) {

        // If player gets hit by invader fire and player is not already in
        // a dead state, then player lose one life.
        if (entity.group === 'bullet' && entity.pc && !player.state.died) {
            player.state.lives--;
            if (player.state.lives === 0) { // If player has no more lifes, player lost.
                game.state.lost = true;
                return this;
            }
            player.state.died = true; // Player state set to `died` for MIN_MS
            return this;
        } else if (entity.group === 'invader') { // If player collides with an invader, player lost.
            game.state.lost = true;
        }
        return this;
    };

    // Draw the player on the canvas
    player.render = function playerRender () {
        if (player.state.died) {
            scope.context.globalAlpha = 0.5;
        }
        scope.context.fillStyle = player.sprite.color;
        scope.context.fillRect(
            player.state.position.x,
            player.state.position.y+5,
            sprite.width, sprite.height-5
        );
        scope.context.fillRect(
            player.state.position.x+10,
            player.state.position.y,
            sprite.width-20, sprite.height
        );
        scope.context.fillRect(
            player.state.position.x+20,
            player.state.position.y-10,
            sprite.width-40, sprite.height
        );

        // Renders player lives in bottom left
        for (var i = 0, n = 5; i < player.state.lives; i++){
            scope.context.drawImage(player.sprite.image, n, scope.constants.height - 16, player.sprite.height, player.sprite.height);
            n += 20;
        }
        
        scope.context.globalAlpha = 1;
    };

    return player;
}

module.exports = Player;