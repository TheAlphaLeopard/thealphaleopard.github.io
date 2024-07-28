let isRecording = false;
let events = [];
let startTime = 0;
let playbackTimer = null;

document.getElementById('record').addEventListener('click', toggleRecording);
document.getElementById('play').addEventListener('click', playEvents);
document.addEventListener('keypress', stopPlayback);

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
    let startTime = Date.now();

    events.forEach(event => {
        setTimeout(() => {
            if (playbackTimer === null) return; // Playback stopped

            if (event.type === 'mousemove') {
                const simulatedEvent = new MouseEvent('mousemove', {
                    clientX: event.x,
                    clientY: event.y,
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(simulatedEvent);
            } else if (event.type === 'click') {
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

    playbackTimer = setTimeout(() => {
        playbackTimer = null;
    }, events[events.length - 1].time + 1000);
}

function stopPlayback(e) {
    if (e.key === '1' && playbackTimer !== null) {
        clearTimeout(playbackTimer);
        playbackTimer = null;
    }
}
