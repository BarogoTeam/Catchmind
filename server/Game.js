/*
 * Create a game with fixed members.
 *
 */

class Game {
    constructor(sockets) {
        this.state = {
            status: 'PLAYING',
            painter: '',
            answer: '',
            timeout: 120,
        }
    }


}

module.exports.default = Game;
