// set medium percision 
precision mediump float;

// uniform attribute for setting the color
varying vec4 vColor;

void main(void) {
    // Setting color of fragments to input color
    gl_FragColor = vColor;
}