import React from 'react';
import Relay  from 'react-relay'
import SmartTable from './SmartTable/SmartTable.jsx'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

const tableHeaders =
[
  { alias: 'Identification', sortable: true, dataAlias: 'id', format: { type: 'status' } },
  { alias: 'Name of Section', sortable: true, dataAlias: 'name', format: { type: 'status' } },
  { alias: 'Seconday Name of Section', sortable: true, dataAlias: 'name', format: { type: 'status' } },
]


class Surveys extends React.Component {

  constructor(props) {
    super(props);
    this.handleSelection = this.handleSelection.bind(this);
  }

  handleSelection(key)
  {
    console.log(this, key);
  }

  render() {

    return (<div>
    <MuiThemeProvider>
      <div>
        <SmartTable { ...{ tableHeaders, data: this.props.viewer.sections,
                          limit: 10, false, relay: this.props.relay, onRowSelection: this.handleSelection,
                          totalPages: Math.ceil(this.props.viewer.sections.edges[0].node.totalCount/10) } } />
        </div>
      </MuiThemeProvider>
   </div>)
  }
}

class SurveysRoute extends Relay.Route {
  static queries = {

    viewer: (Component) => Relay.QL`
        query {
          viewer {
              ${Component.getFragment('viewer')}
              }
      }`,
  };

  static routeName = 'SurveysRoute';
}

var SurveysContainer = Relay.createContainer(Surveys, {

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




const App = () => (
      <div>
          <Relay.RootContainer Component={SurveysContainer}  route={new SurveysRoute()}/>,
      </div>
    )

export default App;
