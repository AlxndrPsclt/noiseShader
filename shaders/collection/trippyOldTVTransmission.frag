#version 330 core
#define BUFFER
#ifdef GL_ES
precision mediump float;
#endif

#include "lib/utils.glsl"
#include "lib/shapes.glsl"
#include "lib/shapingFunctions.glsl"
#include "lib/uniformsOSC.glsl"

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform sampler2D u_buffer;

uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;

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
    vec2 uv01 = gl_FragCoord.xy/u_resolution.xy;
    vec2 uv_tex0 = u_tex0Resolution.xy/min(u_tex0Resolution.x,u_tex0Resolution.y);

    vec2 CENTER = 0.5*u_resolution.xy/min(u_resolution.x,u_resolution.y);

    vec2 m = vec2(u_mouse.x/u_resolution.x, u_mouse.y/u_resolution.y);

    vec3 color = vec3(0.001,0.001,0.001);

    vec3 colorUnit = vec3(uv.x, uv.y, 0.0);
    //color+=colorUnit;

    float maxAge = 3.0; // Maximum age before resetting the particle
    float speed = 0.2;  // Speed factor
    vec2 particlePosition = CENTER;
    float particleSDF = sdCircle(uv, particlePosition, 0.0);
    float particleSize = 0.0;
    float particleLight = 0.007;
    float particle = (1.0-smoothstep(particleSize,particleSize+particleLight,particleSDF));

    vec3 layer00 = texture2D(u_tex0, vec2(-uv01.x, uv01.y)).xyz;
    color+=layer00;

    //color+=particle;



    float noiseVal = noise(noise(uv.x*u_time/50.0)*sin(170.0*uv.x)+cos(uv.y*u_time)*70.0);

    
    fragColor = vec4(4.0*color/noiseVal, 1.0);
}

    //color = pow(color, vec3(1.0));
