// Generated by CoffeeScript 1.6.2
define(function(require) {
  var PI, Panner, Time, Vec2, Vec3, cos, sin, _ref;

  _ref = require('pex/geom'), Vec2 = _ref.Vec2, Vec3 = _ref.Vec3;
  Time = require('pex/utils').Time;
  PI = Math.PI, cos = Math.cos, sin = Math.sin;
  return Panner = (function() {
    function Panner(window, camera, distance) {
      var dragRotationBaseAngle;

      this.window = window;
      this.camera = camera;
      this.enabled = true;
      this.allowZooming = true;
      this.distance = distance || 2;
      this.minDistance = distance * 0.025 || 0.025;
      this.maxDistance = distance * 2 || 5;
      this.clickPos = new Vec2(0, 0);
      this.dragDiff = new Vec2(0, 0);
      this.panScale = 0.01;
      this.upAxis = new Vec3(0, 0, 0);
      this.forwardAxis = new Vec3(0, 0, 0);
      this.rightAxis = new Vec3(0, 0, 0);
      this.cameraClickPos = new Vec3(0, 0, 0);
      this.cameraClickTarget = new Vec3(0, 0, 0);
      this.dragCenter = new Vec3();
      this.dragStart = new Vec3();
      this.dragDelta = new Vec3();
      this.dragScale = new Vec3();
      this.dragStartCameraUp = new Vec3();
      this.dragStartCameraRight = new Vec3();
      this.up = null;
      this.cameraUp = new Vec3();
      this.rotation = 0;
      dragRotationBaseAngle = 0;
      this.dragRotationInit = false;
      this.dragRotationStartAngle = 0;
      this.dragging = false;
      this.addEventHanlders();
    }

    Panner.prototype.addEventHanlders = function() {
      var _this = this;

      this.window.on('leftMouseDown', function(e) {
        if (e.handled || !_this.enabled) {
          return;
        }
        _this.dragging = true;
        return _this.down(e.x, _this.window.height - e.y, e);
      });
      this.window.on('mouseDragged', function(e) {
        if (e.handled || !_this.enabled || !_this.dragging) {
          return;
        }
        return _this.drag(e.x, _this.window.height - e.y, e);
      });
      this.window.on('leftMouseUp', function(e) {
        return _this.dragging = false;
      });
      return this.window.on('scrollWheel', function(e) {
        if (e.handled || !_this.enabled) {
          return;
        }
        if (!_this.allowZooming) {
          return;
        }
        _this.distance = Math.min(_this.maxDistance, Math.max(_this.distance + e.dy / 1000 * (_this.maxDistance - _this.minDistance), _this.minDistance));
        return _this.updateCamera();
      });
    };

    Panner.prototype.down = function(x, y, e) {
      var hits, ray;

      this.dragCenter.setVec3(this.camera.getTarget());
      ray = this.camera.getWorldRay(e.x, e.y, this.window.width, this.window.height);
      this.up = Vec3.create().asSub(this.camera.getPosition(), this.camera.getTarget()).normalize();
      hits = ray.hitTestPlane(this.dragCenter, this.up);
      this.dragStart.setVec3(hits[0]);
      this.dragDelta.asSub(hits[0], this.dragCenter);
      this.dragRotationInit = false;
      this.dragStartCameraUp.setVec3(this.camera.getUp());
      return this.dragStartCameraRight.asCross(this.dragStartCameraUp, this.up);
    };

    Panner.prototype.drag = function(x, y, e) {
      var angle, diff, dragRotationDiffAngle, hits, newUp, radians, ray, u, v;

      ray = this.camera.getWorldRay(e.x, e.y, this.window.width, this.window.height);
      hits = ray.hitTestPlane(this.dragCenter, this.up);
      if (!e.shift && !e.option) {
        diff = Vec3.create().asSub(this.dragStart, hits[0]);
        this.camera.getTarget().setVec3(this.dragCenter).add(diff);
        this.updateCamera();
        this.dragCenter.setVec3(this.camera.getTarget());
      }
      if (e.option) {
        this.dragDelta.asSub(hits[0], this.camera.getTarget());
        radians = Math.atan2(-(y - this.window.height / 2), x - this.window.width / 2);
        angle = Math.floor(radians * 180 / Math.PI);
        if (!this.dragRotationInit) {
          this.dragRotationInit = true;
          this.dragRotationBaseAngle = angle;
        }
        dragRotationDiffAngle = angle - this.dragRotationBaseAngle;
        this.rotation = this.dragRotationStartAngle + dragRotationDiffAngle;
        u = cos((this.rotation + 90) / 180 * PI);
        v = sin((this.rotation + 90) / 180 * PI);
        newUp = new Vec3(this.dragStartCameraRight.x * u + this.dragStartCameraUp.x * v, this.dragStartCameraRight.y * u + this.dragStartCameraUp.y * v, this.dragStartCameraRight.z * u + this.dragStartCameraUp.z * v).normalize();
        return this.camera.setUp(newUp);
      }
    };

    Panner.prototype.updateCamera = function() {
      if (!this.up) {
        this.up = Vec3.create().asSub(this.camera.getPosition(), this.camera.getTarget()).normalize();
      }
      this.camera.getPosition().setVec3(this.up).scale(this.distance).add(this.camera.getTarget());
      return this.camera.updateMatrices();
    };

    return Panner;

  })();
});
