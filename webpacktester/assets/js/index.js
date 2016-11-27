import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay';
import Login   from './login.js'
import { createHashHistory } from 'history';
import { IndexRoute, Route, Router, applyRouterMiddleware, browserHistory, Link } from 'react-router'
import useRelay from 'react-router-relay'
import Dashboard from 'react-dazzle';
import poll from 'relay-decorators/lib/poll';
import Question from './QuestionCrud.js'
import Gauge from './Gauge/Gauge.js';

import auth from './auth'
import App from './app'
import 'react-dazzle/lib/style/style.css';


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

class Dashboard2 extends React.Component {



          render() {
            return(<div>
              {localStorage.token ? <li><Link to="logout">Logout</Link></li> : <li><Link to="login">Login</Link></li>}

              <div style={{textAlign: 'center', marginTop: '50px'}}>

              <div className="gauge-box">
                      <Gauge value={90}
                             size={10}
                             width={20}
                             sections={["#8cc152", "#ffb74d", "#ffb74d", "#e84528", "#e84528", "#e84528"]}
                             arrow={{height: 60, width: 6, color: "#ccc"}}
                             legend={['0Gb', '2Gb', '4Gb', '6Gb', '8Gb', '10Gb']}
                             label="90%"/>
                             </div>
                             <div className="gauge-box">
                     <Gauge value={35}
                            size={10}
                            radius={100}
                            width={20}
                            sections={["#8cc152", "#ffb74d", "#ffb74d", "#e84528", "#e84528", "#e84528"]}
                            arrow={{height: 60, width: 6, color: "#ccc"}}
                            legend={['0Gb', '2Gb', '4Gb', '6Gb', '8Gb', '10Gb']}
                            label="35%"/>
                    </div>
                    <div className="gauge-box">
                      <Gauge value={75}
                             size={10}
                             radius={100}
                             width={20}
                             sections={["#8cc152", "#ffb74d", "#ffb74d", "#e84528", "#e84528", "#e84528"]}
                             arrow={{height: 60, width: 6, color: "#ccc"}}
                             legend={['0Gb', '2Gb', '4Gb', '6Gb', '8Gb', '10Gb']}
                             label="35%"/>
                     </div>

                     <Question/>
                    </div>
            </div>)
          }
        }

const DashboardRelay = Relay.createContainer(Dashboard2, {
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
