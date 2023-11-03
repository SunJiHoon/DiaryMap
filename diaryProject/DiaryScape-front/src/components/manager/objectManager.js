import * as THREE from "three";
// import Map from "../object/map.js";
import Player from "../object/player.js";
import Node from "../object/node.js";
import client from "../../utility/client.jsx";
import DayManager from "./dayManager.js";

let cur_options = [];

var scene;
var camera;
var player;
var tripData;
var startNodeData;
const dayManager = new DayManager();

const originCameraPos = new THREE.Vector3(-35, 45, 45);

class objectManager {
  constructor(_scene, _camera, _tripData, _startNodeData) {
    scene = _scene;
    camera = _camera;
    tripData = _tripData;
    startNodeData = _startNodeData;
    dayManager.setObjectManager(this);
  }

  newMap = async (characterName) => {
    scene.clear();

    camera.position.set(originCameraPos.x, originCameraPos.y, originCameraPos.z);

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
    player.position.set(startNode.userData.relativeX, 0, startNode.userData.relativeY);
    camera.position.add(new THREE.Vector3(startNode.userData.relativeX, 0, startNode.userData.relativeY));
    scene.add(startNode);
    startNode.userData.visitDate = "2023-10-31"//tripData.startDate
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
  }

  invisibleOptions(select_option) {
    for (let i = 0; i < cur_options.length; i++) {
      if (cur_options[i] != select_option) {
        scene.remove(cur_options[i]);
      }
    }
    cur_options = [];
  }

  removeObject(object) {
    scene.remove(object);
  }

  // saveMyNodes() {
  //   let jsonArr = [];
  //   const size = player.userData.myNodes.length;
  //   for (let i = 0; i < size; i++) {
  //     jsonArr.push(player.userData.myNodes[i].userData);
  //   }
  //   jsonArr = JSON.stringify(jsonArr);
  //   client.post("/api/obj/update?mapId=" + tripData.mapId, { jsonArr }, { withCredentials: true });
  //   this.drawDay(dayManager.getCurDay());
  // }

  // async loadMyNodes() {
  //   const res = await client.get("/api/obj/one?mapId=" + tripData.mapId);
  //   const nodeArr = res.data.jsonArr;
  //   player.userData.myNodes = nodeArr;

  //   const startNode = await new Node(nodeArr[0]);
  //   scene.add(startNode);

  //   const size = res.data.jsonArr.length;

  //   for (let i = 0; i < size - 1; i++) {
  //     const nextNode = await new Node(nodeArr[i + 1]);
  //     scene.add(nextNode);
  //     this.drawLine(new THREE.Vector3(nodeArr[i].relativeX, 0, nodeArr[i].relativeY), new THREE.Vector3(nodeArr[i + 1].relativeX, 0, nodeArr[i + 1].relativeY));
  //   }

  //   player.position.set(nodeArr[size-1].relativeX, 0, nodeArr[size-1].relativeY);
  //   camera.position.set(nodeArr[size-1].relativeX + originCameraPos.x, 0 + originCameraPos.y, nodeArr[size-1].relativeY + originCameraPos.z);
  // }

  async drawDay(dayIdx) {
    const res = await client.get("/api/obj/one/onlyMapJsonGroupByDate?mapId=" + tripData.mapId);
    if (res.data.length < dayIdx) { console.log("day 없음"); return; }
    nodeArr = res.data[dayIdx];
    const size = nodeArr.length;
    const dayColor = dayManager.getDayColor(dayIdx);

    var objectArr = [];

    if (size > 0) {
      const startNode = await new Node(nodeArr[0]);
      scene.add(startNode);
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