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
            //client로 받아와서
            //dayManager.setNodes();
            // await this.loadMyNodes();//load 가능해지면 주석 풀기
            await objectManager.initNode();
        }
    }

    saveMyNodes() {
        let jsonArr = [];
        const max_day = dayManager.getMaxDay();
        for(let j = 0; j<max_day;j++){
            const size = dayManager.getNodes(j).length;
            for (let i = 1; i < size; i+2) {
                jsonArr.push(dayManager.getNodes(j)[i]);
            }
        }
        console.log(jsonArr);
        jsonArr = JSON.stringify(jsonArr);
        client.post("/api/obj/update?mapId=" + tripData.mapId, { jsonArr }, { withCredentials: true });
    }
}

export default saveManager;