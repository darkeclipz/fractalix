import { Formula } from './formulas/formula';
import { Shader } from './shader';

export class RaymarchShader implements Shader {
    fragmentShader: string = `
    #include <common>
    
    uniform vec3 iResolution;
    uniform float iTime;
    uniform vec3 iCameraOrigin;
    uniform vec3 iCameraTarget;

    #define AA 1.
    #define R iResolution.xy

    mat3 rotateX(float angle) {
        float c = cos(angle), s = sin(angle);
        return mat3(1, 0, 0, 0, c, -s, 0, s, c);
    }

    mat3 rotateY(float angle) {
        float c = cos(angle), s = sin(angle);
        return mat3(c, 0, -s, 0, 1, 0, s, 0, c);
    }

    mat3 rotateZ(float angle) {
        float c = cos(angle), s = sin(angle);
        return mat3(c,-s,0,s,c,0,0,0,1);
    }

    <DE>

    vec2 map( in vec3 pos, float time )  
    {
        vec2 d1 = DE(pos, time);
        return d1;
    }

    vec3 calcNormal( in vec3 pos, float t ) 
    {
        vec2 e = vec2(0.00001, 0.0);
        return normalize( vec3(map(pos+e.xyy,t).x-map(pos-e.xyy,t).x,
                            map(pos+e.yxy,t).x-map(pos-e.yxy,t).x,
                            map(pos+e.yyx,t).x-map(pos-e.yyx,t).x ) );
    }

    float castShadow( in vec3 ro, vec3 rd, float time )
    {
        float res = 1.0;
        float t = 0.00;
        for( int i=0; i<100; i++ )
        {
            vec3 pos = ro + t*rd;
            float h = map( pos, time ).x;
            res = min( res, 16.0*h/t );
            if ( res<0.001 ) break;
            t += .5*h;
            if( t > 10.0 ) break;
        }

        return clamp(res,0.0,1.0);
    } 

    vec2 castRay( in vec3 ro, vec3 rd, float time )
    {
        float m = -1.0;
        float t = 0.0;
        for( int i=0; i<200; i++ )
        {
            vec3 pos = ro + t*rd;

            vec2 h = map( pos, time );
            m = h.y;
            if( h.x<0.001 )
                break;
            t += .5 * h.x;
            if( t>40.0 )
                break;
        } 
        if( t>40.0 ) m=-1.0;
        return vec2(t,m);
    }
    
    void mainImage(out vec4 O, in vec2 U) {

        float time = iTime;

        vec3 col = vec3(0);
        vec3 res = vec3(0);
        
        for(float aax=0.; aax < AA; aax++)
        for(float aay=0.; aay < AA; aay++)
        {
            vec2 p = (2.*(U + vec2(aax, aay) / AA)-R)/R.y;
            
            vec3 ta = iCameraTarget;
            vec3 ro = iCameraOrigin;
            
            vec3 ww = normalize( ta );
            vec3 uu = normalize( cross(ww, vec3(0,1,0)) );
            vec3 vv = normalize( cross(uu,ww) );

            vec3 rd = normalize( p.x*uu + p.y*vv + 1.8*ww );
    
            vec3 col = vec3(0.0);

            vec2 tm = castRay(ro, rd, time); 

            if( tm.x < 20. )
            {
                float t = tm.x;
                vec3 pos = ro + t*rd;
                vec3 nor = calcNormal(pos, time);

                vec3 mate = vec3(0.9); 
                mate = cos(vec3(0,1,1.5) + 2.*tm.y + 20.*0.22) *.5 + .5;
                
                mat3 sunRot = rotateY(1.9);
                vec3 sun_dir = normalize( vec3(-5,4,4) * sunRot );
                float sun_dif = clamp( dot(nor,sun_dir),0.0,1.0); 
                float sun_sha = castShadow( pos+nor*0.001, sun_dir, time );
                float sky_dif = clamp( 0.5 + 0.5*dot(nor,vec3(0.0,1.0,0.0)), 0.0, 1.0);
                float bou_dif = clamp( 0.5 + 0.5*dot(nor,vec3(0.0,-1.0,0.0)), 0.0, 1.0);

                col  = 0.25*mate*vec3(5.0,4.5,4.0)*sun_dif*sun_sha;
                //col += mate*vec3(0.5,0.6,0.6)*sky_dif;
                col += 0.2*mate*vec3(1.5,0.6,0.6)*bou_dif;
            }

            res += clamp(col, 0.0, 1.0);
        }

        col = pow( res/(AA*AA), vec3(0.4545) );
        
        O = vec4(col, 1.0);
    }

    void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
    }
    `;

    build(formula: Formula): string {
        return this.fragmentShader.replace('<DE>', formula.build());
    }
}


