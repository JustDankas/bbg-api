const { json } = require('express')
const express = require('express')
const app = express()
require('dotenv').config()
const http = require('http').createServer(app)
const io = require('socket.io')(http,{
    cors:{
        origin:'*'
    }
})
const cors = require('cors')

const db = require('./data')

// var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 8080;

// const cors_proxy = require('cors-anywhere');

// cors_proxy.createServer({
//     originWhitelist: [], // Allow all origins
//     requireHeader: ['origin', 'x-requested-with'],
//     removeHeaders: ['cookie', 'cookie2']
// }).listen(port, host, function() {
//     console.log('Running CORS Anywhere on ' + host + ':' + port);
// });

app.use(cors())
app.use(json())
app.use(express.urlencoded({extended:true}))



const apiRoute = require('./apiRoute')
app.use('/api',apiRoute)

io.on('connection',(socket)=>{
    console.log('new client connected!')

    socket.join(db.globalRoom)
    db.addUser(socket.id)

    socket.on('change-map-req',(map,cb)=>{
        socket.to(db.globalRoom).emit('change-map-res',map)
        db.setCurrentMap(map)
        cb()
    })

    // socket.on('ping-req',(x,y,cb)=>{
    //     if(db.grid[x][y]!=true){
    //         db.setGrid(x,y)
    //         socket.to(db.globalRoom).emit('ping-res',db.grid,{x,y})
    //         cb(db.grid)
    //     }else{
    //         cb(null)
    //     }

    // })

    socket.on('ping-req',(x,y,cb)=>{
        db.setPing(socket.id,{x,y})
        socket.to(db.globalRoom).emit('ping-res',db.grid)
        cb(db.grid)


    })

    socket.on('msg-req',(author,content,cb)=>{
        socket.to(db.globalRoom).emit('msg-res',author,content)
        cb()
    })

    socket.on('disconnect',()=>{
        console.log(socket.id+" disconnected!")
        db.removeUser(socket.id)
    })
})

// http.listen(5001,()=>{
//     console.log(`listening on port ${5001}`)
// })

http.listen(port,()=>{
    console.log(`listening on port ${port}`)
})