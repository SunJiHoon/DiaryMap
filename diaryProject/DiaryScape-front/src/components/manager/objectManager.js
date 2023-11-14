import * as THREE from "three";
// import Map from "../object/map.js";
import Player from "../object/player.js";
import Node from "../object/node.js";
import client from "../../utility/client.jsx";
import DayManager from "./dayManager.js";

let cur_options = [];

var scene;
var player;
var tripData;
var startNodeData;
const dayManager = new DayManager();

class objectManager {
  constructor(_scene, _camera, _tripData, _startNodeData) {
    scene = _scene;
    tripData = _tripData;
    startNodeData = _startNodeData;
    dayManager.setObjectManager(this);
  }

  newMap = async (characterName) => {
    scene.clear();

    // camera.position.set(originCameraPos.x, originCameraPos.y, originCameraPos.z);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(-10, 10, 20);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // const map = await new Map();
    // scene.add(map);

    const playerLoader = new Player();
    player = await playerLoader.loadGltf(characterName);
    player.name = "player";
    scene.add(player);
  }

  async initNode() {
    const startNode = await new Node(startNodeData);
    // player.position.set(startNode.userData.relativeX, 0, startNode.userData.relativeY);
    // camera.position.add(new THREE.Vector3(startNode.userData.relativeX, 0, startNode.userData.relativeY));
    scene.add(startNode);
    startNode.userData.visitDate = tripData.date
    dayManager.plusDayNode(null, startNode);
    await this.loadOptions(new THREE.Vector3(tripData.startX, 1, tripData.startY));
  }

  async loadOptions(selectPos) {
    const res = await client.get("/api/openApi/node?mapId=" + tripData.mapId + "&mapX=" + selectPos.x + "&mapY=" + selectPos.z);
    for (let i = 0; i < res.data.length; i++) {
      var tempNode = await new Node(res.data[i]);
      scene.add(tempNode);
      cur_options.push(tempNode);
      scene.add(tempNode);
    }
    console.log("end load options");
  }

  async loadSearchOptions(nodeInfos){
    const size = nodeInfos.length;
    for(let i =0;i<size;i++){
      
    }
  }

  invisibleOptions(select_option) {
    for (let i = 0; i < cur_options.length; i++) {
      if (cur_options[i] != select_option) {
        if(cur_options[i] != null){
          scene.remove(cur_options[i]);
        }
      }
    }
    cur_options = [];
  }

  removeObject(object) {
    scene.remove(object);
  }

  async drawDay(nodeArr, dayIdx) {
    console.log(nodeArr); console.log(dayIdx);
    const size = nodeArr.length;
    const dayColor = dayManager.getDayColor(dayIdx);

    var objectArr = [];

    if (size > 0) {
      const startNode = await new Node(nodeArr[0]);
      scene.add(startNode);
      objectArr.push(null);
      objectArr.push(startNode);
    }

    for (var i = 0; i < size - 1; i++) {
      const nextNode = await new Node(nodeArr[i + 1]);
      scene.add(nextNode);
      const line = this.drawLine(new THREE.Vector3(nodeArr[i].relativeX, 0, nodeArr[i].relativeY),
        new THREE.Vector3(nodeArr[i + 1].relativeX, 0, nodeArr[i + 1].relativeY),
        dayColor);
      objectArr.push(line); objectArr.push(nextNode);
    }
  }

  async createNode(nodeInfo){//기훈 파트에도 먼가 변화를 줘야하는 듯
    var node = await new Node(nodeInfo);
    scene.add(node);
    return node;
  }

  drawLine(startNode, endNode, lineColor) {
    const points = [];
    points.push(startNode);
    points.push(endNode);
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({ color: lineColor });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
    return line;
  }
}

export default objectManager;