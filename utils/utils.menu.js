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

