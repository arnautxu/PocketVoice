// Custom shader for the liquid-metal voice mesh.
// Domain-warp + curl-noise on the vertex; iridescent fresnel on the fragment.
// Non-figurative — never a microphone, never a soundwave.

export const voiceVertex = /* glsl */ `
  uniform float uTime;
  uniform float uActivity;
  uniform float uMorph;

  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying float vDisp;

  // Simplex noise (Ashima)
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
      +i.y+vec4(0.0,i1.y,i2.y,1.0))
      +i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main(){
    vec3 p = position;
    float t = uTime * 0.18;

    // Domain warp — slow, broad
    vec3 q = vec3(
      snoise(p * 0.65 + vec3(t, 0.0, 0.0)),
      snoise(p * 0.65 + vec3(0.0, t, 5.2)),
      snoise(p * 0.65 + vec3(8.7, 0.0, t))
    );

    // Detail
    float n2 = snoise(p * 1.6 + q * 1.2 + t);
    float disp = 0.32 * n2 + 0.18 * snoise(p * 3.4 + t * 0.6);

    // Activity adds amplitude (driven by scroll velocity, never wild)
    disp *= 1.0 + uActivity * 0.9;

    // Morph parameter shifts the silhouette gently
    p += normal * disp * (0.55 + 0.25 * uMorph);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vViewPos = mv.xyz;
    vNormal = normalize(normalMatrix * normal);
    vDisp = disp;
    gl_Position = projectionMatrix * mv;
  }
`;

export const voiceFragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uActivity;
  uniform vec3 uAccent;

  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying float vDisp;

  // OKLCH-ish neutral near-blacks. We blend between two cool tones
  // and lift toward the brand accent only on fresnel highlights.
  vec3 baseDark  = vec3(0.045, 0.05, 0.062);
  vec3 baseLight = vec3(0.10, 0.115, 0.14);

  void main(){
    vec3 N = normalize(vNormal);
    vec3 V = normalize(-vViewPos);
    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);

    // Iridescent shift along normal — subtle, no rainbow glitter
    float band = sin(N.y * 7.0 + uTime * 0.12) * 0.5 + 0.5;
    vec3 metal = mix(baseDark, baseLight, band);

    // Specular streaks aligned with the face normal — feels like brushed metal
    float streak = pow(max(dot(N, vec3(0.0, 1.0, 0.2)), 0.0), 18.0);

    vec3 col = metal;
    col += vec3(streak) * 0.35;
    col += uAccent * fres * (0.12 + 0.18 * uActivity);

    // Edge ink — pulls silhouette darker so it reads against the page
    col *= 0.85 + 0.45 * (1.0 - fres);

    // Subtle internal glow tracking displacement amplitude
    col += uAccent * 0.06 * smoothstep(0.0, 0.4, vDisp);

    gl_FragColor = vec4(col, 1.0);
  }
`;
