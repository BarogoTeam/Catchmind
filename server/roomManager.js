import { throws } from "assert";

export default class RoomManager {
    constructor(){
        this.room = new Map();
        
        this.config = {
            maxCapacity = 8
        }
    }

    joinUser(roomid,id){
        if(this.room.has(roomid)){
            let roomInfo = this.room.get(roomid);
            for(let i=0; i<this.config.maxCapacity; i++){
                if(roomInfo[i] === ''){
                    roomInfo[i] = id;
                    this.room.set(roomid, roomInfo)
                    return;
                }  
            }
        }{
            let roomInfo = [id];
            for(let i = 1; 1< this.config.maxCapacity; i++) roomInfo.push('')
            this.room.set(roomid,roomInfo)
        }
    }

    exitUser(roomid,id){
        if(!this.room.has(roomid))  return;
        
        let roomInfo = this.room.get(roomid);
        let emptycount = 0;
        for(let i=0; i<this.config.maxCapacity; i++){
            if(roomInfo[i] === ''){
                emptycount++;
            }
            else if(roomInfo[i] === id){
                roomInfo[i] = '';
                emptycount++;
                return;
            }
        }
        
        if(emptycount === this.config.maxCapacity){
            this.room.delete(roomid);
        }
        else{
            this.room.set(roomid,roomInfo);
        }
    }

    nextDrawer(roomid,id) {
        if(!this.room.has(roomid))  return;
        
        let roomInfo = this.room.get(roomid);
        for(let i=0; i<this.config.maxCapacity; i++){
            if(roomInfo[i] !== id)  continue;

            for(let j=i+1; ; j++){
                if(roomInfo[j%this.config.maxCapacity] !== '')  
                    return roomInfo[j%this.config.maxCapacity];
            }
        }
        return '';
    }
}