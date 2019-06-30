/*
 * Create a game with fixed members.
 *
 */

const _ = require('lodash');
const defaultWords = require('./defaultWords.js').default;

class Game {
    constructor(roomId, players, id2socket) {
        this.roomId = roomId;
        this.players = players;
        this.id2socket = id2socket;
        this.addListeners = this.addListeners.bind(this);

        _.forEach(id2socket, this.addListeners);
        this.initialize();
    }

    initialize() {
        this.state = {
            status: 'PLAYING',
            painter: _.sample(this.players),
            answer: _.sample(defaultWords),
        }

        console.log('game initialized');
        console.log(this.state);
    }

    addListeners(socket) {
        const player = this.players[socket.id];
        socket.on('chat-msg', (msg) => {
            const { answer, status, painter } = this.state;
            console.log('chat-msg 검열중...')
            if (player !== painter && msg.message === answer && status === 'PLAYING') {
                socket.emit('chat-msg', {name: '', message: `${player.name} 정답!`})
                socket.to(this.roomId).emit('chat-msg', {name: '', message: `${player.name} 정답!`})
            }
        })
    }


}

module.exports.default = Game;
