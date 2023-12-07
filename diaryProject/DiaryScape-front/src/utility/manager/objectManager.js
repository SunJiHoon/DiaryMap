import * as THREE from 'three';
import Player from '../object/player.js';
import Node from '../object/node.js';
import client from '../client.jsx';
import DayManager from './dayManager.js';
import { gsap } from 'gsap';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import SaveManager from './saveManager.js';

let load_options = [];
let search_options = [];
let recommended_options = [];

let selectSearchNode;

var scene;
var player;
var tripData;
var startNodeData;
const dayManager = new DayManager();
const saveManager = new SaveManager();
const loader = new FontLoader();

let setSurroundingNodeList;

class objectManager {
  constructor(_scene, _camera, _tripData, _startNodeData, _setSurroundingNodeList) {
    scene = _scene;
    tripData = _tripData;
    startNodeData = _startNodeData;
    setSurroundingNodeList = _setSurroundingNodeList;

    dayManager.setObjectManager(this);
  }

  newMap = async () => {
    scene.clear();
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
    console.log(load_options.map((element) => element.userData));
    setSurroundingNodeList(load_options.map((element) => element.userData));
  }

  loadSearchOptions = async (nodeInfos) => {
    this.invisibleOptions(search_options, null);
    this.clearSearchOptions();
    const size = nodeInfos.length;
    for (let i = 0; i < size; i++) {
      var tempNode = await this.createNode(nodeInfos[i]);
      search_options.push(tempNode);
    }
  };

  loadRecommendedOptions = async (nodeInfos) => {
    this.invisibleOptions(recommended_options, null);
    this.clearRecommendedOptions();
    recommended_options = await this.drawDay(nodeInfos, -1);
  };

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
    scene.remove(object);
  }

  drawDay = async (nodeArr, dayIdx) => {
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
      const line = await this.drawLine(objectArr[2 * i + 1].userData, nextNode.userData, dayColor);
      objectArr.push(line);
      objectArr.push(nextNode);
    }
    return objectArr;
  };

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

  async drawLine(startNode, endNode, lineColor) {
    // const points = [];
    // points.push(startNode.relativeX, 0, startNode.relativeY);
    // points.push(endNode.relativeX, 0, endNode.relativeY);

    // const geometry = new LineGeometry();
    // 		geometry.setPositions( points );
    // 		// geometry.setColors( colors );

    // const matLine = new LineMaterial({
    //   color: lineColor,
    //   linewidth: 10, // in world units with size attenuation, pixels otherwise
    //   vertexColors: false,
    //   dashed: false,
    //   dashSize: 5,
    //   alphaToCoverage: true,
    //   worldUnits: true,
    // });

    // const line = new Line2(geometry, matLine);
    // line.computeLineDistances();
    // line.scale.set(1, 1, 1);
    // scene.add(line);
    const points = [];
    const start = new THREE.Vector3(startNode.relativeX, 0, startNode.relativeY);
    const end = new THREE.Vector3(endNode.relativeX, 0, endNode.relativeY);
    points.push(start);
    points.push(end);
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({ color: lineColor, linewidth: 10 });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
    // console.log(endNode);
    // console.log(endNode.relativeX);
    // console.log(endNode.relativex);
    // console.log(endNode.relativeY);
    // console.log(endNode.relativey);

    const pathInfos = await saveManager.makePathInfo(startNode, endNode);
    line.userData = pathInfos;
    let textGeometry;
    loader.load('/assets/helvetiker_regular.typeface.json', function (font) {
      textGeometry = new TextGeometry('Hello three.js!', {
        font: font,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5,
      });
    });
    const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });
    const text = new THREE.Mesh(textGeometry, textMaterial);
    text.position.set(
      (startNode.relativeX + endNode.relativeX) / 2,
      3,
      (startNode.relativeY + endNode.relativeY) / 2
    );
    scene.add(text);
    // console.log(text);
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

  getRecommendedOptions() {
    return recommended_options;
  }

  clearRecommendedOptions() {
    recommended_options = [];
  }
}

export default objectManager;
