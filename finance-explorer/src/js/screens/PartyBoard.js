import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Box from 'grommet/components/Box';
import Paragraph from 'grommet/components/Paragraph';

import Split from 'grommet/components/Split';


//Hacky way to include 
const iframe = '<iframe frameBorder="0" src="../../piv.html" width="900" height="450"></iframe>'; 
const IframeComp = React.createClass({
  iframe: function () {
    return {
      __html: this.props.iframe
    }
  },

  render: function() {
    return (
      <div>
        <div dangerouslySetInnerHTML={ this.iframe() } />
      </div>
    );
  }
});

class PartyBoard extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
          demActive: props.dem,
          repActive: props.rep,
        };
    }

    render () {
      if(this.state.demActive) {
          return (<Box align='center'><IframeComp iframe={iframe} /></Box>);
      }
      if(this.state.repActive) {
      return(<Box align='center'>
        <Paragraph>Republicans are not implemented yet.</Paragraph>  
      </Box>);
      }
    }

}

PartyBoard.defaultProps = {
    error: undefined,
    task: undefined
  };
  
PartyBoard.propTypes = {
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.object,
    match: PropTypes.object.isRequired,
    task: PropTypes.object
  };

export default PartyBoard;
