import * as THREE from "three";
import Map from "../object/map.js";
import Player from "../object/player.js";
import Node from "../object/node.js";
import axios from "axios";

let scene;
const loader = new THREE.ObjectLoader();

let posArr1 = [
  new THREE.Vector3(0, 1, 0), //역
  new THREE.Vector3(10, 1, 0), //음식점1
  new THREE.Vector3(10, 1, 10), //음식점2
  new THREE.Vector3(10, 1, 20), //음식점3
  new THREE.Vector3(20, 1, 20), //관광지1
];

class objectManager {
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

    axios.get("http://localhost:8080/api/openApi/node?contentType=음식점").then((res) => {
      const startNode = new Node(res.data[0]);
      scene.add(startNode);
    });
  }

  loadNodes(index) {
    console.log("loadNodes execute");
    axios.get("http://localhost:8080/api/openApi/node?contentType=음식점").then((res) => {
      const node1 = new Node(res.data[index * 2 + 1]);
      const node2 = new Node(res.data[index * 2 + 2]);
      node1.position.set(index * 10, 1, 0);
      node2.position.set(0,1,index * 10);
    });
  }

  deleteObj(object) {
    scene.remove(object);
  }

  //test용으로만 쓰일 듯?
  saveObj(object) {
    const objectJson = object.toJSON();
    console.log(objectJson);
    console.log(object.position);
    console.log(object.rotation);
    axios.post("http://localhost:8080/api/save/Obj");
    return objectJson;
  }

  saveObjs() {
    const sceneJSON = scene.toJSON();
    console.log(sceneJSON);
    axios.post("http://localhost:8080/api/save/Objs").then((res) => {
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
          for (var i = 0; i < posArr1.length - 1; i++) {
            const x1 = posArr1[i].x;
            const z1 = posArr1[i].z;
            const x2 = posArr1[i + 1].x;
            const z2 = posArr1[i + 1].z;

            const lineGeometry = new THREE.PlaneGeometry();
            const lineMaterial = new THREE.MeshStandardMaterial();
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            scene.add(line);
          }
        });
      }
    });
  }
}

export default objectManager;
