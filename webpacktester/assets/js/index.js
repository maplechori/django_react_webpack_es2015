import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay';
import Login   from './login.js'
import { createHashHistory } from 'history';
import { IndexRoute, Route, Router, applyRouterMiddleware, browserHistory, Link } from 'react-router'
import useRelay from 'react-router-relay'


import App from './app'


function requireAuth(nextState, replace) {
    /*if (!auth.loggedIn()) {
        replace({
            pathname:'/app/login/',
            state: {nextPathname: '/app/'}
        })
    }*/
    console.log(nextState, replace);


}


Relay.injectNetworkLayer(
   new Relay.DefaultNetworkLayer('/graphql', {
     get headers() {
       return {
         Authorization: 'Bearer ' + localStorage.getItem('id_token')
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
              <li>o<Link to="login">Login</Link>o</li>
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
            <Route path="/" component={App} onEnter={requireAuth} queries={AppQueries}>
              <IndexRoute component={DashboardRelay} queries={AppQueries}/>
              <Route path="login" component={Login} queries={AppQueries}/>
            </Route>
       </Router>,
      document.getElementById('react-app'))
