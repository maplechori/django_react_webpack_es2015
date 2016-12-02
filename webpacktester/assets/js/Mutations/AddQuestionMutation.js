import Relay from 'react-relay';

class AddQuestionMutation extends Relay.Mutation {

getMutation () {
  return Relay.QL`mutation { addQuestion }`;
}


getVariables () {
  return {
    name: this.props.name,
    questionType: this.props.questionType,
    dataLabel: this.props.dataLabel,
    questionText: this.props.questionText
  };
}

getFatQuery () {
  return Relay.QL`
    fragment on AddQuestionPayload {

        question {
          id
          name
        }
        ok
    }
  `;
}

getConfigs () {

  return [{
    type: 'FIELDS_CHANGE',
    fieldIDs: {
      question: this.props.id
    }
  }];
}

static  fragments = {
    
}


}

export default AddQuestionMutation;
