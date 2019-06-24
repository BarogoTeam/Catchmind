import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { First } from './First';
import { RoomContainer } from './Room/RoomContainer';


export default () => (
    <Router>
        <div>
            <Route exact path="/" component={First} />
            <Route path="/rooms/:roomId" component={RoomContainer} />
            {/* <Route path="/first" component={First} />
            <Route path="/second" component={Second} />
            <Route path="/third" component={Third} /> */}
        </div>
    </Router>
)