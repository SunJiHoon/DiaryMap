import * as THREE from "three";
import Map from "../object/map.js";
import Player from "../object/player.js";
import Node from "../object/node.js";
import axios from "axios";

let scene;
let camera;

let cur_options = [];
let tripData;
let playerMesh;

const loader = new THREE.ObjectLoader();

class objectManager {
  constructor(_scene, _camera, _tripData) {
    scene = _scene;
    camera = _camera;
    tripData = _tripData;
  }

  async checkMapSave(){
    const res = await axios.get("http://localhost:8080/api/obj/one?mapId=" + tripData.mapId);
    console.log(res.data.sceneJSON);
    if(res.data){
      await this.loadScene();
    }
    else{
      await this.newMap("spongebob").then(this.initNode());//캐릭터 이름 넣기
    }
  }

  async newMap(characterName) {
    scene.clear();

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(-10, 10, 20);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const map = new Map();
    scene.add(map.mesh);

    const player = new Player();
    playerMesh = await player.loadGltf(characterName);
    playerMesh.name = "player";
    scene.add(playerMesh);
  }

  async initNode() {
    const res = await axios.get("http://localhost:8080/api/openApi/node?mapId=" + tripData.mapId + "&mapX=" + tripData.startX + "&mapY=" + tripData.startY);
    const startNode = await new Node(res.data[0]);
    playerMesh.position.set(startNode.userData.relativeX, 0, startNode.userData.relativeY);
    camera.position.add(new THREE.Vector3(startNode.userData.relativeX, 0, startNode.userData.relativeY));
    scene.add(startNode);
    playerMesh.userData.myNodes.push(startNode)
    await this.loadNodes(new THREE.Vector3(tripData.startX, 1, tripData.startY));
    this.saveScene();
  }

  async loadNodes(selectPos) {
    const res = await axios.get("http://localhost:8080/api/openApi/node?mapId=" + tripData.mapId + "&mapX=" + selectPos.x + "&mapY=" + selectPos.z);
    for (let i = 0; i < res.data.length; i++) {
      var tempNode = await new Node(res.data[i]);
      scene.add(tempNode);
      cur_options.push(tempNode);
      scene.add(tempNode);
    }
  }

  invisibleOptions(select_option) {
    for (let i = 0; i < cur_options.length; i++) {
      if (cur_options[i] != select_option) {
        scene.remove(cur_options[i]);
      }
    }
    cur_options = [];
  }

  saveScene() {
    scene.updateMatrixWorld();
    const sceneJSON = JSON.stringify(scene);
    axios.post("http://localhost:8080/api/obj/update?mapId=" + tripData.mapId, { sceneJSON }, { withCredentials: true });
  }

  async loadScene() {
    scene.clear();
    const res = await axios.get("http://localhost:8080/api/obj/one?mapId=" + tripData.mapId)
    const sceneData = JSON.parse(res.data.sceneJSON);
    const objectLoader = new THREE.ObjectLoader();
    const tempScene = objectLoader.parse(sceneData);
    scene.children = tempScene.children;
    camera.position.set(-35, 45, 45);
    const size = scene.children[3].userData.myNodes.length;
    const userData = scene.children[3].userData.myNodes[size-1].object.userData;
    camera.position.add(new THREE.Vector3(userData.relativeX, 0, userData.relativeY));
  }

}

export default objectManager;