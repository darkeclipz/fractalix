import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { RendererComponent } from './renderer/renderer.component';
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

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.renderer = new RendererComponent();
    this.cameraOrigin = this.renderer.uniforms.iCameraOrigin.value;
    this.cameraTarget = this.renderer.uniforms.iCameraTarget.value;
    this.changeDetector.detectChanges();
  }
  
}
