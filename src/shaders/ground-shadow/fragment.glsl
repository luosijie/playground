uniform sampler2D uTexture;
uniform vec3 uColor;

varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    uv.y = 1. - uv.y;
    vec4 textureColor = texture2D(uTexture, uv);


    float alpha = 1.0 - textureColor.r;
    alpha = smoothstep(.2, 1.2, alpha);
    // alpha = smoothstep(0.16, .8, alpha);
    // alpha = alpha * .8;

    gl_FragColor = vec4(uColor, alpha);
    // gl_FragColor = vec4(1.0, 0., 0., 1.);
}
