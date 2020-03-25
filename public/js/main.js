const chatForm = document.getElementById('chat-form')
const chatMessages =  document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

// get username and roomm from url
const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
});
console.log(username,room)

const socket = io();
// join chatroom
socket.emit('joinRoom',{username,room})

// Get room and users
socket.on('roomUsers',({room,users}) => {
    outputRoomName(room)
    outputUsers(users)
});

// Message from server
socket.on('message', message=>{
    console.log(message)
    outputMessage(message)
    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    // get message text
    const msg = e.target.elements.msg.value
    // emit message to server
    socket.emit('chatMessage',msg)
    // clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

// output message to DOM
const outputMessage = (message) =>{
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = ` <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}

// Add room name to DOM
const outputRoomName = (room) => {
    roomName.innerHTML = room;
}

//Add users to DOM
const outputUsers = (users) => {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}