let isRecording = false;
let events = [];
let startTime = 0;

document.getElementById('record').addEventListener('click', toggleRecording);
document.getElementById('play').addEventListener('click', playEvents);

function toggleRecording() {
    if (!isRecording) {
        events = [];
        startTime = Date.now();
        isRecording = true;
        document.getElementById('record').innerText = 'Stop Recording';
        document.addEventListener('mousemove', recordEvent);
        document.addEventListener('click', recordEvent);
        document.addEventListener('keypress', recordEvent);
    } else {
        isRecording = false;
        document.getElementById('record').innerText = 'Record';
        document.removeEventListener('mousemove', recordEvent);
        document.removeEventListener('click', recordEvent);
        document.removeEventListener('keypress', recordEvent);
    }
}

function recordEvent(e) {
    const eventRecord = {
        type: e.type,
        time: Date.now() - startTime,
        x: e.clientX,
        y: e.clientY,
        key: e.key,
        button: e.button
    };
    events.push(eventRecord);
}

function playEvents() {
    if (events.length === 0) return;
    const cursor = document.getElementById('cursor');
    cursor.style.display = 'block';

    let startTime = Date.now();

    events.forEach(event => {
        setTimeout(() => {
            if (event.type === 'mousemove') {
                cursor.style.left = event.x + 'px';
                cursor.style.top = event.y + 'px';
            } else if (event.type === 'click') {
                cursor.style.left = event.x + 'px';
                cursor.style.top = event.y + 'px';
                const simulatedEvent = new MouseEvent('click', {
                    clientX: event.x,
                    clientY: event.y,
                    button: event.button,
                    bubbles: true,
                    cancelable: true
                });
                document.elementFromPoint(event.x, event.y).dispatchEvent(simulatedEvent);
            } else if (event.type === 'keypress') {
                const simulatedEvent = new KeyboardEvent('keypress', {
                    key: event.key,
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(simulatedEvent);
            }
        }, event.time);
    });

    setTimeout(() => {
        cursor.style.display = 'none';
    }, events[events.length - 1].time + 1000);
}
