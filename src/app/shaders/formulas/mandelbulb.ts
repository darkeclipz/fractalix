import { FloatRange, Formula, IntegerRange } from './formula';

export class Mandelbulb implements Formula {

    uniforms = {
        iRotationX: { value: 0.0, range: new FloatRange(0, 2*3.1415, 0.01) },
        iRotationY: { value: 0.0, range: new FloatRange(0, 2*3.1415, 0.01) },
        iRotationZ: { value: 0.0, range: new FloatRange(0, 2*3.1415, 0.01) },
        iIterations: { value: 8, range: new IntegerRange(1, 14) },
        iBailout: { value: 2.0 },
        iPower: { value: 8.0, range: new FloatRange(1.0, 20.0, 0.01) }
    };

    build(): string {
        return `
        uniform float iRotationX;
        uniform float iRotationY;
        uniform float iRotationZ;
        uniform float iIterations;
        uniform float iBailout;
        uniform float iPower;

        vec2 DE(vec3 pos, float time) {
            pos *= rotateX(iRotationX);
            pos *= rotateY(iRotationY);
            pos *= rotateZ(iRotationZ);

            vec3 trap = vec3(0,0,0);
            float minTrap = 1e10;
            vec3 z = pos;
            float dr = 1.0;
            float r = 0.0;
            for (float i = 0.; i < iIterations ; i++) {
                r = length(z);
                if (r>iBailout) break;
                
                minTrap = min(minTrap, z.z);
                
                // convert to polar coordinates
                float theta = acos(z.z/r);
                float phi = atan(z.y,z.x);
                dr =  pow( r, iPower-1.0)*iPower*dr + 1.0;
                
                // scale and rotate the point
                float zr = pow( r,iPower);
                theta = theta*iPower;
                phi = phi*iPower;
                
                // convert back to cartesian coordinates
                z = zr*vec3( cos(theta)*cos(phi), cos(theta)*sin(phi), sin(theta) );
        
                z+=pos;
            }
            return vec2(0.5*log(r)*r/dr, minTrap);
        }
        `;
    }
}
