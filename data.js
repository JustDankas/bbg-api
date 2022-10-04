const initialGrid = new Array(100).fill(0).map(x=>new Array(100).fill(false))
class DB{
    constructor(){
        this.currentMap = {
            "name":"Deston",
            "link":"https://i.imgur.com/87cZs0R.png"
        }

        this.globalRoom = "uganda"

        this.grid = initialGrid

        this.users = []
        
    }

    getCurrentMap(){
        return this.currentMap
    }

    setCurrentMap(map){
        this.currentMap = map
    }

    clearGrid(){
        this.grid = initialGrid
    }

    setGrid(x,y){
        this.grid[x][y] = true
        setTimeout(() => {
            this.grid[x][y] = false
        }, 3000);
    }

    setPing(userId,ping){
        const usrIndex = this.users.findIndex(x=>x.id === userId)
        console.log('userId',userId)
        console.log(this.users,usrIndex)
        if(usrIndex>-1){
            const prevPing = this.users[usrIndex].ping
            this.users[usrIndex].ping = ping
            this.grid[prevPing.x][prevPing.y] = false
            this.grid[ping.x][ping.y] = true
           
        }
    }

    addUser(userId){
        this.users.push({
            id:userId,
            ping:{
                x:0,
                y:0
            }
        })
    }

    removeUser(userId){
        const {ping} = this.users.find(usr=>usr.id === userId)
        this.users = this.users.filter(user=>user.id!==userId)
        if(ping){
            this.grid[ping.x][ping.y] = false
        }
    }

    
}
const db = new DB()
module.exports = db