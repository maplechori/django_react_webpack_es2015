import Relay from 'react-relay';

class DeleteQuestionMutation extends Relay.Mutation {



getMutation () {
  return Relay.QL`mutation { deleteQuestion }`;
}


getVariables () {
  return {
    id: this.props.question.id
  };
}



getFatQuery () {
  return Relay.QL`
    fragment on DeleteQuestionPayload   @relay(pattern: true)  {
      viewer {
        id
      }
       questionId


    }
  `;
}

getConfigs () {
  return [{
            type : "NODE_DELETE",
            parentName : "viewer",
            parentID : this.props.viewer.id,
            connectionName : "questions",
            deletedIDFieldName: 'questionId'
        }]
}

static fragments = {
     viewer : () => Relay.QL`
         fragment on UserNode {
            id
         }
     `,
     question : () => Relay.QL`
         fragment on Question {
            id
         }
     `
   }

}



export default DeleteQuestionMutation;
