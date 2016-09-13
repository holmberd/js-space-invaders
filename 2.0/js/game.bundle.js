(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// /js/core/game.loop.js

/** Game Loop Module
 * This module contains the game loop, which handles
 * updating the game state and re-rendering the canvas
 * (using the updated state) at the configured FPS.
 */
function gameLoop ( scope ) {
    var loop = this;

    // Initialize timer variables so we can calculate FPS
    var fps = scope.constants.targetFps, // Our target fps
        fpsInterval = 1000 / fps, // the interval between animation ticks, in ms (1000 / 60 = ~16.666667)
        before = window.performance.now(), // The starting times timestamp

        // Set up an object to contain our alternating FPS calculations
        cycles = {
            new: {
                frameCount: 0, // Frames since the start of the cycle
                startTime: before, // The starting timestamp
                sinceStart: 0 // time elapsed since the startTime
            },
            old: {
                frameCount: 0,
                startTime: before,
                sineStart: 0
            }
        },
        // Alternating Frame Rate vars
        resetInterval = 5, // Frame rate cycle reset interval (in seconds)
        resetState = 'new'; // The initial frame rate cycle

    loop.fps = 0; // A prop that will expose the current calculated FPS to other modules


    // Main game rendering loop

    loop.main = function mainLoop( tframe ) {
        // Request a new Animation Frame
        // setting to `stopLoop` so animation can be stopped via
        // `window.cancelAnimationFrame( loop.stopLoop )`
        loop.stopLoop = window.requestAnimationFrame( loop.main );

        // How long ago since last loop?
        var now = tframe,
            elapsed = now - before,
            activeCycle, targetResetInterval;

        // If it's been at least our desired interval, render
        if (elapsed > fpsInterval) {
            // Set before = now for next frame, also adjust for
            // specified fpsInterval not being a multiple of rAF's interval (16.7ms)
            // ( http://stackoverflow.com/a/19772220 )
            before = now - (elapsed % fpsInterval);

            // Increment the vals for both the active and the alternate FPS calculations
            for (var calc in cycles) {
                ++cycles[calc].frameCount;
                cycles[calc].sinceStart = now - cycles[calc].startTime;
            }

            // Choose the correct FPS calculation, then update the exposed fps value
            activeCycle = cycles[resetState];
            loop.fps = Math.round(1000 / (activeCycle.sinceStart / activeCycle.frameCount) * 100) / 100;

            // If our frame counts are equal....
            targetResetInterval = (cycles.new.frameCount === cycles.old.frameCount ? resetInterval * fps // Wait our interval
                                                                                    : (resetInterval * 2) * fps); // Wait double our interval

            // If the active calculation goes over our specified interval,
            // reset it to 0 and flag our alternate calculation to be active
            // for the next series of animations.
            if (activeCycle.frameCount > targetResetInterval) {
                cycles[resetState].frameCount = 0;
                cycles[resetState].startTime = now;
                cycles[resetState].sinceStart = 0;

                resetState = (resetState === 'new' ? 'old' : 'new');
            }

            // Update the game state
            scope.update( now );
            // Render the next frame
            scope.render();
        }
    };

    // Start off main loop
    loop.main();

    return loop;
}

module.exports = gameLoop;
},{}],2:[function(require,module,exports){
// /js/core/game.render.js

/** Game Render Module
 * Called by the game loop, this module will
 * perform use the global state to re-render
 * the canvas using new data. Additionally,
 * it will call all game entities `render`
 * methods.
 */
function gameRender( scope ) {
    // Setup globals
    var w = scope.constants.width,
        h = scope.constants.height;

    return function render() {
        // Clear out the canvas
        scope.context.clearRect(0, 0, w, h);

        // Spit out some text
        scope.context.font = '32px Arial';
        scope.context.fillStyle = '#fff';
        scope.context.fillText('It\'s dangerous to travel this route alone.', 5, 50);

        // If we want to show the FPS, then render it in the top right corner.
        if (scope.constants.showFps) {
            scope.context.fillStyle = '#ff0';
            scope.context.fillText(scope.loop.fps, w - 100, 50);
        }

        // If there are entities, iterate through them and call their `render` methods
        if (scope.state.hasOwnProperty('entities')) {
            var entities = scope.state.entities;
            // Loop through entities
            for (var entity in entities) {
                // Fire off each active entities `render` method
                entities[entity].render();
            }
        }
    };
}

module.exports = gameRender;
},{}],3:[function(require,module,exports){
// /js/core/game.update.js

/** Game Update Module
 * Called by the game loop, this module will
 * perform any state calculations / updates
 * to properly render the next frame.
 */
function gameUpdate ( scope ) {
    return function update( tFrame ) {
        var state = scope.state || {};

        // If there are entities, iterate through them and call their `update` methods
        if (state.hasOwnProperty('entities')) {
            var entities = state.entities;
            // Loop through entities
            for (var entity in entities) {
                // Fire off each active entities `render` method
                entities[entity].update(tFrame);
            }
        }

        return state;
    };
}

module.exports = gameUpdate;
},{}],4:[function(require,module,exports){
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

module.exports = Bullet;
},{"../utils/utils.math.js":10,"./entity.js":5}],5:[function(require,module,exports){
// /js/entities/entity.js

/** Entity Class
 * This module contains the main entity class.
 */
function Entity(point, speed, health, sprite) {

    var _id = 'e' + Entity.prototype._count++;
    this.id = _id;
    this.collides = true;

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

Entity.prototype.constructor = Entity;

Entity.prototype._count = 0;

Entity.prototype.inBoundary = function(scope, point) {
    var maxHeight = scope.constants.height - this.sprite.height;
    var maxWidth = scope.constants.width - this.sprite.width;
    if (point.x < 0 || point.x > maxWidth) return false;
    if (point.y < 0 || point.y > maxHeight) return false;
    return true;
};

Entity.prototype.kill = function() {
        this.state.killed = true;
        return this;
    };

module.exports = Entity;
},{}],6:[function(require,module,exports){
// /js/entities/player.js

var input = require('../utils/utils.input.js');
var Point = require('../utils/utils.math.js');
var Entity = require('./entity.js');

/** Player Module
 * Main player entity module.
 */
function Player(scope) {
    var that = scope;

    // set up const player globals
    var START_POS_X = scope.constants.width / 2,
        START_POS_Y = scope.constants.height - 50,
        SPRITE_HEIGHT = 15,
        SPRITE_WIDTH = 45,
        SPRITE_IMAGE = null,
        PLAYER_LIVES = 3,
        PLAYER_SPEED = 3,
        PLAYER_HEALTH = 1;

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
    var lives = PLAYER_LIVES;

    var player = new Entity(point, PLAYER_SPEED, PLAYER_HEALTH, sprite);

    player._inputStates = {
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
            this.before = tFrame;
        }
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

    // Fired via the global update method.
    // Mutates state as needed for proper rendering next state
    player.update = function playerUpdate(tFrame) {
        // Check if keys are pressed, if so, update the players position.
        var moveState = moveInput();
        if (moveState) {
            moveState.enter();
        }

        var fireState = fireInput(tFrame);
        if (fireState) {
            fireState.enter();
        }

        function fireInput(tFrame) {
            // handles firing input
            if (input.isDown(input.SPACE)) {
                var shoot = null;
                if (!before) {
                    shoot = new player._inputStates.shoot(tFrame);
                    before = tFrame;
                    return shoot;
                } else {
                    elapsed = tFrame - before;
                    if (elapsed > MIN_MS_FIRE) {
                        before = null;
                        return shoot;
                    } 
                }
            }
        }

        function moveInput() {
            // handles left/right input
            if (input.isDown(input.LEFT)) {
                return new player._inputStates.moveLeft();
            } else if (input.isDown(input.RIGHT)) {
                return new player._inputStates.moveRight();
            } return null;
        }
    };

    return player;
}

module.exports = Player;
},{"../utils/utils.input.js":9,"../utils/utils.math.js":10,"./entity.js":5}],7:[function(require,module,exports){
// /js/game.js
var cUtils = require('./utils/utils.canvas.js');
var gameLoop = require('./core/game.loop.js');
var gameUpdate = require('./core/game.update.js');
var gameRender = require('./core/game.render.js');
var input = require('./utils/utils.input.js');
var Player = require('./entities/player.js');
var Bullet = require('./entities/bullet.js');

var container = document.querySelector('#container');

// Create base game class
function Game(w, h, targetFps, showFps) {

    // Setup some constants
    this.constants = {
        width: w,
        height: h,
        targetFps: targetFps,
        showFps: showFps
    };

    // Instantiate an empty state object
    this.state = {};

    this.viewport = cUtils.generateCanvas(w, h);
    this.viewport.id = "gameViewport";

    // Get and store the canvas context as a global
    this.context = this.viewport.getContext('2d');

    // Append the canvas node to our container
    container.appendChild(this.viewport);
    // $container.insertBefore(this.viewport, container.firstChild);


    // Instantiate core modules with the current scope
    this.update = gameUpdate(this);
    this.render = gameRender(this);
    this.loop = gameLoop(this);

    // Instantiate players, bullets and npc's modules with the current scope
    this.state.entities = this.state.entities || {};
    this.state.inactiveEntities = this.state.inactiveEntities || {};
    this.state.inactiveEntities.bullets = [];

    // Load up some inactive entity bullets
    for (var i = 0; i < 100; i++) {
        this.state.inactiveEntities.bullets.push(new Bullet(this, 0, 0));
    }

    // Instantiate player 
    this.state.entities.player = new Player(this);

    // Instantiate input handler module
    input.init();

    return this;
}

// Instantiate the game in a global
window.game = new Game(360, 450, 30, true);

// Export the game as a module
module.exports = game;
},{"./core/game.loop.js":1,"./core/game.render.js":2,"./core/game.update.js":3,"./entities/bullet.js":4,"./entities/player.js":6,"./utils/utils.canvas.js":8,"./utils/utils.input.js":9}],8:[function(require,module,exports){
module.exports = {

	/** Determine the proper pixel ratio for the canvas */
getPixelRatio : function getPixelRatio(context) {
  console.log('Determining pixel ratio.');

  // I'd rather not have a giant var declaration block,
  // so I'm storing the props in an array to dynamically
  // get the backing ratio.
  var backingStores = [
    'webkitBackingStorePixelRatio',
    'mozBackingStorePixelRatio',
    'msBackingStorePixelRatio',
    'oBackingStorePixelRatio',
    'backingStorePixelRatio'
  ];

  var deviceRatio = window.devicePixelRatio;

  // Iterate through our backing store props and determine the proper backing ratio.
  var backingRatio = backingStores.reduce(function(prev, curr) {
    return (context.hasOwnProperty(curr) ? context[curr] : 1);
  });

  // Return the proper pixel ratio by dividing the device ratio by the backing ratio
  return deviceRatio / backingRatio;
},

/** Generate a canvas with the proper width / height
 * Based on: http://www.html5rocks.com/en/tutorials/canvas/hidpi/
 */
generateCanvas : function generateCanvas(w, h) {
  console.log('Generating canvas.');

  var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');
  // Pass our canvas' context to our getPixelRatio method
  var ratio = this.getPixelRatio(context);

  // Set the canvas' width then downscale via CSS
  canvas.width = Math.round(w * ratio);
  canvas.height = Math.round(h * ratio);
  canvas.style.width = w +'px';
  canvas.style.height = h +'px';
  // Scale the context so we get accurate pixel density
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  return canvas;
}
};
},{}],9:[function(require,module,exports){
var inputHandler = {
	_isPressed: {},
	RIGHT: 39,
	LEFT: 37,
	SPACE: 32,

	isDown: function isDown(keyCode) {
		return this._isPressed[keyCode];
	},

	onKeydown: function onKeydown(event) {
		this._isPressed[event.keyCode] = true;
	},

	onKeyup: function onKeyup(event) {
		delete this._isPressed[event.keyCode];
	},

	init: function init() {
		console.log('Initiating input handler.');
		window.addEventListener('keyup', function(event) { event.preventDefault(); inputHandler.onKeyup(event); }, false);
		window.addEventListener('keydown', function(event) { event.preventDefault(); inputHandler.onKeydown(event); }, false);
	}
};

module.exports = inputHandler;
},{}],10:[function(require,module,exports){
function Point(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Point.prototype.constructor = Point;

Point.prototype.set = function(x, y){
    this.x = x || 0;
    this.y = y || ( (y !== 0) ? this.x : 0 ); // If y is omitted, both x and y will be set to x.
};

Point.prototype.clone = function() {
    return new Point(this.x, this.y);
};

Point.prototype.copy = function(p) {
    this.set(p.x, p.y);
};

Point.prototype.equals = function (p) {
    return (p.x === this.x) && (p.y === this.y);
};

module.exports = Point;
},{}]},{},[7]);
