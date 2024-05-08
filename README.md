# Small rendering library for [planck.js](https://github.com/piqnt/planck.js "piqnt/planck.js")

A small library for rendering objects from the planck-js library
It is written without using third-party libraries and renders
If you want to use planck-js together with stage-js libraries, then in the [stage-js branch](https://github.com/RealPeha/planck-renderer/tree/stage-js "stage-js branch") you can find another version

## Install

### npm
```
npm install git+https://github.com/atvsipi/planck-renderer-ts
```

### bun
```
bun add git+https://github.com/atvsipi/planck-renderer-ts
```

## Example


```typescript
import { World, Edge, Vec2, Circle } from 'planck-js';
import Renderer, { Runner } from "planck-renderer-ts";

const canvas = document.querySelector('#test') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const world = new World(Vec2(0, -10));
const renderer = new Renderer(world, ctx)

const runner = new Runner(world, {
	// default settings
	speed: 1,
	fps: 60,
})

// init world entities
world.createBody().createFixture(Edge(Vec2(-40.0, 0.0), Vec2(40.0, 0.0)));
world.createDynamicBody(Vec2(0.0, 4.5)).createFixture(Circle(0.5), 10.0);
world.createDynamicBody(Vec2(0.0, 10.0)).createFixture(Circle(5.0), 10.0);

runner.start(() => {
	renderer.renderWorld()
}) // start rendering world
```

A more detailed example can be found in the folder [example](https://github.com/atvsipi/planck-renderer-ts/tree/master/example "example")

## Renderer

### import renderer
```typescript
import Renderer, { CanvasRenderer, SVGRenderer } from 'planck-renderer-ts';
```
Where CanvasRenderer uses canvas for rendering, SVGRenderer - svg, default import Renderer automatically selects canvas or svg

### Renderer API

------------

### constructor
```typescript
	// default options
const options = {
	scale: 16,
	strokeStyle: {
    	dynamic: 'black',
    	static: 'black',
    	kinematic: 'black',
    },
}
const renderer = new Renderer(world, ctx, options)
```

### renderer.draw

If you need to draw something on the canvas in addition to the physical objects of the engine, then you can do this in the renderer method.
This method returns canvas context

```typescript
renderer.draw = (ctx) => {
	ctx.strokeText(`FPS: ${runner.fps}`0, 0)
}
```

### custom figure drawing

```typescript

const ball = world.createDynamicBody(Vec2(5.0, -30.0));
ball.createFixture(Circle(3.0), {
	density: 5.0,
});
ball.render = {
	stroke: 'tomato', // stroke style only for this body
	// or custom drawing function
	custom: (ctx, pos, size) => {
		// draw your circle
	}
}
```

### custom render function

The first argument this function always returns context. For the circle, the next two arguments will be position (object - x, y) and size (number). For a polygon, the next two arguments will be position (object - x, y) and size (object - width, height)

Let's draw a ball texture instead of a circle

```typescript

const renderer = new Renderer(world, ctx)

const init = img => {
	const ball = world.createDynamicBody(Vec2(5.0, -30.0));
	ball.createFixture(Circle(3.0), {
		density: 5.0,
	});
	ball.render = {
		stroke: 'tomato',
		custom: (ctx, pos, size) => {
			ctx.drawImage(ballImg, pos.x, pos.y, size, size)
			return true // optional
		}
	}

	renderer.startUpdate()
}

const img = new Image()
img.src = "https://pngriver.com/wp-content/uploads/2018/04/Download-Swimming-Pool-Ball-PNG-File.png"
img.onload = () => {
	init(img)
}
```

if the custom function returns true, then it draws the custom method and the built-in

## Runner

### import runner
```typescript
import { Runner } from 'planck-renderer-ts';
```

### Runner API

------------

### constructor
```typescript
	// default options
const options = {
	fps: 60,
	speed: 1.
}
const runner = new Runner(world, options)
```

### start rendering world
`runner.start(drawingFunction, updateFunction)`

```typescript
runner.start(
	() => {
		renderer.renderWorld()
	},
	() => {
		console.log('update')
	}
)
```

### stop rendering world
```typescript
runner.stop()
```

if you started the drawing and then stopped, then you can start the restart with the start command without arguments

```typescript
runner.start(() => {
	renderer.renderWorld()
})

// later...
runner.stop()

// later...
runner.start() // this is equivalent to the previous run
```

### custom runner

You are not required to use Runner to render the world. To use your own game loop, just call the renderer.renderWorld () method

(do not use this example in your projects, this is not correct)
```typescript
setInterval(() => {
	renderer.renderWorld()
}, 1)
```
