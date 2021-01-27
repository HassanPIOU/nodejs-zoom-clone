const express = require('express')
const app = express()
const path =  require('path')
const {v4 : uuidv4 } = require('uuid')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const {ExpressPeerServer} = require('peer')
const peerServer = ExpressPeerServer(server,{
    debug : true
})


//Middlewares
app.use('/peerjs',peerServer)
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,'./public')))

// Routes

app.get('/',(req,res) => {
    res.redirect(`/${uuidv4()}`)
})


app.get('/:room',(req,res) => {
    res.render('room',{roomId : req.params.room})
})



// Socket io
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId);
        // messages
        socket.on('message', (message) => {
            //send message to the same room
            io.to(roomId).emit('createMessage', message)
        });

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})



server.listen(3000,() => {
    console.log(`server is running `)
})