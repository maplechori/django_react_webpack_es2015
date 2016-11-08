import React from 'react';
import Relay  from 'react-relay'



class Surveys extends React.Component {

  constructor(props) {
    super(props);


  }

  render() {

    return <div> <ul>{this.props.surveys.edges.map(edge => <li key={edge.node.id}>{edge.node.name}</li>)}</ul></div>;
  }
}

class SurveysRoute extends Relay.Route {
  static queries = {
    surveys: () => Relay.QL`query { surveys }`
  };

  static routeName = 'SurveysRoute';
}

var SurveysContainer = Relay.createContainer(Surveys, {
 fragments: {
     surveys: () => Relay.QL`
       fragment on SurveyConnection {
            edges {
               node {
                  id
                  name
               }
            }
       }
   `,
 }
});


const App = () => (

      <div>
        <Relay.RootContainer Component={SurveysContainer}  route={new SurveysRoute()}/>,

      </div>

)
export default App;
