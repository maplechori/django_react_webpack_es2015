import React from 'react';
import Relay  from 'react-relay'
import SmartTable from './SmartTable/SmartTable.jsx'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';


class Surveys extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {

    return (<div>
    <MuiThemeProvider>
      <div> 
        <SmartTable { ...{ tableHeaders, data: this.props.viewer.sections, limit: 5, false, relay: this.props.relay } } />
        </div>
      </MuiThemeProvider>
   </div>)
  }
}

class SurveysRoute extends Relay.Route {
  static queries = {
    surveys: () => Relay.QL`query { viewer }`,
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
    pageSize: 5 ,
    cursor: null,
    before_cursor: null,
    before_pageSize: null
  },

 fragments: {
     viewer: () => Relay.QL`
        fragment on SurveyQuery {

         sections( first: $pageSize,after: $cursor,  ) {

                        edges {
                          node {
                            totalCount
                             id
                             name
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
     surveys: () => Relay.QL`
       fragment on SurveyQuery {
       sections(first: $pageSize, after: $cursor) {

                     edges {
                       node {
                            totalCount
                          id
                          name
                          name
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

const tableHeaders =
[
  { alias: 'id', sortable: true, dataAlias: 'id', format: { type: 'status' } },
  { alias: 'name', sortable: true, dataAlias: 'name', format: { type: 'status' } },
    { alias: 'meh', sortable: true, dataAlias: 'name', format: { type: 'status' } },
]



const App = () => (
      <div>
          <Relay.RootContainer Component={SurveysContainer}  route={new SurveysRoute()}/>,
      </div>
    )

export default App;
