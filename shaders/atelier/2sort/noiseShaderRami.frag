#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float SQUARE_COLUMNS = 100.0;
const float PI = radians(180.0);
float SURFACE_COLUMNS = floor(max(u_resolution.x, u_resolution.y) / min(u_resolution.x, u_resolution.y) * SQUARE_COLUMNS);
const float DEFAULT_SCANLINE_SPEED = 30.0;
const float lineThickness = 0.5;
const float lineBluriness = 0.8;

const float DEFAULT_RANDOM_FROM_FLOAT_PARAM = 502000.0;
const vec2 DEFAULT_RANDOM_FROM_VEC2_PARAM = vec2(0.840,0.290);

// Get position function
float getScrollModPosition(float speed) {
    return mod(speed * u_time, SURFACE_COLUMNS);
}
float getScrollPosition(float speed) {
    return speed * u_time;
}

// Draw vertical line function
float drawVerticalLine(float position, float lineThick, float lineBlur, float uvX) {
    return 1.0 - smoothstep(lineThick, lineBlur, abs(position - uvX));
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
  vec2 uv = SQUARE_COLUMNS * gl_FragCoord.xy / min(u_resolution.x, u_resolution.y);
  float maxUvX = SQUARE_COLUMNS * max(u_resolution.x, u_resolution.y) / min(u_resolution.x, u_resolution.y);
  vec2 floorUV = floor(uv);

  float randomY = randomFromFloat(floorUV.y, DEFAULT_RANDOM_FROM_FLOAT_PARAM);
  float scrollColumnNumberY = floor(u_time * randomY * 100.0);

  float randomVal = randomFromVec2(vec2(floorUV.x - scrollColumnNumberY, floorUV.y), DEFAULT_RANDOM_FROM_VEC2_PARAM, 4002000.0);
  //float randomVal1 = randomFromVec2(vec2(floorUV.x - 1.0 - scrollColumnNumberY, floorUV.y), DEFAULT_RANDOM_FROM_VEC2_PARAM, 4002000.0);
  float cloudPointPixelValue = step(0.90, randomVal);

  // Get line positions and draw the lines
  float speed1 = DEFAULT_SCANLINE_SPEED;
  float speed2 = DEFAULT_SCANLINE_SPEED * 2.337;
  float position1 = getScrollModPosition(speed1);
  float position2 = getScrollModPosition(speed2);
  float pixelOnLine15 = drawVerticalLine(position1, lineThickness, lineBluriness, uv.x - (0.8* randomVal * cloudPointPixelValue * 5.0));
  float pixelOnLine14= drawVerticalLine(position1, lineThickness, lineBluriness, uv.x - (0.8* randomVal * cloudPointPixelValue * 4.0));
  float pixelOnLine13 = drawVerticalLine(position1, lineThickness, lineBluriness, uv.x - (0.8* randomVal * cloudPointPixelValue * 3.0));
  float pixelOnLine12 = drawVerticalLine(position1, lineThickness, lineBluriness, uv.x - (0.8* randomVal * cloudPointPixelValue * 2.0));
  float pixelOnLine1 = drawVerticalLine(position1, lineThickness, lineBluriness, uv.x - (0.8* randomVal * cloudPointPixelValue));

  float pixelOnLine25 = drawVerticalLine(position2, lineThickness, lineBluriness, uv.x - (0.8* randomVal * cloudPointPixelValue * 5.0));
  float pixelOnLine24 = drawVerticalLine(position2, lineThickness, lineBluriness, uv.x - (0.8* randomVal * cloudPointPixelValue * 4.0));
  float pixelOnLine23 = drawVerticalLine(position2, lineThickness, lineBluriness, uv.x - (0.8* randomVal * cloudPointPixelValue * 3.0));
  float pixelOnLine22 = drawVerticalLine(position2, lineThickness, lineBluriness, uv.x - (0.8* randomVal * cloudPointPixelValue * 2.0));
  float pixelOnLine2 = drawVerticalLine(position2, lineThickness, lineBluriness, uv.x - (0.8* randomVal * cloudPointPixelValue));

  float numberOfLaps = (speed2 - speed1) * u_time / (floor(maxUvX));
  float numberOfLapsMod2 = mod(floor(numberOfLaps),2.0);

  bool showPoints = false;
  if (position1 <= position2) {
    if (numberOfLapsMod2 == 0.0) {
      showPoints = position1 < uv.x && uv.x < position2;
    } else {
      showPoints = uv.x < position1 || position2 < uv.x;
    }
  } else {
    if (numberOfLapsMod2 == 0.0) {
      showPoints = uv.x < position2 || position1 < uv.x;
    } else {
      showPoints = position2 < uv.x && uv.x < position1;
    }
  }

  vec3 color = vec3(
      (0.33) * (pixelOnLine1 + pixelOnLine2 +
        pixelOnLine12 + pixelOnLine13 + pixelOnLine14 + pixelOnLine15 +
        pixelOnLine22 + pixelOnLine23 + pixelOnLine24 + pixelOnLine25
        ) + float(showPoints) * cloudPointPixelValue,
      (0.33)* (pixelOnLine1 + pixelOnLine2 +
        pixelOnLine12 + pixelOnLine13 + pixelOnLine14 + pixelOnLine15 +
        pixelOnLine22 + pixelOnLine23 + pixelOnLine24 + pixelOnLine25
        ) +
      float(showPoints) * cloudPointPixelValue,
      (0.33)* (pixelOnLine1 + pixelOnLine2 +
        pixelOnLine12 + pixelOnLine13 + pixelOnLine14 + pixelOnLine15 +
        pixelOnLine22 + pixelOnLine23 + pixelOnLine24 + pixelOnLine25
      ) +
        float(showPoints) * cloudPointPixelValue);

  gl_FragColor = vec4(color, 1.0);
}







  // DOCS:

  //d = step(0.01, d);
  //d = smoothstep(0.0, 0.1, d);

  //gl_FragColor = vec4(d, u_mouse.x/u_resolution.x, u_mouse.y/u_resolution.y, 1.0);
  //
  //vec3 col = vec3(pixelIsLine,pixelIsLine,pixelIsLine);
  //gl_FragColor = vec4(vec3(rnd),1.0);
