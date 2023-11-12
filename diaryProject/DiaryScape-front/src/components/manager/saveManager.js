import client from "../../utility/client.jsx";
import ObjectManager from "./objectManager.js";
import DayManager from './dayManager.js'

const objectManager = new ObjectManager();
const dayManager = new DayManager();

var tripData;

class saveManager {
    constructor(_tripData) {
        tripData = _tripData;
    }

    async checkIsFirst() {
        const isFirst = await client.get("/api/obj/isFirst?mapId=" + tripData.mapId);
        if (isFirst.data == "first") {
            dayManager.clearNodes();
            dayManager.plusDay();
            await objectManager.initNode();
        }
        else if (isFirst.data == "modified") {
            // dayManager.clearNodes();//이거 있으면 안 됨. 왜?
            // await this.loadMyNodes();//load 가능해지면 주석 풀기
            await objectManager.initNode();
        }
    }

    saveMyNodes() {
        let jsonArr = [];
        const max_day = dayManager.getMaxDay() - 1;
        for (let j = 0; j < max_day; j++) {
            var temp_nodes = dayManager.getNodes()[j];
            const size = temp_nodes.length;
            for (let i = 1; i < size; i += 2) {
                jsonArr.push(temp_nodes[i].userData);
            }
        }
        jsonArr = JSON.stringify(jsonArr);
        console.log(jsonArr);
        client.post("/api/obj/update?mapId=" + tripData.mapId, { jsonArr }, { withCredentials: true });
    }

    async loadMyNodes() {
        const res = await client.get("/api/obj/one/onlyMapJsonGroupByDate?mapId=" + tripData.mapId);
        console.log(res.data);
        //cur_day랑 max_day 변경해주기
        dayManager.setNodes(res.data);
        // nodes 받아와서 draw days
    }

    saveReviews(){
        const reviews = dayManager.getReviews();
        client.post()
    }
}

export default saveManager;