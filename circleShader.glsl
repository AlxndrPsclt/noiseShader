#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
//    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
      vec2 uv = gl_FragCoord.xy/u_resolution.xy * 2.0 - 1.0;

      uv.x *= u_resolution.x / u_resolution.y;


      float d = length(uv);
//
//    d -= 0.5;
//    d = abs(d);
//    
//    d = smoothstep(0.0, 0.1, d);
//
//    gl_FragColor = vec4(vec3(d), 1.0);
      gl_FragColor = vec4(d, 0.0, 0.0, 1.0);
}

