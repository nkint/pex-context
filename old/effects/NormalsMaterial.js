// Generated by CoffeeScript 1.6.2
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Color, Context, Material, NormalsMaterial, NormalsMaterialGLSL, ObjectUtils, Program, Vec3;

  Material = require('pex/materials/Material');
  Context = require('pex/gl/Context');
  Program = require('pex/gl/Program');
  ObjectUtils = require('pex/utils/ObjectUtils');
  Vec3 = require('pex/geom/Vec3');
  Color = require('pex/color/Color');
  NormalsMaterialGLSL = require('lib/text!effects/NormalsMaterial.glsl');
  return NormalsMaterial = (function(_super) {
    __extends(NormalsMaterial, _super);

    function NormalsMaterial(uniforms) {
      var defaults, program;

      this.gl = Context.currentContext.gl;
      program = new Program(NormalsMaterialGLSL);
      defaults = {
        pointSize: 2
      };
      uniforms = ObjectUtils.mergeObjects(defaults, uniforms);
      NormalsMaterial.__super__.constructor.call(this, program, uniforms);
    }

    return NormalsMaterial;

  })(Material);
});
