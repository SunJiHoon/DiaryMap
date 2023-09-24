import axios from "axios";
import * as THREE from "three";

const Category = {
  NONE: "none",
  STATION: "station",
  TRAVELINGSPOT: "travelingSpot",
  RESTAURANT: "restaurant",
};
Object.freeze(Category);

class node {
  objectLoader = new THREE.ObjectLoader();

  constructor(infos) {
    const objGeometry = new THREE.BoxGeometry(2, 2, 2);
    const objMaterial = new THREE.MeshStandardMaterial();
    const obj = new THREE.Mesh(objGeometry, objMaterial);
    /*
    axios.get("http://localhost:8080/api/Obj/" + objectName).then((res) => {
      console.log(res.data);
      const obj = loader.parse(res.data);
      obj.userData = {
        name: "",
        address: "",
        category: Category.NONE,
        tel: "",
        pos: new THREE.Vector3(10, 0, 10),
        reviews: [],
        star: 0,
      };
      return object;
    });
    */
    obj.userData = {
      tag: "node",
      addr1: infos.addr1,
      mapx: infos.mapx,
      mapy: infos.mapy,
      tel: infos.tel,
      title: infos.title,
    };
    obj.position.set(0,1,0);

    return obj;
  }
}

export default node;
