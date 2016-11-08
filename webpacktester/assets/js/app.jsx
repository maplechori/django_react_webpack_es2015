import React from 'react';
import Match from 'react-router/Match'
import Link from 'react-router/Link'
import Redirect from 'react-router/Redirect'
import Router from 'react-router/BrowserRouter'


class Surveys extends React.Component {
  render() {
    return <div>{this.props.surveys.name}</div>;
  }
}

class SurveysRoute extends Relay.Route {
  static queries = {
    surveys: () => Relay.QL`
      query { surveys(name: $surveyID) }`,
  }

  static paramDefinitions = {
    surveyID: {required: true},

  }

  static routeName = 'SurveysRoute';
}



SurveysContainer = Relay.createContainer(Surveys, {
 fragments: {
   surveys: () => Relay.QL`
     fragment on Surveys {
       name
     }
   `,
 }
});


const App = () => (
  <Router>
    {({ router }) => (
      <div>
        <Relay.RootContainer  Component={Surveys}  route={SurveysRoute}
    />,
        <ul>
          <li><Link to="/public">Public Page</Link></li>
          <li><Link to="/protected">Protected Page</Link></li>
        </ul>
      </div>
    )}
  </Router>
)
export default App;
