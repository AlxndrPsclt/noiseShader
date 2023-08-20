#version 130
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

out vec4 fragColor;


float tangentLineAndShadeZone(vec2 uv,
    vec2 circleCenter, float circleRadius,
    vec2 point,
    float tangentAnimation, float emptyZoneAnimation,
    float tangentVisibility, float emptyZoneVisibility) {
  float color = 0.0;

  float tangentSDF = sdTangentLine(uv, circleCenter, circleRadius, point);
  float tangent = (1.0-smoothstep(0.001,0.002,abs(tangentSDF)))*(tangentAnimation);
  float emptyZone = float(tangentSDF*emptyZoneAnimation>0.0);

  color+= tangent * tangentVisibility + emptyZone * emptyZoneVisibility;

  return color;
}




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
    float circle1 = (1.0-smoothstep(0.001,0.002,abs(sdCircle(uv, CENTER, 0.3))))*(sharpSpike3);
    float tangentSDF = sdTangentLine(uv, CENTER, 0.3, A);
    float tangentSDF2 = sdTangentLine(uv, CENTER, 0.3, D);
    float tangent = (1.0-smoothstep(0.001,0.002,abs(tangentSDF)))*(sharpSpike3);
    float tangent2 = (1.0-smoothstep(0.001,0.002,abs(tangentSDF2)))*(sharpSpike3);
    float emptyZone = float(tangentSDF*sharpSpike1>0.0);
    float emptyZone2 = float(tangentSDF2*sharpSpike1>0.0);

    float newTangentAndShadeZone = 0.0;
    float allTangentsAndShadeZones = 0.0;

    float radius = 0.25;

    for (float i = 0.0; i < 50.0; ++i) {
      //vec2 randomPoint = vec2(10.0*noise(5.0*i), 10.0*noise(rand(i)));
      vec2 randomPoint = vec2(2.0*sin(u_time)*rand(i), 2.0*cos(u_time)*rand(i+1.0))*u_resolution.xy/min(u_resolution.x,u_resolution.y);
      newTangentAndShadeZone = tangentLineAndShadeZone(uv.xy,
          CENTER, (radius - rand(i)*0.03) * (1.0+sin(cos(u_time*0.5))),
          randomPoint,
          sharpSpike3, sharpSpike1,
          1.0, 0.01);
      allTangentsAndShadeZones+=newTangentAndShadeZone;
    }


    vec3 color = vec3(0.001,0.001,0.001);
    //color += vec3(segment1) + vec3(line1) + vec3(circle1) + vec3(tangent);
    color += vec3(circle1)+
      //vec3(tangent) +
      //vec3(tangent2) +
      vec3(allTangentsAndShadeZones);
      //vec3(emptyZone) * 0.1 +
      //vec3(emptyZone2) * 0.1;

    //color += vec3(mortonX);
    //color += vec3(segment1 + noise(u_time));
    //gl_FragColor = vec4(vec3(segment1) + abs(sin(u_time))*color*noise(0.1*u_time), 1.0);
    vec3 colorUnit = vec3(uv.x, uv.y, 0.0);
    //color+=colorUnit;
    fragColor = vec4(color, 1.0);
}



    //color = pow(color, vec3(1.0));
