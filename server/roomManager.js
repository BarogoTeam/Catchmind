const Room = require('./Room').default;

class RoomManager {
    constructor(){
        this.rooms = {};
    }

    addListeners(socket) {
        socket.on('join-room', (msg) => {
            this.rooms[msg.roomId] = this.rooms[msg.roomId] || new Room(msg.roomId);
            const room = this.rooms[msg.roomId];
            room.join(socket);
        })

        // socket.on('create-room', (msg) => {
        //     console.log('create room', msg)
        //     let roomId = new Date().getTime();
        //     socket.to(roomId).emit('chat-msg',{name:'',message:`${msg.roomId} 에 접속`})
        // })


        // socket.on('get-players', (msg, ack) => {
        //     console.log('get players', msg);
        //     const room = this.rooms[msg.roomId];

        //     ack(room.players);
        // })
    }

    // joinUser(roomid,id){
    //     if(this.room.has(roomid)){
    //         let roomInfo = this.room.get(roomid);
    //         for(let i=0; i<this.config.maxCapacity; i++){
    //             if(roomInfo[i] === ''){
    //                 roomInfo[i] = id;
    //                 this.room.set(roomid, roomInfo)
    //                 return;
    //             }
    //         }
    //     }{
    //         let roomInfo = [id];
    //         for(let i = 1; 1< this.config.maxCapacity; i++) roomInfo.push('')
    //         this.room.set(roomid,roomInfo)
    //     }
    // }

    // exitUser(roomid,id){
    //     if(!this.room.has(roomid))  return;

    //     let roomInfo = this.room.get(roomid);
    //     let emptycount = 0;
    //     for(let i=0; i<this.config.maxCapacity; i++){
    //         if(roomInfo[i] === ''){
    //             emptycount++;
    //         }
    //         else if(roomInfo[i] === id){
    //             roomInfo[i] = '';
    //             emptycount++;
    //             return;
    //         }
    //     }

    //     if(emptycount === this.config.maxCapacity){
    //         this.room.delete(roomid);
    //     }
    //     else{
    //         this.room.set(roomid,roomInfo);
    //     }
    // }

    // nextDrawer(roomid,id) {
    //     if(!this.room.has(roomid))  return;

    //     let roomInfo = this.room.get(roomid);
    //     for(let i=0; i<this.config.maxCapacity; i++){
    //         if(roomInfo[i] !== id)  continue;

    //         for(let j=i+1; ; j++){
    //             if(roomInfo[j%this.config.maxCapacity] !== '')
    //                 return roomInfo[j%this.config.maxCapacity];
    //         }
    //     }
    //     return '';
    // }
}

module.exports.default = new RoomManager();