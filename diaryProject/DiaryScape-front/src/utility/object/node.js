import * as THREE from "three"
import { gsap } from "gsap";
import { randInt } from "three/src/math/MathUtils";

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

  loadObj(infos) {
    const objGeometry = new THREE.SphereGeometry(2);
    const objMaterial = new THREE.MeshBasicMaterial({ color: "magenta" });
    const obj = new THREE.Mesh(objGeometry, objMaterial);
    obj.scale.set(4, 4, 4);

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
      visitDate: infos.visitDate,
      nodeReview: infos.nodeReview,
    };
    
    var ranY = randInt(35.0,40.0);
    obj.position.set(obj.userData.relativeX, ranY, obj.userData.relativeY);
    return obj;
  }

  playInitAnim(obj){
    gsap.to(obj.position, {
      y: 0,
      duration: 1,
    })
  }
}

export default node;
