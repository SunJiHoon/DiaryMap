import * as THREE from "three";
import { gsap } from "gsap";

let camera;
let scene;
let character;

let originCameraPos;

const pos1 = THREE.Vector3(10, 0, 20);
const pos2 = THREE.Vector3(20, 0, 20);
const pos3 = THREE.Vector3(20, 0, 30);

class inputManager {
  constructor(_camera, _scene) {
    camera = _camera;
    scene = _scene;

    inputManage();
  }
}

function inputManage() {
  const cameraOrigin = new THREE.Vector3(
    camera.position.x,
    camera.position.y,
    camera.position.z
  );
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  character = scene.getObjectByName("player");

  window.addEventListener("keydown", handlePointerDown);

  function handlePointerDown(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);

    raycaster.setFromCamera(pointer, camera);

    const intersectObjects = raycaster.intersectObjects(scene.children);
    if (intersectObjects[0]?.object.name == "ground") {
      const targetPos = new THREE.Vector3(
        intersectObjects[0].point.x,
        intersectObjects[0].point.y,
        intersectObjects[0].point.z
      );

      let angle = new THREE.Vector2(0, 1).angleTo(
        new THREE.Vector2(
          targetPos.x - character.position.x,
          targetPos.z - character.position.z
        )
      );
      if (targetPos.x < character.position.x) {
        angle = Math.PI * 2 - angle;
      }
      gsap.to(character.position, {
        x: targetPos.x,
        z: targetPos.z,
        duration: 2,
      });
      gsap.to(camera.position, {
        x: cameraOrigin.x + targetPos.x,
        z: cameraOrigin.z + targetPos.z,
        duration: 2,
      });
      gsap.to(character.rotation, {
        y: angle,
        duration: 0.3,
      });
    }
  }
}

export default inputManager;
//아랫쪽 보고 있을 때 아랫쪽 반대 방향 누르면 너무 많이 회전함
