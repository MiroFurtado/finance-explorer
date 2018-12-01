import React from 'react';

const GraphDisplay = React.createClass({
  iframe: function (state, page) {
    return {__html: '<iframe frameBorder="0" src="http://127.0.0.1:5000/api/'+state+'/'+page+'" width="1000" height="500"></iframe>'}
  },

  render: function() {
    return (
      <div>
          {this.props.currentGraph}
        <div dangerouslySetInnerHTML={ this.iframe(this.props.state,this.props.graph) } />
      </div>
    );
  }
});


export default GraphDisplay;
