import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Login from './login'
import App from './app'

function requireAuth(nextState, replace) {
    if (!auth.loggedIn()) {
        replace({
            pathname:'/app/login/',
            state: {nextPathname: '/app/'}
        })
    }
}




ReactDOM.render(<App />, document.getElementById('react-app'))
