/* istanbul ignore next because these events don't execute in jsdom */
(function() {
  window.addEventListener('load', () => global.onLoad());
  document.addEventListener('DOMContentLoaded', () => global.onLoad(), false);
  window.addEventListener('onbeforeunload', () => global.onUnload(), false);
})();

(function() {
  Standard.DOM = function(win) {
    // Incorporate dom prototypes for standard features
    Standard.ize([win.Element.prototype, win.HTMLDocument.prototype]);

    require('./find.js')(win);
  };

  Standard.DOM(window);
})();
