#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float SQUARE_COLUMNS = 5.0;
const float PI = radians(180.0);
float SURFACE_COLUMNS = floor(max(u_resolution.x, u_resolution.y) / min(u_resolution.x, u_resolution.y) * SQUARE_COLUMNS);
const float DEFAULT_SCANLINE_SPEED = 30.0;
const float lineThickness = 0.1;
const float lineBluriness = 0.3;

const float DEFAULT_RANDOM_FROM_FLOAT_PARAM = 502000.0;
const vec2 DEFAULT_RANDOM_FROM_VEC2_PARAM = vec2(0.840,0.290);

// Get position function
float getScrollModPosition(float speed) {
    return mod(speed * u_mouse.x, SURFACE_COLUMNS);
}
float getScrollPosition(float speed) {
    return speed * u_mouse.x;
}

// Draw vertical line function
float drawVerticalLine(float position, float uvX) {
    return 1.0 - smoothstep(lineThickness, lineBluriness, abs(position - uvX));
}

// Random float generator
float randomFromFloat(float seed, float param) {
  return fract(sin(seed) * param);
}

// Random vec2 generator
float randomFromVec2(vec2 st, vec2 params, float param2) {
  return randomFromFloat(dot(st.xy, params), param2);
}

mat2 rotate2d(float _angle){
  return mat2(cos(_angle),-sin(_angle),
      sin(_angle),cos(_angle));
}


void main() {
  vec2 uv = SQUARE_COLUMNS * gl_FragCoord.xy / min(u_resolution.x, u_resolution.y);
  float CENTERX = SQUARE_COLUMNS * u_resolution.x / u_resolution.y * 0.5;
  float CENTERY = SQUARE_COLUMNS * 0.5;
  vec2 CENTER = vec2(CENTERX, CENTERY);

  uv -= vec2(CENTER);
  // rotate the space
  uv = rotate2d( (uv.x*uv.y*20.0*sin(u_time/10.0))*PI * randomFromFloat(uv.y, DEFAULT_RANDOM_FROM_FLOAT_PARAM)) * uv;

  // move it back to the original place
  uv += vec2(CENTER)-u_mouse;


  float maxUvX = SQUARE_COLUMNS * max(u_resolution.x, u_resolution.y) / min(u_resolution.x, u_resolution.y);
  vec2 floorUV = floor(uv);
  vec2 fractUV = fract(uv);

  uv -= vec2(CENTER);
  // rotate the space
  uv = rotate2d( (cos(u_time/10.0)/2.0)*PI ) * uv;
  // move it back to the original place
  uv += vec2(CENTER);

  vec2 draw = fract(uv);
  draw = vec2(draw.x, draw.y);

  float showCell = 
    mod(floorUV.x, 6.0 *  randomFromVec2(floorUV, DEFAULT_RANDOM_FROM_VEC2_PARAM, DEFAULT_RANDOM_FROM_FLOAT_PARAM)) *
    mod(floorUV.y, 6.0 * randomFromVec2(floorUV, DEFAULT_RANDOM_FROM_VEC2_PARAM, DEFAULT_RANDOM_FROM_FLOAT_PARAM));

  vec3 color = tan(vec3(showCell*draw.x*0.3, showCell*draw.y*0.3, showCell*draw.x*draw.y*0.3));

  gl_FragColor = vec4(color, 1.0);
}







  // DOCS:

  //d = step(0.01, d);
  //d = smoothstep(0.0, 0.1, d);

  //gl_FragColor = vec4(d, u_mouse.x/u_resolution.x, u_mouse.y/u_resolution.y, 1.0);
  //
  //vec3 col = vec3(pixelIsLine,pixelIsLine,pixelIsLine);
  //gl_FragColor = vec4(vec3(rnd),1.0);
