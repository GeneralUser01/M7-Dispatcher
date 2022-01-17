const dispatchButton = document.getElementById('btn-dispatch');
const workloadButton = document.getElementById('btn-workload');
const randomTasksButton = document.getElementById('btn-random-tasks');

const workloadInput = document.getElementById('workload');
const randomTasksInput = document.getElementById('random-tasks');

const message = document.getElementById('message');

const cpuInputAll = document.getElementById('cpu-input-all');
const cpu1Input = document.getElementById('cpu-1-input');
const cpu2Input = document.getElementById('cpu-2-input');
const cpu3Input = document.getElementById('cpu-3-input');

const cpu1Busy = document.querySelector('#cpu-1-area .current-status');
const cpu2Busy = document.querySelector('#cpu-2-area .current-status');
const cpu3Busy = document.querySelector('#cpu-3-area .current-status');

const cpu1BarCtx = document.getElementById('cpu-1-bar-chart').getContext('2d');
const cpu1PieCtx = document.getElementById('cpu-1-pie-chart').getContext('2d');
const cpu2BarCtx = document.getElementById('cpu-2-bar-chart').getContext('2d');
const cpu2PieCtx = document.getElementById('cpu-2-pie-chart').getContext('2d');
const cpu3BarCtx = document.getElementById('cpu-3-bar-chart').getContext('2d');
const cpu3PieCtx = document.getElementById('cpu-3-pie-chart').getContext('2d');

const cpuProcessLists = {
    cpu1: document.querySelector('#cpu-1-area .processes'),
    cpu2: document.querySelector('#cpu-2-area .processes'),
    cpu3: document.querySelector('#cpu-3-area .processes'),
};

const chartContexts = {
    cpu1: {
        bar: cpu1BarCtx,
        pie: cpu1PieCtx,
    },
    cpu2: {
        bar: cpu2BarCtx,
        pie: cpu2PieCtx,
    },
    cpu3: {
        bar: cpu3BarCtx,
        pie: cpu3PieCtx,
    },
};

const chartColors = {
    backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
    ],
    borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
    ],
};
function randomChartColor() {
    const max = Math.min(chartColors.backgroundColor.length, chartColors.borderColor.length);
    const value = Math.floor(Math.random() * max);
    return {
        backgroundColor: chartColors.backgroundColor[value],
        borderColor: chartColors.borderColor[value],
    };
}

function buildBarChart(ctx) {
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Remaining time',
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}
function buildPieChart(ctx) {
    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                label: 'Remaining time',
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
            }],
        },
        options: {
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

const charts = {};
for (const key of Object.keys(chartContexts)) {
    charts[key] = {
        bar: buildBarChart(chartContexts[key].bar),
        pie: buildPieChart(chartContexts[key].pie),
    };
}


// Handle input:
function connectEnterKey(elements, callback) {
    if (!elements) return;
    elements.forEach(item => {
        // Execute a function when the user releases a key on the keyboard
        item.addEventListener('keyup', function (event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                // Cancel the default action, if needed
                event.preventDefault();
                callback();
            }
        });
    });
}

dispatchButton.addEventListener('click', function () {
    dispatcher();
});
connectEnterKey(Array.from(document.querySelectorAll('.input-area input')), function () {
    // Trigger the button element with a click
    dispatchButton.click();
});

workloadButton.addEventListener('click', function () {
    let value = workloadInput.value;
    if (typeof value === 'string') {
        value = parseInt(value);
    }
    if (!isNaN(value) && value >= 0) {
        workPerCycle = value;
    } else {
        console.warn("Can't apply workload value: ", workloadInput.value);
    }
});
connectEnterKey([workloadInput], function() {
    workloadButton.click();
});

