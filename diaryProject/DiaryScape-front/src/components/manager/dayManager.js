import ObjectManager from "./objectManager";

let instance = null;

let objectManager;
// let cur_day = 0;
let max_day = 0;
let dayColor = ["blue"];//나중에 설정해주기

var nodes = [];

class DayManager {
    constructor(_dayModuleList,) {
        if (instance) { return instance; }
        this.colorList = ["blue", "red", "white", "black"]
        var temp = [];
        nodes.push(temp);
        this.dayModuleList = null;
        this.setDayModuleList = null;
        this.dayCheckedList = null;
        this.currentDay = null;
        this.maxDay = null;
        instance = this;
    }

    setObjectManager(_objectManager) {
        objectManager = _objectManager;
    }

    setStateData(_dayModuleList, _setDayModuleList, _dayCheckedList, _currentDay, _nextDayMenuId) {
        this.dayModuleList = _dayModuleList;
        this.setDayModuleList = _setDayModuleList;
        this.dayCheckedList = _dayCheckedList;
        this.currentDay = _currentDay;
        this.maxDay = _nextDayMenuId;
        // console.log(this.dayModuleList)
    }

    printStateData() {
        console.log(this.dayModuleList)
        console.log(this.currentDay)
    }

    setNodes(_nodes) {//saveManager에서 load할 때 넣어주기
        nodes = _nodes;
    }

    clearNodes() {
        var temp = [];
        nodes = temp;
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