import React, { Component } from 'react'
import SocketContext from './SocketContext';

class RoomProvider extends Component {
    static consume = InnerComponent => props => (
        <SocketContext.Consumer>
            {socketStore => (
                <InnerComponent
                    {...props}
                    socketStore={socketStore}
                />
            )}
        </SocketContext.Consumer>
    );

    constructor() {
        super();
        this.state = {

        };

        this.sendMessage = this.sendMessage.bind(this);
        this.handleReceiveMessage = this.handleReceiveMessage.bind(this);
        this.getPlayers = this.getPlayers.bind(this);
    }

    componentDidMount() {
        const { socketStore, roomId } = this.props;
        const { socket } = socketStore;

        socket.emit('join-room', { roomId });
        // register event handlers related with room context.

        socket.on('chat-msg', this.handleReceiveMessage);

        this.sendMessage('na wat da')
        this.getPlayers();
        this.ready();
    }

    componentWillUnmount() {
        const { socketStore, roomId } = this.props;
        const { socket } = socketStore;
        socket.emit('exit-room', { roomId });
    }

    handleReceiveMessage(msg) {
        console.log(msg)
    }

    sendMessage(content) {
        const { socketStore, roomId } = this.props;
        const { socket } = socketStore;

        socket.emit('chat-msg', { roomId, content})
    }

    getPlayers() {
        const { socketStore, roomId } = this.props;
        const { socket } = socketStore;

        socket.emit('get-players', { roomId }, players => {
            console.log(players);
        })
    }

    ready() {
        const { socketStore, roomId } = this.props;
        const { socket } = socketStore;

        socket.emit('ready', { roomId }, players => {
            console.log(players);
        })
    }

    render() {
        const { id, players } = this.state;
        const { children } = this.props;
        const { sendMessage } = this;

        const roomStore = {
            id,
            players,
            sendMessage,
        };

        return (
            <RoomContext.Provider value={roomStore}>
                {children}
            </RoomContext.Provider>
        );
    }
}


const context = React.createContext();

export default class RoomContext {
  static Provider = context.Provider;

  static Consumer = context.Consumer;

  static RoomProvider = RoomProvider.consume(RoomProvider);
}
