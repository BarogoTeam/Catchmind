import React, { Component } from 'react'
import {CmCanvas} from "./Game/CmCanvas";

const INITIAL_TIME = 5;

export class First extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOn : false,
            time : INITIAL_TIME
        };
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
    }

    startTimer() {
        if(this.state.isOn) return;

        this.setState({
            time: INITIAL_TIME,
            isOn: true
        });
        this.timer = setInterval(() => {
            if(this.state.time === 0) {
                return this.stopTimer();
            }
            this.setState({
                time: this.state.time - 1
            })
        }, 1000);
    }
    stopTimer() {
        clearInterval(this.timer);
        this.setState({isOn : false});
    }

    render() {
        return (
            <div>
                <CmCanvas/>
                <h3>timer: {this.state.time}</h3>
                <button onClick={this.startTimer}>start</button>
                <button onClick={this.stopTimer}>stop</button>
            </div>
        )
    }
}