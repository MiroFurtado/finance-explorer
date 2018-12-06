import React from 'react';

const GraphDisplay = React.createClass({
  iframe: function (state, page,dem) {
    if(dem) return {__html: '<iframe frameBorder="0" src="http://127.0.0.1:8080/api/'+state+'/d/'+page+'" width="1000" height="500"></iframe>'}
    return {__html: '<iframe frameBorder="0" src="http://127.0.0.1:8080/api/'+state+'/r/'+page+'" width="1000" height="500"></iframe>'}
  },

  render: function() {
    return (
      <div>
          {this.props.currentGraph}
        <div dangerouslySetInnerHTML={ this.iframe(this.props.state,this.props.graph,this.props.dem) } />
      </div>
    );
  }
});


export default GraphDisplay;
