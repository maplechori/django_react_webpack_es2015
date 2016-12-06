import React from 'react'
import Relay from 'react-relay'
import PieChart from 'react-d3-components/lib/PieChart'
import poll from 'relay-decorators/lib/poll';



@poll(2000)
class StatusIndicatorComponent extends React.Component {
        state = { active: false, hideLabels: true, data: true }

        constructor(props) {
          super(props);     
        }




        render() {


          return(<div>

            {this.state.data ?
            <PieChart
                hideLabels={this.state.hideLabels}
                data={{ values: [{x:'a', y: this.props.question.countA},
                                  {x: 'b', y: this.props.question.countB},
                                  {x: 'c', y: this.props.question.countC}]}}
                width={600}
                height={400}
                margin={{top: 10, bottom: 10, left: 100, right: 100}}/>
                : null}
                </div>)
        }
}


const StatusIndicator = Relay.createContainer(StatusIndicatorComponent, {

    fragments: {
      question: () => Relay.QL`
          fragment on Question {
            countA
            countB
            countC
          }
          `
    }

});

export default StatusIndicator;
