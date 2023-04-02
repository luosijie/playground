uniform float uHeight;
uniform vec3 uColor;

varying vec3 vModelPosition;

void main () {
    float opacity = vModelPosition.z / (uHeight + 0.1);
    opacity = 1.0 - opacity;
    opacity *= .4;

    if (vModelPosition.z > (uHeight - .1) || vModelPosition.z < 0.25) {
        discard;
    }

    gl_FragColor = vec4(uColor, opacity);   
}