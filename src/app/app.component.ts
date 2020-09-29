import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { RendererComponent } from './renderer/renderer';
import { Key, KeyboardEventHandler } from './input/keyboard';
import * as THREE from 'three';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'fractalix';
  renderer: RendererComponent;
  cameraOrigin: THREE.Vector3 = new THREE.Vector3();
  cameraTarget: THREE.Vector3 = new THREE.Vector3();
  keyboard: KeyboardEventHandler;
  formula: string = 'mandelbulb';
  uniforms: { }

  constructor(private changeDetector: ChangeDetectorRef) { 
    this.initKeyHandler();
  }

  ngAfterViewInit(): void {
    this.renderer = new RendererComponent();
    this.cameraOrigin = this.renderer.uniforms.iCameraOrigin.value;
    this.cameraTarget = this.renderer.uniforms.iCameraTarget.value;
    this.uniforms = this.renderer.formula.uniforms;
    this.changeDetector.detectChanges();
  }

  initKeyHandler() {
    this.keyboard = new KeyboardEventHandler();

    this.keyboard.bindKey(Key.W, () => { 
      const movement = this.cameraTarget
        .clone()
        .normalize()
        .multiplyScalar(Settings.moveSpeedMultiplier);
      this.cameraOrigin.add(movement); 
    });

    this.keyboard.bindKey(Key.S, () => { 
      const movement = this.cameraTarget
        .clone()
        .normalize()
        .multiplyScalar(-Settings.moveSpeedMultiplier);
      this.cameraOrigin.add(movement); 
    });

    window.addEventListener('keydown', (e) => this.keyboard.onKeyDown(e.keyCode));
    window.addEventListener('keyup', (e) => this.keyboard.onKeyUp(e.keyCode));
    window.addEventListener('keydown', (e) => this.keyboard.invokeKeyDown(e.keyCode));
  }

  onFormulaChanged(formula: string) {
    this.formula = formula;

  }

  uniformHasRange(key: string) {
    return this.uniforms[key] && this.uniforms[key].range;
  }
  
}

export class Settings {
  static moveSpeedMultiplier = 0.05;
}
