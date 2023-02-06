varying vec2 vPoint;

void main () {
    vec3 n = mat3(modelViewMatrix) * normal;
    n = normalize(n);

    vPoint.x = n.x * .5 + .5;
    vPoint.y = n.y * .5 + .5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}