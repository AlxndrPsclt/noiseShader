#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float square_columns = 100.0;
const float PI = radians(180.0);
float SURFACE_COLUMNS = floor(max(u_resolution.x, u_resolution.y) / min(u_resolution.x, u_resolution.y) * square_columns);
const float DEFAULT_SCANLINE_SPEED = 30.0;
const float lineThickness = 0.1;
const float lineBluriness = 0.3;

const float DEFAULT_RANDOM_FROM_FLOAT_PARAM = 502000.0;
const vec2 DEFAULT_RANDOM_FROM_VEC2_PARAM = vec2(0.840,0.290);

vec3 palette( float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263,0.416,0.557);

    return a + b*cos( 6.28318*(c*t+d) );
}

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
  float square_columns = square_columns * u_mouse.x/u_resolution.x *2.0;
  vec2 m = u_mouse/u_resolution;

  vec2 uv = square_columns * gl_FragCoord.xy / (min(u_resolution.x, u_resolution.y));
  //uv = rotate2d( (uv.x/uv.y)*PI * randomFromFloat(uv.x/uv.y, DEFAULT_RANDOM_FROM_FLOAT_PARAM)) * uv;
  uv = rotate2d( (uv.x+uv.y)*PI) * uv;
  vec2 floorUV = floor(uv);
  vec2 fractUV = fract(uv);

  vec2 centeringVector =0.5*vec2(1.0,1.0);
  float sinCosTimeX = sin(cos(u_time)*uv.x);
  float sinCosTimeY = sin(cos(u_time)*uv.y);
  float cosSinTimeX = cos(sin(u_time)*uv.x);
  float cosSinTimeY = cos(sin(u_time)*uv.y);
  float randomFactorX = randomFromFloat(uv.x,DEFAULT_RANDOM_FROM_FLOAT_PARAM)/2.0;
  float randomFactorY = randomFromFloat(uv.y,DEFAULT_RANDOM_FROM_FLOAT_PARAM)/2.0;
  vec2 rowEven = 1.0+mod(floorUV,9.0);
  float isRowOdd = mod(floorUV.x,2.0);

  //float centeringFactorEven = (1.0 + sinCosTimeX) * (1.0 + cosSinTimeY * randomFactorY);
  float centeringFactor = (1.0 -sin(20.0*u_time)/1.0);
  //float centeringFactorOdd = (1.0 + sinCosTimeY) * (1.0 + cosSinTimeX * randomFactorX);
  //float centeringFactor = (1.0-isRowOdd)*centeringFactorEven + isRowOdd * centeringFactorOdd;
  vec2 centering = vec2(centeringVector.x * centeringFactor,(1.0-(centeringVector.y * centeringFactor)));

  vec2 displacement = rowEven * centering;

  float d=length(fractUV - displacement);;

  //float d=length(fractUV-vec2(0.5,0.5)*(1.0+sin(cos(u_time)*uv.x))*(1.0+cos(sin(u_time)*uv.y))*randomFromFloat(uv.y,DEFAULT_RANDOM_FROM_FLOAT_PARAM)/2.0);
  //vec3 draw = palette(uv.x*uv.y/(square_columns * u_resolution.x));
  vec3 draw = vec3(
      1.0/d
      );


  float showCell = 
    floorUV.x * floorUV.y;

  //showCell +=0.99;
  //float showCell = m.x*floorUV.x * m.y*floorUV.y:


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

