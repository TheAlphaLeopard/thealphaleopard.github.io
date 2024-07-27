let events = [];

document.getElementById('record').addEventListener('click', toggleRecording);
document.getElementById('play').addEventListener('click', playEvents);

function toggleRecording() {
    if (events.length === 0) {
        rrweb.record({
            emit(event) {
                events.push(event);
            },
        });
        document.getElementById('record').innerText = 'Stop Recording';
    } else {
        document.getElementById('record').innerText = 'Record';
    }
}

function playEvents() {
    if (events.length === 0) return;

    const replayer = new rrweb.Replayer(events);
    replayer.play();
}
