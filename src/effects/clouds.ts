// WebGPU animated cloud sky — ported from the static site's webgpu-clouds.js.
// Renders into the #webgpuClouds canvas. No-ops gracefully when WebGPU is absent.

const cloudSettings = {
  speed: 0.25,
  fullness: 0.48,
  count: 0.68,
  intensity: 0.84,
  cloudOpacity: 0.56,
  size: 0.45,
};

const shader = `
struct Uniforms {
  resolution: vec2f,
  time: f32,
  speed: f32,
  fullness: f32,
  count: f32,
  intensity: f32,
  cloudOpacity: f32,
  size: f32,
  scroll: f32,
  pad2: f32,
};

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

fn hash2(p: vec2f) -> f32 {
  let p3 = fract(vec3f(p.xyx) * 0.1031);
  let q = p3 + dot(p3, p3.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

fn noise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);

  let a = hash2(i);
  let b = hash2(i + vec2f(1.0, 0.0));
  let c = hash2(i + vec2f(0.0, 1.0));
  let d = hash2(i + vec2f(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

fn fbm(p0: vec2f) -> f32 {
  var p = p0;
  var value = 0.0;
  var amp = 0.5;

  for (var i = 0; i < 6; i = i + 1) {
    value = value + amp * noise(p);
    p = mat2x2f(1.62, 1.18, -1.18, 1.62) * p;
    amp = amp * 0.52;
  }

  return value;
}

fn cloudField(p: vec2f, t: f32, seed: vec2f) -> f32 {
  let broad = fbm(p * 0.72 + seed + vec2f(t * 0.06, -t * 0.025));
  let billow = fbm(p * 1.42 + seed.yx * 1.7 + vec2f(-t * 0.09, t * 0.035));
  let detail = fbm(p * 3.1 + seed * 2.3 + vec2f(t * 0.12, t * 0.075));
  let wisps = fbm(p * 6.0 + seed.yx * 3.1 + vec2f(-t * 0.18, t * 0.09));

  return broad * 0.52 + billow * 0.34 + detail * 0.18 + wisps * 0.06;
}

fn cloudLayer(p: vec2f, t: f32, drift: vec2f, scale: f32, seed: vec2f, thresholdOffset: f32) -> f32 {
  let q = p * scale + drift * t + seed;
  let field = cloudField(q, t, seed);
  let coverage = mix(0.86, 0.28, uniforms.fullness) + thresholdOffset - uniforms.count * 0.24;
  let softness = mix(0.2, 0.54, uniforms.fullness);
  var cloud = smoothstep(coverage, coverage + softness, field);
  cloud = pow(cloud, mix(1.8, 0.72, uniforms.fullness));
  return cloud;
}

@vertex
fn vs(@builtin(vertex_index) vertexIndex: u32) -> VertexOut {
  var positions = array<vec2f, 3>(
    vec2f(-1.0, -1.0),
    vec2f(3.0, -1.0),
    vec2f(-1.0, 3.0)
  );

  let position = positions[vertexIndex];
  var out: VertexOut;
  out.position = vec4f(position, 0.0, 1.0);
  out.uv = position * 0.5 + vec2f(0.5);
  return out;
}

@fragment
fn fs(in: VertexOut) -> @location(0) vec4f {
  let aspect = uniforms.resolution.x / max(uniforms.resolution.y, 1.0);
  let skyTop = vec3f(0.0549, 0.5569, 0.8078);
  let skyBottom = vec3f(0.0549, 0.5569, 0.8078);
  let uv = vec2f(in.uv.x, 1.0 - in.uv.y);
  let sky = mix(skyBottom, skyTop, smoothstep(0.0, 1.0, uv.y));

  var p = (uv - vec2f(0.5)) * vec2f(aspect, 1.0);
  p = p * (2.35 / max(uniforms.size, 0.05));
  let scroll = uniforms.scroll;
  p.y = p.y + 0.18 - scroll * 0.18;
  p.x = p.x + sin(scroll * 1.7) * 0.035;

  let t = uniforms.time * uniforms.speed;
  let l1 = cloudLayer(p + vec2f(-0.18, 0.08) + vec2f(scroll * 0.025, scroll * 0.09), t, vec2f(-0.64, 0.05), 0.9 + scroll * 0.015, vec2f(2.1, -4.7 + scroll * 0.6), 0.0);
  let l2 = cloudLayer(p + vec2f(0.38, -0.12) + vec2f(-scroll * 0.05, scroll * 0.04), t * 0.86, vec2f(0.42, 0.08), 1.34 + scroll * 0.04, vec2f(-6.3 + scroll * 0.7, 1.4), 0.08);
  let l3 = cloudLayer(p + vec2f(-0.52, 0.28) + vec2f(scroll * 0.07, -scroll * 0.03), t * 1.18, vec2f(-0.18, -0.34), 1.95 + scroll * 0.07, vec2f(0.7, 8.6 - scroll * 0.85), 0.13);
  let l4 = cloudLayer(p + vec2f(0.1, -0.34) + vec2f(-scroll * 0.02, scroll * 0.12), t * 0.62, vec2f(0.22, -0.12), 0.58 + scroll * 0.01, vec2f(7.4 - scroll * 0.4, 3.2 + scroll * 0.45), -0.04);
  let l5 = cloudLayer(p + vec2f(-0.06, 0.02) + vec2f(scroll * 0.1, scroll * 0.02), t * 1.42, vec2f(-0.08, 0.46), 2.65 + scroll * 0.09, vec2f(-1.8 + scroll * 1.0, -9.1), 0.18);
  var cloud = clamp(l1 * 0.38 + l2 * 0.28 + l3 * 0.18 + l4 * 0.32 + l5 * 0.12, 0.0, 1.0);
  cloud = smoothstep(0.02, 0.88, cloud);

  let shadowNoise = fbm((p + vec2f(-t * 0.28, t * 0.08) + vec2f(scroll * 0.08, -scroll * 0.04)) * 1.15 + vec2f(t * 0.035, -t * 0.02));
  let cloudShade = mix(vec3f(0.74, 0.88, 0.94), vec3f(1.0, 1.0, 0.98), smoothstep(0.28, 0.92, shadowNoise));
  let alpha = clamp(cloud * uniforms.intensity * uniforms.cloudOpacity, 0.0, 0.94);
  let color = mix(sky, cloudShade, alpha);

  return vec4f(color, 1.0);
}
`;

