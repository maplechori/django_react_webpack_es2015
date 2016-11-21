import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay';
import Login   from './login.js'
import { createHashHistory } from 'history';
import { IndexRoute, Route, Router, applyRouterMiddleware, browserHistory, Link } from 'react-router'
import useRelay from 'react-router-relay'

import auth from './auth'
import App from './app'


function requireAuth(nextState, replace) {
    if (!auth.loggedIn()) {
        replace({
            pathname:'/login',
            state: {nextPathname: '/'}
        })
    }
}


Relay.injectNetworkLayer(
   new Relay.DefaultNetworkLayer('/graphql', {
     get headers() {
       return {
         Authorization: 'Bearer ' + localStorage.token
       }
     }
   })
 )



const AppQueries = {

          viewer: (Component) => Relay.QL`
              query {
                viewer {
                    ${Component.getFragment('viewer')}
                    }
            }`,
        };


class Dashboard extends React.Component {
          render() {
            return(<div>
              {localStorage.token ? <li>o<Link to="logout">Logout</Link>o</li> : <li>o<Link to="login">Login</Link>o</li>}
            Welcome to the app!</div>)
          }
        }

const DashboardRelay = Relay.createContainer(Dashboard, {
  initialVariables: {
    pageSize: 10,
    cursor: null,
    },

    fragments: {
      viewer: () => Relay.QL`
         fragment on SurveyQuery {
              sections( first: $pageSize, after: $cursor,  ) {
                       edges {
                         node {
                           totalCount
                            id
                            name
                            survey(first: $pageSize) {
                                   edges {
                                     node {
                                       name
                                     }
                                   }
                            }
                         }
                         cursor
                       }
                       pageInfo {
                          hasNextPage
                          hasPreviousPage
                          startCursor
                          endCursor
                       }
                     }
                   }
                  `,
  }
});


ReactDOM.render(
      <Router
      environment={Relay.Store}
      history={browserHistory}
      render={applyRouterMiddleware(useRelay)}>
            <Route path="/" component={App} queries={AppQueries}>
              <IndexRoute component={DashboardRelay} onEnter={requireAuth} queries={AppQueries}/>
              <Route path="login" component={Login} queries={AppQueries}/>
              <Route path="logout" component={(() => (delete localStorage.token && null))}/>
            </Route>
       </Router>,
      document.getElementById('react-app'))
