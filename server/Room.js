const _ = require('lodash');
const Haikunator = require('haikunator');
const haikunator = new Haikunator();

const Game = require('./Game').default;

class Room {
    constructor(roomId) {
        this.id = roomId;
        this.id2socket = {};
        this.game = null;
        this.state = {
            players: {},
            status: 'WAITING', // WATING => CLOSED
            createdAt: new Date(),
        }
    }

    setState(nextState) {
        this.state = {
            ...this.state,
            ...nextState,
        }

        const randomSocket = _.find(this.id2socket);
        if (!randomSocket) return;
        this.notifyRoomState(randomSocket);
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
            const nextPlayers = {
                ...players,
                [socket.id]: {
                    ...player,
                    status: player.status === 'READY' ? 'NOT_READY' : 'READY',
                }
            }
            this.setState({
                players: nextPlayers,
            });

            socket.to(this.id).emit('chat-msg', {name: '', message: `${this.id}에서 ${player.name}이 준비했습니다.`})
            socket.emit('chat-msg', {name: '', message: `${this.id}에서 ${player.name}이 준비했습니다.`})
        if (_.size(nextPlayers) === 2 && _.every(nextPlayers, ['status', 'READY'])) {
                console.log('All of us are ready, lets start a game!');
                this.startGame();
            }
        })
    }

    startGame() {
        const { players } = this.state;

        this.game = new Game(this.roomId, players, this.id2socket);
        this.setState({
            status: 'CLOSED',
        });
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
