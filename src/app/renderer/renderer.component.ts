import * as THREE from 'three';
import { mandelbulbShader } from '../../shaders/shaders';

export class RendererComponent {

  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  camera: THREE.OrthographicCamera;
  scene: THREE.Scene;

  uniforms = {
    iTime: { value: 0 },
    iResolution:  { value: new THREE.Vector3() },
    iCameraTarget: { value: new THREE.Vector3(0, 0, 1) },
    iCameraOrigin: { value: new THREE.Vector3(0, 0, -2) },
  };

  constructor() {
    this.init();
    this.render(0);
  }

  init() {
    this.canvas = document.querySelector('#canvas') as HTMLCanvasElement;
    const canvas = this.canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.autoClearColor = false;
    this.setSize();
    this.camera = new THREE.OrthographicCamera(
      -1, 1, 1, -1, -1, 1
    );
    this.scene = new THREE.Scene();
    const plane = new THREE.PlaneBufferGeometry(2, 2);
    const material = new THREE.ShaderMaterial();
    material.uniforms = this.uniforms;
    material.fragmentShader = mandelbulbShader;
    const mesh = new THREE.Mesh(plane, material);
    this.scene.add(mesh);
    window.addEventListener('resize', () => this.setSize());


    window.addEventListener('keydown', (e) => console.log(e));
    canvas.addEventListener('mousedown', () => console.log('canvas clicked'));
  }

  setSize() {
    const panel = document.querySelector('.render-panel') as HTMLDivElement;
    const renderRectangle = panel.getBoundingClientRect();
    this.canvas.width = renderRectangle.width + 1;
    this.canvas.height = renderRectangle.height;
    this.uniforms.iResolution.value.set(this.canvas.width, this.canvas.height, 1);
    this.renderer.setSize(this.canvas.width, this.canvas.height, false);
  }

  render(time) {
    time *= 0.001; // Convert to seconds
    this.uniforms.iTime.value = time;
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame((t) => this.render(t));
  }

}
