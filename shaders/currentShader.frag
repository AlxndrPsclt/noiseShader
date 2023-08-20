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
uniform vec2 u_frame;
uniform float u_time;

uniform sampler2D u_doubleBuffer0;

uniform sampler2D u_buffer;

//uniform sampler2D u_tex0;
//uniform vec2 u_tex0Resolution;

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

float particle(vec2 uv, float seed) {
    vec2 particlePosition = vec2(0.0,0.0);
    particlePosition.x = cos(seed)*tan(seed*u_time/10.0)/2.0;
    particlePosition.y = sin(seed*u_time/10.0)/2.0;
    float particleSDF = sdCircle(uv, particlePosition, 0.0);
    float particleSize = 0.0;
    float particleLight = 0.004;
    float particleValue = (1.0-smoothstep(particleSize,particleSize+particleLight,particleSDF));
    return particleValue;
}

float particleAtPosition(vec2 uv, vec2 position) {
    float particleSDF = sdCircle(uv, position, 0.00005);
    float particleSize = 0.00001;
    float particleLight = 0.01;
    float particleValue = (1.0-smoothstep(particleSize,particleSize+particleLight,particleSDF));
    return particleValue;
}




//---------------------------------------------------------------------------

void main()
{
    vec3 color = vec3(0.001,0.001,0.001);

    vec2 uv = (gl_FragCoord.xy-u_resolution.y/2.0)/min(u_resolution.x,u_resolution.y);
    uv.x-=(u_resolution.x-u_resolution.y)/(2.0*u_resolution.y);
    //vec2 CENTER = 0.5*u_resolution.xy/min(u_resolution.x,u_resolution.y);
    vec2 CENTER = vec2(0.0,0.0);
    vec2 uvUnit = gl_FragCoord.xy/u_resolution.xy;
    //vec2 uv_tex0 = u_tex0Resolution.xy/min(u_tex0Resolution.x,u_tex0Resolution.y);
    //vec3 layer00 = texture2D(u_tex0, vec2(-uvUnit.x, uvUnit.y)).xyz;
    //color+=layer00;

    vec2 m = (u_mouse-u_resolution.y/2.0)/min(u_resolution.x,u_resolution.y);
    m.x-=(u_resolution.x-u_resolution.y)/(2.0*u_resolution.y);

    vec3 colorUnit = vec3(uv.x, uv.y, 0.0);

#ifdef DOUBLE_BUFFER_0

    uv*=noise(u_time/5.0);
    color = texture2D(u_doubleBuffer0, uvUnit).rgb;
    color *= 0.99;


    float particleValue = 0.0;
    for(float i = 1.0; i < 100.0; i += 1.0) {
      particleValue = particle(uv, i);
      color+=particleValue;
    }


    //float particle = particleAtPosition(uv, m);

    //color *= (u_frame <= 1.0)? 0.0 : 1.0; // Clean buffer at startup
//    particle = clamp(particle * 0.5 + 0.5, 0.0, 1.0);


    //color+=particle;


    //color+=colorUnit;

    //float noiseVal = noise(noise(uv.x*u_time/50.0)*sin(170.0*uv.x)+cos(uv.y*u_time)*70.0);

#else
    color = texture2D(u_doubleBuffer0, uvUnit).rgb;

#endif
    
    fragColor = vec4(1.0*color, 1.0);
}

    //color = pow(color, vec3(1.0));
