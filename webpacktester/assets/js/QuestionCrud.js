import React from 'react';
import Formsy from 'formsy-react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';

import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup,
        FormsySelect, FormsyText, FormsyTime, FormsyToggle } from 'formsy-material-ui/lib';


class Question extends React.Component {
    state = {canSubmit: false}

    constructor(props) {
          super(props);
    }

    errorMessages = {
      wordsError: 'Please only use letters',
      numericError: 'Please provide a number',
      urlError: 'Please provide a valid URL'
    }

    styles = {
    paperStyle: {
      width: 300,
      margin: 'auto',
      padding: 20,
    },
    switchStyle: {
      marginBottom: 16,
    },
    submitStyle: {
      marginTop: 32,
    }
  }

    enableButton = () => {
      this.setState({canSubmit: true});
    }

    disableButton = () => {
      this.setState({canSubmit: true});
    }

    updateButton() {

    }

    submitForm(data) {
      alert(JSON.stringify(data, null, 4));
    }


    render() {
      let {paperStyle, switchStyle, submitStyle } = this.styles;

      let { wordsError, numericError, urlError } = this.errorMessages;

   return (

     <MuiThemeProvider muiTheme={getMuiTheme()}>
       <Paper style={paperStyle}>
         <Formsy.Form
           onValid={this.enableButton}
           onInvalid={this.disableButton}
           onValidSubmit={this.submitForm}
           onInvalidSubmit={this.notifyFormError}
         >

           <FormsyText
             name="name"
             validations="isWords"
             validationError={wordsError}
             required
             hintText="Quetion name"
             floatingLabelText="Question name"
           />
           <FormsyText
             name="question_text"
             validations="isWords"
             validationError={wordsError}
             hintText="question text"
             floatingLabelText="Text of the question"
           />
           <FormsySelect
             name="question_type"
             required
             floatingLabelText="Question Type"
           >
             <MenuItem value={'NI'} primaryText="No Input" />
             <MenuItem value={'ST'} primaryText="String" />
             <MenuItem value={'RA'} primaryText="Radios" />
             <MenuItem value={'DD'} primaryText="Drop down" />
             <MenuItem value={'CK'} primaryText="Multiple Selection" />

           </FormsySelect>

           <FormsyText
             name="data_label"
             validations="isWords"
             validationError={wordsError}
             required
             hintText="datafile label"
             floatingLabelText="Datafile label"
             updateImmediately
           />
           <RaisedButton
             style={submitStyle}
             type="submit"
             label="Submit"
             disabled={!this.state.canSubmit}
           />
         </Formsy.Form>
       </Paper>
     </MuiThemeProvider>
   );
 }
}


export default Question;
