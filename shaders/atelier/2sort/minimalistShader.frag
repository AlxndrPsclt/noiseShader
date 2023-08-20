#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float SQUARE_COLUMNS = 100.0;

const float PI = radians(180.0);
float SURFACE_COLUMNS = floor(max(u_resolution.x, u_resolution.y) / min(u_resolution.x, u_resolution.y) * SQUARE_COLUMNS);

const float DEFAULT_RANDOM_FROM_FLOAT_PARAM = 502000.0;
const vec2 DEFAULT_RANDOM_FROM_VEC2_PARAM = vec2(0.840,0.290);

// Get position function
float getScrollModPosition(float speed) {
    return mod(speed * u_time, SURFACE_COLUMNS);
}
float getScrollPosition(float speed) {
    return speed * u_time;
}

mat2 rotate2d(float _angle){
  return mat2(cos(_angle),-sin(_angle),
      sin(_angle),cos(_angle));
}

// Random float generator
float randomFromFloat(float seed, float param) {
  return fract(sin(seed) * param);
}

// Random vec2 generator
float randomFromVec2(vec2 st, vec2 params, float param2) {
  return randomFromFloat(dot(st.xy, params), param2);
}

void main() {
  vec2 m = SQUARE_COLUMNS * u_mouse.xy /min(u_resolution.x, u_resolution.y);
  vec2 uv = SQUARE_COLUMNS * gl_FragCoord.xy / min(u_resolution.x, u_resolution.y);
  //uv += vec2(SQUARE_COLUMNS * 0.5);
  //uv = rotate2d(-1.0*m.x/1000.0*PI ) * uv;
  float maxUvX = SQUARE_COLUMNS * max(u_resolution.x, u_resolution.y) / min(u_resolution.x, u_resolution.y);
  vec2 floorUV = floor(uv);
  vec2 fractUV = fract(uv);


  float pixelColor = randomFromVec2(floorUV, DEFAULT_RANDOM_FROM_VEC2_PARAM, DEFAULT_RANDOM_FROM_FLOAT_PARAM);
  pixelColor = step(0.97, pixelColor);
  float d = length(floorUV-floor(m));
  float angle = atan(uv.y, uv.x);


  vec3 c1 = vec3(d*fractUV, 0.0);
  vec3 color = c1 * vec3(pixelColor, pixelColor,pixelColor);

  //uv = rotate2d(2.0*m.x/1000.0*PI ) * uv;

  gl_FragColor = vec4(color, 1.0);
}







  // DOCS:

  //d = step(0.01, d);
  //d = smoothstep(0.0, 0.1, d);

  //gl_FragColor = vec4(d, u_mouse.x/u_resolution.x, u_mouse.y/u_resolution.y, 1.0);
  //
  //vec3 col = vec3(pixelIsLine,pixelIsLine,pixelIsLine);
  //gl_FragColor = vec4(vec3(rnd),1.0);
