const dispatchButton = document.getElementById('btn-dispatch');
const workloadButton = document.getElementById('btn-workload');

const cpuInputAll = document.getElementById('cpu-input-all');
// const cpu1Input = document.getElementById('cpu-1-input');
// const cpu2Input = document.getElementById('cpu-2-input');
// const cpu3Input = document.getElementById('cpu-3-input');



class Process {
    constructor(name, execTime, priority) {
        this.name = name;
        this.execTime = execTime;
        this.priority = priority;
        this.remainingTime = this.execTime;
    }
}

class CPU1 {
    constructor() {
        this.queueLength = 0;
        this.queue = null;
    }
    add(process) {
        // längst bak
    }
    remove(process) {
        // första
    } 
    work(ms) {
        // metod1
    }
}

class CPU2 {
    constructor() {
        this.queueLength = 0;
        this.queue = null;
    }
    add(process) {
        // längst bak
    }
    remove(process) {
        // specifierad
    } 
    work(ms) {
        // metod2
    }
}

class CPU3 {
    constructor() {
        this.queueLength = 0;
        this.queue = null;
    }
    add(process) {
        // i prioritet
    }
    remove(process) {
        // första
    } 
    work(ms) {
        // metod3
    }
}


function dispatcher() {

}

function scheduler() {
    // let cpu1 = new CPU1();
    // let cpu2 = new CPU2();
    // let cpu3 = new CPU3();

    // cpu1.queue;

    // cpu2.queue;

    // cpu3.work(100);
    // console.log(cpu3.work(100));
}
setInterval(scheduler, 100);