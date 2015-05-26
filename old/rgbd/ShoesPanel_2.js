// Generated by CoffeeScript 1.6.2
define(function(require) {
  var Arcball, BoundingBox, CameraOrbiter, Color, Context, Cube, LogoFx, Mesh, ObjReader, PerspectiveCamera, Quat, Rect, Scene, ScreenImage, ShoesPanel, ShowNormals, SolidColor, Test, Texture2D, Textured, Time, Vec3, Viewport, _ref, _ref1, _ref2, _ref3, _ref4;

  _ref = require('pex/gl'), Viewport = _ref.Viewport, Mesh = _ref.Mesh, Context = _ref.Context, Texture2D = _ref.Texture2D, ScreenImage = _ref.ScreenImage;
  _ref1 = require('pex/scene'), Scene = _ref1.Scene, PerspectiveCamera = _ref1.PerspectiveCamera, Arcball = _ref1.Arcball;
  _ref2 = require('pex/geom'), Rect = _ref2.Rect, BoundingBox = _ref2.BoundingBox;
  Cube = require('pex/geom/gen').Cube;
  Test = require('pex/materials').Test;
  Color = require('pex/color').Color;
  _ref3 = require('pex/geom'), Quat = _ref3.Quat, Vec3 = _ref3.Vec3;
  Time = require('pex/utils').Time;
  _ref4 = require('pex/materials'), ShowNormals = _ref4.ShowNormals, Test = _ref4.Test, SolidColor = _ref4.SolidColor, Textured = _ref4.Textured;
  ObjReader = require('utils/ObjReader');
  CameraOrbiter = require('utils/CameraOrbiter');
  LogoFx = require('./LogoFx');
  return ShoesPanel = (function() {
    ShoesPanel.prototype.progress = 0;

    function ShoesPanel(window) {
      var _this = this;

      this.window = window;
      this.scenes = [];
      this.shoeViewportSize = 112;
      this.bounds = new Rect(20, 20, this.shoeViewportSize, this.shoeViewportSize);
      this.bounds2 = new Rect(20, 20 + this.shoeViewportSize, this.shoeViewportSize, this.shoeViewportSize * 73 / 409);
      this.defaultBounds = new Rect(20, 20, this.shoeViewportSize, this.shoeViewportSize);
      this.hoverBounds = new Rect(10, 10, this.shoeViewportSize * 1.2, this.shoeViewportSize * 1.2);
      this.defaultBounds2 = new Rect(20, 20 + this.shoeViewportSize, this.shoeViewportSize, this.shoeViewportSize * 73 / 409);
      this.hoverBounds2 = new Rect(10, 20 + this.shoeViewportSize, this.defaultBounds2.width * 1.2, this.defaultBounds2.height * 1.2);
      this.targetBounds = this.defaultBounds;
      this.targetBounds2 = this.defaultBounds2;
      this.logoFx = new LogoFx(this.window, 0, this.shoeViewportSize, this.shoeViewportSize);
      this.logoFx2 = new LogoFx(this.window, 20 + this.shoeViewportSize - this.shoeViewportSize / 2, this.shoeViewportSize, this.shoeViewportSize / 4);
      this.logo = new ScreenImage(Texture2D.load('assets/images/stussy_w.png'), 20, 20, this.shoeViewportSize, this.shoeViewportSize, this.window.width, this.window.height);
      this.timber = new ScreenImage(Texture2D.load('assets/images/TIMBERLAND_white_sm.png'), 20, 20 + this.shoeViewportSize, this.shoeViewportSize, this.shoeViewportSize * 73 / 409, this.window.width, this.window.height);
      this.bg = new ScreenImage(Texture2D.load('assets/images/sidepanelbg.png'), 0, 0, this.shoeViewportSize + 50, this.window.height, this.window.width, this.window.height);
      this.addShoe('06_Shoe1_Brown', false);
      this.addShoe('07_Shoe2_Camel', false);
      this.addShoe('08_Shoe3_Black', false);
      this.clickableThings = [this.logo, this.timber, this.scenes[0], this.scenes[1], this.scenes[2]];
      this.clickableThings.forEach(function(thing, thingIndex) {
        if (thing.mesh) {
          thing.y = thing.mesh.material.uniforms.pixelPosition.y;
          thing.height = thing.mesh.material.uniforms.pixelSize.y;
        }
        if (thing.viewport) {
          thing.y = thing.viewport.bounds.y;
          return thing.height = thing.viewport.bounds.height;
        }
      });
      this.window.on('mouseMoved', function(e) {
        _this.targetBounds = _this.defaultBounds;
        _this.targetBounds2 = _this.defaultBounds2;
        _this.logoFx.targetAmount = 0;
        _this.logoFx2.targetAmount = 0;
        return _this.clickableThings.forEach(function(thing, thingIndex) {
          if (e.x < _this.shoeViewportSize + 50 && e.y > thing.y && e.y < thing.y + thing.height) {
            if (thingIndex === 0) {
              _this.targetBounds = _this.hoverBounds;
              return _this.logoFx.targetAmount = 1;
            } else if (thingIndex === 1) {
              _this.logoFx2.targetAmount = 1;
              return _this.targetBounds2 = _this.hoverBounds2;
            }
          }
        });
      });
      this.window.on('leftMouseDown', function(e) {
        return _this.clickableThings.forEach(function(thing, thingIndex) {
          if (e.x < _this.shoeViewportSize + 50 && e.y > thing.y && e.y < thing.y + thing.height) {
            if (thingIndex === 0 || thingIndex === 1) {
              _this.window.effectId = (_this.window.effectId + 1) % _this.window.numEffects;
              console.log('rot', _this.window.effectId);
            } else {
              _this.window.effectId = thingIndex - 2;
              console.log('switch', _this.window.effectId);
            }
            return e.handled = true;
          }
        });
      });
    }

    ShoesPanel.prototype.addShoe = function(name, clearColor, i) {
      var camera, modelPath, modelTexture, scene, self, texturePath, viewport,
        _this = this;

      viewport = new Viewport(this.window, new Rect(20, this.shoeViewportSize * 1.5 + this.scenes.length * this.shoeViewportSize, this.shoeViewportSize, this.shoeViewportSize));
      scene = new Scene();
      scene.id = i;
      scene.setClearColor(clearColor);
      scene.setViewport(viewport);
      camera = new PerspectiveCamera(60, 1);
      scene.add(camera);
      this.scenes.push(scene);
      modelPath = "assets/models/" + name + "/" + name + ".obj";
      texturePath = "assets/models/" + name + "/" + name + ".jpg";
      modelTexture = Texture2D.load(texturePath);
      self = this;
      return ObjReader.load(modelPath, function(geom) {
        var bbox, bboxSize, gl, r, shoeMesh;

        gl = Context.currentContext.gl;
        bbox = BoundingBox.fromPoints(geom.vertices);
        bboxSize = bbox.getSize();
        r = Math.max(bboxSize.x, bboxSize.y, bboxSize.z);
        scene.cameras[0].setFar(20);
        scene.orbiter = new CameraOrbiter(scene.cameras[0], r * 1.2);
        scene.orbiter.target = bbox.getCenter();
        scene.orbiter.update();
        shoeMesh = new Mesh(geom, new Textured({
          texture: modelTexture
        }));
        scene.add(shoeMesh);
        return _this.progress += 1 / 3;
      });
    };

    ShoesPanel.prototype.draw = function() {
      var gl, scene, _i, _len, _ref5;

      gl = Context.currentContext.gl;
      this.bounds.x += (this.targetBounds.x - this.bounds.x) * 0.1;
      this.bounds.y += (this.targetBounds.y - this.bounds.y) * 0.1;
      this.bounds.width += (this.targetBounds.width - this.bounds.width) * 0.1;
      this.bounds.height += (this.targetBounds.height - this.bounds.height) * 0.1;
      this.bounds2.x += (this.targetBounds2.x - this.bounds2.x) * 0.1;
      this.bounds2.y += (this.targetBounds2.y - this.bounds2.y) * 0.1;
      this.bounds2.width += (this.targetBounds2.width - this.bounds2.width) * 0.1;
      this.bounds2.height += (this.targetBounds2.height - this.bounds2.height) * 0.1;
      this.logo.setBounds(this.bounds);
      this.timber.setBounds(this.bounds2);
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      this.bg.draw();
      gl.blendFunc(gl.SRC_COLOR, gl.ONE);
      gl.disable(gl.DEPTH_TEST);
      this.logo.draw();
      this.timber.draw();
      gl.enable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);
      _ref5 = this.scenes;
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        scene = _ref5[_i];
        if (scene.orbiter) {
          scene.orbiter.phi += Time.delta * 30;
          scene.orbiter.update();
        }
        scene.draw();
      }
      this.logoFx.draw();
      return this.logoFx2.draw();
    };

    return ShoesPanel;

  })();
});
