#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

const float PI = radians(180.0);

vec2 complexSquare(vec2 z) {
    return vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
}

const float DEFAULT_RANDOM_FROM_FLOAT_PARAM = 502000.0;
const vec2 DEFAULT_RANDOM_FROM_VEC2_PARAM = vec2(0.840,0.290);

// Random float generator
float randomFromFloat(float seed, float param) {
  return fract(sin(seed) * param);
}

// Random vec2 generator
float randomFromVec2(vec2 st, vec2 params, float param2) {
  return randomFromFloat(dot(st.xy, params), param2);
}


void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    
    // de 6 à 12 s
    vec2 c = vec2(0.8 * cos(2.0*PI*cos(u_time/10.0)), 0.8 * sin(2.0*PI*sin(u_time/10.0))); // you can play around with these values
    vec2 z = uv;
    
    float iterations = 0.0;
    for(float i = 0.0; i < 100.0; i += 1.0) { // you can also play with these iteration counts
        z = complexSquare(z) + c;
        
        iterations += 1.0;
        if(dot(z, z) > 4.0) {
            break;
        }
    }

    // You can also play with the color rendering. Here, I'm using a simple grayscale based on the iteration count.
    float shade = iterations / 100.0;

    vec3 color = vec3(shade * dot(z,z)/u_time, 0.0);

    gl_FragColor = vec4(color, 1.0);

}
