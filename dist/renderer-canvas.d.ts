import { World, Body, Circle, Edge, Polygon, Chain, type Joint } from 'planck-js';
export interface CanvasRendererOptions {
    scale?: number;
    lineWidth?: number;
    strokeStyle?: {
        dynamic?: string;
        static?: string;
        kinematic?: string;
    };
}
export declare class CanvasRenderer {
    options: {
        scale: number;
        lineWidth: number;
        strokeStyle: {
            dynamic: string;
            static: string;
            kinematic: string;
        };
    };
    world: World;
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    draw: (ctx: CanvasRenderingContext2D) => any;
    clear: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void;
    constructor(world: World, ctx: CanvasRenderingContext2D, options?: CanvasRendererOptions);
    renderWorld(): void;
    drawCircle(body: Body, shape: Circle): void;
    drawEdge(body: Body, shape: Edge): void;
    drawPolygon(body: Body, shape: Polygon | Chain): void;
    drawJoint(joint: Joint): void;
}
