/* ========================================
   AI CORE — Three.js 3D Globe
   Glowing sphere + rotating rings + particles
   ======================================== */

(function () {
  const canvas = document.getElementById('aiCoreCanvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(400, 400);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // --- LIGHTING ---
  const ambientLight = new THREE.AmbientLight(0x7c3aed, 0.3);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xa855f7, 2, 10);
  pointLight.position.set(2, 2, 3);
  scene.add(pointLight);

  const pointLight2 = new THREE.PointLight(0xec4899, 1.5, 8);
  pointLight2.position.set(-2, -1, 2);
  scene.add(pointLight2);

  // --- CORE SPHERE ---
  const sphereGeo = new THREE.IcosahedronGeometry(0.9, 3);
  const sphereMat = new THREE.MeshPhysicalMaterial({
    color: 0x7c3aed,
    emissive: 0x7c3aed,
    emissiveIntensity: 0.4,
    metalness: 0.2,
    roughness: 0.1,
    transmission: 0.6,
    thickness: 1.5,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.85,
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphere);

  // Inner glow sphere
  const innerGlowGeo = new THREE.SphereGeometry(0.6, 32, 32);
  const innerGlowMat = new THREE.MeshBasicMaterial({
    color: 0xc084fc,
    transparent: true,
    opacity: 0.3,
  });
  const innerGlow = new THREE.Mesh(innerGlowGeo, innerGlowMat);
  scene.add(innerGlow);

  // --- RINGS ---
  function createRing(radius, tubeRadius, color, tiltX, tiltZ) {
    const geo = new THREE.TorusGeometry(radius, tubeRadius, 16, 100);
    const mat = new THREE.MeshPhysicalMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.3,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 0.8,
    });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = tiltX;
    ring.rotation.z = tiltZ;
    return ring;
  }

  const ring1 = createRing(1.4, 0.025, 0x7c3aed, Math.PI / 2.2, 0.3);
  const ring2 = createRing(1.6, 0.02, 0xa855f7, Math.PI / 1.8, -0.5);
  const ring3 = createRing(1.8, 0.015, 0xec4899, Math.PI / 2.5, 0.8);
  scene.add(ring1, ring2, ring3);

  // --- ORBITING PARTICLES ---
  const particleCount = 60;
  const particlesGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const particleSpeeds = [];

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = 1.8 + Math.random() * 1.2;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    particleSpeeds.push(0.002 + Math.random() * 0.005);
  }

  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMat = new THREE.PointsMaterial({
    color: 0xc084fc,
    size: 0.04,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  // --- HEXAGONAL FRAGMENTS ---
  const hexFragments = [];
  for (let i = 0; i < 8; i++) {
    const hexGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.015, 6);
    const hexMat = new THREE.MeshPhysicalMaterial({
      color: 0xa855f7,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.6,
    });
    const hex = new THREE.Mesh(hexGeo, hexMat);
    hex.userData = {
      angle: (i / 8) * Math.PI * 2,
      radius: 2.0 + Math.random() * 0.5,
      speed: 0.003 + Math.random() * 0.004,
      yOffset: (Math.random() - 0.5) * 1.5,
    };
    scene.add(hex);
    hexFragments.push(hex);
  }

  // --- MOUSE TRACKING ---
  let mouseX = 0, mouseY = 0;
  let isHovered = false;
  let targetScale = 1;
  let currentScale = 1;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  canvas.addEventListener('mouseenter', () => { isHovered = true; targetScale = 1.08; });
  canvas.addEventListener('mouseleave', () => { isHovered = false; targetScale = 1; });
  canvas.addEventListener('click', () => {
    // Pulse on click
    sphereMat.emissiveIntensity = 1.5;
    setTimeout(() => { sphereMat.emissiveIntensity = 0.4; }, 300);
  });

  // --- ANIMATION LOOP ---
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Floating motion
    const floatY = Math.sin(time * 0.8) * 0.1;
    sphere.position.y = floatY;
    innerGlow.position.y = floatY;

    // Sphere rotation
    sphere.rotation.y += 0.003;
    sphere.rotation.x += 0.001;

    // Rings rotation
    const ringSpeed = isHovered ? 1.8 : 1;
    ring1.rotation.y += 0.008 * ringSpeed;
    ring2.rotation.y -= 0.006 * ringSpeed;
    ring3.rotation.y += 0.004 * ringSpeed;
    ring1.position.y = floatY;
    ring2.position.y = floatY;
    ring3.position.y = floatY;

    // Inner glow pulse
    const pulse = 0.25 + Math.sin(time * 2) * 0.1;
    innerGlowMat.opacity = pulse;
    innerGlow.scale.setScalar(0.95 + Math.sin(time * 1.5) * 0.05);

    // Scale lerp
    currentScale += (targetScale - currentScale) * 0.05;
    sphere.scale.setScalar(currentScale);

    // Emissive intensity on hover
    if (isHovered) {
      sphereMat.emissiveIntensity += (0.8 - sphereMat.emissiveIntensity) * 0.05;
    } else {
      sphereMat.emissiveIntensity += (0.4 - sphereMat.emissiveIntensity) * 0.05;
    }

    // Mouse parallax on camera
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    // Orbiting particles
    const posArr = particlesGeo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const x = posArr[idx];
      const z = posArr[idx + 2];
      const angle = Math.atan2(z, x) + particleSpeeds[i];
      const r = Math.sqrt(x * x + z * z);
      posArr[idx] = r * Math.cos(angle);
      posArr[idx + 2] = r * Math.sin(angle);
      posArr[idx + 1] += Math.sin(time + i) * 0.001;
    }
    particlesGeo.attributes.position.needsUpdate = true;
    particles.position.y = floatY;

    // Hex fragments orbit
    hexFragments.forEach((hex) => {
      hex.userData.angle += hex.userData.speed;
      const a = hex.userData.angle;
      const r = hex.userData.radius;
      hex.position.x = r * Math.cos(a);
      hex.position.z = r * Math.sin(a);
      hex.position.y = hex.userData.yOffset + floatY + Math.sin(time + a) * 0.2;
      hex.rotation.x = time;
      hex.rotation.z = time * 0.5;
    });

    renderer.render(scene, camera);
  }

  animate();

  // --- RESPONSIVE ---
  function resize() {
    const container = canvas.parentElement;
    const size = Math.min(container.clientWidth, 400);
    renderer.setSize(size, size);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resize);
  resize();

})();
