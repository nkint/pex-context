// Generated by CoffeeScript 1.6.2
define(function(require) {
  var Arcball, CameraOrbiterTouch, Color, Config, Context, Cube, Cylinder, Diffuse, Dodecahedron, Edge, Gene, Geometry, Herb, HexSphere, Icosahedron, Instance, LineBuilder, Mat4, MathUtils, Mesh, Octahedron, PI, PerspectiveCamera, Platform, Quat, RenderTarget, Scene, ScreenImage, ShowDepth, ShowNormals, SolidColor, Sphere, Spline3D, Texture2D, Time, Vec3, Viewport, Window, abs, cos, exp, floor, gh, hem, lerp, log, map, max, min, pex, random, randomChance, randomFloat, randomVec3, seed, sin, sqrt, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;

  pex = require('pex');
  _ref = pex.sys, Window = _ref.Window, Platform = _ref.Platform;
  _ref1 = pex.scene, PerspectiveCamera = _ref1.PerspectiveCamera, Arcball = _ref1.Arcball, Scene = _ref1.Scene;
  _ref2 = pex.materials, SolidColor = _ref2.SolidColor, Diffuse = _ref2.Diffuse, ShowDepth = _ref2.ShowDepth, ShowNormals = _ref2.ShowNormals;
  _ref3 = pex.gl, Mesh = _ref3.Mesh, Texture2D = _ref3.Texture2D, RenderTarget = _ref3.RenderTarget, Viewport = _ref3.Viewport, ScreenImage = _ref3.ScreenImage, Context = _ref3.Context;
  _ref4 = pex.geom, hem = _ref4.hem, Vec3 = _ref4.Vec3, Geometry = _ref4.Geometry, Edge = _ref4.Edge, Mat4 = _ref4.Mat4, Spline3D = _ref4.Spline3D, Quat = _ref4.Quat;
  _ref5 = pex.geom.gen, Cube = _ref5.Cube, Octahedron = _ref5.Octahedron, Sphere = _ref5.Sphere, Dodecahedron = _ref5.Dodecahedron, Icosahedron = _ref5.Icosahedron, LineBuilder = _ref5.LineBuilder, HexSphere = _ref5.HexSphere;
  Color = pex.color.Color;
  _ref6 = pex.utils, Time = _ref6.Time, MathUtils = _ref6.MathUtils;
  map = MathUtils.map, randomVec3 = MathUtils.randomVec3, randomFloat = MathUtils.randomFloat, randomChance = MathUtils.randomChance, seed = MathUtils.seed;
  cos = Math.cos, sin = Math.sin, PI = Math.PI, sqrt = Math.sqrt, abs = Math.abs, random = Math.random, floor = Math.floor, min = Math.min, max = Math.max, exp = Math.exp, log = Math.log;
  CameraOrbiterTouch = require('utils/CameraOrbiterTouch');
  Cylinder = require('geom/gen/Cylinder');
  Config = require('flora/game/Config');
  Gene = require('flora/plants/Gene');
  gh = require('geom/gh');
  Instance = require('flora/plants/Instance');
  lerp = function(va, vb, t) {
    return Vec3.create(va.x + (vb.x - va.x) * t, va.y + (vb.y - va.y) * t, va.z + (vb.z - va.z) * t);
  };
  return Herb = (function() {
    function Herb(app) {
      this.app = app;
      this.type = 'herb';
      this.gl = Context.currentContext.gl;
      this.camera = new PerspectiveCamera(60, this.app.width / this.app.height);
      if (this.app.on) {
        this.cameraController = new CameraOrbiterTouch(this.app, this.camera, 2.5, 45);
      }
      this.randomSeed = Date.now();
      this.genes = {
        density: new Gene('density', 0.3, 0.1, 1),
        branch: new Gene('branch', 4, 3, 13),
        leafSize: new Gene('leafSize', 0.7, 0.5, 2),
        leafLength: new Gene('leafLength', 0.7, 0.2, 1),
        flower: new Gene('flower', 0, 0, 1)
      };
      this.material = new SolidColor({
        color: Config.colors.green
      });
      this.materialFill = new SolidColor({
        color: Color.Black
      });
      this.darkGoldMaterial = new SolidColor({
        color: Config.secondaryColors.green
      });
      this.geom = hem().fromGeometry(new Cube(0.5));
      this.geom.subdivide();
      this.geom.extrude(0.35);
      this.geom.subdivide();
      this.geom = this.geom.toFlatGeometry();
      this.mesh = new Mesh(this.geom, this.material, {
        useEdges: true
      });
      this.meshFill = new Mesh(this.geom, this.materialFill);
      this.globeGeom = new HexSphere(6);
      this.globeGeom = hem().fromGeometry(this.globeGeom).triangulate().toFlatGeometry();
      this.globeGeom.computeEdges();
      this.globe = new Mesh(this.globeGeom, this.darkGoldMaterial, {
        useEdges: true
      });
      this.flowerGeom = new Cube(0.13, 0.13, 0.13);
      this.flowerGeom = hem().fromGeometry(this.flowerGeom).subdivide().toFlatGeometry();
      this.flowerGeom.computeEdges();
      this.flowerMesh = new Mesh(this.flowerGeom, new Diffuse({
        diffuseColor: Config.colors.pink
      }));
      this.stemGeom = new Cube(0.02, 0.02, 0.25);
      this.stemGeom.computeEdges();
      this.stemGeom.translate(new Vec3(0, 0, 0.125));
      this.stemMesh = new Mesh(this.stemGeom, new SolidColor({
        color: Color.Black
      }));
      this.stemMeshEdges = new Mesh(this.stemGeom, new SolidColor({
        color: Config.colors.green
      }), {
        useEdges: true
      });
      this.leafGeom = new Cube(0.06, 0.03, 0.15);
      this.leafGeom.translate(new Vec3(0, 0, 0.12));
      this.leafMesh = new Mesh(this.leafGeom, new Diffuse({
        color: Config.colors.green
      }));
      this.stemInstances = [];
      this.flowerInstances = [];
      this.leafInstances = [];
      this.lineBuilder = new LineBuilder();
      this.lineBuilder.addLine(new Vec3(0, 0, 0), new Vec3(0, 0, 0));
      this.lines = new Mesh(this.lineBuilder, new SolidColor(), {
        useEdges: true
      });
    }

    Herb.prototype.rebuild = function() {
      var addFruit, addLeaf, basePos, dir, flowerInstance, i, kick, leafInstance, makeBranch, oldFruit, oldLeaf, oldStem, stemInstance, _i, _j, _k, _l, _len, _len1, _len2, _ref10, _ref7, _ref8, _ref9, _results,
        _this = this;

      this.lineBuilder.reset();
      stemInstance = 0;
      leafInstance = 0;
      flowerInstance = 0;
      _ref7 = this.stemInstances;
      for (_i = 0, _len = _ref7.length; _i < _len; _i++) {
        oldStem = _ref7[_i];
        oldStem.targetScale.set(0, 0, 0);
      }
      _ref8 = this.leafInstances;
      for (_j = 0, _len1 = _ref8.length; _j < _len1; _j++) {
        oldLeaf = _ref8[_j];
        oldLeaf.targetScale.set(0, 0, 0);
      }
      _ref9 = this.flowerInstances;
      for (_k = 0, _len2 = _ref9.length; _k < _len2; _k++) {
        oldFruit = _ref9[_k];
        oldFruit.targetScale.set(0, 0, 0);
      }
      addLeaf = function(pos, dir) {
        var leaf, look, scale;

        if (!_this.leafInstances[leafInstance]) {
          _this.leafInstances[leafInstance] = new Instance();
        }
        leaf = _this.leafInstances[leafInstance];
        leaf.position.setVec3(pos);
        leaf.targetPosition.setVec3(pos);
        scale = _this.genes.leafSize.value;
        leaf.targetScale.set(scale, scale, scale);
        look = randomVec3(0.2);
        look.y = 0;
        look.add(dir);
        leaf.targetRotation.copy(Quat.fromDirection(look));
        if (!leaf.uniforms) {
          leaf.uniforms = {};
        }
        leaf.uniforms.diffuseColor = Config.colors.green.clone();
        leaf.uniforms.diffuseColor.r *= randomFloat(0.8, 1.2);
        leaf.uniforms.diffuseColor.b *= randomFloat(0.8, 1.2);
        if (!randomChance(_this.genes.density.value)) {
          leaf.targetScale.set(0, 0, 0);
        }
        return leafInstance++;
      };
      addFruit = function(pos, dir) {
        var flower;

        if (!_this.flowerInstances[flowerInstance]) {
          _this.flowerInstances[flowerInstance] = new Instance();
        }
        flower = _this.flowerInstances[flowerInstance];
        flower.targetPosition.copy(pos);
        flower.targetPosition.add(randomVec3(0.021));
        flower.targetScale.set(0.5, 0.5, 0.5);
        flower.targetRotation.copy(Quat.fromDirection(dir));
        if (!randomChance(_this.genes.flower.value)) {
          flower.targetScale.set(0, 0, 0);
        }
        return flowerInstance++;
      };
      makeBranch = function(startPos, dir, kick, rot) {
        var branchPoints, f, h, i, l, lastSegment, n, p, period, pos, prevP, r, segment, segments, spline, stem, t, _l, _len3, _len4, _m, _n, _o, _p, _results;

        branchPoints = [];
        n = 5;
        prevP = startPos.dup();
        for (i = _l = 0; 0 <= n ? _l < n : _l > n; i = 0 <= n ? ++_l : --_l) {
          t = i / n;
          r = 0.06;
          h = 1;
          period = 2 * PI;
          p = prevP.dup().add(dir.dup().scale(t));
          if (randomChance(0.5) || i === 0) {
            p.add(kick);
          }
          prevP.setVec3(p);
          branchPoints.push(p);
        }
        for (_m = 0, _len3 = branchPoints.length; _m < _len3; _m++) {
          p = branchPoints[_m];
          p.y -= 0.5;
          _this.lineBuilder.addCross(p);
        }
        spline = gh.spline(branchPoints);
        segments = gh.flatten(gh.splitPolylineSegments(gh.makePolyline(gh.divide(spline, 10))));
        dir = new Vec3();
        for (_n = 0, _len4 = segments.length; _n < _len4; _n++) {
          segment = segments[_n];
          if (!_this.stemInstances[stemInstance]) {
            _this.stemInstances[stemInstance] = new Instance();
          }
          stem = _this.stemInstances[stemInstance];
          stem.targetScale.set(1, 1, 1);
          stem.targetPosition.setVec3(segment.from);
          stem.position.setVec3(segment.from);
          dir.asSub(segment.to, segment.from);
          stem.targetRotation.copy(Quat.fromDirection(dir));
          for (l = _o = 0; _o <= 3; l = ++_o) {
            addLeaf(segment.to, dir);
          }
          stemInstance++;
        }
        lastSegment = segments[segments.length - 1];
        dir.asSub(segment.to, segment.from).normalize().scale(0.15);
        _results = [];
        for (f = _p = 0; _p < 7; f = ++_p) {
          t = randomFloat(0, 1);
          pos = lastSegment.to.dup().addScaled(dir, t);
          _results.push(addFruit(pos, dir));
        }
        return _results;
      };
      seed(this.randomSeed);
      _results = [];
      for (i = _l = 0, _ref10 = this.genes.branch.intValue; 0 <= _ref10 ? _l < _ref10 : _l > _ref10; i = 0 <= _ref10 ? ++_l : --_l) {
        basePos = randomVec3(0.5);
        basePos.y = 0;
        dir = new Vec3(0, randomFloat(0.5, 1) * this.genes.leafLength.value, 0);
        kick = basePos.normalize().scale(0.2);
        _results.push(makeBranch(basePos, dir, kick, 0));
      }
      return _results;
    };

    Herb.prototype.animateInstances = function(instances) {
      var instance, instanceIndex, _i, _len, _results;

      _results = [];
      for (instanceIndex = _i = 0, _len = instances.length; _i < _len; instanceIndex = ++_i) {
        instance = instances[instanceIndex];
        _results.push(instance.update());
      }
      return _results;
    };

    Herb.prototype.update = function() {
      if (Time.frameNumber % 3 === 0) {
        this.rebuild();
      }
      if (this.cameraController) {
        this.cameraController.update();
      }
      this.animateInstances(this.stemInstances);
      this.animateInstances(this.flowerInstances);
      return this.animateInstances(this.leafInstances);
    };

    Herb.prototype.draw = function(projectionCamera) {
      var camera;

      this.update();
      camera = projectionCamera || this.camera;
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.disable(this.gl.BLEND);
      this.globe.draw(camera);
      this.lines.draw(camera);
      this.gl.lineWidth(2);
      this.stemMesh.drawInstances(camera, this.stemInstances);
      this.stemMeshEdges.drawInstances(camera, this.stemInstances);
      this.leafMesh.drawInstances(camera, this.leafInstances);
      return this.flowerMesh.drawInstances(camera, this.flowerInstances);
    };

    return Herb;

  })();
});

/*
//@ sourceMappingURL=Herb.map
*/
