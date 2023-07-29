#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float SQUARE_COLUMNS = 150.0;
const float scanlineSpeed = 50.0;
const float lineThickness = 0.1;
const float lineBluriness = 0.3;

const float DEFAULT_RANDOM_FROM_FLOAT_PARAM = 502000.0;
const vec2 DEFAULT_RANDOM_FROM_VEC2_PARAM = vec2(0.840,0.290);

// draw line function
float drawLine(float time, float uvX, float numberOfColumns) {
  float scannerLineX = mod(scanlineSpeed * u_time, numberOfColumns);
  return 1.0 - smoothstep(lineThickness, lineBluriness, abs(scannerLineX - uvX));
}


// random float generator
float randomFromFloat(float seed, float param) {
  return fract(sin(seed) * param);
}

// random vec2 generator
float randomFromVec2(vec2 st, vec2 params, float param2) {
  return randomFromFloat(dot(st.xy, params), param2);
}

void main() {
  vec2 uv = SQUARE_COLUMNS* gl_FragCoord.xy / min(u_resolution.x, u_resolution.y);
  vec2 fractUV = fract(uv);
  vec2 floorUV = floor(uv);

  vec2 mousePosition = u_mouse.xy / u_resolution.xy;
  float distToOrigin = length(uv);
  float angleToXAxis = atan(uv.y, uv.x);

  float numberOfColumns = floor(SQUARE_COLUMNS * max(u_resolution.x, u_resolution.y) / min(u_resolution.x, u_resolution.y));

  float randomY = randomFromFloat(floorUV.y, DEFAULT_RANDOM_FROM_FLOAT_PARAM);

  float lineColumnNumber = mod(floor(u_time), max(u_resolution.x, u_resolution.y));
  float scrollColumnNumberY = floor(u_time * randomY * 100.0);

  float randomVal = randomFromVec2(vec2(floorUV.x - scrollColumnNumberY, floorUV.y), DEFAULT_RANDOM_FROM_VEC2_PARAM, 4002000.0);
  float stepRandom = step(0.95, randomVal);

  float scannerLineX = mod(scanlineSpeed * u_time, numberOfColumns);

  float pixelOnLine = 1.0 - smoothstep(lineThickness, lineBluriness, abs(scannerLineX - uv.x));


  // Call the drawLine function
  float pixelOnLine1 = drawLine(u_time, uv.x, numberOfColumns);
  float pixelOnLine2 = drawLine(u_time + 10.0, uv.x, numberOfColumns); // draw a second line with a different time value

  vec3 color = vec3(max(pixelOnLine1, pixelOnLine2) + stepRandom, max(pixelOnLine1, pixelOnLine2) + stepRandom, max(pixelOnLine1, pixelOnLine2) + stepRandom);


  //vec3 color = vec3(stepRandom + pixelOnLine, stepRandom + pixelOnLine, stepRandom + pixelOnLine);

  gl_FragColor = vec4(color, 1.0);
}







  // DOCS:

  //d = step(0.01, d);
  //d = smoothstep(0.0, 0.1, d);

  //gl_FragColor = vec4(d, u_mouse.x/u_resolution.x, u_mouse.y/u_resolution.y, 1.0);
  //
  //vec3 col = vec3(pixelIsLine,pixelIsLine,pixelIsLine);
  //gl_FragColor = vec4(vec3(rnd),1.0);
