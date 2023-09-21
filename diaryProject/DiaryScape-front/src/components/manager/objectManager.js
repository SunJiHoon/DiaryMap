import * as THREE from "three";
import Map from '../object/map.js';
import Player from '../object/player.js'
import axios from "axios";

let scene;
const loader = new THREE.ObjectLoader();

class saveManager {
  constructor(_scene) {
    scene = _scene;
  }

  async newMap(characterName) {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(-10, 10, 20);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const map = new Map();
    scene.add(map.mesh);

    const player = new Player();
    const playerMesh = await player.loadGltf(characterName);
    playerMesh.name = "player";
    scene.add(playerMesh);
    console.log("create the player");

    //this.saveObjs();
  }

  createObj(object, pos){
    object.position.set(pos);
  }

  deleteObj(object){
    scene.remove(object);
  }

  //test용으로만 쓰일 듯?
  saveObj(object) {
    const objectJson = object.toJSON();
    console.log(objectJson);
    console.log(object.position);
    console.log(object.rotation);

    return objectJson;
  }

  saveObjs() {
    console.log(scene.toJSON());
    axios.post("http://localhost:8080/api/Obj").then((res) => {
      console.log(res.data);
    });
  }

  loadObj(objectName) {
    axios.get("http://localhost:8080/api/Obj/" + objectName).then((res) => {
      console.log(res.data);
      const object = loader.parse(res.data);
      return object;
    });
  }

  loadObjs() {
    //load scene
    axios.get("http://localhost:8080/api/scene").then((res) => {
      if (res.data == "null") {
        //초기 작업(맵 생성, 캐릭터 생성); //회원 가입 시 한 유저 당 하나 씩 미리 생성
      } else {
        scene = loader.parse(res.data);
        axios.get("http://localhost:8080/api/Objs").then((res) => {
          res.data.foreach((object) => {
            const obj = scene.getObjectByName(object.name);
            obj.position.set(object.pos);
            obj.rotation.set(object.rot);
          });
        });
      }
    });
  }
}

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
  var keyCode = event.which;
  if (keyCode == 65) {
    axios.post("http://localhost:8080/api/Obj", sceneJson).then((res) => {
      console.log(res.data);
    });
  } else if (keyCode == 66) {
    axios.get("http://localhost:8080/api/Obj").then((res) => {
      console.log(res.data);
    });
  }
}

export default saveManager;
