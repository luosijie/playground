uniform vec3 uColor;
uniform float uType;
uniform float uOpacity;

varying vec2 vUv;

#define PI 3.141592653589793
#define RADIUS .5

float sineInOut (float t) {
    return - 0.5 * (cos(PI * t) - 1.0);
}

void main () {
    vec2 uv = vUv * 2. - 1.;    

    float strength;

    if (uType == 0.) {
        float lengthX = abs(uv.x);
        float lengthY = abs(uv.y);
        // box
        if (lengthX > 1. - RADIUS && lengthY > 1. - RADIUS) {
            strength = clamp(1.0 - distance(vec2(lengthX, lengthY), vec2(1.0 - RADIUS, 1.0 - RADIUS)) / RADIUS, 0.0, 1.0);
        } else {
            float strengthX = clamp((1.0 - lengthX) / RADIUS, .0, 1.);
            float strengthY = clamp((1.0 - lengthY) / RADIUS, .0, 1.);
            strength = strengthX * strengthY;
        }

    } else {
        // circle
        strength = clamp(1.0 - length(uv), 0., 1.);
    }

    float opacity = sineInOut(strength);

    opacity *= uOpacity * .5;
    
    gl_FragColor = vec4(uColor, opacity);   
}