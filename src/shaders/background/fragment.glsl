uniform sampler2D uBackground;

varying vec2 vUv;

void main()
{
    vec4 backgroundColor = texture2D(uBackground, vUv);

    gl_FragColor = backgroundColor;
    // gl_FragColor = vec4(1.0, 0., 0., 1.);
}
