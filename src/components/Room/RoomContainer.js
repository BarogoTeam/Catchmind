import React, { Component } from 'react'
import SocketContext from '../Context/SocketContext';
import RoomContext from '../Context/RoomContext';

export class RoomContainer extends Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        const { roomId } = this.props.match.params;

        return (
            <SocketContext.SocketProvider>
                <RoomContext.RoomProvider roomId={roomId}>
                    console.log 찍어놓음!
                </RoomContext.RoomProvider>
            </SocketContext.SocketProvider>
        )
    }

}