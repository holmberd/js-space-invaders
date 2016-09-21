(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
	"blocks": [[45,345], [90,345], [45,330], [60,330], [75,330], [90,330], [60,315], [75,315],
				[150,345], [195,345], [150,330], [165,330], [180,330], [195,330], [165,315], [180,315],
				[255,345], [300,345], [255,330], [270,330], [285,330], [300,330], [270,315], [285,315]],
	"invaders": [[0,0],[25,0],[50,0],[75,0],[100,0],[125,0],[150,0],[175,0],[200,0],[225,0],[250,0],[275,0],
				[0,25],[25,25],[50,25],[75,25],[100,25],[125,25],[150,25],[175,25],[200,25],[225,25],[250,25],[275,25],
				[0,50],[25,50],[50,50],[75,50],[100,50],[125,50],[150,50],[175,50],[200,50],[225,50],[250,50],[275,50],
				[0,75],[25,75],[50,75],[75,75],[100,75],[125,75],[150,75],[175,75],[200,75],[225,75],[250,75],[275,75],
				[0,100],[25,100],[50,100],[75,100],[100,100],[125,100],[150,100],[175,100],[200,100],[225,100],[250,100],[275,100],]
}


// 31 rows
// 24 cols
},{}],2:[function(require,module,exports){
// /js/core/game.collision.js

/** Game Collision Module
 * Called by the game loop, this module will
 * check the current state for any collision
 * that has taken place in the game on the 
 * current state / update.
 */

 function gameCollision (scope) {
    return function collision(tFrame) {
        var state = scope.state || {};

        // Cleans up entities that are `killed` flagged
        // and resuse bullets.
        function cleanUpDeadEntities(entities) {
            for (var entity in entities) {
                if (entities[entity].hasOwnProperty('state') && entities[entity].state.killed) {
                    if (entities[entity].group === 'bullet') {
                        entities[entity].reset();
                        state.inactiveEntities.bullets.push(entities[entity]);
                    }
                    delete state.entities[entity];
                }
            }
            return;
        }

        // If there are entities, iterate through them and if two have collided
        // then call their `collision` method.
        if (state.hasOwnProperty('entities')) {
            var entities = state.entities;
            for (var entity in entities) {

                // If entity is `killed` or doesn't collide, skip entity collision check
                if (!entities[entity].collides || entities[entity].state.killed)  {
                    continue;
                }
                for (var entityOther in entities) { 

                    // If `entity` can collide, and is not colliding with itself, and is not `killed` flagged,
                    // and both entites are not of the same group.
                    if (entities[entityOther].collides && entityOther !== entity && !entities[entityOther].state.killed && !entities[entity].state.killed  && entities[entity].group !== entities[entityOther].group) {
                        if (entities[entity].hasCollidedWith(entities[entityOther])) {
                            // Fire off each active entities `collision` method
                            entities[entity].collision(entities[entityOther]);
                            entities[entityOther].collision(entities[entity]);
                            break;
                        }
        			}
        		}
            }
            cleanUpDeadEntities(entities);
        }

        return state;
    };
}

module.exports = gameCollision;

 
},{}],3:[function(require,module,exports){
// /js/core/game.loop.js

/** Game Loop Module
 * This module contains the game loop, which handles
 * updating the game state and re-rendering the canvas
 * (using the updated state) at the configured FPS.
 */
function gameLoop ( scope ) {
    var loop = {};

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
            scope.update(now);
            // Calculate collisions in state
            scope.collision();
            // Render the next frame
            scope.render();
        }
    };

    // Start off main loop
    loop.main();

    return loop;
}

