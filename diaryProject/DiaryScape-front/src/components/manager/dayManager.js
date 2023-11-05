import ObjectManager from "./objectManager";

let instance = null;

let objectManager;
let dayColor = [];

var nodes = [];

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

    updateFromFrontData(_dayModuleList, _dayCheckedList, _currentDay, _nextDayMenuId) {
        this.dayModuleList = _dayModuleList;
        this.dayCheckedList = _dayCheckedList;
        this.currentDay = _currentDay;
        this.maxDay = _nextDayMenuId;
    }

    dataPropagationTest() {
        this.setDayModuleList([
            ...this.dayModuleList,
            { id: 33, data: "test" },
        ])
    }

    printStateData() {
        console.log(this.dayModuleList)
        console.log(this.dayCheckedList)
        console.log(this.currentDay)
        console.log(this.maxDay)
    }

    updateDayNodesToFront(){
        const nextDayModuleList = this.dayModuleList.map((dayModule, i) => {
            if(dayModule.id == this.currentDay) {
                var temp = [];
                for(let index = 0;index<nodes[this.currentDay-1].length/2;index++){
                    console.log(this.currentDay);
                    console.log(nodes);
                    temp.push(nodes[this.currentDay-1][index * 2 + 1].userData.title);
                }
                dayModule.data = temp;
                return dayModule
            }
            else {
                return dayModule
            }
        })
    }

    plusDay(){
        console.log("currentDay:")
        console.log(this.currentDay)
        var temp = [];
        if(this.currentDay > 1){//전 날의 마지막 노드를 추가한 날의 첫 노드로 넣어줌
            temp.push(null);
            temp.push(nodes[this.currentDay - 2][nodes[this.currentDay - 2].length - 1]);
        }
        nodes.push(temp);
        dayColor.push(this.colorList[(this.maxDay - 1) % this.colorList.length]);
    }

    setNodes(_nodes) {//saveManager에서 load할 때 넣어주기
        nodes = _nodes;
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

    plusDayNode(line, node) {
        nodes[this.currentDay - 1].push(line);
        nodes[this.currentDay - 1].push(node);
        this.updateDayNodesToFront();
    }

    removeDayNode(dayIdx, index) {
        objectManager.removeObject();
        this.updateDayNodesToFront();
    }

    getCurDay() {
        return this.currentDay;
    }

    getMaxDay() {
        return max_day;
    }

    getDayColor(dayIdx) {
        return dayColor[dayIdx];
    }

    getNodes(dayIdx) {
        return nodes[dayIdx];
    }
}

export default DayManager;