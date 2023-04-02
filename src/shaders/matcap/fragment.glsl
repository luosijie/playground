uniform sampler2D uTexture;
varying vec2 vPoint;

void main () {
    vec4 color = texture(uTexture, vPoint);

    gl_FragColor = color;   
}