import React from 'react';
import Relay  from 'react-relay'
import SmartTable from './SmartTable/SmartTable.jsx'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import TextField from 'material-ui/TextField'
import { SchemaForm } from 'react-schema-form'
import RaisedButton from 'material-ui/RaisedButton'
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
    this._onChange = this._onChange.bind(this);
    this.onChangeSchema = this.onChangeSchema.bind(this);
    this.onChangeForm = this.onChangeForm.bind(this);
}

  requireAuth() {

  }

  handleSelection(key)
  {
    console.log(this, key);
  }

  componentWillMount() {

    this.setState({
                      formValue : JSON.stringify([
                        {
                          "key": "comments",
                          "add": "New",
                          "style": {
                            "add": "btn-success"
                          },
                          "items": [
                            "comments[].name"
                          ]
                        }
                      ]),

      schemaValue : JSON.stringify({
        "type": "object",
        "title": "Comment",
        "required": [
          "comments"
        ],
        "properties": {
          "comments": {
            "type": "array",
            "maxItems": 2,
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "title": "Name",
                  "type": "string"
                }
              },
              "required": [
                "name"
              ]
            }
          }
        }
      })

  });

}

onChangeSchema(event) {

  this.setState({schemaValue: event.target.value})


}

onChangeForm(event) {

  this.setState({formValue: event.target.value})

}

  _onChange() {

        this.setState({schema: JSON.parse(this.state.schemaValue), form: JSON.parse(this.state.formValue)});
  }


  render() {

    return (<div>
    <MuiThemeProvider>
      <div>
        <SmartTable { ...{ tableHeaders, data: this.props.viewer.sections,
                          limit: 10, false, relay: this.props.relay, onRowSelection: this.handleSelection,
                          totalPages: Math.ceil(this.props.viewer.sections.edges[0].node.totalCount/10) } } />

        {/*<TextField id="schemaID" value={this.state.schemaValue}
   multiLine={true} onChange={this.onChangeSchema}
   rows={5}
   rowsMax={500}/>

  <TextField id="formID" value={this.state.formValue}
   multiLine={true} onChange={this.onChangeForm}
   rows={5}
   rowsMax={500}/>

   <RaisedButton onClick={this._onChange}/>

   {this.state.schema ?
      <SchemaForm schema={this.state.schema} form={this.state.form} model={this.props.model} onModelChange={this.props.onModelChange} /> : null}*/}

      <div id="container">
     
             {this.props.children}
           </div>
</div>
      </MuiThemeProvider>
   </div>)
  }
}


export default Relay.createContainer(Surveys, {

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
