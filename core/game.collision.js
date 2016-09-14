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
            	if (entities[entity].hasOwnProperty('collision')) {
            		for (var entityOther in entities) {
            			if (entities[entityOther].group === 'bullet' || entities[entityOther].group === 'playerbullet' ) {
            				// Fire off each active entities `collision` method
            				entities[entity].collision(entities[entityOther]);            				
            			}

            		}
   
            	}
            }
        }

        return state;
    };
}

module.exports = gameCollision;

 