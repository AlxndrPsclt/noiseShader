#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform sampler2D u_texture_0;

mat2 rotate2d(float theta)
{
    float c = cos(theta);
    float s = sin(theta);
    return mat2(
        c, -s,
        s, c
    );
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


    vec3 layer01 = dist*(vec3(0.0, 0.0, 0.8));
    vec3 mask01 = vec3(0.8,0.8,0.8);


    // MIX LAYERS
    color += layer00 * mask00;
    color += layer01 * mask01;

    gl_FragColor = vec4(color, 1.0);
}



    //color = pow(color, vec3(1.0));
