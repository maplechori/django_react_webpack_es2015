import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay';
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import utils from 'react-schema-form/lib/utils';
import { SchemaForm } from 'react-schema-form';
import DispatchFormMutation from './Mutations/DispatchFormMutation'

class QuestionFormComponent extends React.Component {
        state = { form: [], schema: {}, model: {} }

        constructor(props) {
          super(props);
        }

        componentWillMount()
        {
          let json_obj = JSON.parse(this.props.viewer.questionforms.edges[0].node.schemaJson);
          this.setState({schema: json_obj.schema, form: json_obj.form, });
        }

        onModelChange = (key, val) => {
            utils.selectOrSet(key, this.state.model, val);
            console.log(this.state.model);
        }

        onTouchTap = (e) => {

             let validationResult = utils.validateBySchema(this.state.schema, this.state.model);
             if (!validationResult.valid) {
                 this.setState({error: validationResult.error.message});
             } else {
                 //action.data = this.state.model;
                // this.setState({success: action.success});
                // FormActionCreators.submitForm(action);
                console.log(this.state.model);
                Relay.Store.commitUpdate(new DispatchFormMutation({viewer: this.props.viewer, qform: this.props.viewer.questionforms.edges[0].node, response_json: JSON.stringify(this.state.model)}));
              }
          }

          render() {

          return(<div>
                  <SchemaForm schema={this.state.schema} form={this.state.form} model={this.state.model} onModelChange={this.onModelChange}/>
                  <RaisedButton type="submit" label="submit" onClick={(e) => this.onTouchTap(e)} />
                  </div>)

                }
}

export default Relay.createContainer(QuestionFormComponent, {

        fragments: {
          viewer: () => Relay.QL`
          fragment on UserViewer {
              ${DispatchFormMutation.getFragment('viewer')}
              questionforms(first: 10) {
              edges {
                node {
                  id
                  schemaJson
                  ${DispatchFormMutation.getFragment('qform')}
                }
              }
          }
        }`,
      }
});
