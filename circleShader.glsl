#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  //vec2 uv = gl_FragCoord.xy/u_resolution.xy * 2.0 - 1.0;

  //uv.x *= u_resolution.x / u_resolution.y;


  float d = length(uv);
  d -= 0.5;
  d = abs(d);
  d = step(0.1, d);
//d = smoothstep(0.0, 0.1, d);

  //gl_FragColor = vec4(d, u_mouse.x/u_resolution.x, u_mouse.y/u_resolution.y, 1.0);
  gl_FragColor = vec4(d, d, d, 1.0);
}

