(function() {
  // @DOC: provides global aliases to console.log/warn/error

  global.log = (...any) => {
    // @DOC: global alias to console.log #first-argument-return
    console.log.apply(console.log, any);
    return any[0];
  };

  global.warn = (...any) => {
    // @DOC: global alias to console.warn #first-argument-return
    any = ['WARNING: ', ...any];
    console.warn.apply(console.warn, any);
    return any[0];
  };

  global.error = (...any) => {
    // @DOC: global alias to console.error #first-argument-return
    any = ['ERROR: ', ...any];
    console.error.apply(console.error, any);
    return any[0];
  };

  global.debug = (...any) => {
    if (global.debug.hasOwnProperty('on') && global.debug.on === true) {
      console.log.apply(console.log, any);
    }
  };
})();
