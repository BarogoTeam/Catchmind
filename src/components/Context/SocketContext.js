import React, { Component } from 'react'
import io from 'socket.io-client'

class SocketProvider extends Component {
    static consume = InnerComponent => props => (
        <InnerComponent
            {...props}
        />
    );

    constructor() {
        super();
        this.state = {

        }
    }

    componentDidMount() {
        this.setState({
            socket: io('http://localhost:3001'),
        });
    }

    componentWillUnmount() {
        const { socket } = this.state;
        socket.close();
    }

    render() {
        const { socket } = this.state;
        const { children } = this.props;

        if (!socket) return null;

        const socketStore = {
            socket,
        };

        return (
            <SocketContext.Provider value={socketStore}>
                {children}
            </SocketContext.Provider>
        );
    }
}


const context = React.createContext();

export default class SocketContext {
  static Provider = context.Provider;

  static Consumer = context.Consumer;

  static SocketProvider = SocketProvider.consume(SocketProvider);
}
