// /core/game.update.js

var gameScore = require('../utils/utils.score.js');

/** Game Update Module
 * Called by the game loop, this module will
 * perform any state calculations / updates
 * to properly render the next frame.
 */

function gameUpdate(scope) {
    return function update(tFrame) {
        var state = scope.state || {};

        gameScore(scope); // Call before we update entities to see if player has lost / won

        // If there are entities, iterate through them and call their `update` methods
        if (state.hasOwnProperty('entities')) {
            var entities = state.entities;
            // Loop through entities
            for (var entity in entities) {
                // If `entity` was `killed` flagged skip `entity`
                // Dead entities will get cleaned up in the collision module
                if (entities[entity].hasOwnProperty('state') && entities[entity].state.killed) {
                    continue;
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