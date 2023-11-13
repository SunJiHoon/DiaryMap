import Node from '../object/node'
let instance = null;

let objectManager;

var nodes = [];
var reviews = [];

class DayManager {
    constructor() {
        if (instance) return instance
        this.colorList = ["blue", "red", "green", "black"]

        this.dayModuleList = null;
        this.setDayModuleList = null;
        this.dayCheckedList = null;
        this.currentDay = null;
        this.maxDay = null;
        instance = this
    }

    clearNodes(){
        nodes = [];
    }

    setObjectManager(_objectManager) {
        objectManager = _objectManager;
    }

    setStateSetter(_setDayModuleList) {
        this.setDayModuleList = _setDayModuleList
    }

    updateFromFrontData(_dayModuleList, _dayCheckedList, _currentDay, _nextDayMenuId, _tripData) {
        this.dayModuleList = _dayModuleList;
        this.dayCheckedList = _dayCheckedList;
        this.currentDay = _currentDay;
        this.maxDay = _nextDayMenuId;
        this.tripData = _tripData;
    }

    dataPropagationTest() {
        this.setDayModuleList([
            ...this.dayModuleList,
            { id: 33, data: "test" },
        ])
    }

    printStateData() {
        // console.log(this.dayModuleList)
        // console.log(this.dayCheckedList)
        // console.log(this.currentDay)
        // console.log(this.maxDay)
    }

    updateDayNodesToFront(){
        const nextDayModuleList = this.dayModuleList.map((dayModule, i) => {
            if(dayModule.id == this.currentDay) {
                let temp = [];
                for(let index = 0;index<nodes[this.currentDay-1].length/2;index++){
                    temp.push(nodes[this.currentDay-1][index * 2 + 1].userData.title);
                }
                //dayModule.data = temp;
                return {id: dayModule.id, data: temp}
            }
            else {
                return dayModule
            }
        })
        this.setDayModuleList(nextDayModuleList)
    }



    plusDay(){
        var temp = [];
        if(this.currentDay > 1){//전 날의 마지막 노드를 추가한 날의 첫 노드로 넣어줌
            temp.push(null);
            var node = nodes[this.currentDay - 2][nodes[this.currentDay - 2].length - 1];
            // node = JSON.stringify(node);
            // node = JSON.parse(node);//이걸 하든
            // var nodeObj = objectManager.createNode(node);//이걸 하든 둘 중에 하나는 해야함
            // nodeObj.userData.visitData = this.getDate(this.currentDay-1);
            node.userData.visitDate = this.getDate(this.currentDay-1);
            temp.push(node);
        }
        nodes.push(temp);
        reviews.push(this.currentDay + "일째");
    }
    
    visibleDay(dayIdx) {
        const size = nodes[dayIdx].length;
        for (let i = 0; i < size; i++) {
            if (nodes[dayIdx][i] != null) {
                nodes[dayIdx][i].visible = true;
            }
        }
    }

    invisibleDay(dayIdx) {
        const size = nodes[dayIdx].length;
        for (let i = 0; i < size; i++) {
            if (nodes[dayIdx][i] != null) {
                nodes[dayIdx][i].visible = false;
            }
        }
    }

    setNodes(_nodes) {//saveManager에서 load할 때 넣어주기
        nodes = _nodes;
    }

    getNodes(){
        return nodes;
    }

    plusDayNode(line, node) {
        nodes[this.currentDay - 1].push(line);
        nodes[this.currentDay - 1].push(node);
        this.updateDayNodesToFront();
    }

    removeDayNode(dayIdx, index) {//구현하기
        objectManager.removeObject();
        this.updateDayNodesToFront();
    }

    getReviews(){
        return reviews;
    }

    setReviews(_reviews){
        reviews = _reviews;
    }

    updateDayReview(idx, review){
        reviews[idx] = review;
    }

    getCurDay() {
        return this.currentDay;
    }

    getDate(index){
        const date = new Date(this.tripData.date);
        date.setDate(date.getDate() + index);
        return date.toISOString().substring(0,10);
    }

    getMaxDay() {
        return this.maxDay;
    }

    getDayColor(Idx){
        return this.colorList[Idx % 4];
    }
}

export default DayManager;