#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float PI = radians(180.0);
//float SURFACE_COLUMNS = floor(max(u_resolution.x, u_resolution.y) / min(u_resolution.x, u_resolution.y) * square_columns);
const float DEFAULT_SCANLINE_SPEED = 50.0;
const float lineThickness = 0.1;
const float lineBluriness = 0.3;

const float DEFAULT_RANDOM_FROM_FLOAT_PARAM = 502000.0;
const vec2 DEFAULT_RANDOM_FROM_VEC2_PARAM = vec2(0.840,0.290);

// Get position function
float getScrollModPosition(float speed) {
    return mod(speed * u_time, 200.0);
}
float getScrollPosition(float speed) {
    return speed * u_time;
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

void main() {
  float square_columns = u_mouse.x;
  vec2 uv = square_columns * gl_FragCoord.xy / min(u_resolution.x, u_resolution.y);
  float maxUvX = square_columns * max(u_resolution.x, u_resolution.y) / min(u_resolution.x, u_resolution.y);
  vec2 floorUV = floor(uv);

  float randomY = randomFromFloat(floorUV.y, DEFAULT_RANDOM_FROM_FLOAT_PARAM);
  float scrollColumnNumberY = floor(u_time * randomY * cos(uv.x / 100.0)* u_mouse.y);
  float randomX = randomFromFloat(floorUV.x, DEFAULT_RANDOM_FROM_FLOAT_PARAM);
  float scrollColumnNumberX = floor(u_time * randomX * 100.0 * sin(uv.y / 100.0)* u_mouse.x);

  float randomVal = randomFromVec2(vec2(floorUV.x - scrollColumnNumberY - scrollColumnNumberX, floorUV.y), u_mouse.x * DEFAULT_RANDOM_FROM_VEC2_PARAM, u_mouse.y * 4002000.0);
  float randomValN1 = randomFromVec2(vec2(floorUV.x - scrollColumnNumberY  - scrollColumnNumberX+ 1.0, floorUV.y), u_mouse.x * DEFAULT_RANDOM_FROM_VEC2_PARAM, u_mouse.y * 4002000.0);
  float randomValN2 = randomFromVec2(vec2(floorUV.x - scrollColumnNumberY  - scrollColumnNumberX+ 2.0, floorUV.y), u_mouse.x * DEFAULT_RANDOM_FROM_VEC2_PARAM, u_mouse.y * 4002000.0);
  float randomValN3 = randomFromVec2(vec2(floorUV.x - scrollColumnNumberY  - scrollColumnNumberX+ 3.0, floorUV.y), DEFAULT_RANDOM_FROM_VEC2_PARAM, 4002000.0);
  float randomValN4 = randomFromVec2(vec2(floorUV.x - scrollColumnNumberY  - scrollColumnNumberX+ 4.0, floorUV.y), u_mouse.x * DEFAULT_RANDOM_FROM_VEC2_PARAM, 4002000.0);
  float randomValN5 = randomFromVec2(vec2(floorUV.x - scrollColumnNumberY  - scrollColumnNumberX+ 5.0, floorUV.y), DEFAULT_RANDOM_FROM_VEC2_PARAM, u_mouse.y * 4002000.0);
  float cloudPointPixelValue = step(1.0-sin(u_time/10.0)/2.0, randomVal);
  float cloudPointPixelValueN1 = step(0.85, randomValN1);
  float cloudPointPixelValueN2 = step(0.85, randomValN2);
  float cloudPointPixelValueN3 = step(0.85, randomValN3);
  float cloudPointPixelValueN4 = step(0.75, randomValN4);
  float cloudPointPixelValueN5 = step(0.65, randomValN5);

  // Get line positions and draw the lines
  float speed1 = DEFAULT_SCANLINE_SPEED;
  float speed2 = speed1 * 2.337;
  float position1 = getScrollModPosition(speed1);
  float position2 = getScrollModPosition(speed2);
  float pixelOnLine1 = drawVerticalLine(position1, uv.x);
  float pixelOnLine2 = drawVerticalLine(position2, uv.x);

  float numberOfLaps = (speed2 - speed1) * u_time / (maxUvX);
  float numberOfLapsMod2 = mod(floor(numberOfLaps),2.0);

  bool showPoints = false;
  if (numberOfLapsMod2 == 0.0) {
    if (position1 < position2) {
      showPoints = position1 < uv.x && uv.x < position2;
    } else {
      showPoints = uv.x < position2 || position1 < uv.x;
    }
  } else {
    if (position1 > position2) {
      showPoints = max(position1, position2) > uv.x && uv.x > min(position1, position2);
    } else {
      showPoints = max(position1, position2) <= uv.x || uv.x < min(position1, position2);
    }

  }

  showPoints=true;

//  vec3 color = vec3(
//      pixelOnLine1 + pixelOnLine2 + float(showPoints) * cloudPointPixelValue,
//      max(pixelOnLine1, pixelOnLine2) + float(showPoints) * cloudPointPixelValue,
//      max(pixelOnLine1, pixelOnLine2) + float(showPoints) * cloudPointPixelValue);

  vec3 color = vec3(
      1.0 / randomY * 0.1 * float(showPoints) * cloudPointPixelValue +
      0.8 * cloudPointPixelValueN1 +
      0.8 * cloudPointPixelValueN2 +
      0.7 * cloudPointPixelValueN3 +
      0.5 * cloudPointPixelValueN4 +
      0.35 * cloudPointPixelValueN5,
      1.0 / randomY * 0.1 * float(showPoints) * cloudPointPixelValue +
      0.8 * cloudPointPixelValueN1 + 
      0.8 * cloudPointPixelValueN2 + 
      0.7 * cloudPointPixelValueN3 + 
      0.5 * cloudPointPixelValueN4 + 
      0.35 * cloudPointPixelValueN5,
      1.0 / randomY * 0.1 * float(showPoints) * cloudPointPixelValue +
      0.8 * cloudPointPixelValueN1 + 
      0.8 * cloudPointPixelValueN2 + 
      0.7 * cloudPointPixelValueN3 + 
      0.5 * cloudPointPixelValueN4 + 
      0.35 * cloudPointPixelValueN5
    );


  vec3 color2 = vec3(0.0);

  color2 = vec3(
      exp(abs(uv.x - sin(uv.x) * 500.0)/400.0), 
      exp(abs(uv.y - cos(uv.y) * u_mouse.y)/400.0), 
      exp(abs(uv.y - tan(uv.y * uv.x) * u_mouse.y)/400.0)
    );

  gl_FragColor = vec4(color * color2, 1.0);
}







  // DOCS:

  //d = step(0.01, d);
  //d = smoothstep(0.0, 0.1, d);

  //gl_FragColor = vec4(d, u_mouse.x/u_resolution.x, u_mouse.y/u_resolution.y, 1.0);
  //
  //vec3 col = vec3(pixelIsLine,pixelIsLine,pixelIsLine);
  //gl_FragColor = vec4(vec3(rnd),1.0);
