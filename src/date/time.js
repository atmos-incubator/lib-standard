(function() {
  const u = {};
  u.second = 1000;
  u.minute = 60 * u.second;
  u.hour = 60 * u.minute;
  u.day = 24 * u.hour;

  Object.proto(Number.prototype, 'days', function() {
    return this.valueOf() * u.day;
  });
})();
