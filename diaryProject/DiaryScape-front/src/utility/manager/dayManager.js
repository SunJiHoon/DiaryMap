let instance = null;

let objectManager, saveManager;

var nodes = [];
var pathInfos = [];
var reviews = [];
var totalReview = '';

class DayManager {
  constructor() {
    if (instance) return instance;
    this.colorList = ['blue', 'red', 'green', 'black'];

    this.dayModuleList = null;
    this.setDayModuleList = null;
    this.currentDay = null;
    this.setCurrentDay = null;
    this.maxDay = null;
    this.setNextDayMenuId = null;
    this.setDayMenuOpenList = null;
    this.setDayCheckedList = null;
    this.updateFrontReviews = null;
    this.updateFrontTotalReview = null;

    instance = this;
  }

  clearNodes() {
    nodes = [];
  }

  clearReviews() {
    reviews = [];
    totalReview = '';
  }

  setObjectManager(_objectManager) {
    objectManager = _objectManager;
  }

  setSaveManager(_saveManager) {
    saveManager = _saveManager;
  }

  setStateSetter(
    _setDayModuleList,
    _setNextDayMenuId,
    _setCurrentDay,
    _setDayMenuOpenList,
    _setDayCheckedList,
    _updateFrontReviews,
    _updateFrontTotalReview,
    _setCurNode
  ) {
    this.setDayModuleList = _setDayModuleList;
    this.setNextDayMenuId = _setNextDayMenuId;
    this.setCurrentDay = _setCurrentDay;
    this.setDayMenuOpenList = _setDayMenuOpenList;
    this.setDayCheckedList = _setDayCheckedList;
    this.updateFrontReviews = _updateFrontReviews;
    this.updateFrontTotalReview = _updateFrontTotalReview;
    this.setCurNodeToFront = _setCurNode;
  }

  updateFromFrontData(_dayModuleList, _dayCheckedList, _currentDay, _nextDayMenuId, _tripData) {
    this.dayModuleList = _dayModuleList;
    this.dayCheckedList = _dayCheckedList;
    this.currentDay = _currentDay;
    this.maxDay = _nextDayMenuId;
    this.tripData = _tripData;
  }

  dataPropagationTest() {
    this.setDayModuleList([...this.dayModuleList, { id: 33, data: 'test' }]);
  }

  printStateData() {
    // console.log(this.dayModuleList)
    // console.log(this.dayCheckedList)
    // console.log(this.currentDay)
    // console.log(this.maxDay)
  }

  updateDayInfosToFront(_nodes) {
    //var obj = [{id:1, data:[node1, node2, node3]},{},{}];
    const size = _nodes.length;
    var obj = [];

    for (let i = 0; i < size; i++) {
      var temp = {};
      temp.id = i + 1;
      var temp2 = [];
      var edges = [];
      for (let j = 0; j < _nodes[i].nodes.length; j++) {
        temp2.push(_nodes[i].nodes[j]);
        if (j != 0) {
          edges.push(nodes[i][j * 2].userData);
        }
      }
      temp.data = temp2;
      temp.edge = edges;
      obj.push(temp);
    }
    this.setDayModuleList(obj);
    this.setNextDayMenuId(_nodes.length + 1);
    this.setCurrentDay(_nodes.length);
    const dayMenuOpenList = [];
    for (let i = 0; i < _nodes.length; i++) {
      dayMenuOpenList.push(true);
    }
    this.setDayMenuOpenList(dayMenuOpenList);
    const dayCheckedList = [];
    for (let i = 0; i < _nodes.length; i++) {
      dayCheckedList.push(true);
    }
    this.setDayCheckedList(dayCheckedList);
  }

  updateDayNodesToFront() {
    const nextDayModuleList = this.dayModuleList.map((dayModule, i) => {
      if (dayModule.id == this.currentDay) {
        let temp = [];
        let edges = [];
        for (let index = 0; index < nodes[this.currentDay - 1].length / 2; index++) {
          temp.push(nodes[this.currentDay - 1][index * 2 + 1].userData);
          if (index != 0) {
            edges.push(nodes[this.currentDay - 1][index * 2].userData);
          }
        }
        return { id: dayModule.id, data: temp, edge: edges };
      } else {
        return dayModule;
      }
    });
    this.setDayModuleList(nextDayModuleList);
  }

  async plusDay() {
    var temp = [];
    if (this.currentDay > 1) {
      //전 날의 마지막 노드를 추가한 날의 첫 노드로 넣어줌
      temp.push(null);
      var node = nodes[this.currentDay - 2][nodes[this.currentDay - 2].length - 1];
      var nodeObj = await objectManager.createNode(this.getNodeInfos(node.userData));
      objectManager.changeNodeColor(nodeObj, this.colorList[(this.currentDay - 1) % 4]);
      nodeObj.userData.visitDate = this.getDate(this.currentDay - 1);
      temp.push(nodeObj);
    }
    nodes.push(temp);
    var tempReview = [];
    tempReview.push(this.getDate(this.currentDay - 1));
    tempReview.push('리뷰를 작성해주세요...');
    reviews.push(tempReview);
    const resNode = await saveManager.saveMyNodes();
    // const resReview = await saveManager.saveReviews();
  }

