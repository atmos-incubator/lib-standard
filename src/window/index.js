// istanbul ignore next because these events don't execute in jsdom
(function() {
  window.addEventListener('load', () => global.onLoad());
  document.addEventListener('DOMContentLoaded', () => global.onLoad(), false);
  window.addEventListener('onbeforeunload', () => global.onUnload(), false);
})();

(function() {
  Standard.DOM = function(win) {
    // Incorporate dom prototypes for standard features
    Standard.ize([
      win.Element.prototype,
      win.HTMLDocument.prototype,
      // @EG: elem.classList
      win.DOMTokenList.prototype
    ]);

    require('./listener.js')(win);
    require('./el.js')(win);
    require('./find.js')(win);
    require('./fullscreen.js')(win);
    require('./media.js')(win);
    require('./fetch.js')(win);
    require('./sha.js')(win);
  };

  Standard.DOM(window);
})();
