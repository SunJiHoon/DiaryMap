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
        this.setDayCheckedList = null;
        this.currentDay = null;
        this.setCurrentDay = null;
        this.maxDay = null;
        this.setNextDayMenuId = null;
        instance = this
    }

    clearNodes() {
        nodes = [];
    }

    setObjectManager(_objectManager) {
        objectManager = _objectManager;
    }

    setStateSetter(_setDayModuleList, _setNextDayMenuId) {
        this.setDayModuleList = _setDayModuleList
        this.setNextDayMenuId = _setNextDayMenuId
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
        //console.log(this.dayModuleList)
        //console.log(this.dayCheckedList)
        //console.log(this.currentDay)
        //console.log(this.maxDay)
    }

    updateDayInfosToFront(nodes) {
        //var obj = [{id:1, data:[node1, node2, node3]},{},{}];
        const size = nodes.length;
        var obj = [];

        for (let i = 0; i < size; i++) {
            var temp = {};
            temp.id = i + 1;
            var temp2 = [];
            for (let j = 0; j < nodes[i].nodes.length; j++) {
                temp2.push(nodes[i].nodes[j]);
            }
            temp.data = temp2
            obj.push(temp);
        }
        this.setDayModuleList(obj);
    }

    updateDayNodesToFront() {
        const nextDayModuleList = this.dayModuleList.map((dayModule, i) => {
            if (dayModule.id == this.currentDay) {
                let temp = [];
                for (let index = 0; index < nodes[this.currentDay - 1].length / 2; index++) {
                    temp.push(nodes[this.currentDay - 1][index * 2 + 1].userData);
                }
                //dayModule.data = temp;
                return { id: dayModule.id, data: temp }
            }
            else {
                return dayModule
            }
        })
        this.setDayModuleList(nextDayModuleList)
        this.setNextDayMenuId(nodes.length + 1)
    }


    async plusDay() {
        var temp = [];
        if (this.currentDay > 1) {//전 날의 마지막 노드를 추가한 날의 첫 노드로 넣어줌
            temp.push(null);
            var node = nodes[this.currentDay - 2][nodes[this.currentDay - 2].length - 1];
            var nodeObj = await objectManager.createNode(this.getNodeInfos(node.userData));//이걸 하든 둘 중에 하나는 해야함
            nodeObj.userData.visitDate = this.getDate(this.currentDay - 1);
            temp.push(nodeObj);
        }
        nodes.push(temp);
        temp = [];
        temp.push(this.getDate(this.currentDay - 1));
        temp.push(this.currentDay + "일 째");
        reviews.push(temp);
    }

    visibleDay(dayIdx) {
        if (dayIdx >= this.maxDay - 2) {//이것땜에 마지막 날 거 visible 안 됨
            return;
        }
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
        /*nodes = [];
        const size = _nodes.length;
        for(let i =0;i<size;i++){
            var temp = [];
            const size2 = _nodes[i].nodes.length;
            for(let j =0;j <size2;j++){
                temp.push(_nodes[i].nodes[j]);
            }
            nodes.push(temp);
        }
        console.log(nodes);*/
    }

    getNodes() {
        return nodes;
    }

    plusDayNode(line, node) {
        nodes[this.currentDay - 1].push(line);
        nodes[this.currentDay - 1].push(node);
        this.updateDayNodesToFront();
    }

    removeDayNode = (dayIdx, index) => {//구현하기
        console.log("remove 실행");
        console.log(nodes[dayIdx - 1].length);
        if (nodes[dayIdx - 1].length == 2) {
            console.log("1개라서 패스");
            return;//노드가 하나만 들어있다면 삭제 못 하게
        }
        if (index == 1) {//첫 노드라면 뒷 라인만 삭제
            objectManager.removeObject(nodes[dayIdx - 1][1]);
            objectManager.removeObject(nodes[dayIdx - 1][2]);
            nodes[dayIdx - 1].splice(1, 2);
            console.log("첫 노드 삭제");
        }
        else if (index == nodes[dayIdx - 1].length / 2) {
            console.log(nodes[dayIdx - 1]);
            console.log(nodes[dayIdx - 1][index * 2 - 1]);
            console.log(nodes[dayIdx - 1][index * 2 - 2]);
            objectManager.removeObject(nodes[dayIdx - 1][index * 2 - 1]);
            objectManager.removeObject(nodes[dayIdx - 1][index * 2 - 2]);
            nodes[dayIdx - 1].splice(index * 2 - 2, 2);
            console.log("마지막 노드 삭제");
        }
        else {
            objectManager.removeObject(nodes[dayIdx - 1][index * 2 - 2]);
            objectManager.removeObject(nodes[dayIdx - 1][index * 2 - 1]);
            objectManager.removeObject(nodes[dayIdx - 1][index * 2]);
            nodes[dayIdx - 1][index * 2 - 2] = objectManager.drawLine(
                nodes[dayIdx - 1][index * 2 - 3].position, nodes[dayIdx - 1][index * 2 + 1].position,
                this.getDayColor(dayIdx - 1)
            );
            nodes[dayIdx - 1].splice(index * 2 - 1, 2);
            console.log("노드 삭제");
        }

        this.updateDayNodesToFront();
    }

    getCurNode = () => {
        //length 0일 때 예외 처리?
        return nodes[this.currentDay - 1][nodes[this.currentDay - 1].length - 1];
    }

    getReviews() {
        return reviews;
    }

    setReviews(_reviews) {
        reviews = _reviews;
    }

    updateReviews(_reviews) {
        console.log("update reviews");
        const size = _reviews.length;
        for (let i = 0; i < size; i++) {
            reviews[i][1] = _reviews[i];
        }
    }

    getCurDay() {
        return this.currentDay;
    }

    getDate(index) {
        const date = new Date(this.tripData.date);
        date.setDate(date.getDate() + index);
        return date.toISOString().substring(0, 10);
    }

    getMaxDay() {
        return this.maxDay;
    }

    getDayColor(Idx) {
        return this.colorList[Idx % 4];
    }

    getNodeInfos(nodeInfo) {
        const obj = new Object();
        obj.tag = "node";
        obj.contentid = nodeInfo.contentID;
        obj.contentTypeId = nodeInfo.contentType;
        obj.title = nodeInfo.title;
        obj.tel = nodeInfo.tel;
        obj.mapx = nodeInfo.mapX;
        obj.mapy = nodeInfo.mapY;
        obj.relativeX = Number(nodeInfo.relativeX);
        obj.relativeY = Number(nodeInfo.relativeY);
        obj.addr1 = nodeInfo.addr1;
        obj.visitDate = nodeInfo.visitDate;
        return obj;
    }
}

export default DayManager;