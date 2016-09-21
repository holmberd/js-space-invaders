// /game.js

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

    // Setup some constants
    this.constants = {
        offset: 25,
        width: w,
        height: h,
        targetFps: targetFps,
        showFps: showFps
    };

    // Load sprites from JSON as data-uri
    this.sprites = loadSprites();

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

    // Instantiate the game menu module
    // Menu can be passed as an `Entity` as it has a `update` and `render` method
    this.state.entities.menu = new Menu();

    return this;
}

// Instantiate the game in a global
// window.game = new Game(360, 450, 30, true); // with fps counter
window.game = new Game(360, 450, 30, false);

// Export the game as a module
module.exports = game;