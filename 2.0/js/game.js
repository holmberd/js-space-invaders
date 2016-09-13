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

    // Instantiate bullets to store as inactive entities, 
    // this prevent us from instantiating every time a bullet is fired
    for (var i = 0; i < 100; i++) {
        this.state.inactiveEntities.bullets.push(new PlayerBullet(this, 0, 0));
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