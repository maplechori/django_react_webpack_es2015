import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay';
import Login   from './login.js'
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
          viewer: () => Relay.QL`
              query {
                  viewer
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
                     
                     <StatusIndicator question={this.props.viewer.questions.edges[0].node}/>
                     <Question viewer={this.props.viewer} types={this.props.qtype}/>
                    </div>
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
         fragment on UserNode {
              questions(first: 10000) {
                edges {
                  node {
                ${StatusIndicator.getFragment('question')}
              }
            }
          }
              ${Question.getFragment('viewer')}
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
              <IndexRoute component={Dashboard} onEnter={requireAuth} queries={AppQueries}/>
              <Route path="login" component={Login} queries={AppQueries}/>
              <Route path="logout" component={(() => (delete localStorage.token && null))}/>
            </Route>
       </Router>,
      document.getElementById('react-app'))
