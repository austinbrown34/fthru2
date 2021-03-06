// Generated by CoffeeScript 1.6.1
(function() {
  var Watcher, update, watcher;

  Watcher = function() {
    var success,
      _this = this;
    this.position = [0, 0];
    this.velocity = [0, 0];
    this.time = Date.now();
    success = function(position) {
      var delta, lat, lon, t2;
      lat = position.latitude;
      lon = position.longiture;
      t2 = Date.now();
      delta = t2 - _this.time;
      _this.time = t2;
      _this.velocity[0] = (lat - _this.position[0]) / delta;
      _this.velocity[1] = (lon - _this.position[1]) / delta;
      _this.position[0] = lat;
      return _this.position[1] = lon;
    };
    return navigator.geolocation.watchPosition(success);
  };

  Watcher.prototype.getPosition = function() {
    var delta, position;
    delta = Date.now() - this.time;
    return position = [this.position[0] + (this.velocity[0] * delta), this.position[0] + (this.velocity[1] * delta)];
  };

  watcher = new Watcher();

  update = function() {
    var position;
    position = watcher.getPosition();
    return console.log(position);
  };

  setTimeout(update, 100);

}).call(this);
