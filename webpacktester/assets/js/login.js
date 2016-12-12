import React from 'react'
import Formsy from 'formsy-react'
import Relay from 'react-relay'
import TextField from 'material-ui/TextField';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import RaisedButton from 'material-ui/RaisedButton'
import styles from './theme/login.css';
import LoginMutation from './Mutations/LoginMutation'
import { IndexRoute, Route, Router, applyRouterMiddleware, browserHistory, Link } from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin';
import {indigo500, indigo700, redA200} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: indigo500,
        primary2Color: indigo700,
        accent1Color: redA200,
        pickerHeaderColor: indigo500,
    },
});


injectTapEventPlugin();

class LoginComponent extends React.Component {
  state = { canSubmit: false }

  constructor(props) {
    super(props);
  }

  login (user, model) {
    const self = this;

    Relay.Store.commitUpdate(
      new LoginMutation({
        email:    model.email,
        password: model.password,
        username: model.username,
        user: user
      }),
      {
        onFailure: (transaction) => {
          console.log('login failed', transaction);
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

          if(response.loginUser.user != null)
          {
            localStorage.token = response.loginUser.user.token;
          }
            browserHistory.push("/");
        }
      }
    );
  }


  render() {
  const submitMargin = {marginTop: 20};

   return (
      <div>
      <MuiThemeProvider muiTheme={muiTheme}>
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
       </MuiThemeProvider>
     </div>
   );
 }
}



const Login = Relay.createContainer(LoginComponent, {

  fragments: {
      viewer:  () => Relay.QL`
        fragment on UserViewer {
           ${LoginMutation.getFragment('user')}
      }
  `,


  }
});

export default Login;
