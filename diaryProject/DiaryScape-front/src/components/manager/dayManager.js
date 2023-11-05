import ObjectManager from "./objectManager";

let instance = null;

let objectManager;
// let cur_day = 0;
let max_day = 0;
let dayColor = ["blue"];//나중에 설정해주기

var nodes = [];

class DayManager {
    constructor() {
        if (instance) return instance
        this.colorList = ["blue", "red", "white", "black"]
        var temp = [];
        nodes.push(temp);

        this.dayModuleList = null;
        this.setDayModuleList = null;
        this.dayCheckedList = null;
        this.currentDay = null;
        this.maxDay = null;
        instance = this
    }

    clearNodes(){
        nodes = [];
        var temp = [];
        nodes.push(temp);
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

    setNodes(_nodes) {//saveManager에서 load할 때 넣어주기
        nodes = _nodes;
    }

    // plusDay(){
    //     var temp = [];
    //     nodes.push(temp);
    //     max_day++;
    //     dayColor.push(this.colorList[max_day % this.colorList.length]);
    //     console.log(this.colorList[max_day % this.colorList.length]);
    // }

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
    }

    removeDayNode(dayIdx, index) {
        objectManager.removeObject();
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