import * as THREE from 'three';
import { EffectComposer } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js';

const canvas = document.getElementById('aiCoreCanvas');
if (canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 4.5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // Bloom post-processing
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(400, 400), 1.8, 0.4, 0.2);
  composer.addPass(bloom);

  // Lighting
  scene.add(new THREE.AmbientLight(0x7c3aed, 0.2));
  const pl1 = new THREE.PointLight(0xa855f7, 3, 10);
  pl1.position.set(2, 1, 3);
  scene.add(pl1);
  const pl2 = new THREE.PointLight(0xec4899, 2, 8);
  pl2.position.set(-2, -1, 2);
  scene.add(pl2);
  const pl3 = new THREE.PointLight(0x7c3aed, 2, 6);
  pl3.position.set(0, -2, 1);
  scene.add(pl3);

  // === CORE SPHERE - crystalline look ===
  const coreGeo = new THREE.IcosahedronGeometry(0.75, 1);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x4a1a8a,
    emissive: 0x7c3aed,
    emissiveIntensity: 0.8,
    metalness: 0.4,
    roughness: 0.15,
    transparent: true,
    opacity: 0.9,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  // Inner energy glow
  const glowGeo = new THREE.SphereGeometry(0.55, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.5 });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  scene.add(glow);

  // Core bright center
  const centerGeo = new THREE.SphereGeometry(0.25, 16, 16);
  const centerMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
  const center = new THREE.Mesh(centerGeo, centerMat);
  scene.add(center);

  // === THICK CHROME RINGS ===
  function makeRing(radius, tube, rx, rz, speed) {
    const geo = new THREE.TorusGeometry(radius, tube, 32, 128);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x3b1578,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.6,
      metalness: 1.0,
      roughness: 0.05,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = rx;
    mesh.rotation.z = rz;
    mesh.userData.speed = speed;
    return mesh;
  }

  const ring1 = makeRing(1.15, 0.06, 1.5, 0.2, 0.007);
  const ring2 = makeRing(1.35, 0.045, 1.8, -0.4, -0.005);
  const ring3 = makeRing(1.55, 0.035, 1.2, 0.7, 0.004);
  scene.add(ring1, ring2, ring3);

  // === DEBRIS / FRAGMENTS ===
  const fragments = [];
  for (let i = 0; i < 12; i++) {
    const size = 0.03 + Math.random() * 0.06;
    const geo = new THREE.OctahedronGeometry(size, 0);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1a0533,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.3,
      metalness: 0.9,
      roughness: 0.3,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const angle = Math.random() * Math.PI * 2;
    const dist = 1.8 + Math.random() * 1.0;
    mesh.position.set(
      dist * Math.cos(angle),
      (Math.random() - 0.5) * 2,
      dist * Math.sin(angle)
    );
    mesh.userData = { angle, dist, speed: 0.001 + Math.random() * 0.003, rotSpeed: 0.01 + Math.random() * 0.02 };
    scene.add(mesh);
    fragments.push(mesh);
  }

  // === PARTICLES ===
  const pCount = 80;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  const pSpeeds = [];
  for (let i = 0; i < pCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = 1.5 + Math.random() * 1.5;
    pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pPos[i * 3 + 2] = r * Math.cos(phi);
    pSpeeds.push(0.001 + Math.random() * 0.004);
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xa855f7, size: 0.025, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Mouse
  let mx = 0, my = 0, hovered = false, tScale = 1, cScale = 1;
  document.addEventListener('mousemove', (e) => { mx = (e.clientX / window.innerWidth) * 2 - 1; my = -(e.clientY / window.innerHeight) * 2 + 1; });
  canvas.addEventListener('mouseenter', () => { hovered = true; tScale = 1.06; canvas.style.cursor = 'pointer'; });
  canvas.addEventListener('mouseleave', () => { hovered = false; tScale = 1; canvas.style.cursor = 'default'; });
  canvas.addEventListener('click', () => { coreMat.emissiveIntensity = 2.5; glowMat.opacity = 1; setTimeout(() => { coreMat.emissiveIntensity = 0.8; glowMat.opacity = 0.5; }, 400); });

  // Animate
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.008;
    const floatY = Math.sin(t * 0.8) * 0.08;

    // Core
    core.position.y = floatY;
    core.rotation.y += 0.004;
    core.rotation.x += 0.002;
    glow.position.y = floatY;
    center.position.y = floatY;

    // Scale
    cScale += (tScale - cScale) * 0.04;
    core.scale.setScalar(cScale);

    // Glow pulse
    glow.scale.setScalar(0.9 + Math.sin(t * 2) * 0.08);
    glowMat.opacity = 0.4 + Math.sin(t * 1.5) * 0.15;
    centerMat.opacity = 0.5 + Math.sin(t * 3) * 0.2;

    // Emissive
    const ei = hovered ? 1.2 : 0.8;
    coreMat.emissiveIntensity += (ei - coreMat.emissiveIntensity) * 0.04;

    // Rings
    const rs = hovered ? 2 : 1;
    ring1.rotation.y += ring1.userData.speed * rs; ring1.position.y = floatY;
    ring2.rotation.y += ring2.userData.speed * rs; ring2.position.y = floatY;
    ring3.rotation.y += ring3.userData.speed * rs; ring3.position.y = floatY;

    // Camera parallax
    camera.position.x += (mx * 0.4 - camera.position.x) * 0.015;
    camera.position.y += (my * 0.25 - camera.position.y) * 0.015;
    camera.lookAt(0, 0, 0);

    // Particles orbit
    const arr = pGeo.attributes.position.array;
    for (let i = 0; i < pCount; i++) {
      const idx = i * 3;
      const x = arr[idx], z = arr[idx + 2];
      const a = Math.atan2(z, x) + pSpeeds[i];
      const r = Math.sqrt(x * x + z * z);
      arr[idx] = r * Math.cos(a);
      arr[idx + 2] = r * Math.sin(a);
    }
    pGeo.attributes.position.needsUpdate = true;
    particles.position.y = floatY;

    // Fragments
    fragments.forEach((f) => {
      f.userData.angle += f.userData.speed;
      const a = f.userData.angle, d = f.userData.dist;
      f.position.x = d * Math.cos(a);
      f.position.z = d * Math.sin(a);
      f.position.y += Math.sin(t + a) * 0.001;
      f.rotation.x += f.userData.rotSpeed;
      f.rotation.y += f.userData.rotSpeed * 0.5;
    });

    composer.render();
  }

  function resize() {
    const container = canvas.parentElement;
    const size = Math.min(container.clientWidth, container.clientHeight, 400);
    renderer.setSize(size, size);
    composer.setSize(size, size);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resize);
  resize();
  animate();
}
