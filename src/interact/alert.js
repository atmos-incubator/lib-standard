(function(orig) {
  // @NOTE: alert is subclassed in a web context because native alerts are not good.
  // @BUG: You can access the native version via `alert.orig('hi');` but calling it will fail until there's a workaround
  global.alert = global.log;
  // istanbul ignore next
  global.alert.orig = orig ? orig.bind(orig) : noop;
})(global.alert);
