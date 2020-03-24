import express from "express"
import http from "http"
import { Server } from "https"
import socketio from "socket.io"

import createGame from "./public/game.js"

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static("public"))


const game = createGame()
game.start()

game.subscribe((command) => {
    console.log(`> Emitting ${command.type}`)
    sockets.emit(command.type, command)
})


sockets.on("connection",(socket) =>{
    const playerId = socket.id
    console.log('PLayer connected on Server with id:'+playerId)

    game.addPlayer({playerId : playerId})

    socket.emit("setup",game.state)

    socket.on("disconnect",()=>{
        game.removePlayer({playerId: playerId})
        console.log('OUT:'+playerId)
    })
    socket.on("move-player",(command) => {
        command.playerId = playerId
        command.type = "move-player"

        console.log(game.state.players[playerId])

        game.movePlayer(command)
    })
    
    
    

   
})




server.listen(4000, () => {
    console.log("server listening on port 4000")
})