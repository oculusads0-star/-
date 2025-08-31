'use client'
import {useEffect, useRef} from 'react'

const frag = `#version 300 es
precision highp float;
out vec4 FragColor;
uniform vec2 u_res;
uniform float u_time;

float hash(vec2 p){return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){
  vec2 i=floor(p); vec2 f=fract(p);
  float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
  vec2 u=f*f*(3.-2.*f);
  return mix(a,b,u.x)+ (c-a)*u.y*(1.-u.x)+ (d-b)*u.x*u.y;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = (uv - .5) * vec2(u_res.x/u_res.y, 1.0);

  float t = u_time * 0.12;
  float n = 0.0;
  float amp = 0.5;
  float freq = 1.5;
  for(int i=0;i<5;i++){
    n += amp * noise(p*freq + t*vec2(0.6,0.4));
    freq *= 2.0;
    amp *= 0.55;
  }

  float liquid = smoothstep(0.35, 0.65, n);

  vec2 dist = 0.02 * vec2(noise(p*3. + t), noise(p*3. - t));
  vec3 base = mix(vec3(0.07,0.05,0.18), vec3(0.27,0.16,0.72), uv.y + dist.x);

  float band = smoothstep(0.2,0.8, n + 0.1*sin(uv.y*6. + t*2.));
  vec3 glow = mix(vec3(0.1,0.0,0.25), vec3(0.55,0.35,1.0), band);

  vec3 col = mix(base, glow, liquid);
  float vig = smoothstep(1.2, 0.2, length(uv-0.5));
  col *= vig;

  FragColor = vec4(col, 1.0);
}`;

const vert = `#version 300 es
in vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }`;

export default function HeroCanvas(){
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(()=>{
    const canvas = ref.current!
    const gl = canvas.getContext('webgl2', {antialias:false, premultipliedAlpha:false})
    if(!gl){ console.warn('WebGL2 not supported'); return }

    // compile helpers
    function compile(type:number, src:string){
      const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s);
      if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)||'shader error')
      return s
    }
    const vs = compile(gl.VERTEX_SHADER, vert)
    const fs = compile(gl.FRAGMENT_SHADER, frag)
    const prog = gl.createProgram()!; gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog)
    if(!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog)||'link error')
    gl.useProgram(prog)

    // fullscreen quad
    const pos = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, pos)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1,  1,-1,  -1, 1,
      -1, 1,  1,-1,   1, 1
    ]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'position')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')

    function resize(){
      const dpr = Math.min(window.devicePixelRatio||1, 2)
      const w = canvas.clientWidth, h = canvas.clientHeight
      canvas.width = Math.max(1, Math.floor(w*dpr))
      canvas.height = Math.max(1, Math.floor(h*dpr))
      gl.viewport(0,0,canvas.width, canvas.height)
    }
    const ro = new ResizeObserver(resize); ro.observe(canvas); resize()

    let raf = 0; let start = performance.now()
    function frame(){
      raf = requestAnimationFrame(frame)
      const t = (performance.now()-start)/1000
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, t)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
    frame()

    return ()=>{ cancelAnimationFrame(raf); ro.disconnect(); gl.deleteBuffer(pos); gl.deleteProgram(prog); gl.deleteShader(vs); gl.deleteShader(fs) }
  }, [])

  return <canvas className="liquid" ref={ref} />
}
