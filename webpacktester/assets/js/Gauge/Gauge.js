import React from 'react'
import ReactDOM from 'react-dom'
import * as d3 from 'd3'


var ArcGauge = require('./ArcGauge');



let Gauge = React.createClass({
  getDefaultProps() {
    return {
      value: 36 ,
      size: 15,
      radius: 85,
      sections: ['#ccc', '#999', '#444'],
      arrow: null,
      label: null,
      legend: null
    }
  },

  propTypes: {
    value: React.PropTypes.number.isRequired,
    sections: React.PropTypes.any,
    size: React.PropTypes.number,
    radius: React.PropTypes.number,
    arrow: React.PropTypes.object,
    label: React.PropTypes.string,
    legend: React.PropTypes.any
  },

  getInitialState() {
    return {
      width: 212
    }
  },

  componentDidMount() {
    this.setState({
      width: ReactDOM.findDOMNode(this).offsetWidth
    })
  },

  componentWillReceiveProps(nextProps) {
    let history = this.state.history || new Array(100).fill(0);

    if (history.length > 100) {
      history.shift();
    }

    history.push(nextProps.value);

    this.setState({
      history: history,
      width: ReactDOM.findDOMNode(this).offsetWidth
    })
  },

  render() {
    let cls = 'gauge';

    return (
        <section className={cls}>
          <ArcGauge value={this.props.value}
                    size={this.props.size}
                    radius={this.props.radius}
                    sections={this.props.sections}
                    arrow={this.props.arrow}
                    label={this.props.label}
                    legend={this.props.legend}
                    width={this.state.width}/>
        </section>
    );
  }
});


module.exports = Gauge;
