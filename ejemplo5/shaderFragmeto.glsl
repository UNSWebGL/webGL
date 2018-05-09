precision mediump float;
varying vec3 vColor;
void main(void) {
  vec3 a=vec3(vColor.x+0.5,vColor.y+0.5,vColor.z+0.5);
  gl_FragColor = vec4(a, 1.0);
  
}