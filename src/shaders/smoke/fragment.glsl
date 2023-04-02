uniform float uTime;

varying vec2 vUv;

#include ../libs/noise.glsl

void main () {
    vec2 uv = vUv;
    
    uv *= vec2(6., 1.);
    uv.y += uTime *.3 ;
    
    vec3 color = vec3(1.);
    float alpha = noise(uv);
    
    alpha = alpha - abs(vUv.x);
    alpha = alpha - (1.0 - vUv.y) * .5;
    
    gl_FragColor = vec4(color, alpha);   
}