const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server);
const port = process.env.PORT || 3000

// set static folder
app.use(express.static(path.join(__dirname,'public')))

const botName = "Chatbot"

// run when a client connects
io.on('connection',socket => {
    // welcome current user
    socket.emit('message',formatMessage(botName,'welcome to chatcord!'))

    // broadcast when a user connects
    socket.broadcast.emit('message',formatMessage(botName,"A user has joined the chat"));

    // Runs when client disconnects
    socket.on('disconnect',() => {
      io.emit('message',formatMessage(botName,'A User has left the chat'))
    })
    // listen for chatMessage
    socket.on('chatMessage',(msg)=>{
      io.emit('message',formatMessage('USER',msg))
    })

})

server.listen(port,()=>{
    console.log(`server running on port  ${port}`)
})