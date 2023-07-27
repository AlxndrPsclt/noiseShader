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

  vec2 m = u_mouse.xy/u_resolution.xy;
  vec3 col = vec3(1.0,0.3,3.0);


  float d = length(uv);
  float angle = atan(uv.y, uv.x);

  d = sin(d*m.x*20. + 5.*m.y * angle * u_time)/20.;

  //d -= m.x;
  d = abs(d);
  //d = step(0.01, d);
  d = 0.02 / d;
//d = smoothstep(0.0, 0.1, d);

  col *= d;
  //gl_FragColor = vec4(d, u_mouse.x/u_resolution.x, u_mouse.y/u_resolution.y, 1.0);
  gl_FragColor = vec4(col, 1.0);
}

