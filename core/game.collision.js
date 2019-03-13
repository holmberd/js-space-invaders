/** 
 * Game Collision Module
 * Called by the game loop, this module will use the game state to check for any collision
 * that has taken place in the game.
 */

 function gameCollision(scope) {
  return function collision(tFrame) {
    var state = scope.state || {};
    // Cleans up entities that are `killed` flagged
    // Reset state of used bullets and move them to `inactiveEntites` to be reused
    function cleanUpDeadEntities(entities) {
      for (var entity in entities) {
        if (entities[entity].hasOwnProperty('state') && entities[entity].state.killed) {
          if (entities[entity].group === 'bullet') {
            entities[entity].reset();
            state.inactiveEntities.bullets.push(entities[entity]);
          }
          delete state.entities[entity];
        }
      }
      return;
    }

    // If there are entities, iterate through them and if two have collided
    // then call their `collision` method.
    if (state.hasOwnProperty('entities')) {
      var entities = state.entities;
      for (var entity in entities) {
        // If entity is killed or doesn't collide, skip entity collision check
        if (!entities[entity].collides || entities[entity].state.killed)  {
          continue;
        }
        // Loop through entities and see if collision has occured
        for (var entityOther in entities) { 
          // If entity can collide, and is not colliding with itself, and is not `killed` flagged,
          // and both entites are not of the same group. Then call their `collision` methods.
          if (entities[entityOther].collides && entityOther !== entity && !entities[entityOther].state.killed && !entities[entity].state.killed  && entities[entity].group !== entities[entityOther].group) {
            if (entities[entity].hasCollidedWith(entities[entityOther])) {
                entities[entity].collision(entities[entityOther]);
                entities[entityOther].collision(entities[entity]);
                break;
            }
    			}
    		}
      }
      // Clean up any entities that got killed during collision
      cleanUpDeadEntities(entities);
    }

    return state;
  };
}

module.exports = gameCollision;

 