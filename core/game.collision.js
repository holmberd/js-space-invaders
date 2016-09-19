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
        function cleanUpDeadEntities(entities) {
            for (var entity in entities) {
                if (entities[entity].state.killed) {
                    delete state.entities[entity];
                }
            }
            return;
        }

        // If there are entities, iterate through them and if they two have collided
        // then call their `collision` method.
        if (state.hasOwnProperty('entities')) {
            var entities = state.entities;
            for (var entity in entities) {

                // If entity is `killed` or doesn't collide, skip entity collision check
                if (entities[entity].state.killed || !entities[entity].collides)  {
                    continue;
                }
                for (var entityOther in entities) { 

                    // If `entity` can collide, and is not colliding with itself, and is not `killed` flagged,
                    // and both entites are not of the same group.
                    if (entities[entityOther].collides && entityOther !== entity && !entities[entityOther].state.killed && entities[entity].group !== entities[entityOther].group) {
                        if (entities[entity].hasCollidedWith(entities[entityOther])) {
                            // Fire off each active entities `collision` method
                            entities[entity].collision(entities[entityOther]);
                            entities[entityOther].collision(entities[entity]);
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

 