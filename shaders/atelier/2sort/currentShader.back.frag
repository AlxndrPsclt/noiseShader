
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2        u_resolution;

uniform sampler2D   u_tex0;
uniform vec2        u_tex0Resolution;

uniform sampler2D   u_tex1;
uniform vec2        u_tex1Resolution;

varying vec2        v_texcoord;


vec2 hilbert2D(float i, float n) {
    vec2 v = vec2(0.0);

    for (float s = n / 2.0; s > 0.5; s /= 2.0) {
        float rx = (mod(i / 2.0, 2.0) < 1.0) ? 0.0 : 1.0;
        float ry = (mod(i, 2.0) < 1.0) ? 0.0 : 1.0;

        if (ry == 0.0) {
            if (rx == 1.0) {
                v.x = s - 1.0 - v.x;
                v.y = s - 1.0 - v.y;
            }

            float t = v.x;
            v.x = v.y;
            v.y = t;
        }

        v += s * vec2(rx, ry);
        i /= 4.0;
    }

    return v;
}

uint bitTwiddle(uint x) {
    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;
    return x;
}

uint morton2D(vec2 position) {
    uint x = uint(position.x);
    uint y = uint(position.y);
    return (bitTwiddle(y) << 1) | bitTwiddle(x);
}

vec2 invMorton2D(float m) {
    uint mInt = uint(m);
    uint x = mInt & 0x55555555;
    uint y = (mInt >> 1) & 0x55555555;
    return vec2(float(bitTwiddle(x)), float(bitTwiddle(y)));
}




void main (void) {

    vec2 pixel = 1.0/u_resolution.xy;
    vec2 st = gl_FragCoord.xy * pixel;
    vec2 uv = v_texcoord;

    float screen_aspect = u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.0);

    float tex0_aspect = u_tex0Resolution.x/u_tex0Resolution.y;
    vec4 tex0 = texture2D(u_tex0, st);
    color += tex0.rgb * step(0.5, st.x);

    float tex1_aspect = u_tex1Resolution.x/u_tex1Resolution.y;
    vec4 tex1 = texture2D(u_tex1, st);
    color += tex1.rgb * step(st.x, 0.5);

    gl_FragColor = vec4(color,1.0);
}
