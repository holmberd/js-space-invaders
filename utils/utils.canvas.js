/** 
 * Canvas Module
 * Create main canvas for the game.
 */

function generateCanvas(w, h) {
  console.log('Generating canvas...');

  var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');

  // Set the `canvas` width & height
  canvas.width = w;
  canvas.height = h;

  return canvas;
}

module.exports = generateCanvas;