import Relay from 'react-relay';

class DispatchFormMutation extends Relay.Mutation {



getMutation () {
  return Relay.QL`mutation { dispatchForm }`;
}


getVariables () {
  return {
    responseJson: this.props.response_json,
    qformId: this.props.qform.id,
  };
}



getFatQuery () {
  return Relay.QL`
    fragment on DispatchFormPayload  @relay(pattern: true)  {
      viewer {
        id
      }
      questionForm {
          id
          responseJson
      }

    }
  `;
}

getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        questionForm: this.props.qform.id,
      },
    }];
  }


  static fragments = {
       viewer : () => Relay.QL`
       fragment on  UserViewer {
              id
           }`,
       qform: () => Relay.QL`
         fragment on QuestionForm {
               id
               name
               type
               schemaJson
         }`
       }
}



export default DispatchFormMutation;
