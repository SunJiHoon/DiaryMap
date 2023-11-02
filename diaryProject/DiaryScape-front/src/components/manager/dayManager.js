let instance;

var cur_day = 0;
var max_day = 0;
var dayColor = [];

var nodes = [];

class dayManager{
    constructor(){
        if(instance){ return instance; }
        this.colorList = ["red", "blue", "white", "black"]
        instance = this;
    }

    plusDay(){
        max_day++;
        dayColor.push(this.colorList[max_day % this.colorList.length]);
    }

    drawDay(dayIdx){

    }

    eraseDay(dayIdx){

    }

    removeDayNode(dayIdx, index){

    }

    getCurDay(){
        return cur_day;
    }

    getDayColor(){

    }
}

export default dayManager;