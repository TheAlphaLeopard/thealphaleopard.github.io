let isRecording = false;
let events = [];

document.getElementById('record').addEventListener('click', toggleRecording);
document.getElementById('play').addEventListener('click', playEvents);

function toggleRecording() {
    isRecording = !isRecording;
    if (isRecording) {
        events = [];
        document.getElementById('record').innerText = 'Stop Recording';
        document.addEventListener('mousemove', recordEvent);
        document.addEventListener('click', recordEvent);
        document.addEventListener('keypress', recordEvent);
    } else {
        document.getElementById('record').innerText = 'Record';
        document.removeEventListener('mousemove', recordEvent);
        document.removeEventListener('click', recordEvent);
        document.removeEventListener('keypress', recordEvent);
    }
}

function recordEvent(e) {
    const eventRecord = {
        type: e.type,
        time: Date.now(),
        x: e.clientX,
        y: e.clientY,
        key: e.key
    };
    events.push(eventRecord);
}

function playEvents() {
    if (events.length === 0) return;
    let startTime = events[0].time;
    let prevTime = startTime;

    for (let event of events) {
        let delay = event.time - prevTime;
        prevTime = event.time;

        setTimeout(() => {
            simulateEvent(event);
        }, event.time - startTime);
    }
}

function simulateEvent(event) {
    if (event.type === 'mousemove') {
        const simulatedEvent = new MouseEvent('mousemove', {
            clientX: event.x,
            clientY: event.y
        });
        document.dispatchEvent(simulatedEvent);
    } else if (event.type === 'click') {
        const simulatedEvent = new MouseEvent('click', {
            clientX: event.x,
            clientY: event.y
        });
        document.dispatchEvent(simulatedEvent);
    } else if (event.type === 'keypress') {
        const simulatedEvent = new KeyboardEvent('keypress', {
            key: event.key
        });
        document.dispatchEvent(simulatedEvent);
    }
}
