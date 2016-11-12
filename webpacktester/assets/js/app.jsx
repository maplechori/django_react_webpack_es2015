import React from 'react';
import Relay  from 'react-relay'
import SmartTable from './SmartTable/SmartTable.jsx'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss';


class Surveys extends React.Component {

  constructor(props) {
    super(props);

    console.log(props);
  }

  render() {
    return (<div>
    <MuiThemeProvider>
      <SmartTable { ...{ tableHeaders, data, limit: 20, total: data.length, false } } />
    </MuiThemeProvider>

     <ul>{this.props.surveys.edges.map(edge => <li key={edge.node.id}>{edge.node.name}</li>)}</ul>
   </div>)
  }
}

class SurveysRoute extends Relay.Route {
  static queries = {
    surveys: () => Relay.QL`query { sections(first: 3) }`,
    viewer: () => Relay.QL`query { sections(orderBy: "name") }`
  };

  static routeName = 'SurveysRoute';
}

var SurveysContainer = Relay.createContainer(Surveys, {
 fragments: {
     viewer: () => Relay.QL`
          fragment on SectionConnection {
                   edges {
                     node {
                       id
                       name
                     }
                   }
          }
     `,
     surveys: () => Relay.QL`
       fragment on SectionConnection {
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

const tableHeaders = [
  { alias: 'Name', sortable: true, dataAlias: 'name', format: { type: 'status' } },
  { alias: 'Status', sortable: true, dataAlias: 'status', format: { type: 'status' } },
  { alias: 'Birth Date', sortable: true, dataAlias: 'birth_date', format: { type: 'date' } }]

let data = [
  { name: "John", status: "Single", birth_date: '1 Jan 1966' },
  { name: "David", status: "Married", birth_date: '5 Feb 1914' },
]



const App = () => (

      <div>
        <Relay.RootContainer Component={SurveysContainer}  route={new SurveysRoute()}/>,

      </div>

)
export default App;
