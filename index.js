/**
 * Modified from: https://github.com/RyanMullins/angular-hammer/blob/master/angular.hammer.js
 *
 * Prevent click events after a touchend.
 *
 * Inspired/copy-paste from this article of Google by Ryan Fioravanti
 * https://developers.google.com/mobile/articles/fast_buttons#ghost
*/

module.exports = function (element) {
  if (!element) { return; }

  var coordinates = [],
      threshold = 25,
      timeout = 2500;

  if ('ontouchstart' in window) {
    element[0].addEventListener('touchstart', resetCoordinates, true);
    element[0].addEventListener('touchend', registerCoordinates, true);
    element[0].addEventListener('click', preventGhostClick, true);
    element[0].addEventListener('mouseup', preventGhostClick, true);
  }

  /**
   * prevent clicks if they're in a registered XY region
   * @param {MouseEvent} ev
   */
  function preventGhostClick (ev) {
    for (var i = 0; i < coordinates.length; i++) {
      var x = coordinates[i][0];
      var y = coordinates[i][1];

      // within the range, so prevent the click
      if (Math.abs(ev.clientX - x) < threshold &&
          Math.abs(ev.clientY - y) < threshold) {
        ev.stopPropagation();
        ev.preventDefault();
        break;
      }
    }
  }

  /**
   * reset the coordinates array
   */
  function resetCoordinates () {
    coordinates = [];
  }

  /**
   * remove the first coordinates set from the array
   */
  function popCoordinates () {
    coordinates.splice(0, 1);
  }

  /**
   * if it is an final touchend, we want to register it's place
   * @param {TouchEvent} ev
   */
  function registerCoordinates (ev) {
    // touchend is triggered on every releasing finger
    // changed touches always contain the removed touches on a touchend
    // the touches object might contain these also at some browsers (firefox os)
    // so touches - changedTouches will be 0 or lower, like -1, on the final touchend
    if(ev.touches.length - ev.changedTouches.length <= 0) {
      var touch = ev.changedTouches[0];
      coordinates.push([touch.clientX, touch.clientY]);

      setTimeout(popCoordinates, timeout);
    }
  }
}