randomTasksButton.addEventListener('click', function () {
    const count = parseInt(randomTasksInput.value);
    if (isNaN(count) || count < 1) {
        console.warn('No tasks generated since the random tasks count was: ', randomTasksInput.value);
        return;
    }
    const chooseRandom = function (array) {
        return array[Math.floor(Math.random() * array.length)];
    };
    for (let i = 0; i < count; i++) {
        const name =
            chooseRandom(['Yellow', 'Red', 'Blue', 'Green', 'Orange', 'Purple']) +
            '-' +
            chooseRandom(['Goblin', 'Dragon', 'Troll', 'Plane', 'Boat', 'Machine']) +
            '-' + i;

        const time = 1000 + Math.floor(Math.random() * 5000);
        const priority = 1 + Math.floor(Math.random() * 5);

        for (const cpu of Object.values(cpus)) {
            cpu.add(new Process(name, time, priority));
        }
    }
});
connectEnterKey([randomTasksInput], function() {
    randomTasksButton.click();
});


class Process {
    constructor(name, execTime, priority) {
        if (typeof priority === 'string') {
            const parsed = parseInt(priority);
            if (isNaN(parsed)) {
                throw new Error("can't parse priority as a number: " + priority);
            }
            priority = parsed;
        }
        if (typeof priority !== 'number' || isNaN(priority)) {
            throw new Error('invalid priority: ' + priority);
        }
        if (priority < 1 || priority > 5) {
            throw new Error('priority must be between 1 and 5 but was: ' + priority);
        }

        if (typeof execTime === 'string') {
            const parsed = parseInt(execTime);
            if (isNaN(parsed)) {
                throw new Error("can't parse execution time as a number: " + execTime);
            }
            execTime = parsed;
        }
        if (typeof execTime !== 'number' || isNaN(execTime)) {
            throw new Error('invalid execution time: ' + execTime);
        }

        this.name = name;
        this.execTime = execTime;
        this.priority = priority;
        this.remainingTime = this.execTime;
        this.completedAfter = null;
    }
}


class CPU1 {
    constructor() {
        this.list = [];
        this.totalCpuTime = 0;
    }
    add(process) {
        // längst bak
        this.list.push(process);
    }
    remove() {
        // första
        this.list.shift();
    }
    work(ms) {
        // There are queued tasks and we have more time to work:
        while (this.list.length > 0 && ms > 0) {
            const firstProcess = this.list[0];
            // Work until task is completed or until we run out of work time.
            const workOnProcess = Math.min(firstProcess.remainingTime, ms);

            // Track remaining work time:
            firstProcess.remainingTime -= workOnProcess;
            ms -= workOnProcess;

            // Track total execution time & remove completed tasks:
            this.totalCpuTime += workOnProcess;
            if (firstProcess.remainingTime <= 0) {
                firstProcess.completedAfter = this.totalCpuTime;
                this.remove();
            }
        }
        // Return time left over after completing all tasks:
        return ms;
    }
    forEach(callback) {
        this.list.forEach(callback);
    }
}

/** Use time shared processing (using a single linked list). */
class CPU2 {
    constructor() {
        this.list = new SingleLinkedList();
        this.totalCpuTime = 0;
    }
    add(process) {
        // längst bak
        this.list.append(process);
    }
    remove(process) {
        // specifierad
        const cursor = this.list.cursor();
        while (!cursor.isAtEnd()) {
            if (cursor.current() === process) {
                cursor.remove();
                break;
            }
            cursor.moveToNext();
        }
    }
    work(ms) {
        // Do work until most of the time is used up (leave a bit of safety margin to possibly prevent infinite loops):
        while (ms > 0.2 && !this.list.isEmpty()) {
            const maxWorkPerProcess = ms / this.list.count();

            const cursor = this.list.cursor();

            // There are queued tasks and we have more time to work:
            while (!cursor.isAtEnd() && ms > 0) {
                const process = cursor.current();
                // Work until task is completed or until we run out of work time.
                const workOnProcess = Math.min(process.remainingTime, ms, maxWorkPerProcess);

                // Track remaining work time:
                process.remainingTime -= workOnProcess;
                ms -= workOnProcess;

                // Track total execution time & remove completed tasks:
                this.totalCpuTime += workOnProcess;
                if (process.remainingTime <= 0) {
                    process.completedAfter = this.totalCpuTime;
                    cursor.remove();
                } else {
                    // Advance cursor:
                    cursor.moveToNext();
                }
            }
        }
        // Return time left over after completing all tasks:
        return ms;
    }
    forEach(callback) {
        const cursor = this.list.cursor();
        while (!cursor.isAtEnd()) {
            callback(cursor.current());
            cursor.moveToNext();
        }
    }
}

