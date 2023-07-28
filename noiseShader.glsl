#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(-0.740,-0.990)))*
       3200000.505);
}


void main() {
  vec2 uv = 150.0 * gl_FragCoord.xy / min(u_resolution.x, u_resolution.y);
  vec2 fuv = fract(uv);
  vec2 iuv = floor(uv);
  //vec2 uv = gl_FragCoord.xy/u_resolution.xy * 2.0 - 1.0;

  //uv.x *= u_resolution.x / u_resolution.y;

  vec2 m = u_mouse.xy/u_resolution.xy;


  float d = length(uv);
  float angle = atan(uv.y, uv.x);

  //d = step(0.01, d);
//d = smoothstep(0.0, 0.1, d);


  float rnd = random( iuv );
  //float steped_rnd = step(0.3,rnd);
  float steped_rnd = smoothstep(0.99,1.0,cos(2.0*3.14*rnd * u_time / 50.0));
  //gl_FragColor = vec4(d, u_mouse.x/u_resolution.x, u_mouse.y/u_resolution.y, 1.0);
  //gl_FragColor = vec4(col, 1.0);

  //Fullgray randomness
  //vec3 col = vec3(rnd,rnd,rnd);

  // B&W randomness
  vec3 col = vec3(steped_rnd*fuv.x/4.0,0.0,steped_rnd-0.7);

  gl_FragColor = vec4(col,1.0);
  //gl_FragColor = vec4(vec3(rnd),1.0);
}