module.exports = gameLoop;
},{}],4:[function(require,module,exports){
// /js/core/game.render.js

/** Game Render Module
 * Called by the game loop, this module will
 * perform use the global state to re-render
 * the canvas using new data. Additionally,
 * it will call all game entities `render`
 * methods.
 */
function gameRender(scope) {
    // Setup globals
    var w = scope.constants.width,
        h = scope.constants.height,
        offset = scope.constants.offset;

    return function render() {
        // Clear out the canvas
        scope.context.clearRect(0, 0, w, h);
        scope.context.font = '26px Courier';

        if (scope.state.start) {
            // Draw bottom score board diviver
            scope.context.strokeStyle = '#40d870';
            scope.context.beginPath();
            scope.context.moveTo(0, h - (offset - 5));
            scope.context.lineTo(w, h - (offset - 5));
            scope.context.lineWidth = 1;
            scope.context.stroke();
            scope.context.lineWidth = 1;
        }

        // If we want to show the FPS, then render it in the top right corner.
        if (scope.constants.showFps) {
            scope.context.fillStyle = '#ff0';
            scope.context.fillText(~~scope.loop.fps, w - 50, 30);
        }

        // If there are entities, iterate through them and call their `render` methods
        if (scope.state.hasOwnProperty('entities')) {
            var entities = scope.state.entities;
            // Loop through entities
            for (var entity in entities) {
                // Fire off each active entities `render` method
                entities[entity].render(scope);
            }
        }
    };
}

module.exports = gameRender;
},{}],5:[function(require,module,exports){
// /js/core/game.update.js

var gameScore = require('../utils/utils.score.js');

/** Game Update Module
 * Called by the game loop, this module will
 * perform any state calculations / updates
 * to properly render the next frame.
 */

function gameUpdate(scope) {
    return function update(tFrame) {
        var state = scope.state || {};

        gameScore(scope);

        // If there are entities, iterate through them and call their `update` methods
        if (state.hasOwnProperty('entities')) {
            var entities = state.entities;
            // Loop through entities
            for (var entity in entities) {
                // If `entity` was `killed` flagged skip `entity`
                // Dead `entity`will get cleaned up in collision module
                if (entities[entity].hasOwnProperty('state') && entities[entity].state.killed) {
                    continue; // run next `entity`
                } else {
                    // Fire off each active entities `update` method
                    entities[entity].update(scope, tFrame);   
                }
            }
        }

        return state;
    };
}

module.exports = gameUpdate;
},{"../utils/utils.score.js":17}],6:[function(require,module,exports){
// /js/entities/blocks.js

var Point = require('../utils/utils.math.js');
var Entity = require('./entity.js');

/** Block Module
 * Main block module
 */

function createBlocks(scope, map) {

	var VELOCITY = 0,
	HEALTH = 1,
	SPRITE_HEIGHT = 15,
	SPRITE_WIDTH = 15,
	SPRITE_IMAGE = null,
	GROUP_NAME = 'block';

	var sprite = {
		height: SPRITE_HEIGHT,
		width: SPRITE_WIDTH,
		image: SPRITE_IMAGE
	};

 	var NUM_OF_BLOCKS = 24; //24,

	// instantiate the delegate object (it is basicly a pointer to a prototype chain of methods)
	var delegateObj = new Block();

	// set up all the blocks and handle them in the block object
 	for (var i = 0, block = {}; i < NUM_OF_BLOCKS; i++) {
 		block = new Entity(GROUP_NAME, new Point(map[i][0], map[i][1]), VELOCITY, HEALTH, sprite);
 		block.delegate = delegateObj;
 		scope.state.entities[block.id] = block;
 	}
 }

// delegate state object constructor for our blocks,
// allows group entities to share render/update/collison functions
// over the delegate objects prototype chain. 
function Block() {}

Block.prototype.render = function blockRender(scope){
	scope.context.drawImage(
		scope.sprites.block, 
		this.state.position.x, 
		this.state.position.y, 
		this.sprite.width,
		this.sprite.height);

    return this;
};

Block.prototype.update = function blockUpdate(scope) {
	return this;
};

Block.prototype.collision = function blockCollision(entity) {
	if (entity.group === 'bullet') { // doesn't matter which bullet it has collided with, result is the same
		console.log('Event: Block has collided with a bullet');
		this.kill();
	}
	return this;
};

module.exports = createBlocks;
},{"../utils/utils.math.js":15,"./entity.js":8}],7:[function(require,module,exports){
// /js/entities/Bullet.js

var Point = require('../utils/utils.math.js');
var Entity = require('./entity.js');

/** Bullet Module
 * Main bullet entity module.
 */

function createBullets(scope) {
    var SPRITE_HEIGHT = 8,
    SPRITE_WIDTH = 3,
    SPRITE_COLOR = '#E7E7E7',
    SPRITE_IMAGE = null,
    BULLET_VELOCITY = -6,
    BULLET_HEALTH = 1,
    BULLET_GROUP_NAME = 'bullet',
    BULLET_POINT = null,
    NUM_OF_BULLETS = 50;

    var sprite = {
        color: SPRITE_COLOR,
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
    scope.context.fillStyle = this.sprite.color;//'#40d870';
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
},{"../utils/utils.math.js":15,"./entity.js":8}],8:[function(require,module,exports){
// /js/entities/entity.js

/** Entity Class
 * This module contains the main entity class.
 */
function Entity(groupName, point, velocity, health, sprite) {

    Object.defineProperty( this, 'id', { value: Entity.prototype.count++ } );
    this.group = groupName;
    this.collides = true;
    this.delegate = {};

    var x = 0,
        y = 0,
        spriteHeight = 0,
        spriteWidth = 0,
        spriteImage = null,
        entityVelocity = velocity || 0;
        entityHealth = health || 1;

    if (point) {
        x = point.x;
        y = point.y;
    }
    if (sprite) {
        spriteColor = sprite.color;
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
        velocity: entityVelocity,
        health: entityHealth
    };

    this.sprite = {
        color: spriteColor,
        height: spriteHeight,
        width: spriteWidth,
        image: spriteImage
    };

    return this;
}

//Entity.prototype.constructor = Entity;

Entity.prototype.count = 0;

Entity.prototype.inBoundary = function(scope) {
    var maxHeight = scope.constants.height - this.sprite.height - scope.constants.offset,
        maxWidth = scope.constants.width - this.sprite.width,
        x = this.state.position.x,
        y = this.state.position.y;
    if (x < 0 || x > maxWidth) return false;
    if (y < 0 || y > maxHeight) return false;
    return true;
};

// 2D rect collision detection based of: 
// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
Entity.prototype.hasCollidedWith = function(entity) {
    var rect1 = { x: this.state.position.x, y: this.state.position.y, width: this.sprite.width, height: this.sprite.height };
    var rect2 = { x: entity.state.position.x, y: entity.state.position.y, width: entity.sprite.width, height: entity.sprite.height };
    return rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y;
};

Entity.prototype.kill = function() {
        this.state.killed = true;
        return this;
    };

// Delegates to our delegate objects methods on its prototype chain
Entity.prototype.update = function() {
    return this.delegate.update.apply(this, arguments);
};

Entity.prototype.render = function() {
    return this.delegate.render.apply(this, arguments);
};

Entity.prototype.collision = function() {
    return this.delegate.collision.apply(this, arguments);  
};

Entity.prototype.reset = function() {
    return this.delegate.reset.apply(this, arguments);
};

module.exports = Entity;
},{}],9:[function(require,module,exports){
// /entities/invader.js

var Point = require('../utils/utils.math.js');
var Entity = require('./entity.js');

/** Invader Module
 * Main invader module creates our invader entities and the wrapper entity
 * that acts to delegate our prototype methods to all invaders.
 */

 // TODO: When invaders reach bottom and doesn't collide with player, player should still lose. <<<----

function createInvaders(scope, map) {

	var INVADER_VELOCITY = 1,
	INVADERS_VELOCITY_STEP = 0.02,
	INVADER_HEALTH = 1,
	INVADER_SPRITE_HEIGHT = 18,
	INVADER_SPRITE_WIDTH = 18,
	INVADER_SPRITE_IMAGE = null,
	INVADER_GROUP_NAME = 'invader',
	NUM_OF_INVADERS =  60; // (5 rows * 12 cols)

	var invaderImages = [
		scope.sprites['invader-1'], 
		scope.sprites['invader-2'], 
		scope.sprites['invader-3'], 
		scope.sprites['invader-4'], 
		scope.sprites['invader-5']];

	var invaderSprite = {
		height: INVADER_SPRITE_HEIGHT,
		width: INVADER_SPRITE_WIDTH,
		image: INVADER_SPRITE_IMAGE
	};

	// Instantiate the wrapper for all our entities
	var invaders = new Entity('invaders');
	invaders.collides = false; // wrapper for our entites will not have a collision method
	invaders.before = null; // helper property for time calc with tFrame
	invaders.velocityStep = INVADERS_VELOCITY_STEP; // each invader's step to update each frame
	invaders.state.velocity = INVADER_VELOCITY; // init velocity
	invaders.sprite = {
		height: INVADER_SPRITE_HEIGHT * 5, // 5 rows of invaders
		width: INVADER_SPRITE_WIDTH * 12, // 12 invaders in every row
		image: null
	};
	invaders.delegate = new Invaders(); // Instantiate our delegate object for the wrapper
	scope.state.entities[invaders.id] = invaders;

	// Instantiate the delegate object for invader entity
	var delegateObj = new Invader();

	// Instantiate all the invaders and set them as active entities in the game state
 	for (var i = 0, invader = {}; i < NUM_OF_INVADERS; i++) {
 		if (i <= 11) invaderSprite.image = invaderImages[0];
 		if (i > 11 && i <= 23) invaderSprite.image = invaderImages[1];
 		if (i > 23 && i <= 35) invaderSprite.image = invaderImages[2];
 		if (i > 35 && i <= 47) invaderSprite.image = invaderImages[3];
 		if (i > 47) invaderSprite.image = invaderImages[4];
 		invader = new Entity(INVADER_GROUP_NAME, new Point(map[i][0], map[i][1]), INVADER_VELOCITY, INVADER_HEALTH, invaderSprite);
 		invader.delegate = delegateObj;
 		scope.state.entities[invader.id] = invader;
 	}
 	return this;
 }

// Invader object constructor
// acts as the wrapper for our invader entities
function Invaders() {}

// Are left empty, they are handled on `entity` level
Invaders.prototype.render = function() { return this; };
Invaders.prototype.collison = function() { return this; };

// Main update method for all our invaders
Invaders.prototype.update = function invadersUpdate(scope, tFrame) {
	var entities = scope.state.entities;
	var dimensionMarkers = {};
	var entityIdBuffer = [];
	var elapsed = 0;
	var MIN_MS_FIRE = 2000;

	// Get the current dimensions edge marker so that we can determine
	// when the invaders have reached an inner/outer edge.
	function getDimensions(arr) {
		var bottom = new Dimension(0, null);
		var right = new Dimension(0, null);
		var left = new Dimension(999999, null);

		function Dimension(num, id) {
			this.num = num;
			this.id = id;
			return this;
		}
		// Perform calc to determine dimensions
		for (var i = 0; i < arr.length; i++) {
			if (entities[arr[i]].state.position.y > bottom.num) {
				bottom.num = entities[arr[i]].state.position.y;
				bottom.id = arr[i];
			}
			if (entities[arr[i]].state.position.x > right.num) {
				right.num = entities[arr[i]].state.position.x;
				right.id = arr[i];
			}
			if (entities[arr[i]].state.position.x < left.num) {
				left.num = entities[arr[i]].state.position.x;
				left.id = arr[i];
			}
		}
		return { bottom: bottom.id, right: right.id, left: left.id };
	}
	// Update all invader entities in the vertical direction
	function moveAllVertical(arr) {
		arr.forEach(function(id) {
			entities[id].state.position.y += entities[id].sprite.height;
		}, this);
	}

	// Update all invader entities in the horizontal direction
	function moveAllHorizontal(arr) {
		arr.forEach(function(id) {
			entities[id].state.position.x += this.state.velocity;
		}, this);
	}

	function fireRandomBullet() {		
		// Returns a random number between min (inclusive) and max (exclusive)
		function getRandomInt(min, max) {
  			min = Math.ceil(min);
  			max = Math.floor(max);
  			return Math.floor(Math.random() * (max - min)) + min;
		}
		var randomNum = getRandomInt(0, entityIdBuffer.length);
		var entity = entities[entityIdBuffer[randomNum]]; // returns a random entity from our buffer id array
		
		// Takes one of the inactive bullet entities from our array
		// and set its position to the random selected entity
        var bullet = scope.state.inactiveEntities.bullets.pop();
        bullet.state.velocity *= -1; // switch bullet direction
        bullet.pc = true;	// set bullet to `pc`
        bullet.sprite.color = '#EA1D1D'; // set bullet sprite color
        bullet.state.position.x = entity.state.position.x + (entity.sprite.width / 2) - (bullet.sprite.width / 2); 
        bullet.state.position.y = entity.state.position.y;
        scope.state.entities[bullet.id] = bullet;  // Place bullet in our active state of entities
	}

	// Loop over all entites and store each entity's `id` in a buffer array
	// and check if any invader has reached the surface.
	for (var entity in entities) {
		if (entities[entity].group === 'invader') {
			// If invaders reaches the surface then player has lost the game
			if (entities[entity].state.position.y > scope.constants.height - scope.constants.offset - entities[entity].sprite.height) {
				game.state.lost = true;
			}
			entityIdBuffer.push(entities[entity].id);
		}
	}

	// If there are not invaders left and `player` hasn't alredy lost
	// then game is set to `win`, otherwise continue updating
	if (entityIdBuffer.length === 0 && !game.state.lost) {
		game.state.win = true;
	} else {

		if (!this.before) { // init to keep track of elapsed time to restrict fire rate
			this.before = tFrame;
		} else {
			elapsed = tFrame - this.before; // calc elapsed time
			if (elapsed > MIN_MS_FIRE) { // delay and restrict rate of fire for invaders
				fireRandomBullet(entityIdBuffer);
				this.before = null; // reset before prop so we can fire again
			}
		}

		dimensionMarkers = getDimensions(entityIdBuffer); // calc and store our dimension markers

		if (this.state.velocity > 0) { // if velocity is a positive number -> invaders are moving right 
			entities[dimensionMarkers.right].state.position.x += this.state.velocity; // increase position of the entity furthest right
			if (entities[dimensionMarkers.right].inBoundary(scope)) { // if that entity is still in game boundaries
				entities[dimensionMarkers.right].state.position.x -= this.state.velocity; // restore entity position before updating all
				moveAllHorizontal.call(this, entityIdBuffer); // move all entities position horizontally
			} else {
				entities[dimensionMarkers.right].state.position.x -= this.state.velocity; // restore entity position
				this.state.velocity += this.velocityStep; // increase velocity
				//MIN_MS_FIRE -= 100; 
				this.state.velocity *= -1; // switch velocity direction, i.e. negative => postive & postive => negative
				moveAllVertical.call(this, entityIdBuffer); // move all invaders down one row 
			}
		} else { // else velocity is a negative number -> invaders are moving left
			entities[dimensionMarkers.left].state.position.x += this.state.velocity;
			if (entities[dimensionMarkers.left].inBoundary(scope)) {
				entities[dimensionMarkers.left].state.position.x -= this.state.velocity;
				moveAllHorizontal.call(this, entityIdBuffer);
			} else {
				entities[dimensionMarkers.left].state.position.x -= this.state.velocity;  
				this.state.velocity *= -1;
				this.state.velocity += this.velocityStep;
				moveAllVertical.call(this, entityIdBuffer);
			}
		}
	}
};

// Delegate state object constructor for our invaders,
// allows group entities to share render/update/collison functions over the delegate objects prototype chain. 
function Invader() {}

// Renders invader sprite on canvas
Invader.prototype.render = function invaderRender(scope) {
	scope.context.drawImage(
		this.sprite.image,
		this.state.position.x,
		this.state.position.y, 
		this.sprite.width, 
		this.sprite.height);

    return this;
};

// Left empty, because it is handled by the global `invaders` update method
Invader.prototype.update = function invaderUpdate(scope) {
	return this;
};

Invader.prototype.collision = function invaderCollision(entity, scope) {
	if (entity.group === 'bullet' && !entity.pc) {
		console.log('Event: Invader has collided with a bullet');
		this.kill();
		return this;
	} else if (entity.group === 'block') {
		entity.kill();
		return this;
	} 
	return this;
};

module.exports = createInvaders;
},{"../utils/utils.math.js":15,"./entity.js":8}],10:[function(require,module,exports){
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
        SPRITE_COLOR = '#E7E7E7',
        SPRITE_HEIGHT = 15,
        SPRITE_WIDTH = 45,
        SPRITE_IMAGE = scope.sprites.player,
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
        color: SPRITE_COLOR,
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
                var bullet = scope.state.inactiveEntities.bullets.pop();
                bullet.sprite.color = player.sprite.color;
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
        if (fireState && !player.state.died) { // prevent player from firing if `died` state
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
                console.log('player is dead');
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
},{"../utils/utils.input.js":14,"../utils/utils.math.js":15,"./entity.js":8}],11:[function(require,module,exports){
// /js/game.js

var generateCanvas = require('./utils/utils.canvas.js');
var gameLoop = require('./core/game.loop.js');
var gameUpdate = require('./core/game.update.js');
var gameCollision = require('./core/game.collision.js');
var gameRender = require('./core/game.render.js');
var input = require('./utils/utils.input.js');
var Menu = require('./utils/utils.menu.js');
var Player = require('./entities/player.js');
var createInvaders = require('./entities/invader.js');
var createBlocks = require('./entities/blocks.js');
var createBullets = require('./entities/bullet.js');
var loadSprites = require('./utils/utils.sprites.js');
var map = require('./conf/map.json');

var container = document.querySelector('#container');

// Create game base class
function Game(w, h, targetFps, showFps) {

    // Load sprites from JSON as data-uri
    this.sprites = loadSprites();

    // Setup some constants
    this.constants = {
        offset: 25,
        width: w,
        height: h,
        targetFps: targetFps,
        showFps: showFps
    };

    // Instantiate an empty state object
    this.state = {};

    // Setup game progression states
    this.state.start = false;
    this.state.win = false;
    this.state.lost = false;

    // Generate and store the canvas as a viewport global
    this.viewport = generateCanvas(w, h);
    this.viewport.id = "gameViewport";

    // Get and store the canvas context as a global
    this.context = this.viewport.getContext('2d');

    // Append the canvas node to our container
    container.appendChild(this.viewport);

    // Instantiate core modules with the current scope
    this.update = gameUpdate(this);
    this.collision = gameCollision(this);
    this.render = gameRender(this);
    this.loop = gameLoop(this);

    // Instantiate input handler module
    input.init();

    // Instantiate players, bullets and npc's modules with the current scope
    this.state.entities = this.state.entities || {};
    this.state.inactiveEntities = this.state.inactiveEntities || {};
    this.state.inactiveEntities.bullets = [];

    this.state.entities.menu = new Menu();

    return this;
}

// Instantiate the game in a global
// window.game = new Game(360, 450, 30, true); // with fps counter
window.game = new Game(360, 450, 30, false);

// Export the game as a module
module.exports = game;
},{"./conf/map.json":1,"./core/game.collision.js":2,"./core/game.loop.js":3,"./core/game.render.js":4,"./core/game.update.js":5,"./entities/blocks.js":6,"./entities/bullet.js":7,"./entities/invader.js":9,"./entities/player.js":10,"./utils/utils.canvas.js":13,"./utils/utils.input.js":14,"./utils/utils.menu.js":16,"./utils/utils.sprites.js":18}],12:[function(require,module,exports){
module.exports={
	"player": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkUETQ4hjeRtQAAALVJREFUeNrt28ENQDAYBeBWjOPI0S4mMIwJTGIBM5iFFXoQfzXfO0vIl3d4kTYP43yngGznXvTcOi0Rn5e6JGDAgAEDBgwYME2lr33RRi1kjQEDBgwYMGDAgLF8v13IGgMGDBgwYAQMGDD/Xr5v//PVGDBgwIABAwaMgAEDBgwYMGDAgAEDRlI+7qvohtvb52ijzu+WvldjwIABAwYMGDBgGkvYDbfaF7LGgAEDBgwYMGDANJYHqogewsBbaBsAAAAASUVORK5CYII=",
	"invader-1": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAABTUlEQVR4Xu3aQW7CMBRF0WQ/DDtFjNhYt9URi2IMQqCqlTB6X3xCkA5jy3Gu7382dubN1/Y0Jb/DPmm1/ja7n2iMMzD3OQEz8AcYYG4EZMxABWCAiZbf30aMYcyLjDl+Zzvf2uM/vvW8AebuJAIz3OAxhjGV4FNKSqniyzQxhjGMqRFYzJjwT9qUniF39xdi68+Y7hfp7g+YkIBSqoFSSoxhTI0AY2q8ZAxjqsakXzuk/b5rR5tuBMP3yO+uww7fttUH5rn7onR+GTMMXxkzOAwHBpg0Xy7tZIyMqfjCmCGt/lKqTcxqWwOzWMas1oHawBjDGMbUCDCmxkvGMIYxNQJPG9N9ltsy/D+dNI8vz5jmB3dz6T5rBkYp3QiEtwmMYQxjHue6UhrwAQaYK4HmfZZVyapkVbIq/SMgYwZCAANM7WSCMYxhTI3AMsacAeaFOXZRrGeGAAAAAElFTkSuQmCC",
	"invader-2": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAABbUlEQVR4Xu2ZwREBQRBFbQricHR1FYc0RCANUYhCLFKgyt6UHm+q244qz7lr1j7/f90902a7u6/A57w+gipecridUPGo506Cef/7CCbQrWAEMxOg2aZiVIyKabYBWinAI5gsmOv+gjpfSpp2qr9+3iSYoPMVjGCeBKjVtVLU4GklraSVWq2vGRPQEUwWjKtNV5suqlrhS2c0N3hu8NzgucFDV5kvRWZMdoNnH2Mf850+hvqZziL0PFpHs4Oeh/sYeqBgkkMaBU3rVEzy34aC1krZkYCSNmPMGKqVuU7FqJg/VUz1hVsfxuWrqdXLr2iXf9W+JwommYEqJmrwzJhgHyMYwXQ1oGaMGdM3sqiYpRRDGyi6cRt1XrliRr1INWjBaKXB4auVkkNadSZUn2fGmDFmTHNzRTNQK2Uv3ChpGoJ9C8nP1dXfD1/RVj/486v2VVR/P8FopZkAtbqKUTEqppnaWinAIxjB9M1AVDEPq6w4F5G5FhkAAAAASUVORK5CYII=",
	"invader-3": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAABb0lEQVR4Xu2ZsQ0CMRAE+YhmCBEZCSVRCGVQBgXRAREgnBDg197f6s8SQ2xs33jXXvun3f743Ai/2/khtNKbnC5bqXHVuBNgfq8PYDq6BQxgGgF1b0MxKAbFzMYArNTBA5gsmPv1ICVflbQUZ9+N1ERbNe4EmE7yBQxgPgRUC2OlXsDDSlgJK81FBvaYDh3AZMFUPW2qCdndTk3SZe8x7oLV/gCTvURipcG+EqjSd7fDSlgppikUg2JQTIxAVjFVzw6WKhd0MvxdaUFNlr8AJnuJxEqDveBZfLGgE6yElWKyQTEoBsXECIymGNXDliq/OlFvzer87J9o1YEB4yaQvByqC4diOqABA5hGACtxXDcCHNecSrFzfnjFqOWom6BasHtc+3HtniBgknuHe0FQzFoBz71yWAkrxaI5ikExKGZ2H/67gOcuuKo/e46pKkTdpNX5AWatgKeuiHuF3f2hGBQTiwkoBsWgGEuwxEodjC/YajEPRpRcJAAAAABJRU5ErkJggg==",
	"invader-4": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAABUElEQVR4Xu2csRGCQBREoR9DUxuwDnuwBjMLsANzG7MADUgI+MzusHN3wTO+OeDx9t8/YJxP58tvCv5u909wNn2q1+OqDxZGzoDZpgSYwh7AAEYoLKshGIMxGOMRwBiPFzXmqDFqR6t2oKPPJxsz+oWkzw8wRGkhoEYdYzAGY3YbFqJU4AEMYBYC9DGFCYABjLe8YgzGYEykISNKRIkoEaU1gXRNSM8Xfx7jPYtvP7rbJrL9pXpHBMxou2vv/rUfjTEY41mHMRiDMR4BjPF4yTXm+f5K3/mqE6Zb817zzYDZNg4wRRIBAxjvxRzGYAzG7DY26vJPlIhS5yipDbqqtNpxp48bj1L6BAFzcDecviEY06r4pu8cUSJK3rKJMRiDMZE9S7copf/CQF2VRh8nfwYy+oWkzw8wVYNHlIq3BIABjFWGqDHUGEuYCWMwxjPmD/KnFmFu4a6sAAAAAElFTkSuQmCC",
	"invader-5": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAABS0lEQVR4Xu3bPQrCUBBFYdO7EAtLxcpduUlxA+7EUsGAVZ7cIU8S5LMezHvHcyeTH4f94fzcBJ/b/RRUrb/kuLtGixyAmeYETMMfYIAZCegxDROAASY6+36KGMOYHxnz2F6iyTc9fKpqOkn3/r50HwMwjckXGGDSFL3rRKl1SSBKoiRKJQKiVMOl+TKGMTUCjKnx0mMYw5gaAcbUeOkxjGFMjcBcY5a695rusvf64h7T+8DphtO63usDRpRGAuljG8YwhjFf+7UoNfAAA8xIoPsck77Omg5a/1IXv7X5LxtO9wFMa44RpWkyjGFM2l3GOsYwhjE1Aoyp8Yp7THrx1Xs0X+r7gJkbJcbMvFxfSv3eP5woiVLtvg1jGMOYr5NcenIQpVaUev/JojZ4r7c6fkS73i38ZmXAiFLNLMYwhjE1Aoyp8dJjGFMz5gVLKr8OBDaD3gAAAABJRU5ErkJggg==",
	"win": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAABW0lEQVR4Xu2bMQ7CMBAEk/9QQpn/8CT+Qwn/oYTCTSRyym7uRBwx1M5ZHu+uDysZT+fpPfD7IjACZlkVgAncAhjAeEGKYlAMivEIoBiPFxkTKeb1HEo738t18ramaPTjdi+q1MqMgAk6X8AAxrIaViJ8LcEQvhEurISVsJJHoDfFqJ2q2kmr9VRqu2WMuhDABFsJGMA0AlgpUAJgANMIVIdldT2Oa5UADZ5HSr4MV8NSnX4vi6jzAiaykvoaCIpJHq9YSSXQWatPxiQ3hPAlfL3OHMWgmIMoJnmobX68+1Np88qSDwLmqMd1cuM3P45iUIwnHhSDYlCMRwDFeLzKM0advvqmT51XXbBaT/4TqRYEzI+uQNUNQTHJUFVBY6XsfYxKmowhY1SttHEoBsX8qWL4Xml543d7z9fT4fro6mwDTNTHYCWstO7H2QishJUswfDpX4QLK2Elz0ofYp6Dcl7UZIEAAAAASUVORK5CYII=",
	"lost": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkVAgUBubNkQwAAALxJREFUeNrt2rEJgDAQBVAVx7ESW1u3snIgexezUwcQIcWFgHl/ACWPC3zCtcM034280iEAAwZMxvTRH9yuo8hB1m4xMa4SGDBgwIABI2C+06Y+O0Q32tSmWuq/JgYMGDBgwIABA+ZvzXcfz6TmW6qplmrSJgYMGDBgwIABA+ZnCd92iG6g0VsMJgYMGDBgwIABA6bS2HYwMa4SGDBgwIABA0bzzRpvvq4SGDBgBAwYMGDqaL4mBgwYMDXnAelKJzMFtcAxAAAAAElFTkSuQmCC",
	"block": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkVAhU10sWCpwAAAJBJREFUeNrt3KERwCAMQNHSq2eRSiwbdCQkI7EYE5QBMJW93Ps6hneJJd2lvoe2TgRgwIABAwYMGDCxur4OtjFDPLg/2cY4JTBgwIABAwYMGIEBAwYMGDBgwIABA0ZgwIABAwYMGDBgwIABgwAMGDBgwIABAwYMGDACAwYMGDBgflzy6YWNAQMGDBgwYMDEagHJ2gbFmuCJfwAAAABJRU5ErkJggg==",
	"menu": "data:image/png;base64,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"
}
},{}],13:[function(require,module,exports){
function generateCanvas(w, h) {
  console.log('Generating canvas.');

  var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');

  // Set the `canvas` width & height
  canvas.width = w;
  canvas.height = h;
  //canvas.style.width = w;
  //canvas.style.height = h;

  return canvas;
}

module.exports = generateCanvas;
},{}],14:[function(require,module,exports){
var inputHandler = {
	_isPressed: {},
	RIGHT: 39,
	LEFT: 37,
	SPACE: 32,
	ENTER: 13,

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
},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
// /utils/menu.js

var input = require('./utils.input.js');
var createInvaders = require('../entities/invader.js');
var createBlocks = require('../entities/blocks.js');
var createBullets = require('../entities/bullet.js');
var Player = require('../entities/player.js');
var map = require('../conf/map.json');

function Menu() {
	this.collide = false;
	this.group = 'menu';
}

Menu.prototype.update = function(scope) {

    if (input.isDown(input.ENTER)) {
    	this.startGame(scope);
    }
};

Menu.prototype.render = function(scope) {
	if (scope.state.win) {
        scope.context.drawImage(scope.sprites.win, (scope.constants.width / 2) - (70 / 2), scope.constants.height / 2 - 170);
		scope.context.font = '20px Courier';
		scope.context.fillStyle = '#ff0';
    	scope.context.fillText('You Win!', 50 , scope.constants.height / 2 - 50);
	} else if (scope.state.lost) {
        scope.context.drawImage(scope.sprites.lost, (scope.constants.width / 2) - (70 / 2), scope.constants.height / 2 - 170);
		scope.context.font = '20px Courier';
		scope.context.fillStyle = '#ff0';
    	scope.context.fillText('You Lost!', 50 , scope.constants.height / 2 - 50);
	}
    scope.context.drawImage(scope.sprites.menu, 0, 0);
	scope.context.font = '20px Courier';
	scope.context.fillStyle = '#ff0';
    scope.context.fillText('Press \'ENTER\' to play', 50 , scope.constants.height / 2);
};

Menu.prototype.startGame = function(scope) {

	scope.state.entities = {};
	scope.state.inactiveEntities = {};
    scope.state.inactiveEntities.bullets = [];

    scope.state.start = true;
    scope.state.win = false;
    scope.state.lost = false;

	// Instantiate bullets to store as inactive entities, 
    // this prevent us from having to do unecessary calc every time a bullet is fired.
    createBullets(scope);

    // Instantiate invaders with map positions
    createInvaders(scope, map.invaders);

    // Instantiate blocks with map positions
    createBlocks(scope, map.blocks);

    // Instantiate player 
    scope.state.entities.player = new Player(scope);

    scope.state.inactiveEntities.menu = this;
    
    delete scope.state.entities.menu;

};


module.exports = Menu;


},{"../conf/map.json":1,"../entities/blocks.js":6,"../entities/bullet.js":7,"../entities/invader.js":9,"../entities/player.js":10,"./utils.input.js":14}],17:[function(require,module,exports){
// /utils/utils.score.js

function gameScore(scope) {
	if (scope.state.win || scope.state.lost) {
		window.cancelAnimationFrame(scope.loop.stopLoop);
		scope.state.start = false;
		var menu = scope.state.inactiveEntities.menu;
		scope.state.entities = {};
		scope.state.entities.menu = menu;
		scope.loop.main();
	}
	return; 
}

module.exports = gameScore;
},{}],18:[function(require,module,exports){
// /utils/utils.sprites.js

var sprites = require('../sprites/sprites.json');

function loadSprites() {
	var spritesBuffer = {};
	console.log(sprites);

	for (var sprite in sprites) {
		var img = new Image();
		img.src = sprites[sprite];
		spritesBuffer[sprite] = img;
		
	}
	return spritesBuffer;
}

module.exports = loadSprites;
},{"../sprites/sprites.json":12}]},{},[11]);
