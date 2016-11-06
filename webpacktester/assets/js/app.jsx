import React from 'react';
import Match from 'react-router/Match'
import Link from 'react-router/Link'
import Redirect from 'react-router/Redirect'
import Router from 'react-router/BrowserRouter'

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) // fake async
  },
  signout(cb) {
    this.isAuthenticated = false
    cb()
    setTimeout(cb, 100) // weird bug if async?
  }
}

const App = () => (
  <Router>
    {({ router }) => (
      <div>
        {fakeAuth.isAuthenticated ? (
          <p>
            Welcome! {' '}
            <button onClick={() => {
              fakeAuth.signout(() => {
                router.transitionTo('/')
              })
            }}>Sign out</button>
          </p>
        ) : (
          <p>You are not logged in.</p>
        )}
        <ul>
          <li><Link to="/public">Public Page</Link></li>
          <li><Link to="/protected">Protected Page</Link></li>
        </ul>
      </div>
    )}
  </Router>
)
export default App;
