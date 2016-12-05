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
    fragment on AddQuestionPayload   @relay(pattern: true)  {
      viewer {
        id
      }
       questionEdge


    }
  `;
}

getConfigs () {
  return [{
            type : "RANGE_ADD",
            parentName : "viewer",
            parentID : this.props.viewer.id,
            connectionName : "questions",
            edgeName : "questionEdge",
            rangeBehaviors : {
                '' : 'append',

            }
        }]
}

static fragments = {
     viewer : () => Relay.QL`
         fragment on UserNode {
            id
         }
     `
   }

}



export default AddQuestionMutation;
