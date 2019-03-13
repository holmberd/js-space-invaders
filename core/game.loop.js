/** 
 * Game Loop Module
 * This module contains the game loop, which handles updating the game state and re-rendering the canvas
 * (using the updated state) at the configured FPS. (https://github.com/aesinv/javascript-game-demo)
 */
function gameLoop(scope) {
  var loop = {};

  // Initialize timer variables so we can calculate FPS
  var fps = scope.constants.targetFps; // Our target fps
  var fpsInterval = 1000 / fps; // the interval between animation ticks, in ms (1000 / 60 = ~16.666667)
  var before = window.performance.now(); // The starting times timestamp

  // Set up an object to contain our alternating FPS calculations
  var cycles = {
    new: {
      frameCount: 0, // Frames since the start of the cycle
      startTime: before, // The starting timestamp
      sinceStart: 0 // time elapsed since the startTime
    },
    old: {
      frameCount: 0,
      startTime: before,
      sineStart: 0
    }
  };
  // Alternating Frame Rate vars
  var resetInterval = 5; // Frame rate cycle reset interval (in seconds)
  var resetState = 'new'; // The initial frame rate cycle

  loop.fps = 0; // A prop that will expose the current calculated FPS to other modules

  // Main game rendering loop
  loop.main = function mainLoop (tframe) {
    // Request a new Animation Frame
    // setting to `stopLoop` so animation can be stopped via
    // `window.cancelAnimationFrame( loop.stopLoop )`
    loop.stopLoop = window.requestAnimationFrame( loop.main );

    // How long ago since last loop?
    var now = tframe;
    var elapsed = now - before;
    var activeCycle;
    var targetResetInterval;

    // If it's been at least our desired interval, render
    if (elapsed > fpsInterval) {
      // Set before = now for next frame, also adjust for
      // specified fpsInterval not being a multiple of rAF's interval (16.7ms)
      // ( http://stackoverflow.com/a/19772220 )
      before = now - (elapsed % fpsInterval);

      // Increment the vals for both the active and the alternate FPS calculations
      for (var calc in cycles) {
        ++cycles[calc].frameCount;
        cycles[calc].sinceStart = now - cycles[calc].startTime;
      }

      // Choose the correct FPS calculation, then update the exposed fps value
      activeCycle = cycles[resetState];
      loop.fps = Math.round(1000 / (activeCycle.sinceStart / activeCycle.frameCount) * 100) / 100;

      // If our frame counts are equal....
      targetResetInterval = (cycles.new.frameCount === cycles.old.frameCount ? 
        resetInterval * fps : // Wait our interval
        (resetInterval * 2) * fps); // Wait double our interval

      // If the active calculation goes over our specified interval,
      // reset it to 0 and flag our alternate calculation to be active
      // for the next series of animations.
      if (activeCycle.frameCount > targetResetInterval) {
        cycles[resetState].frameCount = 0;
        cycles[resetState].startTime = now;
        cycles[resetState].sinceStart = 0;

        resetState = (resetState === 'new' ? 'old' : 'new');
      }

      // Update the game state
      scope.update(now);
      // Calculate collisions in state
      scope.collision();
      // Render the next frame
      scope.render();
    }
  };

  // Start off main loop
  loop.main();

  return loop;
}

module.exports = gameLoop;