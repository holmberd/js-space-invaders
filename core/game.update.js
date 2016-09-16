// /js/core/game.update.js

/** Game Update Module
 * Called by the game loop, this module will
 * perform any state calculations / updates
 * to properly render the next frame.
 */

function gameUpdate(scope) {
    return function update(tFrame) {
        var state = scope.state || {};

        // If there are entities, iterate through them and call their `update` methods
        if (state.hasOwnProperty('entities')) {
            var entities = state.entities;
            // Loop through entities
            for (var entity in entities) {
                // If `entity` was `killed` flagged skip `entity`
                // Dead `entity`will get cleaned up in collision module
                if (entities[entity].state.killed) {
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