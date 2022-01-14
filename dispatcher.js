const dispatchButton = document.getElementById('btn-dispatch');
const workloadButton = document.getElementById('btn-workload');

const cpu1Input = document.getElementById('cpu-1-input');
const cpu2Input = document.getElementById('cpu-2-input');
const cpu3Input = document.getElementById('cpu-3-input');

// Klassdeklaration för noden som innehåller data och pekaren till nästa nod

class Node {
    constructor(data, next=null) {
        this.data = data;
        console.log("Data: " + data);
        this.next = next;
    }
}

// Huvudet för listan som innehåller enbart EN pekare till första noden i listan

class LinkedList {
    constructor() {
        this.head = null;
    }
    insert(data) {
        let t = new Node(data);
        t.next = this.head;
        this.head = t;
        console.log('Added new node');
    }
    showAll() {
        let t = this.head;
        while(t != null) {
            t = t.next;
        }
    }
    generate(num) {
        for(let i = 0; i < num; i++) {
            this.insert(Math.floor(Math.random()));
        }
    }
    deleteTail() {
        if (this.head == null || this.head.next == null) 
        return;
        let t = this.head;
        while(t.next.next != null) {
            t = t.next;
        }
        t.next = null;
    }
    deleteHead() {
        if (this.head != null) {
            this.head = this.head.next;
        }
    }
    length() {
        let t = this.head;
        let num = 0;
        while( t != null ) 
        {
            num++;
            t=t.next;
        }
        return num;
    }
    sort() {

    }
}