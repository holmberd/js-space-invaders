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

        // If there are entities, iterate through them and call their `collision` methods
        if (state.hasOwnProperty('entities')) {
            var entities = state.entities;
            // Loop through entities
            for (var entity in entities) {
            	if (entity.hasOwnProperty('collision')) {
            		for (var entityOther in entities) {
            			if (entityOther.group === 'bullet' || entityOther.group === 'playerbullet' ) {
            				// Fire off each active entities `collision` method
            				entities[entity].collision(entityOther);            				
            			}

            		}
   
            	}
            }
        }

        return state;
    };
}

module.exports = gameCollision;

 