import Relay from 'react-relay';

class LoginMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation { loginUser }`;
  }

  static fragments = {
  user: () => Relay.QL`
        fragment on UserViewer {
          firstName
          token
          id
        }`,

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
          username
          email
          questions
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
         user {
           id,
        token,
        username,
        email,
         
        }
      }`]
    }];
  }


}

export default LoginMutation;
