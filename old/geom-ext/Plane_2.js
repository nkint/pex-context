// Generated by CoffeeScript 1.6.2
define(function(require) {
  var Plane;

  return Plane = (function() {
    var Vec2, Vec3, abs, sqrt;

    Vec3 = require('pex/geom/Vec3');

    Vec2 = require('pex/geom/Vec2');

    abs = Math.abs, sqrt = Math.sqrt;

    function Plane(point, normal) {
      var invLen;

      this.point = point;
      this.N = normal;
      this.U = new Vec3();
      this.V = new Vec3();
      if (abs(this.N.x) > abs(this.N.y)) {
        invLen = 1 / sqrt(this.N.x * this.N.x + this.N.z * this.N.z);
        this.U.set(this.N.x * invLen, 0, -this.N.z * invLen);
      } else {
        invLen = 1 / sqrt(this.N.y * this.N.y + this.N.z * this.N.z);
        this.U.set(0, this.N.z * invLen, -this.N.y * invLen);
      }
      this.V.setVec3(this.N).cross(this.U);
    }

    Plane.prototype.project = function(p) {
      var D, projected, scale, scaled;

      D = Vec3.create().asSub(p, this.point);
      scale = D.dot(this.N);
      scaled = this.N.clone().scale(scale);
      return projected = p.clone().sub(scaled);
    };

    Plane.prototype.rebase = function(p) {
      var diff, x, y;

      diff = p.dup().sub(this.point);
      x = this.U.dot(diff);
      y = this.V.dot(diff);
      return new Vec2(x, y);
    };

    return Plane;

  })();
});
