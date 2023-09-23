import ObjectManager from "../manager/objectManager";

const Category = {
  STATION: "station",
  TRAVELINGSPOT: "travelingSpot",
  RESTAURANT: "restaurant",
};
Object.freeze(Category);

let name;
let address;
let category;
let tel;
let pos;
let reviews;
let star;

class Node {
  constructor(info) {
    const objectManager = new ObjectManager();
    
  }

  event() {}
}
