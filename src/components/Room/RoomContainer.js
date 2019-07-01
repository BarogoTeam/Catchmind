import React, { Component } from 'react'
import _ from 'lodash';
import SocketContext from '../Context/SocketContext';
import RoomContext from '../Context/RoomContext';

import styles from './RoomContainer.module.css'

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
                    <div
                        className={_.values(styles).join(' ')}
                    >
                        console.log 찍어놓음!
                    </div>
                </RoomContext.RoomProvider>
            </SocketContext.SocketProvider>
        )
    }

}