import client from "../../utility/client.jsx";
import ObjectManager from "./objectManager.js";
import DayManager from './dayManager.js'

var objectManager;// = new ObjectManager();
var dayManager;// = new DayManager();

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
            dayManager.plusDay();
            await objectManager.initNode();
            this.saveMyNodes();
            this.saveReviews();
        }
        else if (isFirst.data == "modified") {
            await this.loadMyNodes();//load 가능해지면 주석 풀기
            //await objectManager.initLoadNode();
            //dayManager.plusDay();
            //await objectManager.initNode();
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
        const reviews = await client.get("api/dayReviews/look?mapId=" + tripData.mapId);
        dayManager.setReviews(reviews);
        dayManager.updateDayInfosToFront(res.data);
        dayManager.printStateData();
    }

    saveTotalReview(){
        //const review = tripData.totalReview;
        const review = "";
        client.post("/api/totalReview/save?mapId=" + tripData.mapId, { review }, {withCredentials: true });
    }

    loadTotalReview(){
        const totalReview = client.get("/api/totalReview/look?mapId=" + tripData.mapId);
    }

    saveReviews() {
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
        console.log(reviews.data);
        dayManager.setReviews(reviews.data);
    }

    async generateDiary(){
        console.log("sendGPT");
        const res = await client.get("api/chatgptApi/sumedDiary?mapId=" + tripData.mapId);
        console.log(res);
        console.log(res.data);
        console.log("sendGPT끝");
        return res.data.answer;
    }
}

export default saveManager;