import * as THREE from "three";
import { gsap } from "gsap";
import ObjectManager from './objectManager';

let camera;
let scene;
let character;
let cur_state;

const InputState = {
  IDLE: "idle",
  CREATE: "create",
}
Object.freeze(InputState);

const raycaster = new THREE.Raycaster();

class inputManager {
  constructor(_camera, _scene) {
    camera = _camera;
    scene = _scene;
    const objectManager = new ObjectManager(scene);
    character = scene.getObjectByName("player");

    inputManage();
  }
}

function inputManage() {
  cur_state = InputState.IDLE;

  const cameraOrigin = new THREE.Vector3(
    camera.position.x,
    camera.position.y,
    camera.position.z
  );

  window.addEventListener("pointerdown", handlePointerDown);

  function handlePointerDown(event) {
    const pointer = new THREE.Vector2();

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);

    raycaster.setFromCamera(pointer, camera);

    const intersectObjects = raycaster.intersectObjects(scene.children);
    if (intersectObjects[0]?.object.name == "ground" && cur_state == InputState.IDLE) {
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
    else if(cur_state == InputState.CREATE){

    }
  }
}

export default inputManager;
//아랫쪽 보고 있을 때 아랫쪽 반대 방향 누르면 너무 많이 회전함
