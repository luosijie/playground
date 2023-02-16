uniform vec3 uColor;

varying vec2 vUv;

#define PI 3.141592653589793

float sineInOut (float t) {
    return - 0.5 * (cos(PI * t) - 1.0);
}

void main () {
    float radius = .5;
    vec2 uv = vUv * 2. - 1.;
    vec3 color = uColor;  
    float opacity = abs(smoothstep(0., .8, uv.x));

    float lengthX = abs(uv.x);
    float lengthY = abs(uv.y);

    float strength;

    if (lengthX > 1. - radius && lengthY > 1. - radius) {
        strength = clamp(1.0 - distance(vec2(lengthX, lengthY), vec2(1.0 - radius, 1.0 - radius)) / radius, 0.0, 1.0);
    } else {
        float strengthX = clamp((1.0 - lengthX) / radius, .0, 1.);
        float strengthY = clamp((1.0 - lengthY) / radius, .0, 1.);
        strength = strengthX * strengthY;
    }

    opacity = sineInOut(strength);

    opacity *= .3;
    
    gl_FragColor = vec4(color, opacity);   
}