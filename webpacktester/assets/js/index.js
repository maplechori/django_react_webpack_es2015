import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay';
import Login from './login.js'
import { createHashHistory } from 'history';
import { IndexRoute, Route, Router, applyRouterMiddleware, browserHistory, Link } from 'react-router'
import useRelay from 'react-router-relay'
import poll from 'relay-decorators/lib/poll';
import Question from './QuestionCrud.js'
import Gauge from './Gauge/Gauge.js';
import auth from './auth'
import App from './app'
import AddQuestionMutation from './Mutations/AddQuestionMutation'
import StatusIndicator from './StatusIndicator'
import { RelayNetworkLayer, authMiddleware, urlMiddleware } from 'react-relay-network-layer';
import {indigo500, indigo700, redA200} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import QuestionForm from './QuestionForm'

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: indigo500,
        primary2Color: indigo700,
        accent1Color: redA200,
        pickerHeaderColor: indigo500,
    },
});


var requireAuth = (nextState, replace) => {

    if (!auth.loggedIn()) {

        replace({
            pathname:'/login',
            state: {nextPathname: '/'}
        })
    }


}

var logout = (nextState, replace) => {
    auth.logout()
    replace({
      pathname: '/',
      state: {nextPathname: '/'}
    })
}

Relay.injectNetworkLayer(new RelayNetworkLayer([

  authMiddleware({
    allowEmptyToken: true,
    token: (req) =>
    {
      return localStorage.token
    },

    tokenRefreshPromise: (req) => {

     if (localStorage.token === "undefined" || localStorage.token === undefined) {
       throw true;
     }

     console.log('[client.js] resolve token refresh', req);
     return fetch('/jwt-refresh/', { method: "POST",
                                     headers: { 'Content-Type': 'application/json' },
                                     body: '{"token" : "' + localStorage.token + '"}'
                                    })
       .then(res => res.json())
       .then(json => {
             auth.logout();
             localStorage.token = json.token
       })
       .catch(err => console.log('[client] ERROR can not refresh token', err));
   }
 })
], {disableBatchQuery: true}));


const AppQueries = {
          viewer: (Component) => Relay.QL`
              query {
                  viewer {
                      ${Component.getFragment('viewer')}
                  }
              }
            `,
             qtype: (Component) => Relay.QL`
                    query {
                      __type(name:"QuestionQuestionType") {
                        ${Component.getFragment('qtype')}
                      }
                    }`,
              };


class DashboardComponent extends React.Component {

          constructor(props) {
            super(props);
          }


          render() {
            return(<div>
              {localStorage.token && this.props.viewer != null ?

              <div>
              <MuiThemeProvider muiTheme={muiTheme}>
              <div>
                  <li><Link to="logout">Logout</Link></li>
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
                     <StatusIndicator question={this.props.viewer.questions.edges[0].node}/>
                     <Question viewer={this.props.viewer} types={this.props.qtype}/>
                     <QuestionForm viewer={this.props.viewer}/>
                </div>
             </div>
            </MuiThemeProvider>
            </div>
             : <div><Login viewer={this.props.viewer}/>
              </div>}
            </div>)
          }
  }

const Dashboard = Relay.createContainer(DashboardComponent, {

    fragments: {
      qtype: () => Relay.QL`
         fragment on __Type {
              enumValues { name description }
      } `,
      viewer: () => Relay.QL`
         fragment on UserViewer {
              id
              username
              ${QuestionForm.getFragment('viewer')}
              questions(first: 10000) {
                edges {
                  node {
                    ${StatusIndicator.getFragment('question')}
                  }
                }
              }
              ${Question.getFragment('viewer')}
        }`,
      }
});


ReactDOM.render(
      <Router
      environment={Relay.Store}
      history={browserHistory}
      forceFetch={true}
      render={applyRouterMiddleware(useRelay)}>
            <Route path="/" component={App} queries={AppQueries}>
              <IndexRoute component={Dashboard} queries={AppQueries}/>
              <Route path="logout" component={(() => (delete localStorage.token   && null))}/>
            </Route>
       </Router>,
      document.getElementById('react-app'))
