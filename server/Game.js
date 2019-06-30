/*
 * Create a game with fixed members.
 *
 */

class Game {
    constructor(players) {
        this.state = {
            status: 'PLAYING',
            painter: '',
            answer: '',
            timeout: 120,
        }
    }

    addListeners(socket) {

    }


}

module.exports.default = Game;
