import Relay from 'react-relay';

  {/*


    mutation loginUser {
      loginUser(input: { username: "mapleman", email: "maplechori@gmail.com", password:"f0ckf0ck"}) {
         user {
           id
          token
         }
        ok
        clientMutationId

      }
    }


  */}

export default class LoginMutation extends Relay.Mutation {

  getMutation () {
    this.props.user = null;
    return Relay.QL`mutation { loginUser }`;
  }

  getVariables () {
    return {
      email: this.props.email,
      password: this.props.password,
      username: this.props.username,
    };
  }

  getFatQuery () {
    return Relay.QL`
      fragment on LoginUserPayload {
        user {
          id,
          token,
        }
        ok
      }
    `;
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.user.id
      }
    }];
  }

  static fragments = {
  user: () => Relay.QL`
        fragment on UserNode {
          id,

        }
   `}


}
