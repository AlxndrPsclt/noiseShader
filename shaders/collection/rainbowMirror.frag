#define BUFFER
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform sampler2D u_buffer;
uniform sampler2D u_texture_0;

const float PI = 3.1415926535897932384626433;
const float DEFAULT_RANDOM_FROM_FLOAT_PARAM = 502000.0;
const vec2 DEFAULT_RANDOM_FROM_VEC2_PARAM = vec2(0.840,0.290);


mat2 rotate2d(float theta)
{
    float c = cos(theta);
    float s = sin(theta);
    return mat2(
        c, -s,
        s, c
    );
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


void main()
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    //vec3 color = vec3(0.3,0.5,0.7);
    vec3 color = vec3(0.0,0.0,0.0);
    //uv = uv + 1.0;
    //uv.x *= u_resolution.x / u_resolution.y;
//

    // LAYER01
    float dist = abs(uv.x + uv.y);
//
    vec3 layer00 = texture2D(u_texture_0, uv).xyz;
    vec3 mask00 = vec3(0.8,0.8,0.8);


    vec3 layer01 = dist*(vec3(0.1, 0.4, 0.4));
    vec3 mask01 = vec3(0.3,0.3,0.3);

    vec3 layer02 = texture2D(u_buffer, uv).xyz;
    vec3 mask02 = vec3(0.1,0.99,0.1);

    color += float(uv.x < (rand(uv.y*u_time)/100.0 + abs(cos(1.0+abs(cos(u_time/5.3)))/6.0))+float(uv.x >0.12+abs(0.5+2.0*sin(sin(u_time/3.0)))/6.0))*vec3(0.33,0.77,0.9);
    color += float(uv.y < (rand(uv.x*u_time)/100.0 + abs(cos(1.0+abs(sin(u_time/3.0)))/6.0))+float(uv.y >0.73*(1.0+sin(u_time/2.0)/4.0)+abs(0.5+2.0*sin(cos(u_time/7.2)))/6.0))*vec3(0.63,0.17,0.3);

    uv -= vec2(noise(u_time),0.5);
    uv=rotate2d(noise(u_time)*PI/4.0)*uv;
    uv += vec2(0.5*noise(u_time),0.5);

    color += float(uv.x < (rand(uv.x*u_time)/100.0 + abs(cos(1.7+abs(cos(u_time/5.3)))/6.0))+float(uv.x >0.12+abs(0.5+2.0*sin(sin(u_time/3.0)))/6.0))*vec3(0.33,0.77,0.9);
    color += float(uv.y < (rand(uv.y*u_time)/100.0 + abs(cos(1.0+abs(sin(u_time/3.0)))/4.0))+float(uv.y >0.83*(1.0+sin(u_time)/4.0)+abs(0.5+2.0*sin(cos(u_time/7.2)))/6.0))*vec3(0.63,0.17,0.3);

    uv -= vec2(0.5,0.5);
    uv=rotate2d(noise(u_time)*PI/4.0)*uv;
    uv += vec2(0.5,0.5);

    color += float(uv.x < (rand(uv.x*u_time)/100.0 + abs(cos(1.7+abs(cos(u_time/5.3)))/6.0))+float(uv.x >0.12+abs(0.5+2.0*sin(sin(u_time/3.0)))/6.0))*vec3(0.33,0.77,0.9);
    color += float(uv.y < (rand(uv.y*3.0*u_time)/100.0 + abs(cos(1.0+abs(sin(u_time/3.0)))/4.0))+float(uv.y >0.83*(1.0+sin(u_time)/4.0)+abs(0.5+2.0*sin(cos(u_time/7.2)))/6.0))*vec3(0.63,0.17,0.3);
    //color += float(uv.y < 0.4 + abs(cos(u_time)/6.0))+float(uv.y >0.73+abs(sin(u_time))/6.0);

    // MIX LAYERS
    color += layer00 * mask00;
    color += (layer01 * mask01);
    //color += 100.0*(layer02);

    gl_FragColor = 1.0/vec4(tan(u_time/color), 0.5);
}



    //color = pow(color, vec3(1.0));
