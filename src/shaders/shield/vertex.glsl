varying vec3 vModelPosition;

void main () {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vModelPosition = modelPosition.xyz;
}