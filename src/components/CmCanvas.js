import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export class CmCanvas extends Component{
    constructor(props) {
        super(props);
        this.state={
            isDown: false,
            previousPointX:'',
            previousPointY:''
        }
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }
    render() {
        return (
            <div>
                <canvas id="canvas" ref="canvas"
                    width={640}
                    height={425}
                    onMouseDown={
                        e => {
                            let nativeEvent = e.nativeEvent;
                            this.handleMouseDown(nativeEvent);
                        }}
                    onMouseMove={
                        e => {
                            let nativeEvent = e.nativeEvent;
                            this.handleMouseMove(nativeEvent);
                        }}
                    onMouseUp={
                        e => {
                            let nativeEvent = e.nativeEvent;
                            this.handleMouseUp(nativeEvent);
                        }}
                />
            </div>
        );
    }

    handleMouseDown(event){
        console.log(event);
        this.setState({
            isDown: true,
            previousPointX:event.offsetX,
            previousPointY:event.offsetY
        })
    }
    handleMouseMove(event){
        if(!this.state.isDown) return;

        const canvas = ReactDOM.findDOMNode(this.refs.canvas);
        let x = event.offsetX;
        let y = event.offsetY;
        let ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineWidth = event.which === 1 ? 10 : 30;
        ctx.moveTo(this.state.previousPointX, this.state.previousPointY);
        ctx.lineTo(x, y);
        ctx.stroke();

        this.setState({
            previousPointX:event.offsetX,
            previousPointY:event.offsetY
        });
    }
    handleMouseUp(event){
        this.setState({
            isDown: false
        });

        const canvas = ReactDOM.findDOMNode(this.refs.canvas);
        let x = event.offsetX;
        let y = event.offsetY;
        let ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineWidth = event.which === 1 ? 10 : 30;
        ctx.moveTo(this.state.previousPointX, this.state.previousPointY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    componentDidMount() {
        const canvas = ReactDOM.findDOMNode(this.refs.canvas);
        canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = 'rgb(200,255,255)';
        ctx.fillRect(0, 0, 640, 425);
        ctx.fillStyle = 'rgb(0,0,0)';
    }
}