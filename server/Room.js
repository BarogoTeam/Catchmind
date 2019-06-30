const _ = require('lodash');
const Haikunator = require('haikunator');
const haikunator = new Haikunator();

class Room {
    constructor(socket, roomId) {
        this.id = roomId;
        this.id2socket = {};
        this.socket = socket;
        this.state = {
            players: {},
            game: null,
            status: 'WAITING', // WATING => CLOSED
        }
    }

    setState(state) {
        this.state = {
            ...this.state,
            ...state,
        }

        this.notifyRoomState(this.socket);
    }

    addListeners(socket) {
        socket.on('disconnect', () => {
            const { players } = this.state;
            const player = players[socket.id];
            socket.to(this.id).emit('chat-msg', {name: '', message: `${this.id}에서 ${player.name}이 퇴장했습니다.`})

            delete this.id2socket[socket.id];
            delete players[socket.id];
            this.setState({
                players: {
                    ...players,
                }
            })
        })

        socket.on('chat-msg', (msg) => {
            msg.id = socket.client.id;
            socket.to(this.id).emit('chat-msg', msg)
        })

        socket.on('ready', (msg) => {
            const { players } = this.state;
            const player = players[socket.id];
            this.setState({
                players: {
                    ...players,
                    [socket.id]: {
                        ...player,
                        status: player.status === 'READY' ? 'NOT_READY' : 'READY',
                    }
                }
            });

            if (_.every(players, ['status', 'READY'])) {
                console.log('All of us are ready, lets start a game!');
                socket.to(this.id).emit('chat-msg', {name: '', message: `${this.id}에서 ${player.name}이 준비했습니다.`})
                socket.emit('chat-msg', {name: '', message: `${this.id}에서 ${player.name}이 준비했습니다.`})
            } else {
                socket.to(this.id).emit('chat-msg', {name: '', message: `${this.id}에서 ${player.name}이 준비했습니다.`})
                socket.emit('chat-msg', {name: '', message: `${this.id}에서 ${player.name}이 준비했습니다.`})
            }
        })
    }

    notifyRoomState(socket) {
        socket.emit('update-room-state', this.state);
        socket.to(this.id).emit('update-room-state', this.state);
    }

    join(socket) {
        const { players } = this.state;
        this.addListeners(socket);
        this.id2socket[socket.id] = socket;
        const player = {
            socketId: socket.id,
            name: haikunator.haikunate(),
            status: 'NOT_READY',
        };
        socket.join(this.id);
        socket.to(this.id).emit('chat-msg', {name: '', message: `${this.id} 에 접속`})

        this.setState({
            players: {
                ...players,
                [socket.id]: player,
            }
        })
    }
}

module.exports.default = Room;
