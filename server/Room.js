const _ = require('lodash');
const Haikunator = require('haikunator');
const haikunator = new Haikunator();

class Room {
    constructor(roomId) {
        this.id = roomId;
        this.players = {};
        this.id2socket = {};
        this.game = null;
    }

    addListeners(socket) {
        socket.on('disconnect', () => {
            const player = this.players[socket.id];
            socket.to(this.id).emit('chat-msg', {name: '', message: `${this.id}에서 ${player.name}이 퇴장했습니다.`})
            this.notifyPlayers(socket);

            delete this.id2socket[socket.id];
            delete this.players[socket.id];
        })

        socket.on('chat-msg', (msg) => {
            msg.id = socket.client.id;
            socket.to(this.id).emit('chat-msg', msg)
        })

        socket.on('ready', (msg) => {
            const player = this.players[socket.id];
            this.players = {
                ...this.players,
                [socket.id]: {
                    ...player,
                    status: player.status === 'READY' ? 'NOT_READY' : 'READY',
                }
            }

            if (_.every(this.players, ['status', 'READY'])) {
                console.log('All of us are ready, lets start a game!');
                socket.to(this.id).emit('chat-msg', {name: '', message: `${this.id}에서 ${player.name}이 준비했습니다.`})
                socket.emit('chat-msg', {name: '', message: `${this.id}에서 ${player.name}이 준비했습니다.`})
                this.notifyPlayers(socket);
            } else {
                socket.to(this.id).emit('chat-msg', {name: '', message: `${this.id}에서 ${player.name}이 준비했습니다.`})
                socket.emit('chat-msg', {name: '', message: `${this.id}에서 ${player.name}이 준비했습니다.`})
                this.notifyPlayers(socket);
            }
        })
    }

    notifyPlayers(socket) {
        socket.emit('update-players', this.players);
        socket.to(this.id).emit('update-players', this.players);
    }

    join(socket) {
        this.addListeners(socket);
        this.id2socket[socket.id] = socket;
        const player = {
            socketId: socket.id,
            name: haikunator.haikunate(),
            status: 'NOT_READY',
        };
        this.players[socket.id] = player;
        socket.join(this.id);
        socket.to(this.id).emit('chat-msg', {name: '', message: `${this.id} 에 접속`})
        this.notifyPlayers(socket);
    }
}

module.exports.default = Room;
