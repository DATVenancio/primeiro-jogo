    export default function createGame(){
                var playerIdTransition = ""
                var playerPointsTransition = ""
                var player1Points = 0
                var player1Id ="xxxxx"
                var player2Points = 0
                var player2Id = "xxxxx"
                


                const state = {
                    players: {},
                    fruits: {},
                    
                }
                const screenSize={
                        width:20,
                        height:18
                    }

                
                
                const observers = []

                function start() {
                    
                    const frequencyFruits = 2000
                    const frequencyPoints = 1000

                    setInterval(addFruit, frequencyFruits)

                    setInterval(gamePoints,frequencyPoints)


                }
                
                function gamePoints(){
                    
                    for( const playerId in state.players ){
                        
                        const player = state.players[playerId]

                        if(player.points>player1Points && playerId == player1Id){
                            player1Points = player.points
                        }
                        else if(player.points>player1Points &&  playerId != player1Id){
                            
                            player2Points = player1Points
                            player2Id =player1Id

                            player1Points = player.points
                            player1Id = playerId
                        }

                        else if(player.points>player2Points && playerId == player2Id){
                            player2Points = player.points
                        }
                        else if(player.points>player2Points &&  playerId!=player1Id && playerId != player2Id ){
                            
                            player2Points = player.points
                            player2Id = playerId
   
                        }


                    }
                    

                    notifyAll({
                                        type: 'game-points',
                                        player1Id: player1Id,
                                        player1Points: player1Points,
                                        player2Id: player2Id,
                                        player2Points: player2Points
                                    })
                }

                function subscribe(observerFunction) {
                    observers.push(observerFunction)
                }

                function notifyAll(command) {
                    for (const observerFunction of observers) {
                        observerFunction(command)
                    }
                }

                
                function setState(newState){
                    Object.assign(state, newState)
                }


                

                function addFruit(command) {
                    const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000)
                    const fruitX = command ? command.fruitX : Math.floor(Math.random() * screenSize.width)
                    const fruitY = command ? command.fruitY : Math.floor(Math.random() * screenSize.height)

                    state.fruits[fruitId] = {
                        x: fruitX,
                        y: fruitY
                    }

                    notifyAll({
                        type: 'add-fruit',
                        fruitId: fruitId,
                        fruitX: fruitX,
                        fruitY: fruitY
                    })
                }

                function removeFruit (command){
                    const fruitId = command.fruitId

                    delete state.fruits[fruitId]
                    notifyAll({
                        type: 'remove-fruit',
                        fruitId : fruitId
                    })
                }







                function addPlayer(command){
                    
                    const playerId = command.playerId
                    const playerX = "playerX" in command? command.playerX : Math.floor(Math.random() * screenSize.width)
                    const playerY = "playerY" in command? command.playerY : Math.floor(Math.random() * screenSize.height)
                    const playerPoints = 0;

                    state.players[playerId] = {
                        x: playerX,
                        y: playerY,
                        points: playerPoints
                    }
                    notifyAll({
                        type: 'add-player',
                        playerId: playerId,
                        playerX: playerX,
                        playerY: playerY,
                        playerPoints: playerPoints
                    })
                }

                function removePlayer (command){
                    const playerId = command.playerId

                    delete state.players[playerId]

                    notifyAll({
                        type: 'remove-player',
                        playerId : playerId
                    })
                }



                function movePlayer(command){
                    notifyAll(command)

                    const aceptableMoves = {
                        ArrowUp(player){
                            if (player.y - 1 >= 0){
                                   player.y = player.y - 1
                            }
                        },
                        ArrowDown(player){
                            if (player.y + 1 < screenSize.height){
                                   player.y = player.y + 1
                            }
                        },
                        ArrowLeft(player){
                            if (player.x - 1 >= 0){
                                   player.x = player.x - 1
                            }
                        },
                        ArrowRight(player){
                            if (player.x + 1 < screenSize.width){
                                   player.x = player.x + 1
                            }
                        },
                    }
                    const keyPressed = command.keyPressed
                    const playerId = command.playerId
                    const player = state.players[command.playerId]
                    const moveFunction = aceptableMoves[keyPressed]
                    if(player && moveFunction){
                            moveFunction(player)
                            checkForFruitCollision(playerId)
                    }



                    function checkForFruitCollision(playerId){
                        
                            const player = state.players[playerId]

                            for(const fruitId in state.fruits){
                                const fruit = state.fruits[fruitId]
                                if(player.x == fruit.x && player.y == fruit.y){
                                    removeFruit ({fruitId : fruitId})

                                    
                                    player.points = player.points +1;
                                    notifyAll({
                                        type: 'add-point',
                                        playerPoints: player.points,
                                        playerId: playerId,
                                    })
                                }
                            }
                        
                    }
                    
                }

                
                return{
                    addPlayer,
                    removePlayer,
                    addFruit,
                    removeFruit,
                    movePlayer,
                    state,
                    setState,
                    subscribe,
                    observers,
                    start
                }


    }