import * as THREE from 'three';
import Player from '../object/player.js';
import Node from '../object/node.js';
import client from '../client.jsx';
import DayManager from './dayManager.js';
import { gsap } from 'gsap';

let load_options = [];
let search_options = [];
let recommended_options;

let selectSearchNode;

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

  newMap = async () => {
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
    player = await playerLoader.loadGltf();
    player.name = 'player';
    scene.add(player);
  };

  async initNode() {
    var startNode = await this.createNode(startNodeData);
    this.changeNodeColor(startNode, dayManager.getDayColor(0));
    startNode.userData.visitDate = tripData.date;
    dayManager.plusDayNode(null, startNode);
    // await this.loadOptions(new THREE.Vector3(tripData.startX, 1, tripData.startY));
  }

  async loadOptions(selectPos) {
    const res = await client.get(
      '/api/openApi/node?mapId=' + tripData.mapId + '&mapX=' + selectPos.x + '&mapY=' + selectPos.z
    );
    for (let i = 0; i < res.data.length; i++) {
      var tempNode = await this.createNode(res.data[i]);
      load_options.push(tempNode);
    }
    console.log('end load options');
  }

  loadSearchOptions = async (nodeInfos) => {
    this.invisibleOptions(search_options, null);
    this.clearSearchOptions();
    console.log(search_options.length);
    const size = nodeInfos.length;
    for (let i = 0; i < size; i++) {
      var tempNode = await this.createNode(nodeInfos[i]);
      search_options.push(tempNode);
    }
    console.log('end load search options');
  };

  loadRecommendedOptions = async (nodeInfos) => {
    this.invisibleOptions(recommended_options, null);
    this.clearRecommendedOptions();
    console.log("load Recommended Optoins");
    recommended_options = this.drawDay(nodeInfos, 0);
    console.log("end load recommended options");
  }

  invisibleOptions(options, select_option) {
    for (let i = 0; i < options.length; i++) {
      if (options[i] != select_option) {
        scene.remove(options[i]);
      }
    }
    options = [];
  }

  onNodeSearchSelect = (index) => {
    if (selectSearchNode != null) {
      this.changeNodeColor(selectSearchNode, 'magenta');
    }
    if (search_options.length > 0) {
      selectSearchNode = search_options[index];
      this.changeNodeColor(selectSearchNode, 'cyan');
    }
  };

  removeObject(object) {
    console.log(object);
    scene.remove(object);
  }

  async drawDay(nodeArr, dayIdx) {
    const size = nodeArr.length;
    const dayColor = dayManager.getDayColor(dayIdx);

    var objectArr = [];

    if (size > 0) {
      var startNode = await this.createNode(nodeArr[0]);
      this.changeNodeColor(startNode, dayManager.getDayColor(dayIdx));
      objectArr.push(null);
      objectArr.push(startNode);
    }

    for (var i = 0; i < size - 1; i++) {
      var nextNode = await this.createNode(nodeArr[i + 1]);
      this.changeNodeColor(nextNode, dayManager.getDayColor(dayIdx));
      const line = this.drawLine(
        new THREE.Vector3(nodeArr[i].relativeX, 0, nodeArr[i].relativeY),
        new THREE.Vector3(nodeArr[i + 1].relativeX, 0, nodeArr[i + 1].relativeY),
        dayColor
      );
      objectArr.push(line);
      objectArr.push(nextNode);
    }
    return objectArr;
  }

  async createNode(nodeInfo) {
    var node = await new Node(nodeInfo);
    scene.add(node);
    gsap.to(node.position, {
      y: 0,
      duration: 2,
    });
    return node;
  }

  changeNodeColor(node, color) {
    node.material.color = new THREE.Color(color);
  }

  drawLine(startNode, endNode, lineColor) {
    const points = [];
    const start = new THREE.Vector3(startNode.x, 0, startNode.z);
    const end = new THREE.Vector3(endNode.x, 0, endNode.z);
    points.push(start);
    points.push(end);
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({ color: lineColor });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
    return line;
  }

  setPlayerPos(position) {
    player.position.set(position.x, 1, position.z);
  }

  getLoadOptions() {
    return load_options;
  }

  clearLoadOptions() {
    load_options = [];
  }

  getSearchOptions() {
    return search_options;
  }

  clearSearchOptions() {
    search_options = [];
  }

  clearRecommendedOptions(){
    recommended_options = [];
  }
}

export default objectManager;
