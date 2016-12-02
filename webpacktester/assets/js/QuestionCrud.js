import React from 'react';
import Relay from 'react-relay'
import Formsy from 'formsy-react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import PieChart from 'react-d3-components/lib/PieChart'
import AddQuestionMutation from './Mutations/AddQuestionMutation'

import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup,
        FormsySelect, FormsyText, FormsyTime, FormsyToggle } from 'formsy-material-ui/lib';


class QuestionComponent extends React.Component {
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

    submitForm(viewer, data) {
      console.log(data);

      Relay.Store.commitUpdate(
        new AddQuestionMutation({
          question: viewer,
          name: data.name,
          questionType: data.question_type,
          questionText: data.question_text,
          dataLabel: data.data_label
        }))

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
           onValidSubmit={(data) => this.submitForm(this.props.viewer, data)}
           onInvalidSubmit={this.notifyFormError}
         >
           <FormsyText
             name="name"
             validations="isWords"
             validationError={wordsError}
             required
             hintText="Question name"
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
           {
             (this.props.types.enumValues.map((n, i) => (
                    <MenuItem key={i} value={n.name.substring(2)} primaryText={n.description}/>
                  )))
           }

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


export default Relay.createContainer(QuestionComponent, {

  fragments: {

       }
});
