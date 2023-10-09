import * as THREE from "three"
import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { randInt } from "three/src/math/MathUtils";

const foods = ["chinese", "japanese", "korean", "western"];

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

  async loadObj(infos){
    const objGeometry = new THREE.SphereGeometry(2);
    const objMaterial = new THREE.MeshBasicMaterial();
    const obj = new THREE.Mesh(objGeometry, objMaterial);

    const gltfLoader = new GLTFLoader();
    const ranNum = randInt(0, foods.length);
    randInt
    const temp = await gltfLoader.loadAsync("/assets/foods/"+foods[0]+"/scene.gltf");
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

    eventObj.scale.set(5,5,5);
    obj.position.set(obj.userData.relativeX, 0 ,obj.userData.relativeY);
    eventObj.position.set(obj.userData.relativeX, 2 ,obj.userData.relativeY);
    obj.children.push(eventObj);

    return obj;
  }
}

export default node;
