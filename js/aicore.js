import * as THREE from 'three';

const canvas = document.getElementById('aiCoreCanvas');
if (canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  scene.add(new THREE.AmbientLight(0x7c3aed, 0.4));
  const pl1 = new THREE.PointLight(0xa855f7, 2, 10);
  pl1.position.set(2, 2, 3);
  scene.add(pl1);
  const pl2 = new THREE.PointLight(0xec4899, 1.5, 8);
  pl2.position.set(-2, -1, 2);
  scene.add(pl2);

  // Core sphere
  const sphereGeo = new THREE.IcosahedronGeometry(0.9, 2);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0x7c3aed,
    emissive: 0x7c3aed,
    emissiveIntensity: 0.5,
    metalness: 0.3,
    roughness: 0.2,
    transparent: true,
    opacity: 0.85,
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphere);

  // Inner glow
  const innerGeo = new THREE.SphereGeometry(0.6, 32, 32);
  const innerMat = new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.3 });
  const inner = new THREE.Mesh(innerGeo, innerMat);
  scene.add(inner);

  // Rings
  function makeRing(r, tube, color, rx, rz) {
    const geo = new THREE.TorusGeometry(r, tube, 16, 100);
    const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.4, metalness: 0.9, roughness: 0.15 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = rx;
    mesh.rotation.z = rz;
    return mesh;
  }

  const ring1 = makeRing(1.4, 0.025, 0x7c3aed, 1.4, 0.3);
  const ring2 = makeRing(1.6, 0.02, 0xa855f7, 1.75, -0.5);
  const ring3 = makeRing(1.8, 0.015, 0xec4899, 1.25, 0.8);
  scene.add(ring1, ring2, ring3);

  // Particles
  const pCount = 50;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  const pSpeeds = [];
  for (let i = 0; i < pCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = 1.8 + Math.random() * 1.2;
    pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pPos[i * 3 + 2] = r * Math.cos(phi);
    pSpeeds.push(0.002 + Math.random() * 0.005);
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xc084fc, size: 0.04, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Hex fragments
  const hexes = [];
  for (let i = 0; i < 8; i++) {
    const geo = new THREE.CylinderGeometry(0.08, 0.08, 0.015, 6);
    const mat = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x7c3aed, emissiveIntensity: 0.5, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.6 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData = { angle: (i / 8) * Math.PI * 2, radius: 2.0 + Math.random() * 0.5, speed: 0.003 + Math.random() * 0.004, yOff: (Math.random() - 0.5) * 1.5 };
    scene.add(mesh);
    hexes.push(mesh);
  }

  // Mouse
  let mx = 0, my = 0, hovered = false, tScale = 1, cScale = 1;
  document.addEventListener('mousemove', (e) => { mx = (e.clientX / window.innerWidth) * 2 - 1; my = -(e.clientY / window.innerHeight) * 2 + 1; });
  canvas.addEventListener('mouseenter', () => { hovered = true; tScale = 1.08; });
  canvas.addEventListener('mouseleave', () => { hovered = false; tScale = 1; });
  canvas.addEventListener('click', () => { sphereMat.emissiveIntensity = 1.5; setTimeout(() => { sphereMat.emissiveIntensity = 0.5; }, 300); });

  // Animate
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;
    const floatY = Math.sin(t * 0.8) * 0.1;

    sphere.position.y = floatY;
    sphere.rotation.y += 0.003;
    sphere.rotation.x += 0.001;
    inner.position.y = floatY;
    inner.scale.setScalar(0.95 + Math.sin(t * 1.5) * 0.05);
    innerMat.opacity = 0.25 + Math.sin(t * 2) * 0.1;

    const rs = hovered ? 1.8 : 1;
    ring1.rotation.y += 0.008 * rs; ring1.position.y = floatY;
    ring2.rotation.y -= 0.006 * rs; ring2.position.y = floatY;
    ring3.rotation.y += 0.004 * rs; ring3.position.y = floatY;

    cScale += (tScale - cScale) * 0.05;
    sphere.scale.setScalar(cScale);

    const ei = hovered ? 0.8 : 0.5;
    sphereMat.emissiveIntensity += (ei - sphereMat.emissiveIntensity) * 0.05;

    camera.position.x += (mx * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (my * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    const arr = pGeo.attributes.position.array;
    for (let i = 0; i < pCount; i++) {
      const idx = i * 3;
      const x = arr[idx], z = arr[idx + 2];
      const a = Math.atan2(z, x) + pSpeeds[i];
      const r = Math.sqrt(x * x + z * z);
      arr[idx] = r * Math.cos(a);
      arr[idx + 2] = r * Math.sin(a);
      arr[idx + 1] += Math.sin(t + i) * 0.001;
    }
    pGeo.attributes.position.needsUpdate = true;
    particles.position.y = floatY;

    hexes.forEach((h) => {
      h.userData.angle += h.userData.speed;
      const a = h.userData.angle, r = h.userData.radius;
      h.position.set(r * Math.cos(a), h.userData.yOff + floatY + Math.sin(t + a) * 0.2, r * Math.sin(a));
      h.rotation.x = t; h.rotation.z = t * 0.5;
    });

    renderer.render(scene, camera);
  }

  function resize() {
    const container = canvas.parentElement;
    const size = Math.min(container.clientWidth, container.clientHeight, 400);
    renderer.setSize(size, size);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resize);
  resize();
  animate();
}
