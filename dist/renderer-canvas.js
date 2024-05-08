"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasRenderer = void 0;
var planck_js_1 = require("planck-js");
var CanvasRenderer = /** @class */ (function () {
    function CanvasRenderer(world, ctx, options) {
        if (options === void 0) { options = {}; }
        this.options = {
            scale: 16,
            lineWidth: 1 / 16,
            strokeStyle: {
                dynamic: 'black',
                static: 'black',
                kinematic: 'black'
            }
        };
        this.draw = function (ctx) { return void 0; };
        this.clear = function (canvas, ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
        Object.assign(this.options, options);
        if (!options.lineWidth) {
            this.options.lineWidth = 1 / this.options.scale;
        }
        this.world = world;
        this.ctx = ctx;
        this.canvas = ctx.canvas;
    }
    CanvasRenderer.prototype.renderWorld = function () {
        var _a = this, ctx = _a.ctx, canvas = _a.canvas, options = _a.options;
        this.clear(canvas, ctx);
        this.draw(ctx);
        for (var body = this.world.getBodyList(); body; body = body.getNext()) {
            for (var fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
                if (body.isDynamic()) {
                    ctx.strokeStyle = options.strokeStyle.dynamic;
                }
                else if (body.isKinematic()) {
                    ctx.strokeStyle = options.strokeStyle.kinematic;
                }
                else if (body.isStatic()) {
                    ctx.strokeStyle = options.strokeStyle.static;
                }
                var shape = fixture.getShape();
                ctx.save();
                ctx.scale(this.options.scale, this.options.scale);
                ctx.lineWidth = options.lineWidth;
                if (shape instanceof planck_js_1.Circle) {
                    this.drawCircle(body, shape);
                }
                else if (shape instanceof planck_js_1.Edge) {
                    this.drawEdge(body, shape);
                }
                else if (shape instanceof planck_js_1.Polygon) {
                    this.drawPolygon(body, shape);
                }
                else if (shape instanceof planck_js_1.Chain) {
                    this.drawPolygon(body, shape);
                }
                ctx.restore();
            }
        }
        for (var joint = this.world.getJointList(); joint; joint = joint.getNext()) {
            ctx.save();
            ctx.scale(this.options.scale, this.options.scale);
            this.drawJoint(joint);
            ctx.restore();
        }
    };
    CanvasRenderer.prototype.drawCircle = function (body, shape) {
        var ctx = this.ctx;
        var lw = this.options.lineWidth;
        var radius = shape.m_radius;
        var pos = body.getPosition();
        var angle = body.getAngle();
        var size = radius * 2 + lw * 2;
        ctx.translate(pos.x + lw, pos.y + lw);
        ctx.rotate(angle);
        /*if (body.render && body.render.custom) {
          const pos = {
            x: - radius - lw * 2,
            y: - radius - lw * 2,
          }
    
          if (body.render.custom(ctx, pos, size + lw) !== true) {
            return;
          }
        }*/
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    };
    CanvasRenderer.prototype.drawEdge = function (body, shape) {
        var ctx = this.ctx;
        var v1 = shape.m_vertex1;
        var v2 = shape.m_vertex2;
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.lineCap = 'round';
        ctx.stroke();
    };
    CanvasRenderer.prototype.drawPolygon = function (body, shape) {
        var ctx = this.ctx;
        var lw = this.options.lineWidth;
        var vertices = shape.m_vertices;
        if (!vertices.length) {
            return;
        }
        var minX = Infinity;
        var minY = Infinity;
        var maxX = -Infinity;
        var maxY = -Infinity;
        for (var _i = 0, vertices_1 = vertices; _i < vertices_1.length; _i++) {
            var v = vertices_1[_i];
            minX = Math.min(minX, v.x);
            maxX = Math.max(maxX, v.x);
            minY = Math.min(minY, v.y);
            maxY = Math.max(maxY, v.y);
        }
        var width = maxX - minX;
        var height = maxY - minY;
        var pos = body.getPosition();
        var angle = body.getAngle();
        ctx.translate(pos.x + lw * 2, pos.y + lw * 2);
        ctx.rotate(angle);
        /*if (body.render && body.render.custom) {
          const size = {
            width: width + lw,
            height: height + lw,
          }
          const pos = {
            x: minX - lw,
            y: minY - lw,
          }
    
          if (body.render.custom(ctx, pos, size) !== true) {
            return
          }
        }*/
        ctx.beginPath();
        for (var i = 0; i < vertices.length; ++i) {
            var v = vertices[i];
            var x = v.x - lw;
            var y = v.y - lw;
            if (i === 0) {
                ctx.moveTo(x, y);
            }
            else {
                ctx.lineTo(x, y);
            }
        }
        if (vertices.length > 2) {
            ctx.closePath();
        }
        ctx.stroke();
    };
    CanvasRenderer.prototype.drawJoint = function (joint) {
        var ctx = this.ctx;
        var a = joint.getAnchorA();
        var b = joint.getAnchorB();
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
    };
    return CanvasRenderer;
}());
exports.CanvasRenderer = CanvasRenderer;