class CPU3 {
    constructor() {
        this.list = new DoubleLinkedList();
        this.totalCpuTime = 0;
    }
    add(process) {
        // i prioritet
        if (this.list.isEmpty()) {
            this.list.append(process);
            return;
        }
        const cursor = this.list.cursor();
        while (true) {
            const current = cursor.current();
            if (current.priority < process.priority) {
                cursor.insertBefore(process);
                break;
            }

            cursor.moveToNext();
            if (cursor.isAtHead()) {
                // Reached end and wrapped around to start:
                this.list.append(process);
                break;
            }
        }
    }
    remove() {
        // första
        this.list.removeHead();
    }
    work(ms) {
        // metod3
        // Do work until most of the time is used up (leave a bit of safety margin to possibly prevent infinite loops):
        while (ms > 0.2 && !this.list.isEmpty()) {
            let sumOfPriorities = 0;
            {
                const cursor = this.list.cursor();
                while (true) {
                    sumOfPriorities += cursor.current().priority;
                    cursor.moveToNext();
                    if (cursor.isAtHead()) break;
                }
            }
            const timeSliceForPriority = ms / sumOfPriorities;
            const cursor = this.list.cursor();

            // There are queued tasks and we have more time to work:
            while (!this.list.isEmpty() && ms > 0) {
                const process = cursor.current();
                const maxTimeForProcess = timeSliceForPriority * process.priority;
                // Work until task is completed or until we run out of work time.
                const workOnProcess = Math.min(process.remainingTime, ms, maxTimeForProcess);

                // Track remaining work time:
                process.remainingTime -= workOnProcess;
                ms -= workOnProcess;

                // Track total execution time & remove completed tasks:
                this.totalCpuTime += workOnProcess;
                if (process.remainingTime <= 0) {
                    process.completedAfter = this.totalCpuTime;

                    // Advance cursor:
                    const isLastNode = cursor.isAtTail();
                    cursor.remove();
                    if (isLastNode) {
                        // Reached end of list:
                        break;
                    }
                } else {
                    // Advance cursor:
                    cursor.moveToNext();
                    if (cursor.isAtHead()) {
                        // Reached end of list:
                        break;
                    }
                }
            }
        }
        // Return time left over after completing all tasks:
        return ms;
    }
    forEach(callback) {
        if (this.list.isEmpty()) return;

        const cursor = this.list.cursor();
        while (true) {
            callback(cursor.current());
            cursor.moveToNext();
            if (cursor.isAtHead()) break;
        }
    }
}


function dispatcher() {
    const parseFromInput = function (inputElement, cpusToAddProcessTo) {
        const rawInput = inputElement.value;
        const splitInput = rawInput.replaceAll(' ', ',').split(',');

        // Add all inputs (in groups of three):
        while (splitInput.length >= 3) {
            const name = splitInput.shift();
            const execTime = splitInput.shift();
            const priority = splitInput.shift();
            try {
                for (const cpu of cpusToAddProcessTo) {
                    cpu.add(new Process(name, execTime, priority));
                }
                message.textContent = '';
            } catch (error) {
                console.error('Failed to add process to cpus: ', error);
                message.textContent = 'Failed to add process to cpus: ' + error;
            }
        }

        // Clear added inputs:
        if (splitInput.length !== 0) {
            // Leave left over inputs (only 2 or less inputs but we need three)
            let leftOver = splitInput.length - 1;
            for (const input of splitInput) {
                leftOver += input.length;
            }
            inputElement.value = rawInput.slice(rawInput.length - leftOver);
        } else {
            inputElement.value = '';
        }
    };

    parseFromInput(cpuInputAll, Object.values(cpus));
    parseFromInput(cpu1Input, [cpus.cpu1]);
    parseFromInput(cpu2Input, [cpus.cpu2]);
    parseFromInput(cpu3Input, [cpus.cpu3]);
}

