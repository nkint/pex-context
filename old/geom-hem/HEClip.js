// Generated by CoffeeScript 1.6.2
define(function(require) {
  var EPSYLON, HEFace, HEMesh, Line3D, Vec3;

  HEMesh = require('pex/geom/hem/HEMesh');
  Vec3 = require('pex/geom').Vec3;
  Line3D = require('geom/Line3D');
  HEFace = require('pex/geom/hem/HEFace');
  EPSYLON = 0.0001;
  return HEMesh.prototype.clip = function(plane) {
    var debug, edge, edgeIndex, endVert, facesToRemove, guard, newFace, newFaceEdges, newFaceEdgesSorted, numFaces, remove, _i, _len,
      _this = this;

    debug = false;
    remove = true;
    numFaces = this.faces.length;
    this.faces.forEach(function(face, faceIndex) {
      var hits, newEdge, splitEdge0, splitEdge1;

      debug = false;
      hits = [];
      face.edgePairLoop(function(e, ne) {
        var edgeLine, found, p;

        edgeLine = new Line3D(e.vert.position, ne.vert.position);
        p = plane.intersectSegment(edgeLine);
        if (debug) {
          if (p) {
            console.log(' ', p.toString(), p.ratio);
          }
        }
        if (p && p.ratio >= -EPSYLON && p.ratio <= 1 + EPSYLON) {
          found = false;
          hits.forEach(function(hit) {
            if (hit.point.equals(p)) {
              return found = true;
            }
          });
          if (!found) {
            return hits.push({
              edge: e,
              point: p,
              ratio: p.ratio
            });
          }
        }
      });
      if (debug) {
        console.log(' ', hits.length, 'hits', hits.map(function(v) {
          return [v.point.toString(), v.ratio];
        }));
      }
      if (hits.length === 2) {
        splitEdge0 = hits[0].edge;
        splitEdge1 = hits[1].edge;
        if (debug) {
          console.log('split between', splitEdge0.vert.position.toString(), splitEdge1.vert.position.toString());
        }
        if ((hits[0].ratio > 0 + EPSYLON) && (hits[0].ratio < 1 - EPSYLON)) {
          if (debug) {
            console.log('split 1', hits[0].ratio);
          }
          newEdge = _this.splitEdge(splitEdge0, hits[0].ratio);
          splitEdge0 = splitEdge0.next;
        } else if (hits[0].ratio > 1 - EPSYLON) {
          if (debug) {
            console.log('should move 1');
          }
          splitEdge0 = splitEdge0.next;
        }
        if ((hits[1].ratio > 0 + EPSYLON) && (hits[1].ratio < 1 - EPSYLON)) {
          if (debug) {
            console.log('split 2', hits[1].ratio);
          }
          _this.splitEdge(splitEdge1, hits[1].ratio);
          splitEdge1 = splitEdge1.next;
        } else if (hits[1].ratio > 1 - EPSYLON) {
          if (debug) {
            console.log('should move 2');
          }
          splitEdge1 = splitEdge1.next;
        }
        return _this.splitFace(splitEdge0, splitEdge1);
      }
    });
    facesToRemove = [];
    this.fixDuplicatedVertices();
    this.edges.forEach(function(e) {
      return e.onThePlane = false;
    });
    this.faces.map(function(face, faceIndex) {
      var above, c, center;

      c = face.getCenter();
      center = face.getCenter();
      above = face.above = plane.isPointAbove(center);
      if (above) {
        return facesToRemove.push(face);
      }
    });
    if (debug) {
      console.log('facesToRemove.length', facesToRemove.length);
    }
    newFaceEdges = [];
    facesToRemove.forEach(function(face) {
      return face.edgePairLoop(function(e) {
        if (plane.contains(e.vert.position) && plane.contains(e.next.vert.position)) {
          e.onThePlane = true;
          return newFaceEdges.push(e);
        }
      });
    });
    this.vertices.forEach(function(v, vi) {
      return v.index = vi;
    });
    if (debug) {
      console.log('newFaceEdges.length', newFaceEdges.length);
    }
    if (debug) {
      console.log(newFaceEdges.map(function(e) {
        return [e.vert.index, e.next.vert.index];
      }));
    }
    if (newFaceEdges.length === 0) {
      return;
    }
    newFaceEdgesSorted = [];
    newFaceEdgesSorted.push(newFaceEdges.shift());
    guard = 0;
    while (newFaceEdges.length > 0 && ++guard < 1000) {
      endVert = newFaceEdgesSorted[newFaceEdgesSorted.length - 1].next.vert;
      for (edgeIndex = _i = 0, _len = newFaceEdges.length; _i < _len; edgeIndex = ++_i) {
        edge = newFaceEdges[edgeIndex];
        if (endVert === edge.vert) {
          newFaceEdgesSorted.push(edge);
          newFaceEdges.splice(edgeIndex, 1);
          break;
        }
      }
    }
    if (debug) {
      console.log(newFaceEdgesSorted.map(function(e) {
        return [e.vert.index, e.next.vert.index];
      }));
    }
    if (!remove) {
      return;
    }
    newFace = new HEFace(newFaceEdgesSorted[0]);
    this.faces.push(newFace);
    facesToRemove.forEach(function(face) {
      _this.faces.splice(_this.faces.indexOf(face), 1);
      return face.edgePairLoop(function(e) {
        var ei;

        if (!e.onThePlane) {
          ei = _this.edges.indexOf(e);
          if (ei !== -1) {
            return _this.edges.splice(ei, 1);
          }
        }
      });
    });
    return newFaceEdgesSorted.forEach(function(e, ei) {
      var ne;

      ne = newFaceEdgesSorted[(ei + 1) % newFaceEdgesSorted.length];
      e.next = ne;
      return e.face = newFace;
    });
  };
});
