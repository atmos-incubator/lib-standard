module.exports = function(win) {
  Object.defineProperty(win.HTMLVideoElement.prototype, 'isPlaying', {
    get: function() {
      return !!(
        // istanbul ignore next in jsdom environment
        this.currentTime > 0 &&
        !this.paused &&
        !this.ended &&
        this.readyState > 2
      );
    }
  });
};
