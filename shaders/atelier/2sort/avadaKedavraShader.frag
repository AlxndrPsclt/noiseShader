#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float square_columns = 1080.0;
const float PI = radians(180.0);

float SURFACE_COLUMNS = floor(max(u_resolution.x, u_resolution.y) / min(u_resolution.x, u_resolution.y) * square_columns);

const float lineThickness = 0.1;
const float lineBluriness = 0.3;
const float seedX = 1.618;
const float seedY = 1.0/7.0;

const float DEFAULT_RANDOM_FROM_FLOAT_PARAM = 502000.0;
const vec2 DEFAULT_RANDOM_FROM_VEC2_PARAM = vec2(0.840,0.290);

// Draw vertical line function
float drawVerticalLine(float position, float uvX) {
    return 1.0 - smoothstep(lineThickness, lineBluriness, abs(position - uvX));
}

float randomFromFloat(float seed, float param) {
  return fract(sin(seed) * param);
}
float randomFF(float seed) {
  return randomFromFloat(seed, DEFAULT_RANDOM_FROM_FLOAT_PARAM);
}
float rand(float seed) {
  return randomFromFloat(seed, DEFAULT_RANDOM_FROM_FLOAT_PARAM);
}

float noise(float seed) {
  float i = floor(seed);  // integer
  float f = fract(seed);
  return mix(rand(i), rand(i + 1.0), smoothstep(0.,1.,f));
}

float randomFromVec2(vec2 st, vec2 params, float param2) {
  return randomFromFloat(dot(st.xy, params), param2);
}
float randomFV(vec2 st) {
  return randomFromVec2(st, DEFAULT_RANDOM_FROM_VEC2_PARAM, DEFAULT_RANDOM_FROM_FLOAT_PARAM);
}

mat2 rotate2d(float _angle){
  return mat2(cos(_angle),-sin(_angle),
      sin(_angle),cos(_angle));
}



vec2 point(vec2 uv, float time, float size) {  //size = 10.0
  float isSecondOdd = mod(floor(time), 2.0);
  float MIDDLE_COLUMN = floor(SURFACE_COLUMNS / 2.0);
  vec2 m = u_mouse/u_resolution;
  float isSecondEven= 1.0-isSecondOdd;
  isSecondOdd=1.0;
  isSecondEven=0.0;

  float px1 = floor(SURFACE_COLUMNS*noise(m.x*1.0*sin(time)));
  float py1 = floor(SURFACE_COLUMNS*noise(m.y*1.0*tan(time)));
  //px1 = isSecondOdd * (SURFACE_COLUMNS - px1) + px1 * isSecondEven;

  vec2 p1 = vec2(px1, py1);

  //float amItheChosenPixel1 = float(length(floorUV - p1) < u_time-1.1);
  float amItheChosenPixel1 = float(length((floor(uv) - p1)) < size);

  float d1=0.2;
  //d1 += (isSecondOdd * float(floor(uv).x < MIDDLE_COLUMN)) +
    //(isSecondEven * float(floor(uv).x > MIDDLE_COLUMN));
  d1 = d1*(1.0 + amItheChosenPixel1)*0.25;
  return vec2(amItheChosenPixel1, d1);
}



