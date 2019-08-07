module.exports = function(win) {
  global.setFullscreen = el => {
    if (!el) {
      // istanbul ignore next
      if ('exitFullscreen' in document) {
        document.exitFullscreen();
      } else if ('webkitExitFullscreen' in document) {
        document.webkitExitFullscreen();
      } else if ('mozCancelFullScreen' in document) {
        document.mozCancelFullScreen();
      } else if ('msExitFullscreen' in document) {
        document.msExitFullscreen();
      }
      return;
    }

    // istanbul ignore next
    if ('requestFullscreen' in el) {
      el.requestFullscreen();
    } else if ('webkitRequestFullscreen' in el) {
      el.webkitRequestFullscreen();
    } else if ('mozRequestFullScreen' in el) {
      el.mozRequestFullScreen();
    }
  };

  // @TODO: in Element.proto.on() check for an "on" + EventName property on this before using addEventListener
  // @TODO: Allow for event to be an array for Element.proto.on(['webkitfullscreenchange', 'mozfull...'], fn);
  global.onFullscreenChange = ev => {
    document.addEventListener('webkitfullscreenchange', ev, false);
    document.addEventListener('mozfullscreenchange', ev, false);
    document.addEventListener('fullscreenchange', ev, false);
    document.addEventListener('MSFullscreenChange', ev, false);
  };

  global.isFullscreen = () => {
    return (
      // istanbul ignore else
      document.webkitIsFullScreen ||
      document.mozFullScreen ||
      document.msFullscreenElement ||
      document.isFullscreen
    );
  };
};
