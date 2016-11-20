import React from 'react'
import Formsy from 'formsy-react'
import Relay from 'react-relay'
import TextField from 'material-ui/TextField';
import FormsyText from './FormsyText'
import RaisedButton from 'material-ui/RaisedButton'
import styles from './login.css';
import LoginMutation from './Mutations/LoginMutation'


class LoginComponent extends React.Component {
  state = { canSubmit: false }

  constructor(props) {
    console.log(props);
    super(props);
  }


  login (user, model) {
    const self = this;
    model.username = 'mapleman';

    Relay.Store.commitUpdate(
      new LoginMutation({
        email:    model.email,
        password: model.password,
        username: model.username,
        user: user
      }),
      {
        onFailure: (transaction) => {
          console.log('login failed');
          console.log(transaction.getError().source);
          const errorMessage = transaction.getError().source.errors[0].message;
          const formError = {};

          switch (errorMessage) {
            case Errors.WrongEmailOrPassword:
              formError.email = 'Email or password is incorrect';
              formError.password = 'Email or password is incorrect';
              break;
          }

          this.refs.form.updateInputsWithError(formError);
        },
        onSuccess: (response) => {
          console.log("success");
          console.log(response);
          console.log(this.props);
          console.log(this.state);
          self.props.location.state ? self.context.router.push({}, self.props.location.state.previousPath) : self.context.router.goBack();
        }
      }
    );
  }


  render() {
  const submitMargin = {marginTop: 20};


   return (
     <div className={styles.content}>
       <h2>Login</h2>

       <Formsy.Form
         ref="form"
         onSubmit={(model) => this.login(this.props.viewer, model)}
         className={styles.form} >

         <FormsyText
           name="email"
           floatingLabelText="Email"
           fullWidth={true}
         />

         <FormsyText
           name="password"
           type="password"
           floatingLabelText="Password"
           fullWidth={true} />

         <RaisedButton
           type="submit"
           label="Login"
           secondary={true}
           fullWidth={true}
           style={submitMargin} />


       </Formsy.Form>

     </div>
   );
 }
}



const Login = Relay.createContainer(LoginComponent, {

  fragments: {
      viewer: () => Relay.QL`
        fragment on SurveyQuery {
           ${LoginMutation.getFragment('user')}

      }
  `,


  }
});

export default Login;
