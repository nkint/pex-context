// Generated by CoffeeScript 1.6.2
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var FaceSelector, SingleFaceSelector, Time;

  FaceSelector = require('flora/plants/modular/FaceSelector');
  Time = require('pex/utils/Time');
  return SingleFaceSelector = (function(_super) {
    __extends(SingleFaceSelector, _super);

    function SingleFaceSelector(up) {
      this.up = up;
      this.faces = [];
    }

    SingleFaceSelector.prototype.apply = function(hem, face) {
      var n, _i, _len, _ref, _results;

      _ref = hem.faces;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        face = _ref[_i];
        n = face.getNormal();
        if (n.dot(this.up) >= 0.9999) {
          this.faces.push(face);
          this.done = true;
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return SingleFaceSelector;

  })(FaceSelector);
});

/*
//@ sourceMappingURL=SingleFaceSelector.map
*/