const cpus = {
    cpu1: new CPU1(),
    cpu2: new CPU2(),
    cpu3: new CPU3(),
};

function updateChartsAndListForCpu(cpuKey) {
    const cpu = cpus[cpuKey];

    const list = cpuProcessLists[cpuKey];
    {
        const children = list.children;
        let index = 0;
        const createListItem = function (process) {
            const div = document.createElement('div');
            div.classList.add('row');


            const name = document.createElement('span');
            name.classList.add('name');
            name.textContent = process.name;

            const time = document.createElement('span');
            time.classList.add('time');
            time.textContent = Math.round(process.remainingTime);

            const priority = document.createElement('span');
            priority.classList.add('priority');
            priority.textContent = process.priority;


            for (const element of [name, time, priority]) {
                element.classList.add('content-width-spacing');
                div.appendChild(element);
            }


            return div;
        };
        cpu.forEach(function (item) {
            while (children.length > index && children[index].querySelector('.name').textContent !== item.name) {
                // Incorrect name label => the dom node's process must have been removed => so remove the dom node:
                list.removeChild(children[index]);
            }
            const alreadyExists = children.length > index;
            if (alreadyExists) {
                // Update existing item
                const node = children[index];
                node.querySelector('.time').textContent = Math.round(item.remainingTime);
                node.querySelector('.priority').textContent = item.priority;
            } else {
                list.appendChild(createListItem(item));
            }
            index++;
        });

        // Remove any DOM nodes that we didn't use:
        while (children.length > index) {
            list.removeChild(children[index]);
        }
    }

    const cpuCharts = charts[cpuKey];
    const barChart = cpuCharts.bar;
    const pieChart = cpuCharts.pie;

    // For updating charts look at:
    // https://www.chartjs.org/docs/latest/developers/updates.html
    let removedSomeProcessesFromChart = false;
    for (const chart of [pieChart]) {
        const remainingTimeData = chart.data.datasets[0];

        const isPie = chart === pieChart;

        let index = 0;
        cpu.forEach(function (item) {
            while (chart.data.labels.length > index && chart.data.labels[index] !== item.name) {
                // Label doesn't match => we must have removed a process from the CPU queue => remove that process's data:
                chart.data.labels.splice(index, 1);
                remainingTimeData.data.splice(index, 1);
                remainingTimeData.backgroundColor.splice(index, 1);
                remainingTimeData.borderColor.splice(index, 1);

                removedSomeProcessesFromChart = true;
            }
            // `true` if we are reusing data from the last chart update:
            const alreadyExists = chart.data.labels.length > index;

            if (!alreadyExists) {
                chart.data.labels.push(item.name);
            }

            if (alreadyExists) {
                remainingTimeData.data[index] = item.remainingTime;
            } else {
                remainingTimeData.data.push(item.remainingTime);
            }

            let color = null;
            // Get a random color and ensure it is sensible:
            while (true) {
                if (color === null && alreadyExists) {
                    // Try keeping current color:
                    color = {
                        backgroundColor: remainingTimeData.backgroundColor[index],
                        borderColor: remainingTimeData.borderColor[index],
                    };
                } else {
                    color = randomChartColor();
                }

                // No other colors to compare to:
                if (remainingTimeData.backgroundColor.length === 0) break;

                if (index === 0) {
                    let colorAlreadyUsed = false;
                    for (let i = 1; i < remainingTimeData.backgroundColor.length; i++) {
                        if (remainingTimeData.backgroundColor[i] === color.backgroundColor) {
                            colorAlreadyUsed = true;
                            break;
                        }
                    }
                    // Try another color (first color should be unique):
                    if (isPie && colorAlreadyUsed) continue;
                } else {
                    // Don't use same color as the first data point (last and first item in pie charts are next to each other):
                    if (isPie && remainingTimeData.backgroundColor[0] === color.backgroundColor) continue;
                    // Don't use same color as the previous data point:
                    if (remainingTimeData.backgroundColor[index - 1] === color.backgroundColor) continue;
                }

                // We can probably use this color:
                break;
            }
            if (alreadyExists) {
                remainingTimeData.backgroundColor[index] = color.backgroundColor;
                remainingTimeData.borderColor[index] = color.borderColor;
            } else {
                remainingTimeData.backgroundColor.push(color.backgroundColor);
                remainingTimeData.borderColor.push(color.borderColor);
            }

            index++;
        });
        // Remove data for processes that no longer exists:
        if (chart.data.labels.length > index) {
            removedSomeProcessesFromChart = true;
        }
        chart.data.labels.splice(index);
        remainingTimeData.data.splice(index);
        remainingTimeData.backgroundColor.splice(index);
        remainingTimeData.borderColor.splice(index);


        // Make new arrays to prevent weird issue in "Chart.js" that causes UI animation to be reset:
        // chart.data.labels = chart.data.labels.slice();
        remainingTimeData.data = remainingTimeData.data.slice();
        // remainingTimeData.backgroundColor = remainingTimeData.backgroundColor.slice();
        // remainingTimeData.borderColor = remainingTimeData.borderColor.slice();

        if (removedSomeProcessesFromChart) {
            // Update without animation:
            chart.update('none');
            chart.update('resize');
        } else {
            chart.update();
        }
    }

    // Copy colors and other stuff for bar chart from the pie chart's data:
    {
        barChart.data.labels = pieChart.data.labels.slice();

        const barTimeData = barChart.data.datasets[0];
        const pieTimeData = pieChart.data.datasets[0];

        barTimeData.data = pieTimeData.data.slice();
        barTimeData.backgroundColor = pieTimeData.backgroundColor.slice();
        barTimeData.borderColor = pieTimeData.borderColor.slice();

        if (removedSomeProcessesFromChart) {
            // Update without animation:
            barChart.update('none');
            barChart.update('resize');
        } else {
            barChart.update();
        }
    }
}

