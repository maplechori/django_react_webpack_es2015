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

class LoginMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation { loginUser }`;
  }

  static fragments = {
  user: () => Relay.QL`
        fragment on UserNode {
          firstName
          token
          id
        }`
  }


  getVariables () {
    return {
      email: this.props.email,
      password: this.props.password,
      username: this.props.username,
    };
  }

  getFatQuery () {
    console.log('wee');
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
      type: 'REQUIRED_CHILDREN',
      children: [Relay.QL`
        fragment on LoginUserPayload {
         user{  id,
        token
      }
      }`]
    }];
  }


}

export default LoginMutation;
