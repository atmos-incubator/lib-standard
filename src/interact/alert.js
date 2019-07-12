(function(orig) {
  // @NOTE: alert is subclassed in a web context because native alerts are not good. You can access the native version
  // via `alert.orig('hi');`
  global.alert = global.log;
  global.alert.orig = orig;
})(global.alert);
