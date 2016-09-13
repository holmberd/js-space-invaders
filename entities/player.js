// /js/entities/player.js

var input = require('../utils/utils.input.js');
var Point = require('../utils/utils.math.js');
var Entity = require('./entity.js');

/** Player Module
 * Main player entity module.
 */
function Player(scope) {

    // set up const player globals
    var START_POS_X = scope.constants.width / 2,
        START_POS_Y = scope.constants.height - 50,
        SPRITE_HEIGHT = 15,
        SPRITE_WIDTH = 45,
        SPRITE_IMAGE = null,
        PLAYER_LIVES = 3,
        PLAYER_SPEED = 6,
        PLAYER_HEALTH = 1,
        PLAYER_GROUP_NAME = 'player';

    // set up globals for firing timing
    var elapsed = null,
        before = null,
        MIN_MS_FIRE = 500;


    var point = new Point(START_POS_X, START_POS_Y);
    var sprite = {
        height: SPRITE_HEIGHT,
        width: SPRITE_WIDTH,
        image: SPRITE_IMAGE
    };

    var player = new Entity(PLAYER_GROUP_NAME, point, PLAYER_SPEED, PLAYER_HEALTH, sprite);
    player.state.lived = PLAYER_LIVES;

    var inputStates = {
        moveLeft: function() {
            this.enter = function() {
                var newPoint = new Point(player.state.position.x - player.state.moveSpeed, player.state.position.y);
                if (player.inBoundary(scope, newPoint)) {
                    player.state.position.x -= player.state.moveSpeed;
                } else {
                    player.state.position.x = 0;
                }
            };
        },
        moveRight: function() {
            this.enter = function() {
                var newPoint = new Point(player.state.position.x + player.state.moveSpeed, player.state.position.y);
                if (player.inBoundary(scope, newPoint)) {
                    player.state.position.x += player.state.moveSpeed;
                } else {
                    player.state.position.x = scope.constants.width - player.sprite.width;    
                }
            };
        },
        shoot: function(tFrame) {
            this.enter = function() {
                var bullet = scope.state.inactiveEntities.bullets.splice(0,1)[0];
                bullet.state.position.x = player.state.position.x + (player.sprite.width / 2) - (bullet.sprite.width / 2);
                bullet.state.position.y = player.state.position.y;
                scope.state.entities[bullet.id] = bullet;
            };
            // set `now` property on shoot-event so we can put a delay and restrict rate of fire
            this.before = tFrame;
        }
    };

    // Fired via the global update method.
    // Mutates state as needed for proper rendering next state
    player.update = function playerUpdate(tFrame) {
        // Check if keys are pressed, if so, update the players position.
        var moveState = moveInputHandler();
        if (moveState) {
            moveState.enter();
        }

        var fireState = fireInputHandler(tFrame);
        if (fireState) {
            fireState.enter();
        }

        function fireInputHandler(tFrame) {
            // handles firing input
            if (input.isDown(input.SPACE)) {
                var shoot = null;
                if (!before) {
                    shoot = new inputStates.shoot(tFrame);
                    before = tFrame;
                    return shoot;
                } else {
                    elapsed = tFrame - before;
                    // if elapsed time is bigger than minimum allowed, we can fire again
                    if (elapsed > MIN_MS_FIRE) {
                        before = null;
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
    };

    player.collision = function playerCollision(entity) {
        if (entity.group === 'bullet') {
            if (player.haveCollidedWith(entity)) {
                player.state.lives--;
                console.log('player lost one life');
            }
            return;
        }
        return;
    };

    // Draw the player on the canvas
    player.render = function playerRender() {
        scope.context.fillStyle = '#40d870';
        scope.context.fillRect(
            player.state.position.x,
            player.state.position.y,
            sprite.width, sprite.height
        );
    };

    return player;
}

module.exports = Player;