// Generated by CoffeeScript 1.6.2
var BoundingBox, Color, Cube, GUI, Mat4, MathUtils, Mesh, PerspectiveCamera, Platform, Rect, SolidColor, Texture2D, Time, Vec2, Vec3, Vec4, fx, pex, _ref, _ref1, _ref2;

pex = pex || require('./lib/pex');

Platform = pex.sys.Platform;

PerspectiveCamera = pex.scene.PerspectiveCamera;

GUI = pex.gui.GUI;

_ref = pex.geom, Vec2 = _ref.Vec2, Vec3 = _ref.Vec3, Vec4 = _ref.Vec4, Mat4 = _ref.Mat4, Rect = _ref.Rect, BoundingBox = _ref.BoundingBox;

_ref1 = pex.gl, Mesh = _ref1.Mesh, Texture2D = _ref1.Texture2D;

Cube = pex.geom.gen.Cube;

SolidColor = pex.materials.SolidColor;

Color = pex.color.Color;

_ref2 = pex.utils, Time = _ref2.Time, MathUtils = _ref2.MathUtils;

fx = pex.fx;

pex.require(['SourcesScene', 'EffectsScene', 'helpers/BoundingBoxHelper', 'ShoesPanel', 'PeopleCarousel', 'utils/SlidingArcball', 'fx/ThresholdBW', 'fx/Downsample4A', 'fx/Downsample2A', 'fx/RGBShift', 'fx/Scale'], function(SourcesScene, EffectsScene, BoundingBoxHelper, ShoesPanel, PeopleCarousel, SlidingArcball, ThresholdBW, Downsample4A, Downsample2A, RGBShift) {
  var e, rgbdNoWebGL;

  try {
    return pex.sys.Window.create({
      settings: {
        type: '3d',
        fullscreen: false,
        width: Platform.isBrowser ? window.innerWidth : 1280,
        height: 555,
        canvas: Platform.isBrowser ? document.getElementById('webglcanvas') : null
      },
      maxDepth: 5999,
      sourceId: 2,
      effectId: 0,
      numEffects: 4,
      debugMode: false,
      drawMeshes: true,
      drawPeople: true,
      drawFloor: false,
      pointSize: 2,
      showGUI: false,
      mousePos: new Vec3(0, 0),
      distance: 2000,
      minDistance: 500,
      maxDistance: 2500,
      useEffects: true,
      gravitySpeed: -500,
      mouseEffectEnabled: false,
      init: function() {
        var OES_texture_float, closeCredits, closeInstructions, mousewheelevt, openCredits, openInstructions, rgbdCredits, rgbdCreditsBtn, rgbdInfoBtn, rgbdInstructions, rgbdMusicFile, rgbdMuteBtn;

        this.gui = new GUI(this);
        this.framerate(30);
        OES_texture_float = this.gl.getExtension('OES_texture_float');
        if (!OES_texture_float) {
          throw new Error("No support for OES_texture_float");
        }
        this.shoesPanel = new ShoesPanel(this);
        if (Platform.isBrowser) {
          mousewheelevt = /Firefox/i.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel';
          this.settings.canvas.addEventListener(mousewheelevt, function(e) {
            e.preventDefault();
            return false;
          });
          rgbdMusicFile = document.getElementById('rgbdMusicFile');
          rgbdMusicFile.play();
          rgbdMuteBtn = document.getElementById('rgbdMuteBtn');
          rgbdMuteBtn.addEventListener('click', function() {
            if (rgbdMusicFile.paused) {
              rgbdMuteBtn.className = '';
              return rgbdMusicFile.play();
            } else {
              rgbdMuteBtn.className = 'active';
              return rgbdMusicFile.pause();
            }
          });
          rgbdCreditsBtn = document.getElementById('rgbdCreditsBtn');
          rgbdCredits = document.getElementById('rgbdCredits');
          rgbdCreditsBtn.addEventListener('click', function() {
            return openCredits();
          });
          closeCredits = function(e) {
            if (e.target.parentNode.nodeName === 'A') {
              return;
            }
            rgbdCredits.style.display = 'none';
            return window.removeEventListener('mousedown', closeCredits);
          };
          openCredits = function() {
            rgbdCredits.style.display = 'block';
            return window.addEventListener('mousedown', closeCredits);
          };
          rgbdInfoBtn = document.getElementById('rgbdInfoBtn');
          rgbdInfoBtn.addEventListener('click', function() {
            return openInstructions();
          });
          rgbdInstructions = document.getElementById('rgbdInstructions');
          closeInstructions = function() {
            rgbdInstructions.style.display = 'none';
            return window.removeEventListener('mousedown', closeInstructions);
          };
          openInstructions = function() {
            rgbdInstructions.style.display = 'block';
            return window.addEventListener('mousedown', closeInstructions);
          };
          openInstructions();
        }
        this.camera = new PerspectiveCamera(60, this.width / this.height, 0.1, 10000);
        this.sourcesScene = new SourcesScene(this, this.onSourcesLoaded.bind(this));
        this.slidingArcball = new SlidingArcball(this, this.camera, 2000);
        this.slidingArcball.setTarget(this.sourcesScene.cameraTarget.dup());
        Time.verbose = true;
        return this.peopleCarousel = new PeopleCarousel(this, this.sourcesScene);
      },
      onSourcesLoaded: function(sourcesScene) {
        this.effectsScene = new EffectsScene(this, sourcesScene, sourcesScene.sources, this.sourceId);
        return this.initHelpers(sourcesScene);
      },
      initHelpers: function(sourcesScene) {
        var planeGeom,
          _this = this;

        console.log('initHelpers');
        this.boundingBoxHelper = new BoundingBoxHelper(sourcesScene.boundingBox);
        this.effectBoundingBoxHelper = new BoundingBoxHelper(sourcesScene.effectBoundingBox, new Color(0.2, 0.5, 1.0, 1.0));
        planeGeom = new Cube(sourcesScene.boundingBox.getSize().x, 1, sourcesScene.boundingBox.getSize().z, 12, 1, 12);
        planeGeom.computeEdges();
        this.plane = new Mesh(planeGeom, new SolidColor(), {
          primiveType: this.gl.LINES,
          useEdges: true
        });
        this.plane.position = sourcesScene.modelBaseCenter;
        this.gui.addLabel('RGB+D').setPosition(this.width - 180, 10);
        this.gui.addLabel(' ');
        this.gui.addParam('Paricle size', this, 'pointSize', {
          min: 1,
          max: 10
        });
        this.gui.addParam('Mouse Effect', this, 'mouseEffectEnabled');
        this.gui.addLabel(' ');
        this.gui.addRadioList('Effects', this, 'effectId', [
          {
            name: 'Twirl',
            value: 0
          }, {
            name: 'Hologram',
            value: 1
          }, {
            name: 'Splash',
            value: 2
          }, {
            name: 'Fluid',
            value: 3
          }, {
            name: 'Triangles',
            value: 4
          }, {
            name: 'Blink',
            value: 5
          }
        ]);
        this.on('keyDown', function(e) {
          if (e.str === 'D') {
            _this.debugMode = !_this.debugMode;
          }
          if (e.str === 'T') {
            _this.effectId = 4;
          }
          if (e.str === 'B') {
            _this.effectId = 5;
          }
          if (e.str === 'G') {
            _this.showGUI = !_this.showGUI;
          }
          if (e.str === 'F') {
            _this.drawFloor = !_this.drawFloor;
          }
          if (e.str === '1') {
            _this.sourceId = 0;
          }
          if (e.str === '2') {
            _this.sourceId = 1;
          }
          if (e.str === '3') {
            _this.sourceId = 2;
          }
          if (e.str === '4') {
            _this.sourceId = 3;
          }
          if (e.str === '5') {
            _this.sourceId = 4;
          }
          if (e.str === '6') {
            _this.sourceId = 5;
          }
          if (e.str === '7') {
            return _this.sourceId = 6;
          }
        });
        this.on('mouseMoved', function(e) {
          return _this.mousePos.set(e.x, e.y);
        });
        this.on('scrollWheel', function(e) {
          return _this.distance = Math.min(_this.maxDistance, Math.max(_this.distance + e.dy / 100 * (_this.maxDistance - _this.minDistance), _this.minDistance));
        });
        return this.gui.load('settings.txt');
      },
      easeInOut: function(k) {
        if ((k *= 2) < 1) {
          return 0.5 * k * k * k;
        } else {
          return 0.5 * ((k -= 2) * k * k + 2);
        }
      },
      update: function() {
        var effect, mesh, meshOpacity, rotDist, source, sourceIndex, _i, _len, _ref3;

        _ref3 = this.sourcesScene.sources;
        for (sourceIndex = _i = 0, _len = _ref3.length; _i < _len; sourceIndex = ++_i) {
          source = _ref3[sourceIndex];
          if (!source) {
            continue;
          }
          source.playing = sourceIndex === this.sourceId;
          source.update();
        }
        if (this.slidingArcball) {
          this.slidingArcball.update();
        }
        if (!this.effectsScene) {
          return;
        }
        mesh = this.sourcesScene.mesh;
        source = this.sourcesScene.sources[this.sourceId];
        effect = this.effectsScene.effects[this.effectId];
        if (!mesh || !source || !effect) {
          return;
        }
        source.groundLevel = this.removeGround ? -970 : -9999;
        rotDist = Math.abs(360 - Math.abs(this.slidingArcball.phi));
        meshOpacity = this.easeInOut(MathUtils.map(rotDist, 0, 360, 0, 1));
        mesh.material.uniforms.opacity = meshOpacity;
        effect.amount = 1.0 - meshOpacity;
        if (this.mouseEffectEnabled) {
          effect.amountMouse = this.mousePos.x / this.width;
        } else {
          effect.amountMouse = 0;
        }
        if (effect.material && effect.material.uniforms && effect.material.rgbd) {
          effect.material.rgbd = source;
        }
        if (this.effectId === 1) {
          effect.cutout = effect.amount;
        } else {
          effect.cutout = 1;
        }
        this.effectsScene.converter.source = source;
        this.effectsScene.converter.debugMode = this.debugMode;
        if (this.effectId === 6) {
          mesh.material.uniforms.opacity = 1;
        }
        this.peopleCarousel.drawFloor = this.drawFloor;
        this.peopleCarousel.texturedParticles = this.texturedParticles;
        return this.peopleCarousel.pointSize = this.pointSize;
      },
      drawDebugThings: function() {
        if (this.peopleCarousel && this.debugMode) {
          this.peopleCarousel.drawDebug(this.camera);
        }
        if (this.plane && this.debugMode) {
          this.plane.draw(this.camera);
        }
        if (this.boundingBoxHelper && this.debugMode) {
          this.boundingBoxHelper.draw(this.camera);
        }
        if (this.effectBoundingBoxHelper && this.debugMode) {
          return this.effectBoundingBoxHelper.draw(this.camera);
        }
      },
      drawScene: function() {
        var effect, effectIndex, mesh, _i, _len, _ref3;

        this.gl.clearColor(0, 0, 0, 0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
        if (this.effectsScene) {
          this.effectsScene.converter.draw();
        }
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.DEPTH_TEST);
        if (this.debugMode) {
          this.drawDebugThings();
        }
        if (this.drawMeshes) {
          mesh = this.sourcesScene.mesh;
          if (mesh) {
            mesh.material.uniforms.debugMode = this.debugMode;
            mesh.material.uniforms.texturedParticles = this.texturedParticles;
            mesh.material.uniforms.pointSize = this.pointSize;
            mesh.source = this.sourcesScene.sources[this.sourceId];
            mesh.updateChannels();
            mesh.draw(this.camera);
          }
        }
        if (this.useEffects && this.effectsScene) {
          _ref3 = this.effectsScene.effects;
          for (effectIndex = _i = 0, _len = _ref3.length; _i < _len; effectIndex = ++_i) {
            effect = _ref3[effectIndex];
            if (!effect || effectIndex !== this.effectId) {
              continue;
            }
            effect.debugMode = this.debugMode;
            effect.source = this.sourcesScene.sources[this.sourceId];
            effect.draw(this.camera);
          }
        }
        return this.gl.disable(this.gl.BLEND);
      },
      drawSceneNoEffect: function() {
        var mesh;

        this.gl.clearColor(0, 0, 0, 0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        if (this.effectsScene) {
          this.effectsScene.converter.draw();
        }
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.DEPTH_TEST);
        if (this.debugMode) {
          this.drawDebugThings();
        }
        if (this.drawMeshes) {
          mesh = this.sourcesScene.mesh;
          if (mesh) {
            mesh.material.uniforms.debugMode = this.debugMode;
            mesh.material.uniforms.pointSize = this.pointSize;
            mesh.source = this.sourcesScene.sources[this.sourceId];
            mesh.updateChannels();
            mesh.draw(this.camera);
          }
        }
        return this.gl.disable(this.gl.BLEND);
      },
      drawSceneNoMesh: function() {
        var effect, effectIndex, _i, _len, _ref3;

        this.gl.clearColor(0, 0, 0, 0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.DEPTH_TEST);
        if (this.useEffects && this.effectsScene) {
          _ref3 = this.effectsScene.effects;
          for (effectIndex = _i = 0, _len = _ref3.length; _i < _len; effectIndex = ++_i) {
            effect = _ref3[effectIndex];
            if (!effect || effectIndex !== this.effectId) {
              continue;
            }
            effect.debugMode = this.debugMode;
            effect.source = this.sourcesScene.sources[this.sourceId];
            effect.draw(this.camera);
          }
        }
        return this.gl.disable(this.gl.BLEND);
      },
      draw: function() {
        var color, color2, effect, final, mesh, shift, small, threshold;

        this.update();
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
        if (!this.effectsScene) {
          return;
        }
        effect = this.effectsScene.effects[this.effectId];
        if (this.effectId === 1 && effect) {
          mesh = this.sourcesScene.mesh;
          color = fx().render({
            drawFunc: this.drawSceneNoEffect.bind(this),
            depth: true
          });
          color2 = color.render({
            drawFunc: this.drawSceneNoMesh.bind(this),
            depth: true
          });
          threshold = color2.thresholdBW({
            threshold: 0.5
          });
          small = threshold.downsample2A().downsample2A().blur7();
          shift = 1 / 1280 * 0.3;
          final = threshold.add(small).rgbShift({
            r: new Vec2(15 * shift, 0),
            g: new Vec2(0, 5 * shift),
            b: new Vec2(-10 * shift)
          });
          this.gl.disable(this.gl.BLEND);
          this.gl.enable(this.gl.DEPTH_TEST);
          if (this.drawPeople) {
            this.peopleCarousel.draw(this.camera);
          }
          this.gl.enable(this.gl.BLEND);
          this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
          color.blit({
            x: 0,
            y: 0,
            width: this.width,
            height: this.height
          });
          final.blit({
            x: 0,
            y: 0,
            width: this.width,
            height: this.height
          });
          this.gl.disable(this.gl.BLEND);
        } else {
          this.drawScene();
          if (this.drawPeople) {
            this.peopleCarousel.draw(this.camera);
          }
        }
        this.gl.enable(this.gl.DEPTH_TEST);
        if (this.shoesPanel) {
          this.shoesPanel.draw();
        }
        if (this.showGUI) {
          return this.gui.draw();
        }
      }
    });
  } catch (_error) {
    e = _error;
    if (Platform.isBrowser) {
      rgbdNoWebGL = document.getElementById('rgbdNoWebGL');
      return rgbdNoWebGL.style.display = 'block';
    }
  }
});
