import * as THREE from "three";
import { gsap } from "gsap";
import ObjectManager from "./objectManager";

let camera;
let scene;
let character;
let nodeMenuOn;
let setNodeMenuOn;
let setNodeMenuPosition;

const objectManager = new ObjectManager();
const raycaster = new THREE.Raycaster();

let cur_state;

let cameraOrigin;

let select_option;

const InputState = {
  IDLE: "idle",
  CREATE: "create",
  MOVE: "move",
};
Object.freeze(InputState);

class inputManager {
  constructor(_camera, _scene, _nodeMenuOn, _setNodeMenuOn, _setNodeMenuPosition) {
    camera = _camera;
    scene = _scene;
    nodeMenuOn = _nodeMenuOn;
    setNodeMenuOn = _setNodeMenuOn;
    setNodeMenuPosition = _setNodeMenuPosition;

    //setNodeMenuOn(true)
    //console.log("menu on")
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
      if (event.key == 'a') {
        objectManager.loadMyNodes();
      }
    }
  }
  async handleMouseDown(event) {
    select_option = null;
    //setNodeMenuOn(false)
    if (cur_state == InputState.IDLE) {
      const pointer = new THREE.Vector2();

      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);  

      raycaster.setFromCamera(pointer, camera);

      const cur_node = character.userData.myNodes[character.userData.myNodes.length - 1];
      const intersectObjects = raycaster.intersectObjects(scene.children);

      for (let i = 0; i < intersectObjects.length; i++) {
        if (intersectObjects[i].object.userData?.tag == "node") {
          select_option = intersectObjects[i].object;
          if (cur_node == select_option) {
            break;
          }
          setNodeMenuOn(true)
          setNodeMenuPosition({x:event.clientX, y:event.clientY})

          selectOption();
        }
      }
    }
  }
}

function selectOption(){
  const userData = select_option.userData;
  const cur_node = character.userData.myNodes[character.userData.myNodes.length - 1];

  objectManager.drawLine(cur_node.position, select_option.position);
  objectManager.loadOptions(new THREE.Vector3(userData.mapX, 1, userData.mapY));
  objectManager.invisibleOptions(select_option);

  character.userData.myNodes.push(select_option);
  objectManager.saveMyNodes();

  const targetPos = new THREE.Vector3(
    select_option.position.x,
    1,
    select_option.position.z
  );

  move(targetPos);
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
    .then(() => {
      cur_state = InputState.IDLE;
    });
  gsap.to(character.rotation, {
    y: angle,
    duration: 0.3,
  });
}

export default inputManager;
//아랫쪽 보고 있을 때 아랫쪽 반대 방향 누르면 너무 많이 회전함
