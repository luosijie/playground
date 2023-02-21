uniform float uTime;

varying vec2 vUv;

#include ../common/noise.glsl

void main () {
    vec2 uv = vUv;
    uv *= 6.;
    uv.x *= 3.;
    uv.y += uTime * .8;

    vec3 color = vec3(1.);
    float opacity = noise(uv);
    opacity *= noise(vUv);
    
    gl_FragColor = vec4(color, opacity);   
}