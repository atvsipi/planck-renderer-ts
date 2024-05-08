import {World, Body, Circle, Edge, Polygon, Chain, type Joint} from 'planck-js'

export interface CanvasRendererOptions {
  scale?: number,
  lineWidth?: number,
  strokeStyle?: {
    dynamic?: string,
    static?: string,
    kinematic?: string,
  },
}

export class CanvasRenderer {
  options = {
    scale: 16,
    lineWidth: 1 / 16,
    strokeStyle: {
      dynamic: 'black',
      static: 'black',
      kinematic: 'black',
    },
  };
  world: World;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  draw = (ctx: CanvasRenderingContext2D) => void 0
  clear = (canvas:HTMLCanvasElement, ctx:CanvasRenderingContext2D) => {
    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
  }
  
  constructor(world: World, ctx: CanvasRenderingContext2D, options: CanvasRendererOptions = {}) {
    Object.assign(this.options, options);

    if (!options.lineWidth) {
      this.options.lineWidth = 1 / this.options.scale
    }

    this.world = world;
    this.ctx = ctx;
    this.canvas = ctx.canvas;
  }

  renderWorld() {
    const {ctx, canvas, options} = this
    this.clear(canvas, ctx);
    this.draw(ctx);

    for (let body = this.world.getBodyList(); body; body = body.getNext()) {
      for (
        let fixture = body.getFixtureList();
        fixture;
        fixture = fixture.getNext()
      ) {

        if (body.isDynamic()) {
          ctx.strokeStyle = options.strokeStyle.dynamic;
        } else if (body.isKinematic()) {
          ctx.strokeStyle = options.strokeStyle.kinematic;
        } else if (body.isStatic()) {
          ctx.strokeStyle = options.strokeStyle.static;
        }

        const shape = fixture.getShape();

        ctx.save();
        ctx.scale(this.options.scale, this.options.scale)
        ctx.lineWidth = options.lineWidth;

        if (shape instanceof Circle) {
          this.drawCircle(body, shape);
        } else if (shape instanceof  Edge) {
          this.drawEdge(body, shape);
        }else if (shape instanceof Polygon) {
          this.drawPolygon(body, shape);
        }else if (shape instanceof Chain) {
          this.drawPolygon(body, shape);
        }
        ctx.restore();
      }
    }

    for (let joint = this.world.getJointList(); joint; joint = joint.getNext()) {
      ctx.save();
      ctx.scale(this.options.scale, this.options.scale);
      this.drawJoint(joint);
      ctx.restore();
    }
  }

  drawCircle(body: Body, shape: Circle) {
    const ctx = this.ctx;
    const lw = this.options.lineWidth

    const radius = shape.m_radius;
    const pos = body.getPosition();
    const angle = body.getAngle();

    const size = radius * 2 + lw * 2;

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
  }

  drawEdge(body: Body, shape: Edge) {
    const ctx = this.ctx;

    const v1 = shape.m_vertex1;
    const v2 = shape.m_vertex2;
    
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  drawPolygon(body: Body, shape: Polygon | Chain) {
    const ctx = this.ctx;
    const lw = this.options.lineWidth

    const vertices = shape.m_vertices;
    if (!vertices.length) {
      return;
    }

    let minX = Infinity
    let minY = Infinity;
    let maxX = -Infinity
    let maxY = -Infinity;
    for (const v of vertices) {
      minX = Math.min(minX, v.x);
      maxX = Math.max(maxX, v.x);
      minY = Math.min(minY, v.y);
      maxY = Math.max(maxY, v.y);
    }

    const width = maxX - minX;
    const height = maxY - minY;

    const pos = body.getPosition();
    const angle = body.getAngle();

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
    for (let i = 0; i < vertices.length; ++i) {
      const v = vertices[i];
      const x = v.x - lw;
      const y = v.y - lw;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    if (vertices.length > 2) {
      ctx.closePath();
    }

    ctx.stroke();
  }

  drawJoint(joint: Joint) {
    const ctx = this.ctx;

    const a = joint.getAnchorA();
    const b = joint.getAnchorB();

    ctx.beginPath();
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }
}