void main() {
  float square_columns = square_columns;
  vec2 m = u_mouse/u_resolution;

  float isSecondOdd = mod(floor(0.1*u_time), 2.0);
  float isSecondEven= 1.0-isSecondOdd;
  isSecondOdd=1.0;
  isSecondEven=0.0;

  float CENTERX = square_columns * u_resolution.x / u_resolution.y * 0.5;
  float CENTERY = square_columns * 0.5;
  vec2 CENTER = vec2(CENTERX, CENTERY);
  float MIDDLE_COLUMN = floor(SURFACE_COLUMNS / 2.0);

  vec2 uv = square_columns * gl_FragCoord.xy / (min(u_resolution.x, u_resolution.y));

  vec2 floorUV = floor(uv);
  vec2 fractUV = fract(uv);

//  uv -= vec2(CENTER);
//  float randomFX =randomFromFloat(uv.x, DEFAULT_RANDOM_FROM_FLOAT_PARAM);
//  float randomFY =randomFromFloat(uv.y, DEFAULT_RANDOM_FROM_FLOAT_PARAM);
//
//  uv = rotate2d( +((floorUV.x+floorUV.y + 1.0) *m.x* randomF*tan(0.15*u_time))* (tan(m.y*uv.x*uv.y))*PI) * uv;
//  uv = rotate2d( +((floorUV.x+floorUV.y + 2.0) *2.9*(1.0-sin(randomFY*2.0*u_time)/4.0) * randomFX*tan(0.15*u_time))* (tan(uv.x*uv.y*0.001))*PI) * uv;
//  uv = rotate2d( -(PI)) * uv;
//  
//  uv += vec2(CENTER);
//  uv = rotate2d( u_time) * uv;
//
//  floorUV = floor(uv);
//  fractUV = fract(uv);

  float d=0.001;
//
//  //float px = floor(SURFACE_COLUMNS*randomFF(seedX*floor(u_time)));
//  //float py = floor(square_columns*randomFF(seedY*floor(u_time)));
//  float px = floor(0.5*SURFACE_COLUMNS*noise(u_time));
//  float py = floor(0.5*SURFACE_COLUMNS*noise(u_time*0.5));
//  px = isSecondOdd * (SURFACE_COLUMNS - px) + px * isSecondEven;
//
//  vec2 p = vec2(px, py);
//
//  float amItheChosenPixel = float(length((floorUV - p)) < 20.0);
//
//  d += (isSecondOdd * float(floorUV.x < MIDDLE_COLUMN)) +
//    (isSecondEven * float(floorUV.x > MIDDLE_COLUMN));
//
//  d = d*(1.0 + amItheChosenPixel)*0.25;
//
//
//
//  float px1 = floor(0.5*SURFACE_COLUMNS*noise(u_time-1.1));
//  float py1 = floor(0.5*SURFACE_COLUMNS*noise((u_time-1.1)*0.5));
//  px1 = isSecondOdd * (SURFACE_COLUMNS - px1) + px1 * isSecondEven;
//
//  vec2 p1 = vec2(px1, py1);
//
//  //float amItheChosenPixel1 = float(length(floorUV - p1) < u_time-1.1);
//  float amItheChosenPixel1 = float(length((floorUV - p1)) < 15.0);
//
//  float d1=0.2;
//  d1 += (isSecondOdd * float(floorUV.x < MIDDLE_COLUMN)) +
//    (isSecondEven * float(floorUV.x > MIDDLE_COLUMN));
//  d1 = d1*(1.0 + amItheChosenPixel)*0.25;
//


  vec2 newPoint = vec2(0.01,0.01);
  for(float i = 0.0; i < 100.0; i += 1.0) { // you can also play with these iteration counts
    newPoint = point(uv,u_time-i*0.01,200.0/i);
    d += newPoint.x*newPoint.y;
  }


  //float d=length(fractUV-vec2(0.5,0.5)*(1.0+sin(cos(u_time)*uv.x))*(1.0+cos(sin(u_time)*uv.y))*randomFromFloat(uv.y,DEFAULT_RANDOM_FROM_FLOAT_PARAM)/2.0);
  //vec3 draw = palette(uv.x*uv.y/(square_columns * u_resolution.x));
  vec3 draw = (vec3(
      d*noise(u_time),
      d*d,
      noise(d)));

  vec3 color = vec3(draw);

  gl_FragColor = vec4(color, 1.0);
}







  // DOCS:

  //d = step(0.01, d);
  //d = smoothstep(0.0, 0.1, d);

  //gl_FragColor = vec4(d, u_mouse.x/u_resolution.x, u_mouse.y/u_resolution.y, 1.0);
  //
  //vec3 col = vec3(pixelIsLine,pixelIsLine,pixelIsLine);
  //gl_FragColor = vec4(vec3(rnd),1.0);
  //
  //
  //


//  float CENTERX = square_columns * u_resolution.x / u_resolution.y * 0.5;
//  float CENTERY = square_columns * 0.5;
//  vec2 CENTER = vec2(CENTERX, CENTERY);
//
//  uv -= vec2(CENTER);
////  // rotate the space
//  //uv = rotate2d( (uv.x*uv.y)*PI * randomFromFloat(uv.x/uv.y, DEFAULT_RANDOM_FROM_FLOAT_PARAM)) * uv;
//  //uv = rotate2d( u_time) * uv;
////
//  uv += vec2(CENTER);
//  // rotate the space
//  // move it back to the original place

