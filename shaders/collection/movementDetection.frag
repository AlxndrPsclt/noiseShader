#version 330
//#define BUFFER
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

uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;


float BPM=128.0;
float BPS = BPM/60.0;
float BEAT_VALUE = u_time * BPS;
float BEAT_NUMBER = floor(BEAT_VALUE);
float BEAT = fract(BEAT_VALUE);
float BEAT2 = fract(BEAT_VALUE * 0.5);
float BEAT4 = fract(BEAT_VALUE * 0.25);
//float beat = fract(

//uniform sampler2D u_tex0;
//uniform vec2 u_tex0Resolution;

out vec4 fragColor;


//---------------------------------------------------------------------------

void main()
{
    vec3 color = vec3(0.001,0.001,0.001);

    vec2 uv = (gl_FragCoord.xy-u_resolution.y/2.0)/min(u_resolution.x,u_resolution.y);
    //vec2 shaking = randomVec2(BEAT4)/(BEAT2*200.0);
    //uv+=shaking;
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

    color = texture2D(u_tex0, uvUnit).rgb;
    color = vec3(color.r+color.g+color.b)/3.0;




#ifdef DOUBLE_BUFFER_0
//
//    //uv/=0.77*noise(u_time/10.0);
      vec3 previousColor = texture2D(u_doubleBuffer0, uvUnit).rgb;
      float differenceFactor = length(previousColor - color);
    //color *= (0.8);
      //color = vec3(differenceFactor);

      // Apply threshold
      if(differenceFactor > 0.85) {  // Adjust the threshold value as needed
        color = vec3(1.0, 0.0, 0.0); // Red color for movement
      } else {
        color = color*0.8; // No movement
      }


////
//
#else
//      previousColor = texture2D(u_doubleBuffer0, uvUnit).rgb;
//      float differenceFactor = length(previousColor - color);
////    //color *= (0.8);
//      color += 100.0*differenceFactor;
//
       color = texture2D(u_doubleBuffer0, uvUnit).rgb;
//    //color+=colorUnit;
//    //color*=0.2*layer00;
//
#endif

    //color =1.0-pow(color,vec3(1.0));
    float lineSDF = 0.0;

    for(float i = 1.0; i < 100.0; i += 1.0) {
      float lineSDF = sdLine( uv, vec2(0.02*i - 1.0, 0.0), vec2(0.02*i-1.0, 1.0));
      color -= 1.0 - smoothstep(0.001, 0.003, lineSDF);
    }

    fragColor = vec4(color, 1.0);
}

    //color = pow(color, vec3(1.0));
