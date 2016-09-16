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
        function deadCleanUp(entities) {
            for (var entity in entities) {
                if (entities[entity].state.killed) {
                    delete state.entities[entity];
                } else {
                    continue;
                }
            }
            return;
        }

        // If there are entities, iterate through them and call their `collision` methods
        if (state.hasOwnProperty('entities')) {
            var entities = state.entities;
            for (var entity in entities) {
                // If `killed` flag set, skip entity collision check
                if (entities[entity].state.killed) {
                    continue;
                } else if (entities[entity].group === 'bullet') { // For each `bullet` entity check for collision with other active entities
            		for (var entityOther in entities) { 
            			if (entities[entityOther].collides && entityOther !== entity && !entities[entityOther].state.killed) {
            				// Fire off each active entities `collision` method
                            entities[entity].collision(entities[entityOther]);
            			} else continue;
            		}
            	}
            }
            deadCleanUp(entities);
        }

        return state;
    };
}

module.exports = gameCollision;

 