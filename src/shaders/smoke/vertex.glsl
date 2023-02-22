uniform float uTime;

varying vec2 vUv;
#include ../libs/noise.glsl
void main () {

    vec2 nUv = uv;
    nUv.x = 2. * nUv.x - 1.;

    vec3 nPosition = position;
    float offset = noise(vec2(nPosition.x, nPosition.z) * uTime);

    nPosition.z += noise(nUv + offset) * .3;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(nPosition, 1.0);

    vUv = nUv;
}