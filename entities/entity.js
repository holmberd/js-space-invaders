/** 
 * Entity Module
 * Contains the main Entity Object Constructor
 */
function Entity(groupName, point, velocity, health, sprite) {
  // Every entity gets a unique `id`
  Object.defineProperty( this, 'id', { value: Entity.prototype.count++ } );
  this.group = groupName;
  this.collides = true;
  this.delegate = {};

  var x = 0,
      y = 0,
      spriteHeight = 0,
      spriteWidth = 0,
      spriteImage = null,
      entityVelocity = velocity || 0;
      entityHealth = health || 1;

  if (point) {
    x = point.x;
    y = point.y;
  }
  if (sprite) {
    spriteColor = sprite.color;
    spriteDefaultColor = sprite.defaultColor || null;
    spriteHeight = sprite.height;
    spriteWidth = sprite.width;
    spriteImage = sprite.image;
  }

  // Initial state
  this.state = {
    killed: false,
    position: {
        x: x,
        y: y
    },
    velocity: entityVelocity,
    health: entityHealth
  };

  this.sprite = {
    color: spriteColor,
    defaultColor: spriteDefaultColor,
    height: spriteHeight,
    width: spriteWidth,
    image: spriteImage
  };

  return this;
}

Entity.prototype.count = 0; // Init the `id` count

// Called on an entity with the current game state
// returns `true` if entity position is inside game boundary.
Entity.prototype.inBoundary = function (scope) {
  var maxHeight = scope.constants.height - this.sprite.height - scope.constants.offset;
  var maxWidth = scope.constants.width - this.sprite.width;
  var x = this.state.position.x;
  var y = this.state.position.y;
  if (x < 0 || x > maxWidth) {return false;}
  if (y < 0 || y > maxHeight) {return false;}
  return true;
};

// 2D rect collision detection based of: 
// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
Entity.prototype.hasCollidedWith = function (entity) {
  var rect1 = {
    x: this.state.position.x,
    y: this.state.position.y,
    width: this.sprite.width,
    height: this.sprite.height
  };
  var rect2 = {
    x: entity.state.position.x,
    y: entity.state.position.y,
    width: entity.sprite.width,
    height: entity.sprite.height
  };
  return rect1.x < rect2.x + 
    rect2.width && rect1.x + 
    rect1.width > rect2.x && 
    rect1.y < rect2.y + 
    rect2.height && rect1.height + 
    rect1.y > rect2.y;
};

Entity.prototype.kill = function () {
  this.state.killed = true;
  return this;
};

// Delegates to our delegate objects methods on its prototype chain
Entity.prototype.update = function () {
  return this.delegate.update.apply(this, arguments);
};

Entity.prototype.render = function () {
  return this.delegate.render.apply(this, arguments);
};

Entity.prototype.collision = function () {
  return this.delegate.collision.apply(this, arguments);  
};

Entity.prototype.reset = function () {
  return this.delegate.reset.apply(this, arguments);
};

module.exports = Entity;