let workPerCycle = 100;
function scheduler() {
    /*
    for (const cpuKey of Object.keys(cpus)) {
        const timeLeftAfterCompletingTasks = cpus[cpuKey].work(workPerCycle);
        const isBusy = timeLeftAfterCompletingTasks !== workPerCycle;
        if (isBusy) {
            // Did some work on queued tasks, so update the charts for this cpu:
            updateChartsForCpu(cpuKey);
        }
    }
    */


    const isCpu1Busy = cpus.cpu1.work(workPerCycle) !== workPerCycle;
    if (isCpu1Busy) {
        updateChartsAndListForCpu('cpu1');
    }
    cpu1Busy.textContent = isCpu1Busy ? 'Busy' : 'Available';
    cpu1Busy.classList.toggle('busy', isCpu1Busy);


    const isCpu2Busy = cpus.cpu2.work(workPerCycle) !== workPerCycle;
    if (isCpu2Busy) {
        updateChartsAndListForCpu('cpu2');
    }
    cpu2Busy.textContent = isCpu2Busy ? 'Busy' : 'Available';
    cpu2Busy.classList.toggle('busy', isCpu2Busy);


    const isCpu3Busy = cpus.cpu3.work(workPerCycle) !== workPerCycle;
    if (isCpu3Busy) {
        updateChartsAndListForCpu('cpu3');
    }
    cpu3Busy.textContent = isCpu3Busy ? 'Busy' : 'Available';
    cpu3Busy.classList.toggle('busy', isCpu3Busy);
}
setInterval(scheduler, 100);


// Update UI lists on load:
for (const key of Object.keys(cpus)) { updateChartsAndListForCpu(key); }