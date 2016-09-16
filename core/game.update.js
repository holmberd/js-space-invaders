// /js/core/game.update.js

/** Game Update Module
 * Called by the game loop, this module will
 * perform any state calculations / updates
 * to properly render the next frame.
 */

 // FIX: entites that becomes active in the state during active will be updated during the current update frame instead of the next.
 // FIX: entities that are flagged for dead might be lower down on the entities list and be removed during current update frame instead of next.
function gameUpdate(scope) {
    return function update(tFrame) {
        var state = scope.state || {};

        // If there are entities, iterate through them and call their `update` methods
        if (state.hasOwnProperty('entities')) {
            var entities = state.entities;
            // Loop through entities
            for (var entity in entities) {
                // If entity was killed on previous update, remove from active entities
                if (entities[entity].state.killed) {
                    delete entities[entity];
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