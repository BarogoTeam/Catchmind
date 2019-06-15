import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import {First} from './components/First';
import {Home} from './components/Home';
import {Second} from './components/Second';
import {Third} from './components/Third';

ReactDOM.render(
    <Router>
        <div>
            <Route exact path="/" component={Home} />
            <Route path="/first" component={First} />
            <Route path="/second" component={Second} />
            <Route path="/third" component={Third} />
        </div>
    </Router>,
    document.getElementById('root')
)