#define BUFFER
#ifdef GL_ES
precision mediump float;
#endif

#include "lib/utils.glsl"
#include "lib/shapes.glsl"
#include "lib/shapingFunctions.glsl"

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform sampler2D u_buffer;
uniform sampler2D u_texture_0;


// LIB



//---------------------------------------------------------------------------

void main()
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy/min(u_resolution.x,u_resolution.y);
    vec2 CENTER = 0.5*u_resolution.xy/min(u_resolution.x,u_resolution.y);

    vec2 A = vec2(0.25, 0.25);
    vec2 B = vec2(0.77, 0.53);
    vec2 C = vec2(0.13, 0.36);
    vec2 D = vec2(0.66, 0.22);

    float sharpSpike1 = funcSmoothSpikeWithThresholdWithDefaults(0.5*u_time, 0.1, 0.5);
    float sharpSpike2 = funcSmoothSpikeWithThresholdWithDefaults(0.1*u_time, 0.1, 0.5);
    float sharpSpike3 = funcSmoothSpikeWithThresholdWithDefaults(0.5*u_time, 0.1, 0.9);
    //float segment1 = (1.0-smoothstep(0.001,0.002,sdSegment(uv, A, CENTER )))*(sharpSpike1);
    //float line1 = (1.0-smoothstep(0.001,0.002,sdLine(uv, C, D )))*(sharpSpike3);
    float circle1 = (1.0-smoothstep(0.001,0.002,abs(sdCircle(uv, CENTER, 0.3))))*(sharpSpike2);
    float tangentSDF = sdTangentLine(uv, CENTER, 0.3, A);
    float tangent = (1.0-smoothstep(0.001,0.002,abs(tangentSDF)))*(sharpSpike3);
    float emptyZone = float(tangentSDF*sharpSpike1>0.0);



    vec3 color = vec3(0.001,0.001,0.001);
    //color += vec3(segment1) + vec3(line1) + vec3(circle1) + vec3(tangent);
    color += vec3(circle1)+
      vec3(tangent) +
      vec3(emptyZone) * 0.1;
    //color += vec3(segment1 + noise(u_time));
    //gl_FragColor = vec4(vec3(segment1) + abs(sin(u_time))*color*noise(0.1*u_time), 1.0);
    color = color;
    gl_FragColor = vec4(color, 1.0);
}



    //color = pow(color, vec3(1.0));
