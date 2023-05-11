varying vec2 vPoint;

void main () {
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * modelViewPosition;


    // Set matcap coordinate
    vec3 n = mat3(modelViewMatrix) * normal;
    n = normalize(n);

    vec3 normalizedPosition = normalize(modelViewPosition.xyz);
    vec3 x = normalize(vec3(normalizedPosition.z, 0., normalizedPosition.x));
    vec3 y = cross(normalizedPosition, x);
    vec2 point = vec2(dot(x, n), dot(y, n));
    point = point * .5 + .5; 

    vPoint = point;
}