import * as THREE from "three"
import { gsap } from "gsap";

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
      visitDate: infos.visitDate
    };

    obj.position.set(obj.userData.relativeX, 0, obj.userData.relativeY);

    return obj;
  }

  playInitAnim(){
    gsap.to(character.position, {
      x: targetPos.x,
      z: targetPos.z,
      duration: 1,
    })
      .then(() => {
        cur_state = InputState.IDLE
      });
    //   .to(camera.position, {
    //     x: cameraOrigin.x + targetPos.x,
    //     z: cameraOrigin.z + targetPos.z,
    //     duration: 1,
    //   })
    //   .then(() => {
    //     cur_state = InputState.IDLE;
    //     setMglCameraPosition(mglCameraPosition.x + targetPos.x / 10000000, mglCameraPosition.y + targetPos.z / 10000000, mglCameraPosition.z)
    //   });
    gsap.to(character.rotation, {
      y: angle,
      duration: 0.3,
    });
  }
}

export default node;