  visibleDay(dayIdx) {
    if (dayIdx >= this.maxDay - 1 || !nodes[dayIdx]) {
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

  setNodes(_nodes) {
    //saveManager에서 load할 때 넣어주기
    nodes = _nodes;
  }

  getNodes() {
    return nodes;
  }

  plusDayNode(line, node) {
    nodes[this.currentDay - 1].push(line);
    nodes[this.currentDay - 1].push(node);

    this.updateDayNodesToFront();
    this.setCurNodeToFront(this.getCurNode().userData);
  }

  changeDayNodeIndex = async (index, isUp) => {
    const length = nodes[this.currentDay - 1].length / 2;

    if (index < 1 || index > length) {
      //index does not exist
      return;
    }

    if (isUp) {
      //노드가 위로 갈 때
      if (index == 1) {
        // 첫 노드 이동불가
        return;
      }

      var temp = nodes[this.currentDay - 1][2 * index - 1];
      nodes[this.currentDay - 1][2 * index - 1] = nodes[this.currentDay - 1][2 * index - 3];
      nodes[this.currentDay - 1][2 * index - 3] = temp;

      this.updateDayNodesToFront();
      saveManager.saveMyNodes();

      if (index == 2) {
        if (length == 2) {
          this.setCurNodeToFront(this.getCurNode().userData);
          return;
        }
        await this.changeLine(index, 0, 2);
      } else if (index == length) {
        await this.changeLine(index, 1, 3);
        this.setCurNodeToFront(this.getCurNode().userData);
      } else {
        await this.changeLine(index, 0, 3);
      }
    } else {
      //노드가 아래로 내려갈 때
      if (index == length) {
        return;
      }

      var temp = nodes[this.currentDay - 1][2 * index + 1];
      nodes[this.currentDay - 1][2 * index + 1] = nodes[this.currentDay - 1][2 * index - 1];
      nodes[this.currentDay - 1][2 * index - 1] = temp;

      this.updateDayNodesToFront();
      saveManager.saveMyNodes();

      if (index == 1) {
        if (length == 2) {
          this.setCurNodeToFront(this.getCurNode().userData);
          return;
        }
        await this.changeLine(index, -1, 1);
      } else if (index == length - 1) {
        this.setCurNodeToFront(this.getCurNode().userData);
        await this.changeLine(index, 0, 2);
      } else {
        await this.changeLine(index, -1, 2);
      }
    }
  };

  async changeLine(index, start, end) {
    for (let i = start; i < end; i++) {
      objectManager.removeObject(nodes[this.currentDay - 1][2 * index - 2 * i]);
      nodes[this.currentDay - 1][2 * index - 2 * i] = await objectManager.drawLine(
        nodes[this.currentDay - 1][2 * index + 1 - 2 * i].userData,
        nodes[this.currentDay - 1][2 * index - 1 - 2 * i].userData,
        this.colorList[(this.currentDay - 1) % 4]
      );
    }
  }

  removeDayNode = async (dayIdx, index) => {
    if (nodes[dayIdx - 1].length == 2) {
      return; //노드가 하나만 들어있다면 삭제 못 하게
    }
    if (index == 1) {
      //첫 노드라면 뒷 라인만 삭제
      objectManager.removeObject(nodes[dayIdx - 1][1]);
      objectManager.removeObject(nodes[dayIdx - 1][2]);
      nodes[dayIdx - 1].splice(1, 2);
    } else if (index == nodes[dayIdx - 1].length / 2) {
      //마지막 노드라면
      objectManager.removeObject(nodes[dayIdx - 1][index * 2 - 1]);
      objectManager.removeObject(nodes[dayIdx - 1][index * 2 - 2]);
      nodes[dayIdx - 1].splice(index * 2 - 2, 2);
      this.setCurNodeToFront(this.getCurNode().userData);
    } else {
      objectManager.removeObject(nodes[dayIdx - 1][index * 2 - 2]);
      objectManager.removeObject(nodes[dayIdx - 1][index * 2 - 1]);
      objectManager.removeObject(nodes[dayIdx - 1][index * 2]);
      nodes[dayIdx - 1][index * 2 - 2] = await objectManager.drawLine(
        nodes[dayIdx - 1][index * 2 - 3].userData,
        nodes[dayIdx - 1][index * 2 + 1].userData,
        this.getDayColor(dayIdx - 1)
      );
      nodes[dayIdx - 1].splice(index * 2 - 1, 2);
    }

    this.updateDayNodesToFront();
    saveManager.saveMyNodes();
  };

  getCurNode = () => {
    if(nodes[this.currentDay - 1] == null){ return null; }
    return nodes[this.currentDay - 1][nodes[this.currentDay - 1].length - 1];
  };

  setPathInfos(_pathInfos) {
    pathInfos = _pathInfos;
  }

  getReviews() {
    return reviews;
  }

  setReviews(_reviews, _totalReviews) {
    reviews = [];
    const size = _reviews.length;

    let frontReviews = [];
    for (let i = 0; i < size; i++) {
      var temp = [];
      temp.push(this.getDate(i));
      temp.push(_reviews[i].dayReview);
      reviews.push(temp);
      frontReviews.push(_reviews[i].dayReview);
    }

    totalReview = _totalReviews;

    this.updateFrontTotalReview(totalReview);
    this.updateFrontReviews(frontReviews);
  }

  updateReviews(_reviews) {
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
    if (Idx == -1) {
      return 'brown';
    }
    return this.colorList[Idx % 4];
  }

  getNodeInfos(nodeInfo) {
    const obj = new Object();
    obj.tag = 'node';
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
    obj.importCount = nodeInfo.importCount;
    return obj;
  }
}

export default DayManager;
