const socket = io('https://my-chat-app-sable.vercel.app/'); // Replace with your actual Vercel URL

const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

function appendMessage(message, isOwnMessage) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    if (isOwnMessage) {
        messageElement.style.backgroundColor = '#e0f7fa';
    }
    messageElement.textContent = message;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
    console.log('Message appended:', message);
}

sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim() !== '') {
        appendMessage(message, true);
        console.log('Sending message:', message);
        socket.emit('chat message', message);
        messageInput.value = '';
    }
});

messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});

socket.on('chat message', (msg) => {
    console.log('Message received from server:', msg);
    appendMessage(msg, false);
});
