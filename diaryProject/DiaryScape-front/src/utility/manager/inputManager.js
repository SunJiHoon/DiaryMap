import * as THREE from 'three';
import { gsap } from 'gsap';
import ObjectManager from './objectManager';
import DayManager from './dayManager';
import SaveManager from './saveManager';

let camera;
let scene;
let character;
let nodeMenuOn;
let setNodeMenuOn;
let setNodeMenuPosition;
let selectOptionData;
let setSelectOptionData;

let mglCameraPosition;
let mglCameraPositionTransformed;
let map;
let setMglCameraPosition;

const objectManager = new ObjectManager();
const saveManager = new SaveManager();
const dayManager = new DayManager();
const raycaster = new THREE.Raycaster();

let cur_state;

let cameraOrigin;

let select_option;

const InputState = {
  IDLE: 'idle',
  CREATE: 'create',
  MOVE: 'move',
};
Object.freeze(InputState);

class inputManager {
  constructor(
    _camera,
    _map,
    _setMglCameraPosition,
    _scene,
    _nodeMenuOn,
    _setNodeMenuOn,
    _setNodeMenuPosition,
    _selectOptionData,
    _setSelectOptionData
  ) {
    camera = _camera;
    map = _map;
    setMglCameraPosition = _setMglCameraPosition;
    scene = _scene;
    nodeMenuOn = _nodeMenuOn;
    setNodeMenuOn = _setNodeMenuOn;
    setNodeMenuPosition = _setNodeMenuPosition;
    selectOptionData = _selectOptionData;
    setSelectOptionData = _setSelectOptionData;
    //setNodeMenuOn(true)
    //console.log("menu on")
    character = scene.getObjectByName('player');
    console.log(character);

    this.inputManage();
  }
  inputManage() {
    cur_state = InputState.IDLE;

    cameraOrigin = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('mousedown', this.handleMouseDown);
  }
  cleanup() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('mousedown', this.handleMouseDown);
    console.log('cleanup inputManager');
  }

  setMglCameraPosition(_mglCameraPosition) {
    mglCameraPosition = _mglCameraPosition;
    // console.log("set:")
    // console.log(cameraPosition)
  }
  setMglCameraPositionTransformed(_mglCameraPositionTransformed) {
    mglCameraPositionTransformed = _mglCameraPositionTransformed;
    // console.log("set:")
    // console.log(cameraPosition)
  }

  handleKeyDown(event) {
    if (cur_state == InputState.IDLE) {
      if (event.key == 'l') {
        saveManager.loadReviews();
      } else if (event.key == 'p') {
        //character.playWalkAnim();
      } else if (event.key == 'q') {
        console.log(scene);
      }
    }
    if (event.key == 't') {
      dayManager.printStateData();
    }
    if (event.key == 'a') {
      demotestVar = !demotestVar;
    }
  }
  async handleMouseDown(event) {
    setNodeMenuOn(false);
    select_option = null;
    if (cur_state == InputState.IDLE) {
      const pointer = new THREE.Vector4();

      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
      pointer.z = 1;
      pointer.w = 1;
      // console.log(pointer)
      let direction = pointer.clone().applyMatrix4(camera.projectionMatrix.clone().invert());
      direction.divideScalar(direction.w);
      raycaster.set(
        mglCameraPositionTransformed,
        direction.sub(mglCameraPositionTransformed).normalize()
      );
      const intersectObjects = raycaster.intersectObjects(scene.children);

      for (let i = 0; i < intersectObjects.length; i++) {
        if (intersectObjects[i].object.userData?.tag == 'node') {
          const cur_day = dayManager.getCurDay();
          const nodes = dayManager.getNodes(cur_day - 1);
          const index = nodes.length - 1;
          const cur_node = nodes[index];
          select_option = intersectObjects[i].object;
          var load_options = objectManager.getLoadOptions();
          var search_options = objectManager.getSearchOptions();
          var recommended_options = objectManager.getRecommendedOptions();
          var concat_options = load_options.concat(search_options);
          concat_options = concat_options.concat(recommended_options);
          setSelectOptionData({ character, options: concat_options, select_option });
          if (cur_node == select_option) {
            break;
          }
          setNodeMenuOn(true);
          setNodeMenuPosition({ x: event.clientX, y: event.clientY });
        }
      }
    }
  }

  async plusSearchNode(nodeInfo) {
    var node = await objectManager.createNode(nodeInfo);
    objectManager.changeNodeColor(node, dayManager.getDayColor(dayManager.getCurDay() - 1));
    var load_options = objectManager.getLoadOptions();
    var options = load_options.concat(objectManager.getSearchOptions());
    selectOption({ character, options, select_option: node });
  }

  // selectOption = () => {
  //   console.log(select_option);
  //   const cur_node = character.userData.myNodes[character.userData.myNodes.length - 1];

  //   objectManager.drawLine(cur_node.position, select_option.position);
  //   objectManager.loadOptions(new THREE.Vector3(userData.mapX, 1, userData.mapY));
  //   objectManager.invisibleOptions(select_option);

  //   character.userData.myNodes.push(select_option);
  //   objectManager.saveMyNodes();

  //   const targetPos = new THREE.Vector3(
  //     select_option.position.x,
  //     1,
  //     select_option.position.z
  //   );

  //   move(targetPos);
  // }
}

let demotestVar = false; //demo test 용 변수.

export const selectOption = (selectOptionDataState) => {
  const { character, options, select_option } = selectOptionDataState;
  const cur_day = dayManager.getCurDay();
  const nodes = dayManager.getNodes()[cur_day - 1];
  const index = nodes.length - 1;
  const cur_node = nodes[index];

  const line = objectManager.drawLine(
    cur_node.position,
    select_option.position,
    dayManager.getDayColor(cur_day - 1)
  );
  if (demotestVar) {
    objectManager.loadOptions(
      new THREE.Vector3(select_option.userData.mapX, 1, select_option.userData.mapY)
    );
  }
  objectManager.invisibleOptions(options, select_option);
  objectManager.clearLoadOptions();
  objectManager.clearSearchOptions();

  select_option.userData.visitDate = dayManager.getDate(cur_day - 1); //cur_date;
  objectManager.changeNodeColor(select_option, dayManager.getDayColor(cur_day - 1));
  dayManager.plusDayNode(line, select_option);

  saveManager.saveMyNodes();

  const targetPos = new THREE.Vector3(select_option.position.x, 1, select_option.position.z);

  move(character, targetPos);
};

function move(_character, targetPos) {
  cur_state = InputState.MOVE;
  console.log(_character);
  let angle = new THREE.Vector2(0, 1).angleTo(
    new THREE.Vector2(targetPos.x - _character.position.x, targetPos.z - _character.position.z)
  );
  if (targetPos.x < _character.position.x) {
    angle = Math.PI * 2 - angle;
  }
  gsap
    .to(_character.position, {
      x: targetPos.x,
      z: targetPos.z,
      duration: 1,
    })
    .then(() => {
      cur_state = InputState.IDLE;
    });
  //   .to(camera.position, {
  //     x: cameraOrigin.x + targetPos.x,
  //     z: cameraOrigin.z + targetPos.z,
  //     duration: 1,
  //   })
  //   .then(() => {
  //     cur_state = InputState.IDLE;
  //     setMglCameraPosition(mglCameraPosition.x + targetPos.x / 10000000, mglCameraPosition.y + targetPos.z / 10000000, mglCameraPosition.z)
  //   });
  gsap.to(_character.rotation, {
    y: angle,
    duration: 0.3,
  });
}

export default inputManager;