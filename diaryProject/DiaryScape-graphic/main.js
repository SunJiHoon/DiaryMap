import * as THREE from "three";
import Map from "./scripts/object/map";
import Player from "./scripts/object/player";
import InputManager from "./scripts/manager/inputManager";
import SaveManager from "./scripts/manager/saveManager";

window.addEventListener("load", function () {
  init();
});

async function init() {
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setClearColor(0x80ffff, 1);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    300
  );
  camera.position.z = 100;
  camera.rotation.y = Math.PI / 4;

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(-10, 10, 20);
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const map = new Map();
  scene.add(map.mesh);

  const player = new Player();
  const playerMesh = await player.loadGltf("spongebob");

  playerMesh;
  scene.add(playerMesh);

  camera.position.set(-35, 40, 45);
  camera.lookAt(0, 0, 0);

  document.body.appendChild(renderer.domElement);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);

  const inputManager = new InputManager(camera, scene);
  const saveManager = new SaveManager(scene);

  const tempGeoMetry = new THREE.BoxGeometry(1, 1, 1);
  const tempMaterial = new THREE.MeshBasicMaterial();
  const tempMesh = new THREE.Mesh(tempGeoMetry, tempMaterial);
  saveManager.saveObj(tempMesh);

  const loadTemp = window.addEventListener("resize", handleResize);

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  anim();
  function anim() {
    renderer.render(scene, camera);

    requestAnimationFrame(anim);
  }
}
