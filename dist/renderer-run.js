"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = void 0;
var Runner = /** @class */ (function () {
    function Runner(world, options) {
        if (options === void 0) { options = {}; }
        this.options = {
            fps: 60,
            speed: 1
        };
        this.fps = 0;
        this.runId = null;
        this.render = function () { return void 0; };
        this.update = function () { return function (step) { return void 0; }; };
        Object.assign(this.options, options);
        this.world = world;
    }
    Runner.prototype.start = function (render, update) {
        var _this = this;
        if (render === void 0) { render = false; }
        if (update === void 0) { update = false; }
        if (this.runId)
            return;
        if (render)
            this.render = render;
        if (update)
            this.update = update;
        var step = 1 / this.options.fps;
        var slomo = 1 / this.options.speed;
        var slowStep = slomo * step;
        var last = performance.now();
        var dt = 0;
        var now;
        var delta;
        var tick = function () {
            now = performance.now();
            dt = dt + Math.min(1, (now - last) / 1000);
            while (dt > slowStep) {
                _this.world.step(step);
                _this.update(step);
                dt -= slowStep;
            }
            delta = (now - last) / 1000;
            _this.fps = 1 / delta;
            last = now;
            ;
            _this.render();
            _this.runId = requestAnimationFrame(tick);
        };
        this.runId = requestAnimationFrame(tick);
    };
    Runner.prototype.stop = function () {
        if (this.runId) {
            cancelAnimationFrame(this.runId);
            this.runId = null;
        }
    };
    return Runner;
}());
exports.Runner = Runner;
