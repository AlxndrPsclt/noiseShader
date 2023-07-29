#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float COLUMNS = 150.0;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(0.540,0.290)))*
       4002000.0);
}


void main() {
  vec2 uv = COLUMNS * gl_FragCoord.xy / min(u_resolution.x, u_resolution.y);
  vec2 fuv = fract(uv);
  vec2 iuv = floor(uv);

  //vec2 uv = gl_FragCoord.xy/u_resolution.xy * 2.0 - 1.0;

  //uv.x *= u_resolution.x / u_resolution.y;

  vec2 m = u_mouse.xy/u_resolution.xy;


  float d = length(uv);
  float angle = atan(uv.y, uv.x);

  //d = step(0.01, d);
//d = smoothstep(0.0, 0.1, d);

  float numberOfColumns = COLUMNS * floor(max(u_resolution.x-1.0, u_resolution.y) / min(u_resolution.x, u_resolution.y));

  float rowRand = random(vec2(iuv.y, iuv.y));

  float scrollColNumber = floor(u_time*50.0);

  float rnd = random(vec2(iuv.x - scrollColNumber,iuv.y));
  //float srnd = step(0.95,rnd);
  //float steped_rnd = smoothstep(0.99,1.0,cos(2.0*3.14*rnd * u_time / 50.0));
  //gl_FragColor = vec4(d, u_mouse.x/u_resolution.x, u_mouse.y/u_resolution.y, 1.0);
  //gl_FragColor = vec4(col, 1.0);

  //Fullgray randomness
  //vec3 col = vec3(fuv,0.0);

  // B&W randomness
  vec3 col = vec3(rnd);

  gl_FragColor = vec4(col,1.0);
  //gl_FragColor = vec4(vec3(rnd),1.0);
}

