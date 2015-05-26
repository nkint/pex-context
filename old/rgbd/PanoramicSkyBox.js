// Generated by CoffeeScript 1.6.2
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Color, Context, Material, ObjectUtils, PanoramicSkyBox, PanoramicSkyBoxGLSL, Program, Vec3;

  Material = require('pex/materials/Material');
  Context = require('pex/gl/Context');
  Program = require('pex/gl/Program');
  ObjectUtils = require('pex/utils/ObjectUtils');
  Vec3 = require('pex/geom/Vec3');
  Color = require('pex/color/Color');
  PanoramicSkyBoxGLSL = require('lib/text!materials/PanoramicSkyBox.glsl');
  return PanoramicSkyBox = (function(_super) {
    __extends(PanoramicSkyBox, _super);

    function PanoramicSkyBox(uniforms) {
      var defaults, program;

      this.gl = Context.currentContext.gl;
      program = new Program(PanoramicSkyBoxGLSL);
      defaults = {
        eyePos: new Vec3(0, 0, 0),
        skyBox: 0,
        refraction: 0,
        reflection: 0,
        glass: 0
      };
      uniforms = ObjectUtils.mergeObjects(defaults, uniforms);
      PanoramicSkyBox.__super__.constructor.call(this, program, uniforms);
    }

    return PanoramicSkyBox;

  })(Material);
});
