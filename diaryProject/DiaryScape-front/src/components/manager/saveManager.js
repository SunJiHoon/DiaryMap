import client from "../../utility/client.jsx";
import ObjectManager from "./objectManager.js";
import DayManager from './dayManager.js'

var objectManager;
var dayManager;

var tripData;

class saveManager {
    constructor(_tripData) {
        tripData = _tripData;
        if(dayManager == null){
            dayManager = new DayManager();
        }
    }

    setObjectManager(_objectManager){
        objectManager = _objectManager;
    }

    async checkIsFirst() {
        const isFirst = await client.get("/api/obj/isFirst?mapId=" + tripData.mapId);
        if (isFirst.data == "first") {
            dayManager.clearNodes();
            dayManager.clearReviews();
            dayManager.plusDay();
            await objectManager.initNode();
            this.saveMyNodes();
            this.saveReviews();
        }
        else if (isFirst.data == "modified") {
            dayManager.clearNodes();
            dayManager.clearReviews();
            await this.loadMyNodes();
            await this.loadReviews();
            this.saveMyNodes();
            this.saveReviews();
            //await objectManager.initLoadNode();
            //dayManager.plusDay();
            //await objectManager.initNode();
        }
    }

    saveMyNodes() {
        console.log("saveMyNodes");
        let jsonArr = [];
        const max_day = dayManager.getMaxDay() - 1;
        for (let j = 0; j < max_day; j++) {
            var temp_nodes = dayManager.getNodes()[j];  
            const size = temp_nodes.length;
            for (let i = 1; i < size; i += 2) {
                jsonArr.push(temp_nodes[i].userData);
            }
        }
        console.log(jsonArr);
        jsonArr = JSON.stringify(jsonArr);
        client.post("/api/obj/update?mapId=" + tripData.mapId, { jsonArr }, { withCredentials: true });
    }

    async loadMyNodes() {
        const res = await client.get("/api/obj/one/onlyMapJsonGroupByDate?mapId=" + tripData.mapId);
        //cur_day랑 max_day 변경해주기
        dayManager.setNodes(res.data);
        const size = res.data.length;
        var temp = [];
        for (let i = 0; i < size; i++) {
            var nodes = await objectManager.drawDay(res.data[i].nodes, i);
            temp.push(nodes);
        }
        dayManager.setNodes(temp);
        dayManager.updateDayInfosToFront(res.data);
    }

    async saveReviews() {
        var dayReviews = [];
        const reviews = dayManager.getReviews();
        const size = reviews.length;
        for (let i = 0; i < size; i++) {
            var temp = new Object();
            temp.visitDate = reviews[i][0];
            temp.dayReview = reviews[i][1];
            dayReviews.push(temp);
        }
        console.log(dayReviews);
        client.post("/api/dayReviews/save?mapId=" + tripData.mapId, { dayReviews }, { withCredentials: true });
    }

    async loadReviews() {
        const reviews = await client.get("api/dayReviews/look?mapId=" + tripData.mapId);
        const totalReview = await client.get("/api/totalReview/look?mapId=" + tripData.mapId);
        dayManager.setReviews(reviews.data, totalReview.data.review);
    }

    generateDiary = async () => {
        console.log("sendGPT");
        const res = await client.get("api/chatgptApi/sumedDiary?mapId=" + tripData.mapId);
        var review = res.data.answer;
        console.log("sendGPT끝");
        await client.post("/api/totalReview/save?mapId=" + tripData.mapId, { review }, {withCredentials: true });
        return res.data.answer;
    }
}

export default saveManager;