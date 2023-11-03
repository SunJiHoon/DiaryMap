import ObjectManager from "./objectManager";

let instance;

var objectManager;

var cur_day = 0;
var max_day = 0;
var dayColor = ["blue"];//나중에 설정해주기

var nodes = [];

class dayManager{
    constructor(){
        if(instance){ return instance; }
        this.colorList = ["blue", "red", "white", "black"]
        var temp = [];
        nodes.push(temp);
        instance = this;
    }

    setObjectManager(_objectManager){
        objectManager = _objectManager;
    }

    setNodes(_nodes){//saveManager에서 load할 때 넣어주기
        nodes = _nodes;
    }

    clearNodes(){
        var temp = [];
        nodes = temp;
    }

    plusDay(){
        var temp = [];
        nodes.push(temp);
        max_day++;
        dayColor.push(this.colorList[max_day % this.colorList.length]);
        console.log(this.colorList[max_day % this.colorList.length]);
    }

    visibleDay(dayIdx){
        const size = nodes[dayIdx].length;
        for(let i =0;i<size;i++){
            if(nodes[dayIdx][i] != null){
                nodes[dayIdx][i].visible = true;
            }
        }
    }

    invisibleDay(dayIdx){
        const size = nodes[dayIdx].length;
        for(let i =0;i<size;i++){
            if(nodes[dayIdx][i] != null){
                nodes[dayIdx][i].visible = false;
            }
        }
    }

    plusDayNode(line, node){
        nodes[cur_day].push(line);
        nodes[cur_day].push(node);
    }

    removeDayNode(dayIdx, index){
        objectManager.removeObject();
    }

    getCurDay(){
        return cur_day;
    }

    getMaxDay(){
        return max_day;
    }

    getDayColor(dayIdx){
        return dayColor[dayIdx];
    }

    getNodes(dayIdx){
        return nodes[dayIdx];
    }
}

export default dayManager;