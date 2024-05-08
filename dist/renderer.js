"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = exports.CanvasRenderer = void 0;
var renderer_canvas_1 = require("./renderer-canvas");
Object.defineProperty(exports, "CanvasRenderer", { enumerable: true, get: function () { return renderer_canvas_1.CanvasRenderer; } });
var renderer_run_1 = require("./renderer-run");
Object.defineProperty(exports, "Runner", { enumerable: true, get: function () { return renderer_run_1.Runner; } });
exports.default = renderer_canvas_1.CanvasRenderer;
