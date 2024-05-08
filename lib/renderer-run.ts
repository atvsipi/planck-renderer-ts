import {World} from 'planck-js';

export interface RunnerOptions {
    fps?: number,
    speed?: number
}

export class Runner {
    options = {
        fps: 60,
        speed: 1,
    };
    world: World;
    fps: number = 0;

    runId: number | null = null;
    render: (() => void) = () => void 0;
    update: ((step: number) => void) = () => (step: number) => void 0;

    constructor(world: World, options: RunnerOptions = {}) {
        Object.assign(this.options, options);

        this.world = world;
    }
    start(render: (() => void) | false = false, update: (() => void) | false = false) {
        if (this.runId) return;
        if (render) this.render = render;
        if (update) this.update = update;

        const step = 1 / this.options.fps;
        const slomo = 1 / this.options.speed;
        const slowStep = slomo * step;

        let last = performance.now();
        let dt = 0;
        let now: number;
        let delta: number;

        const tick = () => {
            now = performance.now();
            dt = dt + Math.min(1, (now - last) / 1000);

            while (dt > slowStep) {
                this.world.step(step);
                this.update(step);

                dt -= slowStep;
            }

            delta = (now - last) / 1000;
            this.fps = 1 / delta;
            last = now;;

            this.render();
            this.runId = requestAnimationFrame(tick);
        };

        this.runId = requestAnimationFrame(tick);
    }

    stop() {
        if (this.runId) {
            cancelAnimationFrame(this.runId);

            this.runId = null;
        }
    }
}