function createRealisticSpacecraft(THREE) {
  const group = new THREE.Group();

  // Materials
  const fuselageMat = new THREE.MeshPhysicalMaterial({ 
    color: 0x888888, 
    metalness: 0.9, 
    roughness: 0.4,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2
  });
  
  const goldFoilMat = new THREE.MeshPhysicalMaterial({
    color: 0xffaa00,
    metalness: 1.0,
    roughness: 0.2,
    bumpScale: 0.05
  });

  // Generate Solar Panel Texture via Canvas
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#112255';
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = '#aaaaaa';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 256; i += 32) {
    // Grid
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke();
  }
  const solarTex = new THREE.CanvasTexture(canvas);
  solarTex.wrapS = THREE.RepeatWrapping;
  solarTex.wrapT = THREE.RepeatWrapping;
  solarTex.repeat.set(4, 1);
  
  const solarMat = new THREE.MeshStandardMaterial({
    map: solarTex,
    metalness: 0.8,
    roughness: 0.2
  });

  // 1. Central Body (Hexagonal prism)
  const bodyGeo = new THREE.CylinderGeometry(1.2, 1.2, 4, 6);
  const body = new THREE.Mesh(bodyGeo, fuselageMat);
  body.rotation.z = Math.PI / 2;
  group.add(body);

  // 2. Gold foil equipment bay (behind body)
  const bayGeo = new THREE.BoxGeometry(2.2, 2.2, 1.5);
  const bay = new THREE.Mesh(bayGeo, goldFoilMat);
  bay.position.x = -2.5;
  group.add(bay);

  // 3. Solar Panel Arrays
  const panelGeo = new THREE.BoxGeometry(0.1, 3, 8);
  const panelL = new THREE.Mesh(panelGeo, solarMat);
  panelL.position.set(0, 0, -5.5);
  group.add(panelL);

  const panelR = new THREE.Mesh(panelGeo, solarMat);
  panelR.position.set(0, 0, 5.5);
  group.add(panelR);
  
  // Connection Trusses for Panels
  const trussGeo = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
  const trussMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.9 });
  const trussL = new THREE.Mesh(trussGeo, trussMat);
  trussL.rotation.x = Math.PI / 2;
  trussL.position.set(0, 0, -2);
  group.add(trussL);
  
  const trussR = new THREE.Mesh(trussGeo, trussMat);
  trussR.rotation.x = Math.PI / 2;
  trussR.position.set(0, 0, 2);
  group.add(trussR);

  // 4. High-Gain Antenna Dish
  const dishGroup = new THREE.Group();
  const dishGeo = new THREE.BoxGeometry(0.1, 2, 2);
  
  // Use a sphere to mock the dish curvature
  const dishCurveGeo = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 4);
  const dishMat = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 0.5, roughness: 0.8, side: THREE.DoubleSide });
  const dish = new THREE.Mesh(dishCurveGeo, dishMat);
  dish.rotation.x = -Math.PI / 2;
  dishGroup.add(dish);
  
  // Antenna spike
  const spikeGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5);
  const spike = new THREE.Mesh(spikeGeo, trussMat);
  spike.position.z = 0.75;
  spike.rotation.x = Math.PI / 2;
  dishGroup.add(spike);

  dishGroup.position.set(2.5, 0, 0);
  dishGroup.rotation.y = Math.PI / 2;
  group.add(dishGroup);

  // 5. Engine Thruster & Glow
  const engineGeo = new THREE.ConeGeometry(0.8, 1.5, 16);
  const engineMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9 });
  const engine = new THREE.Mesh(engineGeo, engineMat);
  engine.rotation.z = -Math.PI / 2;
  engine.position.x = -3.5;
  group.add(engine);

  const glowGeo = new THREE.SphereGeometry(0.6, 16, 16);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x00c8ff, transparent: true, opacity: 0.6 });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.position.x = -4.2;
  glow.scale.x = 2.0;
  group.add(glow);
  
  // Point Light for engine
  const engineLight = new THREE.PointLight(0x00c8ff, 2, 10);
  engineLight.position.set(-4.5, 0, 0);
  group.add(engineLight);

  // Overall scale adjustment
  group.scale.set(0.4, 0.4, 0.4);
  
  // Custom animation function attached to group
  group.tick = function(time) {
     // Pulse engine glow
     glow.scale.setScalar(1.0 + Math.sin(time * 10) * 0.1);
     glow.scale.x = 2.0 + Math.sin(time * 10) * 0.2;
     engineLight.intensity = 2 + Math.sin(time * 10) * 0.5;
  };

  return group;
}
window.createRealisticSpacecraft = createRealisticSpacecraft;
