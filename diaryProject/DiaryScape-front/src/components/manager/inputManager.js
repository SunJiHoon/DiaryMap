import * as THREE from "three";
import { gsap } from "gsap";
import ObjectManager from './objectManager';

let camera;
let scene;
let character;

let cur_state;

let cameraOrigin

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
    
    this.inputManage();
  }
  inputManage() {
    cur_state = InputState.IDLE;
  
    cameraOrigin = new THREE.Vector3(
      camera.position.x,
      camera.position.y,
      camera.position.z
    );
  
    window.addEventListener("pointerdown", this.handlePointerDown);
  
    
  }
  cleanup() {
    window.removeEventListener("pointerdown", this.handlePointerDown)
    console.log("cleanup inputManager")
  }
  handlePointerDown(event) {
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
      move(targetPos);
    }
    else if (cur_state == InputState.CREATE) {
      //cur_state = CREATE로 만들어주고 create_object를 설정해주는 버튼 만들어주기.
      //현재 설치하려는 칸에 obj가 이미 만들어져 있지 않은지 검사해주기.
      objectManager.createObj(create_object, pointer);
      create_object = null;
    }
  }
}

function move(targetPos) {
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

function createObj() {

}

export default inputManager;
//아랫쪽 보고 있을 때 아랫쪽 반대 방향 누르면 너무 많이 회전함
