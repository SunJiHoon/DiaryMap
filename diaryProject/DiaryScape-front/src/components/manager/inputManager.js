import * as THREE from "three";
import { gsap } from "gsap";
import ObjectManager from "./objectManager";

let camera;
let scene;
let character;

const objectManager = new ObjectManager();
const raycaster = new THREE.Raycaster();

let cur_state;
let cur_index = 0;

let cameraOrigin;

let posArr = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(10, 0, 0),
  new THREE.Vector3(10, 0, 10),
  new THREE.Vector3(10, 0, 20),
  new THREE.Vector3(20, 0, 20),
];

const InputState = {
  IDLE: "idle",
  CREATE: "create",
  MOVE: "move",
};
Object.freeze(InputState);

class inputManager {
  constructor(_camera, _scene) {
    camera = _camera;
    scene = _scene;
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

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("mousedown", this.handleMouseDown);
  }
  cleanup() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("mousedown", this.handleMouseDown);
    console.log("cleanup inputManager");
  }
  handleKeyDown(event) {
    if (cur_state == InputState.IDLE) {
      if (event.key == "ArrowRight" && cur_index < posArr.length - 1) {
        move(posArr[++cur_index]);
      } else if (event.key == "ArrowLeft" && cur_index > 0) {
        move(posArr[--cur_index]);
      } else if (event.key == "a") {
        // const testObj = scene.getObjectByName("testObj");
        // const saveJson = objectManager.saveObj(testObj);
        // scene.remove(testObj);
      }
    }
  }
  handleMouseDown(event) {
    if (cur_state == InputState.IDLE) {
      const pointer = new THREE.Vector2();

      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);

      raycaster.setFromCamera(pointer, camera);

      const intersectObjects = raycaster.intersectObjects(scene.children);

      if (intersectObjects[0].object.userData?.tag == "node") {
        const targetPos = new THREE.Vector3(
          intersectObjects[0].object.position.x,
          0,
          intersectObjects[0].object.position.z
        );

        const points = [];
        points.push(character.position);
        points.push(intersectObjects[0].object.position);
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial();
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
        character.userData.myNode.push(intersectObjects[0].object);
        console.log(character.userData.myNode);
        move(targetPos);
      }
    }
  }
}

function move(targetPos) {
  cur_state = InputState.MOVE;
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
    duration: 1,
  });
  gsap
    .to(camera.position, {
      x: cameraOrigin.x + targetPos.x,
      z: cameraOrigin.z + targetPos.z,
      duration: 1,
    })
    .then(() => (cur_state = InputState.IDLE));
  gsap.to(character.rotation, {
    y: angle,
    duration: 0.3,
  });
}

export default inputManager;
//아랫쪽 보고 있을 때 아랫쪽 반대 방향 누르면 너무 많이 회전함
