import { World } from 'planck-js';
export interface RunnerOptions {
    fps?: number;
    speed?: number;
}
export declare class Runner {
    options: {
        fps: number;
        speed: number;
    };
    world: World;
    fps: number;
    runId: number | null;
    render: (() => void);
    update: ((step: number) => void);
    constructor(world: World, options?: RunnerOptions);
    start(render?: (() => void) | false, update?: (() => void) | false): void;
    stop(): void;
}
