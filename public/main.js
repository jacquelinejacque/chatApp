// public/main.js

const socket = io();

const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageContainer = document.getElementById('message-container');
const nameInput=document.getElementById('name-input')

const clientsTotal=document.getElementById('clients-total');

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total Clients: ${data}`;
});

socket.on('message', (message) => {
    const li = document.createElement('li');
    li.textContent = message;
    messages.appendChild(li);
    window.scrollTo(0, document.body.scrollHeight);
});

messageForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    sendMessage();
});

function sendMessage() {
    console.log(messageInput.value);
    const data={
        name:nameInput.value,
        message:messageInput.value,
        dateTime: new Date()
    };
    socket.emit('message',data)
}

socket.on('chat-message', (data) =>{
    console.log(data)
})