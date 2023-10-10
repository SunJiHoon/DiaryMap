import * as THREE from "three"
import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { randInt } from "three/src/math/MathUtils";

const foods = [["chinese", 7, 7, 7], ["japanese", 0.5, 0.5, 0.5], ["korean", 35, 35, 35], ["western", 1, 1, 1]];

const Category = {
  NONE: "none",
  STATION: "station",
  TRAVELINGSPOT: "travelingSpot",
  RESTAURANT: "restaurant",
};
Object.freeze(Category);

class node {
  constructor(infos) {
    return this.loadObj(infos);
  }

  async loadObj(infos) {
    const objGeometry = new THREE.SphereGeometry(2);
    const objMaterial = new THREE.MeshBasicMaterial();
    const obj = new THREE.Mesh(objGeometry, objMaterial);

    const gltfLoader = new GLTFLoader();
    const ranNum = randInt(0, foods.length-1);
    const eventIdx = foods[ranNum];
    const temp = await gltfLoader.loadAsync("/assets/foods/" + eventIdx[0] + "/scene.gltf");
    const eventObj = temp.scene;

    obj.userData = {
      tag: "node",
      contentID: infos.contentid,
      contentType: infos.contentTypeId,
      title: infos.title,
      tel: infos.tel,
      mapX: infos.mapx,
      mapY: infos.mapy,
      relativeX: Number(infos.relativeX),
      relativeY: Number(infos.relativeY),
      addr1: infos.addr1,
    };

    eventObj.scale.set(eventIdx[1], eventIdx[2], eventIdx[3]);
    obj.position.set(obj.userData.relativeX, 0, obj.userData.relativeY);
    eventObj.position.set(obj.userData.relativeX, 2, obj.userData.relativeY);
    obj.children.push(eventObj);

    return obj;
  }
}

export default node;
