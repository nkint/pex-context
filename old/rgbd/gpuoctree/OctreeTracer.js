// Generated by CoffeeScript 1.6.2
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Color, Cube, Mat4, Mesh, OctreeTracer, OctreeTracerMaterial, SolidColor;

  Mesh = require('pex/gl').Mesh;
  Cube = require('pex/geom/gen').Cube;
  SolidColor = require('pex/materials').SolidColor;
  Color = require('pex/color').Color;
  Mat4 = require('pex/geom').Mat4;
  OctreeTracerMaterial = require('OctreeTracerMaterial');
  return OctreeTracer = (function(_super) {
    __extends(OctreeTracer, _super);

    function OctreeTracer(octree, octreeTexture) {
      this.octree = octree;
      this.octreeTexture = octreeTexture;
      OctreeTracer.__super__.constructor.call(this, new Cube(), new OctreeTracerMaterial());
      this.position.copy(this.octree.root.size).scale(0.5).add(this.octree.root.position);
      this.scale.copy(this.octree.root.size);
    }

    OctreeTracer.prototype.draw = function(camera) {
      var m;

      m = Mat4.create().copy(camera.getViewMatrix()).invert();
      this.material.uniforms.invViewMatrix = m;
      this.material.uniforms.camPos = camera.getPosition();
      this.material.uniforms.near = camera.getNear();
      this.material.uniforms.far = camera.getFar();
      this.material.uniforms.center = this.position;
      this.material.uniforms.size = this.scale;
      return OctreeTracer.__super__.draw.call(this, camera);
    };

    return OctreeTracer;

  })(Mesh);
});
