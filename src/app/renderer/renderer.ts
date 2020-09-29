import * as THREE from 'three';
import { Formula } from '../shaders/formulas/formula';
import { Mandelbulb } from '../shaders/formulas/mandelbulb';
import { RaymarchShader } from '../shaders/raymarch';

export class RendererComponent {

  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  camera: THREE.OrthographicCamera;
  scene: THREE.Scene;
  material: THREE.ShaderMaterial;
  formula: Formula;

  uniforms = {
    iTime: { value: 0 },
    iResolution:  { value: new THREE.Vector3() },
    iCameraTarget: { value: new THREE.Vector3(0, 0, 1) },
    iCameraOrigin: { value: new THREE.Vector3(0, 0, -3) },
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
    this.material = new THREE.ShaderMaterial();
    this.material.uniforms = this.uniforms;

    const raymarcher = new RaymarchShader();
    this.formula = new Mandelbulb();
    for(const key in this.formula.uniforms) {
      this.uniforms[key] = this.formula.uniforms[key];
    }
    this.material.fragmentShader = raymarcher.build(this.formula);
    const mesh = new THREE.Mesh(plane, this.material);
    this.scene.add(mesh);
    window.addEventListener('resize', () => this.setSize());
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
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

  handleKeyDown($event: any) {
    console.log($event);
  }

  setShader(fragmentShader: string) {
    this.material.fragmentShader = fragmentShader;
    this.material.needsUpdate = true;
  }

}