export function initClouds(): () => void {
  const canvas = document.getElementById('webgpuClouds') as HTMLCanvasElement | null;
  const gpu = (navigator as any).gpu;
  if (!canvas || !gpu) return () => {};

  let animationFrame = 0;
  let scrollDepth = 0;
  let disposed = false;

  const onPageHide = () => cancelAnimationFrame(animationFrame);
  window.addEventListener('pagehide', onPageHide);

  let onResize: (() => void) | null = null;

  (async () => {
    const adapter = await gpu.requestAdapter();
    if (!adapter || disposed) return;

    const device = await adapter.requestDevice();
    if (disposed) return;
    const context = canvas.getContext('webgpu') as any;
    const format = gpu.getPreferredCanvasFormat();

    context.configure({ device, format, alphaMode: 'opaque' });

    const BufferUsage = (globalThis as any).GPUBufferUsage;
    const uniformBuffer = device.createBuffer({
      size: 48,
      usage: BufferUsage.UNIFORM | BufferUsage.COPY_DST,
    });

    const pipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: { module: device.createShaderModule({ code: shader }), entryPoint: 'vs' },
      fragment: {
        module: device.createShaderModule({ code: shader }),
        entryPoint: 'fs',
        targets: [{ format }],
      },
      primitive: { topology: 'triangle-list' },
    });

    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    // Clouds are soft and slow-moving, so we can render the canvas well below
    // device resolution and below 60fps with no perceptible quality loss — this
    // is the dominant cost (a heavy full-screen fragment shader that also forces
    // every backdrop-filter panel above it to re-composite each frame).
    const RENDER_SCALE = 0.7; // fraction of CSS pixels to render at
    const FRAME_INTERVAL = 1000 / 30; // cap to ~30fps
    let lastFrame = 0;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width * RENDER_SCALE));
      const height = Math.max(1, Math.round(rect.height * RENDER_SCALE));
      if (canvas!.width !== width || canvas!.height !== height) {
        canvas!.width = width;
        canvas!.height = height;
      }
    }

    function render(now = 0) {
      if (disposed) return;
      // Throttle: skip frames that arrive faster than the target interval.
      if (now - lastFrame < FRAME_INTERVAL) {
        animationFrame = requestAnimationFrame(render);
        return;
      }
      lastFrame = now;
      resize();
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollDepth += (window.scrollY / maxScroll - scrollDepth) * 0.08;

      const data = new Float32Array([
        canvas!.width,
        canvas!.height,
        now * 0.001,
        cloudSettings.speed,
        cloudSettings.fullness,
        cloudSettings.count,
        cloudSettings.intensity,
        cloudSettings.cloudOpacity,
        cloudSettings.size,
        scrollDepth,
        0,
      ]);

      device.queue.writeBuffer(uniformBuffer, 0, data);

      const encoder = device.createCommandEncoder();
      const pass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            clearValue: { r: 0.0549, g: 0.5569, b: 0.8078, a: 1 },
            loadOp: 'clear',
            storeOp: 'store',
          },
        ],
      });

      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.draw(3);
      pass.end();

      device.queue.submit([encoder.finish()]);
      animationFrame = requestAnimationFrame(render);
    }

    onResize = resize;
    window.addEventListener('resize', resize);
    animationFrame = requestAnimationFrame(render);
  })().catch((error) => console.error(error));

  return () => {
    disposed = true;
    cancelAnimationFrame(animationFrame);
    window.removeEventListener('pagehide', onPageHide);
    if (onResize) window.removeEventListener('resize', onResize);
  };
}
