import { useEffect, useRef } from "react";

/**
 * Fullscreen WebGL shader — flowing violet aurora noise with mouse influence.
 * Falls back gracefully when WebGL is unavailable.
 */
export function ShaderBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      premultipliedAlpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const vert = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;
    const frag = `
      precision highp float;
      uniform vec2 u_res;
      uniform float u_t;
      uniform vec2 u_mouse;

      // hash / noise
      float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
      float noise(vec2 p){
        vec2 i=floor(p), f=fract(p);
        float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
        vec2 u=f*f*(3.-2.*f);
        return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
      }
      float fbm(vec2 p){
        float v=0., a=0.5;
        for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=0.5; }
        return v;
      }

      void main(){
        vec2 uv = (gl_FragCoord.xy - 0.5*u_res)/min(u_res.x,u_res.y);
        vec2 m = (u_mouse - 0.5*u_res)/min(u_res.x,u_res.y);

        float t = u_t*0.06;
        vec2 q = uv*1.6;
        q += 0.5*vec2(fbm(q + t), fbm(q - t + 3.1));
        float n = fbm(q + vec2(t, -t));

        // distance-from-mouse warp
        float md = exp(-2.2*length(uv - m));
        n += md*0.35;

        // palette: cosmic ink -> cosmic -> plum slate -> crimson ember -> cotton bloom
        vec3 c0 = vec3(0.043, 0.039, 0.055);      // #0b0a0e deep cosmic shadow
        vec3 c1 = vec3(0.106, 0.098, 0.137);      // #1b1923 cosmic
        vec3 c2 = vec3(0.239, 0.216, 0.318);      // #3d3751 plum/lavender slate
        vec3 cE = vec3(0.541, 0.169, 0.220);      // #8a2c38 lightened crimson ember
        vec3 cL = vec3(0.824, 0.765, 0.965);      // #D2C3F6 lavender
        vec3 c3 = vec3(0.929, 0.922, 0.871);      // #EDEBDE cotton bloom

        vec3 col = mix(c0, c1, smoothstep(0.30, 0.68, n));
        col = mix(col, c2, smoothstep(0.66, 0.90, n)*0.70);
        col = mix(col, cL, smoothstep(0.82, 0.95, n)*0.22);
        col = mix(col, cE, smoothstep(0.86, 0.97, n)*0.34);
        col = mix(col, c3, smoothstep(0.92, 1.00, n)*0.40);

        // deeper vignette for premium edge falloff
        float v = smoothstep(1.35, 0.12, length(uv));
        col *= mix(0.28, 1.0, v);

        // grain
        col += (hash(gl_FragCoord.xy + u_t) - 0.5)*0.03;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uT = gl.getUniformLocation(prog, "u_t");
    const uM = gl.getUniformLocation(prog, "u_mouse");

    const mouse = [window.innerWidth * 0.5, window.innerHeight * 0.5];
    let target = [...mouse];
    const onMove = (e: PointerEvent) => {
      target = [e.clientX, window.innerHeight - e.clientY];
    };
    window.addEventListener("pointermove", onMove);

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const start = performance.now();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tick = () => {
      mouse[0] += (target[0] - mouse[0]) * 0.06;
      mouse[1] += (target[1] - mouse[1]) * 0.06;
      const t = reduced ? 0 : (performance.now() - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, t);
      gl.uniform2f(
        uM,
        mouse[0] * (canvas.width / window.innerWidth),
        mouse[1] * (canvas.height / window.innerHeight),
      );
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="fixed inset-0 -z-10 h-screen w-screen"
      style={{ background: "#0b0a0e" }}
    />
  );
}
