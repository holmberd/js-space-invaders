// /js/game.js
var generateCanvas = require('./utils/utils.canvas.js');
var gameLoop = require('./core/game.loop.js');
var gameUpdate = require('./core/game.update.js');
var gameCollision = require('./core/game.collision.js');
var gameRender = require('./core/game.render.js');
var input = require('./utils/utils.input.js');
var Player = require('./entities/player.js');
var createInvaders = require('./entities/invader.js');
var createBlocks = require('./entities/blocks.js');
var createBullets = require('./entities/bullet.js');
var map = require('./conf/map.json');

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

    this.viewport = generateCanvas(w, h);
    this.viewport.id = "gameViewport";

    // Get and store the canvas context as a global
    this.context = this.viewport.getContext('2d');

    // Append the canvas node to our container
    container.appendChild(this.viewport);
    // $container.insertBefore(this.viewport, container.firstChild);


    // Instantiate core modules with the current scope
    this.update = gameUpdate(this);
    this.collision = gameCollision(this);
    this.render = gameRender(this);
    this.loop = gameLoop(this);

    // Instantiate players, bullets and npc's modules with the current scope
    this.state.entities = this.state.entities || {};
    this.state.inactiveEntities = this.state.inactiveEntities || {};
    this.state.inactiveEntities.bullets = [];

    // Instantiate bullets to store as inactive entities, 
    // this prevent us from instantiating every time a bullet is fired
    createBullets(this);

    createInvaders(this, map.invaders);

    // Instantiate blocks with map
    createBlocks(this, map.blocks);

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