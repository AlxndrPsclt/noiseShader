#ifdef GL_ES
precision mediump float;
#endif

const float SQUARE_COLUMNS = 150.0;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = SQUARE_COLUMNS * gl_FragCoord.xy / min(u_resolution.x, u_resolution.y);
  vec2 fuv = fract(uv);
  vec2 iuv = floor(uv);

  float numberOfColumns = floor(SQUARE_COLUMNS * max(u_resolution.x, u_resolution.y) / min(u_resolution.x, u_resolution.y));

  float scannerLineX = mod(50.0*u_time , numberOfColumns);

  float pixelIsLine = 1.0-smoothstep(0.1,0.3, abs(scannerLineX - uv.x));

  vec3 col = vec3(pixelIsLine,pixelIsLine,pixelIsLine);

  gl_FragColor = vec4(col,1.0);
}

