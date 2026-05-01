// ============================================================
// THREE.JS 3D IMMERSIVE BACKGROUND — SJM Portfolio
// Network nodes + floating wireframe geometry + particle field
// Mouse parallax interaction | 60fps optimized
// ============================================================

(function () {
  'use strict';

  // ── Guard: only run if THREE is loaded ──────────────────────
  if (typeof THREE === 'undefined') return;

  // ── Scene Setup ─────────────────────────────────────────────
  const canvas = document.getElementById('threeCanvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,       // off for performance
    alpha: true,            // transparent background
    powerPreference: 'high-performance',
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);   // fully transparent

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 500);
  camera.position.set(0, 0, 80);

  // ── Mouse State ──────────────────────────────────────────────
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  document.addEventListener('mousemove', e => {
    mouse.targetX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // ── Colour Palette (matches CSS vars) ────────────────────────
  const COL_PURPLE = new THREE.Color(0x7c5cfc);
  const COL_CYAN   = new THREE.Color(0x22d3ee);
  const COL_SOFT   = new THREE.Color(0xa18dff);

  // ── 1. PARTICLE FIELD ────────────────────────────────────────
  // ~400 small dots drifting slowly through space
  const PARTICLE_COUNT = 400;
  const pPositions = new Float32Array(PARTICLE_COUNT * 3);
  const pColors    = new Float32Array(PARTICLE_COUNT * 3);
  const pSpeeds    = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pPositions[i * 3]     = (Math.random() - 0.5) * 260;
    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 160;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 120;

    pSpeeds[i] = 0.004 + Math.random() * 0.008;

    // Alternate purple / cyan tones
    const t = Math.random();
    const c = t < 0.6 ? COL_PURPLE.clone().lerp(COL_SOFT, Math.random())
                       : COL_CYAN.clone().lerp(new THREE.Color(0x67e8f9), Math.random());
    pColors[i * 3]     = c.r;
    pColors[i * 3 + 1] = c.g;
    pColors[i * 3 + 2] = c.b;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  pGeo.setAttribute('color',    new THREE.BufferAttribute(pColors,    3));

  const pMat = new THREE.PointsMaterial({
    size: 0.55,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
    depthWrite: false,
  });

  const particleMesh = new THREE.Points(pGeo, pMat);
  scene.add(particleMesh);

  // ── 2. NETWORK NODES & EDGES ─────────────────────────────────
  // 80 nodes, connect pairs within a proximity threshold
  const NODE_COUNT   = 80;
  const CONNECT_DIST = 28;

  const nodePositions = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    nodePositions.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 130,
        (Math.random() - 0.5) * 60
      )
    );
  }

  // Node dots (slightly larger points)
  const nGeoPos = new Float32Array(NODE_COUNT * 3);
  nodePositions.forEach((v, i) => { nGeoPos[i*3]=v.x; nGeoPos[i*3+1]=v.y; nGeoPos[i*3+2]=v.z; });
  const nGeo = new THREE.BufferGeometry();
  nGeo.setAttribute('position', new THREE.BufferAttribute(nGeoPos, 3));
  const nMat = new THREE.PointsMaterial({
    size: 1.4,
    color: COL_CYAN,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
    depthWrite: false,
  });
  const nodeMesh = new THREE.Points(nGeo, nMat);
  scene.add(nodeMesh);

  // Edges between nearby nodes
  const edgePositions = [];
  for (let a = 0; a < NODE_COUNT; a++) {
    for (let b = a + 1; b < NODE_COUNT; b++) {
      if (nodePositions[a].distanceTo(nodePositions[b]) < CONNECT_DIST) {
        edgePositions.push(
          nodePositions[a].x, nodePositions[a].y, nodePositions[a].z,
          nodePositions[b].x, nodePositions[b].y, nodePositions[b].z
        );
      }
    }
  }
  const eGeo = new THREE.BufferGeometry();
  eGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edgePositions), 3));
  const eMat = new THREE.LineBasicMaterial({
    color: COL_PURPLE,
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
  });
  const edgeMesh = new THREE.LineSegments(eGeo, eMat);
  scene.add(edgeMesh);

  // ── 3. WIREFRAME TORUS (background accent) ───────────────────
  const torusGeo = new THREE.TorusGeometry(32, 10, 10, 48);
  const torusMat = new THREE.MeshBasicMaterial({
    color: COL_PURPLE,
    wireframe: true,
    transparent: true,
    opacity: 0.06,
  });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.position.set(45, -18, -40);
  torus.rotation.x = Math.PI / 4;
  scene.add(torus);

  // ── 4. WIREFRAME SPHERE (top-left accent) ────────────────────
  const sphereGeo = new THREE.IcosahedronGeometry(20, 2);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: COL_CYAN,
    wireframe: true,
    transparent: true,
    opacity: 0.055,
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.position.set(-55, 28, -30);
  scene.add(sphere);

  // ── 5. FLOATING GLOW PLANES (subtle light blobs) ─────────────
  // Two large additive sprites that give a soft volumetric glow feel
  function makeGlowSprite(color, size, opacity) {
    const tex = buildGlowTexture(color);
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(size, size, 1);
    return sprite;
  }

  function buildGlowTexture(hex) {
    const size = 128;
    const cv   = document.createElement('canvas');
    cv.width = cv.height = size;
    const ctx = cv.getContext('2d');
    const r   = size / 2;
    const grad = ctx.createRadialGradient(r, r, 0, r, r, r);
    const c    = new THREE.Color(hex);
    grad.addColorStop(0,   `rgba(${~~(c.r*255)},${~~(c.g*255)},${~~(c.b*255)},1)`);
    grad.addColorStop(0.4, `rgba(${~~(c.r*255)},${~~(c.g*255)},${~~(c.b*255)},0.3)`);
    grad.addColorStop(1,   `rgba(${~~(c.r*255)},${~~(c.g*255)},${~~(c.b*255)},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(cv);
  }

  const glow1 = makeGlowSprite(0x7c5cfc, 120, 0.18);
  glow1.position.set(-40, 20, -50);
  scene.add(glow1);

  const glow2 = makeGlowSprite(0x22d3ee, 100, 0.14);
  glow2.position.set(50, -25, -45);
  scene.add(glow2);

  // ── Animation Loop ───────────────────────────────────────────
  let clock = 0;

  function animate() {
    requestAnimationFrame(animate);
    clock += 0.008;

    // Smooth mouse parallax on camera
    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;
    camera.position.x = mouse.x * 8;
    camera.position.y = -mouse.y * 5;
    camera.lookAt(0, 0, 0);

    // Slowly drift particle field
    particleMesh.rotation.y = clock * 0.018;
    particleMesh.rotation.x = clock * 0.007;

    // Rotate network nodes
    nodeMesh.rotation.y  = clock * 0.022;
    edgeMesh.rotation.y  = clock * 0.022;

    // Torus: dual-axis spin
    torus.rotation.y += 0.003;
    torus.rotation.z += 0.0015;

    // Sphere: gentle bob + spin
    sphere.rotation.y  += 0.004;
    sphere.rotation.x  += 0.002;
    sphere.position.y   = 28 + Math.sin(clock * 0.9) * 4;

    // Glow blobs: slow drift
    glow1.position.x = -40 + Math.sin(clock * 0.4)  * 8;
    glow1.position.y =  20 + Math.cos(clock * 0.3)  * 6;
    glow2.position.x =  50 + Math.cos(clock * 0.35) * 7;
    glow2.position.y = -25 + Math.sin(clock * 0.45) * 5;

    renderer.render(scene, camera);
  }

  animate();

  // ── Resize Handler ───────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });

})();