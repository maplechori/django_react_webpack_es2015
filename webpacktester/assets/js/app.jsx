import React from 'react';
import Relay  from 'react-relay'
import SmartTable from './SmartTable/SmartTable.jsx'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

const TableExampleSimple = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHeaderColumn>ID</TableHeaderColumn>
        <TableHeaderColumn>Name</TableHeaderColumn>
        <TableHeaderColumn>Status</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableRowColumn>1</TableRowColumn>
        <TableRowColumn>John Smith</TableRowColumn>
        <TableRowColumn>Employed</TableRowColumn>
      </TableRow>
      <TableRow>
        <TableRowColumn>2</TableRowColumn>
        <TableRowColumn>Randal White</TableRowColumn>
        <TableRowColumn>Unemployed</TableRowColumn>
      </TableRow>
      <TableRow>
        <TableRowColumn>3</TableRowColumn>
        <TableRowColumn>Stephanie Sanders</TableRowColumn>
        <TableRowColumn>Employed</TableRowColumn>
      </TableRow>
      <TableRow>
        <TableRowColumn>4</TableRowColumn>
        <TableRowColumn>Steve Brown</TableRowColumn>
        <TableRowColumn>Employed</TableRowColumn>
      </TableRow>
    </TableBody>
  </Table>
);

class Surveys extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (<div>
    <MuiThemeProvider>
      <div>
        <TableExampleSimple/>
        <SmartTable { ...{ tableHeaders, data: this.props.surveys, limit: 5, false, relay: this.props.relay } } />
        </div>
      </MuiThemeProvider>
   </div>)
  }
}

class SurveysRoute extends Relay.Route {
  static queries = {
    surveys: () => Relay.QL`query { sections }`,
    viewer: () => Relay.QL`query { sections }`,

  };

  static routeName = 'SurveysRoute';
}

var SurveysContainer = Relay.createContainer(Surveys, {
 fragments: {
     viewer: () => Relay.QL`
        query SectionConnection {

                totalCount


          }
     `,
     surveys: () => Relay.QL`
       fragment on SectionConnection {
                     edges {
                       node {
                          id
                          name
                       }
                       cursor
                     }
               pageInfo {
                  hasNextPage
                  hasPreviousPage
               }
             }
   `,
 }
});

const tableHeaders =
[
  { alias: 'ID', sortable: true, dataAlias: 'id', format: { type: 'status' } },
  { alias: 'Name', sortable: true, dataAlias: 'name', format: { type: 'status' } },
]



const App = () => (
      <div>
          <Relay.RootContainer Component={SurveysContainer}  route={new SurveysRoute()}/>,
      </div>
    )

export default App;
